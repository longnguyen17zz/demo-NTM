import { CriterionRow, ReportMeta, NotificationItem, ResourceInvestRow, CommuneSubmission } from './types';

export const INITIAL_CRITERIA_ROWS: CriterionRow[] = [
  {
    id: 1,
    category: "Quy hoạch",
    unit: "Xã",
    group1: { prevYear: 14, currentS1: 15, planS2: 15 },
    group2: { prevYear: 8, currentS1: 9, planS2: 10 },
    group3: { prevYear: 5, currentS1: 6, planS2: 7 },
    note: "Đã phê duyệt điều chỉnh quy hoạch chung"
  },
  {
    id: 2,
    category: "Hạ tầng kinh tế - xã hội",
    unit: "Xã",
    group1: { prevYear: 12, currentS1: 14, planS2: 15 },
    group2: { prevYear: 7, currentS1: 8, planS2: 10 },
    group3: { prevYear: 4, currentS1: 4, planS2: 6 },
    note: "Một số tuyến đường liên thôn đang thi công"
  },
  {
    id: 3,
    category: "Phát triển kinh tế nông thôn",
    unit: "Xã",
    group1: { prevYear: 15, currentS1: 15, planS2: 15 },
    group2: { prevYear: 9, currentS1: 10, planS2: 10 },
    group3: { prevYear: 3, currentS1: 5, planS2: 6 },
    note: "Đưa thêm 2 sản phẩm OCOP đạt 3 sao"
  },
  {
    id: 4,
    category: "Đào tạo nguồn nhân lực nông thôn",
    unit: "Xã",
    group1: { prevYear: 11, currentS1: 12, planS2: 13 },
    group2: { prevYear: 6, currentS1: 7, planS2: 8 },
    group3: { prevYear: 2, currentS1: 3, planS2: 4 },
    note: "Khảo sát nhu cầu học nghề phi nông nghiệp"
  },
  {
    id: 5,
    category: "Văn hóa, Giáo dục, Y tế",
    unit: "Xã",
    group1: { prevYear: 13, currentS1: 14, planS2: 15 },
    group2: { prevYear: 8, currentS1: 8, planS2: 9 },
    group3: { prevYear: 4, currentS1: 4, planS2: 5 },
    note: "Nâng cấp cơ sở vật chất trạm y tế"
  },
  {
    id: 6,
    category: "Giảm nghèo và An sinh xã hội",
    unit: "Xã",
    group1: { prevYear: 14, currentS1: 15, planS2: 15 },
    group2: { prevYear: 7, currentS1: 9, planS2: 10 },
    group3: { prevYear: 3, currentS1: 4, planS2: 5 },
    note: "Tỷ lệ hộ nghèo đa chiều giảm mạnh"
  },
  {
    id: 7,
    category: "Khoa học công nghệ và Chuyển đổi số",
    unit: "Xã",
    group1: { prevYear: 9, currentS1: 11, planS2: 12 },
    group2: { prevYear: 5, currentS1: 6, planS2: 8 },
    group3: { prevYear: 1, currentS1: 3, planS2: 4 },
    note: "Đạt mục tiêu lắp đặt loa thông minh không dây"
  },
  {
    id: 8,
    category: "Môi trường và cảnh quan nông thôn",
    unit: "Xã",
    group1: { prevYear: 10, currentS1: 12, planS2: 13 },
    group2: { prevYear: 6, currentS1: 7, planS2: 8 },
    group3: { prevYear: 2, currentS1: 3, planS2: 5 },
    note: "Tăng tần suất thu gom chất thải sinh hoạt"
  },
  {
    id: 9,
    category: "Xây dựng hệ thống chính trị và Hành chính công",
    unit: "Xã",
    group1: { prevYear: 13, currentS1: 14, planS2: 15 },
    group2: { prevYear: 8, currentS1: 9, planS2: 10 },
    group3: { prevYear: 3, currentS1: 4, planS2: 5 },
    note: "Cải cách thủ tục hành chính, mức độ hài lòng đạt 95%"
  },
  {
    id: 10,
    category: "Tiếp cận pháp luật và An ninh, Quốc phòng",
    unit: "Xã",
    group1: { prevYear: 15, currentS1: 15, planS2: 15 },
    group2: { prevYear: 9, currentS1: 9, planS2: 10 },
    group3: { prevYear: 5, currentS1: 5, planS2: 6 },
    note: "An ninh nông thôn luôn giữ vững ổn định"
  }
];

export const INITIAL_CRITERIA_ROWS_08: CriterionRow[] = [
  {
    id: 1,
    category: "Giao thông",
    unit: "Công trình",
    group1: { prevYear: 5000, currentS1: 2500, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Nâng cấp bê tông hóa đường liên xã"
  },
  {
    id: 2,
    category: "Thủy lợi",
    unit: "Công trình",
    group1: { prevYear: 3000, currentS1: 1500, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Kiên cố hóa kênh mương nội đồng"
  },
  {
    id: 3,
    category: "Phòng chống, thiên tai",
    unit: "Công trình",
    group1: { prevYear: 1000, currentS1: 500, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Gia cố đê bao kết hợp giao thông nông thôn"
  },
  {
    id: 4,
    category: "Điện",
    unit: "Công trình",
    group1: { prevYear: 2000, currentS1: 1000, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Cải tạo và nâng cấp hệ thống hạ áp"
  },
  {
    id: 5,
    category: "Cơ sở hạ tầng thương mại nông thôn",
    unit: "Công trình",
    group1: { prevYear: 1500, currentS1: 750, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Xây dựng khu ki-ốt chợ trung tâm xã"
  },
  {
    id: 6,
    category: "CSHT vùng nguyên liệu tập trung",
    unit: "Công trình",
    group1: { prevYear: 1200, currentS1: 600, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Đầu tư đường trục chính nội đồng"
  },
  {
    id: 7,
    category: "Hạ tầng số, hạ tầng viễn thông",
    unit: "Công trình",
    group1: { prevYear: 800, currentS1: 400, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Phủ sóng internet cáp quang đến các thôn"
  },
  {
    id: 8,
    category: "Hệ thống truyền thanh",
    unit: "Công trình",
    group1: { prevYear: 500, currentS1: 250, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Nâng cấp cụm loa truyền thanh thông minh"
  },
  {
    id: 9,
    category: "Công trình cung cấp nước sạch tập trung",
    unit: "Công trình",
    group1: { prevYear: 2500, currentS1: 1250, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Cải tạo nâng cấp nhà máy nước xã"
  },
  {
    id: 10,
    category: "CSHT phục vụ bảo vệ môi trường nông thôn",
    unit: "Công trình",
    group1: { prevYear: 1800, currentS1: 900, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Xây dựng bãi trung chuyển xử lý rác thải"
  },
  {
    id: 11,
    category: "CSHT bố trí, ổn định dân cư",
    unit: "Công trình",
    group1: { prevYear: 1500, currentS1: 750, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Hỗ trợ di dời sạt lở bờ sông vùng lũ"
  },
  {
    id: 12,
    category: "Hạ tầng cơ sở dữ liệu, thông tin phục vụ quản lý Chương trình",
    unit: "Công trình",
    group1: { prevYear: 1000, currentS1: 500, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Đầu tư thiết bị phòng họp trực tuyến"
  },
  {
    id: 13,
    category: "CSHT đặc thù vùng đồng bào dân tộc thiểu số và miền núi",
    unit: "Công trình",
    group1: { prevYear: 2700, currentS1: 1350, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Xây dựng nhà sinh hoạt cộng đồng khang trang"
  }
];

export const INITIAL_CRITERIA_ROWS_06: CriterionRow[] = [
  {
    id: 1,
    tt: "I",
    category: "Kết quả thực hiện xây dựng NTM cấp xã",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 2,
    tt: "1",
    category: "Tổng số xã thực hiện XD NTM trên địa bàn",
    unit: "",
    group1: { prevYear: 15, currentS1: 15, planS2: 15 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 3,
    tt: "1.1",
    category: "Xã nhóm 1",
    unit: "",
    group1: { prevYear: 5, currentS1: 5, planS2: 5 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 4,
    tt: "1.2",
    category: "Xã nhóm 2",
    unit: "",
    group1: { prevYear: 6, currentS1: 6, planS2: 6 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 5,
    tt: "1.3",
    category: "Xã nhóm 3",
    unit: "",
    group1: { prevYear: 4, currentS1: 4, planS2: 4 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 6,
    tt: "2",
    category: "Số xã đạt 10 tiêu chí",
    unit: "",
    group1: { prevYear: 10, currentS1: 11, planS2: 12 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 7,
    tt: "2.1",
    category: "Số xã có QĐ công nhận đạt chuẩn NTM",
    unit: "",
    group1: { prevYear: 8, currentS1: 9, planS2: 10 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 8,
    tt: "-",
    category: "Xã nhóm 1",
    unit: "",
    group1: { prevYear: 3, currentS1: 4, planS2: 4 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 9,
    tt: "-",
    category: "Xã nhóm 2",
    unit: "",
    group1: { prevYear: 3, currentS1: 3, planS2: 4 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 10,
    tt: "-",
    category: "Xã nhóm 3",
    unit: "",
    group1: { prevYear: 2, currentS1: 2, planS2: 2 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 11,
    tt: "2.2",
    category: "Số xã đang hoàn thiện thủ tục trình cấp có thẩm quyền công nhận đạt chuẩn NTM",
    unit: "",
    group1: { prevYear: 2, currentS1: 2, planS2: 2 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 12,
    tt: "-",
    category: "Xã nhóm 1",
    unit: "",
    group1: { prevYear: 1, currentS1: 1, planS2: 1 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 13,
    tt: "-",
    category: "Xã nhóm 2",
    unit: "",
    group1: { prevYear: 1, currentS1: 1, planS2: 1 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 14,
    tt: "-",
    category: "Xã nhóm 3",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 15,
    tt: "2.3",
    category: "Số xã có QĐ công nhận đạt NTM hiện đại",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 16,
    tt: "3",
    category: "Số xã đạt từ 5 - 9 tiêu chí",
    unit: "",
    group1: { prevYear: 3, currentS1: 2, planS2: 1 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 17,
    tt: "-",
    category: "Xã nhóm 1",
    unit: "",
    group1: { prevYear: 1, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 18,
    tt: "-",
    category: "Xã nhóm 2",
    unit: "",
    group1: { prevYear: 1, currentS1: 1, planS2: 1 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 19,
    tt: "-",
    category: "Xã nhóm 3",
    unit: "",
    group1: { prevYear: 1, currentS1: 1, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 20,
    tt: "4",
    category: "Số xã đạt dưới 5 tiêu chí",
    unit: "",
    group1: { prevYear: 2, currentS1: 2, planS2: 2 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 21,
    tt: "-",
    category: "Xã nhóm 1",
    unit: "",
    group1: { prevYear: 1, currentS1: 1, planS2: 1 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 22,
    tt: "-",
    category: "Xã nhóm 2",
    unit: "",
    group1: { prevYear: 1, currentS1: 1, planS2: 1 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 23,
    tt: "-",
    category: "Xã nhóm 3",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 24,
    tt: "II",
    category: "Kết quả thực hiện không còn xã, thôn ĐBKK",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 25,
    tt: "-",
    category: "Số xã ra khỏi diện ĐBKK (nếu có)",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 26,
    tt: "-",
    category: "Số thôn ra khỏi diện ĐBKK (nếu có)",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  },
  {
    id: 27,
    tt: "III",
    category: "Kết quả tỉnh, thành phố hoàn thành nhiệm vụ xây dựng NTM (nếu có)",
    unit: "",
    group1: { prevYear: 0, currentS1: 0, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: ""
  }
];

export const INITIAL_CRITERIA_ROWS_13: CriterionRow[] = [
  {
    id: 1,
    category: "Thu nhập bình quân đầu người",
    unit: "Triệu đồng/người/năm",
    group1: { prevYear: 55, currentS1: 56, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Tăng trưởng ổn định đạt chỉ tiêu xã nông thôn mới"
  },
  {
    id: 2,
    category: "Tỷ lệ hộ nghèo đa chiều",
    unit: "%",
    group1: { prevYear: 4, currentS1: 3, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Giảm sâu nhờ các chính sách xã hội kết hợp đào tạo nghề"
  },
  {
    id: 3,
    category: "Tỷ lệ người dân tham gia bảo hiểm y tế",
    unit: "%",
    group1: { prevYear: 92, currentS1: 95, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Vượt chỉ tiêu tối thiểu của bộ tiêu chí quốc gia"
  },
  {
    id: 4,
    category: "Tỷ lệ hộ có nhà ở kiên cố đạt chuẩn",
    unit: "%",
    group1: { prevYear: 88, currentS1: 90, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Hỗ trợ xóa các hộ nhà tạm, dột nát trong năm"
  },
  {
    id: 5,
    category: "Tỷ lệ hộ được sử dụng nước sạch hợp vệ sinh",
    unit: "%",
    group1: { prevYear: 90, currentS1: 92, planS2: 0 },
    group2: { prevYear: 0, currentS1: 0, planS2: 0 },
    group3: { prevYear: 0, currentS1: 0, planS2: 0 },
    note: "Nâng cấp cải thiện chất lượng lọc nước tập trung"
  }
];

export const INITIAL_RESOURCE_ROWS: ResourceInvestRow[] = [
  {
    id: 1,
    isHeader: true,
    sectionCode: "I",
    category: "Hợp phần thứ nhất",
    quantity: 0,
    hd_nstw_dtpt: 0, hd_nstw_sn: 0, hd_nsdp: 0, hd_longGhep: 0, hd_tinDung: 0, hd_doanhNghiep: 0, hd_danGop: 0,
    kh_nstw_dtpt: 0, kh_nstw_sn: 0, kh_nsdp: 0, kh_longGhep: 0, kh_tinDung: 0, kh_doanhNghiep: 0, kh_danGop: 0,
    note: ""
  },
  {
    id: 2,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 01",
    quantity: 120,
    hd_nstw_dtpt: 1500, hd_nstw_sn: 500, hd_nsdp: 800, hd_longGhep: 300, hd_tinDung: 1000, hd_doanhNghiep: 400, hd_danGop: 200,
    kh_nstw_dtpt: 1200, kh_nstw_sn: 400, kh_nsdp: 600, kh_longGhep: 200, kh_tinDung: 800, kh_doanhNghiep: 300, kh_danGop: 150,
    note: "Đầu tư xây dựng hạ tầng cơ sở và quy hoạch"
  },
  {
    id: 3,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 02",
    quantity: 85,
    hd_nstw_dtpt: 820, hd_nstw_sn: 310, hd_nsdp: 510, hd_longGhep: 210, hd_tinDung: 510, hd_doanhNghiep: 210, hd_danGop: 110,
    kh_nstw_dtpt: 910, kh_nstw_sn: 210, kh_nsdp: 460, kh_longGhep: 160, kh_tinDung: 610, kh_doanhNghiep: 260, kh_danGop: 90,
    note: "Hạ tầng kỹ thuật giao thông & thuỷ lợi liên xã"
  },
  {
    id: 4,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 03",
    quantity: 45,
    hd_nstw_dtpt: 450, hd_nstw_sn: 150, hd_nsdp: 300, hd_longGhep: 100, hd_tinDung: 200, hd_doanhNghiep: 100, hd_danGop: 50,
    kh_nstw_dtpt: 500, kh_nstw_sn: 100, kh_nsdp: 250, kh_longGhep: 50, kh_tinDung: 300, kh_doanhNghiep: 150, kh_danGop: 50,
    note: "Phát triển sản xuất nông nghiệp hàng hóa, liên kết chuỗi"
  },
  {
    id: 5,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 04",
    quantity: 30,
    hd_nstw_dtpt: 300, hd_nstw_sn: 100, hd_nsdp: 200, hd_longGhep: 50, hd_tinDung: 150, hd_doanhNghiep: 50, hd_danGop: 30,
    kh_nstw_dtpt: 350, kh_nstw_sn: 50, kh_nsdp: 150, kh_longGhep: 50, kh_tinDung: 200, kh_doanhNghiep: 50, kh_danGop: 20,
    note: "Giảm nghèo đa chiều vùng đặc biệt khó khăn"
  },
  {
    id: 6,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 05",
    quantity: 65,
    hd_nstw_dtpt: 600, hd_nstw_sn: 200, hd_nsdp: 400, hd_longGhep: 150, hd_tinDung: 400, hd_doanhNghiep: 150, hd_danGop: 80,
    kh_nstw_dtpt: 650, kh_nstw_sn: 150, kh_nsdp: 350, kh_longGhep: 100, kh_tinDung: 500, kh_doanhNghiep: 100, kh_danGop: 60,
    note: "Nâng cao chất lượng giáo dục vùng nông thôn"
  },
  {
    id: 7,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 06",
    quantity: 40,
    hd_nstw_dtpt: 400, hd_nstw_sn: 120, hd_nsdp: 250, hd_longGhep: 80, hd_tinDung: 300, hd_doanhNghiep: 80, hd_danGop: 40,
    kh_nstw_dtpt: 450, kh_nstw_sn: 100, kh_nsdp: 200, kh_longGhep: 60, kh_tinDung: 250, kh_doanhNghiep: 70, kh_danGop: 30,
    note: "Nâng cấp hạ tầng y tế cơ sở và y tế dự phòng"
  },
  {
    id: 8,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 07",
    quantity: 50,
    hd_nstw_dtpt: 480, hd_nstw_sn: 160, hd_nsdp: 320, hd_longGhep: 110, hd_tinDung: 250, hd_doanhNghiep: 120, hd_danGop: 70,
    kh_nstw_dtpt: 520, kh_nstw_sn: 140, kh_nsdp: 280, kh_longGhep: 90, kh_tinDung: 300, kh_doanhNghiep: 100, kh_danGop: 50,
    note: "Bảo tồn phát triển thiết chế văn hoá Cơ sở nông thôn"
  },
  {
    id: 9,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 08",
    quantity: 75,
    hd_nstw_dtpt: 710, hd_nstw_sn: 230, hd_nsdp: 450, hd_longGhep: 140, hd_tinDung: 380, hd_doanhNghiep: 160, hd_danGop: 90,
    kh_nstw_dtpt: 730, kh_nstw_sn: 190, kh_nsdp: 410, kh_longGhep: 120, kh_tinDung: 400, kh_doanhNghiep: 130, kh_danGop: 80,
    note: "Môi trường và nước sạch vệ sinh nông thôn"
  },
  {
    id: 10,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 09",
    quantity: 28,
    hd_nstw_dtpt: 260, hd_nstw_sn: 90, hd_nsdp: 180, hd_longGhep: 60, hd_tinDung: 120, hd_doanhNghiep: 60, hd_danGop: 30,
    kh_nstw_dtpt: 290, kh_nstw_sn: 70, kh_nsdp: 160, kh_longGhep: 40, kh_tinDung: 150, kh_doanhNghiep: 50, kh_danGop: 20,
    note: "Tăng cường năng lực hệ thống chính trị vững mạnh"
  },
  {
    id: 11,
    isHeader: false,
    sectionCode: "I",
    category: "Nội dung thành phần 10",
    quantity: 35,
    hd_nstw_dtpt: 330, hd_nstw_sn: 110, hd_nsdp: 210, hd_longGhep: 70, hd_tinDung: 160, hd_doanhNghiep: 75, hd_danGop: 45,
    kh_nstw_dtpt: 360, kh_nstw_sn: 90, kh_nsdp: 190, kh_longGhep: 55, kh_tinDung: 180, kh_doanhNghiep: 60, kh_danGop: 30,
    note: "Đảm bảo quốc phòng và an ninh nông thôn"
  },
  {
    id: 12,
    isHeader: true,
    sectionCode: "II",
    category: "Hợp phần thứ hai",
    quantity: 0,
    hd_nstw_dtpt: 0, hd_nstw_sn: 0, hd_nsdp: 0, hd_longGhep: 0, hd_tinDung: 0, hd_doanhNghiep: 0, hd_danGop: 0,
    kh_nstw_dtpt: 0, kh_nstw_sn: 0, kh_nsdp: 0, kh_longGhep: 0, kh_tinDung: 0, kh_doanhNghiep: 0, kh_danGop: 0,
    note: ""
  },
  {
    id: 13,
    isHeader: false,
    sectionCode: "II",
    category: "Nội dung thành phần 01",
    quantity: 90,
    hd_nstw_dtpt: 1000, hd_nstw_sn: 400, hd_nsdp: 700, hd_longGhep: 200, hd_tinDung: 800, hd_doanhNghiep: 300, hd_danGop: 150,
    kh_nstw_dtpt: 1100, kh_nstw_sn: 300, kh_nsdp: 600, kh_longGhep: 150, kh_tinDung: 700, kh_doanhNghiep: 250, kh_danGop: 100,
    note: "Dự án liên vùng phát triển hạ tầng chuỗi"
  },
  {
    id: 14,
    isHeader: false,
    sectionCode: "II",
    category: "Nội dung thành phần 02",
    quantity: 55,
    hd_nstw_dtpt: 550, hd_nstw_sn: 200, hd_nsdp: 350, hd_longGhep: 100, hd_tinDung: 300, hd_doanhNghiep: 100, hd_danGop: 50,
    kh_nstw_dtpt: 600, kh_nstw_sn: 150, kh_nsdp: 300, kh_longGhep: 100, kh_tinDung: 400, kh_doanhNghiep: 150, kh_danGop: 50,
    note: "Chuyển giao và đào tạo khoa học kỹ thuật thông minh"
  },
  {
    id: 15,
    isHeader: false,
    sectionCode: "II",
    category: "Nội dung thành phần 03",
    quantity: 42,
    hd_nstw_dtpt: 410, hd_nstw_sn: 140, hd_nsdp: 260, hd_longGhep: 90, hd_tinDung: 220, hd_doanhNghiep: 90, hd_danGop: 40,
    kh_nstw_dtpt: 430, kh_nstw_sn: 110, kh_nsdp: 220, kh_longGhep: 70, kh_tinDung: 250, kh_doanhNghiep: 80, kh_danGop: 30,
    note: "Nâng cao năng lực truyền thông số và hội nhập"
  },
  {
    id: 16,
    isHeader: false,
    sectionCode: "II",
    category: "Nội dung thành phần 04",
    quantity: 38,
    hd_nstw_dtpt: 360, hd_nstw_sn: 130, hd_nsdp: 240, hd_longGhep: 80, hd_tinDung: 190, hd_doanhNghiep: 80, hd_danGop: 35,
    kh_nstw_dtpt: 390, kh_nstw_sn: 100, kh_nsdp: 200, kh_longGhep: 60, kh_tinDung: 210, kh_doanhNghiep: 70, kh_danGop: 25,
    note: "Kiểm tra, đánh giá chất lượng tiêu chuẩn quốc gia"
  },
  {
    id: 17,
    isHeader: false,
    sectionCode: "II",
    category: "Nội dung thành phần 05",
    quantity: 48,
    hd_nstw_dtpt: 470, hd_nstw_sn: 160, hd_nsdp: 310, hd_longGhep: 110, hd_tinDung: 230, hd_doanhNghiep: 110, hd_danGop: 55,
    kh_nstw_dtpt: 490, kh_nstw_sn: 130, kh_nsdp: 270, kh_longGhep: 90, kh_tinDung: 260, kh_doanhNghiep: 95, kh_danGop: 40,
    note: "Vận hành chuyển giao kỹ năng số vùng sâu vùng xa"
  },
  {
    id: 18,
    isHeader: true,
    sectionCode: "III",
    category: "Nội dung khác (nếu có)",
    quantity: 0,
    hd_nstw_dtpt: 0, hd_nstw_sn: 0, hd_nsdp: 0, hd_longGhep: 0, hd_tinDung: 0, hd_doanhNghiep: 0, hd_danGop: 0,
    kh_nstw_dtpt: 0, kh_nstw_sn: 0, kh_nsdp: 0, kh_longGhep: 0, kh_tinDung: 0, kh_doanhNghiep: 0, kh_danGop: 0,
    note: ""
  },
  {
    id: 19,
    isHeader: false,
    sectionCode: "III",
    category: "Nội dung phát sinh cục bộ",
    quantity: 15,
    hd_nstw_dtpt: 200, hd_nstw_sn: 80, hd_nsdp: 120, hd_longGhep: 40, hd_tinDung: 150, hd_doanhNghiep: 50, hd_danGop: 20,
    kh_nstw_dtpt: 250, kh_nstw_sn: 50, kh_nsdp: 100, kh_longGhep: 30, kh_tinDung: 200, kh_doanhNghiep: 50, kh_danGop: 10,
    note: "Hỗ trợ khẩn cấp phục hồi sau thiên tai bão lũ"
  }
];

export const INITIAL_REPORT_META: ReportMeta = {
  title: "KẾT QUẢ HUY ĐỘNG VÀ THỰC HIỆN NGUỒN LỰC ĐẦU TƯ THỰC HIỆN CHƯƠNG TRÌNH 6 THÁNG.../NĂM...",
  subTitle: "Kèm theo Mẫu số 03",
  code: "Phụ biểu số 09",
  status: "UPDATING",
  deadline: "30/06/2024",
  updatedAt: "2026-05-20T03:01:44Z",
  editor: "Nguyễn Văn An",
  role: "Cán bộ Tỉnh",
  proofFiles: [
    { name: "QuyetDinhApprovalcommunes_Group1.pdf", size: 12582912, uploadedAt: "2026-05-18", type: "pdf" },
    { name: "KeHoachNongThonMoi_GiaiDoan2_Sign.xlsx", size: 4120576, uploadedAt: "2026-05-19", type: "xlsx" }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    content: "Hạn chót gửi báo cáo Phụ biểu số 05 đang đến gần (30/06/2024). Vui lòng kiểm tra lại số liệu.",
    time: "32 phút trước",
    type: "warning",
    read: false
  },
  {
    id: "n-2",
    content: "Ủy Ban Nhân Dân Xã Nhóm 2 vừa cập nhật báo cáo tiến độ chi tiết về hạ tầng.",
    time: "2 giờ trước",
    type: "info",
    read: false
  },
  {
    id: "n-3",
    content: "Đã duyệt báo cáo 6 tháng đầu năm của Xã đại diện Nhóm 1 (Hải Đường, Hải Hậu).",
    time: "1 ngày trước",
    type: "success",
    read: true
  },
  {
    id: "n-4",
    content: "Cảnh báo: Tiêu chí chuyển đổi số xã Nhóm 3 chưa đạt kế hoạch mục tiêu.",
    time: "3 ngày trước",
    type: "alert",
    read: true
  }
];

// Rich datasets for the Statistics and Overview page
export const OVERVIEW_SUMMARY_STATS = {
  totalCommunes: 45,
  completedCommunes: 28, // Meet NTM status
  percentCommunes: 62.2,
  pendingCommunes: 12,
  underRevisionCommunes: 5,
};

export const CHANNELS_OF_PROGRESS = [
  { name: "Tháng 01", group1: 10, group2: 6, group3: 2 },
  { name: "Tháng 02", group1: 12, group2: 7, group3: 3 },
  { name: "Tháng 03", group1: 13, group2: 7, group3: 3 },
  { name: "Tháng 04", group1: 14, group2: 8, group3: 4 },
  { name: "Tháng 05", group1: 15, group2: 9, group3: 5 }
];

export const CRITERIA_COMPLETION_PIE = [
  { name: "Đạt tiêu chí", value: 28, color: "#10B981" },
  { name: "Cận đạt (80-99%)", value: 12, color: "#3B82F6" },
  { name: "Chưa đạt (<80%)", value: 5, color: "#F59E0B" }
];

export const DETAILED_METRIC_DESCRIPTIONS = [
  {
    id: 1,
    title: "Tiêu chí 1: Quy hoạch",
    description: "Yêu cầu có quy hoạch chung xây dựng xã được phê duyệt phù hợp với quy hoạch vùng huyện và được công bố công khai. Đạt yêu cầu về quản lý xây dựng theo quy hoạch.",
    indicator: "Có ban quản lý và quy định quản lý quy hoạch đúng pháp luật.",
    weight: "10%"
  },
  {
    id: 2,
    title: "Tiêu chí 2: Giao thông & Hạ tầng kỹ thuật",
    description: "Đường xã và đường trung tâm xã đến đường huyện được nhựa hóa hoặc bê tông hóa, bảo đảm ô tô đi lại thuận tiện quanh năm.",
    indicator: "Tỷ lệ km đường trục thôn, bản được cứng hóa đạt chuẩn tối thiểu 70% trở lên.",
    weight: "15%"
  },
  {
    id: 3,
    title: "Tiêu chí 3: Thủy lợi và Phòng chống thiên tai",
    description: "Hệ thống thủy lợi bảo đảm chủ động tưới, tiêu cho diện tích đất sản xuất nông nghiệp đạt chuẩn từ 80% trở lên.",
    indicator: "Có các tổ chức hợp tác xã dùng nước hoạt động bền vững.",
    weight: "8%"
  },
  {
    id: 4,
    title: "Tiêu chí 4: Điện nông thôn",
    description: "Hệ thống điện đạt chuẩn kỹ thuật của ngành điện. Tỷ lệ hộ sử dụng điện thường xuyên, an toàn từ các nguồn đạt từ 98% trở lên.",
    indicator: "Nguồn cung cấp điện ổn định, hạ tầng điện nông thôn đảm bảo phòng chống cháy nổ.",
    weight: "5%"
  },
  {
    id: 5,
    title: "Tiêu chí 5: Giáo dục & Đào tạo nghề",
    description: "Nhà trường các cấp có cơ sở vật chất và thiết bị dạy học đạt chuẩn quốc gia. Đạt chuẩn xóa mù chữ và phổ cập giáo dục cấp trung học cơ sở.",
    indicator: "Tỷ lệ học sinh tốt nghiệp THCS tiếp tục đi học trung học hoặc học nghề tối thiểu đạt 75%.",
    weight: "12%"
  },
  {
    id: 6,
    title: "Tiêu chí 6: Cơ sở vật chất Văn hóa",
    description: "Xã có nhà văn hóa hoặc hội trường đa năng có quy mô chỗ ngồi đạt chuẩn, có sân thể thao phục vụ cộng đồng.",
    indicator: "Tỷ lệ thôn, bản có khu thể thao, nhà văn hóa đạt chuẩn tối thiểu từ 70% trở lên.",
    weight: "5%"
  },
  {
    id: 7,
    title: "Tiêu chí 7: Cơ sở hạ tầng thương mại nông thôn",
    description: "Xã có chợ nông thôn hoặc siêu thị mini xây dựng đúng quy chuẩn quốc gia, ban quản lý hoạt động hiệu quả.",
    indicator: "Có khu vực vệ sinh công cộng, đảm bảo vệ sinh an toàn thực phẩm.",
    weight: "5%"
  },
  {
    id: 8,
    title: "Tiêu chí 8: Thông tin và Truyền thông",
    description: "Xã có điểm phục vụ bưu chính viễn thông có Internet tốc độ cao. Có đài truyền thanh phát thanh đến toàn bộ các khu dân cư.",
    indicator: "Có ứng dụng công nghệ thông tin trong giải quyết dịch vụ công cấp xã.",
    weight: "10%"
  },
  {
    id: 9,
    title: "Tiêu chí 9: Nhà ở dân cư nông thôn",
    description: "Không còn nhà tạm, nhà dột nát trên địa bàn xã. Tỷ lệ hộ gia đình có nhà ở kiên cố hoặc bán kiên cố đạt từ 90% trở lên.",
    indicator: "Diện tích nhà ở bình quân đầu người đạt mức tối thiểu 15-20 m2/người.",
    weight: "15%"
  },
  {
    id: 10,
    title: "Tiêu chí 10: Thu nhập & Phát triển kinh tế",
    description: "Mức thu nhập bình quân đầu người của xã đạt tối thiểu từ 53 triệu đồng/người/năm trở lên (điều chỉnh tăng theo từng năm và từng vùng cụ thể).",
    indicator: "Có các chuỗi mô hình liên kết sản xuất nông nghiệp ứng dụng công nghệ cao.",
    weight: "15%"
  }
];

export const INITIAL_DICTIONARY_CRITERIA = [
  {
    id: "c1",
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
    id: "c2",
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
    id: "c3",
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
    id: "c4",
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
    id: "c5",
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
    id: "c6",
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
    id: "c7",
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
    id: "c8",
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
    id: "c9",
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
    id: "c10",
    code: "TC10",
    title: "Y tế cơ sở",
    description: "Trạm y tế xã có đủ điều kiện khám chữa bệnh bảo hiểm y tế, có sổ theo dõi sức khỏe điện tử cho trên 90% dân cư",
    indicator: "Độ phủ chăm sóc y tế toàn dân.",
    weight: "10%",
    category: "Hạ tầng Kinh tế - Xã hội",
    group1Threshold: "Đat",
    group2Threshold: "Đat",
    group3Threshold: "Đat",
    thresholdType: "boolean",
    proofs: ["Giấy chứng nhận Y tế điện tử"]
  },
  {
    id: "c11",
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

export const FORM_METAS = [
  { code: "Biểu 04", title: "CÁC CƠ CHẾ, CHÍNH SÁCH DO ĐỊA PHƯƠNG BAN HÀNH ĐỂ THỰC HIỆN CHƯƠNG TRÌNH GIAI ĐOẠN 2026-2030" },
  { code: "Biểu 05", title: "KẾT QUẢ THỰC HIỆN BỘ TIÊU CHÍ QUỐC GIA VỀ NÔNG THÔN MỚI 6 THÁNG…./NĂM…" },
  { code: "Biểu 06", title: "Kết quả thực hiện chương trình 6 tháng / năm ... (Tỉnh)" },
  { code: "Biểu 07", title: "Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng / năm ... (Tỉnh)" },
  { code: "Biểu 08", title: "Kết quả thực hiện vốn đầu tư công thực hiện chương trình từ nguồn ngân sách TW 6 tháng / năm ... (Biên)" },
  { code: "Biểu 09", title: "Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng / năm ... (Tỉnh)" },
  { code: "Biểu 10", title: "Kết quả thực hiện bộ tiêu chí quốc gia về NTM 6 tháng / năm ... (Xã)" },
  { code: "Biểu 11", title: "Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng / năm ... (Xã)" },
  { code: "Biểu 12", title: "Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng / năm ... (Xã)" },
  { code: "Biểu 13", title: "Kết quả thực hiện vốn đầu tư công thực hiện chương trình từ nguồn ngân sách TW 6 tháng / năm " },
  { code: "Biểu 14", title: "Báo cáo tiến triển rà soát cơ giới hóa và phát triển nông thôn" }
];

import { ReportPeriod, FormReport } from './types';

export function createDefaultFormsForPeriod(periodId: string, customCategories?: string[]): FormReport[] {
  // Use INITIAL_CRITERIA_ROWS or INITIAL_CRITERIA_ROWS_08 as base data
  return FORM_METAS.map((meta, index) => {
    // Generate slight variances in criteria values for high-fidelity realism
    let customizedData: any[] = [];
    if (meta.code === 'Biểu 06') {
      customizedData = JSON.parse(JSON.stringify(INITIAL_CRITERIA_ROWS_06));
    } else if (meta.code === 'Biểu 08') {
      customizedData = JSON.parse(JSON.stringify(INITIAL_CRITERIA_ROWS_08));
    } else if (meta.code === 'Biểu 13') {
      customizedData = JSON.parse(JSON.stringify(INITIAL_CRITERIA_ROWS_08));
    } else if (meta.code === 'Biểu 09' || meta.code === 'Biểu 12') {
      customizedData = JSON.parse(JSON.stringify(INITIAL_RESOURCE_ROWS));
    } else {
      customizedData = INITIAL_CRITERIA_ROWS.map((row) => {
        const modifier = (index + row.id) % 3;
        return {
          ...row,
          group1: {
            prevYear: Math.max(2, row.group1.prevYear - modifier),
            currentS1: Math.max(3, row.group1.currentS1 - modifier),
            planS2: Math.max(4, row.group1.planS2 - modifier)
          },
          group2: {
            prevYear: Math.max(1, row.group2.prevYear - modifier),
            currentS1: Math.max(2, row.group2.currentS1 - modifier),
            planS2: Math.max(3, row.group2.planS2 - modifier)
          },
          group3: {
            prevYear: Math.max(0, row.group3.prevYear - modifier),
            currentS1: Math.max(1, row.group3.currentS1 - modifier),
            planS2: Math.max(2, row.group3.planS2 - modifier)
          }
        };
      });
    }

    // Preset status values to perfectly emulate the visual states in the screenshot for Q4
    let status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'SUPERVISED' | 'REJECTED' = 'DRAFT';

    if (periodId === '2024-q4' || periodId === 'period-q4') {
      if (meta.code === 'Biểu 10') {
        status = 'APPROVED'; // Maps to "Đã nộp / Đã Phê Duyệt"
      }
      else if (meta.code === 'Biểu 06') {
        status = 'DRAFT'; // "Đang soạn" with progress
      } else if (meta.code === 'Biểu 07') {
        status = 'REJECTED'; // "Bị trả lại" with Reject alert
      } else if (meta.code === 'Biểu 08') {
        status = 'DRAFT'; // "Chưa nhập" optional
      } else if (meta.code === 'Biểu 11') {
        status = 'SUBMITTED'; // "Chờ thẩm định"
      } else if (meta.code === 'Biểu 12') {
        status = 'DRAFT'; // "Chưa nhập" required
      } else {
        // distribute others
        status = index % 3 === 0 ? 'APPROVED' : 'DRAFT';
      }
    } else {
      // standard period presets
      if (index === 0) status = 'SUPERVISED';
      else if (index === 1) status = 'APPROVED';
      else if (index === 2) status = 'SUBMITTED';
    }

    const proofFiles = (status !== 'DRAFT' && status !== 'REJECTED') ? [
      { name: `BieuMau_${meta.code.replace(' ', '')}_ChungThucSố.pdf`, size: 2400100 + index * 15000, uploadedAt: '2026-05-18', type: 'pdf' }
    ] : [];

    // Attach mock logs if status is advanced
    const appraisal = (status === 'APPROVED' || status === 'SUPERVISED' || status === 'REJECTED') ? {
      appraiserName: 'Trần Minh Thẩm',
      comment: status === 'REJECTED'
        ? 'Số liệu hộ nghèo đa chiều chưa khớp với dữ liệu từ Phòng LĐTBXH huyện. Vui lòng kiểm tra lại phụ lục 2.'
        : `Số liệu của ${meta.code} khớp với cơ sở dữ liệu thực địa. Đạt chuẩn kỹ thuật liên ngành.`,
      updatedAt: '2026-05-19T08:30:00Z',
      decision: status === 'REJECTED' ? ('REJECTED' as const) : ('APPROVED' as const)
    } : undefined;

    const supervision = status === 'SUPERVISED' ? {
      supervisorName: 'Phạm Hoàng Giám',
      comment: 'Hồ sơ đã kiểm toán chéo qua ảnh vệ tinh và khảo sát thực địa. Trạng thái đạt yêu cầu thực tế.',
      updatedAt: '2026-05-20T04:15:00Z',
      complianceLevel: 'Xuất sắc'
    } : undefined;

    return {
      id: `${periodId}-${meta.code.toLowerCase().replace(' ', '')}`,
      code: meta.code,
      title: meta.title,
      status,
      updatedAt: '2026-05-20T03:00:00Z',
      editor: (status !== 'DRAFT' && status !== 'REJECTED') ? 'Nguyễn Văn An' : '',
      proofFiles,
      data: customizedData,
      appraisal,
      supervision
    };
  });
}

export const INITIAL_PERIODS: ReportPeriod[] = [
  {
    id: "2024-q4",
    name: "Báo cáo kết quả thực hiện NTM - Quý IV Năm 2024",
    year: "2024",
    term: "Quý IV Năm 2024",
    deadline: "2024-12-31",
    forms: [] // will be initialized on start
  },
  {
    id: "2024-6tdu",
    name: "Đợt báo cáo NTM 6 tháng đầu năm 2024",
    year: "2024",
    term: "6 tháng đầu năm",
    deadline: "2024-06-30",
    forms: [] // will be initialized on start
  }
];

export const DEFAULT_COMMUNES: CommuneSubmission[] = [
  {
    id: 'com-1',
    name: 'Xã Bình Minh',
    code: '23041',
    province: 'Tỉnh Đông',
    submitted: 4,
    total: 4,
    status: 'APPROVED',
    updatedAt: '12/04/2024',
    group: 'I'
  },
  {
    id: 'com-2',
    name: 'Xã Thụy Xuân',
    code: '23055',
    province: 'Tỉnh Thái Thụy',
    submitted: 4,
    total: 4,
    status: 'SUBMITTED',
    updatedAt: '15/04/2024',
    group: 'II'
  },
  {
    id: 'com-3',
    name: 'Xã Vũ Hội',
    code: '23078',
    province: 'Tỉnh Bắc',
    submitted: 4,
    total: 4,
    status: 'REVISION',
    updatedAt: '18/04/2024',
    group: 'III'
  },
  {
    id: 'com-4',
    name: 'Xã Hải Anh',
    code: '23102',
    province: 'Tỉnh Nam',
    submitted: 0,
    total: 4,
    status: 'PENDING',
    updatedAt: '--',
    group: 'I'
  },
  {
    id: 'com-5',
    name: 'Xã Quang Trung',
    code: '23114',
    province: 'Tỉnh Đông',
    submitted: 3,
    total: 4,
    status: 'SUBMITTED',
    updatedAt: '19/04/2024',
    group: 'II'
  },
  {
    id: 'com-6',
    name: 'Xã Hồng Phong',
    code: '23120',
    province: 'Tỉnh Bắc',
    submitted: 4,
    total: 4,
    status: 'APPROVED',
    updatedAt: '20/04/2024',
    group: 'I'
  },
  {
    id: 'com-7',
    name: 'Xã Tiến Đức',
    code: '23145',
    province: 'Tỉnh Thái Thụy',
    submitted: 1,
    total: 4,
    status: 'REVISION',
    updatedAt: '21/04/2024',
    group: 'II'
  },
  {
    id: 'com-8',
    name: 'Xã An Phú',
    code: '23160',
    province: 'Tỉnh Nam',
    submitted: 0,
    total: 4,
    status: 'PENDING',
    updatedAt: '--',
    group: 'III'
  }
];


