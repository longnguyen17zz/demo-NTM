import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Plus,
  PlusCircle,
  Edit3,
  Trash2,
  FileText,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
  Download,
  Save,
  SlidersHorizontal,
  X,
  Check,
  AlertCircle,
  FileDown,
  Briefcase
} from 'lucide-react';
import { Criterion, UserSession } from '../types';

interface CriteriaTabProps {
  criteria: Criterion[];
  categories: string[];
  userSession: UserSession;
  onAddCriterion: (newC: Criterion) => void;
  onEditCriterion: (updatedC: Criterion) => void;
  onDeleteCriterion: (id: string) => void;
}

export default function CriteriaTab({
  criteria,
  categories: dynamicCategories,
  userSession,
  onAddCriterion,
  onEditCriterion,
  onDeleteCriterion,
}: CriteriaTabProps) {
  // Navigation tabs list
  const categories = [
    'Tất cả',
    ...dynamicCategories
  ];

  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  // Interactive Quick addition of evidence states
  const [showQuickProofInput, setShowQuickProofInput] = useState<string | null>(null);
  const [newProofText, setNewProofText] = useState('');

  // CRUD Form Overlays
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeCriterion, setActiveCriterion] = useState<Criterion | null>(null);

  // Advanced Filters toggle
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterThresholdType, setFilterThresholdType] = useState<string>('all');

  // Form Field States
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState(dynamicCategories[0] || 'Quy hoạch');
  const [formWeight, setFormWeight] = useState('10%');
  const [formThresholdType, setFormThresholdType] = useState<'boolean' | 'percentage'>('boolean');
  const [formGroup1, setFormGroup1] = useState('Đạt');
  const [formGroup2, setFormGroup2] = useState('Đạt');
  const [formGroup3, setFormGroup3] = useState('Đạt');
  const [formProofs, setFormProofs] = useState<string[]>([]);
  const [proofInput, setProofInput] = useState('');

  // Show dynamic toast messages
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Safe Mapping Mapper
  const getMappedCriterion = (item: Criterion) => {
    return {
      ...item,
      category: item.category || 'Quy hoạch',
      group1Threshold: item.group1Threshold || 'Đạt',
      group2Threshold: item.group2Threshold || 'Đạt',
      group3Threshold: item.group3Threshold || 'Đạt',
      thresholdType: item.thresholdType || 'boolean',
      proofs: item.proofs || (item.indicator ? [item.indicator] : ['Báo cáo thẩm định'])
    };
  };

  // Category filter + search filter
  const processedCriteria = criteria.map(getMappedCriterion).filter((item) => {
    const matchesTab = activeTab === 'Tất cả' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterThresholdType === 'all' || item.thresholdType === filterThresholdType;
    return matchesTab && matchesSearch && matchesType;
  });

  // Pagination bounds
  const totalPages = Math.ceil(processedCriteria.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCriteria = processedCriteria.slice(startIndex, startIndex + itemsPerPage);

  // Pagination Change
  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Add Proof tag to criterion rapidly
  const handleAddQuickProof = (cId: string) => {
    if (!newProofText.trim()) return;
    const item = criteria.find(c => c.id === cId);
    if (item) {
      const currentProofs = item.proofs || (item.indicator ? [item.indicator] : ['Báo cáo thẩm định']);
      const updatedProofs = [...currentProofs, newProofText.trim()];
      onEditCriterion({
        ...item,
        proofs: updatedProofs
      });
      triggerToast(`Đã thêm minh chứng vào tiêu chí ${item.code}`, 'success');
    }
    setNewProofText('');
    setShowQuickProofInput(null);
  };

  // Delete Proof tag rapidly
  const handleDeleteQuickProof = (cId: string, proofIndex: number) => {
    const item = criteria.find(c => c.id === cId);
    if (item) {
      const currentProofs = item.proofs || [];
      const updatedProofs = currentProofs.filter((_, idx) => idx !== proofIndex);
      onEditCriterion({
        ...item,
        proofs: updatedProofs
      });
      triggerToast(`Đã gỡ minh chứng khỏi tiêu chí ${item.code}`, 'info');
    }
  };

  // Handle Export configuration as simulated downloads
  const handleExportConfiguration = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(criteria, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `CauHinh_47_TieuChi_NTM_${new Date().getFullYear()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast("Xuất cấu hình tiêu chí thành công! Tập tin JSON đã tải về máy.", "success");
    } catch (e) {
      triggerToast("Lỗi hệ thống khi trích xuất tệp cấu dịch.", "info");
    }
  };

  // Save changes triggers persistent notification
  const handleSaveAllToCloud = () => {
    localStorage.setItem('NTM_Criteria', JSON.stringify(criteria));
    triggerToast("Đã đồng bộ toàn bộ sửa đổi danh mục lên máy chủ Ban chỉ đạo Trung ương!", "success");
  };

  // Opening add modal
  const handleOpenAdd = () => {
    const nextNum = criteria.length + 1;
    setFormCode(`TC${nextNum < 10 ? '0' + nextNum : nextNum}`);
    setFormTitle('');
    setFormDesc('');
    setFormCategory(dynamicCategories[0] || 'Quy hoạch');
    setFormWeight('10%');
    setFormThresholdType('boolean');
    setFormGroup1('Đạt');
    setFormGroup2('Đạt');
    setFormGroup3('Đạt');
    setFormProofs(['Quyết định phê duyệt', 'Bản đồ quy hoạch']);
    setProofInput('');
    setShowAddModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCode.trim()) return;

    const newCriterion: Criterion = {
      id: `c-${Date.now()}`,
      code: formCode,
      title: formTitle,
      description: formDesc || 'Chưa cung cấp mô tả chi tiết yêu cầu thẩm duyệt',
      indicator: formProofs[0] || 'Tài liệu thẩm định',
      weight: formWeight,
      category: formCategory,
      thresholdType: formThresholdType,
      group1Threshold: formGroup1,
      group2Threshold: formGroup2,
      group3Threshold: formGroup3,
      proofs: formProofs
    };

    onAddCriterion(newCriterion);
    setShowAddModal(false);
    triggerToast(`Đã kiến thiết thành công tiêu chí mới: ${formCode}`);
  };

  // Open edit modal
  const handleOpenEdit = (c: Criterion) => {
    const mapped = getMappedCriterion(c);
    setActiveCriterion(c);
    setFormCode(mapped.code);
    setFormTitle(mapped.title);
    setFormDesc(mapped.description);
    setFormCategory(mapped.category);
    setFormWeight(mapped.weight);
    setFormThresholdType(mapped.thresholdType as 'boolean' | 'percentage');
    setFormGroup1(mapped.group1Threshold);
    setFormGroup2(mapped.group2Threshold);
    setFormGroup3(mapped.group3Threshold);
    setFormProofs(mapped.proofs);
    setProofInput('');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCriterion || !formTitle.trim()) return;

    const updated: Criterion = {
      ...activeCriterion,
      code: formCode,
      title: formTitle,
      description: formDesc,
      category: formCategory,
      weight: formWeight,
      thresholdType: formThresholdType,
      group1Threshold: formGroup1,
      group2Threshold: formGroup2,
      group3Threshold: formGroup3,
      proofs: formProofs,
      indicator: formProofs[0] || 'Yêu cầu đi kèm'
    };

    onEditCriterion(updated);
    setShowEditModal(false);
    setActiveCriterion(null);
    triggerToast(`Cập nhật thành công nội dung cấu hình ${formCode}`, 'success');
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy bỏ vĩnh viễn tiêu chí [${code}]? Điều này sẽ gỡ liên kết dữ liệu khỏi các báo cáo đang cập nhật.`)) {
      onDeleteCriterion(id);
      triggerToast(`Đã xóa bỏ tiêu chí ${code}`, 'info');
    }
  };

  // Add individual proof chips in modal
  const addFormProofTag = () => {
    if (proofInput.trim() && !formProofs.includes(proofInput.trim())) {
      setFormProofs([...formProofs, proofInput.trim()]);
      setProofInput('');
    }
  };

  const removeFormProofTag = (index: number) => {
    setFormProofs(formProofs.filter((_, idx) => idx !== index));
  };

  // Component render
  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans" id="criteria-management-container">

      {/* Toast Alert Portal Inside Layout */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0f2942]/95 backdrop-blur-md text-white border border-[#2563eb]/30 py-3.5 px-5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] z-9999 flex items-center gap-3 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold leading-tight">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Breadcrumb inside Tab Panel */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
          <span>Hệ thống</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>Quản lý danh mục</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#2563eb] font-bold">47 Tiêu chí NTM</span>
        </div>

        {/* Title Header with Floating Actions */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2">
          <div>
            <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Cấu hình Bộ tiêu chí Quốc gia</h2>
            <p className="text-xs text-[#64748b] font-medium mt-1">
              Thiết lập nội dung, ngưỡng đạt và tệp minh chứng cho giai đoạn 2026 - 2030
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end lg:self-auto">
            <button
              onClick={handleExportConfiguration}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-[#475569] flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
              title="Xuất bản ghi cấu hình định dạng JSON"
            >
              <FileDown className="w-4 h-4 text-[#64748b]" />
              <span>Xuất file cấu hình</span>
            </button>

            <button
              onClick={handleSaveAllToCloud}
              className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              title="Ghi nhận toàn bộ thay đổi lên máy chủ trung tâm"
            >
              <Save className="w-4 h-4" />
              <span>Lưu toàn bộ thay đổi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-card Row (KPI statistics blocks and badges matching exact details) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1 */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-[#64748b] uppercase tracking-wider">Tổng số tiêu chí</span>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Ổn định
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0f2942]">10</span>
            <span className="text-sm font-semibold text-slate-400">/ 10</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-[#64748b] uppercase tracking-wider">Tiêu chí thành phần</span>
            <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Cần rà soát
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0f2942]">34</span>
            <span className="text-sm font-semibold text-slate-400">/ 47</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#64748b] uppercase tracking-wider block">Yêu cầu minh chứng (TB)</span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#0f2942]">3.4</span>
              <span className="text-xs font-bold text-slate-500">file/TC</span>
            </div>
          </div>
          <p className="text-xs text-[#2563eb] font-bold mt-3 hover:underline cursor-pointer flex items-center gap-1">
            Xem kế hoạch số liệu đính kèm →
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#64748b] uppercase tracking-wider block">Nhóm xã áp dụng</span>
            <div className="mt-4">
              <span className="text-2xl font-black text-[#0f2942]">03 Nhóm</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-bold mt-3">
            Phân bộ mục tiêu tương thích địa lý
          </p>
        </div>

      </div>

      {/* Main filter bar & tabs & Search Input wrapper */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Navigation horizontal tab list */}
        <div className="flex flex-col md:flex-row border-b border-slate-100 p-2 md:p-3 justify-between items-center gap-3">

          <div className="flex items-center gap-1 md:gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
            {categories.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? 'bg-[#edf4f8] text-[#2563eb]'
                    : 'text-[#475569] hover:bg-slate-50'
                    }`}
                >
                  {tab}
                </button>
              );
            })}

            {/* Scroll Right Indicator Button */}
            <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 cursor-pointer shrink-0">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {/* Search inputs */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm nội dung yêu cầu..."
                className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-slate-200 focus:border-[#2563eb] rounded-lg text-xs font-bold outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${showAdvancedFilters ? 'bg-indigo-50 border-indigo-200 text-[#2563eb]' : 'bg-[#f8fafc] border-slate-200 text-slate-500'
                }`}
              title="Bộ lọc nâng cao"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Add Criterion Button */}
            {userSession.role === 'SUPERVISOR' && (
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm ND tiêu chí</span>
              </button>
            )}
          </div>

        </div>

        {/* Collapsible Advanced Filters Section */}
        {showAdvancedFilters && (
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center text-xs font-bold animate-slide-up">
            <span className="text-[#475569]">Lọc theo Ngưỡng Đạt:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterThresholdType('all')}
                className={`px-3 py-1 rounded-md border ${filterThresholdType === 'all' ? 'bg-[#2563eb] border-[#2563eb] text-white' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                Tất cả loại hình
              </button>
              <button
                onClick={() => setFilterThresholdType('boolean')}
                className={`px-3 py-1 rounded-md border ${filterThresholdType === 'boolean' ? 'bg-[#2563eb] border-[#2563eb] text-white' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                Nhị phân (Đạt / Không đạt)
              </button>
              <button
                onClick={() => setFilterThresholdType('percentage')}
                className={`px-3 py-1 rounded-md border ${filterThresholdType === 'percentage' ? 'bg-[#2563eb] border-[#2563eb] text-white' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                Định lượng (Tỷ lệ %)
              </button>
            </div>
            {searchTerm || filterThresholdType !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterThresholdType('all');
                }}
                className="text-[#ef4444] hover:underline ml-auto"
              >
                Xóa tất cả bộ lọc
              </button>
            ) : null}
          </div>
        )}

        {/* Main interactive catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-xs font-bold text-[#475569] uppercase border-b border-slate-200 tracking-wider">
                <th className="py-3 px-4 text-center w-16">STT</th>
                <th className="py-3 px-4 w-[42%]">Tên tiêu chí / Nội dung yêu cầu</th>
                <th className="py-3 px-3 text-center w-[11%]">Ngưỡng Nhóm 1</th>
                <th className="py-3 px-3 text-center w-[11%]">Ngưỡng Nhóm 2</th>
                <th className="py-3 px-3 text-center w-[11%]">Ngưỡng Nhóm 3</th>
                <th className="py-3 px-4 text-center w-[18%]">Minh chứng bắt buộc</th>
                <th className="py-3 px-4 text-center w-24">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-[#0f2942]">
              {paginatedCriteria.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-extrabold uppercase tracking-wide">
                    <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    Không tìm thấy dữ liệu tiêu chuẩn nông thôn mới tương thích!
                  </td>
                </tr>
              ) : (
                paginatedCriteria.map((item, idx) => {
                  const absoluteSTT = startIndex + idx + 1;
                  const formattedSTT = item.code || `TC${absoluteSTT < 10 ? '0' + absoluteSTT : absoluteSTT}`;
                  const isPercentage = item.thresholdType === 'percentage';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">

                      {/* 1. STT Column */}
                      <td className="py-5 px-4 text-center font-extrabold text-xs text-[#475569] select-none">
                        {formattedSTT}
                      </td>

                      {/* 2. Tên tiêu chí / nội dung */}
                      <td className="py-5 px-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-[#0f2942] leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#475569] font-medium leading-relaxed max-w-xl">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 pt-1.5">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded uppercase tracking-wider">
                              Phân loại: {item.category}
                            </span>
                            <span className="text-xs font-bold text-[#2563eb] bg-blue-50/60 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                              Trọng số: {item.weight}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Ngưỡng Nhóm 1 */}
                      <td className="py-5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          {isPercentage ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs font-black text-[#0f2942] bg-[#f1f5f9] border border-slate-200 px-2.5 py-1 rounded min-w-[32px] block text-center">
                                {item.group1Threshold}
                              </span>
                              <span className="text-xs font-bold text-[#64748b]">%</span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-md">
                              {item.group1Threshold || 'Đạt'}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-400 mt-1 uppercase block">
                            {isPercentage ? 'Tỷ lệ %' : 'Trạng thái'}
                          </span>
                        </div>
                      </td>

                      {/* 4. Ngưỡng Nhóm 2 */}
                      <td className="py-5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          {isPercentage ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs font-black text-[#0f2942] bg-[#f1f5f9] border border-slate-200 px-2.5 py-1 rounded min-w-[32px] block text-center">
                                {item.group2Threshold}
                              </span>
                              <span className="text-xs font-bold text-[#64748b]">%</span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-md">
                              {item.group2Threshold || 'Đạt'}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-400 mt-1 uppercase block">
                            {isPercentage ? 'Tỷ lệ %' : 'Trạng thái'}
                          </span>
                        </div>
                      </td>

                      {/* 5. Ngưỡng Nhóm 3 */}
                      <td className="py-5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          {isPercentage ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs font-black text-[#0f2942] bg-[#f1f5f9] border border-slate-200 px-2.5 py-1 rounded min-w-[32px] block text-center">
                                {item.group3Threshold}
                              </span>
                              <span className="text-xs font-bold text-[#64748b]">%</span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-md">
                              {item.group3Threshold || 'Đạt'}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-400 mt-1 uppercase block">
                            {isPercentage ? 'Tỷ lệ %' : 'Trạng thái'}
                          </span>
                        </div>
                      </td>

                      {/* 6. Minh chứng bắt buộc */}
                      <td className="py-5 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5 max-w-[150px] mx-auto">
                          {item.proofs?.map((proof, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-xs font-semibold text-[#475569] bg-[#f1f5f9] border border-slate-200 py-1 px-2.5 rounded flex items-center gap-1.5 w-full justify-between"
                            >
                              <span className="truncate" title={proof}>{proof}</span>
                              {userSession.role === 'EDITOR' && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuickProof(item.id, pIdx)}
                                  className="text-slate-400 hover:text-[#ef4444]"
                                  title="Gỡ minh chứng"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}

                          {/* Interactive Plus addition triggers popup input inside cell */}
                          {userSession.role === 'EDITOR' && (
                            <div className="relative w-full mt-1">
                              {showQuickProofInput === item.id ? (
                                <div className="absolute top-0 right-0 bg-white border border-[#2563eb]/20 shadow-xl p-1.5 rounded-lg z-20 flex gap-1 w-44">
                                  <input
                                    type="text"
                                    value={newProofText}
                                    onChange={(e) => setNewProofText(e.target.value)}
                                    placeholder="Tên văn bản..."
                                    className="text-xs p-1 border border-slate-200 rounded outline-none flex-1 font-semibold"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddQuickProof(item.id)}
                                  />
                                  <button
                                    onClick={() => handleAddQuickProof(item.id)}
                                    className="bg-[#2563eb] text-white px-1.5 rounded text-xs font-bold"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() => setShowQuickProofInput(null)}
                                    className="text-[#64748b] text-xs"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setNewProofText('');
                                    setShowQuickProofInput(item.id);
                                  }}
                                  className="w-7 h-7 rounded-full border border-dashed border-slate-300 hover:border-[#2563eb] text-slate-400 hover:text-[#2563eb] flex items-center justify-center transition-colors cursor-pointer"
                                  title="Bổ dung minh chứng yêu cầu"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 7. Action Commands */}
                      <td className="py-5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {userSession.role === 'EDITOR' ? (
                            <>
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1 px-1.5 text-slate-400 hover:text-[#2563eb] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Chỉnh sửa chi tiết tiêu chí"
                              >
                                <Edit3 className="w-3.8 h-3.8" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, formattedSTT)}
                                className="p-1 px-1.5 text-slate-400 hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Gỡ bỏ tiêu chí"
                              >
                                <Trash2 className="w-3.8 h-3.8" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 italic">Xem duy nhất</span>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic and authentic Pagination footer exactly as reference */}
        <div className="bg-[#f8fafc] border-t border-slate-200 px-4 py-3.5 flex items-center justify-between text-xs font-bold text-[#475569]">

          <div>
            Hiển thị <span className="text-[#0f2942] font-black">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, processedCriteria.length)}</span> / <span className="text-[#0f2942] font-black">{processedCriteria.length}</span> tiêu chí
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageSelect(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageIdx = index + 1;
              const isActive = currentPage === pageIdx;
              return (
                <button
                  key={pageIdx}
                  onClick={() => handlePageSelect(pageIdx)}
                  className={`w-7.5 h-7.5 text-xs rounded-lg flex items-center justify-center border transition-all cursor-pointer ${isActive
                    ? 'bg-[#2563eb] border-[#2563eb] text-white font-black shadow-sm'
                    : 'bg-white border-slate-200 text-[#475569] hover:bg-slate-50 font-extrabold'
                    }`}
                >
                  {pageIdx}
                </button>
              );
            })}

            <button
              onClick={() => handlePageSelect(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ADD SPECIFIC CRITERION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-slide-up max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-start mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#2563eb] rounded-lg">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f2942]">Kiến thiết Tiêu chí Quốc gia mới</h4>
                  <p className="text-xs text-slate-500 font-semibold">Thêm nội dung tiêu chí vào bộ khung nông thôn mới 2026-2030</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Mã số tiêu chí</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="TC04"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb]"
                  />
                </div>

                {/* <div>
                  <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Trọng số (%)</label>
                  <input
                    type="text"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="10%"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb]"
                  />
                </div> */}

                <div>
                  <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Tiêu chí</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb]"
                  >
                    {dynamicCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Tên nội dung tiêu chí</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Giao thông nông thôn mới"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Nội dung yêu cầu chi tiết</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Mô tả cụ thể các yêu cầu, trạng thái rà soát kiểm định..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-semibold text-slate-700 focus:border-[#2563eb]"
                />
              </div>

              <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200 space-y-3.5">
                <h5 className="text-xs font-bold text-[#0f2942] uppercase tracking-wider">Thiết lập ngưỡng chuẩn theo phân nhóm xã vùng đặc thù</h5>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Loại kiểm thẩm</label>
                    <select
                      value={formThresholdType}
                      onChange={(e) => {
                        const val = e.target.value as 'boolean' | 'percentage';
                        setFormThresholdType(val);
                        if (val === 'percentage') {
                          setFormGroup1('85');
                          setFormGroup2('75');
                          setFormGroup3('65');
                        } else {
                          setFormGroup1('Đạt');
                          setFormGroup2('Đạt');
                          setFormGroup3('Đạt');
                        }
                      }}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-bold outline-none"
                    >
                      <option value="boolean">Nhị phân (Đạt / Không)</option>
                      <option value="percentage">Phần trăm (Tỷ lệ %)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Vùng Nhóm 1 (Đồng bằng)</label>
                    <input
                      type="text"
                      required
                      value={formGroup1}
                      onChange={(e) => setFormGroup1(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-black text-center text-[#2563eb] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Vùng Nhóm 2 (Cận nghèo)</label>
                    <input
                      type="text"
                      required
                      value={formGroup2}
                      onChange={(e) => setFormGroup2(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-black text-center text-[#2563eb] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Vùng Nhóm 3 (Đặc thù)</label>
                    <input
                      type="text"
                      required
                      value={formGroup3}
                      onChange={(e) => setFormGroup3(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-black text-center text-[#2563eb] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Hồ sơ minh chứng quy định</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={proofInput}
                    onChange={(e) => setProofInput(e.target.value)}
                    placeholder="Nhập tên tài liệu, e.g. Bản đồ giao thông..."
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFormProofTag())}
                  />
                  <button
                    type="button"
                    onClick={addFormProofTag}
                    className="px-4 bg-[#edf4f8] text-[#2563eb] font-extrabold text-xs rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    Thêm tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2.5">
                  {formProofs.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-[#f1f5f9] border border-slate-200 px-2.5 py-1 rounded text-xs font-bold text-slate-600">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeFormProofTag(idx)} className="text-red-550 font-bold hover:text-red-700 ml-1">
                        ×
                      </button>
                    </span>
                  ))}
                  {formProofs.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Chưa chỉ định danh mục hồ sơ minh chứng cần thiết.</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Văn bản hướng dẫn thực hiện</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Đính kèm văn bản hướng dẫn thực hiện"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-bold text-slate-800 focus:border-[#2563eb]"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-250 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black rounded-lg shadow-md cursor-pointer"
                >
                  Đồng ý tạo mới
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT DETAILED CRITERION MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-slide-up max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-start mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#2563eb] rounded-lg">
                  <Edit3 className="w-5 h-5 flex shrink-0" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0f2942]">Cập nhật cấu hình: {formCode}</h4>
                  <p className="text-xs text-slate-500 font-semibold">Chỉnh sửa nội dung quy chuẩn thẩm định NTM quốc gia</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Mã số tiêu chí</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-850"
                  />
                </div>

                {/* <div>
                  <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Trọng số (%)</label>
                  <input
                    type="text"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-850"
                  />
                </div> */}

                <div>
                  <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Tiêu chí</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-850"
                  >
                    {dynamicCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Tên tiêu chí</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-850"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Nội dung yêu cầu chi tiết</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg outline-none font-semibold text-slate-700"
                />
              </div>

              <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200 space-y-3.5">
                <h5 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider">Thiết lập ngưỡng đạt theo nhóm xã vùng đặc thù</h5>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Loại kiểm thẩm</label>
                    <select
                      value={formThresholdType}
                      onChange={(e) => {
                        const val = e.target.value as 'boolean' | 'percentage';
                        setFormThresholdType(val);
                        if (val === 'percentage') {
                          setFormGroup1('85');
                          setFormGroup2('75');
                          setFormGroup3('65');
                        } else {
                          setFormGroup1('Đạt');
                          setFormGroup2('Đạt');
                          setFormGroup3('Đạt');
                        }
                      }}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-bold outline-none"
                    >
                      <option value="boolean">Nhị phân (Đạt / Không)</option>
                      <option value="percentage">Phần trăm (Tỷ lệ %)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Vùng Nhóm 1 (Đồng bằng)</label>
                    <input
                      type="text"
                      required
                      value={formGroup1}
                      onChange={(e) => setFormGroup1(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-black text-center text-[#2563eb] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Vùng Nhóm 2 (Cận nghèo)</label>
                    <input
                      type="text"
                      required
                      value={formGroup2}
                      onChange={(e) => setFormGroup2(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-black text-center text-[#2563eb] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Vùng Nhóm 3 (Đặc thù)</label>
                    <input
                      type="text"
                      required
                      value={formGroup3}
                      onChange={(e) => setFormGroup3(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded font-black text-center text-[#2563eb] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] block mb-1 uppercase tracking-wider">Hồ sơ minh chứng quy định</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={proofInput}
                    onChange={(e) => setProofInput(e.target.value)}
                    placeholder="Quyết định thẩm duyệt..."
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-820"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFormProofTag())}
                  />
                  <button
                    type="button"
                    onClick={addFormProofTag}
                    className="px-4 bg-[#edf4f8] text-[#2563eb] font-extrabold text-xs rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2.5">
                  {formProofs?.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-[#f1f5f9] border border-slate-200 px-2.5 py-1 rounded text-xs font-bold text-slate-600">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeFormProofTag(idx)} className="text-red-500 font-bold hover:text-red-700 ml-1">
                        ×
                      </button>
                    </span>
                  ))}
                  {formProofs?.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Chưa chỉ định văn bản hồ sơ minh chứng cần nộp.</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-slate-250 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Đóng lại
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black rounded-lg shadow-md cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
