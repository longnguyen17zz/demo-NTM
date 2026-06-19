import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, Plus, Edit2, Trash2, Search, X, Check, Shield, UserCheck,
  Key, Building2, Eye, EyeOff, ClipboardList, Settings, Lock, ChevronRight
} from 'lucide-react';
import { UserSession, AccountItem } from '../types';

interface AccountsTabProps {
  userSession: UserSession;
  onUpdateSession: (session: UserSession) => void;
}

export const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-1',
    username: 'canbonhaplieu',
    fullName: 'Nguyễn Văn An',
    role: 'EDITOR',
    department: 'UBND Xã Bình Minh',
    permissions: ['read_reports', 'edit_reports']
  },
  {
    id: 'acc-2',
    username: 'canbothamđinh',
    fullName: 'Trần Minh Thẩm',
    role: 'APPRAISER',
    department: 'Văn phòng Điều phối NTM Tỉnh',
    permissions: ['read_reports', 'appraise_reports']
  },
  {
    id: 'acc-3',
    username: 'canbogiamsat',
    fullName: 'Phạm Hoàng Giám',
    role: 'SUPERVISOR',
    department: 'Văn phòng Điều phối NTM Trung ương',
    permissions: ['read_reports', 'supervise_reports']
  },
  {
    id: 'acc-4',
    username: 'admin',
    fullName: 'Lê Quản Trị',
    role: 'SUPERVISOR',
    department: 'Phòng Công nghệ & Quản trị Hệ thống',
    permissions: [
      'read_reports', 'edit_reports', 'appraise_reports',
      'supervise_reports', 'design_forms', 'manage_users', 'manage_units'
    ]
  }
];

export const AVAILABLE_PERMISSIONS = [
  { code: 'read_reports', name: 'Xem báo cáo tiến độ', desc: 'Đọc dữ liệu các biểu mẫu báo cáo trong hệ thống' },
  { code: 'edit_reports', name: 'Nhập liệu biểu mẫu (Cấp xã)', desc: 'Điền số liệu rà soát và tải minh chứng cho xã' },
  { code: 'appraise_reports', name: 'Phê duyệt thẩm định (Cấp tỉnh)', desc: 'Hội đồng tỉnh thẩm duyệt hồ sơ từ xã' },
  { code: 'supervise_reports', name: 'Xác nhận giám sát (Cấp bộ)', desc: 'Trung ương giám sát, khoá số liệu hoàn thành' },
  { code: 'design_forms', name: 'Thiết kế cấu trúc biểu mẫu', desc: 'Sửa đổi hoặc tạo biểu mẫu báo cáo mới' },
  { code: 'manage_users', name: 'Quản trị tài khoản & phân quyền', desc: 'Cấu hình quyền hạn thành viên hệ thống' },
  { code: 'manage_units', name: 'Quản lý đơn vị hành chính', desc: 'Thay đổi danh mục tỉnh, xã và phân nhóm xã' }
];

export default function AccountsTab({
  userSession,
  onUpdateSession
}: AccountsTabProps) {
  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    const saved = localStorage.getItem('NTM_Accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return INITIAL_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('NTM_Accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals States
  const [showModal, setShowModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [deptInput, setDeptInput] = useState('');
  const [roleInput, setRoleInput] = useState<'EDITOR' | 'APPRAISER' | 'SUPERVISOR'>('EDITOR');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [editAccountItem, setEditAccountItem] = useState<AccountItem | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc =>
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accounts, searchQuery]);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !fullNameInput.trim()) return;

    if (editAccountItem) {
      // Edit
      const updated = accounts.map(acc => acc.id === editAccountItem.id ? {
        ...acc,
        username: usernameInput.trim(),
        fullName: fullNameInput.trim(),
        department: deptInput.trim(),
        role: roleInput,
        permissions: selectedPerms
      } : acc);
      setAccounts(updated);

      // If user edits their own account, update live session
      if (editAccountItem.username === userSession.username) {
        onUpdateSession({
          username: usernameInput.trim(),
          fullName: fullNameInput.trim(),
          role: roleInput,
          permissions: selectedPerms
        });
      }
      triggerToast(`Đã cập nhật tài khoản: ${fullNameInput}`);
    } else {
      // Add
      if (accounts.some(acc => acc.username.toLowerCase() === usernameInput.trim().toLowerCase())) {
        alert('Tên đăng nhập này đã tồn tại!');
        return;
      }
      const newAcc: AccountItem = {
        id: `acc-${Date.now()}`,
        username: usernameInput.trim(),
        fullName: fullNameInput.trim(),
        department: deptInput.trim(),
        role: roleInput,
        permissions: selectedPerms
      };
      setAccounts([...accounts, newAcc]);
      triggerToast(`Đã tạo tài khoản mới: ${fullNameInput}`);
    }

    setShowModal(false);
    clearInputs();
  };

  const handleEdit = (acc: AccountItem) => {
    setEditAccountItem(acc);
    setUsernameInput(acc.username);
    setFullNameInput(acc.fullName);
    setDeptInput(acc.department);
    setRoleInput(acc.role);
    setSelectedPerms(acc.permissions);
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"?`)) {
      setAccounts(accounts.filter(acc => acc.id !== id));
      triggerToast(`Đã xóa tài khoản: ${name}`);
    }
  };

  const clearInputs = () => {
    setEditAccountItem(null);
    setUsernameInput('');
    setFullNameInput('');
    setDeptInput('');
    setRoleInput('EDITOR');
    setSelectedPerms([]);
  };

  const togglePermission = (permCode: string) => {
    if (selectedPerms.includes(permCode)) {
      setSelectedPerms(selectedPerms.filter(p => p !== permCode));
    } else {
      setSelectedPerms([...selectedPerms, permCode]);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'SUPERVISOR') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (role === 'APPRAISER') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getRoleName = (role: string) => {
    if (role === 'SUPERVISOR') return 'Cấp Bộ (Giám sát)';
    if (role === 'APPRAISER') return 'Cấp Tỉnh (Thẩm định)';
    return 'Cấp Xã (Nhập liệu)';
  };

  // Sync default permissions when changing role inside modal
  const handleRoleChange = (role: 'EDITOR' | 'APPRAISER' | 'SUPERVISOR') => {
    setRoleInput(role);
    if (role === 'SUPERVISOR') {
      setSelectedPerms(['read_reports', 'supervise_reports', 'design_forms', 'manage_users', 'manage_units']);
    } else if (role === 'APPRAISER') {
      setSelectedPerms(['read_reports', 'appraise_reports']);
    } else {
      setSelectedPerms(['read_reports', 'edit_reports']);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#003b72]/95 backdrop-blur-md text-white border border-blue-500/20 py-3 px-5 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
          <span>Hệ thống</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#014285] font-bold">Tài khoản & Phân quyền</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2">
          <div>
            <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Quản trị Tài khoản & Phân quyền</h2>
            <p className="text-xs text-[#64748b] font-medium mt-1">
              Quản lý danh sách tài khoản người dùng của các tỉnh, xã. Điều phối chức năng làm việc dựa trên quyền hạn được phân cấp chi tiết.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearInputs();
                handleRoleChange('EDITOR');
                setShowModal(true);
              }}
              className="px-4 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo tài khoản mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Accounts list (2 columns wide) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          {/* List header with search */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="text-xs font-black uppercase text-[#0f2942] tracking-wider flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-[#014285]" />
              <span>Danh sách người dùng ({filteredAccounts.length})</span>
            </h3>

            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#014285] focus:ring-1 focus:ring-[#014285]/20 font-bold"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Accounts list */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
            {filteredAccounts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-xs">
                Không tìm thấy người dùng nào khớp với từ khóa tìm kiếm.
              </div>
            ) : (
              filteredAccounts.map((acc) => (
                <div key={acc.id} className="p-4 hover:bg-slate-50/50 flex flex-row justify-between items-center gap-4 transition-colors min-w-0">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#014285] shrink-0 border border-slate-200 font-black text-sm uppercase">
                      {acc.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-800">{acc.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-bold">(@{acc.username})</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getRoleBadge(acc.role)} whitespace-nowrap shrink-0`}>
                          {getRoleName(acc.role)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate block" title={acc.department || 'Ban chỉ đạo'}>{acc.department || 'Ban chỉ đạo'}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {acc.permissions.map(p => {
                          const meta = AVAILABLE_PERMISSIONS.find(m => m.code === p);
                          if (!meta) return null;
                          return (
                            <span key={p} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                              {meta.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEdit(acc)}
                      className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <Edit2 className="w-3 h-3" />
                      {/* <span>Sửa quyền</span> */}
                    </button>
                    {acc.username !== 'admin' && (
                      <button
                        onClick={() => handleDelete(acc.id, acc.fullName)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side: Security & Permissions Reference (1 column wide) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-[#0f2942] tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Shield className="w-4.5 h-4.5 text-[#014285]" />
            <span>Mô tả Quyền hạn Hệ thống</span>
          </h3>

          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Hệ thống phân quyền hạt nhân gồm 7 quyền hạn chính được phân phối linh động cho 3 vai trò trụ cột.
          </p>

          <div className="space-y-3 pt-2">
            {AVAILABLE_PERMISSIONS.map(perm => (
              <div key={perm.code} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-[#014285] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {perm.code}
                </span>
                <h4 className="text-xs font-black text-slate-800 mt-1.5">{perm.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{perm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-slide-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 shrink-0">
              <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">
                {editAccountItem ? 'Cấu hình tài khoản & phân quyền' : 'Tạo tài khoản mới'}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-750">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs font-sans overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1.5">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: canbotinh..."
                    value={usernameInput}
                    disabled={!!editAccountItem}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1.5">Mật khẩu định danh <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      defaultValue="••••••••"
                      disabled={!!editAccountItem}
                      className="w-full pl-3 pr-10 py-3 border border-slate-300 rounded-xl outline-none font-bold text-slate-800 disabled:bg-slate-100"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1.5">Họ và Tên thành viên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên..."
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1.5">Phòng ban / Đơn vị công tác</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: UBND Xã Hải Anh..."
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1.5">Vai trò hệ thống <span className="text-red-500">*</span></label>
                  <select
                    value={roleInput}
                    onChange={(e) => handleRoleChange(e.target.value as any)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-slate-100 font-bold text-slate-800 bg-white"
                  >
                    <option value="EDITOR">Cấp Xã (EDITOR - Nhập liệu)</option>
                    <option value="APPRAISER">Cấp Tỉnh (APPRAISER - Thẩm định)</option>
                    <option value="SUPERVISOR">Cấp Bộ (SUPERVISOR - Giám sát)</option>
                  </select>
                </div>
              </div>

              {/* Advanced checklist permissions */}
              <div className="border-t border-slate-100 pt-3">
                <label className="text-xs font-black text-slate-700 block mb-2.5 uppercase tracking-wide">
                  Gán Quyền Hạn Chi Tiết
                </label>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {AVAILABLE_PERMISSIONS.map(perm => {
                    const isChecked = selectedPerms.includes(perm.code);
                    return (
                      <div
                        key={perm.code}
                        onClick={() => togglePermission(perm.code)}
                        className={`p-2.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isChecked
                          ? 'bg-blue-50/50 border-[#014285] text-slate-800 font-bold'
                          : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs">{perm.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">({perm.code})</span>
                          </div>
                          <p className="text-[10px] text-slate-450 font-medium mt-0.5">{perm.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#014285] border-[#014285] text-white' : 'border-slate-300 bg-white'
                          }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-xs font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white text-xs font-black uppercase rounded-lg cursor-pointer"
                >
                  {editAccountItem ? 'Lưu cấu hình' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
