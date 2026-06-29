import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seeding...');

  // 1. Seed Units
  const unitsData = [
    // Ministries
    { code: 'MINISTRY', name: 'Bộ Nông nghiệp và Phát triển nông thôn', level: 'MINISTRY' },
    // Provinces
    { code: 'VN-TD', name: 'Tỉnh Đông', level: 'PROVINCE' },
    { code: 'VN-TT', name: 'Tỉnh Thái Thụy', level: 'PROVINCE' },
    { code: 'VN-TB', name: 'Tỉnh Bắc', level: 'PROVINCE' },
    { code: 'VN-TN', name: 'Tỉnh Nam', level: 'PROVINCE' },
    { code: 'VN-ND', name: 'Tỉnh Nam Định', level: 'PROVINCE' },
    // Communes
    { code: '23041', name: 'Xã Bình Minh', level: 'COMMUNE', parentCode: 'VN-TD', communeGroup: 'I' },
    { code: '23055', name: 'Xã Thụy Xuân', level: 'COMMUNE', parentCode: 'VN-TT', communeGroup: 'II' },
    { code: '23078', name: 'Xã Vũ Hội', level: 'COMMUNE', parentCode: 'VN-TB', communeGroup: 'III' },
    { code: '23102', name: 'Xã Hải Anh', level: 'COMMUNE', parentCode: 'VN-TN', communeGroup: 'I' },
  ];

  for (const u of unitsData) {
    await prisma.unit.upsert({
      where: { code: u.code },
      update: {
        name: u.name,
        level: u.level,
        parentCode: u.parentCode,
        communeGroup: u.communeGroup
      },
      create: {
        code: u.code,
        name: u.name,
        level: u.level,
        parentCode: u.parentCode,
        communeGroup: u.communeGroup
      }
    });
  }
  console.log('[Seed] Seeding Units completed.');

  // 2. Seed Users (passwords hashed using bcrypt)
  const passwordHash = await bcrypt.hash('password123', 10);
  const usersData = [
    {
      username: 'editor_com1',
      fullName: 'Nguyễn Văn An',
      role: 'EDITOR',
      department: 'UBND Xã Bình Minh',
      unitCode: '23041',
      permissions: ['EDIT_FORM', 'SUBMIT_FORM']
    },
    {
      username: 'appraiser_prov1',
      fullName: 'Trần Minh Thẩm',
      role: 'APPRAISER',
      department: 'Sở NN&PTNT Tỉnh Đông',
      unitCode: 'VN-TD',
      permissions: ['VIEW_FORM', 'APPROVE_FORM', 'REJECT_FORM', 'CERTIFY_NTM']
    },
    {
      username: 'supervisor_bo',
      fullName: 'Phạm Hoàng Giám',
      role: 'SUPERVISOR',
      department: 'Văn phòng Điều phối NTM Trung ương',
      unitCode: 'MINISTRY',
      permissions: ['VIEW_FORM', 'SUPERVISE_FORM', 'SYNC_DATA', 'CERTIFY_PROVINCE']
    }
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        unitCode: user.unitCode,
        permissions: user.permissions
      },
      create: {
        username: user.username,
        passwordHash,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        unitCode: user.unitCode,
        permissions: user.permissions
      }
    });
  }
  console.log('[Seed] Seeding Users completed.');

  // 3. Seed Periods
  const periodsData = [
    {
      id: '2024-q4',
      name: 'Báo cáo kết quả thực hiện NTM - Quý IV Năm 2024',
      year: 2024,
      term: 'Quarter_4',
      deadline: new Date('2024-12-31T23:59:59Z')
    },
    {
      id: '2024-6tdu',
      name: 'Đợt báo cáo NTM 6 tháng đầu năm 2024',
      year: 2024,
      term: '6_Months',
      deadline: new Date('2024-06-30T23:59:59Z')
    }
  ];

  for (const p of periodsData) {
    await prisma.period.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        year: p.year,
        term: p.term,
        deadline: p.deadline
      },
      create: {
        id: p.id,
        name: p.name,
        year: p.year,
        term: p.term,
        deadline: p.deadline
      }
    });
  }
  console.log('[Seed] Seeding Periods completed.');

  // 4. Seed Form Templates (Biểu 01 to Biểu 14)
  const templatesData = [
    {
      code: 'Biểu 01',
      title: 'Báo cáo tổng hợp liên ngành kết quả thực hiện chương trình NTM cả nước',
      description: 'Báo cáo từ cấp Bộ gửi lên các cơ quan điều phối trung ương (Bộ Tài chính, Bộ NN&PTNT).',
      columns: [
        { id: 'provinceName', label: 'Tỉnh/Thành phố', type: 'text' },
        { id: 'progressRate', label: 'Tỷ lệ hoàn thành (%)', type: 'number' },
        { id: 'totalInvestment', label: 'Tổng vốn đầu tư (tỷ đồng)', type: 'number' }
      ],
      rowsConfig: []
    },
    {
      code: 'Biểu 04',
      title: 'Các cơ chế, chính sách do địa phương ban hành để thực hiện chương trình giai đoạn 2026-2030',
      description: 'Báo cáo các văn bản quy phạm, hướng dẫn, chính sách đầu tư tại cấp Tỉnh (Kèm theo Mẫu số 03).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'type', label: 'Loại văn bản', type: 'text' },
        { id: 'codeAndDate', label: 'Số, ngày, tháng ban hành', type: 'text' },
        { id: 'summary', label: 'Trích yếu', type: 'text' },
        { id: 'mainGoal', label: 'Mục tiêu', type: 'text' },
        { id: 'mainContent', label: 'Nội dung chủ yếu của cơ chế chính sách', type: 'text' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: '1', type: 'Nghị quyết của HĐND', codeAndDate: '05/2023/NQ-HĐND - 12/05/2023', summary: 'Về việc hỗ trợ kinh phí bê tông hóa đường giao thông nông thôn và kênh mương nội đồng', mainGoal: 'Nâng cao hạ tầng giao thông và thủy lợi phục vụ nông nghiệp', mainContent: 'Hỗ trợ 100% xi măng, người dân đóng góp ngày công lao động và tự nguyện giải phóng mặt bằng.', note: 'Đã hoàn thành giải ngân đợt 1 năm 2023' },
        { id: 2, tt: '2', type: 'Quyết định của UBND', codeAndDate: '112/QĐ-UBND - 20/06/2023', summary: 'Phê duyệt đề án thu gom và xử lý rác thải sinh hoạt nông thôn tập trung', mainGoal: 'Xử lý triệt để ô nhiễm rác thải nông thôn đạt tiêu chí số 17', mainContent: 'Thiết lập đội thu gom liên xã, quy chế đóng phí dịch vụ rác thải định kỳ hằng tháng.', note: 'Chưa đính kèm văn bản quét màu chính thức' }
      ]
    },
    {
      code: 'Biểu 05',
      title: 'Kết quả thực hiện bộ tiêu chí quốc gia về nông thôn mới 6 tháng..../năm...',
      description: 'Dành cho cấp Tỉnh tổng hợp kết quả của các huyện/xã (Kèm theo Mẫu số 03).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'Nội dung', type: 'text' },
        { id: 'unit', label: 'ĐVT (xã)', type: 'text' },
        { id: 'g1_prev', label: 'KQ 31/12 năm trước', type: 'number', group: 'Xã nhóm 1' },
        { id: 'g1_curr', label: 'TH 6 tháng năm...', type: 'number', group: 'Xã nhóm 1' },
        { id: 'g1_plan', label: 'KH 6T cuối năm...', type: 'number', group: 'Xã nhóm 1' },
        { id: 'g2_prev', label: 'KQ 31/12 năm trước', type: 'number', group: 'Xã nhóm 2' },
        { id: 'g2_curr', label: 'TH 6 tháng năm...', type: 'number', group: 'Xã nhóm 2' },
        { id: 'g2_plan', label: 'KH 6T cuối năm...', type: 'number', group: 'Xã nhóm 2' },
        { id: 'g3_prev', label: 'KQ 31/12 năm trước', type: 'number', group: 'Xã nhóm 3' },
        { id: 'g3_curr', label: 'TH 6 tháng năm...', type: 'number', group: 'Xã nhóm 3' },
        { id: 'g3_plan', label: 'KH 6T cuối năm...', type: 'number', group: 'Xã nhóm 3' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: '1', category: 'Quy hoạch', unit: 'Xã' },
        { id: 2, tt: '2', category: 'Hạ tầng kinh tế - xã hội', unit: 'Xã' },
        { id: 3, tt: '3', category: 'Phát triển kinh tế nông thôn', unit: 'Xã' },
        { id: 4, tt: '4', category: 'Đào tạo nguồn nhân lực nông thôn', unit: 'Xã' },
        { id: 5, tt: '5', category: 'Văn hóa, Giáo dục, Y tế', unit: 'Xã' },
        { id: 6, tt: '6', category: 'Giảm nghèo và An sinh xã hội', unit: 'Xã' },
        { id: 7, tt: '7', category: 'Khoa học công nghệ và Chuyển đổi số', unit: 'Xã' },
        { id: 8, tt: '8', category: 'Môi trường và cảnh quan nông thôn', unit: 'Xã' },
        { id: 9, tt: '9', category: 'Xây dựng hệ thống chính trị và Hành chính công', unit: 'Xã' },
        { id: 10, tt: '10', category: 'Tiếp cận pháp luật và An ninh, Quốc phòng', unit: 'Xã' }
      ]
    },
    {
      code: 'Biểu 06',
      title: 'Kết quả thực hiện chương trình 6 tháng..../năm...',
      description: 'Tỉnh báo cáo rà soát tiến triển đạt chuẩn của toàn bộ các tiêu chí vĩ mô (Kèm theo Mẫu số 03).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'Nội dung', type: 'text' },
        { id: 'prevYear', label: 'KQ đến 31/12 năm trước', type: 'number' },
        { id: 'currentS1', label: 'TH 6 tháng năm...', type: 'number' },
        { id: 'planS2', label: 'KH 6T cuối năm...', type: 'number' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: 'I', category: 'Kết quả thực hiện xây dựng NTM cấp xã', isHeader: true, sectionCode: 'I' },
        { id: 2, tt: '1', category: 'Tổng số xã thực hiện XD NTM trên địa bàn' },
        { id: 3, tt: '2', category: 'Số xã đạt 10 tiêu chí' },
        { id: 4, tt: '3', category: 'Số xã đạt từ 5 - 9 tiêu chí' },
        { id: 5, tt: '4', category: 'Số xã đạt dưới 5 tiêu chí' }
      ]
    },
    {
      code: 'Biểu 07',
      title: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng..../năm...',
      description: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình (ĐVT: Triệu đồng, Kèm theo Mẫu số 03).',
      columns: [
        { id: 'tt', label: 'STT', type: 'text' },
        { id: 'category', label: 'Nội dung chỉ tiêu', type: 'text' },
        { id: 'plan', label: 'Kế hoạch năm...', type: 'number' },
        { id: 'actual', label: 'KQ huy động 6T/năm...', type: 'number' },
        { id: 'planS2', label: 'KH 6T cuối năm...', type: 'number' }
      ],
      rowsConfig: [
        { id: 1, tt: '', category: 'TỔNG SỐ' },
        { id: 2, tt: 'I', category: 'NGÂN SÁCH TRUNG ƯƠNG' },
        { id: 3, tt: '1', category: 'Vốn đầu tư công' },
        { id: 4, tt: '2', category: 'Kinh phí thường xuyên' },
        { id: 5, tt: 'II', category: 'NGÂN SÁCH ĐỊA PHƯƠNG' },
        { id: 6, tt: '1', category: 'Tỉnh' },
        { id: 7, tt: '2', category: 'Xã' },
        { id: 8, tt: 'III', category: 'VỐN LỒNG GHÉP' },
        { id: 9, tt: 'IV', category: 'VỐN TÍN DỤNG CHÍNH SÁCH' },
        { id: 10, tt: 'V', category: 'VỐN DOANH NGHIỆP' },
        { id: 11, tt: 'VI', category: 'HUY ĐỘNG TỪ CỘNG ĐỒNG VÀ NGƯỜI DÂN' },
        { id: 12, tt: '1', category: 'Tiền mặt' },
        { id: 13, tt: '2', category: 'Ngày công và hiện vật quy đổi' }
      ]
    },
    {
      code: 'Biểu 08',
      title: 'Kết quả thực hiện vốn đầu tư công thực hiện chương trình từ nguồn ngân sách trung ương 6 tháng.../năm...',
      description: 'Kết quả thực hiện vốn đầu tư công thực hiện chương trình từ nguồn ngân sách trung ương (Kèm theo Mẫu số 03).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'CÔNG TRÌNH', type: 'text' },
        { id: 'plan', label: 'Kế hoạch năm ...', type: 'number' },
        { id: 'actual', label: 'KQ TH 6 tháng năm...', type: 'number' },
        { id: 'actualPlan', label: 'KQ TH kế hoạch năm...', type: 'number' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: '', category: 'TỔNG CỘNG' },
        { id: 2, tt: '1', category: 'Giao thông' },
        { id: 3, tt: '2', category: 'Thủy lợi' },
        { id: 4, tt: '3', category: 'Phòng chống, thiên tai' },
        { id: 5, tt: '4', category: 'Điện' },
        { id: 6, tt: '5', category: 'Cơ sở hạ tầng thương mại nông thôn' },
        { id: 7, tt: '6', category: 'CSHT vùng nguyên liệu tập trung' },
        { id: 8, tt: '7', category: 'Hạ tầng số, hạ tầng viễn thông' },
        { id: 9, tt: '8', category: 'Hệ thống truyền thanh' },
        { id: 10, tt: '9', category: 'Công trình cung cấp nước sạch tập trung' },
        { id: 11, tt: '10', category: 'CSHT phục vụ bảo vệ môi trường nông thôn' },
        { id: 12, tt: '11', category: 'CSHT bố trí, ổn định dân cư' },
        { id: 13, tt: '12', category: 'Hạ tầng CSDL, thông tin phục vụ quản lý Chương trình' },
        { id: 14, tt: '13', category: 'CSHT đặc thù vùng đồng bào DTTS và miền núi' }
      ]
    },
    {
      code: 'Biểu 09',
      title: 'Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng..../năm...',
      description: 'Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình (Kèm theo Mẫu số 03).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'NỘI DUNG THỰC HIỆN', type: 'text' },
        { id: 'h1_total', label: 'Tổng số', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_nstw_dtpt', label: 'ĐTPT', type: 'number', group: '6T - Kết quả huy động', subGroup: 'NSTW' },
        { id: 'h1_nstw_sn', label: 'SN', type: 'number', group: '6T - Kết quả huy động', subGroup: 'NSTW' },
        { id: 'h1_nsdp', label: 'NSĐP', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_longGhep', label: 'Vốn lồng ghép', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_tinDung', label: 'Vốn tín dụng', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_danGop', label: 'Dân đóng góp', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h2_total', label: 'Tổng số', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_nstw_dtpt', label: 'ĐTPT', type: 'number', group: 'KH cuối năm', subGroup: 'NSTW' },
        { id: 'h2_nstw_sn', label: 'SN', type: 'number', group: 'KH cuối năm', subGroup: 'NSTW' },
        { id: 'h2_nsdp', label: 'NSĐP', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_longGhep', label: 'Vốn lồng ghép', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_tinDung', label: 'Vốn tín dụng', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_danGop', label: 'Dân đóng góp', type: 'number', group: 'KH cuối năm' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: 'I', category: 'Hợp phần thứ nhất', isHeader: true, sectionCode: 'I' },
        { id: 2, tt: '1', category: 'Nội dung thành phần 01' },
        { id: 3, tt: '2', category: 'Nội dung thành phần 02' },
        { id: 4, tt: 'II', category: 'Hợp phần thứ hai', isHeader: true, sectionCode: 'II' },
        { id: 5, tt: '1', category: 'Nội dung thành phần 01' },
        { id: 6, tt: 'III', category: 'Nội dung khác (nếu có)', isHeader: true, sectionCode: 'III' }
      ]
    },
    {
      code: 'Biểu 10',
      title: 'Kết quả thực hiện bộ tiêu chí quốc gia về nông thôn mới 6 tháng..../năm...',
      description: 'Kết quả thực hiện bộ tiêu chí quốc gia về nông thôn mới cấp xã (Kèm theo Mẫu số 04).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'Nội dung', type: 'text' },
        { id: 'unit', label: 'ĐVT', type: 'text' },
        { id: 'prevResult', label: 'Kết quả', type: 'number', group: 'KQ đến 31/12 năm trước' },
        { id: 'prevEval', label: 'Đánh giá', type: 'boolean', group: 'KQ đến 31/12 năm trước' },
        { id: 'currResult', label: 'Kết quả', type: 'number', group: 'TH 6 tháng năm...' },
        { id: 'currEval', label: 'Đánh giá', type: 'boolean', group: 'TH 6 tháng năm...' },
        { id: 'planResult', label: 'Kết quả', type: 'number', group: 'KH 6T cuối năm...' },
        { id: 'planEval', label: 'Đánh giá', type: 'boolean', group: 'KH 6T cuối năm...' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: '1', category: 'Quy hoạch', unit: '' },
        { id: 2, tt: '1.1', category: 'Có quy hoạch chung xã được phê duyệt', unit: 'xã' },
        { id: 3, tt: '2', category: 'Hạ tầng kinh tế - xã hội', unit: '' },
        { id: 4, tt: '2.1', category: 'Hệ thống đường giao thông nông thôn', unit: 'km' },
        { id: 5, tt: '3', category: 'Phát triển kinh tế nông thôn', unit: '' },
        { id: 6, tt: '3.1', category: 'Tốc độ tăng thu nhập bình quân đầu người', unit: '%' }
      ]
    },
    {
      code: 'Biểu 11',
      title: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng năm..../năm...',
      description: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình (ĐVT: Triệu đồng, Kèm theo Mẫu số 04).',
      columns: [
        { id: 'tt', label: 'STT', type: 'text' },
        { id: 'category', label: 'Nội dung chỉ tiêu', type: 'text' },
        { id: 'plan', label: 'Kế hoạch năm...', type: 'number' },
        { id: 'actual', label: 'KQ huy động 6T/năm...', type: 'number' },
        { id: 'planS2', label: 'KH 6T cuối năm...', type: 'number' }
      ],
      rowsConfig: [
        { id: 1, tt: '', category: 'TỔNG SỐ' },
        { id: 2, tt: 'I', category: 'NGÂN SÁCH TRUNG ƯƠNG' },
        { id: 3, tt: '1', category: 'Vốn đầu tư công' },
        { id: 4, tt: '2', category: 'Kinh phí thường xuyên' },
        { id: 5, tt: 'II', category: 'NGÂN SÁCH ĐỊA PHƯƠNG' },
        { id: 6, tt: '1', category: 'Tỉnh' },
        { id: 7, tt: '2', category: 'Xã' },
        { id: 8, tt: 'III', category: 'VỐN LỒNG GHÉP' },
        { id: 9, tt: 'IV', category: 'VỐN TÍN DỤNG CHÍNH SÁCH' },
        { id: 10, tt: 'V', category: 'VỐN DOANH NGHIỆP' },
        { id: 11, tt: 'VI', category: 'HUY ĐỘNG TỪ CỘNG ĐỒNG VÀ NGƯỜI DÂN' },
        { id: 12, tt: '1', category: 'Tiền mặt' },
        { id: 13, tt: '2', category: 'Ngày công và hiện vật quy đổi' }
      ]
    },
    {
      code: 'Biểu 12',
      title: 'Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng..../năm...',
      description: 'Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình (Kèm theo Mẫu số 04).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'NỘI DUNG THỰC HIỆN', type: 'text' },
        { id: 'h1_total', label: 'Tổng số', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_nstw_dtpt', label: 'ĐTPT', type: 'number', group: '6T - Kết quả huy động', subGroup: 'NSTW' },
        { id: 'h1_nstw_sn', label: 'SN', type: 'number', group: '6T - Kết quả huy động', subGroup: 'NSTW' },
        { id: 'h1_nsdp', label: 'NSĐP', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_longGhep', label: 'Vốn lồng ghép', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_tinDung', label: 'Vốn tín dụng', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h1_danGop', label: 'Dân đóng góp', type: 'number', group: '6T - Kết quả huy động' },
        { id: 'h2_total', label: 'Tổng số', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_nstw_dtpt', label: 'ĐTPT', type: 'number', group: 'KH cuối năm', subGroup: 'NSTW' },
        { id: 'h2_nstw_sn', label: 'SN', type: 'number', group: 'KH cuối năm', subGroup: 'NSTW' },
        { id: 'h2_nsdp', label: 'NSĐP', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_longGhep', label: 'Vốn lồng ghép', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_tinDung', label: 'Vốn tín dụng', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: 'KH cuối năm' },
        { id: 'h2_danGop', label: 'Dân đóng góp', type: 'number', group: 'KH cuối năm' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: 'I', category: 'Hợp phần thứ nhất', isHeader: true, sectionCode: 'I' },
        { id: 2, tt: '1', category: 'Nội dung thành phần 01' },
        { id: 3, tt: '2', category: 'Nội dung thành phần 02' },
        { id: 4, tt: 'II', category: 'Hợp phần thứ hai', isHeader: true, sectionCode: 'II' },
        { id: 5, tt: '1', category: 'Nội dung thành phần 01' },
        { id: 6, tt: 'III', category: 'Nội dung khác (nếu có)', isHeader: true, sectionCode: 'III' }
      ]
    },
    {
      code: 'Biểu 13',
      title: 'Kết quả thực hiện vốn đầu tư phát triển từ nguồn ngân sách trung ương 6 tháng.../năm...',
      description: 'Kết quả thực hiện vốn đầu tư phát triển từ nguồn ngân sách trung ương (Kèm theo Mẫu số 04).',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'CÔNG TRÌNH', type: 'text' },
        { id: 'plan', label: 'Kế hoạch năm ...', type: 'number' },
        { id: 'actual', label: 'KQ TH 6 tháng năm...', type: 'number' },
        { id: 'actualPlan', label: 'KQ TH kế hoạch năm...', type: 'number' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: '', category: 'TỔNG CỘNG' },
        { id: 2, tt: '1', category: 'Giao thông' },
        { id: 3, tt: '2', category: 'Thủy lợi' },
        { id: 4, tt: '3', category: 'Phòng chống, thiên tai' },
        { id: 5, tt: '4', category: 'Điện' },
        { id: 6, tt: '5', category: 'Cơ sở hạ tầng thương mại nông thôn' },
        { id: 7, tt: '6', category: 'CSHT vùng nguyên liệu tập trung' },
        { id: 8, tt: '7', category: 'Hạ tầng số, hạ tầng viễn thông' },
        { id: 9, tt: '8', category: 'Hệ thống truyền thanh' },
        { id: 10, tt: '9', category: 'Công trình cung cấp nước sạch tập trung' },
        { id: 11, tt: '10', category: 'CSHT phục vụ bảo vệ môi trường nông thôn' },
        { id: 12, tt: '11', category: 'CSHT bố trí, ổn định dân cư' },
        { id: 13, tt: '12', category: 'Hạ tầng CSDL, thông tin phục vụ quản lý Chương trình' },
        { id: 14, tt: '13', category: 'CSHT đặc thù vùng đồng bào DTTS và miền núi' }
      ]
    },
    {
      code: 'Biểu 14',
      title: 'Báo cáo tiến triển rà soát cơ giới hóa và phát triển nông thôn',
      description: 'Đo lường cơ giới hóa sản xuất nông nghiệp tại địa bàn xã.',
      columns: [
        { id: 'tt', label: 'TT', type: 'text' },
        { id: 'category', label: 'Nội dung rà soát', type: 'text' },
        { id: 'quantity', label: 'Số lượng máy/hộ', type: 'number' },
        { id: 'status', label: 'Trạng thái áp dụng', type: 'text' },
        { id: 'note', label: 'Ghi chú', type: 'text' }
      ],
      rowsConfig: [
        { id: 1, tt: '1', category: 'Máy cấy cơ giới hoạt động tự động', quantity: 15, status: 'Đang áp dụng rộng rãi', note: 'Tăng 3 chiếc so với năm ngoái' },
        { id: 2, tt: '2', category: 'Máy gặt đập liên hợp công suất lớn', quantity: 24, status: 'Hợp tác xã sở hữu', note: 'Phủ khắp 95% diện tích cấy' },
        { id: 3, tt: '3', category: 'Hệ thống phun thuốc không người lái', quantity: 4, status: 'Đang thử nghiệm mô hình', note: 'UBND hỗ trợ 50% kinh phí' }
      ]
    }
  ];

  for (const t of templatesData) {
    await prisma.formTemplate.upsert({
      where: { code: t.code },
      update: {
        title: t.title,
        description: t.description,
        columns: t.columns,
        rowsConfig: t.rowsConfig
      },
      create: {
        code: t.code,
        title: t.title,
        description: t.description,
        columns: t.columns,
        rowsConfig: t.rowsConfig
      }
    });
  }
  console.log('[Seed] Seeding Form Templates completed.');

  // 5. Seed Circular 23 Indicators Dictionary
  const indicatorsData = [
    // Section 1: Objectives
    { code: 'I.1', name: 'Tỷ lệ số xã được công nhận đạt chuẩn nông thôn mới', section: 'OBJECTIVES', unit: '%', reportFrequency: '6_MONTH' },
    { code: 'I.2', name: 'Tỷ lệ số xã được công nhận nông thôn mới hiện đại', section: 'OBJECTIVES', unit: '%', reportFrequency: '6_MONTH' },
    { code: 'I.3', name: 'Số tỉnh, thành phố hoàn thành nhiệm vụ xây dựng nông thôn mới', section: 'OBJECTIVES', unit: 'Tỉnh', reportFrequency: '6_MONTH' },
    // Section 2: Commune Criteria (Nhóm 1)
    { code: 'II.1.1', name: 'Tỷ lệ số xã đạt tiêu chí Quy hoạch (Nhóm 1)', section: 'CRITERIA_COMMUNE_1', unit: '%', reportFrequency: '6_MONTH' },
    { code: 'II.1.2', name: 'Tỷ lệ số xã đạt tiêu chí Hạ tầng kinh tế - xã hội (Nhóm 1)', section: 'CRITERIA_COMMUNE_1', unit: '%', reportFrequency: '6_MONTH' },
    { code: 'II.1.3', name: 'Tỷ lệ số xã đạt tiêu chí Phát triển kinh tế nông thôn (Nhóm 1)', section: 'CRITERIA_COMMUNE_1', unit: '%', reportFrequency: '6_MONTH' },
    // Section 3: Resources
    { code: 'III.1.1', name: 'Tổng nguồn lực huy động thực hiện Chương trình', section: 'RESOURCES', unit: 'Triệu đồng', reportFrequency: '6_MONTH' },
    { code: 'III.1.2', name: 'Vốn ngân sách trung ương', section: 'RESOURCES', unit: 'Triệu đồng', reportFrequency: '6_MONTH' },
  ];

  for (const ind of indicatorsData) {
    await prisma.ntmIndicatorDictionary.upsert({
      where: { code: ind.code },
      update: {
        name: ind.name,
        section: ind.section,
        unit: ind.unit,
        reportFrequency: ind.reportFrequency
      },
      create: {
        code: ind.code,
        name: ind.name,
        section: ind.section,
        unit: ind.unit,
        reportFrequency: ind.reportFrequency
      }
    });
  }
  console.log('[Seed] Seeding Indicators Dictionary completed.');

  console.log('[Seed] Seeding database successfully completed!');
}

main()
  .catch((e) => {
    console.error('[Seed] Error running seed script: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
