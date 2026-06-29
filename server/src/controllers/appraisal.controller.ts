import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getAppraisals = async (req: Request, res: Response) => {
  const { unitCode, periodId, status } = req.query;

  try {
    const filters: any = {};
    if (unitCode) filters.unitCode = unitCode as string;
    if (periodId) filters.periodId = periodId as string;
    if (status) filters.status = status as string;

    const appraisals = await prisma.ntmAppraisal.findMany({
      where: filters,
      include: {
        unit: true,
        period: true,
        appraiser: {
          select: { id: true, username: true, fullName: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return res.json(appraisals);
  } catch (error: any) {
    console.error('[Appraisal Controller] Error fetching appraisals: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách hồ sơ xét duyệt NTM', error: error.message });
  }
};

export const getAppraisalById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const appraisal = await prisma.ntmAppraisal.findUnique({
      where: { id },
      include: {
        unit: true,
        period: true,
        appraiser: {
          select: { id: true, username: true, fullName: true }
        }
      }
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ xét duyệt NTM' });
    }

    return res.json(appraisal);
  } catch (error: any) {
    console.error('[Appraisal Controller] Error fetching appraisal by id: ', error);
    return res.status(500).json({ message: 'Lỗi lấy chi tiết hồ sơ xét duyệt', error: error.message });
  }
};

export const createAppraisal = async (req: Request, res: Response) => {
  const { unitCode, periodId, targetType, status, councilVoteRatio, citizenSatisfactionRatio, councilMeetingDate, comment } = req.body;

  if (!unitCode || !periodId || !targetType) {
    return res.status(400).json({ message: 'Vui lòng điền các thông tin bắt buộc (Đơn vị, Đợt, Phân loại)' });
  }

  try {
    const newAppraisal = await prisma.ntmAppraisal.create({
      data: {
        unitCode,
        periodId,
        appraiserId: req.user!.id,
        targetType,
        status: status || 'PENDING',
        councilVoteRatio: councilVoteRatio ? parseFloat(councilVoteRatio) : null,
        citizenSatisfactionRatio: citizenSatisfactionRatio ? parseFloat(citizenSatisfactionRatio) : null,
        councilMeetingDate: councilMeetingDate ? new Date(councilMeetingDate) : null,
        comment
      },
      include: { unit: true }
    });

    return res.status(201).json(newAppraisal);
  } catch (error: any) {
    console.error('[Appraisal Controller] Error creating appraisal: ', error);
    return res.status(500).json({ message: 'Lỗi khởi tạo hồ sơ xét duyệt', error: error.message });
  }
};

export const updateAppraisal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    status, 
    decisionNumber, 
    decisionDate, 
    approverName, 
    councilVoteRatio, 
    citizenSatisfactionRatio, 
    councilMeetingDate, 
    comment 
  } = req.body;

  try {
    // 1. Fetch appraisal
    const appraisal = await prisma.ntmAppraisal.findUnique({
      where: { id },
      include: { unit: true }
    });

    if (!appraisal) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ xét duyệt NTM' });
    }

    const updatedData: any = {};
    if (status !== undefined) updatedData.status = status;
    if (decisionNumber !== undefined) updatedData.decisionNumber = decisionNumber;
    if (decisionDate !== undefined) updatedData.decisionDate = decisionDate ? new Date(decisionDate) : null;
    if (approverName !== undefined) updatedData.approverName = approverName;
    if (councilVoteRatio !== undefined) updatedData.councilVoteRatio = councilVoteRatio ? parseFloat(councilVoteRatio) : null;
    if (citizenSatisfactionRatio !== undefined) updatedData.citizenSatisfactionRatio = citizenSatisfactionRatio ? parseFloat(citizenSatisfactionRatio) : null;
    if (councilMeetingDate !== undefined) updatedData.councilMeetingDate = councilMeetingDate ? new Date(councilMeetingDate) : null;
    if (comment !== undefined) updatedData.comment = comment;

    // 2. Perform updates
    const updatedAppraisal = await prisma.ntmAppraisal.update({
      where: { id },
      data: updatedData
    });

    // 3. If standard/nâng cao is APPROVED, officially update the Unit NTM state
    if (status === 'APPROVED') {
      let ntmStatus = 'NONE';
      if (appraisal.targetType === 'COMMUNE_NTM_STANDARD') {
        ntmStatus = 'NTM_STANDARD';
      } else if (appraisal.targetType === 'COMMUNE_NTM_MODERN') {
        ntmStatus = 'NTM_MODERN';
      } else if (appraisal.targetType === 'PROVINCE_COMPLETED') {
        ntmStatus = 'PROVINCE_COMPLETED';
      }

      await prisma.unit.update({
        where: { code: appraisal.unitCode },
        data: {
          ntmStatus,
          ntmApprovedAt: decisionDate ? new Date(decisionDate) : new Date()
        }
      });
    }

    return res.json({
      message: 'Cập nhật hồ sơ xét duyệt NTM thành công',
      appraisal: updatedAppraisal
    });
  } catch (error: any) {
    console.error('[Appraisal Controller] Error updating appraisal: ', error);
    return res.status(500).json({ message: 'Lỗi cập nhật hồ sơ xét duyệt', error: error.message });
  }
};
