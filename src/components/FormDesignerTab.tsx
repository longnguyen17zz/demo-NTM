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
    title: 'Cơ chế chính sách ban hành thực hiện chương trình giai đoạn 2026-2030',
    description: 'Báo cáo cơ chế pháp lý, chính sách đầu tư hỗ trợ xây dựng NTM cấp địa phương',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'Tên cơ chế, chính sách', type: 'text', width: 250 },
      { id: 'unit', label: 'Đơn vị ban hành', type: 'text', width: 120 },
      { id: 'quantity', label: 'Số hiệu văn bản', type: 'text', width: 120 },
      { id: 'note', label: 'Ghi chú', type: 'text', width: 200 }
    ],
    rows: [
      { id: 1, tt: '1', category: 'Chính sách hỗ trợ xi măng làm đường giao thông nông thôn', unit: 'HĐND Tỉnh' },
      { id: 2, tt: '2', category: 'Nghị quyết ưu đãi thu hút doanh nghiệp đầu tư vào nông nghiệp', unit: 'HĐND Tỉnh' },
      { id: 3, tt: '3', category: 'Quyết định hỗ trợ kinh phí phát triển sản phẩm OCOP', unit: 'UBND Tỉnh' }
    ]
  },
  {
    id: 'tmpl-b05',
    code: 'Biểu 05',
    title: 'Kết quả thực hiện bộ tiêu chí quốc gia về nông thôn mới (Tổng hợp)',
    description: 'Biểu mẫu rà soát tiến triển đạt chuẩn 10 tiêu chí nông thôn mới',
    columns: [
      { id: 'tt', label: 'TT', type: 'text', width: 60 },
      { id: 'category', label: 'Nội dung tiêu chí', type: 'text', width: 250 },
      { id: 'unit', label: 'Đơn vị tính', type: 'text', width: 100 },
      { id: 'group1', label: 'Nhóm I (Đồng bằng)', type: 'number', width: 150 },
      { id: 'group2', label: 'Nhóm II (Cận nghèo)', type: 'number', width: 150 },
      { id: 'group3', label: 'Nhóm III (Hải đảo)', type: 'number', width: 150 },
      { id: 'note', label: 'Ghi chú giải trình', type: 'text', width: 200 }
    ],
    rows: [
      { id: 1, tt: '1', category: 'Quy hoạch xây dựng', unit: 'Xã' },
      { id: 2, tt: '2', category: 'Hạ tầng giao thông đạt chuẩn', unit: 'Xã' },
      { id: 3, tt: '3', category: 'Thủy lợi & Phòng chống thiên tai', unit: 'Xã' }
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
      width: 150
    };
    setColumnsList([...columnsList, newCol]);
    setNewColLabel('');
    setNewColType('text');
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
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3 text-xs">
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
