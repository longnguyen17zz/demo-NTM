import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getUnits = async (req: Request, res: Response) => {
  const { level, parentCode } = req.query;

  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng yêu cầu' });
  }

  const requesterRole = req.user.role;
  const requesterUnitCode = req.user.unitCode;

  try {
    const filters: any = {};
    if (level) {
      filters.level = level as string;
    }
    if (parentCode) {
      filters.parentCode = parentCode as string;
    }

    if (requesterRole === 'APPRAISER') {
      // APPRAISER can only see their own province and communes under it
      const conditions = [
        { level: 'COMMUNE', parentCode: requesterUnitCode },
        { level: 'PROVINCE', code: requesterUnitCode }
      ];
      
      if (level) {
        filters.OR = conditions.filter(c => c.level === level);
      } else {
        filters.OR = conditions;
      }

      // If parentCode is requested, ensure it matches the requester's unitCode
      if (parentCode && parentCode !== requesterUnitCode) {
        return res.json([]); // requested a parent they don't have access to
      }
    } else if (requesterRole === 'EDITOR') {
      // EDITOR can only see their own commune
      filters.code = requesterUnitCode;
      filters.level = 'COMMUNE';
    }

    const units = await prisma.unit.findMany({
      where: filters,
      orderBy: { name: 'asc' }
    });

    return res.json(units);
  } catch (error: any) {
    console.error('[Unit Controller] Error fetching units: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách đơn vị', error: error.message });
  }
};

export const updateUnitStatus = async (req: Request, res: Response) => {
  const { code } = req.params;
  const { ntmStatus, ntmApprovedAt } = req.body;

  try {
    const updated = await prisma.unit.update({
      where: { code },
      data: {
        ntmStatus,
        ntmApprovedAt: ntmApprovedAt ? new Date(ntmApprovedAt) : null
      }
    });

    return res.json(updated);
  } catch (error: any) {
    console.error('[Unit Controller] Error updating unit: ', error);
    return res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn vị', error: error.message });
  }
};

// Create or update a unit (Upsert)
export const saveUnit = async (req: Request, res: Response) => {
  const { code, name, level, parentCode, communeGroup } = req.body;

  if (!code || !name || !level) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin mã, tên và cấp đơn vị' });
  }

  try {
    const unit = await prisma.unit.upsert({
      where: { code },
      update: {
        name,
        level,
        parentCode: parentCode || null,
        communeGroup: communeGroup || null
      },
      create: {
        code,
        name,
        level,
        parentCode: parentCode || null,
        communeGroup: communeGroup || null
      }
    });

    return res.json({
      message: 'Đã lưu đơn vị hành chính thành công',
      unit
    });
  } catch (error: any) {
    console.error('[Unit Controller] Error saving unit: ', error);
    return res.status(500).json({ message: 'Lỗi lưu đơn vị hành chính', error: error.message });
  }
};

// Delete a unit
export const deleteUnit = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const unit = await prisma.unit.findUnique({ where: { code } });
    if (!unit) {
      return res.status(404).json({ message: 'Không tìm thấy đơn vị hành chính cần xóa' });
    }

    // Check if there are users referencing this unit
    const usersCount = await prisma.user.count({ where: { unitCode: code } });
    if (usersCount > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa đơn vị hành chính vì đang có ${usersCount} tài khoản người dùng trực thuộc.` 
      });
    }

    // Check if there are submissions referencing this unit
    const submissionsCount = await prisma.formSubmission.count({ where: { unitCode: code } });
    if (submissionsCount > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa đơn vị hành chính vì đã có ${submissionsCount} hồ sơ báo cáo liên kết dữ liệu.` 
      });
    }

    await prisma.unit.delete({ where: { code } });

    return res.json({ message: `Đã xóa đơn vị hành chính ${code} thành công` });
  } catch (error: any) {
    console.error('[Unit Controller] Error deleting unit: ', error);
    return res.status(500).json({ message: 'Lỗi xóa đơn vị hành chính', error: error.message });
  }
};

// Batch import units
export const importUnitsBatch = async (req: Request, res: Response) => {
  const { units } = req.body;

  if (!units || !Array.isArray(units) || units.length === 0) {
    return res.status(400).json({ message: 'Danh sách đơn vị hành chính không hợp lệ hoặc rỗng' });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng yêu cầu' });
  }

  const requesterRole = req.user.role;
  const requesterUnitCode = req.user.unitCode;

  if (requesterRole === 'EDITOR') {
    return res.status(403).json({ message: 'Tài khoản Cấp Xã không được quyền đồng bộ đơn vị hành chính' });
  }

  try {
    const results = [];
    for (const item of units) {
      const { code, name, level, parentCode, communeGroup } = item;
      if (!code || !name || !level) {
        continue;
      }

      // Enforce role-based import security checks
      if (requesterRole === 'APPRAISER') {
        if (level !== 'COMMUNE') {
          continue; // appraiser can only import communes
        }
        if (parentCode !== requesterUnitCode) {
          continue; // appraiser can only import communes under their province
        }
      }

      const unit = await prisma.unit.upsert({
        where: { code: String(code).trim() },
        update: {
          name: String(name).trim(),
          level: String(level).trim(),
          parentCode: parentCode ? String(parentCode).trim() : null,
          communeGroup: communeGroup ? String(communeGroup).trim() : null
        },
        create: {
          code: String(code).trim(),
          name: String(name).trim(),
          level: String(level).trim(),
          parentCode: parentCode ? String(parentCode).trim() : null,
          communeGroup: communeGroup ? String(communeGroup).trim() : null
        }
      });
      results.push(unit);
    }

    return res.json({
      message: `Đồng bộ thành công ${results.length} đơn vị hành chính.`,
      count: results.length,
      units: results
    });
  } catch (error: any) {
    console.error('[Unit Controller] Error importing batch units: ', error);
    return res.status(500).json({ message: 'Lỗi đồng bộ danh sách đơn vị hành chính', error: error.message });
  }
};

