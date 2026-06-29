import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileEdit, Plus, Edit2, Trash2, Search, X, Check, Columns, AlignJustify,
  Save, Eye, ListPlus, Settings, FileText, ChevronRight, HelpCircle
} from 'lucide-react';
import { UserSession, FormTemplate, FormColumn, FormRowConfig } from '../types';

interface FormDesignerTabProps {
  userSession: UserSession;
}

// Preset form templates for initial load, maps to the system default forms
export const INITIAL_FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'tmpl-b04',
    code: 'Biểu 04',
    title: 'Các cơ chế, chính sách do địa phương ban hành để thực hiện chương trình giai đoạn 2026-2030',
    description: 'Báo cáo các văn bản quy phạm, hướng dẫn, chính sách đầu tư tại cấp Tỉnh (Kèm theo Mẫu số 03).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'type', label: 'Loại văn bản', type: 'text', width: 150 },
      { id: 'codeAndDate', label: 'Số, ngày, tháng ban hành', type: 'text', width: 180 },
      { id: 'summary', label: 'Trích yếu', type: 'text', width: 200 },
      { id: 'mainGoal', label: 'Mục tiêu', type: 'text', width: 200 },
      { id: 'mainContent', label: 'Nội dung chủ yếu của cơ chế chính sách', type: 'text', width: 280 },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
      { id: 1, tt: '1', category: 'Nghị quyết của HĐND' },
      { id: 2, tt: '2', category: 'Quyết định của UBND' }
    ]
  },
  {
    id: 'tmpl-b05',
    code: 'Biểu 05',
    title: 'Kết quả thực hiện bộ tiêu chí quốc gia về nông thôn mới 6 tháng..../năm...',
    description: 'Dành cho cấp Tỉnh tổng hợp kết quả của các huyện/xã (Kèm theo Mẫu số 03).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung', type: 'text', width: 280 },
      { id: 'unit', label: 'ĐVT (xã)', type: 'text', width: 80 },
      { id: 'g1_prev', label: 'KQ 31/12 năm trước', type: 'number', group: 'Xã nhóm 1' },
      { id: 'g1_curr', label: 'TH 6 tháng năm...', type: 'number', group: 'Xã nhóm 1' },
      { id: 'g1_plan', label: 'KH 6T cuối năm...', type: 'number', group: 'Xã nhóm 1' },
      { id: 'g2_prev', label: 'KQ 31/12 năm trước', type: 'number', group: 'Xã nhóm 2' },
      { id: 'g2_curr', label: 'TH 6 tháng năm...', type: 'number', group: 'Xã nhóm 2' },
      { id: 'g2_plan', label: 'KH 6T cuối năm...', type: 'number', group: 'Xã nhóm 2' },
      { id: 'g3_prev', label: 'KQ 31/12 năm trước', type: 'number', group: 'Xã nhóm 3' },
      { id: 'g3_curr', label: 'TH 6 tháng năm...', type: 'number', group: 'Xã nhóm 3' },
      { id: 'g3_plan', label: 'KH 6T cuối năm...', type: 'number', group: 'Xã nhóm 3' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
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
    id: 'tmpl-b06',
    code: 'Biểu 06',
    title: 'Kết quả thực hiện chương trình 6 tháng..../năm...',
    description: 'Tỉnh báo cáo rà soát tiến triển đạt chuẩn của toàn bộ các tiêu chí vĩ mô (Kèm theo Mẫu số 03).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung', type: 'text', width: 320 },
      { id: 'prevYear', label: 'KQ đến 31/12 năm trước', type: 'number' },
      { id: 'currentS1', label: 'TH 6 tháng năm...', type: 'number' },
      { id: 'planS2', label: 'KH 6T cuối năm...', type: 'number' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
      { id: 1, tt: 'I', category: 'Kết quả thực hiện xây dựng NTM cấp xã', isHeader: true, sectionCode: 'I' },
      { id: 2, tt: '1', category: 'Tổng số xã thực hiện XD NTM trên địa bàn' },
      { id: 3, tt: '2', category: 'Số xã đạt 10 tiêu chí' },
      { id: 4, tt: '3', category: 'Số xã đạt từ 5 - 9 tiêu chí' },
      { id: 5, tt: '4', category: 'Số xã đạt dưới 5 tiêu chí' }
    ]
  },
  {
    id: 'tmpl-b07',
    code: 'Biểu 07',
    title: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng..../năm...',
    description: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình (ĐVT: Triệu đồng, Kèm theo Mẫu số 03).',
    columns: [
      { id: 'tt', label: 'STT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung chỉ tiêu', type: 'text', width: 280 },
      { id: 'plan', label: 'Kế hoạch năm...', type: 'number' },
      { id: 'actual', label: 'KQ huy động 6T/năm...', type: 'number' },
      { id: 'planS2', label: 'KH 6T cuối năm...', type: 'number' }
    ],
    rows: [
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
    id: 'tmpl-b08',
    code: 'Biểu 08',
    title: 'Kết quả thực hiện vốn đầu tư công thực hiện chương trình từ nguồn NSTW 6 tháng.../năm...',
    description: 'Kết quả thực hiện vốn đầu tư công từ nguồn ngân sách trung ương (Kèm theo Mẫu số 03).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'CÔNG TRÌNH', type: 'text', width: 300 },
      { id: 'plan', label: 'Kế hoạch năm ...', type: 'number' },
      { id: 'actual', label: 'KQ TH 6 tháng năm...', type: 'number' },
      { id: 'actualPlan', label: 'KQ TH kế hoạch năm...', type: 'number' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
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
    id: 'tmpl-b09',
    code: 'Biểu 09',
    title: 'Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng..../năm...',
    description: 'Kết quả huy động nguồn lực đầu tư thực hiện chương trình (Kèm theo Mẫu số 03).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'NỘI DUNG THỰC HIỆN', type: 'text', width: 300 },
      // 6T - Kết quả huy động
      { id: 'hd_total', label: 'Tổng số', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_vdt_total', label: 'Tổng số', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'hd_nstw_dtpt', label: 'ĐTPT', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'hd_nstw_sn', label: 'SN', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'hd_nsdp', label: 'NSĐP', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'hd_longGhep', label: 'Vốn lồng ghép', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_tinDung', label: 'Vốn tín dụng', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_danGop', label: 'Dân đóng góp', type: 'number', group: '6T - Kết quả huy động' },
      // KH cuối năm
      { id: 'kh_total', label: 'Tổng số', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_vdt_total', label: 'Tổng số', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'kh_nstw_dtpt', label: 'ĐTPT', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'kh_nstw_sn', label: 'SN', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'kh_nsdp', label: 'NSĐP', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'kh_longGhep', label: 'Vốn lồng ghép', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_tinDung', label: 'Vốn tín dụng', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_danGop', label: 'Dân đóng góp', type: 'number', group: 'KH cuối năm' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
      { id: 1, tt: 'I', category: 'Hợp phần thứ nhất', isHeader: true, sectionCode: 'I' },
      { id: 2, tt: '1', category: 'Nội dung thành phần 01' },
      { id: 3, tt: '2', category: 'Nội dung thành phần 02' },
      { id: 4, tt: 'II', category: 'Hợp phần thứ hai', isHeader: true, sectionCode: 'II' },
      { id: 5, tt: '1', category: 'Nội dung thành phần 01' },
      { id: 6, tt: 'III', category: 'Nội dung khác (nếu có)', isHeader: true, sectionCode: 'III' }
    ]
  },
  {
    id: 'tmpl-b10',
    code: 'Biểu 10',
    title: 'Kết quả thực hiện bộ tiêu chí quốc gia về NTM 6 tháng..../năm... (Xã)',
    description: 'Kết quả thực hiện bộ tiêu chí quốc gia về nông thôn mới cấp xã (Kèm theo Mẫu số 04).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung', type: 'text', width: 320 },
      { id: 'unit', label: 'ĐVT', type: 'text', width: 80 },
      { id: 'prevResult', label: 'Kết quả', type: 'number', group: 'KQ đến 31/12 năm trước' },
      { id: 'prevEval', label: 'Đánh giá', type: 'boolean', group: 'KQ đến 31/12 năm trước' },
      { id: 'currResult', label: 'Kết quả', type: 'number', group: 'TH 6 tháng năm...' },
      { id: 'currEval', label: 'Đánh giá', type: 'boolean', group: 'TH 6 tháng năm...' },
      { id: 'planResult', label: 'Kết quả', type: 'number', group: 'KH 6T cuối năm...' },
      { id: 'planEval', label: 'Đánh giá', type: 'boolean', group: 'KH 6T cuối năm...' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
      { id: 1, tt: '1', category: 'Quy hoạch', unit: '' },
      { id: 2, tt: '1.1', category: 'Có quy hoạch chung xã được phê duyệt', unit: 'xã' },
      { id: 3, tt: '2', category: 'Hạ tầng kinh tế - xã hội', unit: '' },
      { id: 4, tt: '2.1', category: 'Hệ thống đường giao thông nông thôn', unit: 'km' },
      { id: 5, tt: '3', category: 'Phát triển kinh tế nông thôn', unit: '' },
      { id: 6, tt: '3.1', category: 'Tốc độ tăng thu nhập bình quân đầu người', unit: '%' }
    ]
  },
  {
    id: 'tmpl-b11',
    code: 'Biểu 11',
    title: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng năm..../năm... (Xã)',
    description: 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình (ĐVT: Triệu đồng, Kèm theo Mẫu số 04).',
    columns: [
      { id: 'tt', label: 'STT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung chỉ tiêu', type: 'text', width: 280 },
      { id: 'plan', label: 'Kế hoạch năm...', type: 'number' },
      { id: 'actual', label: 'KQ huy động 6T/năm...', type: 'number' },
      { id: 'planS2', label: 'KH 6T cuối năm...', type: 'number' }
    ],
    rows: [
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
    id: 'tmpl-b12',
    code: 'Biểu 12',
    title: 'Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng..../năm... (Xã)',
    description: 'Kết quả huy động nguồn lực đầu tư thực hiện chương trình (Kèm theo Mẫu số 04).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'NỘI DUNG THỰC HIỆN', type: 'text', width: 300 },
      // 6T - Kết quả huy động
      { id: 'hd_total', label: 'Tổng số', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_vdt_total', label: 'Tổng số', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'hd_nstw_dtpt', label: 'ĐTPT', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'hd_nstw_sn', label: 'SN', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'hd_nsdp', label: 'NSĐP', type: 'number', group: '6T - Kết quả huy động', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'hd_longGhep', label: 'Vốn lồng ghép', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_tinDung', label: 'Vốn tín dụng', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: '6T - Kết quả huy động' },
      { id: 'hd_danGop', label: 'Dân đóng góp', type: 'number', group: '6T - Kết quả huy động' },
      // KH cuối năm
      { id: 'kh_total', label: 'Tổng số', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_vdt_total', label: 'Tổng số', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'kh_nstw_dtpt', label: 'ĐTPT', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'kh_nstw_sn', label: 'SN', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp', subSubGroup: 'NSTW' },
      { id: 'kh_nsdp', label: 'NSĐP', type: 'number', group: 'KH cuối năm', subGroup: 'Vốn đầu tư trực tiếp' },
      { id: 'kh_longGhep', label: 'Vốn lồng ghép', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_tinDung', label: 'Vốn tín dụng', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_doanhNghiep', label: 'Vốn doanh nghiệp', type: 'number', group: 'KH cuối năm' },
      { id: 'kh_danGop', label: 'Dân đóng góp', type: 'number', group: 'KH cuối năm' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
      { id: 1, tt: 'I', category: 'Hợp phần thứ nhất', isHeader: true, sectionCode: 'I' },
      { id: 2, tt: '1', category: 'Nội dung thành phần 01' },
      { id: 3, tt: '2', category: 'Nội dung thành phần 02' },
      { id: 4, tt: 'II', category: 'Hợp phần thứ hai', isHeader: true, sectionCode: 'II' },
      { id: 5, tt: '1', category: 'Nội dung thành phần 01' },
      { id: 6, tt: 'III', category: 'Nội dung khác (nếu có)', isHeader: true, sectionCode: 'III' }
    ]
  },
  {
    id: 'tmpl-b13',
    code: 'Biểu 13',
    title: 'Kết quả thực hiện vốn đầu tư phát triển từ nguồn NSTW 6 tháng.../năm...',
    description: 'Kết quả thực hiện vốn đầu tư phát triển từ nguồn ngân sách trung ương (Kèm theo Mẫu số 04).',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'CÔNG TRÌNH', type: 'text', width: 300 },
      { id: 'plan', label: 'Kế hoạch năm ...', type: 'number' },
      { id: 'actual', label: 'KQ TH 6 tháng năm...', type: 'number' },
      { id: 'actualPlan', label: 'KQ TH kế hoạch năm...', type: 'number' },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 150 }
    ],
    rows: [
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
  }
];


export default function FormDesignerTab({
  userSession
}: FormDesignerTabProps) {
  const [templates, setTemplates] = useState<FormTemplate[]>(() => {
    const saved = localStorage.getItem('NTM_FormTemplates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 4) return parsed;
      } catch (e) {}
    }
    return INITIAL_FORM_TEMPLATES;
  });

  useEffect(() => {
    localStorage.setItem('NTM_FormTemplates', JSON.stringify(templates));
  }, [templates]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals / Editor view states
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<FormTemplate | null>(null);

  // Template General Info
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // Template Columns & Rows Designer states
  const [columnsList, setColumnsList] = useState<FormColumn[]>([]);
  const [rowsList, setRowsList] = useState<FormRowConfig[]>([]);

  // Temp item builders for modals
  const [newColLabel, setNewColLabel] = useState('');
  const [newColType, setNewColType] = useState<'text' | 'number' | 'boolean'>('text');
  const [newColGroup, setNewColGroup] = useState('');
  const [newColSubGroup, setNewColSubGroup] = useState('');
  
  const [newRowTT, setNewRowTT] = useState('');
  const [newRowCategory, setNewRowCategory] = useState('');
  const [newRowUnit, setNewRowUnit] = useState('Xã');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => 
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, searchQuery]);

  const handleCreateNew = () => {
    setCurrentTemplate(null);
    setFormCode('Biểu mới');
    setFormTitle('Báo cáo kết quả rà soát tiêu chí đặc thù');
    setFormDesc('Mô tả chỉ tiêu rà soát thực địa...');
    setColumnsList([
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung chỉ tiêu', type: 'text', width: 280 },
      { id: 'unit', label: 'Đơn vị tính', type: 'text', width: 100 },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 200 }
    ]);
    setRowsList([
      { id: 1, tt: '1', category: 'Chỉ tiêu mẫu A', unit: 'Xã' }
    ]);
    setIsEditingMode(true);
  };

  const handleEdit = (tmpl: FormTemplate) => {
    setCurrentTemplate(tmpl);
    setFormCode(tmpl.code);
    setFormTitle(tmpl.title);
    setFormDesc(tmpl.description || '');
    setColumnsList(tmpl.columns);
    setRowsList(tmpl.rows);
    setIsEditingMode(true);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thiết kế biểu mẫu "${code}"?`)) {
      setTemplates(templates.filter(t => t.id !== id));
      triggerToast(`Đã xóa thiết kế: ${code}`);
    }
  };

  // Add Column
  const handleAddColumn = () => {
    if (!newColLabel.trim()) return;
    const colId = `col-${Date.now()}`;
    const newCol: FormColumn = {
      id: colId,
      label: newColLabel.trim(),
      type: newColType,
      width: 150,
      ...(newColGroup.trim() ? { group: newColGroup.trim() } : {}),
      ...(newColSubGroup.trim() ? { subGroup: newColSubGroup.trim() } : {})
    };
    setColumnsList([...columnsList, newCol]);
    setNewColLabel('');
    setNewColType('text');
    setNewColGroup('');
    setNewColSubGroup('');
  };

  const handleDeleteColumn = (id: string) => {
    if (id === 'tt' || id === 'category') {
      alert('Không thể xóa cột định danh TT và Nội dung!');
      return;
    }
    setColumnsList(columnsList.filter(c => c.id !== id));
  };

  // Add Row Config
  const handleAddRow = () => {
    if (!newRowCategory.trim()) return;
    const newRow: FormRowConfig = {
      id: Date.now(),
      tt: newRowTT.trim(),
      category: newRowCategory.trim(),
      unit: newRowUnit.trim()
    };
    setRowsList([...rowsList, newRow]);
    setNewRowCategory('');
    setNewRowTT('');
    setNewRowUnit('Xã');
  };

  const handleDeleteRow = (id: number) => {
    setRowsList(rowsList.filter(r => r.id !== id));
  };

  // Save Designed Form
  const handleSaveTemplate = () => {
    if (!formCode.trim() || !formTitle.trim()) {
      alert('Vui lòng điền đầy đủ mã và tiêu đề biểu mẫu!');
      return;
    }

    const savedId = currentTemplate ? currentTemplate.id : `tmpl-${Date.now()}`;
    const newTmpl: FormTemplate = {
      id: savedId,
      code: formCode.trim(),
      title: formTitle.trim(),
      description: formDesc.trim(),
      columns: columnsList,
      rows: rowsList
    };

    let updatedTemplates;
    if (currentTemplate) {
      updatedTemplates = templates.map(t => t.id === savedId ? newTmpl : t);
      triggerToast(`Đã lưu cấu trúc chỉnh sửa của ${formCode}`);
    } else {
      updatedTemplates = [...templates, newTmpl];
      triggerToast(`Đã ban hành thiết kế biểu mẫu mới: ${formCode}`);
    }

    setTemplates(updatedTemplates);
    setIsEditingMode(false);
    
    // Auto-update report period templates in localStorage to sync reports configuration
    const savedPeriods = localStorage.getItem('NTM_Periods');
    if (savedPeriods) {
      try {
        const parsedP = JSON.parse(savedPeriods);
        // Note: when new template is saved, if a user wants to load this form into current active periods, we can sync or let them reload.
        // Let's add it to the mock periods so it can be filled in ReportPeriodsTab.
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#003b72]/95 backdrop-blur-md text-white border border-blue-500/20 py-3 px-5 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Designer layout switcher */}
      {!isEditingMode ? (
        <>
          {/* List View */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
              <span>Hệ thống</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-[#014285] font-bold">Thiết kế Bảng Biểu mẫu</span>
            </div>

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2">
              <div>
                <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Thiết kế Cấu trúc Bảng Biểu mẫu</h2>
                <p className="text-xs text-[#64748b] font-medium mt-1">
                  Công cụ tùy biến cấu trúc cột, chỉ tiêu của các biểu mẫu thu thập số liệu. Cho phép thiết kế mới biểu mẫu báo cáo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn khôi phục lại toàn bộ mẫu thiết kế hệ thống mặc định (Biểu 01 - Biểu 14)? Điều này sẽ ghi đè lên các thay đổi hiện tại.")) {
                      setTemplates(INITIAL_FORM_TEMPLATES);
                      triggerToast("Đã khôi phục toàn bộ mẫu hệ thống mặc định!");
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer border border-slate-200"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Khôi phục mẫu mặc định</span>
                </button>

                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thiết kế Biểu mẫu mới</span>
                </button>
              </div>
            </div>
          </div>

          {/* List of templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map(tmpl => (
              <div 
                key={tmpl.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                <div className="p-5 border-b border-slate-100 bg-slate-50/20">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-[#014285] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded uppercase tracking-wide">
                        {tmpl.code}
                      </span>
                      <h3 className="text-sm font-black text-[#0f2942] tracking-tight truncate mt-2">
                        {tmpl.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-semibold line-clamp-2">
                        {tmpl.description || 'Không có mô tả chi tiết.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(tmpl)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-650 transition-colors cursor-pointer"
                        title="Chỉnh sửa cấu trúc"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tmpl.id, tmpl.code)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-650 transition-colors cursor-pointer"
                        title="Xóa thiết kế"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between bg-slate-50/45 text-xs text-slate-500 font-bold border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5 text-[#014285]" />
                    <span>{tmpl.columns.length} Cột cấu trúc</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlignJustify className="w-3.5 h-3.5 text-[#014285]" />
                    <span>{tmpl.rows.length} Chỉ tiêu mặc định</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Designer Editing Canvas View */
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <button 
              onClick={() => setIsEditingMode(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-black text-[#0f2942] uppercase tracking-wide">
                {currentTemplate ? 'Chỉnh sửa Thiết kế Biểu mẫu' : 'Thiết kế Biểu mẫu Mới'}
              </h2>
              <p className="text-xs text-[#64748b] font-medium">Định nghĩa thuộc tính cột và chỉ tiêu dòng cho biểu mẫu của bạn.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Form Settings & Columns (2 columns wide) */}
            <div className="space-y-6 lg:col-span-2">
              {/* General Metadata */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-black uppercase text-[#0f2942] tracking-wider border-b border-slate-100 pb-2.5">
                  1. Thông tin chung biểu mẫu
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <label className="text-xs font-bold text-slate-650 block mb-1.5">Mã biểu mẫu <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="Ví dụ: Biểu 15"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#014285] font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-650 block mb-1.5">Tiêu đề biểu mẫu <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Nhập tiêu đề hiển thị..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#014285] font-bold"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-xs font-bold text-slate-650 block mb-1.5">Mô tả mục tiêu rà soát</label>
                  <textarea 
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Mô tả mục đích thu thập số liệu..."
                    rows={2}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#014285] font-bold resize-none"
                  />
                </div>
              </div>

              {/* Columns Config */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-black uppercase text-[#0f2942] tracking-wider border-b border-slate-100 pb-2.5 flex justify-between items-center">
                  <span>2. Thiết kế Cột Bảng ({columnsList.length} cột)</span>
                  <span className="text-[10px] text-slate-400 normal-case">Hệ thống tự tạo cột dữ liệu dựa trên danh sách này</span>
                </h3>

                {/* List of current columns */}
                <div className="flex flex-wrap gap-2.5">
                  {columnsList.map(c => (
                    <div 
                      key={c.id} 
                      className="px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700"
                    >
                      <Columns className="w-3.5 h-3.5 text-[#014285]" />
                      <span>{c.label}</span>
                      <span className="text-[9px] text-slate-400 bg-slate-100 px-1 rounded uppercase">{c.type}</span>
                      {c.group && (
                        <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-200 px-1 rounded">{c.group}</span>
                      )}
                      {c.subGroup && (
                        <span className="text-[9px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-1 rounded">{c.subGroup}</span>
                      )}
                      {c.id !== 'tt' && c.id !== 'category' && (
                        <button 
                          onClick={() => handleDeleteColumn(c.id)}
                          className="text-slate-450 hover:text-rose-600 transition-colors ml-1 font-bold"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add column tool */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3 text-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                      <input 
                        type="text" 
                        placeholder="Tên cột mới (Ví dụ: Số liệu 6 tháng...)"
                        value={newColLabel}
                        onChange={(e) => setNewColLabel(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 bg-white rounded-lg outline-none font-bold"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <select
                        value={newColType}
                        onChange={(e) => setNewColType(e.target.value as any)}
                        className="w-full text-xs p-2 border border-slate-300 bg-white rounded-lg outline-none font-bold text-slate-700"
                      >
                        <option value="text">Chữ (Text)</option>
                        <option value="number">Số lượng (Number)</option>
                        <option value="boolean">Đúng/Sai (Boolean)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                      <input 
                        type="text" 
                        placeholder="Nhóm cột (Group) - VD: Xã nhóm 1, NSTW..."
                        value={newColGroup}
                        onChange={(e) => setNewColGroup(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 bg-white rounded-lg outline-none font-bold"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input 
                        type="text" 
                        placeholder="Nhóm phụ (Sub-group) - VD: ĐTPT, SN..."
                        value={newColSubGroup}
                        onChange={(e) => setNewColSubGroup(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 bg-white rounded-lg outline-none font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="w-full sm:w-auto px-4 py-2 bg-[#014285] hover:bg-[#002d5c] text-white rounded-lg font-bold shrink-0 cursor-pointer"
                    >
                      Thêm Cột
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Rows/Indicators Setup (1 column wide) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase text-[#0f2942] tracking-wider border-b border-slate-100 pb-2.5">
                  3. Thiết lập chỉ tiêu dòng ({rowsList.length} dòng)
                </h3>

                {/* Add row tool */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mt-3 text-xs font-semibold">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Thứ tự TT</label>
                      <input 
                        type="text" 
                        placeholder="1.1, I, ..."
                        value={newRowTT}
                        onChange={(e) => setNewRowTT(e.target.value)}
                        className="w-full text-xs p-1.5 border border-slate-300 bg-white rounded outline-none font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Đơn vị tính</label>
                      <input 
                        type="text" 
                        placeholder="Xã, Hộ, %, Triệu..."
                        value={newRowUnit}
                        onChange={(e) => setNewRowUnit(e.target.value)}
                        className="w-full text-xs p-1.5 border border-slate-300 bg-white rounded outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Tên chỉ tiêu/Nội dung rà soát <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Nhập tên nội dung..."
                      value={newRowCategory}
                      onChange={(e) => setNewRowCategory(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 bg-white rounded-lg outline-none font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ListPlus className="w-4 h-4" />
                    <span>Thêm chỉ tiêu dòng</span>
                  </button>
                </div>

                {/* Rows list summary */}
                <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {rowsList.map(r => (
                    <div 
                      key={r.id} 
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {r.tt && <span className="text-[10px] font-black text-[#014285] bg-blue-50 border border-blue-200 px-1.5 rounded">{r.tt}</span>}
                          <span className="text-[10px] text-slate-400 font-bold">({r.unit})</span>
                        </div>
                        <p className="font-bold text-slate-850 truncate mt-1">{r.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteRow(r.id)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Xóa dòng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons to save form template */}
              <div className="pt-4 border-t border-slate-100 flex gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingMode(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-650 text-xs font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy thiết kế
                </button>
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-black uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Ban hành biểu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Helper Back Icon
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
