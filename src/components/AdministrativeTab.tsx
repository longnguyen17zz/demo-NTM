import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin, Plus, Edit2, Trash2, Search, X, Check, Filter,
  Building2, Globe, ShieldAlert, Award, ArrowLeft, ChevronLeft, ChevronRight,
  TrendingUp, BarChart3
} from 'lucide-react';
import { UserSession, CommuneSubmission, ProvinceItem, ProvinceSubmission } from '../types';

interface AdministrativeTabProps {
  userSession: UserSession;
  communes: CommuneSubmission[];
  setCommunes: React.Dispatch<React.SetStateAction<CommuneSubmission[]>>;
  provinces: ProvinceItem[];
  setProvinces: React.Dispatch<React.SetStateAction<ProvinceItem[]>>;
  provinceSubmissions: ProvinceSubmission[];
  setProvinceSubmissions: React.Dispatch<React.SetStateAction<ProvinceSubmission[]>>;
}

export const INITIAL_PROVINCES: ProvinceItem[] = [
  { code: 'VN-HN', name: 'Thành phố Hà Nội' },
  { code: 'VN-SG', name: 'Thành phố Hồ Chí Minh' },
  { code: 'VN-HP', name: 'Thành phố Hải Phòng' },
  { code: 'VN-DN', name: 'Thành phố Đà Nẵng' },
  { code: 'VN-CT', name: 'Thành phố Cần Thơ' },
  { code: 'VN-ND', name: 'Tỉnh Nam Định' },
  { code: 'VN-TB', name: 'Tỉnh Thái Bình' },
  { code: 'VN-HD', name: 'Tỉnh Hải Dương' },
  { code: 'VN-QN', name: 'Tỉnh Quảng Ninh' },
  { code: 'VN-TH', name: 'Tỉnh Thanh Hóa' },
  { code: 'VN-NA', name: 'Tỉnh Nghệ An' },
  { code: 'VN-HT', name: 'Tỉnh Hà Tĩnh' },
  { code: 'VN-TTH', name: 'Tỉnh Thừa Thiên Huế' },
  { code: 'VN-QNA', name: 'Tỉnh Quảng Nam' },
  { code: 'VN-KH', name: 'Tỉnh Khánh Hòa' },
  { code: 'VN-LD', name: 'Tỉnh Lâm Đồng' },
  { code: 'VN-BD', name: 'Tỉnh Bình Dương' },
  { code: 'VN-DNai', name: 'Tỉnh Đồng Nai' },
  { code: 'VN-BRVT', name: 'Tỉnh Bà Rịa - Vũng Tàu' },
  { code: 'VN-LA', name: 'Tỉnh Long An' },
  { code: 'VN-TG', name: 'Tỉnh Tiền Giang' },
  { code: 'VN-BT', name: 'Tỉnh Bến Tre' },
  { code: 'VN-VL', name: 'Tỉnh Vĩnh Long' },
  { code: 'VN-AG', name: 'Tỉnh An Giang' },
  { code: 'VN-KG', name: 'Tỉnh Kiên Giang' },
  { code: 'VN-ST', name: 'Tỉnh Sóc Trăng' },
  { code: 'VN-CM', name: 'Tỉnh Cà Mau' },
  { code: 'VN-HY', name: 'Tỉnh Hưng Yên' },
  { code: 'VN-BN', name: 'Tỉnh Bắc Ninh' },
  { code: 'VN-VP', name: 'Tỉnh Vĩnh Phúc' },
  { code: 'VN-PT', name: 'Tỉnh Phú Thọ' },
  { code: 'VN-TN', name: 'Tỉnh Thái Nguyên' },
  { code: 'VN-LS', name: 'Tỉnh Lạng Sơn' },
  { code: 'VN-LC', name: 'Tỉnh Lào Cai' }
];

export default function AdministrativeTab({
  userSession,
  communes,
  setCommunes,
  provinces,
  setProvinces,
  provinceSubmissions,
  setProvinceSubmissions
}: AdministrativeTabProps) {

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Modals states
  const [showProvModal, setShowProvModal] = useState(false);
  const [showCommModal, setShowCommModal] = useState(false);
  const [provCode, setProvCode] = useState('');
  const [provName, setProvName] = useState('');
  const [editProvItem, setEditProvItem] = useState<ProvinceItem | null>(null);

  const [commId, setCommId] = useState('');
  const [commName, setCommName] = useState('');
  const [commCode, setCommCode] = useState('');
  const [commProv, setCommProv] = useState('Tỉnh Đông');
  const [commGroup, setCommGroup] = useState<'I' | 'II' | 'III'>('I');
  const [editCommItem, setEditCommItem] = useState<CommuneSubmission | null>(null);

  // 3. Filtering and search states
  const [activeSubTab, setActiveSubTab] = useState<'communes' | 'provinces'>('communes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvFilter, setSelectedProvFilter] = useState<string>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // KPIs
  const totalCommunesVirtual = 3321; // As requested, represented overall count
  const group1CountVirtual = 1205;
  const group2CountVirtual = 1120;
  const group3CountVirtual = 996;

  // Filtered Communes lists
  const filteredCommunes = useMemo(() => {
    return communes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.includes(searchQuery);
      const matchesProv = selectedProvFilter === 'all' || c.province === selectedProvFilter;
      const matchesGroup = selectedGroupFilter === 'all' || c.group === selectedGroupFilter;
      return matchesSearch && matchesProv && matchesGroup;
    });
  }, [communes, searchQuery, selectedProvFilter, selectedGroupFilter]);

  // Paginated Communes
  const paginatedCommunes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCommunes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCommunes, currentPage]);

  const totalPages = Math.ceil(filteredCommunes.length / itemsPerPage);

  // Filtered Provinces lists
  const filteredProvinces = useMemo(() => {
    return provinces.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [provinces, searchQuery]);

  // CRUD Province
  const handleSaveProvince = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provCode.trim() || !provName.trim()) return;

    if (editProvItem) {
      // Edit
      const updated = provinces.map(p => p.code === editProvItem.code ? { code: provCode.trim(), name: provName.trim() } : p);
      setProvinces(updated);
      triggerToast(`Đã cập nhật tỉnh: ${provName}`);

      // Sync name change to communes (referential integrity)
      if (editProvItem.name !== provName.trim()) {
        setCommunes(prev => prev.map(c => c.province === editProvItem.name ? { ...c, province: provName.trim() } : c));
      }

      // Sync to provinceSubmissions
      setProvinceSubmissions(prev => prev.map(p => p.code === editProvItem.code ? {
        ...p,
        name: provName.trim(),
        code: provCode.trim()
      } : p));

    } else {
      // Add
      if (provinces.some(p => p.code.toLowerCase() === provCode.trim().toLowerCase())) {
        alert('Mã tỉnh này đã tồn tại!');
        return;
      }
      setProvinces([...provinces, { code: provCode.trim(), name: provName.trim() }]);
      triggerToast(`Đã thêm tỉnh mới: ${provName}`);

      // Sync to provinceSubmissions
      const newProvSub: ProvinceSubmission = {
        id: `prov-${Date.now()}`,
        name: provName.trim(),
        code: provCode.trim(),
        submitted: 0,
        total: 6,
        status: 'PENDING',
        updatedAt: '--',
        region: 'Đồng bằng sông Hồng' // default region
      };
      setProvinceSubmissions([...provinceSubmissions, newProvSub]);
    }

    setProvCode('');
    setProvName('');
    setEditProvItem(null);
    setShowProvModal(false);
  };

  const handleEditProv = (item: ProvinceItem) => {
    setEditProvItem(item);
    setProvCode(item.code);
    setProvName(item.name);
    setShowProvModal(true);
  };

  const handleDeleteProv = (code: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${name}?`)) {
      setProvinces(provinces.filter(p => p.code !== code));
      triggerToast(`Đã xóa tỉnh: ${name}`);

      // Sync to provinceSubmissions
      setProvinceSubmissions(prev => prev.filter(p => p.code !== code));

      // Reassign communes of deleted province to first available province
      const remainingProvs = provinces.filter(p => p.code !== code);
      const fallbackProvName = remainingProvs[0]?.name || 'Tỉnh Đông';
      setCommunes(prev => prev.map(c => c.province === name ? { ...c, province: fallbackProvName } : c));
    }
  };

  // CRUD Commune
  const handleSaveCommune = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commName.trim() || !commCode.trim()) return;

    if (editCommItem) {
      // Edit
      const updated = communes.map(c => c.id === editCommItem.id ? {
        ...c,
        name: commName.trim(),
        code: commCode.trim(),
        province: commProv,
        group: commGroup,
        updatedAt: new Date().toLocaleDateString('vi-VN')
      } : c);
      setCommunes(updated);
      triggerToast(`Đã cập nhật xã: ${commName}`);
    } else {
      // Add
      const newComm: CommuneSubmission = {
        id: `com-${Date.now()}`,
        name: commName.trim(),
        code: commCode.trim(),
        province: commProv,
        submitted: 0,
        total: 4,
        status: 'PENDING',
        updatedAt: '--',
        group: commGroup
      };
      setCommunes([newComm, ...communes]);
      triggerToast(`Đã thêm xã mới: ${commName}`);
    }

    setCommName('');
    setCommCode('');
    setCommProv(provinces[0]?.name || 'Tỉnh Đông');
    setCommGroup('I');
    setEditCommItem(null);
    setShowCommModal(false);
  };

  const handleEditComm = (item: CommuneSubmission) => {
    setEditCommItem(item);
    setCommName(item.name);
    setCommCode(item.code);
    setCommProv(item.province);
    setCommGroup(item.group || 'I');
    setShowCommModal(true);
  };

  const handleDeleteComm = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${name}?`)) {
      setCommunes(communes.filter(c => c.id !== id));
      triggerToast(`Đã xóa xã: ${name}`);
    }
  };

  // Helper labels
  const getGroupLabel = (group?: string) => {
    if (group === 'I') return 'Nhóm I (Đồng bằng)';
    if (group === 'II') return 'Nhóm II (Cận nghèo/Biên giới)';
    if (group === 'III') return 'Nhóm III (Đặc thù/Hải đảo)';
    return 'Chưa phân loại';
  };

  const getGroupBadgeColor = (group?: string) => {
    if (group === 'I') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (group === 'II') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (group === 'III') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-500 border-slate-200';
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

      {/* Navigation Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
          <span>Hệ thống</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#014285] font-bold">Quản lý Đơn vị Hành chính</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2">
          <div>
            <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Quản lý Đơn vị Hành chính (2 cấp)</h2>
            <p className="text-xs text-[#64748b] font-medium mt-1">
              Quản lý danh mục 34 Tỉnh và các Xã trên toàn quốc. Phân loại xã vào các nhóm đặc thù để kiểm chuẩn chỉ tiêu đạt chuẩn NTM.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSubTab === 'communes' ? (
              userSession.role === 'APPRAISER' ? (
                <button
                  onClick={() => {
                    setEditCommItem(null);
                    setCommName('');
                    setCommCode('');
                    setCommProv(provinces[0]?.name || 'Tỉnh Đông');
                    setCommGroup('I');
                    setShowCommModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Xã mới</span>
                </button>
              ) : (
                <span className="text-xs text-[#64748b] bg-slate-100 border border-slate-200 py-2 px-3 rounded-lg font-bold">
                  Chỉ Cấp Tỉnh mới được tạo Xã
                </span>
              )
            ) : (
              userSession.role === 'SUPERVISOR' ? (
                <button
                  onClick={() => {
                    setEditProvItem(null);
                    setProvCode('');
                    setProvName('');
                    setShowProvModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Tỉnh mới</span>
                </button>
              ) : (
                <span className="text-xs text-[#64748b] bg-slate-100 border border-slate-200 py-2 px-3 rounded-lg font-bold">
                  Chỉ Cấp Bộ mới được tạo Tỉnh
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#014285] rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Tổng số Tỉnh</span>
            <span className="text-xl font-black text-[#0f2942] mt-0.5 block">{provinces.length} Tỉnh</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Tổng số Xã (Quy mô)</span>
            <span className="text-xl font-black text-[#0f2942] mt-0.5 block">{totalCommunesVirtual} Xã</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Xã Nhóm I (Đồng bằng)</span>
            <span className="text-xl font-black text-[#0f2942] mt-0.5 block">{group1CountVirtual} Xã</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Nhóm II & Nhóm III</span>
            <span className="text-xl font-black text-[#0f2942] mt-0.5 block">{group2CountVirtual + group3CountVirtual} Xã</span>
          </div>
        </div>
      </div>

      {/* Tabs list (SubTabs navigation) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => { setActiveSubTab('communes'); setSearchQuery(''); setCurrentPage(1); }}
            className={`px-5 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'communes'
              ? 'border-[#014285] text-[#014285] bg-white font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Danh sách Xã trực thuộc ({filteredCommunes.length} hiển thị)
          </button>
          <button
            onClick={() => { setActiveSubTab('provinces'); setSearchQuery(''); }}
            className={`px-5 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'provinces'
              ? 'border-[#014285] text-[#014285] bg-white font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Danh mục 34 Tỉnh ({provinces.length} cấp)
          </button>
        </div>

        {/* Filter controls & Search */}
        <div className="p-5 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={`Tìm kiếm theo tên hoặc mã ${activeSubTab === 'communes' ? 'xã' : 'tỉnh'}...`}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#014285] focus:ring-1 focus:ring-[#014285]/20 font-bold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {activeSubTab === 'communes' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500 font-bold">Lọc theo Tỉnh:</span>
              </div>
              <select
                value={selectedProvFilter}
                onChange={(e) => { setSelectedProvFilter(e.target.value); setCurrentPage(1); }}
                className="p-1.5 border border-slate-300 rounded-lg text-xs outline-none font-bold text-slate-700 bg-white"
              >
                <option value="all">Tất cả Tỉnh</option>
                {provinces.map(p => (
                  <option key={p.code} value={p.name}>{p.name}</option>
                ))}
              </select>

              <select
                value={selectedGroupFilter}
                onChange={(e) => { setSelectedGroupFilter(e.target.value); setCurrentPage(1); }}
                className="p-1.5 border border-slate-300 rounded-lg text-xs outline-none font-bold text-slate-700 bg-white"
              >
                <option value="all">Tất cả Nhóm Xã</option>
                <option value="I">Nhóm I (Đồng bằng)</option>
                <option value="II">Nhóm II (Cận nghèo/Biên giới)</option>
                <option value="III">Nhóm III (Hải đảo/Đặc thù)</option>
              </select>
            </div>
          )}
        </div>

        {/* Content table */}
        <div className="overflow-x-auto">
          {activeSubTab === 'communes' ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#0f2942] text-xs font-black uppercase tracking-wider">
                  <th className="py-4.5 px-6">Mã xã</th>
                  <th className="py-4.5 px-6">Tên xã</th>
                  <th className="py-4.5 px-6">Tỉnh quản lý</th>
                  <th className="py-4.5 px-6">Phân nhóm xã</th>
                  <th className="py-4.5 px-6">Đợt nộp biểu mẫu</th>
                  <th className="py-4.5 px-6">Trạng thái hồ sơ</th>
                  <th className="py-4.5 px-6 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {paginatedCommunes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      Không tìm thấy xã nào khớp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  paginatedCommunes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="py-3.5 px-6 text-[#014285] font-black">{c.code}</td>
                      <td className="py-3.5 px-6 font-bold">{c.name}</td>
                      <td className="py-3.5 px-6">{c.province}</td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wide whitespace-nowrap ${getGroupBadgeColor(c.group)}`}>
                          {getGroupLabel(c.group)}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {c.submitted}/{c.total} biểu mẫu
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 shrink-0 ${c.status === 'APPROVED' ? 'bg-emerald-500' :
                          c.status === 'SUBMITTED' ? 'bg-blue-500' :
                            c.status === 'REVISION' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                        <span>{
                          c.status === 'APPROVED' ? 'Đã phê duyệt' :
                            c.status === 'SUBMITTED' ? 'Đang thẩm định' :
                              c.status === 'REVISION' ? 'Cần điều chỉnh' : 'Chưa gửi nộp'
                        }</span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        {userSession.role === 'APPRAISER' ? (
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleEditComm(c)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Sửa xã"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComm(c.id, c.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Xóa xã"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px] whitespace-nowrap">Chỉ xem</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#0f2942] text-xs font-black uppercase tracking-wider">
                  <th className="py-4.5 px-6">Mã tỉnh</th>
                  <th className="py-4.5 px-6">Tên tỉnh thành</th>
                  <th className="py-4.5 px-6">Số lượng xã gieo mầm</th>
                  <th className="py-4.5 px-6 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {filteredProvinces.map((p) => {
                  const subCommCount = communes.filter(c => c.province === p.name).length;
                  return (
                    <tr key={p.code} className="hover:bg-slate-50/55 transition-colors">
                      <td className="py-3.5 px-6 text-[#014285] font-black">{p.code}</td>
                      <td className="py-3.5 px-6 font-bold">{p.name}</td>
                      <td className="py-3.5 px-6">{subCommCount} xã hiện hữu</td>
                      <td className="py-3.5 px-6 text-center">
                        {userSession.role === 'SUPERVISOR' ? (
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleEditProv(p)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Sửa tỉnh"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProv(p.code, p.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Xóa tỉnh"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Chỉ xem</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination footer (for communes only) */}
        {activeSubTab === 'communes' && totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold">
              Hiển thị {paginatedCommunes.length} trong tổng số {filteredCommunes.length} xã lọc được
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-350 rounded-lg hover:bg-slate-200 disabled:opacity-45 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${currentPage === page
                    ? 'bg-[#014285] text-white border-[#014285]'
                    : 'border-slate-350 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-350 rounded-lg hover:bg-slate-200 disabled:opacity-45 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: TỈNH */}
      {showProvModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">
                {editProvItem ? 'Sửa thông tin Tỉnh' : 'Thêm Tỉnh mới'}
              </h4>
              <button onClick={() => setShowProvModal(false)} className="text-slate-400 hover:text-slate-750">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProvince} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Mã Tỉnh (Ví dụ: VN-HP) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Nhập mã tỉnh..."
                  value={provCode}
                  disabled={!!editProvItem}
                  onChange={(e) => setProvCode(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Tên Tỉnh <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên tỉnh thành..."
                  value={provName}
                  onChange={(e) => setProvName(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProvModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-xs font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white text-xs font-black uppercase rounded-lg cursor-pointer"
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÃ */}
      {showCommModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">
                {editCommItem ? 'Sửa thông tin Xã' : 'Thêm Xã mới'}
              </h4>
              <button onClick={() => setShowCommModal(false)} className="text-slate-400 hover:text-slate-750">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCommune} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Mã Xã (Ví dụ: 23041) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Nhập mã định danh xã..."
                  value={commCode}
                  onChange={(e) => setCommCode(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Tên Xã <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên xã..."
                  value={commName}
                  onChange={(e) => setCommName(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Tỉnh trực thuộc <span className="text-red-500">*</span></label>
                <select
                  value={commProv}
                  onChange={(e) => setCommProv(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 bg-white"
                >
                  {provinces.map(p => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Phân nhóm Xã (Phân tổ đánh giá) <span className="text-red-500">*</span></label>
                <div className="flex gap-4 p-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="grp"
                      checked={commGroup === 'I'}
                      onChange={() => setCommGroup('I')}
                      className="w-4 h-4 accent-[#014285]"
                    />
                    <span>Nhóm I (Đồng bằng)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="grp"
                      checked={commGroup === 'II'}
                      onChange={() => setCommGroup('II')}
                      className="w-4 h-4 accent-[#014285]"
                    />
                    <span>Nhóm II (Cận nghèo)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="grp"
                      checked={commGroup === 'III'}
                      onChange={() => setCommGroup('III')}
                      className="w-4 h-4 accent-[#014285]"
                    />
                    <span>Nhóm III (Hải đảo/Khó khăn)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCommModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-xs font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white text-xs font-black uppercase rounded-lg cursor-pointer"
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
