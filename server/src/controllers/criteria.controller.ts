import { Request, Response } from 'express';
import prisma from '../config/db.js';

const DEFAULT_CATEGORIES = [
  'Quy hoạch',
  'Hạ tầng Kinh tế - Xã hội',
  'Phát triển Kinh tế nông thôn',
  'Đào tạo nguồn nhân lực NT'
];

const DEFAULT_CRITERIA = [
  {
    code: "TC01",
    title: "Quy hoạch",
    description: "Có quy hoạch chung xã hoặc quy hoạch đô thị được phê duyệt, được công bố công khai đúng thời hạn và ban hành kế hoạch thực hiện quy hoạch",
    indicator: "Có ban quản lý và quy định quản lý quy hoạch đúng pháp luật.",
    weight: "10%",
    category: "Quy hoạch",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["QD phê duyệt", "Bản đồ QH"]
  },
  {
    code: "TC02",
    title: "Đào tạo nguồn nhân lực nông thôn",
    description: "Tỷ lệ lao động qua đào tạo có bằng cấp, chứng chỉ",
    indicator: "Tỷ lệ lao động qua đào tạo có bằng cấp, chứng chỉ đạt chuẩn đề ra.",
    weight: "15%",
    category: "Đào tạo nguồn nhân lực NT",
    group1Threshold: "40",
    group2Threshold: "35",
    group3Threshold: "27",
    thresholdType: "percentage",
    proofs: ["Số liệu đi kèm"]
  },
  {
    code: "TC03",
    title: "Quy hoạch",
    description: "Có quy chế quản lý kiến trúc được phê duyệt hoặc được tích hợp trong quy hoạch chung xã",
    indicator: "Có văn bản hướng dẫn hoặc quy chế quản lý kiến trúc xã phù hợp.",
    weight: "8%",
    category: "Quy hoạch",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["Tổng hợp điều tra thu nhập"]
  },
  {
    code: "TC04",
    title: "Giao thông nâng cao",
    description: "Tỷ lệ đường xã được bảo trì hàng năm, có các hạng mục an toàn giao thông đầy đủ (biển báo, chiếu sáng, gờ giảm tốc)",
    indicator: "Đường xã đạt chuẩn giao thông nông thôn mới nâng cao.",
    weight: "12%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "85",
    group2Threshold: "75",
    group3Threshold: "65",
    thresholdType: "percentage",
    proofs: ["Báo cáo kiểm định", "Nhật ký bảo trì"]
  },
  {
    code: "TC05",
    title: "Bản tin công cộng",
    description: "Trang thông tin điện tử của xã có chuyên mục tuyên truyền, phổ biến pháp luật và tiếp nhận phản ánh kiến nghị",
    indicator: "Hệ thống truyền thông số xã nông thôn đạt chuẩn.",
    weight: "8%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["Quyết định vận hành trang tin"]
  },
  {
    code: "TC06",
    title: "Phát triển kinh tế nông thôn",
    description: "Có sản phẩm OCOP đạt 3 sao trở lên được công nhận, duy trì kết quả xếp hạng và quảng bá thương mại số",
    indicator: "Số lượng sản phẩm OCOP đạt chuẩn của xã tối đa.",
    weight: "10%",
    category: "Phát triển Kinh tế nông thôn",
    group1Threshold: "90",
    group2Threshold: "80",
    group3Threshold: "70",
    thresholdType: "percentage",
    proofs: ["Chứng nhận OCOP", "Hồ sơ thương mại số"]
  },
  {
    code: "TC07",
    title: "Đào tạo nghề thường xuyên",
    description: "Tỷ lệ người có thẻ bảo hiểm y tế còn hạn sử dụng tham gia các khóa đào tạo định hướng nghề nghiệp hàng năm",
    indicator: "Phổ cập kỹ năng nghề nghiệp và an sinh xã hội.",
    weight: "5%",
    category: "Đào tạo nguồn nhân lực NT",
    group1Threshold: "95",
    group2Threshold: "90",
    group3Threshold: "80",
    thresholdType: "percentage",
    proofs: ["Sổ theo dõi học viên"]
  },
  {
    code: "TC08",
    title: "Hạ tầng số và Chuyển đổi công nghệ",
    description: "Hệ thống hội nghị trực tuyến kết nối liên thông từ UBND xã tới huyện, tỉnh hoạt động ổn định và thông suốt",
    indicator: "Kết cấu hạ tầng phòng họp trực tuyến đạt chuẩn.",
    weight: "10%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["Biên bản nghiệm thu kỹ thuật"]
  },
  {
    code: "TC09",
    title: "Môi trường và Cảnh quan nâng cao",
    description: "Có các tuyến đường hoa mẫu, cây xanh công cộng được chăm sóc thường xuyên bởi cộng đồng tự quản",
    indicator: "Diện mạo môi trường xanh sạch đẹp.",
    weight: "7%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "92",
    group2Threshold: "85",
    group3Threshold: "78",
    thresholdType: "percentage",
    proofs: ["Hình ảnh cảnh quan", "Quyết định thành lập tổ tự quản"]
  },
  {
    code: "TC10",
    title: "Y tế cơ sở",
    description: "Trạm y tế xã có đủ điều kiện khám chữa bệnh bảo hiểm y tế, có sổ theo dõi sức khỏe điện tử cho trên 90% dân cư",
    indicator: "Đo độ phủ chăm sóc y tế toàn dân.",
    weight: "10%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["Giấy chứng nhận Y tế điện tử"]
  },
  {
    code: "TC11",
    title: "Xây dựng hệ thống chính trị chuẩn",
    description: "Đảng bộ xã đạt hoàn thành xuất sắc nhiệm vụ, chính quyền đạt vững mạnh xuất sắc",
    indicator: "Đánh giá xếp loại cán bộ cuối năm.",
    weight: "12%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["Quyết định khen thưởng", "Báo cáo xếp loại đảng bộ"]
  }
];

// --- Categories CRUD ---
export const getCategories = async (req: Request, res: Response) => {
  try {
    let list = await prisma.criteriaCategory.findMany({
      orderBy: { id: 'asc' }
    });

    if (list.length === 0) {
      // Seed default categories
      for (const name of DEFAULT_CATEGORIES) {
        await prisma.criteriaCategory.create({ data: { name } });
      }
      list = await prisma.criteriaCategory.findMany({
        orderBy: { id: 'asc' }
      });
    }

    return res.json(list);
  } catch (error: any) {
    console.error('[Criteria Controller] Error getting categories: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách danh mục', error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Tên danh mục không hợp lệ' });
  }

  try {
    const trimmed = name.trim();
    const existing = await prisma.criteriaCategory.findUnique({ where: { name: trimmed } });
    if (existing) {
      return res.status(400).json({ message: 'Danh mục này đã tồn tại!' });
    }

    const created = await prisma.criteriaCategory.create({
      data: { name: trimmed }
    });

    return res.json({ message: 'Thêm danh mục mới thành công', category: created });
  } catch (error: any) {
    console.error('[Criteria Controller] Error creating category: ', error);
    return res.status(500).json({ message: 'Lỗi tạo danh mục mới', error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { oldName } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Tên danh mục mới không hợp lệ' });
  }

  try {
    const trimmed = name.trim();
    const existing = await prisma.criteriaCategory.findUnique({ where: { name: oldName } });
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục cần sửa' });
    }

    const duplicate = await prisma.criteriaCategory.findUnique({ where: { name: trimmed } });
    if (duplicate && oldName !== trimmed) {
      return res.status(400).json({ message: 'Danh mục mới đã tồn tại!' });
    }

    const updated = await prisma.criteriaCategory.update({
      where: { name: oldName },
      data: { name: trimmed }
    });

    // Cascade update to criteria holding this category name
    await prisma.criterion.updateMany({
      where: { category: oldName },
      data: { category: trimmed }
    });

    return res.json({ message: 'Cập nhật tên danh mục thành công', category: updated });
  } catch (error: any) {
    console.error('[Criteria Controller] Error updating category: ', error);
    return res.status(500).json({ message: 'Lỗi cập nhật tên danh mục', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const existing = await prisma.criteriaCategory.findUnique({ where: { name } });
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục cần xóa' });
    }

    // Delete category
    await prisma.criteriaCategory.delete({ where: { name } });

    // Update child criteria to fallback category
    await prisma.criterion.updateMany({
      where: { category: name },
      data: { category: 'Chưa phân loại' }
    });

    // Ensure fallback "Chưa phân loại" exists in Categories table if we reassigned items
    const fallbackExists = await prisma.criteriaCategory.findUnique({ where: { name: 'Chưa phân loại' } });
    if (!fallbackExists) {
      await prisma.criteriaCategory.create({ data: { name: 'Chưa phân loại' } });
    }

    return res.json({ message: `Đã xóa danh mục "${name}" thành công` });
  } catch (error: any) {
    console.error('[Criteria Controller] Error deleting category: ', error);
    return res.status(500).json({ message: 'Lỗi xóa danh mục', error: error.message });
  }
};

// --- Criteria CRUD ---
export const getCriteria = async (req: Request, res: Response) => {
  try {
    let list = await prisma.criterion.findMany({
      orderBy: { code: 'asc' }
    });

    if (list.length === 0) {
      // Seed default criteria
      for (const item of DEFAULT_CRITERIA) {
        await prisma.criterion.create({
          data: {
            code: item.code,
            title: item.title,
            description: item.description,
            indicator: item.indicator,
            weight: item.weight,
            category: item.category,
            thresholdType: item.thresholdType,
            group1Threshold: item.group1Threshold,
            group2Threshold: item.group2Threshold,
            group3Threshold: item.group3Threshold,
            proofs: item.proofs
          }
        });
      }
      list = await prisma.criterion.findMany({
        orderBy: { code: 'asc' }
      });
    }

    return res.json(list);
  } catch (error: any) {
    console.error('[Criteria Controller] Error getting criteria: ', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách tiêu chí', error: error.message });
  }
};

export const createCriterion = async (req: Request, res: Response) => {
  const { code, title, description, indicator, weight, category, thresholdType, group1Threshold, group2Threshold, group3Threshold, proofs } = req.body;

  if (!code || !title || !category) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: Mã, Tên và Danh mục tiêu chí' });
  }

  try {
    const existing = await prisma.criterion.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: 'Mã tiêu chí này đã tồn tại!' });
    }

    const created = await prisma.criterion.create({
      data: {
        code,
        title,
        description: description || null,
        indicator: indicator || null,
        weight: weight || null,
        category,
        thresholdType: thresholdType || 'boolean',
        group1Threshold: group1Threshold || 'Đạt',
        group2Threshold: group2Threshold || 'Đạt',
        group3Threshold: group3Threshold || 'Đạt',
        proofs: proofs || []
      }
    });

    return res.json({ message: 'Thêm tiêu chí thành công', criterion: created });
  } catch (error: any) {
    console.error('[Criteria Controller] Error creating criterion: ', error);
    return res.status(500).json({ message: 'Lỗi tạo tiêu chí mới', error: error.message });
  }
};

export const updateCriterion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, title, description, indicator, weight, category, thresholdType, group1Threshold, group2Threshold, group3Threshold, proofs } = req.body;

  try {
    const existing = await prisma.criterion.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy tiêu chí cần sửa' });
    }

    const duplicate = await prisma.criterion.findUnique({ where: { code } });
    if (duplicate && duplicate.id !== id) {
      return res.status(400).json({ message: 'Mã tiêu chí mới đã tồn tại!' });
    }

    const updated = await prisma.criterion.update({
      where: { id },
      data: {
        code: code || existing.code,
        title: title || existing.title,
        description: description !== undefined ? description : existing.description,
        indicator: indicator !== undefined ? indicator : existing.indicator,
        weight: weight !== undefined ? weight : existing.weight,
        category: category || existing.category,
        thresholdType: thresholdType || existing.thresholdType,
        group1Threshold: group1Threshold || existing.group1Threshold,
        group2Threshold: group2Threshold || existing.group2Threshold,
        group3Threshold: group3Threshold || existing.group3Threshold,
        proofs: proofs || existing.proofs
      }
    });

    return res.json({ message: 'Cập nhật tiêu chí thành công', criterion: updated });
  } catch (error: any) {
    console.error('[Criteria Controller] Error updating criterion: ', error);
    return res.status(500).json({ message: 'Lỗi cập nhật tiêu chí', error: error.message });
  }
};

export const deleteCriterion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.criterion.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy tiêu chí cần xóa' });
    }

    await prisma.criterion.delete({ where: { id } });

    return res.json({ message: `Đã xóa tiêu chí ${existing.code} thành công` });
  } catch (error: any) {
    console.error('[Criteria Controller] Error deleting criterion: ', error);
    return res.status(500).json({ message: 'Lỗi xóa tiêu chí', error: error.message });
  }
};
