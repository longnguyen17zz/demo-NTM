import React, { useState } from 'react';
import {
  Calendar,
  SlidersHorizontal,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Eye,
  Mail,
  BookOpen,
  HelpCircle,
  X,
  FileText,
  BookmarkCheck,
  Send,
  MessageSquare,
  ArrowLeft,
  Activity,
  UserCheck,
  ShieldAlert,
  Edit2,
  Trash2
} from 'lucide-react';
import { ReportPeriod, UserSession, FormReport, CommuneSubmission, ProvinceSubmission, ProvinceItem } from '../types';
import { createDefaultFormsForPeriod, FORM_METAS } from '../mockData';

interface ReportPeriodsTabProps {
  periods: ReportPeriod[];
  userSession: UserSession;
  onSelectForm: (periodId: string, formId: string) => void;
  onAddPeriod: (newPeriod: ReportPeriod) => void;
  onEditPeriod: (updatedPeriod: ReportPeriod) => void;
  onDeletePeriod: (id: string) => void;
  selectedPeriodId?: string | null;
  onSelectPeriod?: (id: string | null) => void;
  communes: CommuneSubmission[];
  setCommunes: React.Dispatch<React.SetStateAction<CommuneSubmission[]>>;
  activeCommuneId: string;
  setActiveCommuneId: (id: string) => void;
  provinceSubmissions: ProvinceSubmission[];
  setProvinceSubmissions: React.Dispatch<React.SetStateAction<ProvinceSubmission[]>>;
  onAddNotification?: (content: string, type: 'info' | 'warning' | 'success' | 'alert') => void;
  provinces: ProvinceItem[];
}

export default function ReportPeriodsTab({
  periods,
  userSession,
  onSelectForm,
  onAddPeriod,
  onEditPeriod,
  onDeletePeriod,
  selectedPeriodId: propPeriodId,
  onSelectPeriod: propSelectPeriod,
  communes,
  setCommunes,
  activeCommuneId,
  setActiveCommuneId,
  provinceSubmissions,
  setProvinceSubmissions,
  onAddNotification,
  provinces,
}: ReportPeriodsTabProps) {
  // Navigation: state to track selected period ID to see sub-forms (Biểu 04-13)
  const [localPeriodId, setLocalPeriodId] = useState<string | null>(null);
  const selectedPeriodId = propPeriodId !== undefined ? propPeriodId : localPeriodId;
  const setSelectedPeriodId = propSelectPeriod !== undefined ? propSelectPeriod : setLocalPeriodId;
  const [filterFormStatus, setFilterFormStatus] = useState<string>('ALL');

  // Filter and search variables for reporting status table
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [tablePage, setTablePage] = useState<number>(1);
  const itemsPerPageTable = 4;

  // Notification states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // CRUD Period Modal Dialog States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activePeriod, setActivePeriod] = useState<ReportPeriod | null>(null);

  // Form Fields for Period creation
  const [pName, setPName] = useState('');
  const [pYear, setPYear] = useState('2024');
  const [pTerm, setPTerm] = useState('6 tháng đầu năm');
  const [pDeadline, setPDeadline] = useState('2024-06-30');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedFormCodes, setSelectedFormCodes] = useState<string[]>([]);

  // Interactive popup variables
  const [selectedCommuneDetails, setSelectedCommuneDetails] = useState<CommuneSubmission | null>(null);

  // Add Commune states
  const [showAddCommuneModal, setShowAddCommuneModal] = useState(false);
  const [newCommuneName, setNewCommuneName] = useState('');
  const [newCommuneCode, setNewCommuneCode] = useState('');
  const [newCommuneProvince, setNewCommuneProvince] = useState(() => provinces[0]?.name || 'Tỉnh Đông');
  const [newCommuneGroup, setNewCommuneGroup] = useState<'I' | 'II' | 'III'>('I');

  const activePeriodDetail = periods.find((p) => p.id === selectedPeriodId);

  const isCommune = userSession.role === 'EDITOR';
  const isProvince = userSession.role === 'APPRAISER';

  const targetFormCodes = isCommune
    ? ['Biểu 10', 'Biểu 11', 'Biểu 12', 'Biểu 13']
    : isProvince
      ? ['Biểu 04', 'Biểu 05', 'Biểu 06', 'Biểu 07', 'Biểu 08', 'Biểu 09']
      : [];

  const targetForms = activePeriodDetail?.forms.filter(f => targetFormCodes.includes(f.code)) || [];
  const isCompleted = targetForms.length > 0 && targetForms.every(f => f.status === 'SUBMITTED' || f.status === 'APPROVED' || f.status === 'SUPERVISED');

  const handleSubmitAll = () => {
    if (!activePeriodDetail) return;

    if (!isCompleted) {
      triggerToast(
        isCommune
          ? "Bạn phải hoàn thành nhập liệu cả 4 biểu mẫu (Biểu 10, 11, 12, 13) trước khi gửi thẩm định!"
          : "Cần hoàn thiện cả 5 biểu mẫu cấp Tỉnh trước khi gửi Bộ tổng hợp!",
        "info"
      );
      return;
    }

    const nextStatus = isCommune ? 'SUBMITTED' : 'APPROVED';
    const updatedPeriod: ReportPeriod = {
      ...activePeriodDetail,
      forms: activePeriodDetail.forms.map(f => {
        if (targetFormCodes.includes(f.code)) {
          return {
            ...f,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
            editor: userSession.fullName
          };
        }
        return f;
      })
    };

    onEditPeriod(updatedPeriod);

    if (isCommune) {
      setCommunes(prev => prev.map(c => c.id === activeCommuneId ? {
        ...c,
        submitted: 4,
        status: 'SUBMITTED',
        updatedAt: new Date().toLocaleDateString('vi-VN')
      } : c));
    } else if (isProvince) {
      setProvinceSubmissions(prev => prev.map(p => p.name === 'Tỉnh Đông' ? {
        ...p,
        submitted: 6,
        status: 'SUBMITTED',
        updatedAt: new Date().toLocaleDateString('vi-VN')
      } : p));
    }

    triggerToast(
      isCommune
        ? "Đã nộp toàn bộ hồ sơ báo cáo cấp Xã lên Hội đồng thẩm định Tỉnh thành công!"
        : "Đã gửi toàn bộ biểu mẫu tổng hợp cấp Tỉnh lên Ban chỉ đạo Bộ Trung ương thành công!",
      "success"
    );
  };

  // Trigger brief alert notifications
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleCreateCommune = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommuneName.trim() || !newCommuneCode.trim()) return;

    if (communes.some(c => c.code === newCommuneCode)) {
      triggerToast("Mã xã này đã tồn tại trong hệ thống!", "info");
      return;
    }

    const newCommune: CommuneSubmission = {
      id: `com-${Date.now()}`,
      name: newCommuneName.trim(),
      code: newCommuneCode.trim(),
      province: newCommuneProvince,
      submitted: 0,
      total: 4,
      status: 'PENDING',
      updatedAt: '--',
      group: newCommuneGroup
    };

    setCommunes([...communes, newCommune]);
    setShowAddCommuneModal(false);
    setNewCommuneName('');
    setNewCommuneCode('');
    setNewCommuneGroup('I');
    triggerToast(`Đã khởi tạo thành công ${newCommune.name} thuộc ${newCommune.province}!`, 'success');
  };

  // Selected period for monitoring in the table
  const [monitoredPeriodId, setMonitoredPeriodId] = useState<string>(periods[0]?.id || '2024-q4');

  // Overdue check logic
  const simulatedToday = new Date('2026-06-15');
  const monitoredPeriod = periods.find(p => p.id === monitoredPeriodId) || periods[0];
  const isPeriodOverdue = monitoredPeriod ? (simulatedToday > new Date(monitoredPeriod.deadline)) : false;

  // Filtered Communes (Province monitors Commune)
  const filteredCommunes = communes.filter((item) => {
    const matchesProvince = selectedProvince === 'all' || item.province === selectedProvince;
    let matchesStatus = false;
    if (selectedStatus === 'all') {
      matchesStatus = true;
    } else if (selectedStatus === 'OVERDUE') {
      matchesStatus = isPeriodOverdue && item.status !== 'APPROVED';
    } else {
      matchesStatus = item.status === selectedStatus;
    }
    return matchesProvince && matchesStatus;
  });

  // Filtered Provinces (Ministry monitors Province)
  const filteredProvinces = provinceSubmissions.filter((item) => {
    const matchesRegion = selectedProvince === 'all' || item.region === selectedProvince;
    let matchesStatus = false;
    if (selectedStatus === 'all') {
      matchesStatus = true;
    } else if (selectedStatus === 'OVERDUE') {
      matchesStatus = isPeriodOverdue && item.status !== 'APPROVED';
    } else {
      matchesStatus = item.status === selectedStatus;
    }
    return matchesRegion && matchesStatus;
  });

  const isSupervisor = userSession.role === 'SUPERVISOR';
  const tableDataList = isSupervisor ? filteredProvinces : filteredCommunes;

  // Pagination indices
  const totalTablePages = Math.ceil(tableDataList.length / itemsPerPageTable) || 1;
  const tableStartIndex = (tablePage - 1) * itemsPerPageTable;
  const paginatedTableData = tableDataList.slice(tableStartIndex, tableStartIndex + itemsPerPageTable);

  const handleTablePageSelect = (page: number) => {
    if (page >= 1 && page <= totalTablePages) {
      setTablePage(page);
    }
  };

  const handleSendIndividualReminder = (unitName: string, isOverdueUnit: boolean) => {
    const periodName = monitoredPeriod?.name || "đợt báo cáo";
    if (isOverdueUnit) {
      triggerToast(`Đã gửi công văn đôn đốc hoàn thành báo cáo khẩn tới ${unitName}!`, 'success');
      if (onAddNotification) {
        onAddNotification(`[ĐÔN ĐỐC] Gửi yêu cầu đôn đốc nộp số liệu khẩn tới đơn vị: ${unitName} (Báo cáo đợt: ${periodName})`, 'alert');
      }
    } else {
      triggerToast(`Đã gửi thông báo nhắc nhở nộp số liệu tới ${unitName}!`, 'success');
      if (onAddNotification) {
        onAddNotification(`[NHẮC NHỞ] Đã gửi thông báo nhắc nhở nộp báo cáo tới đơn vị: ${unitName} (Báo cáo đợt: ${periodName})`, 'info');
      }
    }
  };

  const handleSendBatchReminder = () => {
    const overdueUnits = tableDataList.filter(u => isPeriodOverdue && u.status !== 'APPROVED');
    if (overdueUnits.length === 0) {
      triggerToast("Không có đơn vị nào trễ hạn báo cáo trong đợt này!", "info");
      return;
    }

    triggerToast(`Đã gửi thông báo nhắc nhở khẩn tới ${overdueUnits.length} đơn vị trễ hạn!`, 'success');
    if (onAddNotification) {
      const periodName = monitoredPeriod?.name || "đợt báo cáo";
      const unitNamesStr = overdueUnits.map(u => u.name).join(', ');
      onAddNotification(`[ĐÔN ĐỐC KHẨN] Hệ thống đã tự động gửi email và văn bản đôn đốc nộp số liệu tới ${overdueUnits.length} đơn vị trễ hạn (${unitNamesStr}) thuộc đợt: ${periodName}`, 'alert');
    }
  };

  // Open add Modal
  const handleOpenAdd = () => {
    setPName(`Đợt báo cáo NTM Quý I năm ${new Date().getFullYear()}`);
    setPYear(new Date().getFullYear().toString());
    setPTerm('6 tháng đầu năm');
    setPDeadline('2024-06-30');
    // Set initial targets (select all by default)
    const initialTargets = userSession.role === 'SUPERVISOR'
      ? provinces.map(p => p.name)
      : communes.map(c => c.name);
    setSelectedTargets(initialTargets);

    // Seed default & custom forms list
    const customTemplatesJson = localStorage.getItem('NTM_FormTemplates');
    let customTemplates: any[] = [];
    if (customTemplatesJson) {
      try { customTemplates = JSON.parse(customTemplatesJson); } catch (e) { }
    }
    const defaultCodes = FORM_METAS.map(f => f.code);
    const customCodes = customTemplates.map(f => f.code);
    setSelectedFormCodes([...defaultCodes, ...customCodes]);

    setShowAddModal(true);
  };

  // Create real period
  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    if (selectedFormCodes.length === 0) {
      alert('Vui lòng chọn ít nhất một biểu mẫu để áp dụng!');
      return;
    }

    const id = `period-${Date.now()}`;

    // Generate filtered default forms list
    const defaultForms = createDefaultFormsForPeriod(id);

    // Find custom templates to construct if selected
    const customTemplatesJson = localStorage.getItem('NTM_FormTemplates');
    let customTemplates: any[] = [];
    if (customTemplatesJson) {
      try { customTemplates = JSON.parse(customTemplatesJson); } catch (e) { }
    }

    const forms: FormReport[] = [];
    selectedFormCodes.forEach(code => {
      const defForm = defaultForms.find(f => f.code === code);
      if (defForm) {
        forms.push(defForm);
      } else {
        const custTmpl = customTemplates.find(t => t.code === code);
        if (custTmpl) {
          forms.push({
            id: `${id}-${custTmpl.code.toLowerCase().replace(' ', '')}`,
            code: custTmpl.code,
            title: custTmpl.title,
            status: 'DRAFT',
            updatedAt: new Date().toISOString(),
            editor: '',
            proofFiles: [],
            data: custTmpl.rows.map((r: any) => ({
              id: r.id,
              tt: r.tt,
              category: r.category,
              unit: r.unit,
              group1: { prevYear: 0, currentS1: 0, planS2: 0 },
              group2: { prevYear: 0, currentS1: 0, planS2: 0 },
              group3: { prevYear: 0, currentS1: 0, planS2: 0 },
              note: r.defaultNote || ''
            }))
          });
        }
      }
    });

    const newPeriod: ReportPeriod = {
      id,
      name: pName,
      year: pYear,
      term: pTerm,
      deadline: pDeadline,
      forms,
      type: userSession.role === 'SUPERVISOR' ? 'PROVINCE' : 'COMMUNE',
      targets: selectedTargets,
    };

    onAddPeriod(newPeriod);
    setSelectedPeriodId(id); // focus on newly set period forms
    setShowAddModal(false);

    const targetLabel = userSession.role === 'SUPERVISOR' ? 'Tỉnh' : 'Xã';
    triggerToast(`Đã kiến tạo đợt nộp biểu mẫu mới: ${pName} và gửi yêu cầu đến ${selectedTargets.length} ${targetLabel} thành công!`, 'success');
  };

  // Open edit modal
  const handleOpenEdit = (period: ReportPeriod, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePeriod(period);
    setPName(period.name);
    setPYear(period.year);
    setPTerm(period.term);
    setPDeadline(period.deadline);
    setSelectedTargets(period.targets || []);
    setSelectedFormCodes(period.forms.map(f => f.code) || []);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePeriod || !pName.trim()) return;

    if (selectedFormCodes.length === 0) {
      alert('Vui lòng chọn ít nhất một biểu mẫu để áp dụng!');
      return;
    }

    // Generate filtered default forms list
    const defaultForms = createDefaultFormsForPeriod(activePeriod.id);

    // Find custom templates to construct if selected
    const customTemplatesJson = localStorage.getItem('NTM_FormTemplates');
    let customTemplates: any[] = [];
    if (customTemplatesJson) {
      try { customTemplates = JSON.parse(customTemplatesJson); } catch (e) { }
    }

    const updatedForms: FormReport[] = [];
    selectedFormCodes.forEach(code => {
      // Keep existing form report if already exists to preserve user input data!
      const existingForm = activePeriod.forms.find(f => f.code === code);
      if (existingForm) {
        updatedForms.push(existingForm);
      } else {
        const defForm = defaultForms.find(f => f.code === code);
        if (defForm) {
          updatedForms.push(defForm);
        } else {
          const custTmpl = customTemplates.find(t => t.code === code);
          if (custTmpl) {
            updatedForms.push({
              id: `${activePeriod.id}-${custTmpl.code.toLowerCase().replace(' ', '')}`,
              code: custTmpl.code,
              title: custTmpl.title,
              status: 'DRAFT',
              updatedAt: new Date().toISOString(),
              editor: '',
              proofFiles: [],
              data: custTmpl.rows.map((r: any) => ({
                id: r.id,
                tt: r.tt,
                category: r.category,
                unit: r.unit,
                group1: { prevYear: 0, currentS1: 0, planS2: 0 },
                group2: { prevYear: 0, currentS1: 0, planS2: 0 },
                group3: { prevYear: 0, currentS1: 0, planS2: 0 },
                note: r.defaultNote || ''
              }))
            });
          }
        }
      }
    });

    const updated: ReportPeriod = {
      ...activePeriod,
      name: pName,
      year: pYear,
      term: pTerm,
      deadline: pDeadline,
      targets: selectedTargets,
      forms: updatedForms
    };

    onEditPeriod(updated);
    setShowEditModal(false);
    setActivePeriod(null);
    triggerToast(`Đã thay đổi thiết lập của đợt báo cáo`, 'success');
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hành động nghiêm trọng: Bạn có quyết định xóa bỏ hoàn toàn đợt [${name}] và toàn bộ phụ biểu số liệu đính kèm?`)) {
      onDeletePeriod(id);
      if (selectedPeriodId === id) {
        setSelectedPeriodId(null);
      }
      triggerToast(`Đã gỡ bỏ đợt báo cáo: ${name}`, 'info');
    }
  };

  // Export current reporting data list to simulated JSON
  const handleExportReportingList = () => {
    try {
      const exportData = isSupervisor ? provinceSubmissions : communes;
      const filename = isSupervisor
        ? `TrangThaiNopBaoCao_Provinces_${new Date().getFullYear()}.json`
        : `TrangThaiNopBaoCao_Communes_${new Date().getFullYear()}.json`;
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast("Xuất tệp thống kê tổng hợp trạng thái nộp số liệu thành công!", "success");
    } catch (e) {
      triggerToast("Lỗi khi kết xuất dữ liệu, vui lòng thử lại sau.", "info");
    }
  };

  // Render horizontal horizontal rectangle indicators matching the screenshot's color themes
  const renderProgressBlocks = (commune: CommuneSubmission) => {
    const total = commune.total;
    const submitted = commune.submitted;

    // Choose active block color matching the screenshot
    let activeColor = 'bg-slate-300';
    if (commune.status === 'APPROVED') {
      activeColor = 'bg-[#10b981]'; // Green blocks
    } else if (commune.status === 'SUBMITTED') {
      activeColor = 'bg-[#f59e0b]'; // Orange/Yellow blocks
    } else if (commune.status === 'REVISION') {
      activeColor = 'bg-[#ef4444]'; // Red blocks
    } else if (commune.status === 'PENDING') {
      activeColor = 'bg-slate-200';
    }

    return (
      <div className="flex items-center justify-center gap-2 whitespace-nowrap flex-nowrap shrink-0">
        <div className="flex gap-1 shrink-0" title={`${submitted}/${total} phụ biểu đã gửi`}>
          {[...Array(total)].map((_, i) => {
            const isFilled = i < submitted;
            return (
              <span
                key={i}
                className={`w-3.5 h-1.5 rounded-[1px] inline-block transition-colors ${isFilled ? activeColor : 'bg-[#e2e8f0]'
                  }`}
              />
            );
          })}
        </div>
        <span className="text-xs font-extrabold text-[#475569] min-w-[20px] text-left">
          {submitted}/{total}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-805 font-sans" id="reporting-periods-main-panel">
      {!selectedPeriodId ? (
        <div className="space-y-6">
          {toast && (
            <div className="fixed top-6 right-6 bg-[#0f2942]/95 backdrop-blur-md text-white border border-[#2563eb]/20 py-3.5 px-5 rounded-xl shadow-[0_12px_45px_rgba(0,0,0,0.18)] z-[9999] flex items-center gap-3 animate-slide-in">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-xs font-bold">{toast.message}</span>
              <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Breadcrumb Navigation Map Pin header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
              <span>Hệ thống</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-[#2563eb] font-bold">Danh sách đợt báo cáo</span>
            </div>

            {/* Header Title with buttons directly matching the screenshot */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-2">
              <div>
                <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Đợt báo cáo cấp Xã</h2>
                <p className="text-xs text-[#64748b] font-medium mt-1">
                  Quản lý và thực hiện các yêu cầu báo cáo từ Ủy ban Nhân dân Tỉnh.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    // Quick state resets as filter option
                    setSelectedProvince('all');
                    setSelectedStatus('all');
                    setTablePage(1);
                    triggerToast("Đã đưa các tham số lọc về mặc định", "info");
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-[#475569] flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#64748b]" />
                  <span>Bộ lọc</span>
                </button>

                {userSession.role !== 'EDITOR' && (
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-4.5 py-2.5 bg-[#014285] hover:bg-[#0b4aa6] text-white rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/10 transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Tạo báo cáo mới</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Commune Selector for Commune EDITOR simulation */}
          {isCommune && (
            <div className="bg-gradient-to-r from-blue-50 to-[#edf1f7] p-4.5 rounded-2xl border border-blue-105 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 border border-blue-200 flex items-center justify-center text-[#014285] shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Mô phỏng Đơn vị Báo cáo</h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Đang chọn làm việc với tư cách xã dưới đây. Số liệu và ngưỡng đạt chuẩn trong Biểu 10 sẽ thay đổi tương ứng.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-1.5 rounded-xl border border-slate-205 shrink-0 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-extrabold pl-2.5 whitespace-nowrap">Xã đang chọn:</span>
                <select
                  value={activeCommuneId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setActiveCommuneId(id);
                    const com = communes.find(c => c.id === id);
                    if (com) {
                      triggerToast(`Đã chuyển đơn vị mô phỏng sang: ${com.name} (Nhóm ${com.group || 'I'})`, 'info');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-black text-[#014285] border border-transparent hover:border-slate-250 outline-none transition-all cursor-pointer font-sans"
                >
                  {communes.map((com) => (
                    <option key={com.id} value={com.id}>
                      {com.name} (Nhóm {com.group || 'I'}) - {com.province}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 2. Top Summary stats row exactly as seen in reference screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* KPI Card 1: Cần xử lý */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-150 uppercase tracking-wider">
                  Cần xử lý
                </span>
                <Clock className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-3.5xl font-black text-[#0f2942]">02</h3>
                <p className="text-xs text-[#64748b] font-bold mt-1">Đang thực hiện</p>
              </div>
            </div>

            {/* KPI Card 2: Yêu cầu sửa */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-150 uppercase tracking-wider">
                  Yêu cầu sửa
                </span>
                <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-3.5xl font-black text-[#ef4444]">01</h3>
                <p className="text-xs text-[#64748b] font-bold mt-1">Cần sửa lại</p>
              </div>
            </div>

            {/* KPI Card 3: Hoàn thành */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-150 uppercase tracking-wider">
                  Hoàn thành
                </span>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-3.5xl font-black text-[#10b981]">12</h3>
                <p className="text-xs text-[#64748b] font-bold mt-1">Đã gửi Tỉnh</p>
              </div>
            </div>

            {/* Alert Card 4: Countdown details dark styled card */}
            <div className="bg-[#023366] text-white p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
              {/* Soft Clock Watermark Background decoration */}
              <div className="absolute right-[-15px] bottom-[-15px] text-white/5 opacity-10 select-none">
                <Clock className="w-28 h-28" />
              </div>

              <div>
                <span className="text-xs font-black uppercase text-slate-300 tracking-widest block">
                  Thời hạn gần nhất
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 tracking-tight">04 ngày còn lại</h3>
              </div>
              <div className="mt-4 text-xs font-bold text-slate-300 bg-black/15 py-1.5 px-2.5 rounded border border-white/5 truncate z-10">
                Đợt: Đánh giá tiêu chí Giao thông Q3/2024
              </div>
            </div>

          </div>

          {/* 3. "Các đợt báo cáo đang diễn ra" section */}
          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg bg-blue-50 border border-blue-105/60 flex items-center justify-center text-[#2563eb]">
                <Radio className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-[#0f2942] tracking-tight uppercase">
                Các đợt báo cáo đang diễn ra
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Left Card: 2024 Quý IV */}
              {periods.map((p, idx) => {
                // Determine layout indicators
                const isFirst = idx === 0;
                const tagText = isFirst ? "ĐANG NHẬN" : "SẮP HẾT HẠN";
                const tagColor = isFirst
                  ? "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]"
                  : "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]";

                // Stat calculations to avoid blank placeholders
                const draftCount = p.forms?.filter((f) => f.status === 'DRAFT').length || 0;
                const approvedCount = p.forms?.filter((f) => f.status === 'APPROVED' || f.status === 'SUPERVISED').length || 0;
                const totalForms = p.forms?.length || 10;
                const percent = isFirst ? 75 : 40; // High-fidelity preset
                const displayCommunes = isFirst ? "150/200" : "20/50";

                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-xl border p-5.5 flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden ${isFirst ? 'border-l-4 border-l-[#2563eb] border-slate-205' : 'border-l-4 border-l-amber-500 border-slate-205'
                      }`}
                  >

                    <div>
                      {/* Top label area */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-[#0f2942] leading-snug tracking-tight truncate" title={p.name}>
                            {p.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {userSession.role !== 'EDITOR' && (
                            <div className="flex items-center gap-1 mr-1">
                              <button
                                onClick={(e) => handleOpenEdit(p, e)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Sửa đợt báo cáo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(p.id, p.name, e)}
                                className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Xóa đợt báo cáo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                          <span className={`text-xs font-black uppercase px-2 py-1 rounded border tracking-wider shrink-0 ${tagColor}`}>
                            {tagText}
                          </span>
                        </div>
                      </div>

                      {/* Detail range description */}
                      <p className="text-xs text-[#64748b] font-medium mt-1.5 flex items-center gap-1.5">
                        <span className="font-extrabold text-[#334155]">Phạm vi:</span>
                        <span>{isFirst ? 'Toàn tỉnh' : 'Cụm phía Tây'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-extrabold text-[#334155]">Hạn cuối:</span>
                        <span>{p.deadline}</span>
                      </p>

                      {/* Unified interactive Progress bar exactly representing 75% or 40% */}
                      <div className="mt-5 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-[#64748b]">
                          <span>Tiến độ hoàn thành (Xã)</span>
                          <span className="text-[#0f2942] font-black">{percent}% ({displayCommunes})</span>
                        </div>

                        <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden border border-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isFirst ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6]' : 'bg-gradient-to-r from-amber-500 to-amber-600'
                              }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom action trigger bar */}
                    <div className="flex items-center gap-3.5 mt-5.5 pt-4.5 border-t border-slate-105">
                      <button
                        type="button"
                        onClick={() => setSelectedPeriodId(p.id)}
                        className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Chi tiết đợt
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPeriodId(p.id)}
                        className="flex-1 py-2 px-3 bg-[#014285] hover:bg-[#0b4aa6] text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer text-center"
                      >
                        QL nộp báo cáo
                      </button>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* 4. Table "Thống kê trạng thái nộp báo cáo" */}
          {userSession.role !== 'EDITOR' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">

              {/* Header layout of the table status block */}
              <div className="p-5 border-b border-slate-110 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-[#0f2942] tracking-tight uppercase">
                    {isSupervisor ? "Thống kê trạng thái nộp báo cáo cấp Tỉnh" : "Thống kê trạng thái nộp báo cáo cấp Xã"}
                  </h3>
                  <p className="text-xs text-[#64748b] font-medium mt-0.5">
                    {isSupervisor ? "Chi tiết tình hình thực hiện theo từng Tỉnh gửi lên Bộ." : "Chi tiết tình hình thực hiện theo từng Huyện/Thành phố."}
                  </p>
                </div>

                {/* Geo filter select dropdowns and Excel exports */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Dropdown chọn Đợt báo cáo để kiểm soát */}
                  <div className="relative">
                    <select
                      value={monitoredPeriodId}
                      onChange={(e) => {
                        setMonitoredPeriodId(e.target.value);
                        setTablePage(1);
                      }}
                      className="pl-8 pr-7 py-2 bg-[#f8fafc] border border-slate-200 hover:border-slate-300 focus:border-[#2563eb] rounded-lg text-xs font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {periods.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <Calendar className="w-3.8 h-3.8 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Geographics pin Filter dropdown */}
                  <div className="relative">
                    {isSupervisor ? (
                      <select
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value);
                          setTablePage(1);
                        }}
                        className="pl-8 pr-7 py-2 bg-[#f8fafc] border border-slate-200 hover:border-slate-350 focus:border-[#2563eb] rounded-lg text-xs font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả Vùng miền</option>
                        <option value="Đông Bắc Bộ">Đông Bắc Bộ</option>
                        <option value="Tây Bắc Bộ">Tây Bắc Bộ</option>
                        <option value="Đồng bằng sông Hồng">Đồng bằng sông Hồng</option>
                      </select>
                    ) : (
                      <select
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value);
                          setTablePage(1);
                        }}
                        className="pl-8 pr-7 py-2 bg-[#f8fafc] border border-slate-200 hover:border-slate-300 focus:border-[#2563eb] rounded-lg text-xs font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả Tỉnh/TP</option>
                        <option value="Tỉnh Đông">Tỉnh Đông</option>
                        <option value="Tỉnh Thái Thụy">Tỉnh Thái Thụy</option>
                        <option value="Tỉnh Bắc">Tỉnh Bắc</option>
                        <option value="Tỉnh Nam">Tỉnh Nam</option>
                      </select>
                    )}
                    <MapPin className="w-3.8 h-3.8 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Workflow Status filter dropdown */}
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setTablePage(1);
                      }}
                      className="pl-8 pr-7 py-2 bg-[#f8fafc] border border-slate-200 hover:border-slate-300 focus:border-[#2563eb] rounded-lg text-xs font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="APPROVED">Đã phê duyệt</option>
                      <option value="SUBMITTED">Chờ phê duyệt</option>
                      <option value="REVISION">Yêu cầu sửa</option>
                      <option value="PENDING">Chưa bắt đầu</option>
                      <option value="OVERDUE">Trễ hạn nộp</option>
                    </select>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Nút Đôn đốc trễ hạn hàng loạt */}
                  <button
                    type="button"
                    onClick={handleSendBatchReminder}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    title="Gửi đôn đốc khẩn cấp tới các đơn vị đang trễ hạn báo cáo"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Đôn đốc trễ hạn</span>
                  </button>

                  {/* Download backup Button */}
                  <button
                    type="button"
                    onClick={handleExportReportingList}
                    className="p-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#64748b] rounded-lg cursor-pointer shadow-sm transition-colors animate-spin-hover"
                    title="Tải về bản dữ liệu thống kê"
                  >
                    <FileDown className="w-4 h-4 text-[#475569]" />
                  </button>

                  {/* Add Commune Button for Province Appraiser */}
                  {isProvince && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewCommuneProvince(provinces[0]?.name || 'Tỉnh Đông');
                        setShowAddCommuneModal(true);
                      }}
                      className="px-3.5 py-2 bg-[#014285] hover:bg-[#002a54] text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Xã mới</span>
                    </button>
                  )}

                </div>
              </div>

              {/* Main reporting table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    {isSupervisor ? (
                      <tr className="bg-[#f8fafc] text-xs font-black text-[#475569] uppercase border-b border-slate-200 tracking-wider">
                        <th className="py-3 px-6 w-[30%]">Tên Đơn vị (Tỉnh)</th>
                        <th className="py-3 px-4 w-[25%] text-center">Vùng địa lý</th>
                        <th className="py-3 px-4 w-[20%] text-center">Báo cáo đã gửi</th>
                        <th className="py-3 px-4 w-[17%] text-center">Trạng thái báo cáo</th>
                        <th className="py-3 px-4 w-[8%] text-center">Thao tác</th>
                      </tr>
                    ) : (
                      <tr className="bg-[#f8fafc] text-xs font-black text-[#475569] uppercase border-b border-slate-200 tracking-wider">
                        <th className="py-3 px-6 w-[25%]">Tên Đơn vị (Xã)</th>
                        <th className="py-3 px-4 w-[17%] text-center">Tỉnh trực thuộc</th>
                        <th className="py-3 px-4 w-[18%] text-center">Phân nhóm Xã</th>
                        <th className="py-3 px-4 w-[18%] text-center">Báo cáo đã gửi</th>
                        <th className="py-3 px-4 w-[14%] text-center">Trạng thái báo cáo</th>
                        <th className="py-3 px-4 w-[8%] text-center">Thao tác</th>
                      </tr>
                    )}
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-[#0f2942]">
                    {paginatedTableData.length === 0 ? (
                      <tr>
                        <td colSpan={isSupervisor ? 5 : 6} className="py-12 text-center text-slate-400 font-bold italic">
                          Không có đơn vị nào khớp với bộ lọc không gian hoặc trạng thái hiện hành.
                        </td>
                      </tr>
                    ) : (
                      paginatedTableData.map((item) => {
                        const isOverdueUnit = isPeriodOverdue && item.status !== 'APPROVED';

                        // Custom tags logic for table
                        let statusBadge = (
                          <span className="text-xs font-extrabold text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-full uppercase whitespace-nowrap">
                            Chưa bắt đầu
                          </span>
                        );

                        if (isOverdueUnit) {
                          statusBadge = (
                            <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full uppercase flex items-center justify-center gap-1.5 animate-pulse whitespace-nowrap">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                              Trễ hạn nộp
                            </span>
                          );
                        } else if (item.status === 'APPROVED') {
                          statusBadge = (
                            <span className="text-xs font-extrabold text-[#10b981] bg-[#ecfdf5] border border-emerald-100 px-2.5 py-1 rounded-full uppercase whitespace-nowrap">
                              {isSupervisor ? 'Đã phê duyệt' : 'Đã thẩm định'}
                            </span>
                          );
                        } else if (item.status === 'SUBMITTED') {
                          statusBadge = (
                            <span className="text-xs font-extrabold text-amber-700 bg-[#fffbeb] border border-amber-100 px-2.5 py-1 rounded-full uppercase whitespace-nowrap">
                              {isSupervisor ? 'Chờ phê duyệt' : 'Chờ thẩm định'}
                            </span>
                          );
                        } else if (item.status === 'REVISION') {
                          statusBadge = (
                            <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full uppercase whitespace-nowrap">
                              Yêu cầu sửa
                            </span>
                          );
                        }

                        if (isSupervisor) {
                          // Render Province row
                          const prov = item as ProvinceSubmission;
                          return (
                            <tr key={prov.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4.5 px-6">
                                <div>
                                  <span className="text-xs font-extrabold text-[#0f2942] block">
                                    {prov.name}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400 block mt-0.5">
                                    Mã tỉnh: {prov.code}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                <span className="text-xs font-semibold text-slate-600">
                                  {prov.region}
                                </span>
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="flex gap-1" title={`${prov.submitted}/${prov.total} biểu mẫu đã gửi`}>
                                    {[...Array(prov.total)].map((_, i) => {
                                      const isFilled = i < prov.submitted;
                                      let activeColor = 'bg-slate-300';
                                      if (prov.status === 'APPROVED') {
                                        activeColor = 'bg-[#10b981]';
                                      } else if (prov.status === 'SUBMITTED') {
                                        activeColor = 'bg-[#f59e0b]';
                                      } else if (prov.status === 'REVISION') {
                                        activeColor = 'bg-[#ef4444]';
                                      }
                                      return (
                                        <span
                                          key={i}
                                          className={`w-3.5 h-1.5 rounded-[1px] inline-block transition-colors ${isFilled ? activeColor : 'bg-[#e2e8f0]'
                                            }`}
                                        />
                                      );
                                    })}
                                  </div>
                                  <span className="text-xs font-extrabold text-[#475569] min-w-[20px] text-left">
                                    {prov.submitted}/{prov.total}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                {statusBadge}
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap shrink-0">
                                  {prov.status !== 'PENDING' && !isOverdueUnit && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        triggerToast(`Đang hiển thị tóm tắt tình trạng nộp báo cáo của ${prov.name}`, 'info');
                                      }}
                                      className="p-1 px-2 text-[#2563eb] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                      title="Xem nhanh chi tiết trạng thái"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleSendIndividualReminder(prov.name, isOverdueUnit)}
                                    className={`p-1 px-2 rounded-lg transition-colors cursor-pointer ${isOverdueUnit
                                      ? 'text-rose-600 hover:bg-rose-50'
                                      : 'text-indigo-600 hover:bg-indigo-50'
                                      }`}
                                    title={isOverdueUnit ? "Gửi đôn đốc khẩn cấp trễ hạn" : "Gửi thư nhắc nhở đôn đốc nộp số liệu"}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        } else {
                          // Render Commune row
                          const commune = item as CommuneSubmission;
                          return (
                            <tr key={commune.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4.5 px-6">
                                <div>
                                  <span className="text-xs font-extrabold text-[#0f2942] block">
                                    {commune.name}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400 block mt-0.5">
                                    Mã: {commune.code}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                <span className="text-xs font-semibold text-slate-600">
                                  {commune.province}
                                </span>
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                {isProvince ? (
                                  <select
                                    value={commune.group || 'II'}
                                    onChange={(e) => {
                                      const val = e.target.value as 'I' | 'II' | 'III';
                                      setCommunes(prev => prev.map(c => c.id === commune.id ? { ...c, group: val } : c));
                                      triggerToast(`Đã cập nhật ${commune.name} sang Nhóm ${val}!`, 'success');
                                    }}
                                    className="px-2 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-extrabold text-[#014285] focus:border-[#2563eb] outline-none transition-all cursor-pointer font-sans"
                                  >
                                    <option value="I">Nhóm I</option>
                                    <option value="II">Nhóm II</option>
                                    <option value="III">Nhóm III</option>
                                  </select>
                                ) : (
                                  <>
                                    {commune.group === 'I' && (
                                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold text-[10px] rounded-lg border border-blue-200 uppercase">
                                        Nhóm I
                                      </span>
                                    )}
                                    {commune.group === 'II' && (
                                      <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-[10px] rounded-lg border border-amber-200 uppercase">
                                        Nhóm II
                                      </span>
                                    )}
                                    {commune.group === 'III' && (
                                      <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 font-extrabold text-[10px] rounded-lg border border-purple-200 uppercase">
                                        Nhóm III
                                      </span>
                                    )}
                                    {!commune.group && (
                                      <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-500 font-extrabold text-[10px] rounded-lg border border-slate-200 uppercase">
                                        Chưa gán
                                      </span>
                                    )}
                                  </>
                                )}
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                {renderProgressBlocks(commune)}
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                {statusBadge}
                              </td>

                              <td className="py-4.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap flex-nowrap shrink-0">
                                  {commune.status !== 'PENDING' && !isOverdueUnit ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedCommuneDetails(commune);
                                      }}
                                      className="p-1 px-2 text-[#2563eb] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                      title="Xem nhanh chi tiết trạng thái"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSendIndividualReminder(commune.name, isOverdueUnit)}
                                      className={`p-1 px-2 rounded-lg transition-colors cursor-pointer ${isOverdueUnit
                                        ? 'text-rose-600 hover:bg-rose-50'
                                        : 'text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                      title={isOverdueUnit ? "Gửi đôn đốc khẩn cấp trễ hạn" : "Gửi thư nhắc nhở đôn đốc nộp số liệu"}
                                    >
                                      <Mail className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Custom pagination control driven exactly by reference */}
              <div className="bg-[#f8fafc] border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs font-bold text-[#475569]">
                <div>
                  Hiển thị <span className="text-[#0f2942] font-black">{tableStartIndex + 1} - {Math.min(tableStartIndex + itemsPerPageTable, tableDataList.length)}</span> trong tổng số <span className="text-[#0f2942] font-black">{tableDataList.length}</span> đơn vị
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTablePageSelect(tablePage - 1)}
                    disabled={tablePage === 1}
                    className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalTablePages)].map((_, i) => {
                    const pNum = i + 1;
                    const isActive = tablePage === pNum;
                    return (
                      <button
                        key={pNum}
                        onClick={() => handleTablePageSelect(pNum)}
                        className={`w-7.5 h-7.5 text-xs rounded border flex items-center justify-center transition-all cursor-pointer ${isActive
                          ? 'bg-[#2563eb] border-[#2563eb] text-white font-black'
                          : 'bg-white border-slate-200 hover:bg-slate-50 font-bold'
                          }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  {/* Add a placeholder page ellipsis if large total exists to simulate screenshot's max of page 50 */}
                  {totalTablePages < 5 && (
                    <>
                      <span className="text-[#64748b] px-1 font-normal">...</span>
                      <button
                        className="w-7.5 h-7.5 text-xs rounded border bg-white border-slate-200 font-bold hover:bg-slate-50 cursor-pointer"
                        onClick={() => triggerToast("Đang điều hướng trang dữ liệu cấp cứu", "info")}
                      >
                        50
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleTablePageSelect(tablePage + 1)}
                    disabled={tablePage === totalTablePages}
                    className="p-1.5 border border-slate-200 rounded bg-white text-slate-555 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}
          {/* 5. Lower guide and technical support cards matches screen exactly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

            {/* Guide Card Left */}
            <div className="bg-[#edf4f8] rounded-xl border border-blue-100 p-5.5 flex gap-4 items-start">
              <div className="p-3 bg-white rounded-xl text-[#2563eb] border border-blue-50/50 shrink-0">
                <BookOpen className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-extrabold text-[#0f2942]">Hướng dẫn nhập liệu mới</h4>
                <p className="text-xs text-slate-600 leading-casual font-medium">
                  Bạn chưa rõ cách tính toán các chỉ số phần trăm cho Tiêu chí số 2? Xem ngay bộ tài liệu hướng dẫn chuẩn từ Bộ NN&PTNT.
                </p>
                <a
                  href="#guideline-documents"
                  className="text-xs font-black text-[#2563eb] inline-flex items-center gap-1.5 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerToast("Đang chuyển hướng tải tài liệu hướng dẫn Quy chuẩn 185...", "info");
                  }}
                >
                  <span>Xem tài liệu hướng dẫn</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Support Card Right */}
            <div className="bg-slate-100/70 rounded-xl border border-slate-200 p-5.5 flex gap-4 items-start">
              <div className="p-3 bg-white rounded-xl text-[#64748b] shrink-0">
                <HelpCircle className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-extrabold text-[#0f2942]">Hỗ trợ kỹ thuật</h4>
                <p className="text-xs text-slate-600 leading-casual font-medium">
                  Gặp lỗi trong quá trình đính kèm tệp tin PDF hoặc lỗi hiển thị bản đồ? Liên hệ ngay đội ngũ kỹ thuật cấp Huyện.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Cổng kết nối đội ngũ kỹ thuật cấp huyện đang trực tuyến!", "success");
                  }}
                  className="bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer mt-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Nhắn tin hỗ trợ</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ======================== DRILL DOWN VIEW: FORMS LIST OF THE SELECTED PERIOD ======================== */
        <div className="space-y-6" id="drilldown-period-view">

          {/* Back breadcrumbs header with custom-paired layout */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                setSelectedPeriodId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-black text-[#64748b] hover:text-[#2563eb] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider self-start"
            >
              <ArrowLeft className="w-4 h-4 text-[#64748b]" />
              <span>&larr; Quay lại danh sách đợt báo cáo</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold mt-1">
              <span>Đợt báo cáo</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-[#014285] font-bold">Chi tiết đợt báo cáo</span>
            </div>
          </div>

          {/* Title Area and Primary Action exactly matching screenshot design */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-black text-[#0f2942] tracking-tight">
                {activePeriodDetail?.name || "Báo cáo kết quả thực hiện NTM - Quý IV Năm 2024"}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 font-bold text-amber-700 bg-[#fff7ed] border border-orange-100 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse block" />
                  Đang diễn ra
                </span>
                <span className="text-[#64748b] font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Hạn chót: {activePeriodDetail ? new Date(activePeriodDetail.deadline).toLocaleDateString('vi-VN') : "31/12/2024"}
                </span>
              </div>
            </div>

            {(isCommune || isProvince) && (
              <button
                onClick={handleSubmitAll}
                className={`px-5 py-2.5 font-extrabold text-xs rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm ${isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
                  : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-450 border border-slate-200'
                  }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {isCommune ? 'Gửi thẩm định hồ sơ Xã' : 'Gửi Bộ tổng hợp'}
                </span>
              </button>
            )}
          </div>

          {/* Four High-Contrast KPI Stats matching the reference mockup box-for-box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Box 1: TỔNG SỐ BIỂU MẪU */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase text-[#64748b] tracking-wider">
                  Tổng số biểu mẫu
                </p>
                <h3 className="text-3xl font-black text-[#0f2942]">
                  {activePeriodDetail?.forms.length || 11}
                </h3>
              </div>
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Box 2: ĐÃ HOÀN THÀNH */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase text-[#64748b] tracking-wider">
                  Đã hoàn thành
                </p>
                <h3 className="text-3xl font-black text-[#10b981]">
                  {activePeriodDetail?.forms.filter(f => f.status === 'APPROVED' || f.status === 'SUPERVISED').length}/{activePeriodDetail?.forms.length || 11}
                </h3>
              </div>
              <div className="p-3 bg-[#ecfdf5] text-[#10b981] rounded-xl border border-[#d1fae5]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Box 3: CHỜ THẨM ĐỊNH */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase text-[#64748b] tracking-wider">
                  Chờ thẩm định
                </p>
                <h3 className="text-3xl font-black text-amber-600">
                  {activePeriodDetail?.forms.filter(f => f.status === 'SUBMITTED').length}
                </h3>
              </div>
              <div className="p-3 bg-[#fffbeb] text-amber-500 rounded-xl border border-[#fef3c7]">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Box 4: CẦN CHỈNH SỬA */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase text-[#64748b] tracking-wider">
                  Cần chỉnh sửa
                </p>
                <h3 className="text-3xl font-black text-rose-600">
                  {activePeriodDetail?.forms.filter(f => f.status === 'REJECTED').length}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-500 rounded-xl border border-rose-100">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Checklist tiến độ nộp của vai trò Xã hoặc Tỉnh */}
          {(isCommune || isProvince) && (
            <div className="bg-white p-5.5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase text-[#014285] tracking-wider font-sans">
                    {isCommune ? 'Danh sách kiểm chuẩn hồ sơ cấp Xã (Biểu 10, 11, 12, 13)' : 'Danh sách kiểm chuẩn báo cáo cấp Tỉnh gửi Bộ (Biểu 04, 05, 06, 07, 08, 09)'}
                  </h4>
                  <p className="text-[11px] text-[#64748b] mt-1 font-semibold leading-relaxed">
                    {isCommune ? 'Cần hoàn thiện toàn bộ nhóm biểu dưới đây trước khi gửi Thẩm định tỉnh.' : 'Cần hoàn thiện toàn bộ báo cáo cấp tỉnh trước khi gửi trực tiếp Bộ Trung ương.'}
                  </p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 'bg-amber-50 text-amber-600 border border-amber-200/50'}`}>
                  {isCompleted ? 'Đủ điều kiện gửi' : 'Chưa hoàn tất'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {targetFormCodes.map((code) => {
                  const formItem = activePeriodDetail?.forms.find(f => f.code === code);
                  const isDone = formItem && (formItem.status === 'SUBMITTED' || formItem.status === 'APPROVED' || formItem.status === 'SUPERVISED');
                  const isRejected = formItem && formItem.status === 'REJECTED';
                  const isSavedDraft = formItem && formItem.status === 'DRAFT' && (formItem.code === 'Biểu 06' || (formItem.updatedAt && formItem.updatedAt !== '2026-05-20T03:00:00Z'));

                  return (
                    <div key={code} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-150 text-xs font-semibold hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : isRejected ? (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        ) : isSavedDraft ? (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block shrink-0" />
                        )}
                        <span className="text-slate-700 font-bold truncate max-w-[280px]">
                          <strong>{code}</strong>: {formItem?.title}
                        </span>
                      </div>
                      <span className="shrink-0 ml-2">
                        {isDone ? (
                          <span className="text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">Đã nhập</span>
                        ) : isRejected ? (
                          <span className="text-rose-600 font-black bg-rose-50 px-2 py-0.5 rounded text-[10px] uppercase">Tiếp tục chỉnh</span>
                        ) : isSavedDraft ? (
                          <span className="text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded text-[10px] uppercase">Lưu nháp</span>
                        ) : (
                          <span className="text-[#64748b] font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase">Chưa nhập</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subheader and dropdown filtering section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-2">
            <div>
              <h3 className="text-sm font-black text-[#0f2942] tracking-tight uppercase">
                Danh sách biểu mẫu cần nộp{" "}
                <span className="text-xs text-[#64748b] font-medium lowercase tracking-normal bg-slate-100 px-2 py-0.5 rounded ml-1 border border-slate-200">
                  lưu ý: các biểu mẫu có dấu * là bắt buộc
                </span>
              </h3>
            </div>

            <div className="relative self-end sm:self-auto">
              <select
                value={filterFormStatus}
                onChange={(e) => setFilterFormStatus(e.target.value)}
                className="pl-8 pr-8 py-2 bg-white border border-slate-200 hover:border-slate-350 rounded-lg text-xs font-bold text-[#475569] shadow-sm cursor-pointer outline-none appearance-none"
              >
                <option value="ALL">Lọc theo trạng thái: Tất cả</option>
                <option value="DA_NHAP">Đã nhập</option>
                <option value="LUU_NHAP">Lưu nháp</option>
                <option value="TIEP_TUC_CHINH">Tiếp tục chỉnh</option>
                <option value="CHUA_NHAP">Chưa nhập</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Forms List Grid responsive columns matching the beautiful grid spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activePeriodDetail?.forms || [])
              .filter((form) => {
                if (isCommune && !['Biểu 10', 'Biểu 11', 'Biểu 12', 'Biểu 13'].includes(form.code)) {
                  return false;
                }
                if (isProvince && !['Biểu 04', 'Biểu 05', 'Biểu 06', 'Biểu 07', 'Biểu 08', 'Biểu 09'].includes(form.code)) {
                  return false;
                }
                if (filterFormStatus === 'ALL') return true;
                if (filterFormStatus === 'DA_NHAP') return form.status === 'APPROVED' || form.status === 'SUPERVISED' || form.status === 'SUBMITTED';
                if (filterFormStatus === 'LUU_NHAP') {
                  return form.status === 'DRAFT' && (form.code === 'Biểu 06' || (form.updatedAt && form.updatedAt !== '2026-05-20T03:00:00Z'));
                }
                if (filterFormStatus === 'TIEP_TUC_CHINH') return form.status === 'REJECTED';
                if (filterFormStatus === 'CHUA_NHAP') {
                  const isSavedDraft = form.status === 'DRAFT' && (form.code === 'Biểu 06' || (form.updatedAt && form.updatedAt !== '2026-05-20T03:00:00Z'));
                  return form.status === 'DRAFT' && !isSavedDraft;
                }
                return true;
              })
              .map((form) => {
                // Determine layout checks
                const isRequired = form.code !== 'Biểu 08' && form.code !== 'Biểu 13';

                // Set appropriate description labels matching mock screenshot titles
                let bodyText = form.title;
                if (form.code === 'Biểu 10') bodyText = 'Báo cáo đánh giá chi tiết 47 tiêu chí xây dựng nông thôn mới theo Quyết định của Thủ tướng Chính phủ.';
                if (form.code === 'Biểu 06') bodyText = 'Số liệu chi tiết về giao thông, thủy lợi, điện và cơ sở vật chất văn hóa trên địa bàn xã.';
                if (form.code === 'Biểu 07') bodyText = 'Tổng hợp kết quả huy động nguồn lực thực hiện chương trình 6 tháng / năm ... (Tỉnh)';
                if (form.code === 'Biểu 08') bodyText = 'Thành quả đầu tư và phân bố ngân sách trung ương hằng năm phục vụ các hạ tầng thiết yếu.';
                if (form.code === 'Biểu 09') bodyText = 'Số liệu chi tiết về huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng / năm (Cấp Tỉnh).';
                if (form.code === 'Biểu 12') bodyText = 'Số liệu chi tiết về huy động và thực hiện nguồn lực đầu tư thực hiện chương trình 6 tháng / năm (Cấp Xã).';
                if (form.code === 'Biểu 13') bodyText = 'Thành quả đầu tư và phân bố ngân sách trung ương hằng năm phục vụ các hạ tầng thiết yếu (Cấp xã).';
                if (form.code === 'Biểu 11') bodyText = 'Tình trạng đạt chuẩn quốc gia của các trường học và trạm y tế nông nghiệp địa bàn.';

                const isSavedDraft = form.status === 'DRAFT' && (form.code === 'Biểu 06' || (form.updatedAt && form.updatedAt !== '2026-05-20T03:00:00Z'));
                const isNotStarted = form.status === 'DRAFT' && !isSavedDraft;

                let badgeBg = 'bg-slate-50 text-[#64748b] border-slate-200';
                let badgeLabel = 'Chưa nhập';
                let calcComplete = 0;

                if (form.status === 'APPROVED' || form.status === 'SUPERVISED' || form.status === 'SUBMITTED') {
                  badgeBg = 'bg-[#ecfdf5] text-[#10b981] border-emerald-100';
                  badgeLabel = 'Đã nhập';
                  calcComplete = 100;
                } else if (isSavedDraft) {
                  badgeBg = 'bg-[#fffbeb] text-[#f59e0b] border-amber-100';
                  badgeLabel = 'Lưu nháp';
                  calcComplete = 65;
                } else if (isNotStarted) {
                  badgeBg = 'bg-slate-50 text-[#64748b] border-slate-200';
                  badgeLabel = 'Chưa nhập';
                  calcComplete = 0;
                } else if (form.status === 'REJECTED') {
                  badgeBg = 'bg-[#fef2f2] text-[#ef4444] border-red-100';
                  badgeLabel = 'Tiếp tục chỉnh';
                  calcComplete = 40;
                }

                return (
                  <div
                    key={form.code}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-md transition-all flex flex-col justify-between group h-full relative"
                  >
                    <div>
                      {/* Top Header Row with status badge */}
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-xs font-black text-[#2563eb] bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100">
                          Mẫu số {form.code.replace('Biểu ', '')}{isRequired ? ' *' : ''}
                        </span>

                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${badgeBg}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current block" />
                          {badgeLabel}
                        </span>
                      </div>

                      {/* Component Title details */}
                      <h4
                        onClick={() => onSelectForm(activePeriodDetail.id, form.code)}
                        className="text-sm font-bold text-[#0f2942] group-hover:text-primary transition-colors leading-snug cursor-pointer mt-4 min-h-[44px] flex items-start"
                      >
                        {form.title}
                      </h4>

                      {/* Card main text area or Rejection warning alert box if state is REJECTED */}
                      {form.status === 'REJECTED' ? (
                        <div className="bg-[#fff5f5] text-red-700 border border-red-100 p-3.5 rounded-xl mt-3 text-xs leading-relaxed">
                          <strong className="font-extrabold uppercase text-xs block mb-1 text-red-800">Lý do từ chối:</strong>
                          <span>
                            "{form.appraisal?.comment || "Số liệu hộ nghèo đa chiều chưa khớp với dữ liệu thực địa. Vui lòng rà soát kiểm định và gửi lại sổ sách."}"
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#64748b] font-medium leading-relaxed mt-1 min-h-[48px] block">
                          {bodyText}
                        </p>
                      )}

                    </div>

                    {/* Footer elements matching exact card styles */}
                    <div className="border-t border-[#f1f5f9] mt-5 pt-3.5 flex justify-between items-center text-xs">

                      {/* Left side Metadata indicator */}
                      <div>
                        {form.status === 'APPROVED' || form.status === 'SUPERVISED' ? (
                          <span className="text-xs text-[#64748b] font-semibold">
                            Cập nhật: 12/11/2024
                          </span>
                        ) : form.status === 'REJECTED' ? (
                          <span className="text-xs text-[#64748b] font-semibold">
                            Phản hồi: 1 giờ trước
                          </span>
                        ) : form.status === 'SUBMITTED' ? (
                          <span className="text-xs text-[#64748b] font-semibold">
                            Đã nộp: 10/11/2024
                          </span>
                        ) : isSavedDraft ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#64748b] font-bold">Tiến độ: 65%</span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden inline-block">
                              <div className="bg-[#f59e0b] h-full" style={{ width: '65%' }} />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#64748b] font-semibold">
                            Dự kiến hoàn thành: {(form.code === 'Biểu 08' || form.code === 'Biểu 13') ? '25/12' : '28/12'}
                          </span>
                        )}
                      </div>

                      {/* Right side interactive button portal */}
                      <div>
                        {form.status === 'APPROVED' || form.status === 'SUPERVISED' ? (
                          <button
                            onClick={() => onSelectForm(activePeriodDetail.id, form.code)}
                            className="text-xs font-black text-[#2563eb] hover:underline flex items-center gap-1 hover:text-[#1d4ed8] cursor-pointer"
                          >
                            <span>Click - Xem chi tiết</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : form.status === 'REJECTED' ? (
                          <button
                            onClick={() => onSelectForm(activePeriodDetail.id, form.code)}
                            className="px-3.5 py-1.5 bg-[#ef4444] text-white hover:bg-red-650 text-xs font-black rounded-lg shadow-sm cursor-pointer transition-all"
                          >
                            Chỉnh sửa ngay
                          </button>
                        ) : form.status === 'SUBMITTED' ? (
                          <button
                            onClick={() => onSelectForm(activePeriodDetail.id, form.code)}
                            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-755 hover:bg-slate-50 text-xs font-black rounded-lg shadow-sm cursor-pointer transition-all"
                          >
                            Xem bản in
                          </button>
                        ) : isSavedDraft ? (
                          <button
                            onClick={() => onSelectForm(activePeriodDetail.id, form.code)}
                            className="px-3.5 py-1.5 bg-[#014285] text-white hover:bg-[#0b4aa6] text-xs font-black rounded-lg shadow-sm cursor-pointer transition-all"
                          >
                            Tiếp tục
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectForm(activePeriodDetail.id, form.code)}
                            className="px-3.5 py-1.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 text-xs font-black rounded-lg shadow-sm cursor-pointer transition-all"
                          >
                            Nhập liệu
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
          </div>

          {/* Guidelines Process Info Banner exactly matching the bottom elements of the screenshot */}
          <div className="bg-[#eff6ff] rounded-2xl border border-blue-200 p-5 flex items-start gap-4">
            <div className="p-2.5 bg-[#dbeafe] text-[#1d4ed8] rounded-xl shrink-0 mt-0.5 shadow-sm border border-blue-100">
              <HelpCircle className="w-5.5 h-5.5 font-bold" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-black text-[#1d4ed8] uppercase tracking-wider">
                Hướng dẫn quy trình nộp báo cáo
              </h4>
              <ul className="space-y-2 text-xs text-[#3b82f6] font-extrabold select-none">
                <li className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-105/10 text-[#1d4ed8] text-xs font-black shrink-0">
                    1
                  </span>
                  <span>Hoàn thành tất cả các biểu mẫu có dấu sao (*) để kích hoạt nút "Gửi tất cả báo cáo".</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-105/10 text-[#1d4ed8] text-xs font-black shrink-0">
                    2
                  </span>
                  <span>Sau khi nộp, cán bộ thẩm định cấp Tỉnh sẽ phản hồi trong vòng 3-5 ngày làm việc.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-105/10 text-[#1d4ed8] text-xs font-black shrink-0">
                    3
                  </span>
                  <span>Trong trường hợp bị trả lại, vui lòng xem chi tiết lý do và chính sửa theo yêu cầu.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* CRUD Reporting Period Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full py-4 px-6 shadow-2xl border border-slate-100 animate-slide-up">

            <div className="flex justify-between items-start mb-4 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#2563eb] rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f2942]">Đề xuất đợt báo cáo mới</h4>
                  <p className="text-xs text-slate-500 font-semibold">Sinh chu trình biểu mẫu hằng năm giai đoạn 2026</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Cấp báo cáo</label>
                  <input
                    type="text"
                    disabled
                    value={userSession.role === 'SUPERVISOR' ? 'Báo cáo cấp Tỉnh (Gửi các Tỉnh)' : 'Báo cáo cấp Xã (Gửi các Xã)'}
                    className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Tên đợt báo cáo</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Ví dụ: Đợt báo cáo NTM 6 tháng đầu năm 2024"
                    className="w-full text-xs p-2.5 border border-slate-200 outline-none rounded-lg focus:border-[#2563eb] bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Năm báo cáo</label>
                  <select
                    value={pYear}
                    onChange={(e) => setPYear(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                  >
                    <option value="2024">Năm 2024</option>
                    <option value="2025">Năm 2025</option>
                    <option value="2026">Năm 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Kỳ kiểm phẩm</label>
                  <select
                    value={pTerm}
                    onChange={(e) => setPTerm(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                  >
                    <option value="6 tháng đầu năm">6 Tháng đầu năm</option>
                    <option value="Toàn diện cả năm">Toàn diện cả năm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Hạn cuối gửi báo cáo</label>
                <input
                  type="date"
                  required
                  value={pDeadline}
                  onChange={(e) => setPDeadline(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                />
              </div>

              {/* Targets checklist selection */}
              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1.5 uppercase tracking-wider">
                  {userSession.role === 'SUPERVISOR' ? 'Chọn các Tỉnh nhận yêu cầu' : 'Chọn các Xã nhận yêu cầu'}
                </label>
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-36 overflow-y-auto space-y-2" style={{ height: "95px" }}>
                  {(userSession.role === 'SUPERVISOR'
                    ? provinces.map(p => p.name)
                    : communes.map(c => c.name)
                  ).map((target) => {
                    const isChecked = selectedTargets.includes(target);
                    return (
                      <label key={target} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTargets((prev) => [...prev, target]);
                            } else {
                              setSelectedTargets((prev) => prev.filter((t) => t !== target));
                            }
                          }}
                          className="w-3.5 h-3.5 text-[#2563eb] border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span>{target}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Forms checklist selection */}
              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1.5 uppercase tracking-wider">
                  Chọn các biểu mẫu áp dụng <span className="text-red-500">*</span>
                </label>
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-40 overflow-y-auto space-y-2">
                  {(() => {
                    const customTemplatesJson = localStorage.getItem('NTM_FormTemplates');
                    let customTemplates: any[] = [];
                    if (customTemplatesJson) {
                      try { customTemplates = JSON.parse(customTemplatesJson); } catch (e) { }
                    }
                    const allAvailable = [
                      ...FORM_METAS,
                      ...customTemplates.map(t => ({ code: t.code, title: t.title, isCustom: true }))
                    ];
                    return allAvailable.map((form) => {
                      const isChecked = selectedFormCodes.includes(form.code);
                      return (
                        <label key={form.code} className="flex items-start gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFormCodes((prev) => [...prev, form.code]);
                              } else {
                                setSelectedFormCodes((prev) => prev.filter((c) => c !== form.code));
                              }
                            }}
                            className="w-3.5 h-3.5 mt-0.5 text-[#2563eb] border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className="text-[#014285] font-black">{form.code}:</span>{' '}
                            <span className="text-slate-650 font-semibold">{form.title}</span>
                          </div>
                        </label>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-100 flex gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-normal font-medium">
                  <strong>Chú ý nghiệp vụ:</strong> Việc thiết tạo đợt rà soát mới sẽ tự kích hoạt nhân bản các Phụ biểu đã chọn chứa các trọng số và cơ sở phân loại chuẩn nông thôn mới.
                </p>
              </div> */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-305 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563eb] text-white text-xs font-black rounded-lg hover:bg-[#1d4ed8] shadow-sm cursor-pointer"
                >
                  Khởi tạo đợt mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Reporting Period Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full px-6 py-4 shadow-2xl border border-slate-100 animate-slide-up">

            <div className="flex justify-between items-start mb-4 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#014285] rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f2942]">Hiệu chỉnh đợt báo cáo</h4>
                  <p className="text-xs text-slate-500 font-semibold">Cập nhật thông tin chu trình biểu mẫu</p>
                </div>
              </div>
              <button onClick={() => { setShowEditModal(false); setActivePeriod(null); }} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Tên đợt báo cáo</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="Ví dụ: Đợt báo cáo NTM 6 tháng đầu năm 2024"
                  className="w-full text-xs p-2.5 border border-slate-200 outline-none rounded-lg focus:border-[#014285] bg-slate-50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Năm báo cáo</label>
                  <select
                    value={pYear}
                    onChange={(e) => setPYear(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                  >
                    <option value="2024">Năm 2024</option>
                    <option value="2025">Năm 2025</option>
                    <option value="2026">Năm 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Kỳ kiểm phẩm</label>
                  <select
                    value={pTerm}
                    onChange={(e) => setPTerm(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                  >
                    <option value="6 tháng đầu năm">6 Tháng đầu năm</option>
                    <option value="Toàn diện cả năm">Toàn diện cả năm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Hạn cuối gửi báo cáo</label>
                <input
                  type="date"
                  required
                  value={pDeadline}
                  onChange={(e) => setPDeadline(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                />
              </div>

              {/* Targets checklist selection */}
              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1.5 uppercase tracking-wider">
                  {userSession.role === 'SUPERVISOR' ? 'Chọn các Tỉnh nhận yêu cầu' : 'Chọn các Xã nhận yêu cầu'}
                </label>
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-36 overflow-y-auto space-y-2" style={{ height: "95px" }}>
                  {(userSession.role === 'SUPERVISOR'
                    ? provinces.map(p => p.name)
                    : communes.map(c => c.name)
                  ).map((target) => {
                    const isChecked = selectedTargets.includes(target);
                    return (
                      <label key={target} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTargets((prev) => [...prev, target]);
                            } else {
                              setSelectedTargets((prev) => prev.filter((t) => t !== target));
                            }
                          }}
                          className="w-3.5 h-3.5 text-[#2563eb] border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span>{target}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Forms checklist selection */}
              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1.5 uppercase tracking-wider">
                  Chọn các biểu mẫu áp dụng <span className="text-red-500">*</span>
                </label>
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-40 overflow-y-auto space-y-2">
                  {(() => {
                    const customTemplatesJson = localStorage.getItem('NTM_FormTemplates');
                    let customTemplates: any[] = [];
                    if (customTemplatesJson) {
                      try { customTemplates = JSON.parse(customTemplatesJson); } catch (e) { }
                    }
                    const allAvailable = [
                      ...FORM_METAS,
                      ...customTemplates.map(t => ({ code: t.code, title: t.title, isCustom: true }))
                    ];
                    return allAvailable.map((form) => {
                      const isChecked = selectedFormCodes.includes(form.code);
                      return (
                        <label key={form.code} className="flex items-start gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFormCodes((prev) => [...prev, form.code]);
                              } else {
                                setSelectedFormCodes((prev) => prev.filter((c) => c !== form.code));
                              }
                            }}
                            className="w-3.5 h-3.5 mt-0.5 text-[#2563eb] border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className="text-[#014285] font-black">{form.code}:</span>{' '}
                            <span className="text-slate-650 font-semibold">{form.title}</span>
                          </div>
                        </label>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setActivePeriod(null); }}
                  className="flex-1 py-2.5 border border-slate-305 text-slate-605 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#014285] hover:bg-[#002b54] text-white text-xs font-black rounded-lg shadow-sm cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Xã mới */}
      {showAddCommuneModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans select-none">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">

            <div className="flex justify-between items-start mb-4 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-550/10 bg-blue-50 text-[#014285] rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f2942]">Khởi tạo Xã quản lý mới</h4>
                  <p className="text-xs text-slate-500 font-semibold">Tỉnh thiết lập và gán nhóm cho đơn vị xã</p>
                </div>
              </div>
              <button onClick={() => setShowAddCommuneModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommune} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Tên đơn vị Xã <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Xã Thụy Hải"
                  value={newCommuneName}
                  onChange={(e) => setNewCommuneName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb] transition-all bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Mã Xã <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 23180"
                  value={newCommuneCode}
                  onChange={(e) => setNewCommuneCode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb] transition-all bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Tỉnh trực thuộc <span className="text-red-500">*</span></label>
                <select
                  value={newCommuneProvince}
                  onChange={(e) => setNewCommuneProvince(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb] transition-all bg-white cursor-pointer"
                >
                  {provinces.map(p => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#475569] block mb-1 uppercase tracking-wider">Phân nhóm Xã <span className="text-red-500">*</span></label>
                <select
                  value={newCommuneGroup}
                  onChange={(e) => setNewCommuneGroup(e.target.value as 'I' | 'II' | 'III')}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none font-bold text-[#014285] focus:border-[#2563eb] transition-all bg-white cursor-pointer font-sans"
                >
                  <option value="I">Nhóm I - Đồng bằng nâng cao</option>
                  <option value="II">Nhóm II - Cận du biên</option>
                  <option value="III">Nhóm III - Hải đảo, Vùng khó khăn đặc biệt</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCommuneModal(false)}
                  className="flex-1 py-2.5 border border-slate-250 text-slate-500 font-extrabold text-xs rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#014285] hover:bg-[#002a54] text-white font-black text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Khởi tạo Xã
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DETAILED COMMUNE STATUS DETAILS MODAL VIEW */}
      {selectedCommuneDetails && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">

            <div className="flex justify-between items-start mb-4 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#2563eb] rounded-lg">
                  <BookmarkCheck className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f2942]">{selectedCommuneDetails.name}</h4>
                  <p className="text-xs text-[#64748b] font-bold">Trích lục trạng thái hồ sơ số rà soát chỉ tiêu</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCommuneDetails(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs block">Mã cơ sở địa bàn</span>
                  <span className="text-[#0f2942] font-black text-sm">{selectedCommuneDetails.code}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs block">Tỉnh trực thuộc</span>
                  <span className="text-[#0f2942] font-black text-sm">{selectedCommuneDetails.province}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-extrabold text-[#0f2942] text-xs uppercase tracking-wide">Trạng thái rà soát Phụ biểu 04 - 13</h5>

                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                  <div className="p-2.5 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-slate-500">Mẫu biểu đã nộp</span>
                    <span className="font-black text-[#0f2942]">{selectedCommuneDetails.submitted} / {selectedCommuneDetails.total} phụ biểu</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="font-bold text-slate-500">Người cập nhật gần nhất</span>
                    <span className="font-black text-slate-700">Nguyễn Văn Bình (Chuyên viên Xã)</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="font-bold text-slate-500">Cập nhật lần cuối</span>
                    <span className="font-black text-slate-700 font-mono">{selectedCommuneDetails.updatedAt}</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="font-bold text-slate-500">Hồ sơ thẩm định</span>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Sẵn sàng công lập
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-2">
                <h5 className="font-extrabold text-blue-900 text-xs uppercase">Nhật ký thụ kiểm</h5>
                <p className="text-slate-600 leading-relaxed font-semibold">
                  "Số liệu của xã đạt chuẩn 4/4 chỉ tiêu kinh tế, đã gửi chữ ký số CA của Chủ tịch UBND xã tối qua. Tiến trình thụ kiểm hồ sơ sang văn phòng Thẩm định liên ngành của Tỉnh."
                </p>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCommuneDetails(null);
                    triggerToast("Bắt đầu cuộc gọi kết nối trực tuyến...", "success");
                  }}
                  className="flex-1 py-2 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 cursor-pointer text-center"
                >
                  Liên hệ chuyên viên
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCommuneDetails(null)}
                  className="flex-1 py-2 bg-[#2563eb] text-white font-black rounded-lg hover:bg-[#1d4ed8] cursor-pointer text-center"
                >
                  Đóng cửa sổ
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
