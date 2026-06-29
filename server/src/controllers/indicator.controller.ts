import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getIndicatorsDictionary = async (req: Request, res: Response) => {
  const { section } = req.query;

  try {
    const filters: any = {};
    if (section) {
      filters.section = section as string;
    }

    const dict = await prisma.ntmIndicatorDictionary.findMany({
      where: filters,
      orderBy: { code: 'asc' }
    });

    return res.json(dict);
  } catch (error: any) {
    console.error('[Indicator Controller] Error getting dictionary: ', error);
    return res.status(500).json({ message: 'Lỗi lấy từ điển chỉ số', error: error.message });
  }
};

export const getIndicatorValues = async (req: Request, res: Response) => {
  const { unitCode, periodId, year, section } = req.query;

  try {
    const filters: any = {};
    if (unitCode) filters.unitCode = unitCode as string;
    if (periodId) filters.periodId = periodId as string;
    if (year) filters.year = parseInt(year as string);

    if (section) {
      filters.indicator = {
        section: section as string
      };
    }

    const values = await prisma.ntmIndicatorValue.findMany({
      where: filters,
      include: {
        indicator: true,
        unit: true
      },
      orderBy: { indicator: { code: 'asc' } }
    });

    return res.json(values);
  } catch (error: any) {
    console.error('[Indicator Controller] Error getting values: ', error);
    return res.status(500).json({ message: 'Lỗi lấy số liệu chỉ số', error: error.message });
  }
};

export const saveIndicatorValue = async (req: Request, res: Response) => {
  const { indicatorId, unitCode, periodId, year, targetValue, actualValue } = req.body;

  if (!indicatorId || !unitCode || !periodId || !year) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ: ID chỉ số, Đơn vị, Kỳ báo cáo, Năm' });
  }

  try {
    const value = await prisma.ntmIndicatorValue.upsert({
      where: {
        indicatorId_unitCode_periodId_year: {
          indicatorId: parseInt(indicatorId),
          unitCode,
          periodId,
          year: parseInt(year)
        }
      },
      update: {
        targetValue: targetValue !== undefined ? parseFloat(targetValue) : null,
        actualValue: actualValue !== undefined ? parseFloat(actualValue) : null,
        updatedAt: new Date()
      },
      create: {
        indicatorId: parseInt(indicatorId),
        unitCode,
        periodId,
        year: parseInt(year),
        targetValue: targetValue !== undefined ? parseFloat(targetValue) : null,
        actualValue: actualValue !== undefined ? parseFloat(actualValue) : null
      }
    });

    return res.json({
      message: 'Cập nhật giá trị chỉ số thành công',
      value
    });
  } catch (error: any) {
    console.error('[Indicator Controller] Error saving indicator value: ', error);
    return res.status(500).json({ message: 'Lỗi lưu giá trị chỉ số', error: error.message });
  }
};
