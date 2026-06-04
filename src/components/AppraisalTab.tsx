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
  AlertCircle
} from 'lucide-react';

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
}

export default function AppraisalTab({
  periods,
  onUpdatePeriod,
  userSession
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

        <div className="flex items-center gap-3.5" id="stats-appraisal-block">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 px-5 flex items-center gap-4.5 shadow-sm transition-all hover:border-slate-300">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Folder className="w-5 h-5 fill-amber-100" />
            </div>
            <div className="text-left">
              <span className="text-xs font-extrabold text-[#64748b] tracking-wider uppercase block">
                Chờ thẩm định
              </span>
              <span className="text-lg font-black text-slate-800 leading-tight">
                {stats.pending} hồ sơ
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 px-5 flex items-center gap-4.5 shadow-sm transition-all hover:border-slate-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
            </div>
            <div className="text-left">
              <span className="text-xs font-extrabold text-[#64748b] tracking-wider uppercase block">
                Đã hoàn thành
              </span>
              <span className="text-lg font-black text-slate-800 leading-tight">
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

              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hồ sơ, địa phương..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col text-left gap-1 min-w-[150px]">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Địa phương</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                  }}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Tất cả">Tất cả tỉnh thành</option>
                  <option value="Tỉnh Ninh Bình">Tỉnh Ninh Bình</option>
                  <option value="TP. Hà Nội">TP. Hà Nội</option>
                  <option value="TP. Hải Phòng">TP. Hải Phòng</option>
                  <option value="Tỉnh Quảng Ninh">Tỉnh Quảng Ninh</option>
                  <option value="Tỉnh Lâm Đồng">Tỉnh Lâm Đồng</option>
                </select>
              </div>

              <div className="flex flex-col text-left gap-1 min-w-[160px]">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Nhóm tiêu chí</label>
                <select
                  value={selectedCriteriaGroup}
                  onChange={(e) => setSelectedCriteriaGroup(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Tất cả">Tất cả tiêu chí quốc gia xây dựng NTM</option>
                  <option value="Quy hoạch">Tiêu chí 1: Quy hoạch</option>
                  <option value="Điện">Tiêu chí 4: Điện</option>
                  <option value="Kinh tế">Kinh tế - Xã hội</option>
                </select>
              </div>

              <div className="flex flex-col text-left gap-1 min-w-[140px]">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Trạng thái</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-3.5 py-2.5 rounded-xl cursor-pointer focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Chờ thẩm định">Chờ thẩm định</option>
                  <option value="Đã đạt">Đã hoàn thành</option>
                  <option value="Cần sửa">Yêu cầu bổ sung</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setAlertConfig({ message: 'Đã kích hoạt lọc bộ đệm chỉ số theo tiêu chí mới!', type: 'info' });
                    setIsAlertVisible(true);
                    setTimeout(() => setIsAlertVisible(false), 2000);
                  }}
                  className="bg-[#014285] hover:bg-[#01356b] active:scale-95 text-white p-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer shadow-sm transition-all"
                >
                  <Filter className="w-4 h-4" />
                  <span>Lọc hồ sơ</span>
                </button>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
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
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 border border-amber-200 text-amber-600 tracking-wide uppercase">
                                Chờ duyệt
                              </span>
                            )}
                            {row.status === 'ĐÃ ĐẠT' && (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-600 tracking-wide uppercase">
                                Đã đạt
                              </span>
                            )}
                            {row.status === 'CẦN SỬA' && (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-rose-50 border border-rose-200 text-rose-500 tracking-wide uppercase">
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
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-205">
                          <button
                            onClick={() => setAppraisalTab('tech')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all border-none ${
                              appraisalTab === 'tech'
                                ? 'bg-[#014285] text-white shadow-sm'
                                : 'text-slate-500 bg-transparent hover:text-slate-800'
                            }`}
                          >
                            Kỹ thuật
                          </button>
                          <button
                            onClick={() => setAppraisalTab('finance')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all border-none ${
                              appraisalTab === 'finance'
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
                                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded shrink-0 ${
                                          isDone ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
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
