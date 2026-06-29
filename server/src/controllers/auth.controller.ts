import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'he-thong-ntm-monitoring-supervision-jwt-secret-key-2026';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { unit: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
      unitCode: user.unitCode,
      permissions: user.permissions
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        unitCode: user.unitCode,
        unit: user.unit,
        permissions: user.permissions
      }
    });
  } catch (error: any) {
    console.error('[Auth Controller] Error during login: ', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { unit: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    return res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      unitCode: user.unitCode,
      unit: user.unit,
      permissions: user.permissions
    });
  } catch (error: any) {
    console.error('[Auth Controller] Error fetching me: ', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password, fullName, role, department, unitCode, permissions } = req.body;

  if (!username || !password || !fullName || !role) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng yêu cầu' });
  }

  const requesterRole = req.user.role;
  const requesterUnitCode = req.user.unitCode;

  // 1. EDITOR is not allowed to register users
  if (requesterRole === 'EDITOR') {
    return res.status(403).json({ message: 'Tài khoản Cấp Xã không có quyền tạo tài khoản mới' });
  }

  try {
    // 2. APPRAISER (Province) is only allowed to register EDITOR (Commune) accounts under their province
    if (requesterRole === 'APPRAISER') {
      if (role !== 'EDITOR') {
        return res.status(403).json({ message: 'Tài khoản Cấp Tỉnh chỉ có quyền tạo tài khoản Cấp Xã (EDITOR)' });
      }
      if (!unitCode) {
        return res.status(400).json({ message: 'Đơn vị hành chính của tài khoản Cấp Xã là bắt buộc' });
      }
      const unit = await prisma.unit.findUnique({ where: { code: unitCode } });
      if (!unit || unit.level !== 'COMMUNE' || unit.parentCode !== requesterUnitCode) {
        return res.status(403).json({ message: 'Đơn vị hành chính được gán không trực thuộc tỉnh của bạn' });
      }
    }

    // 3. SUPERVISOR (Ministry) is allowed to register any user, but check unit levels
    if (requesterRole === 'SUPERVISOR') {
      if (role === 'APPRAISER') {
        const unit = await prisma.unit.findUnique({ where: { code: unitCode } });
        if (!unit || unit.level !== 'PROVINCE') {
          return res.status(400).json({ message: 'Tài khoản Cấp Tỉnh phải được gán cho đơn vị cấp Tỉnh (PROVINCE)' });
        }
      } else if (role === 'EDITOR') {
        const unit = await prisma.unit.findUnique({ where: { code: unitCode } });
        if (!unit || unit.level !== 'COMMUNE') {
          return res.status(400).json({ message: 'Tài khoản Cấp Xã phải được gán cho đơn vị cấp Xã (COMMUNE)' });
        }
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        fullName,
        role,
        department,
        unitCode,
        permissions: permissions || []
      },
      include: { unit: true }
    });

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        unitCode: user.unitCode,
        unit: user.unit,
        permissions: user.permissions
      }
    });
  } catch (error: any) {
    console.error('[Auth Controller] Error during register: ', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Get list of all users with role-based filtering
export const getUsers = async (req: Request, res: Response) => {
  try {
    const filters: any = {};

    // Role-based visibility logic
    if (req.user?.role === 'APPRAISER') {
      // Province appraiser: only see Commune (EDITOR) accounts
      filters.role = 'EDITOR';
      // Only see communes within their own province
      if (req.user.unitCode) {
        filters.unit = {
          parentCode: req.user.unitCode
        };
      }
    } else if (req.user?.role === 'EDITOR') {
      // Commune editor: only see accounts from their own commune unit
      filters.role = 'EDITOR';
      if (req.user.unitCode) {
        filters.unitCode = req.user.unitCode;
      }
    }
    // SUPERVISOR (Ministry): no filters, sees all users (Ministry, Province, Commune)

    const users = await prisma.user.findMany({
      where: filters,
      include: { unit: true },
      orderBy: { createdAt: 'desc' }
    });

    // Strip password hashes
    const safeUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      department: u.department,
      unitCode: u.unitCode,
      unit: u.unit,
      permissions: u.permissions
    }));

    return res.json(safeUsers);
  } catch (error: any) {
    console.error('[Auth Controller] Error fetching users: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách tài khoản', error: error.message });
  }
};

// Update a user account
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, fullName, role, department, unitCode, permissions } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng yêu cầu' });
  }

  const requesterRole = req.user.role;
  const requesterUnitCode = req.user.unitCode;
  const requesterId = req.user.id;

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
      include: { unit: true }
    });
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản cần chỉnh sửa' });
    }

    // Role-based editing rules:
    if (requesterRole === 'EDITOR') {
      // Commune editor: can only update themselves, and cannot change role or unitCode
      if (requesterId !== id) {
        return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa tài khoản của người khác' });
      }
      if (role && role !== userToUpdate.role) {
        return res.status(403).json({ message: 'Bạn không được phép thay đổi vai trò của mình' });
      }
      if (unitCode && unitCode !== userToUpdate.unitCode) {
        return res.status(403).json({ message: 'Bạn không được phép thay đổi đơn vị hành chính của mình' });
      }
    } else if (requesterRole === 'APPRAISER') {
      if (requesterId === id) {
        // Appraiser editing themselves: cannot change role or unitCode
        if (role && role !== userToUpdate.role) {
          return res.status(403).json({ message: 'Bạn không được phép thay đổi vai trò của mình' });
        }
        if (unitCode && unitCode !== userToUpdate.unitCode) {
          return res.status(403).json({ message: 'Bạn không được phép thay đổi đơn vị hành chính của mình' });
        }
      } else {
        // Appraiser editing someone else:
        // 1. The target user must be EDITOR
        if (userToUpdate.role !== 'EDITOR') {
          return res.status(403).json({ message: 'Bạn chỉ được phép chỉnh sửa tài khoản vai trò Cấp Xã (EDITOR)' });
        }
        // 2. The target user's unit must be under the appraiser's province
        if (userToUpdate.unit?.parentCode !== requesterUnitCode) {
          return res.status(403).json({ message: 'Tài khoản cần chỉnh sửa không trực thuộc tỉnh của bạn' });
        }
        // 3. The updated role must still be EDITOR
        if (role && role !== 'EDITOR') {
          return res.status(403).json({ message: 'Bạn chỉ được phép gán vai trò Cấp Xã (EDITOR) cho tài khoản này' });
        }
        // 4. The updated unitCode must be a commune under the appraiser's province
        if (unitCode && unitCode !== userToUpdate.unitCode) {
          const targetUnit = await prisma.unit.findUnique({ where: { code: unitCode } });
          if (!targetUnit || targetUnit.level !== 'COMMUNE' || targetUnit.parentCode !== requesterUnitCode) {
            return res.status(403).json({ message: 'Đơn vị hành chính mới được gán không trực thuộc tỉnh của bạn' });
          }
        }
      }
    } else if (requesterRole === 'SUPERVISOR') {
      // Supervisor check unit level if role changes
      if (role === 'APPRAISER' && unitCode) {
        const unit = await prisma.unit.findUnique({ where: { code: unitCode } });
        if (!unit || unit.level !== 'PROVINCE') {
          return res.status(400).json({ message: 'Tài khoản Cấp Tỉnh phải được gán cho đơn vị cấp Tỉnh (PROVINCE)' });
        }
      } else if (role === 'EDITOR' && unitCode) {
        const unit = await prisma.unit.findUnique({ where: { code: unitCode } });
        if (!unit || unit.level !== 'COMMUNE') {
          return res.status(400).json({ message: 'Tài khoản Cấp Xã phải được gán cho đơn vị cấp Xã (COMMUNE)' });
        }
      }
    }

    const data: any = {
      fullName,
      role,
      department,
      unitCode,
      permissions: permissions || []
    };

    if (password && password.trim()) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      include: { unit: true }
    });

    return res.json({
      message: 'Cập nhật tài khoản thành công',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        department: updatedUser.department,
        unitCode: updatedUser.unitCode,
        unit: updatedUser.unit,
        permissions: updatedUser.permissions
      }
    });
  } catch (error: any) {
    console.error('[Auth Controller] Error updating user: ', error);
    return res.status(500).json({ message: 'Lỗi chỉnh sửa tài khoản', error: error.message });
  }
};

// Delete a user account
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng yêu cầu' });
  }

  const requesterRole = req.user.role;
  const requesterUnitCode = req.user.unitCode;

  try {
    const user = await prisma.user.findUnique({ 
      where: { id },
      include: { unit: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa' });
    }

    // Do not allow deleting themselves
    if (req.user?.id === id) {
      return res.status(400).json({ message: 'Bạn không thể tự xóa tài khoản của chính mình' });
    }

    // Role-based deleting rules
    if (requesterRole === 'EDITOR') {
      return res.status(403).json({ message: 'Tài khoản Cấp Xã không có quyền xóa tài khoản' });
    } else if (requesterRole === 'APPRAISER') {
      // Appraiser can only delete EDITOR accounts under their province
      if (user.role !== 'EDITOR') {
        return res.status(403).json({ message: 'Tài khoản Cấp Tỉnh chỉ có quyền xóa tài khoản Cấp Xã (EDITOR)' });
      }
      if (user.unit?.parentCode !== requesterUnitCode) {
        return res.status(403).json({ message: 'Tài khoản cần xóa không trực thuộc tỉnh của bạn' });
      }
    }

    await prisma.user.delete({ where: { id } });

    return res.json({ message: 'Đã xóa tài khoản thành công' });
  } catch (error: any) {
    console.error('[Auth Controller] Error deleting user: ', error);
    return res.status(500).json({ message: 'Lỗi xóa tài khoản', error: error.message });
  }
};
