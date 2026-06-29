import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Trash2,
  Edit2,
  Plus,
  X,
  Check,
  Search,
  FileText,
  Folder,
  Info,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  TrendingUp,
  MapPin,
  BookmarkCheck,
  Award
} from 'lucide-react';
import { Criterion, UserSession } from '../types';

interface CategoryCriteriaTabProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  criteria: Criterion[];
  userSession: UserSession;
}

export default function CategoryCriteriaTab({
  categories,
  setCategories,
  criteria,
  userSession,
}: CategoryCriteriaTabProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // State for expanded category cards showing their children
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper mapping of category name to criteria list
  const categoriesWithCriteria = useMemo(() => {
    return categories.map((cat) => {
      const children = criteria.filter(c => c.category === cat);
      return {
        name: cat,
        children,
        count: children.length
      };
    });
  }, [categories, criteria]);

  // General KPIs
  const totalCategories = categories.length;
  const totalMappedCriteria = criteria.length;
  const emptyCategories = categoriesWithCriteria.filter(c => c.count === 0).length;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Danh mục này đã tồn tại!');
      return;
    }
    setCategories([...categories, trimmed]);
    setCategoryName('');
    setShowAddModal(false);
    triggerToast(`Đã thêm thành công danh mục: ${trimmed}`);
  };

  const handleOpenEdit = (index: number, currentName: string) => {
    setEditIndex(index);
    setCategoryName(currentName);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (!trimmed || editIndex === null) return;
    const oldName = categories[editIndex];
    if (oldName === trimmed) {
      setShowEditModal(false);
      return;
    }
    if (categories.includes(trimmed) && categories[editIndex] !== trimmed) {
      alert('Danh mục này đã tồn tại!');
      return;
    }

    // Update categories array
    const updated = [...categories];
    updated[editIndex] = trimmed;
    setCategories(updated);

    // Update parent categories in localStorage NTM_Criteria or sync by modifying criterion objects if they match old name
    const savedCriteria = localStorage.getItem('NTM_Criteria');
    if (savedCriteria) {
      try {
        const parsed = JSON.parse(savedCriteria) as Criterion[];
        const updatedCriteria = parsed.map(c => c.category === oldName ? { ...c, category: trimmed } : c);
        localStorage.setItem('NTM_Criteria', JSON.stringify(updatedCriteria));
        // Note: For live state update, page reload or state handler will update App.tsx's state.
        // Let's reload App criteria list via localstorage sync or just notify that it's updated on cloud.
      } catch (err) {
        console.error(err);
      }
    }

    // Also update NTM_Periods forms category column to keep matching counts in reports
    const savedPeriods = localStorage.getItem('NTM_Periods');
    if (savedPeriods) {
      try {
        const parsedP = JSON.parse(savedPeriods);
        const updatedPeriods = parsedP.map((p: any) => ({
          ...p,
          forms: p.forms.map((f: any) => ({
            ...f,
            data: f.data.map((row: any) => row.category === oldName ? { ...row, category: trimmed } : row)
          }))
        }));
        localStorage.setItem('NTM_Periods', JSON.stringify(updatedPeriods));
      } catch (err) {
        console.error(err);
      }
    }

    setShowEditModal(false);
    setEditIndex(null);
    setCategoryName('');
    triggerToast(`Đã thay đổi tên danh mục từ "${oldName}" thành "${trimmed}". Hãy tải lại trang để đồng bộ hoàn toàn bộ tiêu chí.`);
  };

  const handleDeleteCategory = (index: number, name: string) => {
    const childrenCount = criteria.filter(c => c.category === name).length;
    if (childrenCount > 0) {
      if (!window.confirm(`Danh mục "${name}" đang có ${childrenCount} tiêu chí trực thuộc. Nếu xóa danh mục này, các tiêu chí con sẽ chuyển về danh mục "Chưa phân loại". Bạn có chắc chắn muốn xóa?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
        return;
      }
    }

    // Re-assign criteria categories
    const savedCriteria = localStorage.getItem('NTM_Criteria');
    if (savedCriteria) {
      try {
        const parsed = JSON.parse(savedCriteria) as Criterion[];
        const updatedCriteria = parsed.map(c => c.category === name ? { ...c, category: 'Chưa phân loại' } : c);
        localStorage.setItem('NTM_Criteria', JSON.stringify(updatedCriteria));
      } catch (err) {
        console.error(err);
      }
    }

    // Update categories
    const updated = categories.filter((_, idx) => idx !== index);
    // If deleted everything, fallback to at least one category to prevent breaks
    if (updated.length === 0) {
      updated.push('Chưa phân loại');
    }
    // Add "Chưa phân loại" to list if we deleted a category that was holding children, to make it displayable
    if (childrenCount > 0 && !updated.includes('Chưa phân loại')) {
      updated.push('Chưa phân loại');
    }

    setCategories(updated);
    triggerToast(`Đã xóa danh mục "${name}" thành công.`);
  };

  const toggleCategoryExpand = (name: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Helper icon selection based on category names for dynamic wowed aesthetics
  const getCategoryIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('quy hoạch')) return <Folder className="w-5 h-5 text-indigo-600" />;
    if (lowercase.includes('hạ tầng')) return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    if (lowercase.includes('kinh tế')) return <Award className="w-5 h-5 text-amber-600" />;
    if (lowercase.includes('đào tạo') || lowercase.includes('nhân lực')) return <BookmarkCheck className="w-5 h-5 text-rose-600" />;
    return <ClipboardList className="w-5 h-5 text-slate-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans" id="category-criteria-container">
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0f2942]/95 backdrop-blur-md text-white border border-[#2563eb]/30 py-3.5 px-5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] z-9999 flex items-center gap-3 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold leading-tight">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
          <span>Hệ thống</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>Quản lý danh mục</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#2563eb] font-bold">Danh mục tiêu chí</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2">
          <div>
            <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Quản lý Danh mục tiêu chí</h2>
            <p className="text-xs text-[#64748b] font-medium mt-1">
              Phân cấp các nhóm tiêu chí vĩ mô nông thôn mới. Tiêu chí con sẽ tự động phân loại theo thiết kế này.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end lg:self-auto">
            {userSession.role === 'SUPERVISOR' && (
              <button
                onClick={() => {
                  setCategoryName('');
                  setShowAddModal(true);
                }}
                className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm danh mục mới</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#2563eb] rounded-xl">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Tổng số tiêu chí</span>
            <span className="text-2xl font-black text-[#0f2942] mt-0.5 block">{totalCategories} tiêu chí</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Tiêu chí đã liên kết</span>
            <span className="text-2xl font-black text-[#0f2942] mt-0.5 block">{totalMappedCriteria} nội dung tiêu chí</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${emptyCategories > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
            <Info className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Tiêu chí chưa có nội dung</span>
            <span className="text-2xl font-black text-[#0f2942] mt-0.5 block">{emptyCategories} Chưa có nội dung</span>
          </div>
        </div>
      </div>

      {/* Dynamic Categories Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesWithCriteria.map((catObj, index) => {
          const isExpanded = !!expandedCategories[catObj.name];

          return (
            <div
              key={catObj.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              {/* Header card with details */}
              <div className="p-5 flex items-start gap-4 border-b border-slate-100 bg-slate-50/20">
                <div className="p-2.5 bg-white border border-slate-150 rounded-xl shadow-sm">
                  {getCategoryIcon(catObj.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-[#0f2942] tracking-tight truncate">
                    {catObj.name}
                  </h3>
                  <span className="text-xs font-bold text-slate-450 mt-1 block uppercase">
                    Mã lượng: {catObj.count} tiêu chí thành phần
                  </span>
                </div>

                {userSession.role === 'SUPERVISOR' && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(index, catObj.name)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-[#2563eb] transition-all cursor-pointer"
                      title="Sửa tên danh mục"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(index, catObj.name)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-450 hover:text-red-650 transition-all cursor-pointer"
                      title="Xóa danh mục"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible list of child criteria */}
              <div className="flex-1 p-5 space-y-3">
                <button
                  onClick={() => toggleCategoryExpand(catObj.name)}
                  className="w-full flex items-center justify-between text-xs font-black text-slate-500 hover:text-[#2563eb] tracking-wide uppercase select-none transition-colors border-none bg-transparent cursor-pointer"
                >
                  <span>Xem danh sách tiêu chí con</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /> : <ChevronRight className="w-4 h-4 transition-transform" />}
                </button>

                {isExpanded && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto pr-1">
                    {catObj.children.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Chưa có tiêu chí nào thuộc danh mục này. Hãy tạo tiêu chí mới và liên kết.
                      </p>
                    ) : (
                      catObj.children.map((child) => (
                        <div
                          key={child.id}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-xl flex justify-between items-center gap-2.5 transition-colors"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-black text-[#2563eb] tracking-widest bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              {child.code}
                            </span>
                            <span className="text-xs font-bold text-slate-750 block truncate mt-1">
                              {child.title}
                            </span>
                          </div>

                          {/* <span className="text-[10px] text-slate-450 font-black tracking-wide shrink-0">
                            Trọng số: {child.weight || 'N/A'}
                          </span> */}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-slate-100">
              <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">Thêm danh mục tiêu chí</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-450 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 font-sans text-xs">
              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Tên danh mục mới <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hạ tầng Kinh tế - Xã hội..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full text-xs p-3 duration-250 border border-slate-350 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-slate-500 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-slate-100">
              <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">Sửa tên danh mục</h4>
              <button onClick={() => { setShowEditModal(false); setEditIndex(null); }} className="text-slate-450 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Tên danh mục <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Quy hoạch..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full text-xs p-3 duration-250 border border-slate-350 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 focus:border-slate-500 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditIndex(null); }}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black uppercase tracking-wider rounded-lg cursor-pointer"
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
