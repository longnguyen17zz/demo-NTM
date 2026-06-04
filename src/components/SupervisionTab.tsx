import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  MessageSquare, 
  Eye, 
  Check, 
  UserPlus, 
  X, 
  Info,
  Layers,
  Search,
  ChevronRight,
  User,
  ExternalLink,
  Milestone
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TimelineItem {
  id: string;
  title: string;
  time: string;
  date: string;
  description: string;
  status: 'done' | 'pending';
  fileAttached?: string;
  note?: string;
}

export default function SupervisionTab() {
  // Page level states
  const [currentProgress, setCurrentProgress] = useState(75);
  const [legalProcedures, setLegalProcedures] = useState(3);
  const [dossierStatus, setDossierStatus] = useState<'PENDING_CENTRAL' | 'APPROVED_CENTRAL'>('PENDING_CENTRAL');
  
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Chuyên viên kiểm định');
  
  const [stepDetailModal, setStepDetailModal] = useState<{ isOpen: boolean; title: string; desc: string } | null>(null);

  // Initial staff data
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: '1', name: 'Nguyễn Thị Mai', role: 'Trưởng đoàn Thẩm định', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120' },
    { id: '2', name: 'GS. Trần Hữu Dũng', role: 'Tổ trưởng Tổ chuyên gia', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120' }
  ]);

  // Toast Alerts
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Timeline logs State
  const [historyItems, setHistoryItems] = useState<TimelineItem[]>([
    {
      id: 'log-1',
      title: 'Đoàn Liên ngành Tỉnh thông qua kết quả',
      time: '15:30',
      date: '15/03/2024',
      status: 'done',
      description: 'UBND Tỉnh Đồng Nai đã ký văn bản số 248/TTr-UBND trình Bộ Nông nghiệp & PTNT thẩm định xã Xuân Trường đạt chuẩn NTM nâng cao.',
      fileAttached: 'VanBan_248_TTr.pdf'
    },
    {
      id: 'log-2',
      title: 'Kết thúc thẩm định thực tế tại địa phương',
      time: '09:15',
      date: '10/03/2024',
      status: 'done',
      description: 'Đoàn kiểm tra ghi nhận 19/19 tiêu chí đạt chuẩn. Hạ tầng giao thông và điện lưới được đánh giá vượt mức quy định.'
    },
    {
      id: 'log-3',
      title: 'Tổ chuyên gia Trung ương tiếp nhận hồ sơ',
      time: '10:00',
      date: 'Hiện tại',
      status: 'pending',
      description: 'Đang trong quá trình rà soát tính hợp lệ của các số liệu kinh tế - xã hội trong hồ sơ điện tử.',
      note: 'Ghi chú: Cần bổ sung bản quét (scan) chứng chỉ OCOP cho sản phẩm Chè Xuân Trường.'
    }
  ]);

  // Handle Quick Approve action
  const handleQuickApprove = () => {
    if (dossierStatus === 'APPROVED_CENTRAL') {
      triggerToast('Hồ sơ đã được phê duyệt cấp Trung ương hoàn chỉnh!', 'info');
      return;
    }

    setDossierStatus('APPROVED_CENTRAL');
    setCurrentProgress(100);
    setLegalProcedures(4);

    // Add success timeline log
    const newLog: TimelineItem = {
      id: `log-${Date.now()}`,
      title: 'Bộ Nông nghiệp & PTNT phê duyệt đạt chuẩn quốc gia',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'done',
      description: 'Phê duyệt chính thức và ra quyết định công nhận xã đạt chuẩn Nông thôn mới Nâng cao năm 2024.'
    };

    // Update the pending log to done status
    const updatedHistory = historyItems.map(item => {
      if (item.id === 'log-3') {
        return {
          ...item,
          status: 'done' as const,
          date: new Date().toLocaleDateString('vi-VN'),
          time: 'Đã hoàn tất'
        };
      }
      return item;
    });

    setHistoryItems([newLog, ...updatedHistory]);
    triggerToast('Phê duyệt nhanh hồ sơ thành công! Trạng thái: Đạt chuẩn quốc gia.', 'success');
  };

  // Add observer/staff
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      triggerToast('Vui lòng nhập họ và tên cán bộ!', 'warning');
      return;
    }

    const randomAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120'
    ];
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      avatar: randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
    };

    setStaffList([...staffList, newStaff]);
    setNewStaffName('');
    setShowAddStaffModal(false);
    triggerToast(`Đã bổ nhiệm ${newStaffName} giám sát hồ sơ này.`, 'success');
  };

  // Static files in sidebar with checkable simulation
  const [files, setFiles] = useState([
    { id: 'f1', name: 'Báo cáo thẩm tra xã đạt chuẩn NTM.pdf', size: '2.4 MB', approved: true, type: 'pdf' },
    { id: 'f2', name: 'Biên bản đánh giá thực tế Tỉnh.pdf', size: '1.8 MB', approved: true, type: 'pdf' },
    { id: 'f3', name: 'Hinh_anh_ha_tang_thuc_te.zip', size: '15.5 MB', approved: false, type: 'zip' },
  ]);

  const handleToggleFileAudit = (fileId: string) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        const nextState = !f.approved;
        triggerToast(`Thay đổi kiểm duyệt tệp tin: ${nextState ? 'Đã duyệt' : 'Đang rà soát'}`, 'info');
        return { ...f, approved: nextState };
      }
      return f;
    }));
  };

  return (
    <div className="space-y-6 relative pb-12 font-sans select-none animate-fade-in" id="supervision-workspace">
      
      {/* Toast popup alerts */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 ${
          toast.type === 'success' ? 'bg-[#0f172a] border-[#1e293b]' :
          toast.type === 'warning' ? 'bg-amber-900/95 border-amber-800' : 'bg-[#1e293b] border-slate-700'
        } backdrop-blur-md border text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 max-w-sm transition-all duration-350`}>
          {toast.type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 shrink-0" />
          )}
          <span className="text-xs font-bold leading-normal">{toast.message}</span>
        </div>
      )}

      {/* Breadcrumb row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <div className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <span>Giám sát quy trình hồ sơ</span>
            <span className="text-slate-300">&rarr;</span>
            <span className="text-indigo-700 font-black">Mã hồ sơ #NTM-2024-QT08</span>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200">
          Môi trường Giám sát Liên thông &bull; BCĐ Trung ương
        </div>
      </div>

      {/* Main Dossier Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col lg:flex-row justify-between gap-6 relative">
        <div className="space-y-4 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-[#ebf5ff] text-blue-700 text-xs font-black px-3.5 py-1.5 rounded-full border border-blue-100 tracking-wide">
              Mã hồ sơ: #NTM-2024-QT08
            </span>
            <span className="bg-[#f8fafc] text-slate-500 text-xs font-extrabold px-3 py-1.5 rounded-full border border-slate-150">
              Loại: Xã chuẩn Nâng cao
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-snug">
              Hồ sơ thẩm định Xã Đạt chuẩn Nông thôn mới Nâng cao
            </h2>
            <p className="text-sm text-slate-500 font-extrabold flex items-center gap-1.5">
              <span>Xã Xuân Trường, Huyện Xuân Lộc, Tỉnh Đồng Nai</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-indigo-600 underline cursor-pointer hover:text-indigo-750">Bản đồ vệ tinh GIS</span>
            </p>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>NGÀY KHỞI TẠO: <strong className="text-slate-700">12/03/2024</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <User className="w-4 h-4 text-slate-400" />
              <span>NGƯỜI PHỤ TRÁCH: <strong className="text-slate-700">Lê Văn Thành</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>MỨC ĐỘ ƯU TIÊN: <strong className="text-rose-600 uppercase">Cao</strong></span>
            </div>
          </div>
        </div>

        {/* Status Indicator & Instant action buttons (Right) */}
        <div className="flex flex-col md:flex-row lg:flex-col justify-center items-end gap-3.5 shrink-0 min-w-[260px] border-t lg:border-t-0 lg:border-l border-slate-150 pt-5 lg:pt-0 lg:pl-6">
          <div className="text-right space-y-1 w-full flex flex-col items-start md:items-end justify-center">
            {dossierStatus === 'PENDING_CENTRAL' ? (
              <span className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-black bg-amber-50 border border-amber-200 text-amber-600 tracking-wide uppercase shadow-sm">
                <Clock className="w-4 h-4" />
                Chờ phê duyệt cấp Trung ương
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-black bg-emerald-50 border border-emerald-250 text-emerald-600 tracking-wide uppercase shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Đồng ý Đạt chuẩn Quốc Gia
              </span>
            )}
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block mt-1">
              Cập nhật lần cuối: 2 giờ trước
            </span>
          </div>

          <div className="flex gap-2.5 w-full">
            <button
              onClick={handleQuickApprove}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-white ${
                dossierStatus === 'APPROVED_CENTRAL' 
                  ? 'bg-slate-350 cursor-not-allowed text-stone-100' 
                  : 'bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Phê duyệt nhanh</span>
            </button>
            
            <button
              onClick={() => {
                triggerToast('Đang kết xuất phiếu theo dõi luồng hồ sơ (PDF)...', 'info');
              }}
              className="px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-extrabold text-xs flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>In phiếu theo dõi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column split workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="supervision-dashboard-row">
        
        {/* Left Side (8 cols): Interactive workflow graph and detailed timeline logs */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Card: Sơ đồ luồng công việc */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black uppercase text-[#0f2942] tracking-tight">Sơ đồ luồng công việc trực quan</h3>
              </div>
              
              {/* Legends matching screenshot */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đã xong
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Đang xử lý
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Chưa đến
                </span>
              </div>
            </div>

            {/* Visual Process Flow chart */}
            <div className="bg-[#f8fafc]/60 border border-slate-150 rounded-2xl p-6 relative overflow-hidden" id="visual-nodes-flow">
              
              {/* Background faded flow diagram sketch simulating custom flow charts */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center">
                <div className="border border-indigo-900 rounded-full w-[400px] h-[400px] border-dashed" />
                <div className="border border-indigo-900 rounded-full w-[250px] h-[250px] border-dashed absolute" />
              </div>

              {/* Three node horizontal sequence with connecting pipeline lines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10" id="flowchart-nodes">
                
                {/* Node 1 */}
                <div 
                  onClick={() => setStepDetailModal({
                    isOpen: true,
                    title: 'Khởi tạo hồ sơ sơ bộ',
                    desc: 'Tiến trình bắt đầu từ UBND xã Xuân Trường xây dựng, nhập liệu 19 tiêu chí NTM Nâng cao và đính kèm 566 bản tài liệu số hóa minh chứng. Được Hội đồng thẩm định cấp Huyện đối soát và kết ký xác nhận chữ ký số của Chủ tịch UBND Huyện trình tỉnh.'
                  })}
                  className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-sm transition-all hover:scale-[1.02] cursor-pointer text-center relative group"
                >
                  <div className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-150">
                    <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
                  </div>
                  <span className="text-sm font-black text-slate-800 tracking-tight block group-hover:text-blue-600">Khởi tạo hồ sơ</span>
                  <span className="text-xs text-slate-400 font-bold block mt-0.5">Xã hoàn thành</span>
                </div>

                {/* Node 2 */}
                <div 
                  onClick={() => setStepDetailModal({
                    isOpen: true,
                    title: 'Thẩm định của Sở Ban Ngành cấp Tỉnh',
                    desc: 'Bao gồm 19 tổ chuyên ngành rà soát chéo số liệu thực địa liên tục. UBND Tỉnh Đồng Nai phê duyệt hồ sơ báo cáo thẩm định, gửi chữ ký số chuyên dùng chữ ký số CA của Chủ tịch UBND tỉnh đăng trình trực tiếp lên Cổng thông tin của Văn phòng Điều phối Nông thôn mới Trung ương.'
                  })}
                  className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-sm transition-all hover:scale-[1.02] cursor-pointer text-center relative group"
                >
                  <div className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-150">
                    {/* SVG office icon */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-600 fill-emerald-100 stroke-emerald-600 stroke-1" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="2" width="16" height="20" rx="2" />
                      <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-sm font-black text-slate-800 tracking-tight block group-hover:text-blue-600">Thẩm định Tỉnh</span>
                  <span className="text-xs text-slate-400 font-bold block mt-0.5">Đã thẩm định 24/24</span>
                </div>

                {/* Node 3 */}
                <div 
                  onClick={() => setStepDetailModal({
                    isOpen: true,
                    title: 'Đánh giá Liên ngành Trung ương',
                    desc: 'Qua 3 vòng kiểm chứng: Rà soát báo cáo điện tử cơ sở dữ liệu, Gửi chuyên gia thực địa chất vấn chéo, và Họp bỏ phiếu phân định chất lượng địa phương. Đợt hồ sơ này hiện đang nằm trong vòng sát hạch cuối cùng trước khi ra nghị quyết quốc gia.'
                  })}
                  className={`p-5 rounded-2xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer text-center relative group ${
                    dossierStatus === 'APPROVED_CENTRAL' 
                      ? 'bg-white border-2 border-emerald-500' 
                      : 'bg-[#fffaeb] border-2 border-amber-400'
                  }`}
                >
                  <div className="absolute top-2.5 right-2.5 bg-amber-100 text-amber-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {dossierStatus === 'APPROVED_CENTRAL' ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border ${
                    dossierStatus === 'APPROVED_CENTRAL' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-150' 
                      : 'bg-amber-100/50 text-amber-600 border-amber-200'
                  }`}>
                    {/* SVG home icon */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-1 fill-amber-50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" />
                      <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" />
                    </svg>
                  </div>
                  <span className="text-sm font-black text-slate-800 tracking-tight block group-hover:text-blue-600">Đoàn Liên ngành T.Ư</span>
                  <span className="text-xs text-amber-600 font-black block mt-0.5">
                    {dossierStatus === 'APPROVED_CENTRAL' ? 'Đã duyệt đạt chuẩn' : 'Đang xử lý rà soát'}
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom auxiliary detail checklists */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="auxductory-checklists">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-left">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-black text-slate-800 block truncate leading-tight">Quy trình thẩm định cấp Tỉnh</span>
                  <span className="text-xs text-slate-400 font-medium">Báo cáo nghị quyết kết quả tự rà sát</span>
                </div>
                <button 
                  onClick={() => setStepDetailModal({
                    isOpen: true,
                    title: 'Ý kiến thẩm định của tỉnh',
                    desc: 'Xã đã tổ chức hội nghị bỏ phiếu lấy ý kiến hơn 95% sự hài lòng của quần chúng nhân dân trên địa phận. Hồ sơ đã được Thư ký Ủy ban Nhân dân Tỉnh đính kèm quyết định phê duyệt kèm số liệu.'
                  })}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-left">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-black text-slate-800 block truncate leading-tight">Đoàn đánh giá Liên ngành</span>
                  <span className="text-xs text-slate-400 font-medium">Tỉnh lý ý kiến & Biên bản thống nhất</span>
                </div>
                <button 
                  onClick={() => setStepDetailModal({
                    isOpen: true,
                    title: 'Biên bản Đoàn đánh giá liên ngành Trung ương',
                    desc: 'Được đính hội thảo thẩm định với 100% sở ban ngành gật đầu đồng thuận số liệu hạ tầng liên xã đạt từ chuẩn mức trung bình cao đổ lên.'
                  })}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl flex items-center gap-3 text-left md:col-span-2 lg:col-span-1">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-sky-950 block leading-tight">Học tập kinh nghiệm tốt</span>
                  <span className="text-xs text-sky-750 font-bold">Xã Trường Yên đi đầu về OCOP.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card: Lịch sử chi tiết các bước */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-[#0f2942] tracking-tight">Lịch sử chi tiết các bước đã thực hiện</h3>
              
              <button 
                onClick={() => {
                  triggerToast('Bắt đầu tải tệp tin PDF tổng thuật báo cáo tiến độ...', 'success');
                }}
                className="text-blue-700 hover:text-blue-800 font-bold text-xs flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải báo cáo tiến độ</span>
              </button>
            </div>

            {/* History logs timeline */}
            <div className="relative pl-7 border-l-2 border-slate-100 ml-4.5 space-y-6 pb-2">
              {historyItems.map((log) => (
                <div key={log.id} className="relative leading-normal group">
                  {/* Circle dot absolute indicator representing timeline */}
                  <div className={`absolute -left-[36.5px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    log.status === 'done' 
                      ? 'bg-emerald-500 border-white text-white' 
                      : 'bg-amber-500 border-white text-white animate-pulse'
                  }`}>
                    {log.status === 'done' ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                  </div>

                  <div className="space-y-1.5 p-4.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl group-hover:border-slate-200/90 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1.5">
                      <span className="text-sm font-black text-[#0f2942]">
                        {log.title}
                      </span>
                      <span className="text-xs text-slate-400 font-extrabold font-mono tracking-tight shrink-0 bg-white px-2 py-0.5 rounded border border-slate-100">
                        {log.time} &bull; {log.date}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {log.description}
                    </p>

                    {/* File Attachment details inside the log item */}
                    {log.fileAttached && (
                      <div className="pt-1.5">
                        <div 
                          onClick={() => triggerToast(`Previewing file: ${log.fileAttached}`, 'info')}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-700 hover:border-blue-400 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all"
                        >
                          <FileText className="w-4 h-4 text-rose-500" />
                          <span>{log.fileAttached}</span>
                        </div>
                      </div>
                    )}

                    {/* Faded Warning notice from logs */}
                    {log.note && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm mt-3 animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold leading-normal">
                          {log.note}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Column (4 cols): circular progress chart, mission assignment and file attachments */}
        <div className="xl:col-span-4 space-y-6 text-left" id="supervision-sidebar-widgets">
          
          {/* Circular Progress Block */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5.5 space-y-5">
            <h4 className="text-xs font-black uppercase text-[#014285] tracking-tight border-b border-slate-100 pb-2">
              Tiến độ hoàn thành
            </h4>

            {/* Large radial ring spinner showing 75% or 100% completed */}
            <div className="flex flex-col items-center justify-center p-4 py-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative">
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Circular Ring indicator */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#eaecef" 
                    strokeWidth="8" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="8" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * currentProgress) / 100}
                    className="transition-all duration-700 stroke-linecap-round"
                  />
                </svg>
                
                <div className="text-center relative z-10 leading-tight">
                  <span className="text-2xl font-black text-slate-800 tracking-tight block">
                    {currentProgress}%
                  </span>
                  <span className="text-xs font-black text-[#64748b] tracking-widest uppercase block mt-0.5">
                    HOÀN TẤT
                  </span>
                </div>
              </div>

              {/* Progress Detail list items matching colors block */}
              <div className="w-full space-y-2.5 mt-5 border-t border-slate-150 pt-4 text-sm">
                
                {/* Condition 1 */}
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 font-bold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" /> Tiêu chí đạt
                  </span>
                  <span className="font-mono font-black text-[#0f2942]">19/19</span>
                </div>

                {/* Condition 2 */}
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 font-bold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" /> Thủ tục pháp lý
                  </span>
                  <span className="font-mono font-black text-amber-600">{legalProcedures}/4</span>
                </div>

                {/* Condition 3 */}
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 font-bold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" /> Thời gian còn lại
                  </span>
                  <span className="font-semibold text-slate-700 font-mono">12 ngày</span>
                </div>

              </div>
            </div>
          </div>

          {/* Card: Phân công nhiệm vụ (Header with solid dark blue style) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#014285] text-white p-3 px-5 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider block">🗣️ PHÂN CÔNG NHIỆM VỤ</span>
              <span className="text-xs bg-blue-600 px-2.5 py-0.5 rounded-full font-extrabold uppercase shrink-0">Hội Đồng T.Ư</span>
            </div>

            <div className="p-4.5 space-y-4">
              <div className="space-y-3">
                {staffList.map((stf) => (
                  <div key={stf.id} className="flex items-center justify-between p-3 bg-[#f8fafc]/90 rounded-2xl border border-slate-150 transition-all hover:bg-[#f8fafc]">
                    <div className="flex items-center gap-3">
                      <img 
                        src={stf.avatar} 
                        alt={stf.name} 
                        className="w-10 h-10 rounded-full border border-slate-350 object-cover shrink-0"
                      />
                      <div>
                        <span className="text-sm font-black text-slate-800 block leading-tight">{stf.name}</span>
                        <span className="text-xs text-slate-400 font-bold">{stf.role}</span>
                      </div>
                    </div>
                    {/* Chat messaging simulation trigger */}
                    <button 
                      onClick={() => {
                        triggerToast(`Đang mở kênh đối thoại trực tuyến với ${stf.name}...`, 'info');
                      }}
                      className="p-2 text-[#014285] hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer shadow-sm bg-white"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add staff button */}
              <button 
                onClick={() => setShowAddStaffModal(true)}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800 transition-all text-center font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Thêm cán bộ theo dõi</span>
              </button>
            </div>
          </div>

          {/* Card: Hồ sơ kèm theo */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4.5 space-y-4">
            <h4 className="text-xs font-black uppercase text-[#014285] tracking-tight border-b border-slate-100 pb-2 pl-1">
              Hồ sơ kèm theo
            </h4>

            {/* Attached file items */}
            <div className="space-y-2.5">
              {files.map((file) => (
                <div 
                  key={file.id}
                  className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {/* Dynamic color code base on checklist state */}
                    <div className={`w-9.5 h-9.5 rounded-xl border flex items-center justify-center shrink-0 ${
                      file.approved 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                        : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                      <FileText className="w-4.5 h-4.5" />
                    </div>

                    <div className="text-left min-w-0">
                      <span className="text-xs font-extrabold text-slate-800 block truncate leading-tight">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400 font-bold block mt-0.5">
                        {file.size} &bull; {file.approved ? 'Đã phê duyệt' : 'Đang rà soát'}
                      </span>
                    </div>
                  </div>

                  {/* Actions right side of dossier item */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleToggleFileAudit(file.id)}
                      className={`p-1.5 rounded-lg transition-all border ${
                        file.approved 
                          ? 'text-emerald-500 bg-emerald-50 border-emerald-100' 
                          : 'text-slate-400 bg-slate-50 border-slate-100 hover:bg-slate-100'
                      }`}
                      title={file.approved ? 'Nhấn để rà soát lại' : 'Nhấn để duyệt tệp tin'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                    </button>
                    <button 
                      onClick={() => triggerToast(`Tải file ${file.name} xuống bộ nhớ...`, 'success')}
                      className="p-1.5 text-[#3b82f6] hover:bg-blue-50 bg-white border border-slate-200/60 rounded-lg transition-all shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational full size click action button */}
            <button 
              onClick={() => {
                triggerToast('Đang kết nối kho học liệu số lưu trữ trực tuyến... (S3/Drive)', 'success');
              }}
              className="w-full bg-[#014285] hover:bg-[#01346b] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer text-center tracking-wide block transition-all shadow-md active:scale-95"
            >
              Truy cập kho dữ liệu hồ sơ
            </button>
          </div>

        </div>

      </div>

      {/* MODAL 1: ADD STAFF / OBSERVER */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="bg-[#014285] text-white p-5 flex justify-between items-center">
              <h3 className="text-md font-black">Bổ nhiệm Cán bộ giám sát</h3>
              <button 
                onClick={() => setShowAddStaffModal(false)}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#014285] uppercase tracking-wider pl-0.5">Họ và tên</label>
                <input 
                  type="text"
                  placeholder="Nhập tên cán bộ cần phân công..."
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#014285] uppercase tracking-wider pl-0.5">Chức danh / Trách vụ</label>
                <select 
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full text-sm font-bold py-3.5 px-3 border border-slate-200 rounded-xl outline-none text-slate-700 bg-white"
                >
                  <option value="Chuyên viên kiểm định">Chuyên viên kiểm định</option>
                  <option value="Tổ trưởng phụ trách">Tổ trưởng phụ trách</option>
                  <option value="Sứ giả liên thông tỉnh">Sứ giả liên thông tỉnh</option>
                  <option value="Học giả / Thanh Tra">Học giả / Thanh Tra</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-xs"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#014285] hover:bg-[#01356b] text-white font-bold rounded-xl text-xs"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE STEPS DIALOG OVERLAY */}
      {stepDetailModal?.isOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-250 shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="bg-[#0f172a] text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Milestone className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black uppercase text-[#cbd5e1] tracking-tight">Thông tin chi tiết mốc quy trình</h3>
              </div>
              <button 
                onClick={() => setStepDetailModal({ isOpen: false, title: '', desc: '' })}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-800 tracking-tight leading-normal">
                  {stepDetailModal?.title}
                </h4>
                <div className="w-12 h-1 bg-indigo-600 rounded" />
              </div>

              <p className="text-sm text-slate-505 leading-relaxed font-bold text-slate-600 font-medium">
                {stepDetailModal?.desc}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center gap-2.5">
                <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-xs font-bold text-slate-500 leading-normal">
                  Mốc thông số này đã được tự động định vị & ký kiểm chứng bởi Hệ điều hành NTM liên ngành.
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setStepDetailModal({ isOpen: false, title: '', desc: '' })}
                  className="px-5 py-2.5 bg-[#0f172a] text-white rounded-xl font-bold text-xs active:scale-95 transition-all outline-none"
                >
                  Đã đọc & đóng lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
