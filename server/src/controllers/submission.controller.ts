import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { runETLProcess } from '../services/etl.service.js';

// Get all form templates available
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.formTemplate.findMany();
    return res.json(templates);
  } catch (error: any) {
    console.error('[Submission Controller] Error getting templates: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách biểu mẫu cấu hình', error: error.message });
  }
};

// Get a single template config
export const getTemplateByCode = async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const template = await prisma.formTemplate.findUnique({
      where: { code }
    });
    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy cấu hình biểu mẫu ' + code });
    }
    return res.json(template);
  } catch (error: any) {
    console.error('[Submission Controller] Error getting template: ', error);
    return res.status(500).json({ message: 'Lỗi lấy cấu hình biểu mẫu', error: error.message });
  }
};

// Query list of submissions with filters
export const getSubmissions = async (req: Request, res: Response) => {
  const { periodId, formCode, unitCode, status } = req.query;

  try {
    const filters: any = {};
    if (periodId) filters.periodId = periodId as string;
    if (formCode) filters.formCode = formCode as string;
    if (status) filters.status = status as string;

    // Multi-tenant check: EDITOR role can only query their own unit code.
    if (req.user?.role === 'EDITOR') {
      filters.unitCode = req.user.unitCode;
    } else if (unitCode) {
      filters.unitCode = unitCode as string;
    }

    const submissions = await prisma.formSubmission.findMany({
      where: filters,
      include: {
        period: true,
        unit: true,
        editor: {
          select: { id: true, username: true, fullName: true }
        },
        proofFiles: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    return res.json(submissions);
  } catch (error: any) {
    console.error('[Submission Controller] Error fetching submissions: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách báo cáo', error: error.message });
  }
};

// View detailed submission data
export const getSubmissionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        period: true,
        unit: true,
        editor: {
          select: { id: true, username: true, fullName: true }
        },
        proofFiles: true,
        appraisalLogs: {
          include: { appraiser: { select: { fullName: true, department: true } } },
          orderBy: { updatedAt: 'desc' }
        },
        supervisionLogs: {
          include: { supervisor: { select: { fullName: true, department: true } } },
          orderBy: { updatedAt: 'desc' }
        }
      }
    });

    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ báo cáo' });
    }

    // Role check: EDITOR can only see their own unit's reports
    if (req.user?.role === 'EDITOR' && submission.unitCode !== req.user.unitCode) {
      return res.status(403).json({ message: 'Bạn không có quyền xem hồ sơ báo cáo này' });
    }

    return res.json(submission);
  } catch (error: any) {
    console.error('[Submission Controller] Error fetching submission detail: ', error);
    return res.status(500).json({ message: 'Lỗi lấy chi tiết báo cáo', error: error.message });
  }
};

// Create or update a submission (Upsert)
export const saveSubmission = async (req: Request, res: Response) => {
  const { periodId, formCode, unitCode, data, status } = req.body;

  if (!periodId || !formCode || !unitCode || !data) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin báo cáo' });
  }

  // Permission check: EDITOR can only edit for their own unit
  if (req.user?.role === 'EDITOR' && unitCode !== req.user.unitCode) {
    return res.status(403).json({ message: 'Bạn chỉ được phép nộp báo cáo cho đơn vị của mình' });
  }

  try {
    // Check if period is active (not locked)
    const period = await prisma.period.findUnique({ where: { id: periodId } });
    if (!period) {
      return res.status(404).json({ message: 'Không tìm thấy đợt báo cáo' });
    }
    if (period.status === 'LOCKED') {
      return res.status(400).json({ message: 'Đợt báo cáo này đã bị khóa, không thể chỉnh sửa số liệu' });
    }

    // Check if user has template
    const template = await prisma.formTemplate.findUnique({ where: { code: formCode } });
    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu báo cáo ' + formCode });
    }

    // Upsert the form submission
    const submission = await prisma.formSubmission.upsert({
      where: {
        periodId_formCode_unitCode: {
          periodId,
          formCode,
          unitCode
        }
      },
      update: {
        data,
        status: status || 'DRAFT',
        editorId: req.user?.id,
        updatedAt: new Date()
      },
      create: {
        periodId,
        formCode,
        unitCode,
        data,
        status: status || 'DRAFT',
        editorId: req.user?.id
      }
    });

    return res.json({
      message: status === 'SUBMITTED' ? 'Đã gửi báo cáo thành công' : 'Đã lưu nháp báo cáo thành công',
      submission
    });
  } catch (error: any) {
    console.error('[Submission Controller] Error saving submission: ', error);
    return res.status(500).json({ message: 'Lỗi lưu thông tin báo cáo', error: error.message });
  }
};

// Province Appraisal (APPROVED / REJECTED)
export const appraiseSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision, comment } = req.body;

  if (decision !== 'APPROVED' && decision !== 'REJECTED') {
    return res.status(400).json({ message: 'Quyết định thẩm định phải là APPROVED hoặc REJECTED' });
  }

  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: { period: true }
    });

    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ báo cáo để thẩm định' });
    }

    if (submission.period.status === 'LOCKED') {
      return res.status(400).json({ message: 'Đợt báo cáo đã bị khóa, không thể thay đổi trạng thái thẩm định' });
    }

    // Update submission status
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id },
      data: { status: decision }
    });

    // Create appraisal log entry
    await prisma.appraisalLog.create({
      data: {
        submissionId: id,
        appraiserId: req.user!.id,
        decision,
        comment
      }
    });

    // Run ETL Process to transform data to QD25 tables if APPROVED
    if (decision === 'APPROVED') {
      try {
        await runETLProcess(id);
      } catch (etlError) {
        console.error('[Submission Controller] ETL failed post-approval, but status was updated: ', etlError);
        // We keep the approval but log the ETL error
      }
    }

    return res.json({
      message: `Đã ${decision === 'APPROVED' ? 'phê duyệt' : 'trả lại yêu cầu sửa đổi'} hồ sơ thành công.`,
      submission: updatedSubmission
    });
  } catch (error: any) {
    console.error('[Submission Controller] Error during appraisal: ', error);
    return res.status(500).json({ message: 'Lỗi thẩm định báo cáo', error: error.message });
  }
};

// Ministry Supervision (SUPERVISED)
export const superviseSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { complianceLevel, comment } = req.body;

  if (!complianceLevel) {
    return res.status(400).json({ message: 'Vui lòng cung cấp mức độ tuân thủ' });
  }

  try {
    const submission = await prisma.formSubmission.findUnique({ where: { id } });
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ báo cáo để giám sát' });
    }

    // Update submission status
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id },
      data: { status: 'SUPERVISED' }
    });

    // Create supervision log entry
    await prisma.supervisionLog.create({
      data: {
        submissionId: id,
        supervisorId: req.user!.id,
        complianceLevel,
        comment
      }
    });

    return res.json({
      message: 'Đã hoàn thành đánh giá giám sát từ cấp Trung ương',
      submission: updatedSubmission
    });
  } catch (error: any) {
    console.error('[Submission Controller] Error during supervision: ', error);
    return res.status(500).json({ message: 'Lỗi giám sát báo cáo', error: error.message });
  }
};

// Upload proof file attachment
export const addProofFile = async (req: Request, res: Response) => {
  const { id } = req.params; // Submission ID
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Không tìm thấy file để upload' });
  }

  try {
    const submission = await prisma.formSubmission.findUnique({ where: { id } });
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ báo cáo' });
    }

    const proof = await prisma.proofFile.create({
      data: {
        submissionId: id,
        name: file.originalname,
        size: file.size,
        path: `/uploads/${file.filename}` // Relative path client can use to download
      }
    });

    return res.json({
      message: 'Tải tài liệu minh chứng lên thành công',
      proof
    });
  } catch (error: any) {
    console.error('[Submission Controller] Error uploading proof file: ', error);
    return res.status(500).json({ message: 'Lỗi đính kèm tài liệu minh chứng', error: error.message });
  }
};

// Create or update a form template (Upsert)
export const saveTemplate = async (req: Request, res: Response) => {
  const { code, title, description, columns, rows } = req.body;

  if (!code || !title || !columns) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin mã, tiêu đề và cột cấu trúc biểu mẫu' });
  }

  try {
    const template = await prisma.formTemplate.upsert({
      where: { code },
      update: {
        title,
        description,
        columns,
        rowsConfig: rows || []
      },
      create: {
        code,
        title,
        description,
        columns,
        rowsConfig: rows || []
      }
    });

    return res.json({
      message: 'Đã lưu thiết kế cấu trúc biểu mẫu thành công',
      template
    });
  } catch (error: any) {
    console.error('[Submission Controller] Error saving template: ', error);
    return res.status(500).json({ message: 'Lỗi lưu thiết kế biểu mẫu', error: error.message });
  }
};

// Delete a form template
export const deleteTemplate = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const template = await prisma.formTemplate.findUnique({ where: { code } });
    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy thiết kế biểu mẫu cần xóa' });
    }

    // Check if there are submissions referencing this template
    const activeSubmissions = await prisma.formSubmission.count({
      where: { formCode: code }
    });

    if (activeSubmissions > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa thiết kế biểu mẫu vì đã có ${activeSubmissions} hồ sơ báo cáo đang liên kết dữ liệu.` 
      });
    }

    await prisma.formTemplate.delete({ where: { code } });

    return res.json({ message: `Đã xóa thiết kế biểu mẫu ${code} thành công` });
  } catch (error: any) {
    console.error('[Submission Controller] Error deleting template: ', error);
    return res.status(500).json({ message: 'Lỗi xóa thiết kế biểu mẫu', error: error.message });
  }
};
