import React, { useState, useMemo } from 'react';
import { ReportPeriod, UserSession, FormReport } from '../types';
import {
  FileCheck2,
  Folder,
  CheckCircle2,
  X,
  FileText,
  Eye,
  Filter,
  Search,
  ChevronRight,
  AlertTriangle,
  Send,
  User,
  Clock,
  CheckCircle,
  FileCode2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Activity,
  Award,
  FileSpreadsheet,
  SlidersHorizontal,
  MapPin,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Upload,
  Info
} from 'lucide-react';

const getInitialCriteria10 = () => {
  const initialList = [
    { id: 1, code: "Tiêu chí 1", title: "Tiêu chí 1: Quy hoạch", subTitle: "Cập nhật hồ sơ chứng minh cho nội dung quy hoạch xã nông thôn mới.", statusText: "Đã hoàn thiện", isCompleted: true, decisionNo: "1245/QĐ-UBND", decisionDate: "2024-03-15", note: "Đã phê duyệt điều chỉnh quy hoạch toàn khu đô thị vệ tinh đến năm 2030.", proofFiles: [{ name: "QD_Phe_Duyet_Quy_Hoach_Xa.pdf", size: "2.4 MB" }], guidelines: "Quy hoạch chung xây dựng xã phải được phê duyệt và công bố công khai. Cần có quy hoạch chi tiết khu trung tâm xã và các điểm dân cư mới. Nội dung quy hoạch phải đáp ứng yêu cầu tái cơ cấu ngành nông nghiệp và biến đổi khí hậu.", guideDoc: "124/HD-BNN" },
    { id: 2, code: "Tiêu chí 2", title: "Tiêu chí 2: Giao thông", subTitle: "Đo lường tỉ lệ đường giao thông, tuyến nội đồng nông nghiệp.", statusText: "Chưa đạt", isCompleted: false, decisionNo: "86/QĐ-UB", decisionDate: "2024-05-10", note: "Các trục đường thôn liên xã đang được đổ bê tông đạt 92% tiến độ.", proofFiles: [], guidelines: "Đường xã và đường từ trung tâm xã đến đường huyện được nhựa hóa hoặc bê tông hóa hoàn toàn. Tỷ lệ đường trục thôn, bản được cứng hóa tối thiểu đạt chuẩn 75%.", guideDoc: "15/HD-GTVT", isRateType: true, numerator: 72, denominator: 100, targetPercent: 75, group1Threshold: 85, group2Threshold: 75, group3Threshold: 65, unit: "km", numeratorLabel: "Chiều dài đường trục thôn, bản được cứng hóa", denominatorLabel: "Tổng chiều dài đường trục thôn, bản" },
    { id: 3, code: "Tiêu chí 3", title: "Tiêu chí 3: Thủy lợi và phòng chống thiên tai", subTitle: "Đảm bảo hạ tầng thủy lợi tưới tiêu nước nông thôn an toàn.", statusText: "Chưa đạt", isCompleted: false, decisionNo: "", decisionDate: "", note: "Kênh mương nội đồng nhánh đông nâng cấp chưa xong do sạt lở.", proofFiles: [], guidelines: "Tỉ lệ diện tích đất sản xuất nông nghiệp được tưới tiêu chủ cấp đạt từ 80% trở lên. Đứng vững đối phó mực nước lũ lụt thiên tai cục bộ hằng năm.", guideDoc: "88/HD-SNN", isRateType: true, numerator: 75, denominator: 100, targetPercent: 80, group1Threshold: 90, group2Threshold: 80, group3Threshold: 70, unit: "ha", numeratorLabel: "Diện tích đất nông nghiệp được tưới tiêu chủ động", denominatorLabel: "Tổng diện tích đất sản xuất nông nghiệp" },
    { id: 4, code: "Tiêu chí 4", title: "Tiêu chí 4: Điện", subTitle: "Mạng lưới điện sinh hoạt, sản xuất an toàn.", statusText: "Đạt", isCompleted: true, decisionNo: "342/EVN-QĐ", decisionDate: "2024-02-18", note: "100% các thôn và hộ gia đình sử dụng điện lưới đạt quy tải.", proofFiles: [{ name: "ChungThucTrangThaiMangLuoiDienXa.pdf", size: "1.8 MB" }], guidelines: "Đạt tiêu chuẩn kỹ thuật hạ tầng thiết kế lắp đặt của ngành điện lực Việt Nam. Tỷ lệ hộ dùng điện thường xuyên, an toàn đạt từ 98% trở lên.", guideDoc: "22/HD-BCT", isRateType: true, numerator: 99, denominator: 100, targetPercent: 98, group1Threshold: 99, group2Threshold: 98, group3Threshold: 95, unit: "hộ", numeratorLabel: "Số hộ dùng điện thường xuyên, an toàn", denominatorLabel: "Tổng số hộ dùng điện trong xã" },
    { id: 5, code: "Tiêu chí 5", title: "Tiêu chí 5: Trường học", subTitle: "Cơ sở vật chất trường học, phòng học chức năng.", statusText: "Đạt", isCompleted: true, decisionNo: "102/QĐ-SGD", decisionDate: "2024-01-20", note: "Đang duy trì chuẩn quốc gia mức 1 cho mẫu trường mầm non và THCS.", proofFiles: [{ name: "QD_TrungHocCoSo_DatChuanQuocGia_Signed.pdf", size: "3.1 MB" }], guidelines: "Tỷ lệ trường học các cấp có cơ sở vật chất, thiết bị dạy và học đạt mức chuẩn quy chế quốc gia tối thiểu 70% trở lên.", guideDoc: "105/HD-BGDDT", isRateType: true, numerator: 3, denominator: 4, targetPercent: 70, group1Threshold: 80, group2Threshold: 70, group3Threshold: 60, unit: "trường", numeratorLabel: "Số trường đạt chuẩn quốc gia", denominatorLabel: "Tổng số trường học trên địa bàn" },
    { id: 6, code: "Tiêu chí 6", title: "Tiêu chí 6: Cơ sở vật chất văn hóa", subTitle: "Hệ thống nhà văn hóa, khu thể thao xã, thôn bản.", statusText: "Đạt", isCompleted: true, decisionNo: "45/QĐ-SVHTTDL", decisionDate: "2024-04-12", note: "Lắp đặt xong dụng cụ thể thao ngoài trời tại trung tâm rèn luyện xã.", proofFiles: [], guidelines: "Xã có nhà văn hóa đạt chuẩn sinh hoạt cộng đồng, các thôn có sân thể thao hoặc địa điểm sinh hoạt văn hóa dân gian thích ứng.", guideDoc: "44/HD-VHTTDL" },
    { id: 7, code: "Tiêu chí 7", title: "Tiêu chí 7: Cơ sở hạ tầng thương mại nông thôn", subTitle: "Phát triển chợ nông thôn, siêu thị mini, chuỗi bán lẻ.", statusText: "Đang hoàn thiện", isCompleted: false, decisionNo: "15/QĐ-SCT", decisionDate: "2024-06-03", note: "Mẫu chợ trung tâm xã đang cấu trúc lại chuỗi vệ sinh phòng dịch.", proofFiles: [], guidelines: "Xã có chợ nông thôn đạt chuẩn theo quy định hoặc có siêu thị tiện ích, trung tâm phân phối thương mại xã đạt yêu cầu.", guideDoc: "32/HD-BCT" },
    { id: 8, code: "Tiêu chí 8", title: "Tiêu chí 8: Thông tin và Truyền thông", subTitle: "Truyền thanh không dây, điểm dịch vụ internet.", statusText: "Đạt", isCompleted: true, decisionNo: "66/QĐ-STTTT", decisionDate: "2024-02-28", note: "Phủ sóng mạng di động 4G/5G chất lượng cao đến tất cả hộ dân.", proofFiles: [], guidelines: "Đầy đủ hạ tầng truyền thanh cơ sở, điểm cung cấp internet công cộng tốt và có ứng dụng dịch vụ công trực tuyến một cửa.", guideDoc: "19/HD-BTTTT" },
    { id: 9, code: "Tiêu chí 9", title: "Tiêu chí 9: Nhà ở dân cư", subTitle: "Xóa nhà dột nát, đạt chuẩn kết cấu nhà kiên cố.", statusText: "Chưa đạt", isCompleted: false, decisionNo: "Mẫu rà soát 09", decisionDate: "2024-04-15", note: "Còn 3 hộ nghèo đang chờ phê chuẩn ngân sách hỗ trợ mái ấm kiên cố.", proofFiles: [], guidelines: "Không còn nhà tạm, dột nát dột mục. Tỷ lệ hộ gia định có nhà ở kiên cố hoặc bán kiên cố đạt từ 90% trở lên.", guideDoc: "110/HD-BXD", isRateType: true, numerator: 88, denominator: 100, targetPercent: 90, group1Threshold: 95, group2Threshold: 90, group3Threshold: 80, unit: "hộ", numeratorLabel: "Số hộ có nhà ở đạt chuẩn kiên cố/bán kiên cố", denominatorLabel: "Tổng số hộ dân trên địa bàn" },
    { id: 10, code: "Tiêu chí 10", title: "Tiêu chí 10: Thu nhập", subTitle: "Thu nhập bình quân đầu người hằng năm.", statusText: "Đạt", isCompleted: true, decisionNo: "119/QĐ-CTK", decisionDate: "2024-05-18", note: "Mức bình quân đạt 58 triệu đồng / người / năm tại các xã chuẩn mới.", proofFiles: [], guidelines: "Thu nhập bình quân đầu người cao gấp 1.5 lần trở lên so với mức tối thiểu quy định, đảm bảo mức tăng bền vững.", guideDoc: "33/HD-TCTK" }
  ];
  for (let i = 11; i <= 47; i++) {
    const isC = i % 3 !== 0;
    const isRate = i % 4 === 0;
    initialList.push({
      id: i,
      code: `Chỉ số ${i}`,
      title: `Chỉ số 10.${i - 10}: Nội dung đánh giá NTM thứ ${i}`,
      subTitle: `Dữ liệu rà soát chỉ số chi tiết bộ tiêu chí quốc gia chuẩn ${i}.`,
      statusText: isRate ? (isC ? "Đạt" : "Chưa đạt") : (isC ? "Đạt" : "Xem xét cải thiện"),
      isCompleted: isC,
      decisionNo: isC ? `${2000 + i}/QĐ-UBND` : "",
      decisionDate: isC ? "2024-04-20" : "",
      note: isC ? "Dữ liệu đo lường đạt chuẩn quy trình đánh giá." : "Cơ sở vật chất đang rà soát bổ sung tư liệu thực địa.",
      proofFiles: isC ? [{ name: `BieuMau_TC${i}_ChungThuc.pdf`, size: "1.5 MB" }] : [],
      guidelines: `Đảm bảo tuân thủ đầy đủ điều khoản hành chính quốc gia của ban chỉ đạo trung ương về nông thôn mới chỉ số ${i}.`,
      guideDoc: `${i * 3}/HD-BCĐTW`,
      isRateType: isRate,
      numerator: isRate ? (isC ? 85 : 65) : undefined,
      denominator: isRate ? 100 : undefined,
      targetPercent: isRate ? 80 : undefined,
      group1Threshold: isRate ? 85 : undefined,
      group2Threshold: isRate ? 80 : undefined,
      group3Threshold: isRate ? 70 : undefined,
      unit: isRate ? "%" : undefined,
      numeratorLabel: isRate ? "Số tiêu chí thành phần hoàn thành" : undefined,
      denominatorLabel: isRate ? "Tổng số tiêu chí thành phần" : undefined
    });
  }
  return initialList;
};

interface Dossier {
  id: string;
  code: string;
  province: string;
  district: string;
  commune: string;
  submissionDate: string;
  progress: number;
  status: 'CHỜ DUYỆT' | 'ĐÃ ĐẠT' | 'CẦN SỬA';
  criteriaData: {
    title: string;
    metric: string;
    value: string;
  }[];
  proofFiles: {
    name: string;
    size: string;
    date: string;
  }[];
  history: {
    time: string;
    actor: string;
    action: string;
  }[];
}

const INITIAL_DOSSIERS: Dossier[] = [
  {
    id: '1',
    code: 'HS-NB-2024-001',
    province: 'Tỉnh Ninh Bình',
    district: 'Huyện Hoa Lư',
    commune: 'Xã Trường Yên',
    submissionDate: '12/10/2024',
    progress: 85,
    status: 'CHỜ DUYỆT',
    criteriaData: [
      { title: 'Tiêu chí 1: Quy hoạch', metric: 'Tỷ lệ diện tích quy hoạch:', value: '100%' },
      { title: 'Tiêu chí 4: Điện', metric: 'Hộ sử dụng điện an toàn:', value: '98.5%' }
    ],
    proofFiles: [
      { name: 'Bao_cao_TC1_NinhBinh.pdf', size: '2.4 MB', date: '12/10/2024' },
      { name: 'Phu_luc_so_lieu_TC4.pdf', size: '1.1 MB', date: '12/10/2024' }
    ],
    history: [
      { time: '12/10/2024 - 15:30', actor: 'Nguyễn Văn A', action: 'Gửi thẩm định' },
      { time: '12/10/2024 - 15:31', actor: 'Hệ thống', action: 'Ghi nhận hồ sơ hợp lệ' }
    ]
  },
  {
    id: '2',
    code: 'HS-HN-2024-104',
    province: 'TP. Hà Nội',
    district: 'Huyện Đông Anh',
    commune: 'Xã Cải Huê',
    submissionDate: '11/10/2024',
    progress: 100,
    status: 'ĐÃ ĐẠT',
    criteriaData: [
      { title: 'Tiêu chí 1: Quy hoạch', metric: 'Bản đồ quy hoạch phê duyệt:', value: 'Đầy đủ' },
      { title: 'Tiêu chí 3: Thủy lợi', metric: 'Kiên cố kênh mương nội đồng:', value: '100%' },
      { title: 'Tiêu chí 10: Thu nhập', metric: 'Thu nhập bình quân (tr.đ/đầu người/năm):', value: '62.4 trđ' }
    ],
    proofFiles: [
      { name: 'Quyet_dinh_PD_DongAnh2024.pdf', size: '4.8 MB', date: '11/10/2024' },
      { name: 'Giai_ngan_quy_mua_lu.pdf', size: '1.5 MB', date: '11/10/2024' }
    ],
    history: [
      { time: '11/10/2024 - 09:15', actor: 'Lê Văn B', action: 'Gửi thẩm định' },
      { time: '11/10/2024 - 14:00', actor: 'Hội đồng Liên ngành', action: 'Phê duyệt xuất sắc' }
    ]
  },
  {
    id: '3',
    code: 'HS-HP-2024-092',
    province: 'TP. Hải Phòng',
    district: 'Huyện Cát Hải',
    commune: 'Xã Trân Châu',
    submissionDate: '10/10/2024',
    progress: 92,
    status: 'CẦN SỬA',
    criteriaData: [
      { title: 'Tiêu chí 17: Môi trường', metric: 'Tỷ lệ thu gom rác thải sinh hoạt:', value: '72%' },
      { title: 'Tiêu chí 19: An ninh trật tự', metric: 'Tỷ lệ tiếng ồn xung quanh xã:', value: 'Không đạt chuẩn' }
    ],
    proofFiles: [
      { name: 'Bieu_ke_khai_moi_truong_HaiPhong.pdf', size: '3.1 MB', date: '10/10/2024' }
    ],
    history: [
      { time: '10/10/2024 - 16:45', actor: 'Trần Thị C', action: 'Gửi thẩm định' },
      { time: '11/10/2024 - 10:30', actor: 'Văn phòng Thẩm định', action: 'Yêu cầu sửa rác thải sinh hoạt' }
    ]
  },
  {
    id: '4',
    code: 'HS-QN-2024-034',
    province: 'Tỉnh Quảng Ninh',
    district: 'Huyện Vân Đồn',
    commune: 'Xã Hạ Long',
    submissionDate: '09/10/2024',
    progress: 78,
    status: 'CHỜ DUYỆT',
    criteriaData: [
      { title: 'Tiêu chí 1: Quy hoạch', metric: 'Dự thảo phê duyệt quy hoạch tổng thể:', value: 'Chờ đối chiếu' },
      { title: 'Tiêu chí 2: Giao thông', metric: 'Tỷ lệ nhựa hóa đường liên xã:', value: '95%' }
    ],
    proofFiles: [
      { name: 'Ho_so_giao_thong_nong_thon_VanDon.pdf', size: '5.2 MB', date: '09/10/2024' }
    ],
    history: [
      { time: '09/10/2024 - 11:10', actor: 'Phạm Văn D', action: 'Gửi thẩm định' },
      { time: '09/10/2024 - 11:15', actor: 'Hệ thống', action: 'Kiểm duyệt tính năng tệp tệp thành công' }
    ]
  },
  {
    id: '5',
    code: 'HS-LD-2024-112',
    province: 'Tỉnh Lâm Đồng',
    district: 'Huyện Đức Trọng',
    commune: 'Xã Liên Nghĩa',
    submissionDate: '08/10/2024',
    progress: 100,
    status: 'ĐÃ ĐẠT',
    criteriaData: [
      { title: 'Tiêu chí 13: Tổ chức sản xuất', metric: 'Xây dựng chuỗi liên kết giá trị:', value: 'Đạt chuẩn 3/3' },
      { title: 'Tiêu chí 18: Hệ thống chính trị', metric: 'Tỷ lệ cán bộ đạt chuẩn về chuyên môn:', value: '100%' }
    ],
    proofFiles: [
      { name: 'Lien_ket_kinh_te_DucTrong.pdf', size: '2.9 MB', date: '08/10/2024' },
      { name: 'Dao_tao_can_bo_social.pdf', size: '1.2 MB', date: '08/10/2024' }
    ],
    history: [
      { time: '08/10/2024 - 08:30', actor: 'Đào Hoàng E', action: 'Gửi thẩm định' },
      { time: '08/10/2024 - 15:45', actor: 'Hội đồng Tỉnh Lâm Đồng', action: 'Ghi nhận đạt chuẩn toàn diện' }
    ]
  }
];

interface AppraisalTabProps {
  periods: ReportPeriod[];
  onUpdatePeriod: (updatedPeriod: ReportPeriod) => void;
  userSession: UserSession;
  onViewGuideDoc?: (docCode: string) => void;
}

export default function AppraisalTab({
  periods,
  onUpdatePeriod,
  userSession,
  onViewGuideDoc
}: AppraisalTabProps) {
  const [appraisalTab, setAppraisalTab] = useState<'tech' | 'finance'>('tech');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Tất cả');
  const [selectedCriteriaGroup, setSelectedCriteriaGroup] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Chờ thẩm định');

  const [activeDossierId, setActiveDossierId] = useState<string | null>('1');
  const [decisionComment, setDecisionComment] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ message: string; type: 'success' | 'warning' | 'info' }>({
    message: '',
    type: 'success'
  });

  const [isViewingFullForms, setIsViewingFullForms] = useState(false);
  const [viewingFormCode, setViewingFormCode] = useState<'Biểu 10' | 'Biểu 11' | 'Biểu 12' | 'Biểu 13'>('Biểu 10');
  const [selectedCritId, setSelectedCritId] = useState<number>(1);
  const [criteriaSearch, setCriteriaSearch] = useState('');
  const [showCriteriaFilter, setShowCriteriaFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'NOT_MET'>('ALL');

  const [criteriaList, setCriteriaList] = useState<any[]>(() => {
    const saved = localStorage.getItem('NôngThônMới_Biểu10_TiêuChí');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return getInitialCriteria10();
  });

  const resourceRows07 = useMemo(() => {
    const saved = localStorage.getItem('NôngThônMới_Biểu11_Data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      i1_plan: 150000, i1_first: 60000, i1_second: 90000,
      i2_plan: 100000, i2_first: 40000, i2_second: 60000,
      ii1_plan: 100000, ii1_first: 50000, ii1_second: 50000,
      ii2_plan: 50000, ii2_first: 20000, ii2_second: 30000,
      iii_plan: 50000, iii_first: 20000, iii_second: 30000,
      iv_plan: 30000, iv_first: 15000, iv_second: 15000,
      v_plan: 10000, v_first: 2000, v_second: 8000,
      vi1_plan: 5000, vi1_first: 2000, vi1_second: 3000,
      vi2_plan: 5000, vi2_first: 1000, vi2_second: 4000,
    };
  }, [activeDossierId]);

  const filteredCriteria = useMemo(() => {
    return criteriaList.filter((c) => {
      const matchSearch = (c.title || '').toLowerCase().includes(criteriaSearch.toLowerCase()) ||
        (c.id || '').toString() === criteriaSearch ||
        (c.note && c.note.toLowerCase().includes(criteriaSearch.toLowerCase()));

      if (!matchSearch) return false;

      if (showCriteriaFilter === 'COMPLETED') return c.isCompleted;
      if (showCriteriaFilter === 'PENDING') return c.statusText === 'Đang xử lý dữ liệu' || c.statusText === 'Đang hoàn thiện';
      if (showCriteriaFilter === 'NOT_MET') return !c.isCompleted && c.statusText !== 'Đang hoàn thiện' && c.statusText !== 'Đang xử lý dữ liệu';
      return true;
    });
  }, [criteriaList, criteriaSearch, showCriteriaFilter]);

  const dynamicDossiers = useMemo(() => {
    return periods.map(p => {
      const communeForms = p.forms.filter(f => ['Biểu 10', 'Biểu 11', 'Biểu 12', 'Biểu 13'].includes(f.code));
      const hasActivity = communeForms.some(f => f.status !== 'DRAFT');
      if (!hasActivity) return null;

      const isAllApproved = communeForms.every(f => f.status === 'APPROVED' || f.status === 'SUPERVISED');
      const isAnyRejected = communeForms.some(f => f.status === 'REJECTED');
      const status: 'CHỜ DUYỆT' | 'ĐÃ ĐẠT' | 'CẦN SỬA' = isAllApproved
        ? 'ĐÃ ĐẠT'
        : isAnyRejected
          ? 'CẦN SỬA'
          : 'CHỜ DUYỆT';

      const b10 = p.forms.find(f => f.code === 'Biểu 10');
      const b10Data = Array.isArray(b10?.data) ? b10.data : [];
      const criteriaData = b10Data.slice(0, 3).map(row => ({
        title: `Tiêu chí: ${row.category || 'Chỉ số NTM'}`,
        metric: `ĐVT: ${row.unit || 'Xã'} - Kỳ này (Nhóm 2):`,
        value: `${row.group2?.currentS1 ?? 0} / ${row.group2?.planS2 ?? 0}`
      }));

      const proofFiles = communeForms.flatMap(f => f.proofFiles || []).map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: file.uploadedAt
      }));

      const history = communeForms.flatMap(f => {
        const list = [];
        if (f.status === 'SUBMITTED') {
          list.push({
            time: 'Hôm nay',
            actor: f.editor || 'Cán bộ Xã',
            action: `Gửi báo cáo ${f.code}`
          });
        }
        if (f.appraisal) {
          list.push({
            time: new Date(f.appraisal.updatedAt).toLocaleDateString('vi-VN'),
            actor: f.appraisal.appraiserName,
            action: f.appraisal.decision === 'APPROVED' ? `Phê chuẩn ${f.code}` : `Yêu cầu sửa ${f.code}`
          });
        }
        return list;
      });

      return {
        id: p.id,
        code: `HS-${p.year || '2024'}-${p.id.toUpperCase()}`,
        province: 'Tỉnh Đông',
        district: 'Huyện Đông Anh',
        commune: 'Xã Bình Minh',
        submissionDate: 'Hôm nay',
        progress: status === 'ĐÃ ĐẠT' ? 100 : status === 'CẦN SỬA' ? 40 : 75,
        status,
        criteriaData: criteriaData.length > 0 ? criteriaData : [
          { title: 'Tiêu chí 1: Quy hoạch', metric: 'Bản đồ quy hoạch phê duyệt:', value: 'Hoàn thành' },
          { title: 'Tiêu chí 10: Thu nhập', metric: 'Thu nhập bình quan:', value: 'Đạt chuẩn' }
        ],
        proofFiles: proofFiles.length > 0 ? proofFiles : [
          { name: 'Ho_so_tong_hop_Xa_BinhMinh.pdf', size: '3.5 MB', date: '03/06/2026' }
        ],
        history: history.length > 0 ? history : [
          { time: 'Vừa xong', actor: 'Nguyễn Văn An', action: 'Gửi thẩm định toàn bộ hồ sơ' }
        ]
      };
    }).filter(Boolean) as Dossier[];
  }, [periods]);

  const dossiers = useMemo(() => {
    const dynamicIds = new Set(dynamicDossiers.map(d => d.id));
    const staticDossiers = INITIAL_DOSSIERS.filter(d => !dynamicIds.has(d.id));
    return [...dynamicDossiers, ...staticDossiers];
  }, [dynamicDossiers]);

  const stats = useMemo(() => {
    const pending = dossiers.filter(d => d.status === 'CHỜ DUYỆT').length + 120;
    const completed = dossiers.filter(d => d.status === 'ĐÃ ĐẠT').length + 1050;
    return { pending, completed };
  }, [dossiers]);

  const updateDossierStatus = (id: string, newStatus: 'ĐÃ ĐẠT' | 'CẦN SỬA', comment: string) => {
    const targetPeriod = periods.find(p => p.id === id);
    if (!targetPeriod) {
      alert(`Đã cập nhật trạng thái hồ sơ tĩnh demo thành: ${newStatus}`);
      return;
    }

    const formStatus = newStatus === 'ĐÃ ĐẠT' ? 'APPROVED' : 'REJECTED';
    const updatedPeriod: ReportPeriod = {
      ...targetPeriod,
      forms: targetPeriod.forms.map(f => {
        if (['Biểu 10', 'Biểu 11', 'Biểu 12', 'Biểu 13'].includes(f.code)) {
          return {
            ...f,
            status: formStatus,
            updatedAt: new Date().toISOString(),
            appraisal: {
              appraiserName: userSession.fullName,
              comment: comment || (newStatus === 'ĐÃ ĐẠT' ? 'Hồ sơ đạt yêu cầu.' : 'Cần sửa đổi bổ sung.'),
              updatedAt: new Date().toISOString(),
              decision: newStatus === 'ĐÃ ĐẠT' ? 'APPROVED' : 'REJECTED'
            }
          };
        }
        return f;
      })
    };

    onUpdatePeriod(updatedPeriod);

    setAlertConfig({
      message: `Đã cập nhật trạng thái hồ sơ đợt báo cáo thành [${newStatus === 'ĐÃ ĐẠT' ? 'Đã thẩm định' : 'Yêu cầu sửa'}]`,
      type: newStatus === 'ĐÃ ĐẠT' ? 'success' : 'warning'
    });
    setIsAlertVisible(true);
    setDecisionComment('');
    setTimeout(() => setIsAlertVisible(false), 4000);
  };

  const activeDossier = useMemo(() => {
    return dossiers.find(d => d.id === activeDossierId);
  }, [dossiers, activeDossierId]);

  const filteredDossiers = useMemo(() => {
    return dossiers.filter(item => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.commune.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.province.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProvince = selectedProvince === 'Tất cả' || item.province === selectedProvince;

      let matchesStatus = true;
      if (selectedStatus === 'Chờ thẩm định') {
        matchesStatus = item.status === 'CHỜ DUYỆT';
      } else if (selectedStatus === 'Đã đạt') {
        matchesStatus = item.status === 'ĐÃ ĐẠT';
      } else if (selectedStatus === 'Cần sửa') {
        matchesStatus = item.status === 'CẦN SỬA';
      }

      return matchesSearch && matchesProvince && matchesStatus;
    });
  }, [dossiers, searchQuery, selectedProvince, selectedStatus]);

  const handlePreviewFile = (filename: string) => {
    setAlertConfig({
      message: `Đang liên tải & kết xuất tệp tin minh chứng: ${filename}`,
      type: 'info'
    });
    setIsAlertVisible(true);
    setTimeout(() => setIsAlertVisible(false), 3000);
  };

  if (isViewingFullForms && activeDossier) {
    const targetPeriod = periods.find(p => p.id === activeDossier.id);
    const activeCommuneName = activeDossier.commune;
    const activeGroup = activeCommuneName.includes('Vũ Hội') ? 'III' : activeCommuneName.includes('Thụy Xuân') ? 'II' : 'I';

    const b10 = targetPeriod?.forms.find(f => f.code === 'Biểu 10');
    const b11 = targetPeriod?.forms.find(f => f.code === 'Biểu 11');
    const b12 = targetPeriod?.forms.find(f => f.code === 'Biểu 12');
    const b13 = targetPeriod?.forms.find(f => f.code === 'Biểu 13');

    // Biểu 10 Calculations
    const countB10Approved = criteriaList.filter(c => c.isCompleted).length;
    const pctB10Progress = Math.round((countB10Approved / 47) * 100);

    // Biểu 11 calculations
    const d11 = resourceRows07;
    const i_plan = d11.i1_plan + d11.i2_plan;
    const i_first = d11.i1_first + d11.i2_first;
    const i_second = d11.i1_second + d11.i2_second;
    const i_total = i_first + i_second;
    const i_percent = i_plan > 0 ? (i_first / i_plan) * 100 : 0;

    const ii_plan = d11.ii1_plan + d11.ii2_plan;
    const ii_first = d11.ii1_first + d11.ii2_first;
    const ii_second = d11.ii1_second + d11.ii2_second;
    const ii_total = ii_first + ii_second;
    const ii_percent = ii_plan > 0 ? (ii_first / ii_plan) * 100 : 0;

    const iii_total = d11.iii_first + d11.iii_second;
    const iii_percent = d11.iii_plan > 0 ? (d11.iii_first / d11.iii_plan) * 100 : 0;

    const iv_total = d11.iv_first + d11.iv_second;
    const iv_percent = d11.iv_plan > 0 ? (d11.iv_first / d11.iv_plan) * 100 : 0;

    const v_total = d11.v_first + d11.v_second;
    const v_percent = d11.v_plan > 0 ? (d11.v_first / d11.v_plan) * 100 : 0;

    const vi_plan = d11.vi1_plan + d11.vi2_plan;
    const vi_first = d11.vi1_first + d11.vi2_first;
    const vi_second = d11.vi1_second + d11.vi2_second;
    const vi_total = vi_first + vi_second;
    const vi_percent = vi_plan > 0 ? (vi_first / vi_plan) * 100 : 0;

    const tong_plan = i_plan + ii_plan + d11.iii_plan + d11.iv_plan + d11.v_plan + vi_plan;
    const tong_first = i_first + ii_first + d11.iii_first + d11.iv_first + d11.v_first + vi_first;
    const tong_second = i_second + ii_second + d11.iii_second + d11.iv_second + d11.v_second + vi_second;
    const tong_total = tong_first + tong_second;
    const tong_percent = tong_plan > 0 ? (tong_first / tong_plan) * 100 : 0;

    // Biểu 12 Calculations
    const calculatedTotals12 = {
      quantity: 0,
      hd_tongSo: 0,
      hd_vdt_tongSo: 0,
      hd_nstw_dtpt: 0,
      hd_nstw_sn: 0,
      hd_nsdp: 0,
      hd_longGhep: 0,
      hd_tinDung: 0,
      hd_doanhNghiep: 0,
      hd_danGop: 0,
      kh_tongSo: 0,
      kh_vdt_tongSo: 0,
      kh_nstw_dtpt: 0,
      kh_nstw_sn: 0,
      kh_nsdp: 0,
      kh_longGhep: 0,
      kh_tinDung: 0,
      kh_doanhNghiep: 0,
      kh_danGop: 0,
    };

    const b12Data = Array.isArray(b12?.data) ? b12.data : [];
    b12Data.forEach((row: any) => {
      if (row.isHeader) return;
      calculatedTotals12.quantity += Number(row.quantity) || 0;
      calculatedTotals12.hd_nstw_dtpt += Number(row.hd_nstw_dtpt) || 0;
      calculatedTotals12.hd_nstw_sn += Number(row.hd_nstw_sn) || 0;
      calculatedTotals12.hd_nsdp += Number(row.hd_nsdp) || 0;
      calculatedTotals12.hd_longGhep += Number(row.hd_longGhep) || 0;
      calculatedTotals12.hd_tinDung += Number(row.hd_tinDung) || 0;
      calculatedTotals12.hd_doanhNghiep += Number(row.hd_doanhNghiep) || 0;
      calculatedTotals12.hd_danGop += Number(row.hd_danGop) || 0;
      calculatedTotals12.hd_vdt_tongSo += (Number(row.hd_nstw_dtpt) || 0) + (Number(row.hd_nstw_sn) || 0) + (Number(row.hd_nsdp) || 0);
      calculatedTotals12.hd_tongSo += (Number(row.hd_nstw_dtpt) || 0) + (Number(row.hd_nstw_sn) || 0) + (Number(row.hd_nsdp) || 0) + (Number(row.hd_longGhep) || 0) + (Number(row.hd_tinDung) || 0) + (Number(row.hd_doanhNghiep) || 0) + (Number(row.hd_danGop) || 0);

      calculatedTotals12.kh_nstw_dtpt += Number(row.kh_nstw_dtpt) || 0;
      calculatedTotals12.kh_nstw_sn += Number(row.kh_nstw_sn) || 0;
      calculatedTotals12.kh_nsdp += Number(row.kh_nsdp) || 0;
      calculatedTotals12.kh_longGhep += Number(row.kh_longGhep) || 0;
      calculatedTotals12.kh_tinDung += Number(row.kh_tinDung) || 0;
      calculatedTotals12.kh_doanhNghiep += Number(row.kh_doanhNghiep) || 0;
      calculatedTotals12.kh_danGop += Number(row.kh_danGop) || 0;
      calculatedTotals12.kh_vdt_tongSo += (Number(row.kh_nstw_dtpt) || 0) + (Number(row.kh_nstw_sn) || 0) + (Number(row.kh_nsdp) || 0);
      calculatedTotals12.kh_tongSo += (Number(row.kh_nstw_dtpt) || 0) + (Number(row.kh_nstw_sn) || 0) + (Number(row.kh_nsdp) || 0) + (Number(row.kh_longGhep) || 0) + (Number(row.kh_tinDung) || 0) + (Number(row.kh_doanhNghiep) || 0) + (Number(row.kh_danGop) || 0);
    });

    // Biểu 13 calculations
    const b13Data = Array.isArray(b13?.data) ? b13.data : [];
    const sumPlan13 = b13Data.reduce((acc, row) => acc + (row.group1?.prevYear || 0), 0);
    const sumResult13 = b13Data.reduce((acc, row) => acc + (row.group1?.currentS1 || 0), 0);
    const sumPercent13 = sumPlan13 > 0 ? Math.round((sumResult13 / sumPlan13) * 100) : 0;

    // Active criterion in Biểu 10
    const activeCrit = criteriaList.find(c => c.id === selectedCritId) || criteriaList[0];
    const resolvedTargetPercent =
      activeGroup === 'I' && activeCrit.group1Threshold !== undefined ? activeCrit.group1Threshold
        : activeGroup === 'III' && activeCrit.group3Threshold !== undefined ? activeCrit.group3Threshold
          : activeGroup === 'II' && activeCrit.group2Threshold !== undefined ? activeCrit.group2Threshold
            : activeCrit.targetPercent ?? 0;

    const ratePercent = activeCrit.denominator && activeCrit.denominator > 0
      ? ((activeCrit.numerator ?? 0) / activeCrit.denominator * 100).toFixed(1)
      : "0.0";
    const isTargetMet = Number(ratePercent) >= resolvedTargetPercent;

    const activeCommuneForms = targetPeriod?.forms.filter(f => ['Biểu 10', 'Biểu 11', 'Biểu 12', 'Biểu 13'].includes(f.code)) || [];
    const allApproved = activeCommuneForms.every(f => f.status === 'APPROVED' || f.status === 'SUPERVISED');
    const anyRejected = activeCommuneForms.some(f => f.status === 'REJECTED');
    const dossierStatusLabel = allApproved ? 'ĐÃ ĐẠT' : anyRejected ? 'CẦN SỬA' : 'CHỜ DUYỆT';

    // Biểu 12 STT maps
    let countI = 0;
    let countII = 0;
    let countIII = 0;
    const parentTTMap: Record<number, string> = {};
    const childCountMap: Record<number, number> = {};

    return (
      <div className="space-y-6 relative pb-12 font-sans select-none animate-fade-in text-slate-800 text-left bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-inner" id="full-appraisal-dashboard">
        {/* Toast alert inside view */}
        {isAlertVisible && (
          <div className={`fixed bottom-6 right-6 ${alertConfig.type === 'success' ? 'bg-emerald-900/95 border-emerald-800' :
            alertConfig.type === 'warning' ? 'bg-rose-950/95 border-rose-900' : 'bg-slate-900/95 border-slate-800'
            } backdrop-blur-md border text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-300 animate-fade-in`}>
            {alertConfig.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : alertConfig.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <FileCode2 className="w-5 h-5 text-sky-400 shrink-0" />
            )}
            <span className="text-xs font-bold leading-normal">{alertConfig.message}</span>
          </div>
        )}

        {/* Back navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2 text-left">
            <button
              onClick={() => setIsViewingFullForms(false)}
              className="flex items-center gap-2 text-xs font-black text-[#014285] hover:text-[#002854] cursor-pointer bg-white px-3 py-2 border border-slate-200 hover:border-slate-350 rounded-xl transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách hồ sơ
            </button>
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-xl font-black text-[#0f2942] tracking-tight">
                Thẩm định chi tiết hồ sơ: {activeDossier.code}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${dossierStatusLabel === 'ĐÃ ĐẠT' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                dossierStatusLabel === 'CẦN SỬA' ? 'bg-rose-50 text-rose-500 border-rose-200' :
                  'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                {dossierStatusLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {activeDossier.commune} &bull; {activeDossier.district} &bull; {activeDossier.province} (Phân vùng Nhóm {activeGroup})
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-bold">Kỳ báo cáo:</span>
            <span className="text-xs font-black text-[#014285] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl font-sans">
              {targetPeriod?.name || 'Kỳ hiện tại'}
            </span>
          </div>
        </div>

        {/* Horizontal Form Selection Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 border-b border-slate-200">
          {(['Biểu 10', 'Biểu 11', 'Biểu 12', 'Biểu 13'] as const).map(code => {
            const formObj = targetPeriod?.forms.find(f => f.code === code);
            const status = formObj?.status || 'DRAFT';
            const isActive = viewingFormCode === code;
            return (
              <button
                key={code}
                onClick={() => setViewingFormCode(code)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border shrink-0 cursor-pointer flex items-center gap-2 border-slate-200 ${isActive
                  ? 'bg-[#014285] border-[#014285] text-white shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{code}</span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800' :
                    status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                  {status === 'APPROVED' ? 'Đã duyệt' : status === 'SUBMITTED' ? 'Chờ duyệt' : status === 'REJECTED' ? 'Trả lại' : 'Nháp'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form content box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[500px]">

          {/* VIEW BIỂU 10 */}
          {viewingFormCode === 'Biểu 10' && (
            <div className="space-y-6">
              {/* Header summary info for Form 10 */}
              <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Biểu 10 - Kết quả thực hiện bộ tiêu chí quốc gia xây dựng NTM</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 font-sans">Đánh giá tiến độ của 47 chỉ số chi tiết của Xã theo bộ tiêu chí giai đoạn 2026-2030</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 border border-slate-200 rounded-xl font-sans">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tiến độ tiêu chí</span>
                    <h4 className="text-base font-black text-[#0f2942]">{countB10Approved}/47 đạt</h4>
                  </div>
                  <div className="text-2xl font-black text-lime-600">
                    {pctB10Progress}%
                  </div>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Search and list */}
                <div className="lg:col-span-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200 flex flex-col h-[550px]">
                  <div className="relative mb-3 shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm nội dung, mã tiêu chí..."
                      value={criteriaSearch}
                      onChange={(e) => setCriteriaSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#014285]"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredCriteria.map((c) => {
                      const isActive = c.id === selectedCritId;
                      let statusTextClass = 'text-slate-450';
                      if (c.isCompleted) statusTextClass = 'text-emerald-600';
                      else if (c.statusText.includes('hoàn thiện') || c.statusText.includes('xử lý')) statusTextClass = 'text-amber-500';
                      else if (c.statusText === 'Chưa đạt') statusTextClass = 'text-rose-500';

                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCritId(c.id)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex justify-between items-center ${isActive
                            ? 'bg-blue-50/70 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500/10'
                            : 'bg-white border-slate-150 hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-[10px] text-slate-400 uppercase tracking-tight block">{c.code}</span>
                            <span className="font-extrabold text-slate-800 block truncate mt-0.5" title={c.title}>{c.title}</span>
                          </div>
                          <span className={`text-[10px] font-black shrink-0 ${statusTextClass}`}>
                            {c.isCompleted ? '● Đạt' : c.statusText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected criterion detail viewer */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="bg-[#002a54] text-white rounded-2xl overflow-hidden shadow-xs border border-slate-800 text-left">
                    <div className="p-4 bg-gradient-to-r from-[#002a54] to-[#014285] flex justify-between items-center relative">
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 bg-white/10 px-2 py-0.5 rounded border border-white/5">
                          {activeCrit.code}
                        </span>
                        <h4 className="text-sm font-black">{activeCrit.title}</h4>
                        <p className="text-xs text-blue-200/90">{activeCrit.subTitle}</p>
                      </div>
                      <Award className="w-8 h-8 text-amber-500 opacity-20" />
                    </div>

                    <div className="p-5 bg-white text-slate-800 space-y-5">
                      {/* Metric Rate Card */}
                      {activeCrit.isRateType && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-[#0f2942] tracking-wide">Số liệu tỷ lệ đạt tiêu chí</span>
                            <span className="text-[10px] uppercase font-black bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded border border-blue-100 font-sans">
                              Mục tiêu (Nhóm {activeGroup}): ≥ {resolvedTargetPercent}%
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-left">
                              <span className="text-[10px] text-slate-400 font-bold block">{activeCrit.numeratorLabel || 'Tử số (Thực hiện)'}</span>
                              <span className="text-sm font-black text-slate-800 block mt-1">{activeCrit.numerator ?? 0} {activeCrit.unit}</span>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-left">
                              <span className="text-[10px] text-slate-400 font-bold block">{activeCrit.denominatorLabel || 'Mẫu số (Kế hoạch)'}</span>
                              <span className="text-sm font-black text-slate-800 block mt-1">{activeCrit.denominator ?? 100} {activeCrit.unit}</span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div className="text-left">
                              <span className="text-[10px] text-slate-400 font-bold block">Tỷ lệ tính toán thực tế</span>
                              <h4 className="text-base font-black text-slate-800 mt-0.5 font-sans">{ratePercent}%</h4>
                            </div>
                            <div>
                              {isTargetMet ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-55/15 text-emerald-700 font-black text-xs rounded-lg border border-emerald-150">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  Đạt mục tiêu
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-black text-xs rounded-lg border border-rose-150">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                  Chưa đạt mục tiêu
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Decision and standard status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-left">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Trạng thái tiêu chí</span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-black mt-2 ${activeCrit.isCompleted
                            ? 'bg-emerald-55/15 text-emerald-700 border-emerald-150'
                            : 'bg-rose-50 text-rose-700 border-rose-150'
                            }`}>
                            {activeCrit.isCompleted ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                Đạt chuẩn
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                Chưa đạt chuẩn
                              </>
                            )}
                          </span>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-left">
                          <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block">Chứng thực phê duyệt</span>
                          <div className="mt-2 space-y-1 text-xs">
                            <p className="font-bold text-slate-700">Số quyết định: <strong className="font-black text-[#014285]">{activeCrit.decisionNo || 'Chưa cập nhật'}</strong></p>
                            <p className="font-bold text-slate-700">Ngày ký: <strong className="font-mono text-slate-700 font-black">{activeCrit.decisionDate || 'Chưa cập nhật'}</strong></p>
                          </div>
                        </div>
                      </div>

                      {/* Note / explanation */}
                      <div className="text-left space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Ghi chú / Giải trình của xã</span>
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 italic leading-relaxed text-left">
                          {activeCrit.note || 'Không có ghi chú giải trình bổ sung.'}
                        </div>
                      </div>

                      {/* CRITERIA-SPECIFIC PROOF DOCUMENTS */}
                      <div className="text-left space-y-2 text-left">
                        <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider block border-b border-slate-100 pb-1.5 text-left">
                          Tài liệu kiểm chứng của riêng tiêu chí này
                        </h5>
                        {(activeCrit.proofFiles || []).length > 0 ? (
                          <div className="space-y-2">
                            {(activeCrit.proofFiles || []).map((fileObj: any, fIdx: number) => (
                              <div
                                key={fIdx}
                                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                    <FileText className="w-4.5 h-4.5" />
                                  </div>
                                  <div className="text-left">
                                    <span className="text-xs font-black text-slate-800 block truncate max-w-[320px] hover:text-blue-700 hover:underline cursor-pointer font-sans" onClick={() => handlePreviewFile(fileObj.name)}>
                                      {fileObj.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5">
                                      {fileObj.size} &bull; Đã tải lên
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handlePreviewFile(fileObj.name)}
                                  className="p-1.5 text-slate-400 hover:text-[#014285] hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold bg-slate-50/50">
                            Chưa có tệp minh chứng đính kèm cho tiêu chí này
                          </div>
                        )}
                      </div>

                      {/* Hướng dẫn thực hiện */}
                      <div className="bg-[#f0fdf4] border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-left">
                        <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] text-emerald-800 font-black uppercase tracking-wider block">Hướng dẫn kỹ thuật</span>
                          <p className="text-xs text-emerald-700 font-bold leading-relaxed">{activeCrit.guidelines}</p>
                          <a href="#doc" onClick={(e) => { e.preventDefault(); if (onViewGuideDoc) { onViewGuideDoc(activeCrit.guideDoc); } else { handlePreviewFile(activeCrit.guideDoc); } }} className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1 mt-1 cursor-pointer font-sans">
                            Xem văn bản pháp chế {activeCrit.guideDoc}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW BIỂU 11 */}
          {viewingFormCode === 'Biểu 11' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 text-left">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Biểu 11 - Tổng hợp kết quả huy động nguồn lực thực hiện chương trình</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 font-sans">Đơn vị báo cáo: Cấp Xã &bull; ĐVT: Triệu đồng &bull; Trạng thái: {b11?.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                <table className="w-full border-collapse text-left text-xs min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <th className="p-3.5 border-r border-slate-200 text-center w-14">STT</th>
                      <th className="p-3.5 border-r border-slate-200">Nội dung chi tiêu</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-36">Kế hoạch năm 2024</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-36">6 Tháng đầu năm</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-36">6 Tháng cuối năm</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-36">Ước thực hiện cả năm</th>
                      <th className="p-3.5 text-center w-36 text-blue-700 bg-blue-50/50">Tỷ lệ giải ngân</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-bold text-slate-700">
                    <tr className="bg-slate-50 font-black text-slate-900 border-b border-slate-200 text-center">
                      <td className="p-3.5 border-r border-slate-200 text-center"></td>
                      <td className="p-3.5 border-r border-slate-200 uppercase text-left">TỔNG SỐ</td>
                      <td className="p-3.5 border-r border-slate-200">{tong_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3.5 border-r border-slate-200">{tong_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3.5 border-r border-slate-200">{tong_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3.5 border-r border-slate-200 bg-slate-150/10">{tong_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3.5 text-center font-black bg-blue-50/40 text-blue-800 text-sm font-sans">{tong_percent.toFixed(1)}%</td>
                    </tr>

                    {/* I. NSTW */}
                    <tr className="bg-slate-50/20 font-black text-slate-800 text-center">
                      <td className="p-3 border-r border-slate-200">I</td>
                      <td className="p-3 border-r border-slate-200 uppercase text-left">NGÂN SÁCH TRUNG ƯƠNG</td>
                      <td className="p-3 border-r border-slate-200">{i_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{i_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{i_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{i_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3 text-center text-blue-700 font-sans">{i_percent.toFixed(1)}%</td>
                    </tr>
                    <tr className="text-center">
                      <td className="p-2.5 border-r border-slate-200 pl-6 text-slate-400">1</td>
                      <td className="p-2.5 border-r border-slate-200 text-left pl-8">Vốn đầu tư công</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.i1_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.i1_first.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.i1_second.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200 bg-slate-50/35">{(d11.i1_first + d11.i1_second).toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 text-center text-slate-400 font-normal italic">Tự động...</td>
                    </tr>
                    <tr className="text-center">
                      <td className="p-2.5 border-r border-slate-200 pl-6 text-slate-400">2</td>
                      <td className="p-2.5 border-r border-slate-200 text-left pl-8">Kinh phí thường xuyên</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.i2_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.i2_first.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.i2_second.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200 bg-slate-50/35">{(d11.i2_first + d11.i2_second).toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 text-center text-slate-400 font-normal italic">Tự động...</td>
                    </tr>

                    {/* II. NSĐP */}
                    <tr className="bg-slate-50/20 font-black text-slate-800 text-center">
                      <td className="p-3 border-r border-slate-200">II</td>
                      <td className="p-3 border-r border-slate-200 uppercase text-left">NGÂN SÁCH ĐỊA PHƯƠNG</td>
                      <td className="p-3 border-r border-slate-200">{ii_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{ii_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{ii_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{ii_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3 text-center text-blue-700 font-sans">{ii_percent.toFixed(1)}%</td>
                    </tr>
                    <tr className="text-center">
                      <td className="p-2.5 border-r border-slate-200 pl-6 text-slate-400">1</td>
                      <td className="p-2.5 border-r border-slate-200 text-left pl-8">Ngân sách cấp tỉnh</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.ii1_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.ii1_first.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.ii1_second.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200 bg-slate-50/35">{(d11.ii1_first + d11.ii1_second).toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 text-center text-slate-400 font-normal italic">Tự động...</td>
                    </tr>
                    <tr className="text-center">
                      <td className="p-2.5 border-r border-slate-200 pl-6 text-slate-400">2</td>
                      <td className="p-2.5 border-r border-slate-200 text-left pl-8">Ngân sách cấp huyện</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.ii2_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.ii2_first.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.ii2_second.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200 bg-slate-50/35">{(d11.ii2_first + d11.ii2_second).toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 text-center text-slate-400 font-normal italic">Tự động...</td>
                    </tr>

                    {/* III. Vốn lồng ghép */}
                    <tr className="hover:bg-slate-50/10 text-center">
                      <td className="p-3 border-r border-slate-200 font-black text-slate-800">III</td>
                      <td className="p-3 border-r border-slate-200 text-left font-black text-slate-800 uppercase">Vốn lồng ghép từ các chương trình dự án khác</td>
                      <td className="p-3 border-r border-slate-200">{d11.iii_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{d11.iii_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{d11.iii_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{iii_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3 text-center text-blue-700 font-black font-sans">{iii_percent.toFixed(1)}%</td>
                    </tr>

                    {/* IV. Vốn tín dụng */}
                    <tr className="hover:bg-slate-50/10 text-center">
                      <td className="p-3 border-r border-slate-200 font-black text-slate-800">IV</td>
                      <td className="p-3 border-r border-slate-200 text-left font-black text-slate-800 uppercase">Vốn tín dụng chính sách</td>
                      <td className="p-3 border-r border-slate-200">{d11.iv_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{d11.iv_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{d11.iv_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{iv_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3 text-center text-blue-700 font-black font-sans">{iv_percent.toFixed(1)}%</td>
                    </tr>

                    {/* V. Vốn DN */}
                    <tr className="hover:bg-slate-50/10 text-center">
                      <td className="p-3 border-r border-slate-200 font-black text-slate-800">V</td>
                      <td className="p-3 border-r border-slate-200 text-left font-black text-slate-800 uppercase">Vốn huy động từ doanh nghiệp</td>
                      <td className="p-3 border-r border-slate-200">{d11.v_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{d11.v_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{d11.v_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{v_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3 text-center text-blue-700 font-black font-sans">{v_percent.toFixed(1)}%</td>
                    </tr>

                    {/* VI. Vốn dân góp */}
                    <tr className="bg-slate-50/20 font-black text-slate-800 text-center">
                      <td className="p-3 border-r border-slate-200">VI</td>
                      <td className="p-3 border-r border-slate-200 uppercase text-left">VỐN ĐÓNG GÓP CỦA CỘNG ĐỒNG VÀ NGƯỜI DÂN</td>
                      <td className="p-3 border-r border-slate-200">{vi_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{vi_first.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{vi_second.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{vi_total.toLocaleString('vi-VN')}</td>
                      <td className="p-3 text-center text-blue-700 font-sans">{vi_percent.toFixed(1)}%</td>
                    </tr>
                    <tr className="text-center">
                      <td className="p-2.5 border-r border-slate-200 pl-6 text-slate-400">1</td>
                      <td className="p-2.5 border-r border-slate-200 text-left pl-8">Ngày công đóng góp quy đổi</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.vi1_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.vi1_first.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.vi1_second.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200 bg-slate-50/35">{(d11.vi1_first + d11.vi1_second).toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 text-center text-slate-400 font-normal italic">Tự động...</td>
                    </tr>
                    <tr className="text-center">
                      <td className="p-2.5 border-r border-slate-200 pl-6 text-slate-400">2</td>
                      <td className="p-2.5 border-r border-slate-200 text-left pl-8">Tiền mặt hoặc hiện vật đóng góp</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.vi2_plan.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.vi2_first.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200">{d11.vi2_second.toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 border-r border-slate-200 bg-slate-50/35">{(d11.vi2_first + d11.vi2_second).toLocaleString('vi-VN')}</td>
                      <td className="p-2.5 text-center text-slate-400 font-normal italic">Tự động...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW BIỂU 12 */}
          {viewingFormCode === 'Biểu 12' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 text-left">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Biểu 12 - Kết quả huy động và thực hiện nguồn lực đầu tư chương trình</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 font-sans">Đơn vị báo cáo: Cấp Xã &bull; ĐVT: Triệu đồng &bull; Trạng thái: {b12?.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs animate-fade-in">
                <table className="w-full border-collapse text-left text-[11px] min-w-[1500px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 text-center uppercase tracking-wider">
                      <th rowSpan={3} className="p-2 border-r border-slate-200 w-14">STT</th>
                      <th rowSpan={3} className="p-2 border-r border-slate-200 min-w-[250px] text-left">Nội dung huy động</th>
                      <th rowSpan={3} className="p-2 border-r border-slate-200 w-20">Số lượng (Công trình)</th>
                      <th colSpan={8} className="p-2 border-r border-slate-200 bg-blue-50/30 text-blue-900">Kinh phí thực hiện</th>
                      <th colSpan={8} className="p-2 bg-amber-55/15 text-amber-900">Kế hoạch vốn giai đoạn</th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 text-center">
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-22 bg-blue-50/10">Tổng số</th>
                      <th colSpan={3} className="p-2 border-r border-slate-200 bg-blue-50/10">Vốn Đầu Tư Công</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-blue-50/10">Lồng ghép</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-blue-50/10">Tín dụng</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-blue-50/10">Doanh nghiệp</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-blue-50/10">Dân đóng góp</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-22 bg-amber-50/20">Tổng số</th>
                      <th colSpan={3} className="p-2 border-r border-slate-200 bg-amber-50/20">Vốn Đầu Tư Công</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-amber-50/20">Lồng ghép</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-amber-50/20">Tín dụng</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-amber-50/20">Doanh nghiệp</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-200 w-20 bg-amber-50/20">Dân đóng góp</th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-center tracking-wide">
                      <th className="p-1 border-r border-slate-200 bg-blue-50/5">NSTW ĐTPT</th>
                      <th className="p-1 border-r border-slate-200 bg-blue-50/5">NSTW SN</th>
                      <th className="p-1 border-r border-slate-200 bg-blue-50/5">NS Địa Phương</th>
                      <th className="p-1 border-r border-slate-200 bg-amber-50/10">NSTW ĐTPT</th>
                      <th className="p-1 border-r border-slate-200 bg-amber-50/10">NSTW SN</th>
                      <th className="p-1 border-r border-slate-200 bg-amber-50/10">NS Địa Phương</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-bold text-slate-700 text-center">
                    <tr className="bg-slate-100 font-black text-[#0f2942] text-xs">
                      <td className="p-2.5 border-r border-slate-200"></td>
                      <td className="p-2.5 border-r border-slate-200 text-left uppercase">TỔNG CỘNG</td>
                      <td className="p-2.5 border-r border-slate-200">{calculatedTotals12.quantity}</td>
                      <td className="p-2.5 border-r border-slate-200 text-blue-700 font-black font-sans">{calculatedTotals12.hd_tongSo.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200 bg-blue-50/10">{calculatedTotals12.hd_nstw_dtpt.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200 bg-blue-50/10">{calculatedTotals12.hd_nstw_sn.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200 bg-blue-50/10">{calculatedTotals12.hd_nsdp.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.hd_longGhep.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.hd_tinDung.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.hd_doanhNghiep.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.hd_danGop.toLocaleString('vi-VN')}</td>

                      <td className="p-2.5 border-r border-slate-200 text-amber-900 font-black font-sans">{calculatedTotals12.kh_tongSo.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200 bg-amber-50/10">{calculatedTotals12.kh_nstw_dtpt.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200 bg-amber-50/10">{calculatedTotals12.kh_nstw_sn.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200 bg-amber-50/10">{calculatedTotals12.kh_nsdp.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.kh_longGhep.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.kh_tinDung.toLocaleString('vi-VN')}</td>
                      <td className="p-2 border-r border-slate-200">{calculatedTotals12.kh_doanhNghiep.toLocaleString('vi-VN')}</td>
                      <td className="p-2">{calculatedTotals12.kh_danGop.toLocaleString('vi-VN')}</td>
                    </tr>

                    {b12Data.map((row: any) => {
                      if (row.isHeader) {
                        return (
                          <tr key={row.id} className="bg-slate-100 border-y border-slate-200 text-[#0f2942] font-black text-left">
                            <td className="p-2.5 border-r border-slate-200 text-center font-black select-none text-xs">{row.sectionCode}</td>
                            <td colSpan={17} className="p-2.5 pl-4 sticky left-0 text-left font-black uppercase text-[10px] tracking-wide bg-slate-100">
                              {row.category}
                            </td>
                          </tr>
                        );
                      }

                      // Compute hierarchy
                      let ttDisplay = "";
                      if (row.parentId) {
                        const parentTT = parentTTMap[row.parentId] || "";
                        childCountMap[row.parentId] = (childCountMap[row.parentId] || 0) + 1;
                        ttDisplay = parentTT ? `${parentTT}.${childCountMap[row.parentId]}` : childCountMap[row.parentId].toString();
                      } else {
                        if (row.sectionCode === "I") {
                          countI++;
                          ttDisplay = countI.toString();
                        } else if (row.sectionCode === "II") {
                          countII++;
                          ttDisplay = countII.toString();
                        } else if (row.sectionCode === "III") {
                          countIII++;
                          ttDisplay = countIII.toString();
                        }
                        parentTTMap[row.id] = ttDisplay;
                      }

                      const hd_dtpt = Number(row.hd_nstw_dtpt) || 0;
                      const hd_sn = Number(row.hd_nstw_sn) || 0;
                      const hd_nsdp = Number(row.hd_nsdp) || 0;
                      const hd_vdt_tot = hd_dtpt + hd_sn + hd_nsdp;
                      const hd_tot = hd_vdt_tot + (Number(row.hd_longGhep) || 0) + (Number(row.hd_tinDung) || 0) + (Number(row.hd_doanhNghiep) || 0) + (Number(row.hd_danGop) || 0);

                      const kh_dtpt = Number(row.kh_nstw_dtpt) || 0;
                      const kh_sn = Number(row.kh_nstw_sn) || 0;
                      const kh_nsdp = Number(row.kh_nsdp) || 0;
                      const kh_vdt_tot = kh_dtpt + kh_sn + kh_nsdp;
                      const kh_tot = kh_vdt_tot + (Number(row.kh_longGhep) || 0) + (Number(row.kh_tinDung) || 0) + (Number(row.kh_doanhNghiep) || 0) + (Number(row.kh_danGop) || 0);

                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2 border-r border-[#e2e8f0] text-center text-slate-500 font-mono font-bold select-none">{ttDisplay}</td>
                          <td className="p-2 border-r border-[#e2e8f0] text-left sticky left-0 bg-white hover:bg-slate-50 transition-colors min-w-[250px]">
                            <div className="flex items-center gap-1.5 w-full">
                              {row.parentId && (
                                <span className="text-slate-400 pl-4 shrink-0 font-light select-none">↳</span>
                              )}
                              <span className="font-extrabold text-slate-800 truncate leading-relaxed">{row.category}</span>
                            </div>
                          </td>
                          <td className="p-2 border-r border-[#e2e8f0]">{row.quantity}</td>
                          <td className="p-2 border-r border-[#e2e8f0] text-blue-700 font-bold bg-blue-50/10 font-sans">{hd_tot.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{hd_dtpt.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{hd_sn.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{hd_nsdp.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.hd_longGhep).toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.hd_tinDung).toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.hd_doanhNghiep).toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.hd_danGop).toLocaleString('vi-VN')}</td>

                          <td className="p-2 border-r border-[#e2e8f0] text-amber-800 font-bold bg-amber-50/10 font-sans">{kh_tot.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{kh_dtpt.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{kh_sn.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{kh_nsdp.toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.kh_longGhep).toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.kh_tinDung).toLocaleString('vi-VN')}</td>
                          <td className="p-2 border-r border-[#e2e8f0]">{Number(row.kh_doanhNghiep).toLocaleString('vi-VN')}</td>
                          <td className="p-2">{Number(row.kh_danGop).toLocaleString('vi-VN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW BIỂU 13 */}
          {viewingFormCode === 'Biểu 13' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Biểu 13 - Kết quả giải ngân vốn đầu tư công ngân sách TW</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 font-sans">Đơn vị báo cáo: Cấp Xã &bull; ĐVT: Triệu đồng &bull; Trạng thái: {b13?.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 border border-slate-200 rounded-xl font-sans">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tổng giá trị giải ngân</span>
                    <h4 className="text-sm font-black text-slate-800 mt-0.5">{sumResult13.toLocaleString('vi-VN')} / {sumPlan13.toLocaleString('vi-VN')} triệu</h4>
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    {sumPercent13}%
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                <table className="w-full border-collapse text-left text-xs min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider text-center">
                      <th className="p-3.5 border-r border-slate-200 text-center w-14">STT</th>
                      <th className="p-3.5 border-r border-slate-200 min-w-[280px] text-left">Tên danh mục công trình/dự án</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-40">Kế hoạch vốn (Triệu đồng)</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-40">Giải ngân 6 tháng đầu năm</th>
                      <th className="p-3.5 border-r border-slate-200 text-center w-40 bg-blue-50/10 text-blue-900">Tỷ lệ hoàn thành</th>
                      <th className="p-3.5 text-left pl-6">Ghi chú tiến độ thực địa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-bold text-slate-700">
                    <tr className="bg-slate-50 font-black text-slate-900 border-b border-slate-200 text-center">
                      <td className="p-3 border-r border-slate-200"></td>
                      <td className="p-3 border-r border-slate-200 text-left uppercase font-black">TỔNG CỘNG HẠ TẦNG</td>
                      <td className="p-3 border-r border-slate-200">{sumPlan13.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200">{sumResult13.toLocaleString('vi-VN')}</td>
                      <td className="p-3 border-r border-slate-200 bg-blue-50/30 text-blue-800 text-sm font-black font-sans">{sumPercent13}%</td>
                      <td className="p-3 text-left text-slate-400 font-medium italic pl-6">Tự động lũy kế toàn xã...</td>
                    </tr>

                    {b13Data.map((row: any, idx: number) => {
                      const pct = row.group1?.prevYear > 0 ? Math.round((row.group1.currentS1 / row.group1.prevYear) * 100) : 0;
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors text-center">
                          <td className="p-2.5 border-r border-slate-200 text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 border-r border-slate-200 text-left font-extrabold text-[#0f2942]">{row.category}</td>
                          <td className="p-2.5 border-r border-slate-200">{row.group1?.prevYear?.toLocaleString('vi-VN')}</td>
                          <td className="p-2.5 border-r border-slate-200">{row.group1?.currentS1?.toLocaleString('vi-VN')}</td>
                          <td className="p-2.5 border-r border-slate-200 bg-blue-50/5 text-blue-700 font-black font-sans">{pct}%</td>
                          <td className="p-2.5 text-left text-slate-555 font-medium pl-6">{row.note || 'Chưa ghi nhận vướng mắc.'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* DECISION APPRAISAL CARD (Màn hình ra quyết định thẩm định trực tiếp) */}
        <div className="bg-[#f8fafc] p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm text-left">
          <div>
            <h3 className="text-xs font-black uppercase text-[#014285] tracking-wider">Ra Quyết Định Thẩm Định Hồ Sơ</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Cung cấp ý kiến đóng góp, lý do sửa đổi chi tiết cho cấp dưới trước khi phê duyệt hoặc yêu cầu bổ sung.</p>
          </div>

          <textarea
            rows={3}
            value={decisionComment}
            onChange={(e) => setDecisionComment(e.target.value)}
            placeholder="Nhập nội dung phản hồi thẩm định cho xã..."
            className="w-full text-xs font-bold p-3.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-2xl outline-none transition-all font-sans"
          />

          <div className="flex gap-4 max-w-md">
            <button
              onClick={() => {
                updateDossierStatus(activeDossier.id, 'ĐÃ ĐẠT', decisionComment);
                setIsViewingFullForms(false);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-md border-none"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Phê duyệt hồ sơ</span>
            </button>

            <button
              onClick={() => {
                if (!decisionComment) {
                  setAlertConfig({ message: 'Vui lòng cung cấp ý kiến đóng góp / lý do sửa đổi ở ô văn bản trước!', type: 'warning' });
                  setIsAlertVisible(true);
                  setTimeout(() => setIsAlertVisible(false), 3000);
                  return;
                }
                updateDossierStatus(activeDossier.id, 'CẦN SỬA', decisionComment);
                setIsViewingFullForms(false);
              }}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-md border-none"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Yêu cầu chỉnh sửa</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-12 font-sans select-none animate-fade-in" id="appraisal-panel-container">

      {isAlertVisible && (
        <div className={`fixed bottom-6 right-6 ${alertConfig.type === 'success' ? 'bg-emerald-900/95 border-emerald-800' :
          alertConfig.type === 'warning' ? 'bg-rose-950/95 border-rose-900' : 'bg-slate-900/95 border-slate-800'
          } backdrop-blur-md border text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-300 animate-fade-in`}>
          {alertConfig.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : alertConfig.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <FileCode2 className="w-5 h-5 text-sky-400 shrink-0" />
          )}
          <span className="text-xs font-bold leading-normal">{alertConfig.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <span>Hệ thống</span>
            <span className="text-slate-300">&rarr;</span>
            <span className="text-[#014285] font-black">Thẩm định hồ sơ</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none" id="appraisal-title">
            Phê duyệt & Thẩm định báo cáo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full md:w-auto" id="stats-appraisal-block">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 px-5 flex items-center gap-4.5 shadow-sm transition-all hover:border-slate-300 w-full">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Folder className="w-5 h-5 fill-amber-100" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <span className="text-xs font-extrabold text-[#64748b] tracking-wider uppercase block truncate">
                Chờ thẩm định
              </span>
              <span className="text-sm sm:text-lg font-black text-slate-800 leading-tight block whitespace-nowrap">
                {stats.pending} hồ sơ
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 px-5 flex items-center gap-4.5 shadow-sm transition-all hover:border-slate-300 w-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <span className="text-xs font-extrabold text-[#64748b] tracking-wider uppercase block truncate">
                Đã hoàn thành
              </span>
              <span className="text-sm sm:text-lg font-black text-slate-800 leading-tight block whitespace-nowrap">
                {stats.completed} hồ sơ
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="appraisal-grid">

        <div className="xl:col-span-8 space-y-5">

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4.5">

              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hồ sơ, địa phương..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col text-left gap-1 min-w-[150px] w-full md:w-auto">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Địa phương</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                  }}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer focus:border-blue-500 outline-none transition-all w-full truncate"
                >
                  <option value="Tất cả">Tất cả tỉnh thành</option>
                  <option value="Tỉnh Ninh Bình">Tỉnh Ninh Bình</option>
                  <option value="TP. Hà Nội">TP. Hà Nội</option>
                  <option value="TP. Hải Phòng">TP. Hải Phòng</option>
                  <option value="Tỉnh Quảng Ninh">Tỉnh Quảng Ninh</option>
                  <option value="Tỉnh Lâm Đồng">Tỉnh Lâm Đồng</option>
                </select>
              </div>

              <div className="flex flex-col text-left gap-1 min-w-[160px] w-full md:w-auto">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Nhóm tiêu chí</label>
                <select
                  value={selectedCriteriaGroup}
                  onChange={(e) => setSelectedCriteriaGroup(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer focus:border-blue-500 outline-none transition-all w-full truncate"
                >
                  <option value="Tất cả">Tất cả tiêu chí quốc gia xây dựng NTM</option>
                  <option value="Quy hoạch">Tiêu chí 1: Quy hoạch</option>
                  <option value="Điện">Tiêu chí 4: Điện</option>
                  <option value="Kinh tế">Kinh tế - Xã hội</option>
                </select>
              </div>

              <div className="flex flex-col text-left gap-1 min-w-[140px] w-full md:w-auto">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Trạng thái</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer focus:border-blue-500 outline-none transition-all w-full truncate"
                >
                  <option value="Chờ thẩm định">Chờ thẩm định</option>
                  <option value="Đã đạt">Đã hoàn thành</option>
                  <option value="Cần sửa">Yêu cầu bổ sung</option>
                </select>
              </div>

              <div className="flex items-end w-full md:w-auto">
                <button
                  onClick={() => {
                    setAlertConfig({ message: 'Đã kích hoạt lọc bộ đệm chỉ số theo tiêu chí mới!', type: 'info' });
                    setIsAlertVisible(true);
                    setTimeout(() => setIsAlertVisible(false), 2000);
                  }}
                  className="bg-[#014285] hover:bg-[#01356b] active:scale-95 text-white p-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer shadow-sm transition-all w-full md:w-auto"
                >
                  <Filter className="w-4 h-4" />
                  <span>Lọc hồ sơ</span>
                </button>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[#014285] uppercase text-xs font-black tracking-wider">
                    <th className="py-4.5 px-6 shrink-0 text-center w-[120px]">Mã hồ sơ</th>
                    <th className="py-4.5 px-6 leading-normal">Địa phương</th>
                    <th className="py-4.5 px-6 text-center w-[120px]">Ngày gửi</th>
                    <th className="py-4.5 px-6 w-[180px]">Tiến độ</th>
                    <th className="py-4.5 px-6 text-center w-[130px]">Trạng thái</th>
                    <th className="py-4.5 px-4 text-center w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDossiers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm font-bold text-slate-400 uppercase tracking-wide">
                        Không lưu trữ hồ sơ nào trùng hợp với mốc tìm kiếm...
                      </td>
                    </tr>
                  ) : (
                    filteredDossiers.map((row) => {
                      const isActive = row.id === activeDossierId;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => {
                            setActiveDossierId(row.id);
                            setDecisionComment('');
                          }}
                          className={`cursor-pointer transition-all hover:bg-slate-50/50 ${isActive ? 'bg-[#ebf3fc]/70 hover:bg-[#ebf3fc]/90' : ''
                            }`}
                        >
                          <td className="py-4.5 px-6 text-center">
                            <span className="text-sm font-black text-blue-700 tracking-tight block hover:underline">
                              {row.code}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-extrabold text-[#0f2942]">
                                {row.province}
                              </span>
                              <span className="text-xs text-[#64748b] font-medium leading-relaxed">
                                {row.district} &bull; {row.commune}
                              </span>
                            </div>
                          </td>
                          <td className="py-4.5 px-6 text-center text-slate-500 font-mono text-xs font-bold">
                            {row.submissionDate}
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="space-y-1.5 text-left">
                              <div className="flex justify-between items-center text-xs font-black text-[#475569]">
                                <span>{row.progress}% Hoàn thành</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${row.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                    }`}
                                  style={{ width: `${row.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4.5 px-6 text-center">
                            {row.status === 'CHỜ DUYỆT' && (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 border border-amber-200 text-amber-600 tracking-wide uppercase whitespace-nowrap">
                                Chờ duyệt
                              </span>
                            )}
                            {row.status === 'ĐÃ ĐẠT' && (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-600 tracking-wide uppercase whitespace-nowrap">
                                Đã đạt
                              </span>
                            )}
                            {row.status === 'CẦN SỬA' && (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-rose-50 border border-rose-200 text-rose-500 tracking-wide uppercase whitespace-nowrap">
                                Cần sửa
                              </span>
                            )}
                          </td>
                          <td className="py-4.5 px-4 text-center">
                            <ChevronRight className={`w-4 h-4 transition-all ${isActive ? 'text-blue-600 translate-x-1' : 'text-slate-300'}`} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4" id="appraisal-sidebar-drawer">
          {activeDossier ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden text-left flex flex-col pt-3 pb-6 animate-fade-in">

              <div className="px-6 py-4.5 border-b border-slate-150 flex justify-between items-start bg-[#014285] text-white -mt-3.5">
                <div className="space-y-1">
                  <span className="text-xs bg-[#0256ab] border border-[#0d6bce] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest text-[#93c7ff]">
                    CHI TIẾT HỒ SƠ
                  </span>
                  <h3 className="text-md font-black tracking-tight mt-1">{activeDossier.code}</h3>
                  <p className="text-xs text-slate-200/90 font-medium">
                    {activeDossier.commune}, {activeDossier.district}, {activeDossier.province}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveDossierId(null);
                    setAlertConfig({ message: 'Đã đóng tóm tắt hồ sơ.', type: 'info' });
                    setIsAlertVisible(true);
                    setTimeout(() => setIsAlertVisible(false), 2000);
                  }}
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded-xl transition-all cursor-pointer text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[720px] overflow-y-auto" id="drawer-body">
                {periods.find(p => p.id === activeDossier.id) ? (
                  (() => {
                    const targetPeriod = periods.find(p => p.id === activeDossier.id)!;
                    return (
                      <div className="space-y-4">
                        <button
                          onClick={() => {
                            setIsViewingFullForms(true);
                            setViewingFormCode('Biểu 10');
                            setSelectedCritId(1);
                          }}
                          className="w-full bg-[#014285] hover:bg-[#002854] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer mb-2 border-none"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem toàn bộ biểu mẫu nộp</span>
                        </button>
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-205">
                          <button
                            onClick={() => setAppraisalTab('tech')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all border-none ${appraisalTab === 'tech'
                              ? 'bg-[#014285] text-white shadow-sm'
                              : 'text-slate-500 bg-transparent hover:text-slate-800'
                              }`}
                          >
                            Kỹ thuật
                          </button>
                          <button
                            onClick={() => setAppraisalTab('finance')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all border-none ${appraisalTab === 'finance'
                              ? 'bg-[#014285] text-white shadow-sm'
                              : 'text-slate-500 bg-transparent hover:text-slate-800'
                              }`}
                          >
                            Tài chính
                          </button>
                        </div>

                        {appraisalTab === 'tech' && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-slate-50/80 p-1.5 px-3 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-black uppercase text-[#014285] tracking-tight">Kỹ thuật (Biểu 10)</span>
                              <span className="text-[10px] text-slate-400 font-bold">10 tiêu chí</span>
                            </div>

                            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                              {(() => {
                                const b10 = targetPeriod.forms.find(f => f.code === 'Biểu 10');
                                const b10Data = Array.isArray(b10?.data) ? b10.data : [];
                                return b10Data.map((row: any) => {
                                  const isDone = row.group2.currentS1 >= row.group2.planS2;
                                  return (
                                    <div key={row.id} className="p-3 bg-[#f8fafc]/90 rounded-xl border border-slate-205 leading-normal flex flex-col gap-1.5">
                                      <div className="flex justify-between items-start gap-2">
                                        <span className="text-xs font-bold text-slate-800 truncate" title={row.category}>
                                          {row.category}
                                        </span>
                                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded shrink-0 ${isDone ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                          }`}>
                                          {isDone ? 'Đạt' : 'Chưa đạt'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-455 uppercase tracking-wider">
                                        <span>Đạt: <strong className="text-slate-700">{row.group2.currentS1} {row.unit}</strong></span>
                                        <span>Kế hoạch: <strong className="text-slate-700">{row.group2.planS2} {row.unit}</strong></span>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}

                        {appraisalTab === 'finance' && (
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-center bg-slate-50/80 p-1.5 px-3 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-black uppercase text-[#014285] tracking-tight">Tài chính (Biểu 11, 12, 13)</span>
                              <span className="text-[10px] text-slate-400 font-bold">Vốn & Nguồn lực</span>
                            </div>

                            {(() => {
                              const b12 = targetPeriod.forms.find(f => f.code === 'Biểu 12');
                              const b12Data = Array.isArray(b12?.data) ? b12.data : [];

                              const sumPlanned = b12Data.reduce((acc, row) => acc + (row.kh_nstw_dtpt + row.kh_nstw_sn + row.kh_nsdp + row.kh_longGhep + row.kh_tinDung + row.kh_doanhNghiep + row.kh_danGop || 0), 0);
                              const sumImplemented = b12Data.reduce((acc, row) => acc + (row.hd_nstw_dtpt + row.hd_nstw_sn + row.hd_nsdp + row.hd_longGhep + row.hd_tinDung + row.hd_doanhNghiep + row.hd_danGop || 0), 0);
                              const percentDisbursed = sumPlanned > 0 ? Math.round((sumImplemented / sumPlanned) * 100) : 0;

                              return (
                                <div className="space-y-4">
                                  <div className="bg-[#023366] text-white p-4.5 rounded-2xl border border-slate-800 shadow-inner flex flex-col justify-between">
                                    <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest block">Tỷ lệ giải ngân nguồn vốn</span>
                                    <div className="flex justify-between items-baseline mt-2">
                                      <h4 className="text-2xl font-black text-white leading-none">{percentDisbursed}%</h4>
                                      <span className="text-[10px] font-black text-emerald-400">Đạt kế hoạch</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
                                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${percentDisbursed}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-350 font-bold mt-2 pt-1.5 border-t border-white/5">
                                      <span>Kế hoạch: {(sumPlanned / 1000).toFixed(1)} tỷ</span>
                                      <span>Giải ngân: {(sumImplemented / 1000).toFixed(1)} tỷ</span>
                                    </div>
                                  </div>

                                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {b12Data.slice(0, 5).map((row: any) => {
                                      const rowKh = row.kh_nstw_dtpt + row.kh_nstw_sn + row.kh_nsdp + row.kh_longGhep + row.kh_tinDung + row.kh_doanhNghiep + row.kh_danGop;
                                      const rowHd = row.hd_nstw_dtpt + row.hd_nstw_sn + row.hd_nsdp + row.hd_longGhep + row.hd_tinDung + row.hd_doanhNghiep + row.hd_danGop;
                                      const rowPct = rowKh > 0 ? Math.round((rowHd / rowKh) * 100) : 0;
                                      return (
                                        <div key={row.id} className="p-2.5 bg-[#f8fafc]/90 rounded-xl border border-slate-205 leading-normal flex flex-col gap-1.5">
                                          <div className="flex justify-between items-start gap-2">
                                            <span className="text-xs font-bold text-slate-700 truncate" title={row.category}>{row.category}</span>
                                            <span className="text-[10px] font-black text-[#014285]">{rowPct}%</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#014285] h-full rounded-full" style={{ width: `${rowPct}%` }} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50/80 p-1.5 px-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-black uppercase text-[#014285] tracking-tight">Dữ liệu tiêu chí</span>
                      <span className="text-xs text-slate-400 font-bold">Cập nhật: 2h trước</span>
                    </div>

                    <div className="space-y-2.5">
                      {activeDossier.criteriaData.map((crit, idx) => (
                        <div key={idx} className="p-3 bg-[#f8fafc]/90 rounded-2xl border border-slate-200/60 leading-normal">
                          <span className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1">
                            {crit.title}
                          </span>
                          <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                            <span>{crit.metric}</span>
                            <span className="font-extrabold text-[#014285] text-xs">{crit.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#014285] tracking-tight border-b border-slate-100 pb-1.5 pl-1">
                    Tài liệu kiểm chứng
                  </h4>

                  <div className="space-y-2">
                    {activeDossier.proofFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/80 border border-slate-200/70 rounded-2xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9.5 h-9.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate leading-tight hover:text-blue-700 hover:underline cursor-pointer" onClick={() => handlePreviewFile(file.name)}>
                              {file.name}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {file.size} &bull; {file.date}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePreviewFile(file.name)}
                          className="p-1.5 text-slate-400 hover:text-[#014285] hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Module 3: RA QUYẾT ĐỊNH */}
                <div className="bg-[#f8fafc] p-4.5 rounded-2xl border border-slate-200/90 space-y-3.5 shadow-inner">
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase text-[#014285] tracking-tight">RA QUYẾT ĐỊNH</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Ý kiến thẩm định / Lý do từ chối (nếu có)</p>
                  </div>

                  <textarea
                    rows={3}
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    placeholder="Nhập nội dung phản hồi cho đề xuất/kiết thiết cấp dưới..."
                    className="w-full text-xs font-bold p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-xl outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                  />

                  {/* Operational Decision Control Buttons */}
                  <div className="flex gap-2.5">
                    {/* Phê duyệt button */}
                    <button
                      onClick={() => {
                        updateDossierStatus(activeDossier.id, 'ĐÃ ĐẠT', decisionComment);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-extrabold cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-100"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Phê duyệt</span>
                    </button>

                    {/* Yêu cầu sửa button */}
                    <button
                      onClick={() => {
                        if (!decisionComment) {
                          setAlertConfig({ message: 'Vui lòng cung cấp ý kiến đóng góp / lý do sửa đổi ở ô văn bản trước!', type: 'warning' });
                          setIsAlertVisible(true);
                          setTimeout(() => setIsAlertVisible(false), 3000);
                          return;
                        }
                        updateDossierStatus(activeDossier.id, 'CẦN SỬA', decisionComment);
                      }}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 hover:shadow-rose-200 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-extrabold cursor-pointer transition-all active:scale-95 shadow-md shadow-rose-100"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Yêu cầu sửa</span>
                    </button>
                  </div>
                </div>

                {/* Module 4: Lịch sử xử lý */}
                <div className="space-y-3.5 text-left">
                  <h4 className="text-xs font-black uppercase text-[#014285] tracking-tight border-b border-slate-100 pb-1.5 pl-1">
                    Lịch sử xử lý
                  </h4>

                  {/* History Timeline */}
                  <div className="relative pl-5 border-l border-slate-150 space-y-4 ml-2 pb-1.5">
                    {activeDossier.history.map((hist, idx) => (
                      <div key={idx} className="relative leading-relaxed text-xs text-slate-500 font-bold">
                        {/* Bullet indicators */}
                        <div className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 ${idx === 0 ? 'bg-blue-600 border-blue-100 animate-pulse' : 'bg-slate-300 border-white'
                          }`} />

                        <div className="flex justify-between text-xs text-slate-800 font-black">
                          <span>{hist.action}</span>
                          <span className="text-xs text-slate-400 font-extrabold font-mono shrink-0">{hist.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Thực hiện bởi &bull; {hist.actor}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-3">
              <Folder className="w-10 h-10 text-slate-300 stroke-[1.5]" />
              <span>HÃY LỰA CHỌN MỘT HỒ SƠ</span>
              <span className="text-xs text-slate-400 font-medium">Chọn một hồ sơ của địa phương trong danh sách để rà soát dữ liệu kiểm chứng và ra quyết định.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
