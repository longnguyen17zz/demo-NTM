import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Clock,
  Save,
  Send,
  Info,
  CheckCircle2,
  AlertTriangle,
  Upload,
  File,
  X,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Eye,
  Activity,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Calendar,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  AlignLeft,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  BookmarkCheck,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Download,
  Printer,
  Filter,
  MapPin,
  History
} from 'lucide-react';
import { FormReport, CriterionRow, ProofFile, UserSession, CommuneSubmission } from '../types';

interface PolicyRow {
  id: string;
  type: string;
  codeAndDate: string;
  summary: string;
  mainGoal: string;
  mainContent: string;
  notes: string;
  pdfFile: { name: string; size: string } | null;
}

interface Criteria10 {
  id: number;
  code: string;
  title: string;
  subTitle: string;
  statusText: string;
  isCompleted: boolean;
  decisionNo: string;
  decisionDate: string;
  note: string;
  proofFiles: { name: string; size: string }[];
  guidelines: string;
  guideDoc: string;
  isRateType?: boolean;
  numerator?: number;
  denominator?: number;
  targetPercent?: number;
  numeratorLabel?: string;
  denominatorLabel?: string;
  unit?: string;
  group1Threshold?: number;
  group2Threshold?: number;
  group3Threshold?: number;
}

const INITIAL_CRITERIA_10: Criteria10[] = [
  {
    id: 1,
    code: "Tiêu chí 1",
    title: "Tiêu chí 1: Quy hoạch",
    subTitle: "Cập nhật hồ sơ chứng minh cho nội dung quy hoạch xã nông thôn mới.",
    statusText: "Đã hoàn thiện",
    isCompleted: true,
    decisionNo: "1245/QĐ-UBND",
    decisionDate: "2024-03-15",
    note: "Đã phê duyệt điều chỉnh quy hoạch toàn khu đô thị vệ tinh đến năm 2030.",
    proofFiles: [
      { name: "QD_Phe_Duyet_Quy_Hoach_Xa.pdf", size: "2.4 MB" }
    ],
    guidelines: "Quy hoạch chung xây dựng xã phải được phê duyệt và công bố công khai. Cần có quy hoạch chi tiết khu trung tâm xã và các điểm dân cư mới. Nội dung quy hoạch phải đáp ứng yêu cầu tái cơ cấu ngành nông nghiệp và biến đổi khí hậu.",
    guideDoc: "124/HD-BNN"
  },
  {
    id: 2,
    code: "Tiêu chí 2",
    title: "Tiêu chí 2: Hạ tầng kinh tế - xã hội",
    subTitle: "Đo lường tỉ lệ đường giao thông, tuyến nội đồng nông nghiệp.",
    statusText: "Chưa đạt",
    isCompleted: false,
    decisionNo: "86/QĐ-UB",
    decisionDate: "2024-05-10",
    note: "Các trục đường thôn liên xã đang được đổ bê tông đạt 92% tiến độ.",
    proofFiles: [],
    guidelines: "Đường xã và đường từ trung tâm xã đến đường huyện được nhựa hóa hoặc bê tông hóa hoàn toàn. Tỷ lệ đường trục thôn, bản được cứng hóa tối thiểu đạt chuẩn 75%.",
    guideDoc: "15/HD-GTVT",
    isRateType: true,
    numerator: 72,
    denominator: 100,
    targetPercent: 75,
    group1Threshold: 85,
    group2Threshold: 75,
    group3Threshold: 65,
    unit: "km",
    numeratorLabel: "Chiều dài đường trục thôn, bản được cứng hóa",
    denominatorLabel: "Tổng chiều dài đường trục thôn, bản"
  },
  {
    id: 3,
    code: "Tiêu chí 3",
    title: "Tiêu chí 3: Thủy lợi và phòng chống thiên tai",
    subTitle: "Đảm bảo hạ tầng thủy lợi tưới tiêu nước nông thôn an toàn.",
    statusText: "Chưa đạt",
    isCompleted: false,
    decisionNo: "",
    decisionDate: "",
    note: "Kênh mương nội đồng nhánh đông nâng cấp chưa xong do sạt lở.",
    proofFiles: [],
    guidelines: "Tỉ lệ diện tích đất sản xuất nông nghiệp được tưới tiêu chủ cấp đạt từ 80% trở lên. Đứng vững đối phó mực nước lũ lụt thiên tai cục bộ hằng năm.",
    guideDoc: "88/HD-SNN",
    isRateType: true,
    numerator: 75,
    denominator: 100,
    targetPercent: 80,
    group1Threshold: 90,
    group2Threshold: 80,
    group3Threshold: 70,
    unit: "ha",
    numeratorLabel: "Diện tích đất nông nghiệp được tưới tiêu chủ động",
    denominatorLabel: "Tổng diện tích đất sản xuất nông nghiệp"
  },
  {
    id: 4,
    code: "Tiêu chí 4",
    title: "Tiêu chí 4: Điện",
    subTitle: "Mạng lưới điện sinh hoạt, sản xuất an toàn.",
    statusText: "Đạt",
    isCompleted: true,
    decisionNo: "342/EVN-QĐ",
    decisionDate: "2024-02-18",
    note: "100% các thôn và hộ gia đình sử dụng điện lưới đạt quy tải.",
    proofFiles: [
      { name: "ChungThucTrangThaiMangLuoiDienXa.pdf", size: "1.8 MB" }
    ],
    guidelines: "Đạt tiêu chuẩn kỹ thuật hạ tầng thiết kế lắp đặt của ngành điện lực Việt Nam. Tỷ lệ hộ dùng điện thường xuyên, an toàn đạt từ 98% trở lên.",
    guideDoc: "22/HD-BCT",
    isRateType: true,
    numerator: 99,
    denominator: 100,
    targetPercent: 98,
    group1Threshold: 99,
    group2Threshold: 98,
    group3Threshold: 95,
    unit: "hộ",
    numeratorLabel: "Số hộ dùng điện thường xuyên, an toàn",
    denominatorLabel: "Tổng số hộ dùng điện trong xã"
  },
  {
    id: 5,
    code: "Tiêu chí 5",
    title: "Tiêu chí 5: Trường học",
    subTitle: "Cơ sở vật chất trường học, phòng học chức năng.",
    statusText: "Đạt",
    isCompleted: true,
    decisionNo: "102/QĐ-SGD",
    decisionDate: "2024-01-20",
    note: "Đang duy trì chuẩn quốc gia mức 1 cho mẫu trường mầm non và THCS.",
    proofFiles: [
      { name: "QD_TrungHocCoSo_DatChuanQuocGia_Signed.pdf", size: "3.1 MB" }
    ],
    guidelines: "Tỷ lệ trường học các cấp có cơ sở vật chất, thiết bị dạy và học đạt mức chuẩn quy chế quốc gia tối thiểu 70% trở lên.",
    guideDoc: "105/HD-BGDDT",
    isRateType: true,
    numerator: 3,
    denominator: 4,
    targetPercent: 70,
    group1Threshold: 80,
    group2Threshold: 70,
    group3Threshold: 60,
    unit: "trường",
    numeratorLabel: "Số trường đạt chuẩn quốc gia",
    denominatorLabel: "Tổng số trường học trên địa bàn"
  },
  {
    id: 6,
    code: "Tiêu chí 6",
    title: "Tiêu chí 6: Cơ sở vật chất văn hóa",
    subTitle: "Hệ thống nhà văn hóa, khu thể thao xã, thôn bản.",
    statusText: "Đạt",
    isCompleted: true,
    decisionNo: "45/QĐ-SVHTTDL",
    decisionDate: "2024-04-12",
    note: "Lắp đặt xong dụng cụ thể thao ngoài trời tại trung tâm rèn luyện xã.",
    proofFiles: [],
    guidelines: "Xã có nhà văn hóa đạt chuẩn sinh hoạt cộng đồng, các thôn có sân thể thao hoặc địa điểm sinh hoạt văn hóa dân gian thích ứng.",
    guideDoc: "44/HD-VHTTDL"
  },
  {
    id: 7,
    code: "Tiêu chí 7",
    title: "Tiêu chí 7: Cơ sở hạ tầng thương mại nông thôn",
    subTitle: "Phát triển chợ nông thôn, siêu thị mini, chuỗi bán lẻ.",
    statusText: "Đang hoàn thiện",
    isCompleted: false,
    decisionNo: "15/QĐ-SCT",
    decisionDate: "2024-06-03",
    note: "Mẫu chợ trung tâm xã đang cấu trúc lại chuỗi vệ sinh phòng dịch.",
    proofFiles: [],
    guidelines: "Xã có chợ nông thôn đạt chuẩn theo quy định hoặc có siêu thị tiện ích, trung tâm phân phối thương mại xã đạt yêu cầu.",
    guideDoc: "32/HD-BCT"
  },
  {
    id: 8,
    code: "Tiêu chí 8",
    title: "Tiêu chí 8: Thông tin và Truyền thông",
    subTitle: "Truyền thanh không dây, điểm dịch vụ internet.",
    statusText: "Đạt",
    isCompleted: true,
    decisionNo: "66/QĐ-STTTT",
    decisionDate: "2024-02-28",
    note: "Phủ sóng mạng di động 4G/5G chất lượng cao đến tất cả hộ dân.",
    proofFiles: [],
    guidelines: "Đầy đủ hạ tầng truyền thanh cơ sở, điểm cung cấp internet công cộng tốt và có ứng dụng dịch vụ công trực tuyến một cửa.",
    guideDoc: "19/HD-BTTTT"
  },
  {
    id: 9,
    code: "Tiêu chí 9",
    title: "Tiêu chí 9: Nhà ở dân cư",
    subTitle: "Xóa nhà dột nát, đạt chuẩn kết cấu nhà kiên cố.",
    statusText: "Chưa đạt",
    isCompleted: false,
    decisionNo: "Mẫu rà soát 09",
    decisionDate: "2024-04-15",
    note: "Còn 3 hộ nghèo đang chờ phê chuẩn ngân sách hỗ trợ mái ấm kiên cố.",
    proofFiles: [],
    guidelines: "Không còn nhà tạm, dột nát dột mục. Tỷ lệ hộ gia định có nhà ở kiên cố hoặc bán kiên cố đạt từ 90% trở lên.",
    guideDoc: "110/HD-BXD",
    isRateType: true,
    numerator: 88,
    denominator: 100,
    targetPercent: 90,
    group1Threshold: 95,
    group2Threshold: 90,
    group3Threshold: 80,
    unit: "hộ",
    numeratorLabel: "Số hộ có nhà ở đạt chuẩn kiên cố/bán kiên cố",
    denominatorLabel: "Tổng số hộ dân trên địa bàn"
  },
  {
    id: 10,
    code: "Tiêu chí 10",
    title: "Tiêu chí 10: Thu nhập",
    subTitle: "Thu nhập bình quân đầu người hằng năm.",
    statusText: "Đạt",
    isCompleted: true,
    decisionNo: "119/QĐ-CTK",
    decisionDate: "2024-05-18",
    note: "Mức bình quân đạt 58 triệu đồng / người / năm tại các xã chuẩn mới.",
    proofFiles: [],
    guidelines: "Thu nhập bình quân đầu người cao gấp 1.5 lần trở lên so với mức tối thiểu quy định, đảm bảo mức tăng bền vững.",
    guideDoc: "33/HD-TCTK"
  }
];

// Generate indices 11 to 47 for exact realistic bento grid scrolling
for (let i = 11; i <= 47; i++) {
  const isC = i % 3 !== 0;
  const isRate = i % 4 === 0;
  INITIAL_CRITERIA_10.push({
    id: i,
    code: `Chỉ số ${i}`,
    title: `Chỉ số 10.${i - 10}: Nội dung đánh giá NTM thứ ${i}`,
    subTitle: `Dữ liệu rà soát chỉ số chi tiết bộ tiêu chí quốc gia chuẩn ${i}.`,
    statusText: isRate ? (isC ? "Đạt" : "Chưa đạt") : (isC ? "Đạt" : "Xem xét cải thiện"),
    isCompleted: isC,
    decisionNo: isC ? `${2000 + i}/QĐ-UBND` : "",
    decisionDate: isC ? "2024-04-20" : "",
    note: isC ? "Dữ liệu đo lường đạt chuẩn quy trình đánh giá." : "Cơ sở vật chất đang rà soát bổ sung tư liệu thực địa.",
    proofFiles: [],
    guidelines: `Đảm bảo tuân thủ đầy đủ điều khoản hành chính quốc gia của ban chỉ đạo trung ương về nông thôn mới tiểu nhóm chỉ số ${i}.`,
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

const INITIAL_POLICIES_04: PolicyRow[] = [
  {
    id: "p1",
    type: "Nghị quyết của HĐND",
    codeAndDate: "05/2023/NQ-HĐND - 12/05/2023",
    summary: "Về việc hỗ trợ kinh phí bê tông hóa đường giao thông nông thôn và kênh mương nội đồng",
    mainGoal: "Nâng cao hạ tầng giao thông và thủy lợi phục vụ nông nghiệp",
    mainContent: "Hỗ trợ 100% xi măng, người dân đóng góp ngày công lao động và tự nguyện giải phóng mặt bằng.",
    notes: "Đã hoàn thành giải ngân đợt 1 năm 2023",
    pdfFile: { name: "NQ_05_2023.pdf", size: "1.8 MB" }
  },
  {
    id: "p2",
    type: "Quyết định của UBND",
    codeAndDate: "112/QĐ-UBND - 20/06/2023",
    summary: "Phê duyệt đề án thu gom và xử lý rác thải sinh hoạt nông thôn tập trung",
    mainGoal: "Xử lý triệt để ô nhiễm rác thải nông thôn đạt tiêu chí số 17",
    mainContent: "Thiết lập đội thu gom liên xã, quy chế đóng phí dịch vụ rác thải định kỳ hằng tháng.",
    notes: "Chưa đính kèm văn bản quét màu chính thức",
    pdfFile: null
  },
  {
    id: "p3",
    type: "Kế hoạch",
    codeAndDate: "45/KH-UBND - 05/08/2023",
    summary: "Tổ chức phong trào \"Ngày Chủ nhật xanh\" và xử lý điểm nóng về rác thải",
    mainGoal: "Duy trì cảnh quan xanh, sạch, đẹp bền vững diện rộng tại xã",
    mainContent: "Toàn dân dọn vệ sinh đường làng ngõ xóm vào sáng Chủ nhật hàng tuần, trồng hoa ven hai lộ chính.",
    notes: "Có báo cáo ảnh kèm theo từ đoàn xã",
    pdfFile: { name: "KH_45_2023.pdf", size: "1.2 MB" }
  },
  {
    id: "p4",
    type: "Quyết định của UBND",
    codeAndDate: "78/QĐ-UBND - 14/09/2023",
    summary: "Về việc ban hành quy chế quản lý và sử dụng nhà văn hóa cộng đồng cấp thôn",
    mainGoal: "Chuẩn hóa hoạt động thể thao văn nghệ nâng cao chất lượng sống",
    mainContent: "Ban hành nội quy, bầu ban chủ nhiệm tự quản, khuyến khích hoạt động ngoài giờ hành chính.",
    notes: "Kèm theo danh sách trang thiết bị kiểm kê",
    pdfFile: { name: "QD_78_2023.pdf", size: "950 KB" }
  },
  {
    id: "p5",
    type: "Nghị quyết của HĐND",
    codeAndDate: "08/2023/NQ-HĐND - 11/10/2023",
    summary: "Hành động liên ngành xúc tiến đào tạo nghề nông nghiệp chất lượng cao cho lao động địa phương",
    mainGoal: "Nâng cao tỉ lệ lao động nông nghiệp kỹ thuật cao có chứng chỉ",
    mainContent: "Bắc cầu doanh nghiệp bao tiêu liên kết kỹ năng trồng trọt công nghệ cao thủy canh.",
    notes: "Ngân sách xã hỗ trợ 50% học phí",
    pdfFile: { name: "NQ_08_Văn_bản_pháp_lý.pdf", size: "2.1 MB" }
  },
  {
    id: "p6",
    type: "Kế hoạch",
    codeAndDate: "12/KH-UBND - 02/11/2023",
    summary: "Kế hoạch rà soát nâng cấp trang thiết bị phòng cháy chữa cháy tại chợ truyền thống",
    mainGoal: "Đảm bảo hạ tầng thương mại nông thôn tiêu chí số 8 về an toàn",
    mainContent: "Rà soát toàn bộ trụ nước cứu hỏa, phân phát bình bọt chữa cháy CO2 xách tay.",
    notes: "Đang chờ ký đính kèm văn bản đóng dấu từ công an huyện",
    pdfFile: null
  },
  {
    id: "p7",
    type: "Nghị quyết của HĐND",
    codeAndDate: "15/2023/NQ-HĐND - 28/11/2023",
    summary: "Hỗ trợ lắp đặt thiết bị lọc nước sinh hoạt thông minh hộ gia đình nghèo cận nghèo",
    mainGoal: "Thực hiện tiêu chuẩn hóa nước sinh hoạt tinh khiết cho 100% dân cư",
    mainContent: "Xây dựng gói thầu mua sắm tập trung, chọn đơn vị cung cấp chính hãng bảo trì trọn đời.",
    notes: "Nước sạch vệ sinh môi trường nông thôn mới",
    pdfFile: { name: "NQ_15_LocNuoc_RO.pdf", size: "1.5 MB" }
  },
  {
    id: "p8",
    type: "Quyết định của UBND",
    codeAndDate: "199/QĐ-UBND - 15/12/2023",
    summary: "Quyết định phê duyệt dự án tu sửa khẩn cấp di tích lịch sử Đình làng văn hóa cổ",
    mainGoal: "Khôi phục và tôn vinh nét đẹp sinh hoạt cộng đồng xã Nông thôn mới",
    mainContent: "Sửa sang phục dựng di tích văn phòng ban hội, chống dột sập cột gỗ lim gian chính.",
    notes: "Xã hội hóa vận động đóng góp từ kiều bào đạt 45%",
    pdfFile: { name: "QD_199_TuSuaDiTich.pdf", size: "3.2 MB" }
  }
];

interface FormDetailViewProps {
  form: FormReport;
  userSession: UserSession;
  onBack: () => void;
  onBackToPeriods?: () => void;
  onUpdateForm: (updatedForm: FormReport) => void;
  communes: CommuneSubmission[];
  activeCommuneId: string;
  onSetActiveCommuneId?: (id: string) => void;
  onViewGuideDoc?: (docCode: string) => void;
}

export default function FormDetailView({
  form,
  userSession,
  onBack,
  onBackToPeriods,
  onUpdateForm,
  communes,
  activeCommuneId,
  onSetActiveCommuneId,
  onViewGuideDoc,
}: FormDetailViewProps) {
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [digitalSignInput, setDigitalSignInput] = useState(userSession.fullName);
  const [dragActive, setDragActive] = useState(false);
  const [cellFlashes, setCellFlashes] = useState<Record<string, boolean>>({});

  // Appraisal & Supervision fields
  const [appraisalComment, setAppraisalComment] = useState('');
  const [supervisionComment, setSupervisionComment] = useState('');
  const [complianceLevel, setComplianceLevel] = useState('Xuất sắc');

  // Interactive state for Biểu 04
  const [policies04, setPolicies04] = useState<PolicyRow[]>(() => {
    const saved = localStorage.getItem(`NôngThônMới_Biểu04_Policies`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_POLICIES_04;
      }
    }
    return INITIAL_POLICIES_04;
  });

  const [type04, setType04] = useState('Nghị quyết của HĐND');
  const [codeAndDate04, setCodeAndDate04] = useState('');
  const [summary04, setSummary04] = useState('');
  const [mainGoal04, setMainGoal04] = useState('');
  const [mainContent04, setMainContent04] = useState('');
  const [notes04, setNotes04] = useState('');
  const [attachedFile04, setAttachedFile04] = useState<{ name: string; size: string } | null>(null);
  const [editPolicyId, setEditPolicyId] = useState<string | null>(null);
  const [currentPage04, setCurrentPage04] = useState(1);
  const [searchQuery04, setSearchQuery04] = useState('');

  // Interactive state for Biểu 10
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<number>(1);
  const [criteriaList, setCriteriaList] = useState<Criteria10[]>(() => {
    const saved = localStorage.getItem(`NôngThônMới_Biểu10_TiêuChí`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Criteria10[];
        return INITIAL_CRITERIA_10.map(initItem => {
          const savedItem = parsed.find(p => p.id === initItem.id);
          if (savedItem) {
            return {
              ...initItem,
              isCompleted: savedItem.isCompleted ?? initItem.isCompleted,
              statusText: savedItem.statusText ?? initItem.statusText,
              decisionNo: savedItem.decisionNo ?? initItem.decisionNo ?? "",
              decisionDate: savedItem.decisionDate ?? initItem.decisionDate ?? "",
              note: savedItem.note ?? initItem.note ?? "",
              numerator: savedItem.numerator ?? initItem.numerator ?? 0,
              denominator: savedItem.denominator ?? initItem.denominator ?? 100,
              proofFiles: savedItem.proofFiles || initItem.proofFiles || [],
            };
          }
          return initItem;
        });
      } catch (e) {
        return INITIAL_CRITERIA_10;
      }
    }
    return INITIAL_CRITERIA_10;
  });

  // Active Commune lookup
  const activeCommune = useMemo(() => {
    return communes.find((c) => c.id === activeCommuneId) || communes[0];
  }, [communes, activeCommuneId]);

  // Recalculate completions when commune or communes update
  useEffect(() => {
    setCriteriaList((prev) => {
      const group = activeCommune?.group || 'II';
      const updated = prev.map((c) => {
        if (c.isRateType) {
          let target = c.targetPercent ?? 0;
          if (group === 'I' && c.group1Threshold !== undefined) target = c.group1Threshold;
          else if (group === 'III' && c.group3Threshold !== undefined) target = c.group3Threshold;
          else if (group === 'II' && c.group2Threshold !== undefined) target = c.group2Threshold;

          const pct = (c.denominator && c.denominator > 0) ? ((c.numerator ?? 0) / c.denominator) * 100 : 0;
          const isCompleted = pct >= target;
          return {
            ...c,
            isCompleted,
            statusText: isCompleted ? 'Đạt' : 'Chưa đạt'
          };
        }
        return c;
      });
      return updated;
    });
  }, [activeCommuneId, communes, activeCommune]);

  const handleRateCriteriaChange = (criteriaId: number, field: 'numerator' | 'denominator', value: number) => {
    setCriteriaList((prev) => {
      const group = activeCommune?.group || 'II';
      const updated = prev.map((c) => {
        if (c.id === criteriaId) {
          const num = field === 'numerator' ? value : (c.numerator ?? 0);
          const den = field === 'denominator' ? value : (c.denominator ?? 100);
          const calculatedPct = den > 0 ? (num / den) * 100 : 0;

          let target = c.targetPercent ?? 0;
          if (group === 'I' && c.group1Threshold !== undefined) target = c.group1Threshold;
          else if (group === 'III' && c.group3Threshold !== undefined) target = c.group3Threshold;
          else if (group === 'II' && c.group2Threshold !== undefined) target = c.group2Threshold;

          const isCompleted = calculatedPct >= target;
          const statusText = isCompleted ? 'Đạt' : 'Chưa đạt';
          return {
            ...c,
            numerator: num,
            denominator: den,
            isCompleted,
            statusText,
          };
        }
        return c;
      });
      localStorage.setItem(`NôngThônMới_Biểu10_TiêuChí`, JSON.stringify(updated));
      return updated;
    });
  };

  // Interactive state for Biểu 07 and Biểu 11
  const [resourceRows07, setResourceRows07] = useState<{
    i1_plan: number; i1_first: number; i1_second: number;
    i2_plan: number; i2_first: number; i2_second: number;
    ii1_plan: number; ii1_first: number; ii1_second: number;
    ii2_plan: number; ii2_first: number; ii2_second: number;
    iii_plan: number; iii_first: number; iii_second: number;
    iv_plan: number; iv_first: number; iv_second: number;
    v_plan: number; v_first: number; v_second: number;
    vi1_plan: number; vi1_first: number; vi1_second: number;
    vi2_plan: number; vi2_first: number; vi2_second: number;
  }>(() => {
    const isBieu11 = form.code === 'Biểu 11';
    const key = isBieu11 ? 'NôngThônMới_Biểu11_Data' : 'NôngThônMới_Biểu07_Data';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
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
  });

  // Biểu 04 event handlers and interactive functions
  const handleAddOrUpdatePolicy04 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type04 || !codeAndDate04 || !summary04 || !mainContent04) {
      setNotifyMessage('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      setTimeout(() => setNotifyMessage(null), 3000);
      return;
    }

    if (editPolicyId) {
      // Update existing
      const updated = policies04.map(p => {
        if (p.id === editPolicyId) {
          return {
            ...p,
            type: type04,
            codeAndDate: codeAndDate04,
            summary: summary04,
            mainGoal: mainGoal04,
            mainContent: mainContent04,
            notes: notes04,
            pdfFile: attachedFile04 || p.pdfFile
          };
        }
        return p;
      });
      setPolicies04(updated);
      localStorage.setItem(`NôngThônMới_Biểu04_Policies`, JSON.stringify(updated));
      setNotifyMessage('Cập nhật cơ chế chính sách thành công!');
      setEditPolicyId(null);
    } else {
      // Add new
      const newPolicy: PolicyRow = {
        id: `p-${Date.now()}`,
        type: type04,
        codeAndDate: codeAndDate04,
        summary: summary04,
        mainGoal: mainGoal04,
        mainContent: mainContent04,
        notes: notes04,
        pdfFile: attachedFile04
      };
      const updated = [newPolicy, ...policies04];
      setPolicies04(updated);
      localStorage.setItem(`NôngThônMới_Biểu04_Policies`, JSON.stringify(updated));
      setNotifyMessage('Đã thêm mới cơ chế chính sách vào danh sách!');
    }

    // Reset inputs
    setCodeAndDate04('');
    setSummary04('');
    setMainGoal04('');
    setMainContent04('');
    setNotes04('');
    setAttachedFile04(null);
    setTimeout(() => setNotifyMessage(null), 3000);
  };

  const handleEditSelect04 = (p: PolicyRow) => {
    setEditPolicyId(p.id);
    setType04(p.type);
    setCodeAndDate04(p.codeAndDate);
    setSummary04(p.summary);
    setMainGoal04(p.mainGoal);
    setMainContent04(p.mainContent);
    setNotes04(p.notes);
    setAttachedFile04(p.pdfFile);

    // Scroll smoothly to form
    const el = document.getElementById('thong-tin-co-che');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeletePolicy04 = (id: string) => {
    const updated = policies04.filter(p => p.id !== id);
    setPolicies04(updated);
    localStorage.setItem(`NôngThônMới_Biểu04_Policies`, JSON.stringify(updated));
    setNotifyMessage('Đã xóa cơ chế chính sách thành công!');
    setTimeout(() => setNotifyMessage(null), 3000);

    // safe guard current page
    const totalPages = Math.ceil(updated.length / 3) || 1;
    if (currentPage04 > totalPages) {
      setCurrentPage04(totalPages);
    }
  };

  const handlePdfAttachMock04 = () => {
    let name = 'Van_Ban_Dinh_Kem_B04.pdf';
    if (codeAndDate04) {
      const clean = codeAndDate04.split('-')[0].trim().replace(/[\/]/g, '_');
      name = `${clean}.pdf`;
    }
    setAttachedFile04({ name, size: '2.4 MB' });
    setNotifyMessage('Đã tải lên tệp đính kèm văn bản quét màu dấu đỏ!');
    setTimeout(() => setNotifyMessage(null), 3500);
  };

  const computedStats04 = useMemo(() => {
    const total = policies04.length;
    const attached = policies04.filter(p => p.pdfFile !== null).length;
    const notAttached = total - attached;
    return { total, attached, notAttached };
  }, [policies04]);

  const filteredPolicies04 = useMemo(() => {
    if (!searchQuery04) return policies04;
    return policies04.filter(p =>
      p.type.toLowerCase().includes(searchQuery04.toLowerCase()) ||
      p.codeAndDate.toLowerCase().includes(searchQuery04.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery04.toLowerCase()) ||
      p.mainContent.toLowerCase().includes(searchQuery04.toLowerCase())
    );
  }, [policies04, searchQuery04]);

  const paginatedPolicies04 = useMemo(() => {
    const startIndex = (currentPage04 - 1) * 3;
    return filteredPolicies04.slice(startIndex, startIndex + 3);
  }, [filteredPolicies04, currentPage04]);

  const maxPages04 = useMemo(() => {
    return Math.ceil(filteredPolicies04.length / 3) || 1;
  }, [filteredPolicies04]);

  const computedTable07 = useMemo(() => {
    const d = resourceRows07;
    // Section I: Ngân sách trung ương
    const i_plan = d.i1_plan + d.i2_plan;
    const i_first = d.i1_first + d.i2_first;
    const i_second = d.i1_second + d.i2_second;
    const i_total = i_first + i_second;
    const i_percent = i_plan > 0 ? (i_first / i_plan) * 100 : 0;

    // Section II: Ngân sách địa phương
    const ii_plan = d.ii1_plan + d.ii2_plan;
    const ii_first = d.ii1_first + d.ii2_first;
    const ii_second = d.ii1_second + d.ii2_second;
    const ii_total = ii_first + ii_second;
    const ii_percent = ii_plan > 0 ? (ii_first / ii_plan) * 100 : 0;

    // Section III: Vốn lồng ghép
    const iii_total = d.iii_first + d.iii_second;
    const iii_percent = d.iii_plan > 0 ? (d.iii_first / d.iii_plan) * 100 : 0;

    // Section IV: Vốn tín dụng chính sách
    const iv_total = d.iv_first + d.iv_second;
    const iv_percent = d.iv_plan > 0 ? (d.iv_first / d.iv_plan) * 100 : 0;

    // Section V: Vốn doanh nghiệp
    const v_total = d.v_first + d.v_second;
    const v_percent = d.v_plan > 0 ? (d.v_first / d.v_plan) * 100 : 0;

    // Section VI: Huy động từ cộng đồng và người dân
    const vi_plan = d.vi1_plan + d.vi2_plan;
    const vi_first = d.vi1_first + d.vi2_first;
    const vi_second = d.vi1_second + d.vi2_second;
    const vi_total = vi_first + vi_second;
    const vi_percent = vi_plan > 0 ? (vi_first / vi_plan) * 100 : 0;

    // TỔNG SỐ
    const tong_plan = i_plan + ii_plan + d.iii_plan + d.iv_plan + d.v_plan + vi_plan;
    const tong_first = i_first + ii_first + d.iii_first + d.iv_first + d.v_first + vi_first;
    const tong_second = i_second + ii_second + d.iii_second + d.iv_second + d.v_second + vi_second;
    const tong_total = tong_first + tong_second;
    const tong_percent = tong_plan > 0 ? (tong_first / tong_plan) * 100 : 0;

    return {
      tong: { plan: tong_plan, first: tong_first, second: tong_second, total: tong_total, percent: tong_percent },
      i: { plan: i_plan, first: i_first, second: i_second, total: i_total, percent: i_percent },
      ii: { plan: ii_plan, first: ii_first, second: ii_second, total: ii_total, percent: ii_percent },
      iii: { plan: d.iii_plan, first: d.iii_first, second: d.iii_second, total: iii_total, percent: iii_percent },
      iv: { plan: d.iv_plan, first: d.iv_first, second: d.iv_second, total: iv_total, percent: iv_percent },
      v: { plan: d.v_plan, first: d.v_first, second: d.v_second, total: v_total, percent: v_percent },
      vi: { plan: vi_plan, first: vi_first, second: vi_second, total: vi_total, percent: vi_percent },
    };
  }, [resourceRows07]);

  const handleResourceChange = (field: keyof typeof resourceRows07, val: string) => {
    const num = val === '' ? 0 : Math.max(0, parseInt(val) || 0);
    const updated = {
      ...resourceRows07,
      [field]: num
    };
    setResourceRows07(updated);
    const isBieu11 = form.code === 'Biểu 11';
    const key = isBieu11 ? 'NôngThônMới_Biểu11_Data' : 'NôngThônMới_Biểu07_Data';
    localStorage.setItem(key, JSON.stringify(updated));

    // Flash animation trigger helper for feedback
    const keyFlash = `${isBieu11 ? '11' : '07'}-${String(field)}`;
    setCellFlashes((prev) => ({ ...prev, [keyFlash]: true }));
    setTimeout(() => {
      setCellFlashes((prev) => ({ ...prev, [keyFlash]: false }));
    }, 450);
  };

  // Dynamic Sum Calculation
  const columnSums = useMemo(() => {
    return (form.data || []).reduce(
      (sums, row) => {
        if (!row) return sums;
        sums.g1Pre += Number(row.group1?.prevYear) || 0;
        sums.g1Cur += Number(row.group1?.currentS1) || 0;
        sums.g1Plan += Number(row.group1?.planS2) || 0;

        sums.g2Pre += Number(row.group2?.prevYear) || 0;
        sums.g2Cur += Number(row.group2?.currentS1) || 0;
        sums.g2Plan += Number(row.group2?.planS2) || 0;

        sums.g3Pre += Number(row.group3?.prevYear) || 0;
        sums.g3Cur += Number(row.group3?.currentS1) || 0;
        sums.g3Plan += Number(row.group3?.planS2) || 0;
        return sums;
      },
      { g1Pre: 0, g1Cur: 0, g1Plan: 0, g2Pre: 0, g2Cur: 0, g2Plan: 0, g3Pre: 0, g3Cur: 0, g3Plan: 0 }
    );
  }, [form.data]);

  const updateCalculatedParentRows06 = (data: CriterionRow[]): CriterionRow[] => {
    return data.map(row => {
      if (row.tt === 'I' || row.tt === 'II' || row.tt === 'III') {
        return row;
      }

      const getVal = (id: number, field: 'prevYear' | 'currentS1' | 'planS2'): number => {
        const r = data.find(x => x.id === id);
        if (!r) return 0;

        if (r.tt === '1') {
          return getVal(3, field) + getVal(4, field) + getVal(5, field);
        }
        if (r.tt === '2.1') {
          return getVal(8, field) + getVal(9, field) + getVal(10, field);
        }
        if (r.tt === '2.2') {
          return getVal(12, field) + getVal(13, field) + getVal(14, field);
        }
        if (r.tt === '2') {
          return getVal(7, field) + getVal(11, field) + getVal(15, field);
        }
        if (r.tt === '3') {
          return getVal(17, field) + getVal(18, field) + getVal(19, field);
        }
        if (r.tt === '4') {
          return getVal(21, field) + getVal(22, field) + getVal(23, field);
        }
        return r.group1?.[field] ?? 0;
      };

      if (row.tt === '1' || row.tt === '2' || row.tt === '2.1' || row.tt === '2.2' || row.tt === '3' || row.tt === '4') {
        return {
          ...row,
          group1: {
            prevYear: getVal(row.id, 'prevYear'),
            currentS1: getVal(row.id, 'currentS1'),
            planS2: getVal(row.id, 'planS2')
          }
        };
      }

      return row;
    });
  };

  const handleInputChange = (
    rowId: number,
    group: 'group1' | 'group2' | 'group3',
    field: 'prevYear' | 'currentS1' | 'planS2',
    val: string
  ) => {
    const numVal = val === '' ? 0 : Math.max(0, parseInt(val) || 0);

    let updatedData = form.data.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          [group]: {
            ...row[group],
            [field]: numVal,
          },
        };
      }
      return row;
    });

    if (form.code === 'Biểu 06') {
      updatedData = updateCalculatedParentRows06(updatedData);
    }

    onUpdateForm({
      ...form,
      data: updatedData,
      updatedAt: new Date().toISOString(),
    });

    // Trigger cell flash
    const key = `${rowId}-${group}-${field}`;
    setCellFlashes((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCellFlashes((prev) => ({ ...prev, [key]: false }));
    }, 450);
  };

  const handleNoteChange = (rowId: number, noteVal: string) => {
    const updatedData = form.data.map((row) => {
      if (row.id === rowId) {
        return { ...row, note: noteVal };
      }
      return row;
    });

    onUpdateForm({
      ...form,
      data: updatedData,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveDraft = () => {
    onUpdateForm({
      ...form,
      updatedAt: new Date().toISOString(),
    });
    setNotifyMessage('Đã lưu thành công bản nháp cục bộ dữ liệu rà soát.');
    setTimeout(() => setNotifyMessage(null), 3000);
  };

  const handleOpenSubmit = () => {
    const isProvinceForm = ['Biểu 04', 'Biểu 05', 'Biểu 06', 'Biểu 07', 'Biểu 08', 'Biểu 09'].includes(form.code);
    const nextStatus = (userSession.role === 'APPRAISER' && isProvinceForm) ? 'APPROVED' : 'SUBMITTED';
    const message = (userSession.role === 'APPRAISER' && isProvinceForm)
      ? `Đã gửi báo cáo ${form.code} trực tiếp lên Bộ Trung ương thành công!`
      : `Đã xác nhận hoàn thành số liệu biểu mẫu ${form.code}!`;

    onUpdateForm({
      ...form,
      status: nextStatus,
      editor: userSession.fullName,
      updatedAt: new Date().toISOString(),
    });

    setNotifyMessage(message);
    setTimeout(() => {
      setNotifyMessage(null);
      onBack();
    }, 2000);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!digitalSignInput.trim()) {
      alert('Vui lòng điền họ và tên người ký xác nhận.');
      return;
    }

    onUpdateForm({
      ...form,
      status: 'SUBMITTED',
      editor: digitalSignInput,
      updatedAt: new Date().toISOString(),
    });

    setShowConfirmPopup(false);
    setNotifyMessage(`Biểu mẫu đã được Ký số bởi ${digitalSignInput} và gửi đi phê duyệt thẩm định.`);
    setTimeout(() => setNotifyMessage(null), 4000);
  };

  // Drag Drop files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: ProofFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const isXls = f.name.endsWith('.xlsx') || f.name.endsWith('.xls');
      newFiles.push({
        name: f.name,
        size: f.size,
        uploadedAt: new Date().toISOString().split('T')[0],
        type: isXls ? 'xlsx' : 'pdf',
      });
    }

    onUpdateForm({
      ...form,
      proofFiles: [...(form.proofFiles || []), ...newFiles],
    });

    setNotifyMessage(`Tải lên thành công ${files.length} minh chứng đính kèm.`);
    setTimeout(() => setNotifyMessage(null), 3000);
  };

  const handleDeleteFile = (fileName: string) => {
    onUpdateForm({
      ...form,
      proofFiles: (form.proofFiles || []).filter((f) => f.name !== fileName),
    });
  };

  // APPRAISAL SUBMIT (Thẩm định)
  const handleAppraise = (decision: 'APPROVED' | 'REJECTED') => {
    onUpdateForm({
      ...form,
      status: decision === 'APPROVED' ? 'APPROVED' : 'DRAFT', // Reject reverts to DRAFT
      appraisal: {
        appraiserName: userSession.fullName,
        comment: appraisalComment || 'Đã thẩm duyệt chéo dữ liệu cơ sở thiết yếu.',
        updatedAt: new Date().toISOString(),
        decision,
      },
      updatedAt: new Date().toISOString(),
    });

    setNotifyMessage(
      decision === 'APPROVED'
        ? 'Duyệt Thẩm định thành công!'
        : 'Đã từ chối và gửi trả yêu cầu chỉnh sửa thông tin.'
    );
    setTimeout(() => setNotifyMessage(null), 4000);
  };

  // SUPERVISION SUBMIT (Giám sát)
  const handleSupervise = () => {
    onUpdateForm({
      ...form,
      status: 'SUPERVISED',
      supervision: {
        supervisorName: userSession.fullName,
        comment: supervisionComment || 'Đã đối soát nghiệp vụ hoàn tất chu trình giám sát.',
        updatedAt: new Date().toISOString(),
        complianceLevel,
      },
      updatedAt: new Date().toISOString(),
    });

    setNotifyMessage('Xác nhận và đóng dấu Giám sát thành công!');
    setTimeout(() => setNotifyMessage(null), 4000);
  };

  // Active Selected item resolution for Biểu 10
  const activeCriteria = useMemo(() => {
    return criteriaList.find((c) => c.id === selectedCriteriaId) || criteriaList[0] || INITIAL_CRITERIA_10[0];
  }, [criteriaList, selectedCriteriaId]);

  const countApproved = useMemo(() => {
    return criteriaList.filter((c) => c.isCompleted).length;
  }, [criteriaList]);

  const countPending = useMemo(() => {
    return criteriaList.filter(
      (c) => c.statusText === 'Đang xử lý dữ liệu' || c.statusText === 'Đang hoàn thiện'
    ).length;
  }, [criteriaList]);

  const countNotMet = useMemo(() => {
    return criteriaList.filter(
      (c) => !c.isCompleted && c.statusText !== 'Đang hoàn thiện' && c.statusText !== 'Đang xử lý dữ liệu'
    ).length;
  }, [criteriaList]);

  const percentProgress = useMemo(() => {
    return Math.round((countApproved / 47) * 100);
  }, [countApproved]);

  const [criteriaSearch, setCriteriaSearch] = useState('');
  const [showCriteriaFilter, setShowCriteriaFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'NOT_MET'>('ALL');

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

  if (form.code === 'Biểu 04') {
    return (
      <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-12">
        {/* Toast alert */}
        {notifyMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
            <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 flex-wrap uppercase tracking-wider">
          <button onClick={onBackToPeriods || onBack} className="hover:text-[#014285] cursor-pointer transition-colors border-none bg-transparent">
            Đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBack} className="hover:text-[#014285] cursor-pointer transition-colors border-none bg-transparent">
            Chi tiết đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#014285] font-black">Báo cáo Mẫu 04</span>
        </div>

        {/* Top Header Row with actions */}
        <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-base font-black text-[#014285] tracking-tight uppercase leading-snug">
              CÁC CƠ CHẾ, CHÍNH SÁCH DO ĐỊA PHƯƠNG BAN HÀNH ĐỂ THỰC HIỆN CHƯƠNG TRÌNH GIAI ĐOẠN 2026-2030
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-bold">
              Nhập danh sách các cơ chế, chính sách do địa phương ban hành phục vụ chương trình NTM.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => {
                setNotifyMessage('Đã tải tệp mẫu Excel thành công!');
                setTimeout(() => setNotifyMessage(null), 3000);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-2xl hover:bg-slate-50 text-slate-750 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap bg-white"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Tải mẫu Excel
            </button>
            <button
              onClick={() => {
                setNotifyMessage('Lưu trữ bản nháp biểu 04 thành công!');
                setTimeout(() => setNotifyMessage(null), 3000);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-900/10 cursor-pointer whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              Lưu bản nháp
            </button>
          </div>
        </div>

        {/* Two column grid layout for input and instructions */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* Main registration form */}
          <div id="thong-tin-co-che" className="xl:col-span-8 space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-6">
                <FileText className="w-5 h-5 text-[#014285]" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                  Thông tin cơ chế chính sách
                </h2>
                {editPolicyId && (
                  <span className="ml-auto px-2V py-0.5 bg-amber-100 text-amber-800 text-xs font-black uppercase rounded-lg">
                    Chế độ chỉnh sửa
                  </span>
                )}
              </div>

              <form onSubmit={handleAddOrUpdatePolicy04} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-750 mb-1.5">
                      Loại văn bản <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={type04}
                      onChange={(e) => setType04(e.target.value)}
                      className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-[#014285] bg-slate-50/20"
                    >
                      <option value="Nghị quyết của HĐND">Nghị quyết của HĐND</option>
                      <option value="Quyết định của UBND">Quyết định của UBND</option>
                      <option value="Kế hoạch">Kế hoạch</option>
                      <option value="Chỉ thị">Chỉ thị</option>
                      <option value="Thông tư">Thông tư</option>
                      <option value="Nghị định">Nghị định</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-750 mb-1.5">
                      Số/Ngày ban hành <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 12/2023/NQ-HĐND - 15/10/2023"
                      value={codeAndDate04}
                      onChange={(e) => setCodeAndDate04(e.target.value)}
                      className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-[#014285]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-750 mb-1.5">
                    Trích yếu văn bản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tóm tắt tiêu đề văn bản..."
                    value={summary04}
                    onChange={(e) => setSummary04(e.target.value)}
                    className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-[#014285]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-750 mb-1.5">
                      Mục tiêu chính
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Xác định các mục tiêu trọng tâm..."
                      value={mainGoal04}
                      onChange={(e) => setMainGoal04(e.target.value)}
                      className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-[#014285]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-750 mb-1.5">
                      Nội dung chủ yếu <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Các nội dung thực hiện chính..."
                      value={mainContent04}
                      onChange={(e) => setMainContent04(e.target.value)}
                      className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-[#014285]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-750 mb-1.5">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    placeholder="Thông tin bổ sung nếu có..."
                    value={notes04}
                    onChange={(e) => setNotes04(e.target.value)}
                    className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-[#014285]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-750 mb-1.5">
                    Đính kèm văn bản PDF <span className="text-red-500">*</span>
                  </label>

                  {attachedFile04 ? (
                    <div className="border border-dashed border-emerald-300 bg-emerald-50/30 rounded-2xl p-4 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                          <FileText className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">{attachedFile04.name}</p>
                          <p className="text-xs text-slate-500 font-bold">{attachedFile04.size} • Đã đính kèm thành công</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachedFile04(null);
                          setNotifyMessage('Đã gỡ bỏ tệp đính kèm.');
                          setTimeout(() => setNotifyMessage(null), 2500);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={handlePdfAttachMock04}
                      className="border-2 border-dashed border-slate-300 hover:border-[#014285] bg-slate-50/50 hover:bg-blue-50/5 rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#014285] transition-colors" />
                      <p className="text-xs text-slate-605 font-bold">
                        Kéo thả file PDF vào đây hoặc <span className="text-[#014285] font-black underline">chọn file</span>
                      </p>
                      <p className="text-xs text-slate-450 mt-1 font-bold">
                        Dung lượng tối đa 10MB. Chỉ chấp nhận định dạng .pdf
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {editPolicyId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditPolicyId(null);
                        setCodeAndDate04('');
                        setSummary04('');
                        setMainGoal04('');
                        setMainContent04('');
                        setNotes04('');
                        setAttachedFile04(null);
                        setNotifyMessage('Đã hủy chế độ chỉnh sửa.');
                        setTimeout(() => setNotifyMessage(null), 2000);
                      }}
                      className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer bg-white"
                    >
                      Hủy bỏ
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {editPolicyId ? 'Cập nhật văn bản' : 'Thêm vào danh sách'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:col-span-4 space-y-6">

            {/* Box 1: Guide */}
            <div className="bg-[#f0f7ff] border border-[#e1f0ff] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4.5 h-4.5 text-[#014285] shrink-0" />
                <h3 className="text-xs font-black text-[#014285] uppercase tracking-wider">
                  Hướng dẫn kê khai
                </h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-700 font-semibold leading-relaxed pl-1 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-[#014285] font-extrabold text-xs mt-0.5">•</span>
                  <span>Chỉ kê khai các văn bản do cấp xã ban hành còn hiệu lực.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#014285] font-extrabold text-xs mt-0.5">•</span>
                  <span>Mỗi văn bản đính kèm bắt buộc phải có bản quét PDF có dấu mộc đỏ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#014285] font-extrabold text-xs mt-0.5">•</span>
                  <span>Phần "Nội dung chủ yếu" cần tóm lược các điểm mới, hỗ trợ trực tiếp cho 19 tiêu chí NTM.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: Stats */}
            <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3">
                Thống kê danh sách
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <p className="text-xs uppercase font-black tracking-widest text-slate-500">TỔNG SỐ</p>
                  <p className="text-2xl font-black text-[#014285] mt-1">
                    {computedStats04.total < 10 ? `0${computedStats04.total}` : computedStats04.total}
                  </p>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
                  <p className="text-xs uppercase font-black tracking-widest text-[#01a862]">ĐÃ ĐÍNH KÈM</p>
                  <p className="text-2xl font-black text-[#01a862] mt-1">
                    {computedStats04.attached < 10 ? `0${computedStats04.attached}` : computedStats04.attached}
                  </p>
                </div>
              </div>

              {computedStats04.notAttached > 0 && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-650 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">
                    Có <strong className="font-black text-red-900">{computedStats04.notAttached} văn bản</strong> chưa đính kèm file PDF. Vui lòng bổ sung trước khi gửi báo cáo.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Section: Table List */}
        <div className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Danh sách cơ chế chính sách đã kê khai
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">
                Bảng thông tin lưu trữ công quy hoạch và phân rã cơ cấu hỗ trợ phát triển vùng.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm văn bản..."
                  value={searchQuery04}
                  onChange={(e) => {
                    setSearchQuery04(e.target.value);
                    setCurrentPage04(1);
                  }}
                  className="w-full sm:w-60 text-xs pl-10 pr-4 py-2 border border-slate-300 rounded-2xl outline-none focus:border-[#014285] font-bold text-slate-800"
                />
              </div>
              <button
                onClick={() => {
                  window.print();
                }}
                title="In danh sách này"
                className="p-2 border border-slate-300 rounded-2xl hover:bg-slate-50 transition-all text-slate-650 cursor-pointer bg-white"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto text-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-black tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6 text-center w-16">STT</th>
                  <th className="py-4 px-6 w-52">Loại văn bản</th>
                  <th className="py-4 px-6 w-60">Số/Ngày ban hành</th>
                  <th className="py-4 px-6">Trích yếu</th>
                  <th className="py-4 px-6 w-52">Đính kèm</th>
                  <th className="py-4 px-6 text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {paginatedPolicies04.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold bg-slate-50/10">
                      Không tìm thấy bản ghi nào khớp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  paginatedPolicies04.map((p, idx) => {
                    const stt = (currentPage04 - 1) * 3 + idx + 1;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-center text-slate-400 font-bold">{stt}</td>
                        <td className="py-4 px-6">
                          <span className="text-[#014285] font-extrabold">
                            {p.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-800 font-bold">
                          <div>
                            <p className="leading-tight text-slate-900 font-extrabold">{p.codeAndDate.split('-')[0]?.trim()}</p>
                            <p className="text-xs text-slate-450 mt-1 uppercase tracking-wider font-extrabold">
                              {p.codeAndDate.split('-')[1]?.trim() || 'Hết hiệu lực'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-md">
                            <p className="text-slate-800 leading-relaxed font-bold">{p.summary}</p>
                            {p.mainGoal && (
                              <p className="text-xs text-slate-500 font-bold mt-1 leading-snug">
                                <span className="font-extrabold text-[#014285]">Mục tiêu: </span>
                                {p.mainGoal}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {p.pdfFile ? (
                            <div className="flex items-center gap-2 group max-w-xs overflow-hidden">
                              <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                              <button
                                onClick={() => {
                                  setNotifyMessage(`Đang tải tệp về: ${p.pdfFile?.name}`);
                                  setTimeout(() => setNotifyMessage(null), 2500);
                                }}
                                className="text-emerald-600 hover:text-emerald-850 text-xs font-black truncate text-left border-none bg-transparent cursor-pointer hover:underline p-0"
                              >
                                {p.pdfFile.name}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-500 font-black">
                              <AlertCircle className="w-4 h-4" />
                              <span>Chưa đính kèm</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditSelect04(p)}
                              title="Sửa thông tin"
                              className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-[#014285] rounded-xl transition-all border-none bg-transparent cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePolicy04(p.id)}
                              title="Xóa văn bản"
                              className="p-1.5 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination row */}
          {maxPages04 > 1 && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-slate-500 font-bold">
                Hiển thị {Math.min(filteredPolicies04.length, (currentPage04 - 1) * 3 + 1)}-{Math.min(filteredPolicies04.length, currentPage04 * 3)} trong tổng số {filteredPolicies04.length} cơ chế
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage04 === 1}
                  onClick={() => setCurrentPage04(prev => Math.max(1, prev - 1))}
                  className="p-1.5 border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-45 disabled:hover:bg-transparent text-slate-600 transition-all cursor-pointer bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: maxPages04 }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage04(page)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${currentPage04 === page
                      ? 'bg-[#014285] text-white shadow-md shadow-blue-900/10'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-100 bg-white'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage04 === maxPages04}
                  onClick={() => setCurrentPage04(prev => Math.min(maxPages04, prev + 1))}
                  className="p-1.5 border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-45 disabled:hover:bg-transparent text-slate-600 transition-all cursor-pointer bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (form.code === 'Biểu 06') {
    const isDr = form.status === 'DRAFT' || form.status === 'REJECTED';

    return (
      <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-12" id="bieu-06-view">
        {/* Toast alert */}
        {notifyMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350" id="toast-notify">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
            <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 flex-wrap uppercase tracking-wider" id="bieu-06-breadcrumb">
          <button onClick={onBackToPeriods || onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent">
            Đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent">
            Chi tiết đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#014285] font-black">Báo cáo Mẫu 06</span>
        </div>

        {/* Warning card for Rejected state */}
        {form.status === 'REJECTED' && form.appraisal && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-pulse-subtle" id="rejected-warning-card">
            <AlertCircle className="w-5.5 h-5.5 shrink-0 text-red-650 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold uppercase tracking-wider text-red-900 block">Yêu cầu sửa đổi bổ sung</span>
              <p className="font-bold leading-relaxed">{form.appraisal.comment}</p>
              <div className="pt-1.5 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs uppercase font-black tracking-widest">
                  Thẩm định: {form.appraisal.appraiserName}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(form.appraisal.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Header Block matching screenshot */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="header-block">
          <div className="space-y-2">
            <span className="text-xs uppercase font-black bg-blue-50 text-[#2563eb] px-2.5 py-1 rounded-md border border-blue-100 tracking-wider">
              PHỤ BIỂU SỐ 06
            </span>
            <h1 className="text-sm md:text-base font-black text-[#0f2942] tracking-tight uppercase leading-snug">
              KẾT QUẢ THỰC HIỆN CHƯƠNG TRÌNH 6 THÁNG ... / NĂM ...
            </h1>
            <p className="text-xs text-slate-500 font-bold leading-normal">
              (Kèm theo Mẫu số 03 của Chương trình Mục tiêu quốc gia xây dựng Nông thôn mới giai đoạn 2021 - 2025)
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto bg-amber-50/50 border border-amber-100 p-4 rounded-2xl shrink-0 gap-3">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-black text-amber-700">Đang cập nhật</span>
            </div>
            <div className="text-xs text-slate-500 font-bold text-left md:text-right">
              Hạn chót: <span className="font-extrabold text-slate-700">30/06/2024</span>
            </div>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between gap-4" id="info-banner">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563eb]/10 text-[#2563eb] rounded-xl shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">
                Lưu ý: Bạn đang thực hiện cập nhật báo cáo với vai trò đại diện đơn vị ban chỉ đạo cấp Tỉnh.
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Các cột số liệu của 3 nhóm xã được thu thập trực tiếp và tự động kết nối từ hệ thống báo cáo cơ sở của địa phương.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setNotifyMessage('Đã tải tệp bảng tính mẫu Biểu 06!');
              setTimeout(() => setNotifyMessage(null), 2500);
            }}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 cursor-pointer transition-all shrink-0"
            id="download-excel-btn"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Tải Excel
          </button>
        </div>

        {/* Dynamic Spreadsheet Table wrapper */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="spreadsheet-wrapper">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Bảng số liệu tổng hợp kết quả bộ tiêu chí
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-bold italic">
              Đơn vị tính: Mã lượng đơn vị chuẩn (Xã)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border-b border-slate-100 min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/60 text-slate-700 uppercase text-xs font-black border-b border-slate-200 text-center">
                  <th className="py-3 px-3 border-r border-slate-200 w-16">TT</th>
                  <th className="py-3 px-4 border-r border-slate-200 text-left min-w-[320px]">Nội dung</th>
                  <th className="py-3 px-3 border-r border-slate-200 w-52 text-center bg-slate-50/40">Kết quả đến 31/12 của năm trước</th>
                  <th className="py-3 px-3 border-r border-slate-200 w-52 text-center bg-slate-50/40">Thực hiện 6 tháng năm...</th>
                  <th className="py-3 px-3 border-r border-slate-200 w-52 text-center bg-slate-50/40">Kế hoạch 6 tháng cuối năm...</th>
                  <th className="py-3 px-4 text-left min-w-[180px]">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {(form.data || []).map((row, idx) => {
                  const isHeaderRow = row.tt === 'I' || row.tt === 'II' || row.tt === 'III';
                  const isParentRow = row.tt === '1' || row.tt === '2' || row.tt === '2.1' || row.tt === '2.2' || row.tt === '3' || row.tt === '4';

                  if (isHeaderRow) {
                    return (
                      <tr key={row.id} className="bg-slate-50/80 font-black text-slate-900 border-y border-slate-200 h-11">
                        <td className="py-3 px-3 text-center border-r border-slate-200 text-slate-900 font-extrabold">
                          {row.tt}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-200 text-slate-900 font-extrabold text-left uppercase">
                          {row.category}
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 bg-slate-50/30"></td>
                        <td className="py-3 px-3 border-r border-slate-200 bg-slate-50/30"></td>
                        <td className="py-3 px-3 border-r border-slate-200 bg-slate-50/30"></td>
                        <td className="py-3 px-4 bg-slate-50/30"></td>
                      </tr>
                    );
                  }

                  if (isParentRow) {
                    return (
                      <tr key={row.id} className="bg-slate-50/35 hover:bg-slate-50/70 transition-colors font-bold text-slate-800 border-b border-slate-150 h-12">
                        <td className="py-3 px-3 text-center border-r border-slate-150 text-slate-800 font-bold">
                          {row.tt}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-150 text-slate-850 font-extrabold text-left">
                          {row.category}
                        </td>
                        <td className="p-1 border-r border-slate-150 bg-slate-100/30 text-center font-extrabold text-slate-800 w-52">
                          <input
                            type="number"
                            value={row.group1?.prevYear ?? 0}
                            disabled={true}
                            className="w-full text-center py-2 border border-transparent font-black bg-transparent text-slate-800 focus:outline-none cursor-not-allowed"
                          />
                        </td>
                        <td className="p-1 border-r border-slate-150 bg-slate-100/30 text-center font-extrabold text-slate-800 w-52">
                          <input
                            type="number"
                            value={row.group1?.currentS1 ?? 0}
                            disabled={true}
                            className="w-full text-center py-2 border border-transparent font-black bg-transparent text-slate-800 focus:outline-none cursor-not-allowed"
                          />
                        </td>
                        <td className="p-1 border-r border-slate-150 bg-slate-100/30 text-center font-extrabold text-slate-800 w-52">
                          <input
                            type="number"
                            value={row.group1?.planS2 ?? 0}
                            disabled={true}
                            className="w-full text-center py-2 border border-transparent font-black bg-transparent text-slate-800 focus:outline-none cursor-not-allowed"
                          />
                        </td>
                        <td className="px-3 py-1 bg-slate-50/20">
                          <input
                            type="text"
                            value={row.note || ''}
                            disabled={!isDr}
                            placeholder="Ghi chú..."
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = form.data.map(r => r.id === row.id ? { ...r, note: val } : r);
                              onUpdateForm({ ...form, data: updated, updatedAt: new Date().toISOString() });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200/60 rounded-lg font-bold text-slate-800 hover:bg-white bg-slate-50/40 text-left outline-none focus:border-[#2563eb] focus:bg-white transition-all placeholder:text-slate-350"
                          />
                        </td>
                      </tr>
                    );
                  }

                  const isItalic = row.tt === '-' || row.tt === '1.1' || row.tt === '1.2' || row.tt === '1.3';
                  const isIndented = row.tt === '-';
                  const categoryClass = `py-3 px-4 border-r border-slate-150 text-left ${isItalic ? 'italic font-semibold text-slate-650' : 'font-extrabold text-slate-800'
                    } ${isIndented ? 'pl-8' : ''}`;
                  const ttClass = `py-3 px-3 text-center border-r border-slate-150 font-mono text-slate-500 ${isIndented ? 'italic font-bold' : 'font-bold'}`;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 h-12">
                      <td className={ttClass}>
                        {row.tt}
                      </td>
                      <td className={categoryClass}>
                        {row.category}
                      </td>
                      <td className="p-1 border-r border-slate-150 bg-slate-50/10 w-52">
                        <input
                          type="number"
                          value={row.group1?.prevYear ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'group1', 'prevYear', e.target.value)}
                          className={`w-full text-center py-2 border rounded-xl font-extrabold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2563eb] transition-all border-slate-200/80 ${cellFlashes[`${row.id}-group1-prevYear`] ? 'bg-amber-100' : ''
                            }`}
                        />
                      </td>
                      <td className="p-1 border-r border-slate-150 bg-slate-50/10 w-52">
                        <input
                          type="number"
                          value={row.group1?.currentS1 ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'group1', 'currentS1', e.target.value)}
                          className={`w-full text-center py-2 border rounded-xl font-extrabold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2563eb] transition-all border-slate-200/80 ${cellFlashes[`${row.id}-group1-currentS1`] ? 'bg-amber-100' : ''
                            }`}
                        />
                      </td>
                      <td className="p-1 border-r border-slate-150 bg-slate-50/10 w-52">
                        <input
                          type="number"
                          value={row.group1?.planS2 ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'group1', 'planS2', e.target.value)}
                          className={`w-full text-center py-2 border rounded-xl font-extrabold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2563eb] transition-all border-slate-200/80 ${cellFlashes[`${row.id}-group1-planS2`] ? 'bg-amber-100' : ''
                            }`}
                        />
                      </td>
                      <td className="px-3 py-1 bg-slate-50/20">
                        <input
                          type="text"
                          value={row.note || ''}
                          disabled={!isDr}
                          placeholder="Ghi chú..."
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = form.data.map(r => r.id === row.id ? { ...r, note: val } : r);
                            onUpdateForm({ ...form, data: updated, updatedAt: new Date().toISOString() });
                          }}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200/60 rounded-lg font-bold text-slate-800 hover:bg-white bg-slate-50/40 text-left outline-none focus:border-[#2563eb] focus:bg-white transition-all placeholder:text-slate-300"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom details block - Proof upload & requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* File Upload Block */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm" id="proof-upload-panel">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563eb]" />
              Tải lên hồ sơ minh chứng
            </h4>

            {form.proofFiles && form.proofFiles.length > 0 ? (
              <div className="space-y-3 mb-4 animate-fade-in">
                {form.proofFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-100/30 rounded-2xl border border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-400 font-bold">
                          {((file.size || 0) / 1024 / 1024).toFixed(2)} MB &bull; Đã đính kèm ngày {file.uploadedAt || 'vừa xong'}
                        </p>
                      </div>
                    </div>

                    {isDr && (
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        className="text-slate-400 hover:text-red-500 p-2 hover:bg-slate-100 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                        title="Gỡ file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            {isDr ? (
              <div
                onClick={() => {
                  const mockFile: ProofFile = {
                    name: 'Bao_Cao_Minh_Chung_Bo_Tieu_Chi_B06_SignCert.pdf',
                    size: 2154820,
                    uploadedAt: new Date().toISOString().split('T')[0],
                    type: 'pdf'
                  };
                  onUpdateForm({
                    ...form,
                    proofFiles: [...(form.proofFiles || []), mockFile],
                    updatedAt: new Date().toISOString()
                  });
                  setNotifyMessage('Đã tự động đính kèm hồ sơ chứng thực số thành công!');
                  setTimeout(() => setNotifyMessage(null), 3000);
                }}
                className="border-2 border-dashed border-slate-300 hover:border-[#2563eb] bg-slate-50/40 hover:bg-blue-50/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
              >
                <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#2563eb] transition-colors" />
                <p className="text-xs text-slate-600 font-bold">
                  Kéo thả file PDF hoặc Excel vào đây để đính kèm, hoặc <span className="text-[#2563eb] font-black underline">chọn file</span>
                </p>
                <p className="text-xs text-slate-450 mt-1 font-bold">
                  Hỗ trợ định dạng PDF, Excel. Tối đa 25MB. (Click để tải lên tài liệu minh chứng mẫu ngay)
                </p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-bold">
                Quy trình chỉnh sửa đã đóng. Minh chứng không thể thay đổi ở chế độ chỉ xem.
              </div>
            )}
          </div>

          {/* Technical requirements sidebar panel */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between" id="tech-requirements-panel">
            <div>
              <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-500" />
                Yêu cầu kỹ thuật
              </h4>
              <ul className="space-y-3 text-xs text-slate-600 font-semibold leading-relaxed pl-1 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold text-xs mt-0.5">✓</span>
                  <span>Dữ liệu được cập nhật từ báo cáo cấp xã định kỳ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold text-xs mt-0.5">✓</span>
                  <span>Các trường 'Kế hoạch 6 tháng cuối năm' được tính toán tự động dựa trên chỉ tiêu năm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold text-xs mt-0.5">✓</span>
                  <span>Phải có chữ ký số của người đại diện trước khi gửi báo cáo chính thức.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Global form draft helper sticky banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in" id="sticky-action-banner">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl shrink-0">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <p className="text-xs font-extrabold text-[#2563eb]">
              Mọi dữ liệu thay đổi trên bảng biểu này sẽ được lưu tự động bản nháp.
            </p>
          </div>

          {/* <div className="flex items-center gap-3.5 w-full sm:w-auto self-end sm:self-center justify-end">
            <button
              onClick={() => {
                setNotifyMessage('Đã tiến hành lưu trữ bản nháp Biểu 06 thành công!');
                setTimeout(() => setNotifyMessage(null), 3000);
              }}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-2xl text-xs font-black hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
            >
              Lưu nháp
            </button>

            {isDr ? (
              <button
                onClick={() => setShowConfirmPopup(true)}
                className="px-5 py-2.5 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/15 cursor-pointer whitespace-nowrap flex items-center gap-2"
                id="submit-form-06-btn"
              >
                <Send className="w-4 h-4" />
                Gửi báo cáo
              </button>
            ) : null}
          </div> */}
        </div>

        {/* Digital Signature Confirmation Popup Modal */}
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-150 p-6 shadow-2xl relative animate-scale-up">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-[#014285] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Ký số &amp; Gửi duyệt báo cáo</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Bản báo cáo <strong className="font-bold text-slate-750">{form.code}</strong> sẽ được gửi trực tiếp lên ban chỉ đạo Trung ương phê duyệt thẩm định.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!digitalSignInput.trim()) {
                    alert('Vui lòng điền họ và tên người ký xác nhận.');
                    return;
                  }
                  onUpdateForm({
                    ...form,
                    status: 'SUBMITTED',
                    editor: digitalSignInput,
                    updatedAt: new Date().toISOString(),
                  });
                  setShowConfirmPopup(false);
                  setNotifyMessage(`Biểu mẫu đã được Ký số bởi ${digitalSignInput} và gửi đi phê duyệt thẩm định.`);
                  setTimeout(() => setNotifyMessage(null), 4000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Họ và tên người ký chính chủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={digitalSignInput}
                    onChange={(e) => setDigitalSignInput(e.target.value)}
                    placeholder="Điền đầy đủ họ và tên..."
                    className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#014285] font-extrabold text-slate-800"
                  />
                  <p className="text-xs text-slate-400 mt-2 font-bold leading-normal">
                    Lưu ý: Bằng việc nhập họ tên, bạn xác nhận số liệu đã kiểm kê khớp thực địa và chịu trách nhiệm pháp lý về số liệu báo cáo này.
                  </p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPopup(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer bg-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                  >
                    Chấp thuận &amp; Ký số
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (form.code === 'Biểu 09' || form.code === 'Biểu 12') {
    const isDr = form.status === 'DRAFT' || form.status === 'REJECTED';

    // Calculate Grand Totals across non-header rows
    const calculatedTotals = {
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

    (form.data || []).forEach(row => {
      if (row.isHeader) return;
      const quantity = Number(row.quantity) || 0;
      const hd_dtpt = Number(row.hd_nstw_dtpt) || 0;
      const hd_sn = Number(row.hd_nstw_sn) || 0;
      const hd_nsdp = Number(row.hd_nsdp) || 0;
      const hd_long = Number(row.hd_longGhep) || 0;
      const hd_tin = Number(row.hd_tinDung) || 0;
      const hd_doanh = Number(row.hd_doanhNghiep) || 0;
      const hd_dan = Number(row.hd_danGop) || 0;

      const hd_vdt = hd_dtpt + hd_sn + hd_nsdp;
      const hd_tot = hd_vdt + hd_long + hd_tin + hd_doanh + hd_dan;

      const kh_dtpt = Number(row.kh_nstw_dtpt) || 0;
      const kh_sn = Number(row.kh_nstw_sn) || 0;
      const kh_nsdp = Number(row.kh_nsdp) || 0;
      const kh_long = Number(row.kh_longGhep) || 0;
      const kh_tin = Number(row.kh_tinDung) || 0;
      const kh_doanh = Number(row.kh_doanhNghiep) || 0;
      const kh_dan = Number(row.kh_danGop) || 0;

      const kh_vdt = kh_dtpt + kh_sn + kh_nsdp;
      const kh_tot = kh_vdt + kh_long + kh_tin + kh_doanh + kh_dan;

      calculatedTotals.quantity += quantity;
      calculatedTotals.hd_nstw_dtpt += hd_dtpt;
      calculatedTotals.hd_nstw_sn += hd_sn;
      calculatedTotals.hd_nsdp += hd_nsdp;
      calculatedTotals.hd_longGhep += hd_long;
      calculatedTotals.hd_tinDung += hd_tin;
      calculatedTotals.hd_doanhNghiep += hd_doanh;
      calculatedTotals.hd_danGop += hd_dan;
      calculatedTotals.hd_vdt_tongSo += hd_vdt;
      calculatedTotals.hd_tongSo += hd_tot;

      calculatedTotals.kh_nstw_dtpt += kh_dtpt;
      calculatedTotals.kh_nstw_sn += kh_sn;
      calculatedTotals.kh_nsdp += kh_nsdp;
      calculatedTotals.kh_longGhep += kh_long;
      calculatedTotals.kh_tinDung += kh_tin;
      calculatedTotals.kh_doanhNghiep += kh_doanh;
      calculatedTotals.kh_danGop += kh_dan;
      calculatedTotals.kh_vdt_tongSo += kh_vdt;
      calculatedTotals.kh_tongSo += kh_tot;
    });

    const handleInputChange = (rowId: any, field: string, val: any) => {
      const parsedVal = val === '' ? 0 : isNaN(Number(val)) ? val : Number(val);
      const updatedData = form.data.map((r: any) => {
        if (r.id === rowId) {
          return {
            ...r,
            [field]: parsedVal,
          };
        }
        return r;
      });

      onUpdateForm({
        ...form,
        data: updatedData,
        updatedAt: new Date().toISOString(),
      });
    };

    const handleAddChildRow = (sectionCode: 'I' | 'II' | 'III') => {
      const maxId = form.data.reduce((max: number, r: any) => Math.max(max, Number(r.id) || 0), 0);
      const nextId = maxId + 1;

      const newRow = {
        id: nextId,
        isHeader: false,
        sectionCode,
        category: "Nội dung thành phần mới",
        quantity: 0,
        hd_nstw_dtpt: 0, hd_nstw_sn: 0, hd_nsdp: 0, hd_longGhep: 0, hd_tinDung: 0, hd_doanhNghiep: 0, hd_danGop: 0,
        kh_nstw_dtpt: 0, kh_nstw_sn: 0, kh_nsdp: 0, kh_longGhep: 0, kh_tinDung: 0, kh_doanhNghiep: 0, kh_danGop: 0,
        note: ""
      };

      const lastIndexOfSection = form.data.map((r: any, idx: number) => ({ r, idx }))
        .filter((item: any) => item.r.sectionCode === sectionCode)
        .slice(-1)[0]?.idx;

      const updatedData = [...form.data];
      if (lastIndexOfSection !== undefined) {
        updatedData.splice(lastIndexOfSection + 1, 0, newRow);
      } else {
        updatedData.push(newRow);
      }

      onUpdateForm({
        ...form,
        data: updatedData,
        updatedAt: new Date().toISOString(),
      });

      setNotifyMessage("Đã thêm nội dung chi tiêu mới thành công.");
      setTimeout(() => setNotifyMessage(null), 3000);
    };

    const handleAddChildItem = (parentId: any) => {
      const parentRow = form.data.find((r: any) => r.id === parentId);
      if (!parentRow) return;

      const maxId = form.data.reduce((max: number, r: any) => Math.max(max, Number(r.id) || 0), 0);
      const nextId = maxId + 1;

      const newChildRow = {
        id: nextId,
        isHeader: false,
        sectionCode: parentRow.sectionCode,
        parentId: parentRow.id,
        category: "Nội dung con mới",
        quantity: 0,
        hd_nstw_dtpt: 0, hd_nstw_sn: 0, hd_nsdp: 0, hd_longGhep: 0, hd_tinDung: 0, hd_doanhNghiep: 0, hd_danGop: 0,
        kh_nstw_dtpt: 0, kh_nstw_sn: 0, kh_nsdp: 0, kh_longGhep: 0, kh_tinDung: 0, kh_doanhNghiep: 0, kh_danGop: 0,
        note: ""
      };

      const updatedData = [...form.data];
      let insertIndex = -1;
      for (let i = 0; i < updatedData.length; i++) {
        if (updatedData[i].id === parentId) {
          insertIndex = i;
        } else if (updatedData[i].parentId === parentId) {
          insertIndex = i;
        }
      }

      if (insertIndex !== -1) {
        updatedData.splice(insertIndex + 1, 0, newChildRow);
      } else {
        updatedData.push(newChildRow);
      }

      onUpdateForm({
        ...form,
        data: updatedData,
        updatedAt: new Date().toISOString(),
      });

      setNotifyMessage("Đã thêm nội dung con mới thành công.");
      setTimeout(() => setNotifyMessage(null), 3000);
    };

    const handleDeleteRow = (rowId: any, category: string) => {
      const updatedData = form.data.filter((r: any) => r.id !== rowId && r.parentId !== rowId);
      onUpdateForm({
        ...form,
        data: updatedData,
        updatedAt: new Date().toISOString(),
      });
      setNotifyMessage(`Đã xóa nội dung: "${category}"`);
      setTimeout(() => setNotifyMessage(null), 3500);
    };

    let countI = 0;
    let countII = 0;
    let countIII = 0;
    const parentTTMap: { [parentId: number]: string } = {};
    const childCountMap: { [parentId: number]: number } = {};

    return (
      <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-12" id={form.code === 'Biểu 09' ? 'bieu-09-view' : 'bieu-12-view'}>
        {notifyMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350 animate-fade-in" id={form.code === 'Biểu 09' ? 'toast-notify-09' : 'toast-notify-12'}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
            <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 flex-wrap uppercase tracking-wider text-left" id={form.code === 'Biểu 09' ? 'bieu-09-breadcrumb' : 'bieu-12-breadcrumb'}>
          <button onClick={onBackToPeriods || onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent font-bold">
            Đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent font-bold">
            Chi tiết đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#014285] font-black">Báo cáo Mẫu {form.code === 'Biểu 09' ? '09' : '12'}</span>
        </div>

        {form.status === 'REJECTED' && form.appraisal && (
          <div className="bg-red-50 border border-red-200 text-red-850 p-5 rounded-2xl flex items-start gap-4 shadow-sm" id={form.code === 'Biểu 09' ? 'rejected-warning-card-09' : 'rejected-warning-card-12'}>
            <AlertTriangle className="w-5.5 h-5.5 shrink-0 text-red-650 mt-0.5" />
            <div className="text-xs space-y-1 text-left">
              <span className="font-extrabold uppercase tracking-wider text-red-800 block">Yêu cầu sửa đổi bổ sung</span>
              <p className="font-bold leading-relaxed">{form.appraisal.comment}</p>
              <div className="pt-1.5 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs uppercase font-black tracking-widest">
                  Thẩm định: {form.appraisal.appraiserName}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(form.appraisal.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left" id={form.code === 'Biểu 09' ? 'title-bar-09' : 'title-bar-12'}>
          <div className="space-y-1">
            <h1 className="text-base font-black text-[#0f2942] tracking-tight leading-snug">
              Mẫu {form.code === 'Biểu 09' ? '09' : '12'}: Kết quả huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng / năm ...
            </h1>
            <p className="text-xs text-slate-400 font-extrabold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-550" />
              Cập nhật lúc: {new Date(form.updatedAt).toLocaleString('vi-VN')} | Đơn vị báo cáo: {form.code === 'Biểu 09' ? 'Cấp Tỉnh' : 'Cấp Xã'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNotifyMessage("Đang xuất dữ liệu Excel...");
                setTimeout(() => setNotifyMessage(null), 2500);
              }}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Tải mẫu Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[1600px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-black text-xs uppercase tracking-wider text-center border-b border-slate-200">
                  <th rowSpan={4} className="p-3.5 border-r border-slate-200 w-16 text-center select-none text-[#014285]">TT</th>
                  <th rowSpan={4} className="p-3.5 border-r border-slate-200 min-w-[280px] text-left sticky left-0 bg-slate-100 font-bold z-10 text-[#014285] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Nội dung thực hiện</th>
                  <th rowSpan={4} className="p-3.5 border-r border-slate-200 w-24 text-center text-[#014285]">Khối lượng</th>
                  <th colSpan={9} className="p-3 border-r border-slate-200 text-center text-[#014285] bg-blue-50/50">Kết quả huy động và thực hiện 6 tháng / năm...</th>
                  <th colSpan={9} className="p-3 border-r border-slate-200 text-center text-amber-800 bg-amber-50/40">Kế hoạch 6 tháng cuối năm...</th>
                  <th rowSpan={4} className="p-3.5 border-r border-slate-200 min-w-[200px] text-center text-[#014285]">Ghi chú</th>
                  {isDr && <th rowSpan={4} className="p-3.5 text-center min-w-[70px] text-red-500">Thao tác</th>}
                </tr>

                <tr className="bg-slate-50 text-slate-700 font-black border-b border-slate-150 text-center text-xs">
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-24 bg-[#e2e8f0]/40 text-slate-800 font-black">Tổng số</th>
                  <th colSpan={4} className="p-2 border-r border-slate-200 text-center text-slate-800 bg-blue-50/20">Vốn đầu tư trực tiếp</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-blue-50/20">Lồng ghép</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-blue-50/20">Tín dụng</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-blue-50/20">Doanh nghiệp</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-blue-50/20 font-bold">Dân góp</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-24 bg-amber-100/30 text-amber-900 font-black">Tổng số</th>
                  <th colSpan={4} className="p-2 border-r border-slate-200 text-center text-amber-900 bg-amber-50/20">Vốn đầu tư trực tiếp</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-amber-50/20">Lồng ghép</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-amber-50/20">Tín dụng</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-amber-50/20">Doanh nghiệp</th>
                  <th rowSpan={3} className="p-2 border-r border-slate-200 text-center w-22 bg-amber-50/20 font-bold">Dân góp</th>
                </tr>

                <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-150 text-center text-xs">
                  <th rowSpan={2} className="p-2 border-r border-slate-200 text-center w-24 bg-blue-50/10">Tổng số</th>
                  <th colSpan={2} className="p-2 border-r border-slate-200 text-center bg-blue-50/10">NSTW</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-200 text-center w-24 bg-blue-50/10">NSĐP</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-200 text-center w-24 bg-amber-50/10">Tổng số</th>
                  <th colSpan={2} className="p-2 border-r border-slate-200 text-center bg-amber-50/10">NSTW</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-200 text-center w-24 bg-amber-50/10">NSĐP</th>
                </tr>

                <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-150 text-center text-xs tracking-wide">
                  <th className="p-1.5 border-r border-slate-200 text-center bg-blue-50/10 w-22">ĐTPT</th>
                  <th className="p-1.5 border-r border-slate-200 text-center bg-blue-50/10 w-22">SN</th>
                  <th className="p-1.5 border-r border-slate-200 text-center bg-amber-50/10 w-22">ĐTPT</th>
                  <th className="p-1.5 border-r border-slate-200 text-center bg-amber-50/10 w-22">SN</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-150 text-xs text-slate-700 font-bold">
                {(form.data || []).map((row: any) => {
                  if (row.isHeader) {
                    return (
                      <tr key={row.id} className="bg-slate-100/90 font-black text-slate-800 border-y border-slate-200 z-10">
                        <td className="p-3.5 border-r border-slate-150 font-black text-center select-none text-slate-805 text-xs">{row.sectionCode}</td>
                        <td colSpan={21 + (isDr ? 1 : 0)} className="p-3.5 px-4 sticky left-0 text-left font-black uppercase text-xs text-[#0f2942] tracking-wide bg-slate-100">
                          <div className="flex items-center justify-between">
                            <span>{row.category}</span>
                            {isDr && (
                              <button
                                type="button"
                                onClick={() => handleAddChildRow(row.sectionCode)}
                                className="px-3.5 py-1.5 text-xs bg-[#014285] hover:bg-[#0252a5] hover:scale-105 active:scale-95 text-white font-black rounded-xl flex items-center gap-1.5 cursor-pointer border-none shadow-sm transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Thêm nội dung thành phần
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
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

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 border-r border-[#e2e8f0] text-center text-slate-500 font-mono font-bold select-none">{ttDisplay}</td>

                      <td className="p-2 border-r border-[#e2e8f0] sticky left-0 bg-white hover:bg-slate-50 transition-colors z-10 shadow-[2px_0_5px_rgba(0,0,0,0.01)] min-w-[320px]">
                        <div className="flex items-center gap-1.5 w-full">
                          {row.parentId && (
                            <span className="text-slate-400 pl-4 shrink-0 font-light select-none">↳</span>
                          )}
                          <input
                            type="text"
                            value={row.category || ''}
                            disabled={!isDr}
                            onChange={(e) => handleInputChange(row.id, 'category', e.target.value)}
                            className={`w-full text-xs font-bold text-slate-800 bg-transparent border-none outline-none focus:bg-slate-100 hover:bg-slate-50/70 px-2.5 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:font-light ${row.parentId ? 'pl-1 text-slate-600 font-semibold' : ''}`}
                            placeholder={row.parentId ? "Nhập nội dung con..." : "Nhập nội dung thực hiện..."}
                          />
                        </div>
                      </td>

                      <td className="p-1 px-2 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.quantity ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2563eb] transition-all"
                        />
                      </td>

                      <td className="p-2 border-r border-[#e2e8f0] text-center font-black text-xs text-emerald-600 bg-emerald-50/15">
                        {hd_tot.toLocaleString('vi-VN')}
                      </td>

                      <td className="p-2 border-r border-[#e2e8f0] text-center font-extrabold text-xs text-blue-600 bg-slate-50/20">
                        {hd_vdt_tot.toLocaleString('vi-VN')}
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_nstw_dtpt ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_nstw_dtpt', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_nstw_sn ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_nstw_sn', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_nsdp ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_nsdp', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_longGhep ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_longGhep', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_tinDung ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_tinDung', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_doanhNghiep ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_doanhNghiep', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.hd_danGop ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'hd_danGop', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-2 border-r border-[#e2e8f0] text-center font-black text-xs text-amber-700 bg-amber-50/15">
                        {kh_tot.toLocaleString('vi-VN')}
                      </td>

                      <td className="p-2 border-r border-[#e2e8f0] text-center font-extrabold text-xs text-slate-700 bg-slate-50/20">
                        {kh_vdt_tot.toLocaleString('vi-VN')}
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_nstw_dtpt ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_nstw_dtpt', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-850 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_nstw_sn ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_nstw_sn', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_nsdp ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_nsdp', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_longGhep ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_longGhep', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_tinDung ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_tinDung', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_doanhNghiep ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_doanhNghiep', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-1.5 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          value={row.kh_danGop ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'kh_danGop', e.target.value)}
                          className="w-full text-center py-2 border border-slate-200/80 rounded-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-550 transition-all text-xs"
                        />
                      </td>

                      <td className="p-1 px-2 border-r border-[#e2e8f0]">
                        <input
                          type="text"
                          value={row.note || ''}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'note', e.target.value)}
                          className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl hover:bg-white bg-slate-50/40 text-left outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                          placeholder="Nhập ghi chú..."
                        />
                      </td>

                      {isDr && (
                        <td className="p-1 text-center">
                          <div className="flex items-center justify-between gap-1 w-full max-w-[60px] mx-auto">
                            {!row.parentId && (
                              <button
                                type="button"
                                onClick={() => handleAddChildItem(row.id)}
                                className="text-slate-400 hover:text-[#014285] hover:bg-blue-50/30 p-2 rounded-xl transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
                                title="Thêm nội dung con"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.id, row.category)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-55/10 p-2 rounded-xl transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
                              title="Xóa dòng này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}

                <tr className="bg-[#014285] text-white font-black hover:bg-[#014285] sticky bottom-0 z-20">
                  <td className="p-3.5 border-r border-blue-900/40 text-center font-mono text-white text-xs select-none"></td>
                  <td className="p-3.5 sticky left-0 text-left font-black text-xs uppercase bg-[#014285] text-white tracking-wide border-r border-blue-900/40 shadow-[2px_0_5px_rgba(1,66,133,0.3)]">
                    TỔNG CỘNG
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-mono text-white text-xs">
                    {calculatedTotals.quantity.toLocaleString('vi-VN')}
                  </td>

                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white text-xs">
                    {calculatedTotals.hd_tongSo.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/90 text-xs">
                    {calculatedTotals.hd_vdt_tongSo.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_nstw_dtpt.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_nstw_sn.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_nsdp.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_longGhep.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_tinDung.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_doanhNghiep.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.hd_danGop.toLocaleString('vi-VN')}
                  </td>

                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white text-xs">
                    {calculatedTotals.kh_tongSo.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/90 text-xs">
                    {calculatedTotals.kh_vdt_tongSo.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_nstw_dtpt.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_nstw_sn.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_nsdp.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_longGhep.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_tinDung.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_doanhNghiep.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center border-r border-blue-900/40 font-black text-white/80 text-xs">
                    {calculatedTotals.kh_danGop.toLocaleString('vi-VN')}
                  </td>

                  <td className="p-3 border-r border-blue-900/40 font-bold text-white text-xs italic"></td>
                  {isDr && <td className="p-3 text-center text-white font-black text-sm"></td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4 text-left">
          <Info className="w-5.5 h-5.5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <span className="font-extrabold uppercase tracking-wider text-blue-900 block">Lưu ý khi nhập liệu:</span>
            <ul className="list-disc list-inside space-y-1 pl-1 font-bold">
              <li>Các ô màu xám nhạt hoặc xanh lá nhạt được tính toán tự động dựa trên tổng số các thành phần nguồn vốn.</li>
              <li>Đơn vị tiền tệ: <span className="text-[#014285] font-black underline">triệu đồng</span>. Đơn vị khối lượng theo mét hoặc km tùy nội dung thực tế.</li>
              <li>Đảm bảo các tệp PDF minh chứng đã được đính kèm đầy đủ ở các biểu phụ lục liên quan.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200/90 shadow-lg flex flex-wrap items-center justify-between gap-4 sticky bottom-4 z-40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-500 tracking-wide uppercase">Tự động lưu tạm lúc {new Date(form.updatedAt).toLocaleTimeString('vi-VN')}</span>
          </div>

          {/* <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 active:scale-95 text-slate-600 text-xs font-black rounded-2xl border-none transition-all cursor-pointer"
            >
              Quay lại danh sách
            </button>
            {isDr && (
              <>
                <button
                  onClick={() => {
                    setNotifyMessage("Đã lưu tạm báo cáo thành công.");
                    setTimeout(() => setNotifyMessage(null), 3000);
                  }}
                  className="px-5 py-2.5 bg-[#f8fafc] hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-black rounded-2xl active:scale-95 transition-all cursor-pointer"
                >
                  Lưu nháp
                </button>
                <button
                  onClick={() => {
                    setDigitalSignInput('');
                    setShowConfirmPopup(true);
                  }}
                  className="px-6 py-2.5 bg-[#014285] hover:bg-[#01356b] text-white text-xs font-black rounded-2xl flex items-center gap-2 active:scale-95 shadow-md shadow-blue-900/10 transition-all cursor-pointer border-none"
                >
                  <Send className="w-4 h-4" />
                  Gửi báo cáo &amp; Ký số
                </button>
              </>
            )}
          </div> */}
        </div>

        {showConfirmPopup && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 max-w-sm w-full shadow-2xl relative text-left">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 mb-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-black text-[#0f2942] uppercase">Xác thực Ký số điện tử</h3>
                <p className="text-xs text-slate-400 font-bold leading-normal">
                  Bạn đang thực hiện ký số báo cáo nguồn vốn {form.code}. Sau khi gửi, số liệu sẽ được chuyển thẳng tới Ban Chỉ Đạo để thẩm định &amp; phê duyệt liên ngành.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!digitalSignInput.trim()) return;
                  onUpdateForm({
                    ...form,
                    status: 'SUBMITTED',
                    editor: digitalSignInput,
                    updatedAt: new Date().toISOString(),
                  });
                  setShowConfirmPopup(false);
                  setNotifyMessage(`Biểu mẫu đã được Ký số bởi ${digitalSignInput} và gửi đi phê duyệt thẩm định.`);
                  setTimeout(() => setNotifyMessage(null), 4000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Họ và tên người ký chính chủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={digitalSignInput}
                    onChange={(e) => setDigitalSignInput(e.target.value)}
                    placeholder="Điền đầy đủ họ và tên..."
                    className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#014285] font-extrabold text-slate-800"
                  />
                  <p className="text-xs text-slate-400 mt-2 font-bold leading-normal">
                    Lưu ý: Bằng việc nhập họ tên, bạn xác nhận số liệu đã kiểm kê khớp thực địa và chịu trách nhiệm pháp lý về số liệu báo cáo này.
                  </p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPopup(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer bg-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/10 cursor-pointer border-none"
                  >
                    Chấp thuận &amp; Ký số
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (form.code === 'Biểu 08' || form.code === 'Biểu 13') {
    const isDr = form.status === 'DRAFT' || form.status === 'REJECTED';

    // Calculate sums
    const sumPlan = form.data.reduce((acc, row) => acc + (row.group1?.prevYear || 0), 0);
    const sumResult = form.data.reduce((acc, row) => acc + (row.group1?.currentS1 || 0), 0);
    const sumPercent = sumPlan > 0 ? Math.round((sumResult / sumPlan) * 100) : 0;

    return (
      <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-12" id={form.code === 'Biểu 08' ? 'bieu-08-view' : 'bieu-13-view'}>
        {/* Toast alert */}
        {notifyMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350" id={form.code === 'Biểu 08' ? 'toast-notify-08' : 'toast-notify-13'}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
            <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 flex-wrap uppercase tracking-wider text-left" id={form.code === 'Biểu 08' ? 'bieu-08-breadcrumb' : 'bieu-13-breadcrumb'}>
          <button onClick={onBackToPeriods || onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent font-bold">
            Đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent font-bold">
            Chi tiết đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#014285] font-black">Báo cáo Mẫu {form.code === 'Biểu 08' ? '08' : '13'}</span>
        </div>

        {/* Warning card for Rejected state */}
        {form.status === 'REJECTED' && form.appraisal && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-pulse-subtle" id={form.code === 'Biểu 08' ? 'rejected-warning-card-08' : 'rejected-warning-card-13'}>
            <AlertCircle className="w-5.5 h-5.5 shrink-0 text-red-650 mt-0.5" />
            <div className="text-xs space-y-1 text-left">
              <span className="font-extrabold uppercase tracking-wider text-red-905 block">Yêu cầu sửa đổi bổ sung</span>
              <p className="font-bold leading-relaxed">{form.appraisal.comment}</p>
              <div className="pt-1.5 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs uppercase font-black tracking-widest">
                  Thẩm định: {form.appraisal.appraiserName}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(form.appraisal.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Title view bar of Biểu 08/13 as screenshot */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left" id={form.code === 'Biểu 08' ? 'title-bar-08' : 'title-bar-13'}>
          <div className="space-y-1">
            <h1 className="text-base font-black text-[#0f2942] tracking-tight leading-snug">
              Nhập liệu {form.code} - {form.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-400">
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-xl border border-amber-100/60 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {form.status === 'DRAFT' ? 'Đang soạn thảo' : form.status === 'REJECTED' ? 'Bị trả lại' : form.status === 'SUBMITTED' ? 'Chờ thẩm định' : 'Đã phê duyệt'}
              </span>
              <span>&bull;</span>
              <span>Cập nhật lần cuối: {new Date(form.updatedAt || '2024-10-25T14:30:00Z').toLocaleString('vi-VN')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto shrink-0 justify-end">
            <button
              onClick={() => {
                setNotifyMessage(`Đang tải lịch sử chỉnh sửa biểu mẫu ${form.code === 'Biểu 08' ? '08' : '13'} từ hệ thống...`);
                setTimeout(() => setNotifyMessage(null), 2500);
              }}
              className="px-4 py-2 border border-slate-250 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl cursor-pointer transition-all flex items-center gap-2"
              id={form.code === 'Biểu 08' ? 'history-btn-08' : 'history-btn-13'}
            >
              <History className="w-4 h-4 text-slate-500" />
              Lịch sử chỉnh sửa
            </button>
          </div>
        </div>

        {/* Dynamic Spreadsheet Table wrapper styled elegantly like the screenshot */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id={form.code === 'Biểu 08' ? 'spreadsheet-wrapper-08' : 'spreadsheet-wrapper-13'}>
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/20 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#014285]" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {form.title}
              </h3>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              {isDr && (
                <button
                  onClick={() => {
                    const maxId = form.data.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0);
                    const newRowId = maxId + 1;
                    const newRow: CriterionRow = {
                      id: newRowId,
                      category: `Công trình hạ tầng mới ${newRowId}`,
                      unit: "Công trình",
                      group1: { prevYear: 0, currentS1: 0, planS2: 0 },
                      group2: { prevYear: 0, currentS1: 0, planS2: 0 },
                      group3: { prevYear: 0, currentS1: 0, planS2: 0 },
                      note: ""
                    };
                    onUpdateForm({
                      ...form,
                      data: [...form.data, newRow],
                      updatedAt: new Date().toISOString()
                    });
                    setNotifyMessage(`Đã thêm 1 công trình mới thành công!`);
                    setTimeout(() => setNotifyMessage(null), 3000);
                  }}
                  className="px-4 py-2 bg-[#014285] hover:bg-[#01356b] text-white text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/10"
                  id={form.code === 'Biểu 08' ? 'add-btn-08' : 'add-btn-13'}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm công trình
                </button>
              )}
              <span className="text-xs text-slate-400 font-bold italic whitespace-nowrap">
                Đơn vị tính: Triệu đồng (VNĐ)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full text-xs text-left border-collapse border-b border-slate-100 min-w-[980px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-black tracking-wider border-b border-slate-150 text-center">
                  <th className="py-4 px-3 border-r border-slate-150 text-center w-14">TT</th>
                  <th className="py-4 px-5 border-r border-slate-150 text-left min-w-[280px]">
                    Công trình
                  </th>
                  <th className="py-4 px-3 border-r border-slate-150 w-[170px]">
                    Kế hoạch năm...
                  </th>
                  <th className="py-4 px-3 border-r border-slate-150 w-[170px]">
                    Kết quả thực hiện hằng năm / năm...
                  </th>
                  <th className="py-4 px-3 border-r border-slate-150 w-[170px]">Gắn kết hoàn thành (%)</th>
                  <th className="py-4 px-5 text-left border-r border-slate-150">Ghi chú</th>
                  {isDr && <th className="py-4 px-3 text-center w-16">Xóa</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* TỔNG CỘNG row at the top of table body, as shown in the screenshot */}
                <tr className="bg-blue-50/25 uppercase text-xs font-black border-b-2 border-slate-150 text-slate-800">
                  <td className="py-4 px-3 text-center border-r border-slate-150">-</td>
                  <td className="py-4 px-5 border-r border-slate-150 tracking-tight">TỔNG CỘNG SỐ LIỆU</td>

                  {/* Total Plan */}
                  <td className="py-4 px-3 text-center border-r border-slate-150 font-black font-mono text-sm text-[#014285]">
                    {sumPlan.toLocaleString('vi-VN')},00
                  </td>

                  {/* Total Result */}
                  <td className="py-4 px-3 text-center border-r border-slate-150 font-black font-mono text-sm text-[#014285]">
                    {sumResult.toLocaleString('vi-VN')},00
                  </td>

                  {/* Total Percent */}
                  <td className="py-4 px-3 text-center border-r border-slate-150 font-black font-mono text-sm text-emerald-600">
                    {sumPercent}%
                  </td>

                  <td className="py-4 px-5 bg-slate-50/50 font-bold text-slate-400 text-xs italic text-left border-r border-slate-150">
                    Tự động lũy kế
                  </td>

                  {isDr && <td className="py-4 px-3 bg-slate-50/50 text-center">-</td>}
                </tr>

                {(form.data || []).map((row, idx) => {
                  const percent = row.group1?.prevYear > 0
                    ? Math.round((row.group1.currentS1 / row.group1.prevYear) * 100)
                    : 0;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/35 transition-colors font-semibold">
                      <td className="py-3 px-3 text-center border-r border-slate-150 text-slate-400 font-bold font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-1 px-3 border-r border-slate-[#e2e8f0] text-slate-850 text-left min-w-[280px]">
                        {isDr ? (
                          <div className="space-y-1 py-1">
                            <input
                              type="text"
                              value={row.category}
                              onChange={(e) => {
                                const updated = form.data.map(r => r.id === row.id ? { ...r, category: e.target.value } : r);
                                onUpdateForm({ ...form, data: updated, updatedAt: new Date().toISOString() });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200/80 rounded-xl font-extrabold text-slate-800 bg-white hover:border-slate-350 focus:border-[#2563eb] outline-none transition-all text-left"
                              placeholder="Tên công trình..."
                            />
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 text-left">
                            <span className="font-extrabold text-slate-855 block leading-relaxed">{row.category}</span>
                          </div>
                        )}
                      </td>

                      {/* Kế hoạch năm / Năm trước */}
                      <td className="p-1 px-3 border-r border-[#e2e8f0] text-center">
                        <input
                          type="number"
                          value={row.group1?.prevYear ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'group1', 'prevYear', e.target.value)}
                          className={`w-full text-center py-2.5 border rounded-xl font-extrabold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2563eb] transition-all border-slate-200/85 ${cellFlashes[`${row.id}-group1-prevYear`] ? 'bg-amber-100' : ''
                            }`}
                        />
                      </td>

                      {/* Kết quả thực hiện */}
                      <td className="p-1 px-3 border-r border-[#e2e8f0] text-center">
                        <input
                          type="number"
                          value={row.group1?.currentS1 ?? 0}
                          disabled={!isDr}
                          onChange={(e) => handleInputChange(row.id, 'group1', 'currentS1', e.target.value)}
                          className={`w-full text-center py-2.5 border rounded-xl font-extrabold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2563eb] transition-all border-slate-200/85 ${cellFlashes[`${row.id}-group1-currentS1`] ? 'bg-amber-100' : ''
                            }`}
                        />
                      </td>

                      {/* Phần trăm hoàn thành */}
                      <td className="p-1 px-4 border-r border-[#e2e8f0] text-center font-bold font-mono text-slate-700 bg-slate-50/30">
                        <div className="flex items-center justify-center gap-1.5 h-10 w-full bg-slate-100/50 rounded-xl border border-slate-200/50">
                          <span className="font-black text-xs">{percent} %</span>
                        </div>
                      </td>

                      {/* Ghi chú */}
                      <td className="px-5 py-1 text-left bg-slate-50/10 border-r border-slate-150">
                        <input
                          type="text"
                          value={row.note || ''}
                          disabled={!isDr}
                          placeholder="Nhập ghi chú..."
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = form.data.map(r => r.id === row.id ? { ...r, note: val } : r);
                            onUpdateForm({ ...form, data: updated, updatedAt: new Date().toISOString() });
                          }}
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200/70 rounded-xl font-bold text-slate-855 hover:bg-white bg-slate-50/40 text-left outline-none focus:border-[#2563eb] focus:bg-white transition-all placeholder:text-slate-350"
                        />
                      </td>

                      {/* Delete action button */}
                      {isDr && (
                        <td className="py-2.5 px-2 text-center bg-slate-50/5">
                          <button
                            onClick={() => {
                              const updated = form.data.filter(r => r.id !== row.id);
                              onUpdateForm({
                                ...form,
                                data: updated,
                                updatedAt: new Date().toISOString()
                              });
                              setNotifyMessage(`Đã xóa công trình: "${row.category}"`);
                              setTimeout(() => setNotifyMessage(null), 3000);
                            }}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all border-none bg-transparent cursor-pointer flex items-center justify-center mx-auto"
                            title="Xóa công trình này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom details block matching the first screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 text-left">
          {/* Card: Hướng dẫn nhập liệu */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between" id={form.code === 'Biểu 08' ? 'guide-panel-08' : 'guide-panel-13'}>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-[#014285]" />
                Hướng dẫn nhập liệu
              </h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Vui lòng nhập giá trị bằng số nguyên cho các cột kế hoạch và kết quả hằng năm. Tỷ lệ phần trăm sẽ tự động tính toán dựa trên số liệu thực tế đã lưu trực tiếp.
              </p>
            </div>
          </div>

          {/* Card: Tài liệu đính kèm */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between" id={form.code === 'Biểu 08' ? 'attachment-panel-08' : 'attachment-panel-13'}>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#014285]" />
                Tài liệu đính kèm
              </h4>

              {form.proofFiles && form.proofFiles.length > 0 ? (
                <div className="space-y-2 mb-2 animate-fade-in">
                  {form.proofFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 transition-all">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-[#014285]" />
                        <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      {isDr && (
                        <button
                          onClick={() => handleDeleteFile(file.name)}
                          className="text-slate-400 hover:text-red-500 hover:bg-slate-150 p-1 rounded-lg border-none bg-transparent cursor-pointer ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {isDr ? (
                <div
                  onClick={() => {
                    const mockFile: ProofFile = {
                      name: `Quyet_Dinh_Dau_Tu_Cong_${form.code === 'Biểu 08' ? 'Bo08' : 'Bo13'}_SignCert.pdf`,
                      size: 1850124,
                      uploadedAt: new Date().toISOString().split('T')[0],
                      type: 'pdf'
                    };
                    onUpdateForm({
                      ...form,
                      proofFiles: [...(form.proofFiles || []), mockFile],
                      updatedAt: new Date().toISOString()
                    });
                    setNotifyMessage('Đã tải lên tệp đính kèm Quyết định đầu tư thành công!');
                    setTimeout(() => setNotifyMessage(null), 3000);
                  }}
                  className="border-2 border-dashed border-slate-200 hover:border-[#014285] bg-slate-50/50 hover:bg-blue-50/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group h-28"
                >
                  <Plus className="w-6 h-6 text-slate-400 mb-1.5 group-hover:text-[#014285] transition-colors" />
                  <p className="text-xs text-slate-600 font-extrabold">
                    Kéo thả hoặc tải lên Quyết định đầu tư (PDF)
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400 text-xs font-bold">
                  Chế độ chỉ xem. Đính kèm khóa chặt.
                </div>
              )}
            </div>
          </div>

          {/* Img Graphic Card matching screenshot quote */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center" id={form.code === 'Biểu 08' ? 'quote-panel-08' : 'quote-panel-13'}>
            <div className="relative w-full max-w-[130px] h-20 rounded-xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 mb-3 flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-[#014285] opacity-80 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 italic font-bold max-w-[200px] leading-relaxed">
              "Số liệu chính xác là nền tảng cho sự phát triển bền vững."
            </p>
          </div>
        </div>

        {/* Action sticky bar like Biểu 06 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in text-left" id={form.code === 'Biểu 08' ? 'action-bar-08' : 'action-bar-13'}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#014285] rounded-xl shrink-0">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <p className="text-xs font-extrabold text-[#014285]">
              Mọi dữ liệu thay đổi trên bảng biểu này sẽ được lưu tự động bản nháp.
            </p>
          </div>

          {/* <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setNotifyMessage(`Đã tiến hành lưu trữ bản nháp ${form.code} thành công!`);
                setTimeout(() => setNotifyMessage(null), 3000);
              }}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-2xl text-xs font-black hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap font-bold"
            >
              Lưu nháp
            </button>

            {isDr ? (
              <button
                onClick={() => setShowConfirmPopup(true)}
                className="px-5 py-2.5 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/15 cursor-pointer whitespace-nowrap flex items-center gap-2 font-bold"
                id={form.code === 'Biểu 08' ? 'submit-form-08-btn' : 'submit-form-13-btn'}
              >
                <Send className="w-4 h-4" />
                Gửi báo cáo
              </button>
            ) : null}
          </div> */}
        </div>

        {/* Digital Signature Confirmation Popup Modal */}
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-150 p-6 shadow-2xl relative animate-scale-up text-left">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-[#014285] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Ký số &amp; Gửi duyệt báo cáo</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Bản báo cáo <strong className="font-bold text-slate-750">{form.code}</strong> sẽ được gửi trực tiếp lên ban chỉ đạo Trung ương phê duyệt thẩm định.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!digitalSignInput.trim()) {
                    alert('Vui lòng điền họ và tên người ký xác nhận.');
                    return;
                  }
                  onUpdateForm({
                    ...form,
                    status: 'SUBMITTED',
                    editor: digitalSignInput,
                    updatedAt: new Date().toISOString(),
                  });
                  setShowConfirmPopup(false);
                  setNotifyMessage(`Biểu mẫu đã được Ký số bởi ${digitalSignInput} và gửi đi phê duyệt thẩm định.`);
                  setTimeout(() => setNotifyMessage(null), 4000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Họ và tên người ký chính chủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={digitalSignInput}
                    onChange={(e) => setDigitalSignInput(e.target.value)}
                    placeholder="Điền đầy đủ họ và tên..."
                    className="w-full text-xs p-3 transition-all border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#014285] font-extrabold text-slate-800"
                  />
                  <p className="text-xs text-slate-400 mt-2 font-bold leading-normal">
                    Lưu ý: Bằng việc nhập họ tên, bạn xác nhận số liệu đã kiểm kê khớp thực địa và chịu trách nhiệm pháp lý về số liệu báo cáo này.
                  </p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPopup(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer bg-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#014285] hover:bg-[#01356b] text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                  >
                    Chấp thuận &amp; Ký số
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (form.code === 'Biểu 07' || form.code === 'Biểu 11') {
    const isDr = form.status === 'DRAFT' || form.status === 'REJECTED';
    const flashPrefix = form.code === 'Biểu 11' ? '11-' : '07-';

    return (
      <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-12">
        {/* Toast alert */}
        {notifyMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
            <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 flex-wrap uppercase tracking-wider">
          <button onClick={onBackToPeriods || onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent">
            Đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBack} className="hover:text-amber-500 cursor-pointer transition-colors border-none bg-transparent">
            Chi tiết đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#014285] font-black">Báo cáo Mẫu {form.code === 'Biểu 11' ? '11' : '07'}</span>
        </div>

        {/* Warning card for Rejected state */}
        {form.status === 'REJECTED' && form.appraisal && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-5.5 h-5.5 shrink-0 text-red-650 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold uppercase tracking-wider text-red-900 block">Yêu cầu điều chỉnh số liệu</span>
              <p className="font-bold leading-relaxed">{form.appraisal.comment}</p>
              <div className="pt-1.5 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs uppercase font-black tracking-widest">
                  Thẩm định viên: {form.appraisal.appraiserName}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(form.appraisal.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Header Block matching screenshot layout */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 tracking-wider">
                {form.code === 'Biểu 11' ? 'Phụ Biểu số 11 (Xã)' : 'Phụ Biểu số 07 (Tỉnh)'}
              </span>
              <h1 className="text-lg font-black text-[#0f2942] tracking-tight mt-2 uppercase">
                {form.title || 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình'}
              </h1>
              <span className="text-xs text-slate-400 font-extrabold block mt-1 tracking-wider italic">
                ĐVT: Triệu đồng
              </span>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-center">
              {form.status === 'DRAFT' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang thực hiện
                </span>
              )}
              {form.status === 'REJECTED' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-150 text-xs font-black uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Bị trả lại
                </span>
              )}
              {form.status === 'SUBMITTED' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-150 text-xs font-black uppercase tracking-wider animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  Chờ thẩm định
                </span>
              )}
              {form.status === 'APPROVED' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-55/15 text-emerald-700 rounded-lg border border-emerald-150 text-xs font-black uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Đã phê duyệt
                </span>
              )}
              {form.status === 'SUPERVISED' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg border border-violet-150 text-xs font-black uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  Đã giám sát
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Resources Table representation of the screenshot */}
        <div className="bg-white rounded-2xl border border-slate-200/95 shadow-[0_2px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[1040px]">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-black text-xs border-b border-slate-200">
                  <th className="px-4 py-4.5 border-r border-slate-150 text-center w-14">STT</th>
                  <th className="px-6 py-4.5 border-r border-slate-150 min-w-[280px]">NỘI DUNG CHI TIÊU</th>
                  <th className="px-4 py-4.5 border-r border-slate-150 text-center w-40">KẾ HOẠCH NĂM 2024</th>
                  <th className="px-4 py-4.5 border-r border-slate-150 text-center w-40">6 THÁNG ĐẦU NĂM</th>
                  <th className="px-4 py-4.5 border-r border-slate-150 text-center w-40">6 THÁNG CUỐI NĂM (DỰ KIẾN)</th>
                  <th className="px-4 py-4.5 border-r border-slate-150 text-center w-40 bg-slate-50/50">ƯỚC THỰC HIỆN CẢ NĂM</th>
                  <th className="px-4 py-4.5 text-center w-40 bg-blue-50/35 text-[#014285]">TỶ LỆ GIẢI NGÂN (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs text-slate-700 font-semibold">

                {/* TỔNG SỐ level 0 */}
                <tr className="bg-slate-50/70 text-slate-900 font-extrabold border-b border-slate-200">
                  <td className="px-4 py-4.5 border-r border-slate-150 text-center font-mono"></td>
                  <td className="px-6 py-4.5 border-r border-slate-150 text-slate-900 font-black tracking-wide uppercase">TỔNG SỐ</td>
                  <td className="px-4 py-4.5 border-r border-slate-150 text-center font-black text-sm">{computedTable07.tong.plan.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4.5 border-r border-slate-150 text-center font-black text-sm">{computedTable07.tong.first.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4.5 border-r border-slate-150 text-center font-black text-sm">{computedTable07.tong.second.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4.5 border-r border-slate-150 text-center font-black text-sm bg-slate-150/20">{computedTable07.tong.total.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4.5 text-center text-blue-700 font-black bg-blue-50/50 text-sm">
                    {computedTable07.tong.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* NGÂN SÁCH TRUNG ƯƠNG Level 1 */}
                <tr className="bg-slate-50/25 text-slate-800 font-bold">
                  <td className="px-4 py-4 border-r border-slate-150 text-center font-mono text-slate-800">I</td>
                  <td className="px-6 py-4 border-r border-slate-150 uppercase text-slate-800 font-black tracking-wide">NGÂN SÁCH TRUNG ƯƠNG</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.i.plan.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.i.first.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.i.second.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center bg-slate-50/10 text-slate-800 font-bold">{computedTable07.i.total.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 text-center text-blue-600 font-bold bg-blue-50/10">
                    {computedTable07.i.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* Vốn đầu tư công Level 2 */}
                <tr className="hover:bg-slate-50/35 transition-colors">
                  <td className="px-4 py-3 border-r border-slate-150 text-center font-mono text-slate-400">1</td>
                  <td className="px-6 py-3 border-r border-slate-150 text-slate-700 pl-10 font-bold">Vốn đầu tư công</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.i1_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('i1_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'i1_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.i1_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('i1_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'i1_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.i1_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('i1_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'i1_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={(resourceRows07.i1_first + resourceRows07.i1_second).toLocaleString('vi-VN')}
                      placeholder="Tính tự động..."
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-bold bg-slate-50 text-slate-550 cursor-not-allowed select-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-bold text-xs italic bg-blue-50/5">
                    Tính tự động...
                  </td>
                </tr>

                {/* Kinh phí thường xuyên Level 2 */}
                <tr className="hover:bg-slate-50/35 transition-colors">
                  <td className="px-4 py-3 border-r border-slate-150 text-center font-mono text-slate-400">2</td>
                  <td className="px-6 py-3 border-r border-slate-150 text-slate-700 pl-10 font-bold">Kinh phí thường xuyên</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.i2_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('i2_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'i2_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.i2_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('i2_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'i2_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.i2_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('i2_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'i2_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={(resourceRows07.i2_first + resourceRows07.i2_second).toLocaleString('vi-VN')}
                      placeholder="Tính tự động..."
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-bold bg-slate-50 text-slate-550 cursor-not-allowed select-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-bold text-xs italic bg-blue-50/5">
                    Tính tự động...
                  </td>
                </tr>

                {/* NGÂN SÁCH ĐỊA PHƯƠNG Level 1 */}
                <tr className="bg-slate-50/25 text-slate-800 font-bold">
                  <td className="px-4 py-4 border-r border-slate-150 text-center font-mono text-slate-800">II</td>
                  <td className="px-6 py-4 border-r border-slate-150 uppercase text-slate-800 font-black tracking-wide">NGÂN SÁCH ĐỊA PHƯƠNG</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.ii.plan.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.ii.first.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.ii.second.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center bg-slate-50/10 text-slate-800 font-bold">{computedTable07.ii.total.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 text-center text-blue-600 font-bold bg-blue-50/10">
                    {computedTable07.ii.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* Cấp Tỉnh Level 2 */}
                <tr className="hover:bg-slate-50/35 transition-colors">
                  <td className="px-4 py-3 border-r border-slate-150 text-center font-mono text-slate-400">1</td>
                  <td className="px-6 py-3 border-r border-slate-150 text-slate-700 pl-10 font-bold">Cấp Tỉnh</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.ii1_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('ii1_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'ii1_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.ii1_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('ii1_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'ii1_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.ii1_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('ii1_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'ii1_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={(resourceRows07.ii1_first + resourceRows07.ii1_second).toLocaleString('vi-VN')}
                      placeholder="Tính tự động..."
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-bold bg-slate-50 text-slate-550 cursor-not-allowed select-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-bold text-xs italic bg-blue-50/5">
                    Tính tự động...
                  </td>
                </tr>

                {/* Cấp Xã Level 2 */}
                <tr className="hover:bg-slate-50/35 transition-colors">
                  <td className="px-4 py-3 border-r border-slate-150 text-center font-mono text-slate-400">2</td>
                  <td className="px-6 py-3 border-r border-slate-150 text-slate-700 pl-10 font-bold">Cấp Xã</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.ii2_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('ii2_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'ii2_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.ii2_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('ii2_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-355 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'ii2_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.ii2_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('ii2_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-355 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'ii2_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={(resourceRows07.ii2_first + resourceRows07.ii2_second).toLocaleString('vi-VN')}
                      placeholder="Tính tự động..."
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-bold bg-slate-50 text-slate-550 cursor-not-allowed select-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-bold text-xs italic bg-blue-50/5">
                    Tính tự động...
                  </td>
                </tr>

                {/* VỐN LỒNG GHÉP Level 1 */}
                <tr className="bg-slate-50/15 border-slate-150 font-bold">
                  <td className="px-4 py-3.5 border-r border-slate-150 text-center font-mono text-slate-800">III</td>
                  <td className="px-6 py-3.5 border-r border-slate-150 uppercase text-slate-800 font-black">VỐN LỒNG GHÉP</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.iii_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('iii_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'iii_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.iii_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('iii_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'iii_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.iii_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('iii_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'iii_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={computedTable07.iii.total.toLocaleString('vi-VN')}
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-extrabold bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center text-blue-600 font-extrabold bg-blue-50/10">
                    {computedTable07.iii.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* VỐN TÍN DỤNG CHÍNH SÁCH Level 1 */}
                <tr className="bg-slate-50/15 border-slate-150 font-bold">
                  <td className="px-4 py-3.5 border-r border-slate-150 text-center font-mono text-slate-800">IV</td>
                  <td className="px-6 py-3.5 border-r border-slate-150 uppercase text-slate-800 font-black">VỐN TÍN DỤNG CHÍNH SÁCH</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.iv_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('iv_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'iv_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.iv_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('iv_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'iv_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.iv_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('iv_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'iv_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={computedTable07.iv.total.toLocaleString('vi-VN')}
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-extrabold bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center text-blue-600 font-extrabold bg-blue-50/10">
                    {computedTable07.iv.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* VỐN DOANH NGHIỆP Level 1 */}
                <tr className="bg-slate-50/15 border-slate-150 font-bold">
                  <td className="px-4 py-3.5 border-r border-slate-150 text-center font-mono text-slate-800">V</td>
                  <td className="px-6 py-3.5 border-r border-slate-150 uppercase text-slate-800 font-black">VỐN DOANH NGHIỆP</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.v_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('v_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'v_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.v_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('v_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'v_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.v_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('v_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg font-bold bg-white text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${cellFlashes[flashPrefix + 'v_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={computedTable07.v.total.toLocaleString('vi-VN')}
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-extrabold bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center text-blue-600 font-extrabold bg-blue-50/10">
                    {computedTable07.v.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* HUY ĐỘNG TỪ CỘNG ĐỒNG VÀ NGƯỜI DÂN Level 1 */}
                <tr className="bg-slate-50/25 text-slate-805 font-bold">
                  <td className="px-4 py-4 border-r border-slate-150 text-center font-mono text-slate-800">VI</td>
                  <td className="px-6 py-4 border-r border-slate-150 uppercase text-slate-805 font-black tracking-wide">HUY ĐỘNG TỪ CỘNG ĐỒNG VÀ NGƯỜI DÂN</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.vi.plan.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.vi.first.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center text-slate-800 font-bold">{computedTable07.vi.second.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 border-r border-slate-150 text-center bg-slate-50/10 text-slate-800 font-bold">{computedTable07.vi.total.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4 text-center text-blue-600 font-bold bg-blue-50/10">
                    {computedTable07.vi.percent.toFixed(1)}%
                  </td>
                </tr>

                {/* Tiền mặt Level 2 */}
                <tr className="hover:bg-slate-50/35 transition-colors">
                  <td className="px-4 py-3 border-r border-slate-150 text-center font-mono text-slate-400">1</td>
                  <td className="px-6 py-3 border-r border-slate-150 text-slate-700 pl-10 font-bold">Tiền mặt</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.vi1_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('vi1_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'vi1_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.vi1_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('vi1_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'vi1_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.vi1_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('vi1_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'vi1_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={(resourceRows07.vi1_first + resourceRows07.vi1_second).toLocaleString('vi-VN')}
                      placeholder="Tính tự động..."
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-bold bg-slate-50 text-slate-550 cursor-not-allowed select-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-bold text-xs italic bg-blue-50/5">
                    Tính tự động...
                  </td>
                </tr>

                {/* Ngày công và hiện vật quy đổi Level 2 */}
                <tr className="hover:bg-slate-50/35 transition-colors text-slate-705">
                  <td className="px-4 py-3 border-r border-slate-150 text-center font-mono text-slate-400">2</td>
                  <td className="px-6 py-3 border-r border-slate-150 text-slate-700 pl-10 font-bold">Ngày công và hiện vật quy đổi</td>

                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.vi2_plan}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('vi2_plan', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'vi2_plan'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.vi2_first}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('vi2_first', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'vi2_first'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="number"
                      value={resourceRows07.vi2_second}
                      disabled={!isDr}
                      onChange={(e) => handleResourceChange('vi2_second', e.target.value)}
                      className={`w-full text-center py-2 border rounded-lg focus:border-blue-500 hover:border-slate-350 font-bold bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${cellFlashes[flashPrefix + 'vi2_second'] ? 'bg-amber-100' : 'border-slate-200'
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-150">
                    <input
                      type="text"
                      disabled
                      value={(resourceRows07.vi2_first + resourceRows07.vi2_second).toLocaleString('vi-VN')}
                      placeholder="Tính tự động..."
                      className="w-full text-center py-2 border border-slate-100 rounded-lg font-bold bg-slate-50 text-slate-550 cursor-not-allowed select-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-bold text-xs italic bg-blue-50/5">
                    Tính tự động...
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Table Instructions line matching picture footer */}
          <div className="bg-slate-50/75 p-5 border-t border-slate-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-blue-500 shrink-0" />
              <span>DỮ LIỆU ĐỒNG BỘ CHẶT CHẼ THEO GIAO GIAO CHỈ TIÊU & HOÀN THIỆN KPI</span>
            </span>
          </div>
        </div>

        {/* Dynamic Action Buttons bar exactly matching screen footer */}
        {/* <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={() => {
              setNotifyMessage(`Đã lưu tạm dữ liệu huy động nguồn lực ${form.code === 'Biểu 11' ? 'Mẫu 11' : 'Mẫu 07'} thành công!`);
              setTimeout(() => setNotifyMessage(null), 3000);
            }}
            className="px-5 py-2.5 border border-[#10b981] hover:bg-emerald-50 text-[#10b981] font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer bg-white"
          >
            <Save className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Lưu nháp</span>
          </button>

          <button
            onClick={handleOpenSubmit}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {['Biểu 04', 'Biểu 05', 'Biểu 06', 'Biểu 07', 'Biểu 08', 'Biểu 09'].includes(form.code) && userSession.role === 'APPRAISER'
                ? 'Gửi Bộ tổng hợp'
                : 'Xác nhận hoàn thành'}
            </span>
          </button>
        </div> */}

        {/* Confirmation Signature Modal Overlay */}
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-150 animate-slide-up">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                    <ShieldCheck className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">
                      Xác thực chứng thư số CA
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Ký trực tiếp lên Hệ thống thẩm định tỉnh
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateForm({
                    ...form,
                    status: 'SUBMITTED',
                    editor: digitalSignInput || userSession.fullName,
                    updatedAt: new Date().toISOString(),
                  });
                  setShowConfirmPopup(false);
                  setNotifyMessage(
                    `Nộp báo cáo thành công! Mẫu ${form.code === 'Biểu 11' ? '11' : '07'} đã được Ký số bởi Chuyên viên ${digitalSignInput || userSession.fullName}.`
                  );
                  setTimeout(() => {
                    setNotifyMessage(null);
                    onBack();
                  }, 2500);
                }}
                className="space-y-4 font-sans text-xs"
              >
                <p className="text-slate-500 leading-relaxed font-bold">
                  Mọi hành động đẩy dữ liệu sang Thẩm duyệt đều yêu cầu mã khóa danh tính CA để làm căn cứ pháp lý xử lý liên ngành quốc gia. Vui lòng ghi rõ họ tên thụ lý.
                </p>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                    Họ tên Chuyên viên thụ lý <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Hải..."
                    value={digitalSignInput}
                    onChange={(e) => setDigitalSignInput(e.target.value)}
                    className="w-full text-xs p-3 duration-250 border border-slate-350 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-slate-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPopup(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#014285] hover:bg-[#002a54] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-blue-950/15"
                  >
                    Ký chứng thư
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (form.code === 'Biểu 10') {
    const activeGroup = activeCommune?.group || 'II';
    const resolvedTargetPercent =
      activeGroup === 'I' && activeCriteria.group1Threshold !== undefined ? activeCriteria.group1Threshold
        : activeGroup === 'III' && activeCriteria.group3Threshold !== undefined ? activeCriteria.group3Threshold
          : activeGroup === 'II' && activeCriteria.group2Threshold !== undefined ? activeCriteria.group2Threshold
            : activeCriteria.targetPercent ?? 0;

    return (
      <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-12">
        {/* Toast alert */}
        {notifyMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
            <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb pathing */}
        <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 flex-wrap uppercase tracking-wider">
          <button onClick={onBackToPeriods || onBack} className="hover:text-amber-500 cursor-pointer transition-colors">
            Đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBack} className="hover:text-amber-500 cursor-pointer transition-colors">
            Chi tiết đợt báo cáo
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#014285] font-black">Báo cáo Mẫu 10</span>
        </div>

        {/* Primary Screen Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4">
          <div>
            <h1 className="text-xl font-black text-[#0f2942] tracking-tight flex items-center gap-2">
              <span>Báo cáo chi tiết Nông thôn mới</span>
              <span className="text-xs uppercase font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 ml-2">
                Biểu 10
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-1 max-w-2xl leading-relaxed">
              Cập nhật tiến độ thực hiện 47 tiêu chí quốc gia về nông thôn mới giai đoạn 2026-2030. Vui lòng đính kèm các văn bản pháp lý minh chứng.
            </p>

            {/* Active Commune Badge/Selector Banner */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3 bg-blue-50/50 border border-blue-100 rounded-xl px-3.5 py-2 w-fit">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs font-bold text-slate-600">Đơn vị báo cáo:</span>
              {userSession.role === 'EDITOR' && onSetActiveCommuneId ? (
                <select
                  value={activeCommuneId}
                  onChange={(e) => {
                    onSetActiveCommuneId(e.target.value);
                    const com = communes.find(c => c.id === e.target.value);
                    if (com) {
                      setNotifyMessage(`Đã chuyển đơn vị báo cáo mô phỏng sang: ${com.name} (Nhóm ${com.group || 'I'})`);
                      setTimeout(() => setNotifyMessage(null), 3000);
                    }
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-black text-[#014285] outline-none transition-all cursor-pointer font-sans"
                >
                  {communes.map((com) => (
                    <option key={com.id} value={com.id}>
                      {com.name} (Nhóm {com.group || 'I'})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-black text-[#014285]">
                  {activeCommune?.name} ({activeCommune?.province})
                </span>
              )}
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold text-slate-500">Phân vùng:</span>
              {activeCommune?.group === 'I' && (
                <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded border border-blue-200">
                  Nhóm I - Đồng bằng
                </span>
              )}
              {activeCommune?.group === 'II' && (
                <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded border border-amber-200">
                  Nhóm II - Cận du biên
                </span>
              )}
              {activeCommune?.group === 'III' && (
                <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-black rounded border border-purple-200">
                  Nhóm III - Đặc biệt khó khăn
                </span>
              )}
            </div>
          </div>

          {/* <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => {
                localStorage.setItem(`NôngThônMới_Biểu10_TiêuChí`, JSON.stringify(criteriaList));
                setNotifyMessage('Đã lưu tạm tiến hành biểu 10 thành công!');
                setTimeout(() => setNotifyMessage(null), 3000);
              }}
              className="px-5 py-2.5 border border-[#10b981] hover:bg-emerald-50 text-[#10b981] font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer bg-white"
            >
              <Save className="w-4 h-4 text-[#10b981]" />
              <span>Lưu tạm</span>
            </button>

            <button
              onClick={() => {
                setShowConfirmPopup(true);
              }}
              className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10"
            >
              <Send className="w-4 h-4" />
              <span>Gửi báo cáo</span>
            </button>
          </div> */}
        </div>

        {/* TIẾN ĐỘ TỔNG THỂ card matching reference exactly */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.015)] space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-0.5">Tiến độ tổng thể</span>
              <h2 className="text-xl font-black text-[#0f2942] tracking-normal">
                <span className="text-[#2563eb]">{countApproved}/47</span> Tiêu chí hoàn thành
              </h2>
            </div>
            <div className="text-3xl font-black text-lime-600 font-sans tracking-tight leading-none">
              {percentProgress}%
            </div>
          </div>

          {/* Combined Progress bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-[#10b981] h-full" style={{ width: `${(countApproved / 47) * 100}%` }} />
            <div className="bg-[#f59e0b] h-full" style={{ width: `${(countPending / 47) * 100}%` }} />
            <div className="bg-slate-350 h-full" style={{ width: `${(countNotMet / 47) * 100}%` }} />
          </div>

          {/* Legends row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500 pt-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span>Đạt tiêu chí ({countApproved})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span>Đang hoàn thiện ({countPending})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>Chưa đạt ({countNotMet})</span>
            </div>
          </div>
        </div>

        {/* Two-Column split workspace block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Danh sách tiêu chí */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[640px]">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3 shrink-0">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#2563eb] rounded-full" />
                <span>Danh sách tiêu chí</span>
              </h3>

              {/* Filter toggler drawer icon button */}
              <div className="relative">
                <button
                  onClick={() => {
                    const next: Record<'ALL' | 'COMPLETED' | 'PENDING' | 'NOT_MET', 'ALL' | 'COMPLETED' | 'PENDING' | 'NOT_MET'> = {
                      'ALL': 'COMPLETED',
                      'COMPLETED': 'PENDING',
                      'PENDING': 'NOT_MET',
                      'NOT_MET': 'ALL'
                    };
                    setShowCriteriaFilter(next[showCriteriaFilter]);
                    setNotifyMessage(`Đang lọc: ${next[showCriteriaFilter] === 'ALL' ? 'Tất cả' : next[showCriteriaFilter] === 'COMPLETED' ? 'Đã đạt' : next[showCriteriaFilter] === 'PENDING' ? 'Đang hoàn thiện' : 'Chưa đạt'}`);
                    setTimeout(() => setNotifyMessage(null), 2500);
                  }}
                  className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#2563eb] transition-all cursor-pointer border border-transparent hover:border-slate-200 flex items-center gap-1"
                  title="Lọc tiêu chí"
                >
                  <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                    {showCriteriaFilter === 'ALL' ? 'Tất cả' : showCriteriaFilter === 'COMPLETED' ? 'Đạt' : showCriteriaFilter === 'PENDING' ? 'Đang xử lý' : 'Chưa đạt'}
                  </span>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick search inside scrollable list */}
            <div className="relative mb-3 shrink-0">
              <input
                type="text"
                value={criteriaSearch}
                onChange={(e) => setCriteriaSearch(e.target.value)}
                placeholder="Tìm nội dung chỉ bạo..."
                className="w-full text-xs p-2.5 pl-8.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold placeholder:text-slate-400 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {criteriaSearch && (
                <button
                  onClick={() => setCriteriaSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Main criteria indicator bento lists */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredCriteria.length === 0 ? (
                <div className="py-12 text-center text-slate-450 text-xs font-semibold">
                  Không tìm thấy tiêu chí phù hợp
                </div>
              ) : (
                filteredCriteria.map((c) => {
                  const isActive = c.id === selectedCriteriaId;

                  let dotBg = 'bg-slate-400';
                  let textTheme = 'text-slate-500';
                  let statusLabel = c.statusText;

                  if (c.isCompleted || c.statusText === 'Đạt' || c.statusText === 'Đã hoàn thiện') {
                    dotBg = 'bg-[#10b981]';
                    textTheme = 'text-[#10b981]';
                    statusLabel = '● Đạt';
                  } else if (c.statusText === 'Đang xử lý dữ liệu' || c.statusText === 'Đang hoàn thiện') {
                    dotBg = 'bg-[#f59e0b]';
                    textTheme = 'text-amber-500';
                    statusLabel = 'Đang xử lý dữ liệu';
                  } else if (c.statusText === 'Chưa đạt') {
                    dotBg = 'bg-rose-500';
                    textTheme = 'text-rose-500';
                    statusLabel = '● Chưa đạt';
                  }

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCriteriaId(c.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex justify-between items-start gap-2.5 ${isActive
                        ? 'bg-blue-50/55 border-blue-500 shadow-sm text-slate-900 ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-150 hover:bg-slate-50/40 text-slate-700'
                        }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[#0f2942] text-xs font-black shrink-0">
                            {c.id}
                          </span>
                          <span className="text-xs text-slate-400 font-extrabold tracking-tight">
                            {c.code}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 leading-tight mt-1.5 block truncate">
                          {c.title}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-xs font-bold ${textTheme}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform mt-0.5 ${isActive ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom count selector line matching reference footer */}
            <div className="pt-3 border-t border-slate-100 text-center shrink-0">
              <button
                onClick={() => {
                  setCriteriaSearch('');
                  setShowCriteriaFilter('ALL');
                  setNotifyMessage('Đã đặt hiển thị tất cả 47 tiêu chí.');
                  setTimeout(() => setNotifyMessage(null), 2500);
                }}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
              >
                ... Xem tiếp 42 tiêu chí khác
              </button>
            </div>
          </div>

          {/* Right Column: Chi tiết Tiêu chí */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Dark banner card header */}
            <div className="bg-[#002a54] rounded-2xl overflow-hidden shadow-md border border-slate-850">
              <div className="p-5 flex justify-between items-center bg-gradient-to-r from-[#002a54] to-[#014285] relative">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Chi tiết {activeCriteria.title}
                  </h3>
                  <p className="text-xs text-[#bfdbfe] font-semibold mt-1">
                    {activeCriteria.subTitle}
                  </p>
                </div>

                <Award className="w-8 h-8 text-amber-500 opacity-30 absolute right-5" />
              </div>

              {/* Form editing pane inside Right Column */}
              <div className="p-6 bg-white space-y-5">

                {/* Tỉ lệ phần trăm (Tử số / Mẫu số) nếu là tiêu chí tỷ lệ */}
                {activeCriteria.isRateType && (
                  <div className="bg-slate-50/75 p-4.5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#0f2942] uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-3.5 bg-blue-500 rounded-full" />
                        Thông số tỷ lệ đạt tiêu chí
                      </span>
                      <span className="text-xs uppercase font-black bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100">
                        Mục tiêu (Nhóm {activeGroup}): ≥ {resolvedTargetPercent}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          {activeCriteria.numeratorLabel || "Tử số (Số lượng đạt)"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={activeCriteria.numerator ?? 0}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              handleRateCriteriaChange(activeCriteria.id, 'numerator', val);
                            }}
                            className="w-full text-xs p-3.5 border border-slate-250 hover:border-slate-355 rounded-xl outline-none font-bold text-slate-800 bg-white"
                          />
                          {activeCriteria.unit && (
                            <span className="text-xs text-slate-400 font-bold absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 select-none">
                              {activeCriteria.unit}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          {activeCriteria.denominatorLabel || "Mẫu số (Tổng số)"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={activeCriteria.denominator ?? 100}
                            onChange={(e) => {
                              const val = Math.max(1, parseFloat(e.target.value) || 1);
                              handleRateCriteriaChange(activeCriteria.id, 'denominator', val);
                            }}
                            className="w-full text-xs p-3.5 border border-slate-250 hover:border-slate-355 rounded-xl outline-none font-bold text-slate-800 bg-white"
                          />
                          {activeCriteria.unit && (
                            <span className="text-xs text-slate-400 font-bold absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 select-none">
                              {activeCriteria.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Calculated result display */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-450 font-bold block">Tỷ lệ tính toán thực tế</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-black text-slate-850">
                            {((activeCriteria.numerator ?? 0) / (activeCriteria.denominator ?? 100) * 100).toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-400 font-bold">
                            ({activeCriteria.numerator ?? 0} / {activeCriteria.denominator ?? 100} {activeCriteria.unit || ''})
                          </span>
                        </div>
                      </div>
                      <div>
                        {((activeCriteria.numerator ?? 0) / (activeCriteria.denominator ?? 100) * 100) >= resolvedTargetPercent ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đạt mục tiêu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 font-black text-xs rounded-xl border border-rose-200 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Chưa đạt mục tiêu
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Warning if no proof document is uploaded for a rate criterion */}
                    {(activeCriteria?.proofFiles || []).length === 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-amber-800 font-bold leading-relaxed">
                          Lưu ý: Tiêu chí tỷ lệ bắt buộc phải đính kèm ít nhất một minh chứng (PDF/Scan) làm cơ sở pháp lý.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Trạng thái tiêu chí */}
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wide">
                    Trạng thái tiêu chí {activeCriteria.isRateType && "(Tự động cập nhật)"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                    {/* Select Đạt chuẩn */}
                    <div
                      onClick={() => {
                        if (activeCriteria.isRateType) return;
                        setCriteriaList((prev) =>
                          prev.map((c) =>
                            c.id === selectedCriteriaId
                              ? { ...c, isCompleted: true, statusText: 'Đạt' }
                              : c
                          )
                        );
                      }}
                      className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all ${activeCriteria.isCompleted
                        ? 'bg-blue-50/50 border-[#2563eb] text-blue-900 ring-2 ring-blue-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-500'
                        } ${activeCriteria.isRateType ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                    >
                      <CheckCircle className={`w-5 h-5 shrink-0 ${activeCriteria.isCompleted ? 'text-[#2563eb]' : 'text-slate-350'}`} />
                      <div className="text-xs font-black">
                        Đạt chuẩn {activeCriteria.isRateType && " (Tỷ lệ)"}
                      </div>
                    </div>

                    {/* Select Chưa đạt */}
                    <div
                      onClick={() => {
                        if (activeCriteria.isRateType) return;
                        setCriteriaList((prev) =>
                          prev.map((c) =>
                            c.id === selectedCriteriaId
                              ? { ...c, isCompleted: false, statusText: 'Chưa đạt' }
                              : c
                          )
                        );
                      }}
                      className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all ${!activeCriteria.isCompleted
                        ? 'bg-slate-50 border-slate-650 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-500'
                        } ${activeCriteria.isRateType ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                    >
                      <Info className={`w-5 h-5 shrink-0 ${!activeCriteria.isCompleted ? 'text-slate-600' : 'text-slate-350'}`} />
                      <div className="text-xs font-black">
                        Chưa đạt {activeCriteria.isRateType && " (Tỷ lệ)"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Số quyết định & Ngày phê duyệt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                      Số quyết định phê duyệt
                    </label>
                    <input
                      type="text"
                      value={activeCriteria.decisionNo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCriteriaList((prev) =>
                          prev.map((c) =>
                            c.id === selectedCriteriaId ? { ...c, decisionNo: val } : c
                          )
                        );
                      }}
                      placeholder="Nhập số quyết định, ví dụ: 1245/QĐ-UBND..."
                      className="w-full text-xs p-3.5 border border-slate-250 hover:border-slate-355 rounded-xl outline-none font-bold text-slate-800 bg-slate-50/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                      Ngày phê duyệt
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={activeCriteria.decisionDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCriteriaList((prev) =>
                            prev.map((c) =>
                              c.id === selectedCriteriaId ? { ...c, decisionDate: val } : c
                            )
                          );
                        }}
                        className="w-full text-xs p-3.5 bg-slate-50/30 border border-slate-250 hover:border-slate-355 rounded-xl outline-none font-bold text-slate-800 appearance-none pr-10"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Hồ sơ đính kèm */}
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wide">
                    Hồ sơ đính kèm (PDF/Scan)
                  </label>

                  {/* Drag drop slot wrapper clicks */}
                  <div
                    onClick={() => {
                      const fileEl = document.getElementById('biểu-10-proof-select');
                      if (fileEl) fileEl.click();
                    }}
                    className="p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#2563eb] hover:bg-slate-50/50 transition-all cursor-pointer text-center group flex flex-col items-center justify-center"
                  >
                    <input
                      type="file"
                      id="biểu-10-proof-select"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const f = e.target.files[0];
                          const customDoc = {
                            name: f.name,
                            size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
                          };
                          setCriteriaList((prev) =>
                            prev.map((c) =>
                              c.id === selectedCriteriaId
                                ? { ...c, proofFiles: [...(c.proofFiles || []), customDoc] }
                                : c
                            )
                          );
                          setNotifyMessage(`Đã đính kèm tệp ${f.name} thành công.`);
                          setTimeout(() => setNotifyMessage(null), 3000);
                        }
                      }}
                    />
                    <div className="p-3 bg-blue-50 text-[#2563eb] rounded-xl mb-3 group-hover:bg-[#2563eb] group-hover:text-white transition-all duration-300">
                      <Upload className="w-5.5 h-5.5" />
                    </div>
                    <h4 className="text-xs font-black text-[#0f2942]">Kéo và thả tệp vào đây</h4>
                    <p className="text-xs text-slate-450 font-bold mt-1.5 leading-normal max-w-sm mx-auto">
                      Hoặc nhấn để chọn từ máy tính. Định dạng hỗ trợ: PDF, JPG (Tối đa 20MB)
                    </p>
                  </div>

                  {/* List of uploaded files under the current active criteria */}
                  {(activeCriteria?.proofFiles || []).length > 0 && (
                    <div className="mt-3.5 space-y-2.5">
                      {(activeCriteria?.proofFiles || []).map((fileObj, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-150 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-500 rounded-lg shrink-0">
                              <File className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-black text-slate-800 block truncate max-w-[240px]">
                                {fileObj.name}
                              </span>
                              <span className="text-xs text-slate-400 font-extrabold block uppercase mt-0.5">
                                {fileObj.size} &bull; Đã tải lên
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCriteriaList((prev) =>
                                prev.map((c) =>
                                  c.id === selectedCriteriaId
                                    ? {
                                      ...c,
                                      proofFiles: (c.proofFiles || []).filter(
                                        (item) => item.name !== fileObj.name
                                      ),
                                    }
                                    : c
                                )
                              );
                            }}
                            className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
                            title="Xóa tệp"
                          >
                            <X className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ghi chú / Giải trình */}
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                    Ghi chú / Giải trình (Nếu có)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập tóm tắt nội dung quy hoạch hoặc giải trình các chỉ tiêu chưa đạt..."
                    value={activeCriteria.note}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCriteriaList((prev) =>
                        prev.map((c) =>
                          c.id === selectedCriteriaId ? { ...c, note: val } : c
                        )
                      );
                    }}
                    className="w-full text-xs p-3.5 bg-slate-50/20 hover:bg-slate-50/50 focus:bg-white border border-slate-250 focus:border-slate-500 rounded-xl outline-none font-bold text-slate-800 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Bottom detail action links */}
                <div className="flex justify-end items-center gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => {
                      setCriteriaList(INITIAL_CRITERIA_10);
                      setNotifyMessage('Đã đặt lại dữ liệu rà soát nháp.');
                      setTimeout(() => setNotifyMessage(null), 3500);
                    }}
                    className="px-4.5 py-2.5 text-slate-400 hover:text-slate-600 font-extrabold text-xs uppercase cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem(
                        `NôngThônMới_Biểu10_TiêuChí`,
                        JSON.stringify(criteriaList)
                      );
                      setNotifyMessage(`Lưu cập nhật thành công tiêu chí [${activeCriteria.title}]!`);
                      setTimeout(() => setNotifyMessage(null), 3000);
                    }}
                    className="px-6 py-2.5 bg-[#014285] hover:bg-[#002a54] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Lưu cập nhật
                  </button>
                </div>
              </div>
            </div>

            {/* Directive instruction alert box underneath details banner */}
            <div className="bg-[#f0fdf4] border border-emerald-250/80 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-[#dcfce7] text-[#10b981] rounded-xl shrink-0 mt-0.5 border border-emerald-150">
                <HelpCircle className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                  Hướng dẫn thực hiện Tiêu chí {selectedCriteriaId}
                </h4>
                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                  {activeCriteria.guidelines}
                </p>
                <div className="pt-1 select-none">
                  <a
                    href="#docs"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onViewGuideDoc) {
                        onViewGuideDoc(activeCriteria.guideDoc);
                      } else {
                        setNotifyMessage(
                          `Xử lý tải tệp ${activeCriteria.guideDoc} hướng dẫn tiêu chí từ ban ngành...`
                        );
                        setTimeout(() => setNotifyMessage(null), 3000);
                      }
                    }}
                    className="text-xs font-black text-[#10b981] hover:underline flex items-center gap-1.5 cursor-pointer inline-flex"
                  >
                    <span>Xem văn bản hướng dẫn {activeCriteria.guideDoc}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Signature Modal Overlay */}
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-150 animate-slide-up">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/10">
                    <ShieldCheck className="w-5.5 h-5.5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">
                      Xác thực chứng thư số CA
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Gửi trực tiếp lên Hệ thống thẩm định tỉnh
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateForm({
                    ...form,
                    status: 'SUBMITTED',
                    editor: digitalSignInput || userSession.fullName,
                    updatedAt: new Date().toISOString(),
                  });
                  setShowConfirmPopup(false);
                  setNotifyMessage(
                    `Nộp báo cáo thành công! Biều mẫu đã được Ký số bởi Chuyên viên ${digitalSignInput || userSession.fullName}.`
                  );
                  setTimeout(() => {
                    setNotifyMessage(null);
                    onBack();
                  }, 2500);
                }}
                className="space-y-4 font-sans text-xs"
              >
                <p className="text-slate-500 leading-relaxed font-bold">
                  Mọi hành động đẩy dữ liệu sang Thẩm duyệt đều yêu cầu mã khóa danh tính CA để làm căn cứ pháp lý xử lý liên ngành quốc gia. Vui lòng ghi rõ họ tên thụ lý.
                </p>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                    Họ tên Chuyên viên thụ lý <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Hùng..."
                    value={digitalSignInput}
                    onChange={(e) => setDigitalSignInput(e.target.value)}
                    className="w-full text-xs p-3 duration-250 border border-slate-350 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-slate-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPopup(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-slate-950/15"
                  >
                    Ký chứng thư
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 font-sans pb-12">
      {/* Toast alert */}
      {notifyMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.3)] flex items-center gap-3.5 z-50 max-w-md transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold leading-relaxed">{notifyMessage}</span>
          <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigator headers and back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-black text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <span>&larr; Quay lại đợt rà soát</span>
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/50">
          Đồng bộ lần cuối: <strong className="text-slate-600 font-black">{new Date(form.updatedAt).toLocaleString('vi-VN')}</strong>
        </span>
      </div>

      {/* Main core information sheet */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col md:flex-row justify-between items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <FileText className="w-40 h-40 text-amber-500 rotate-12" />
        </div>
        <div className="relative z-10 flex-1">
          <span className="inline-block px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-lg uppercase tracking-widest mb-3 border border-slate-800">
            {form.code}
          </span>
          <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
            {form.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-4xl leading-relaxed font-bold">
            Bộ chỉ huy văn bản rà soát chi tiết chỉ số. Đối chiếu cơ chế nhóm vùng và tính đặc trưng địa chính trị quy hoạch đồng bộ Nông thôn mới Quốc gia.
          </p>
        </div>

        {/* Dynamic status tags and badges */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Tiến trình rà soát</span>
          {form.status === 'DRAFT' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-150">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">Mở khóa biên soạn (Xã)</span>
            </div>
          )}
          {form.status === 'SUBMITTED' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/60 shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider">Thư ký đã nộp &bull; Chờ Thẩm định</span>
            </div>
          )}
          {form.status === 'APPROVED' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-black uppercase tracking-wider">Hội đồng phê duyệt &bull; Chờ Giám sát</span>
            </div>
          )}
          {form.status === 'SUPERVISED' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200/60 shadow-md">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-black uppercase tracking-wider">Mặt trận tổ quốc hoàn tất giám sát</span>
            </div>
          )}
        </div>
      </div>

      {/* Criteria Table editor sheet */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Bảng số liệu tổng hợp đa cơ sở dữ liệu chi tiết chỉ số</span>
          <span className="text-xs text-amber-600 bg-amber-100/50 px-2.5 py-1 rounded-full border border-amber-500/10 uppercase tracking-wider font-extrabold">Đơn vị: Đạt chuẩn quốc gia</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[1240px]">
            <thead>
              {/* Row 1 Headers */}
              <tr className="bg-slate-50/40 text-slate-800 text-xs font-black border-b border-slate-100">
                <th className="px-3 py-4 border-r border-slate-100 text-center w-12 bg-slate-50/40" rowSpan={2}>TT</th>
                <th className="px-6 py-4 border-r border-slate-100 min-w-[320px] bg-slate-50/40" rowSpan={2}>Nội dung danh mục bộ tiêu chí phụ biểu</th>
                <th className="px-4 py-4 border-r border-slate-100 text-center w-20 bg-slate-50/40" rowSpan={2}>ĐVT</th>
                <th className="px-4 py-3.5 border-r border-slate-100 text-center bg-indigo-500/5 text-indigo-900 border-b border-indigo-500/10" colSpan={3}>Hạ tầng Đô thị (Xã Nhóm 1)</th>
                <th className="px-4 py-3.5 border-r border-slate-100 text-center bg-amber-500/5 text-amber-900 border-b border-amber-500/10" colSpan={3}>Cận Đô thị (Xã Nhóm 2)</th>
                <th className="px-4 py-3.5 border-r border-slate-100 text-center bg-emerald-500/5 text-emerald-900 border-b border-emerald-500/10" colSpan={3}>Biên giới đặc thù (Xã Nhóm 3)</th>
                <th className="px-6 py-4 bg-slate-50/40" rowSpan={2}>Ghi chú thụ lý</th>
              </tr>
              {/* Row 2 Headers */}
              <tr className="bg-slate-50/20 text-xs text-slate-400 font-extrabold uppercase tracking-widest text-center border-b border-slate-100">
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-indigo-50/10">Năm trước</th>
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-indigo-50/20 text-indigo-700">Kỳ này</th>
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-indigo-50/10">Kế hoạch</th>

                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-amber-50/10">Năm trước</th>
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-amber-50/20 text-amber-700">Kỳ này</th>
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-amber-50/10">Kế hoạch</th>

                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-emerald-50/10">Năm trước</th>
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-emerald-50/20 text-emerald-700">Kỳ này</th>
                <th className="px-2 py-3 border-r border-slate-100 w-24 bg-emerald-50/10">Kế hoạch</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {form.data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* TT */}
                  <td className="px-3 py-4 text-center border-r border-slate-100 font-mono text-slate-400 font-bold">
                    {row.id}
                  </td>
                  {/* Category */}
                  <td className="px-6 py-4 border-r border-slate-100 font-bold text-slate-800 text-xs">
                    {row.category}
                  </td>
                  {/* Unit */}
                  <td className="px-4 py-4 text-center border-r border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-xs">
                    {row.unit}
                  </td>

                  {/* Group 1 editing fields */}
                  <td className="p-1.5 border-r border-slate-100 text-center">
                    <input
                      type="number"
                      value={row.group1.prevYear}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group1', 'prevYear', e.target.value)}
                      className={`w-full bg-slate-50/30 hover:bg-slate-50 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-slate-200 rounded-xl outline-none font-bold text-slate-800 transition-all ${cellFlashes[`${row.id}-group1-prevYear`] ? 'bg-amber-100 font-black' : ''
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center bg-indigo-50/10">
                    <input
                      type="number"
                      value={row.group1.currentS1}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group1', 'currentS1', e.target.value)}
                      className={`w-full bg-indigo-50/30 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-indigo-200 rounded-xl outline-none font-black text-indigo-700 transition-all ${cellFlashes[`${row.id}-group1-currentS1`] ? 'bg-indigo-200' : ''
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center">
                    <input
                      type="number"
                      value={row.group1.planS2}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group1', 'planS2', e.target.value)}
                      className={`w-full bg-slate-50/30 hover:bg-slate-50 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-slate-200 rounded-xl outline-none font-bold text-slate-500 transition-all ${cellFlashes[`${row.id}-group1-planS2`] ? 'bg-indigo-100' : ''
                        }`}
                    />
                  </td>

                  {/* Group 2 editing fields */}
                  <td className="p-1.5 border-r border-slate-100 text-center">
                    <input
                      type="number"
                      value={row.group2.prevYear}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group2', 'prevYear', e.target.value)}
                      className={`w-full bg-slate-50/30 hover:bg-slate-50 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-slate-200 rounded-xl outline-none font-bold text-slate-800 transition-all ${cellFlashes[`${row.id}-group2-prevYear`] ? 'bg-amber-100 font-black' : ''
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center bg-amber-50/10">
                    <input
                      type="number"
                      value={row.group2.currentS1}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group2', 'currentS1', e.target.value)}
                      className={`w-full bg-amber-50/30 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-amber-500 rounded-xl outline-none font-black text-amber-700 transition-all ${cellFlashes[`${row.id}-group2-currentS1`] ? 'bg-amber-100' : ''
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center">
                    <input
                      type="number"
                      value={row.group2.planS2}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group2', 'planS2', e.target.value)}
                      className={`w-full bg-slate-50/30 hover:bg-slate-50 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-slate-200 rounded-xl outline-none font-bold text-slate-500 transition-all ${cellFlashes[`${row.id}-group2-planS2`] ? 'bg-indigo-100' : ''
                        }`}
                    />
                  </td>

                  {/* Group 3 editing fields */}
                  <td className="p-1.5 border-r border-slate-100 text-center">
                    <input
                      type="number"
                      value={row.group3.prevYear}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group3', 'prevYear', e.target.value)}
                      className={`w-full bg-slate-50/30 hover:bg-slate-50 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-slate-200 rounded-xl outline-none font-bold text-slate-800 transition-all ${cellFlashes[`${row.id}-group3-prevYear`] ? 'bg-amber-100 font-black' : ''
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center bg-emerald-50/10">
                    <input
                      type="number"
                      value={row.group3.currentS1}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group3', 'currentS1', e.target.value)}
                      className={`w-full bg-emerald-50/30 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-emerald-500 rounded-xl outline-none font-black text-emerald-700 transition-all ${cellFlashes[`${row.id}-group3-currentS1`] ? 'bg-emerald-100' : ''
                        }`}
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center">
                    <input
                      type="number"
                      value={row.group3.planS2}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleInputChange(row.id, 'group3', 'planS2', e.target.value)}
                      className={`w-full bg-slate-50/30 hover:bg-slate-50 focus:bg-white text-center py-2.5 px-1 border border-transparent focus:border-slate-200 rounded-xl outline-none font-bold text-slate-500 transition-all ${cellFlashes[`${row.id}-group3-planS2`] ? 'bg-indigo-100' : ''
                        }`}
                    />
                  </td>

                  {/* Notes */}
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="Nhập ghi chú mục riêng biệt..."
                      value={row.note}
                      disabled={form.status !== 'DRAFT'}
                      onChange={(e) => handleNoteChange(row.id, e.target.value)}
                      className="w-full bg-slate-50/50 focus:bg-white font-semibold text-slate-600 italic py-2 px-3 focus:ring-1 focus:ring-amber-500/20 border border-transparent focus:border-slate-200 rounded-xl text-xs outline-none transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Table Sum footer */}
            <tfoot>
              <tr className="bg-slate-100/80 border-t border-slate-300 font-extrabold text-slate-800 text-xs">
                <td className="px-6 py-5 text-right border-r border-slate-100 font-black" colSpan={3}>
                  TỔNG CỘNG CHỈ TIÊU TÍCH LŨY
                </td>
                <td className="px-2 py-5 text-center border-r border-slate-100 bg-slate-200/40 text-slate-700 font-black">{columnSums.g1Pre}</td>
                <td className="px-2 py-5 text-center border-r border-slate-100 bg-indigo-50 text-indigo-950 font-black">{columnSums.g1Cur}</td>
                <td className="px-2 py-5 text-center border-r border-slate-100 bg-slate-250/20 text-slate-600 font-black">{columnSums.g1Plan}</td>

                <td className="px-2 py-5 text-center border-r border-slate-100 bg-slate-200/40 text-slate-700 font-black">{columnSums.g2Pre}</td>
                <td className="px-2 py-5 text-center border-r border-slate-100 bg-amber-50 text-amber-950 font-black">{columnSums.g2Cur}</td>
                <td className="px-2 py-5 text-center border-r border-slate-100 bg-slate-250/20 text-slate-600 font-black">{columnSums.g2Plan}</td>

                <td className="px-2 py-5 text-center border-r border-slate-100 bg-slate-200/40 text-slate-700 font-black">{columnSums.g3Pre}</td>
                <td className="px-2 py-5 text-center border-r border-slate-100 bg-emerald-50 text-emerald-950 font-black">{columnSums.g3Cur}</td>
                <td className="px-2 py-5 text-center bg-slate-250/20 text-slate-600 font-black">{columnSums.g3Plan}</td>
                <td className="px-4 py-5 bg-slate-100/50"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Upload files uploader & technical criteria validation panel */}
      {form.status === 'DRAFT' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${dragActive
                ? 'border-amber-500 bg-amber-50/30'
                : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-slate-50/55'
                }`}
            >
              <input
                type="file"
                id="form-uploader"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label htmlFor="form-uploader" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <div className="p-3.5 bg-slate-100 text-slate-400 rounded-2xl mb-3.5 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Upload className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Chọn tài liệu &amp; hồ sơ chứng thực số</h4>
                <p className="text-xs text-slate-450 mt-1.5 max-w-md text-center leading-normal font-bold">
                  Hỗ trợ kéo dữ liệu bảng tính PDF/XLSX nộp trực tiếp. Giới hạn 25MB một tệp. Ký tên xác thực pháp lí.
                </p>
              </label>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-850 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl" />
            <div>
              <span className="text-xs font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest block w-max mb-3">
                Xác thực số CA
              </span>
              <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
                <span>Cơ chế bảo chứng pháp lý</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5 font-bold">
                Mọi biểu mẫu khi đẩy lên đều được ghi dấu vết kiểm duyệt của công chức phụ trách. Đơn vị chuyển sang Thẩm định sẽ bị khóa sửa đổi để bảo vệ sự chính trực của dữ liệu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Proof files list if exist */}
      {(form.proofFiles || []).length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-150/80 shadow-[0_4px_15px_rgba(0,0,0,0.015)]">
          <h4 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <span>Phụ lục minh chứng &amp; Biên bản hiện trường đính kèm</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(form.proofFiles || []).map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-200/50 transition-colors">
                <div className="flex items-center gap-3.5 max-w-[85%]">
                  {file.type === 'xlsx' ? (
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-500/10">
                      <FileSpreadsheet className="w-5 h-5 shrink-0" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-500/10">
                      <File className="w-5 h-5 shrink-0" />
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-xs font-black text-slate-800 block truncate">{file.name}</span>
                    <span className="text-xs text-slate-400 mt-0.5 block font-bold uppercase">
                      {(file.size / 1024 / 1024).toFixed(2)} MB &bull; Ngày tải: {file.uploadedAt}
                    </span>
                  </div>
                </div>
                {form.status === 'DRAFT' && (
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
                    title="Xóa tệp"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Action Segment */}
      {form.status === 'DRAFT' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-6 bg-white rounded-3xl border border-slate-150/80 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span>Mọi chỉnh sửa chỉ số đều được lưu tự động trên trình duyệt.</span>
          </div>

          {/* <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-5 py-3 border border-amber-500 text-amber-600 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-amber-50/50 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4 inline mr-1.5" />
              Lưu bản nháp
            </button>
            <button
              onClick={handleOpenSubmit}
              className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 shadow-md shadow-slate-900/10 hover:shadow-[0_4px_15px_rgba(15,23,42,0.2)] cursor-pointer transition-all"
            >
              <Send className="w-4 h-4 inline mr-1.5 text-amber-500" />
              {['Biểu 04', 'Biểu 05', 'Biểu 06', 'Biểu 07', 'Biểu 08', 'Biểu 09'].includes(form.code) && userSession.role === 'APPRAISER'
                ? 'Gửi Bộ tổng hợp'
                : 'Đánh dấu hoàn thành số liệu'}
            </button>
          </div> */}
        </div>
      )}

      {/* APPRAISAL LOG / PANEL (Biểu mẫu đang SUBMITTED và chờ Thẩm định hoặc hiển thị nhật ký) */}
      {form.status === 'SUBMITTED' && userSession.role === 'APPRAISER' && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-7 rounded-3xl border border-emerald-500/20 shadow-md space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/10">
            <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wider leading-none">HỘI ĐỒNG THẨM ĐỊNH LIÊN NGÀNH QUỐC GIA</h4>
              <p className="text-xs text-emerald-650 mt-1.5 font-bold uppercase tracking-wider">Thẩm tra thực nghiệm nghiệp vụ, đối chiếu văn bản CA</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">Nhận xét của Hội đồng Thẩm định liên ngành</label>
              <textarea
                value={appraisalComment}
                onChange={(e) => setAppraisalComment(e.target.value)}
                placeholder="Ghi rõ ý kiến kiểm toán tính đúng đắn của số liệu, mức độ phản ánh thực tiễn các tiêu chí..."
                rows={3}
                className="w-full text-xs p-3.5 bg-white border border-emerald-205 focus:border-emerald-550 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-800 font-bold placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-1">
              <button
                onClick={() => handleAppraise('REJECTED')}
                className="px-5 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Trả phụ biểu về xã biên soạn lại
              </button>
              <button
                onClick={() => handleAppraise('APPROVED')}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/15 hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                Phê chuẩn &amp; Đạt chuẩn tiêu chí quốc gia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPRAISAL HISTORY INFO (Hiển thị kết quả đã thẩm định) */}
      {form.appraisal && (
        <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-500/15 flex gap-4 items-start shadow-sm">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-500/10">
            <ShieldCheck className="w-6 h-6 shrink-0" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-widest">KẾT QUẢ THẨM ĐỊNH TỈNH:</span>
              <span className="px-3 py-1 bg-emerald-500 text-white font-black rounded-lg text-xs uppercase tracking-wider shadow-sm">
                Chấp thuận đạt chuẩn
              </span>
            </div>
            <p className="text-xs text-slate-700 font-bold italic mt-2.5">“{form.appraisal.comment}”</p>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-extrabold mt-3 border-t border-slate-100 pt-2.5 flex justify-between items-center">
              <span>Đồng Thẩm định viên: <strong className="text-slate-600 font-black">{form.appraisal.appraiserName}</strong></span>
              <span>Thời điểm kiểm soát: {new Date(form.appraisal.updatedAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* SUPERVISION LOG / PANEL (Biểu mẫu đang APPROVED và chờ Giám sát) */}
      {form.status === 'APPROVED' && userSession.role === 'SUPERVISOR' && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 p-7 rounded-3xl border border-indigo-500/20 shadow-md space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-indigo-500/10">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md">
              <Activity className="w-6 h-6 shrink-0 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wider leading-none">VĂN PHÒNG GIÁM SÁT MẶT TRẬN TỔ QUỐC VIỆT NAM</h4>
              <p className="text-xs text-indigo-650 mt-1.5 font-bold uppercase tracking-wider">Thẩm tra công tác minh bạch công khai, đo lường sự hài lòng của Nhân dân</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-xs font-black text-indigo-800 uppercase tracking-wider mb-1.5">Ghi nhận / Lập ý kiến giám sát chính thức</label>
              <textarea
                value={supervisionComment}
                onChange={(e) => setSupervisionComment(e.target.value)}
                placeholder="Phân tích mức độ dân chủ cơ sở, phát hiện nhũng nhiễu lãng phí hoặc khiếu nại chưa xử lý của cử tri..."
                rows={3}
                className="w-full text-xs p-3.5 bg-white border border-indigo-205 focus:border-indigo-550 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-bold placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-xs font-black text-indigo-800 uppercase tracking-wider mb-1.5">Mức độ hoàn thành, tuân thủ</label>
                <select
                  value={complianceLevel}
                  onChange={(e) => setComplianceLevel(e.target.value)}
                  className="w-full text-xs p-3.5 bg-white border border-indigo-200 focus:border-indigo-500 rounded-2xl outline-none font-bold text-indigo-900 shadow-sm"
                >
                  <option value="Xuất sắc">Xuất sắc (Đúng tiến hạn, chính xác)</option>
                  <option value="Đạt yêu cầu">Đạt yêu cầu (Không có khiếu tố)</option>
                  <option value="Cần cải thiện">Cần phê bình cải thiện sâu sắc</option>
                </select>
              </div>

              <button
                onClick={handleSupervise}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/15 hover:shadow-[0_4px_15px_rgba(79,70,229,0.3)] transition-all cursor-pointer"
              >
                Ký đóng dấu Giám sát Quốc gia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPERVISION HISTORY INFO (Hiển thị kết quả đã giám sát) */}
      {form.supervision && (
        <div className="bg-indigo-50/40 p-6 rounded-3xl border border-indigo-500/15 flex gap-4 items-start shadow-sm">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-500/10">
            <Award className="w-6 h-6 shrink-0" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-widest">KẾT LUẬN GIÁM SÁT VIÊN TW:</span>
              <span className="px-3 py-1 bg-indigo-600 text-white font-black rounded-lg text-xs uppercase tracking-wider shadow-sm font-mono">
                TUÂN THỦ: {form.supervision.complianceLevel}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-bold italic mt-2.5">“{form.supervision.comment}”</p>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-extrabold mt-3 border-t border-slate-100 pt-2.5 flex justify-between items-center">
              <span>Đại diện Ban Giám Sát Mặt Trận: <strong className="text-slate-600 font-black">{form.supervision.supervisorName}</strong></span>
              <span>Thời điểm kiểm soát: {new Date(form.supervision.updatedAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Signature Modal Overlay */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 shadow-2xl border border-slate-150/85 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/10 animate-pulse">
                  <ShieldCheck className="w-5.5 h-5.5 text-amber-650" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">Xác thực chứng thư số CA</h4>
                  <p className="text-xs text-slate-400 mt-1">Gửi trực tiếp lên Hệ thống thẩm định tỉnh</p>
                </div>
              </div>
              <button onClick={() => setShowConfirmPopup(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4 font-sans text-xs">
              <p className="text-slate-500 leading-relaxed font-bold">
                Mọi hành động đẩy dữ liệu sang Thẩm duyệt đều yêu cầu mã khóa danh tính CA để làm căn cứ pháp lý xử xử liên ngành quốc gia. Vui lòng ghi rõ họ tên thụ lý.
              </p>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                  Họ tên Chuyên viên thụ lý <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hùng..."
                  value={digitalSignInput}
                  onChange={(e) => setDigitalSignInput(e.target.value)}
                  className="w-full text-xs p-3 duration-250 border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-slate-500 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmPopup(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-slate-950/15"
                >
                  Ký chứng thư &amp; Giao nộp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
