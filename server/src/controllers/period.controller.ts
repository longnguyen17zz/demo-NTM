import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getPeriods = async (req: Request, res: Response) => {
  try {
    const periods = await prisma.period.findMany({
      orderBy: { deadline: 'desc' }
    });
    return res.json(periods);
  } catch (error: any) {
    console.error('[Period Controller] Error fetching periods: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách đợt báo cáo', error: error.message });
  }
};

export const createPeriod = async (req: Request, res: Response) => {
  const { id, name, year, term, deadline } = req.body;

  if (!id || !name || !year || !term || !deadline) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đợt báo cáo' });
  }

  try {
    const existing = await prisma.period.findUnique({ where: { id } });
    if (existing) {
      return res.status(400).json({ message: 'Mã đợt báo cáo đã tồn tại' });
    }

    const newPeriod = await prisma.period.create({
      data: {
        id,
        name,
        year: parseInt(year),
        term,
        deadline: new Date(deadline),
        status: 'ACTIVE'
      }
    });

    return res.status(201).json(newPeriod);
  } catch (error: any) {
    console.error('[Period Controller] Error creating period: ', error);
    return res.status(500).json({ message: 'Lỗi tạo đợt báo cáo', error: error.message });
  }
};

export const updatePeriodStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'ACTIVE' && status !== 'LOCKED') {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const updated = await prisma.period.update({
      where: { id },
      data: { status }
    });
    return res.json(updated);
  } catch (error: any) {
    console.error('[Period Controller] Error updating period status: ', error);
    return res.status(500).json({ message: 'Lỗi cập nhật trạng thái đợt báo cáo', error: error.message });
  }
};
