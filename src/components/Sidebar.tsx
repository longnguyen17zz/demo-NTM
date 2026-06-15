import {
  LayoutDashboard,
  FileCheck2,
  Settings,
  ClipboardList,
  FileText,
  TrendingUp,
  HelpCircle,
  LogOut,
  Sparkles,
  X,
  MapPin,
  Users,
  FileEdit,
  BarChart3
} from 'lucide-react';
import { UserSession } from '../types';

interface SidebarProps {
  currentTab: 'overview' | 'reports' | 'criteria' | 'statistics' | 'appraisal' | 'supervision' | 'category_criteria' | 'admin_units' | 'accounts' | 'form_designer' | 'indicator_statistics';
  onTabChange: (tab: 'overview' | 'reports' | 'criteria' | 'statistics' | 'appraisal' | 'supervision' | 'category_criteria' | 'admin_units' | 'accounts' | 'form_designer' | 'indicator_statistics') => void;
  onNewReportClick: () => void;
  isSidebarOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  userSession: UserSession;
}

export default function Sidebar({
  currentTab,
  onTabChange,
  onNewReportClick,
  isSidebarOpen = false,
  onClose,
  onLogout,
  userSession,
}: SidebarProps) {

  // Custom mapping of items
  const menuItems = [
    {
      id: 'overview' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      targetTab: 'overview' as const
    },
    {
      id: 'category_criteria' as const,
      label: 'Danh mục tiêu chí',
      icon: ClipboardList,
      targetTab: 'category_criteria' as const
    },
    {
      id: 'criteria' as const,
      label: 'Bộ tiêu chí quốc gia',
      icon: ClipboardList,
      targetTab: 'criteria' as const
    },
    {
      id: 'periods' as const,
      label: 'Đợt báo cáo',
      icon: FileText,
      targetTab: 'reports' as const
    },
    {
      id: 'reports_appraisal' as const,
      label: 'Thẩm định hồ sơ',
      icon: FileCheck2,
      targetTab: 'appraisal' as const
    },
    {
      id: 'form_designer' as const,
      label: 'Thiết kế Bảng Biểu mẫu',
      icon: FileEdit,
      targetTab: 'form_designer' as const
    },
    {
      id: 'indicator_statistics' as const,
      label: 'Thống kê Bộ Chỉ số',
      icon: BarChart3,
      targetTab: 'indicator_statistics' as const
    },
    {
      id: 'accounts' as const,
      label: 'Tài khoản & Phân quyền',
      icon: Users,
      targetTab: 'accounts' as const
    },
    {
      id: 'admin_units' as const,
      label: 'Quản lý Đơn vị Hành chính',
      icon: MapPin,
      targetTab: 'admin_units' as const
    },
    {
      id: 'config' as const,
      label: 'Cấu hình hệ thống',
      icon: Settings,
      targetTab: 'overview' as const
    }
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    const role = userSession.role;
    const perms = userSession.permissions || [];

    // Admin tabs
    if (item.id === 'admin_units') {
      return role === 'SUPERVISOR' || perms.includes('manage_units');
    }
    if (item.id === 'accounts') {
      return role === 'SUPERVISOR' || perms.includes('manage_users');
    }
    if (item.id === 'form_designer') {
      return role === 'SUPERVISOR' || perms.includes('design_forms');
    }

    // Standard tabs
    if (role === 'SUPERVISOR') {
      return true;
    }
    if (role === 'APPRAISER') {
      return ['overview', 'reports_appraisal', 'periods'].includes(item.id);
    }
    if (role === 'EDITOR') {
      return ['overview', 'periods'].includes(item.id);
    }
    return true;
  });

  const handleItemClick = (item: typeof filteredMenuItems[0]) => {
    if (item.targetTab) {
      onTabChange(item.targetTab);
    }
  };

  return (
    <aside className={`w-64 h-screen fixed top-0 bottom-0 left-0 bg-white text-slate-800 flex flex-col justify-between pt-5 pb-5 z-50 border-r border-[#e2e8f0] shadow-[2px_0_12px_rgba(0,0,0,0.02)] select-none transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

      <div>
        {/* Brand Header representing Nông Thôn Mới in style of Screenshot */}
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-3">
              {/* Round tractor logo inside dynamic blue box */}
              <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M72 45c0-10.4-8.1-18.9-18.3-19.8l.3-1.6c.2-.9.5-2 .5-3 0-1.7-1.3-3-3-3h-9c-1.7 0-3 1.3-3 3 0 1.2.3 2.1.5 3l.3 1.6C30.1 26.1 22 34.6 22 45h-1c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3h2.1c1 7.4 7.4 13 15 13s13.9-5.6 15-13h7.9c1 7.4 7.4 13 15 13s13.9-5.6 15-13H91c1.7 0 3-1.3 3-3V48c0-1.7-1.3-3-3-3H72zm-35 24c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zm36 0c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z" />
                </svg>
              </div>

              <div className="min-w-0">
                <h1 className="text-sm font-black tracking-wide text-[#0f2942] leading-tight">
                  Nông thôn mới
                </h1>
                <p className="text-xs font-extrabold text-[#64748b] tracking-wider uppercase mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  GIÁM SÁT & ĐÁNH GIÁ
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;

            // Highlight dashboard active when on overview or other corresponding tab matches
            let isActive = false;
            if (item.id === 'overview' && currentTab === 'overview') isActive = true;
            else if (item.id === 'reports_appraisal' && currentTab === 'appraisal') isActive = true;
            else if (item.id === 'criteria' && currentTab === 'criteria') isActive = true;
            else if (item.id === 'category_criteria' && currentTab === 'category_criteria') isActive = true;
            else if (item.id === 'periods' && currentTab === 'reports') isActive = true;
            else if (item.id === 'admin_units' && currentTab === 'admin_units') isActive = true;
            else if (item.id === 'accounts' && currentTab === 'accounts') isActive = true;
            else if (item.id === 'form_designer' && currentTab === 'form_designer') isActive = true;
            else if (item.id === 'indicator_statistics' && currentTab === 'indicator_statistics') isActive = true;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer text-left ${isActive
                  ? 'bg-[#2563eb] text-white shadow-sm font-extrabold'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                  }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#64748b]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom spacer with info & action buttons */}
      <div className="px-3 space-y-1">
        {/* Support guide button */}
        <button
          onClick={() => {
            // Trigger help modal in App
            const helpBtn = document.querySelector('[title*="Hướng dẫn"]') as HTMLButtonElement;
            if (helpBtn) helpBtn.click();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-all text-left cursor-pointer font-bold"
        >
          <HelpCircle className="w-4 h-4 text-[#64748b] shrink-0" />
          <span>Hướng dẫn</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            onLogout?.();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-left cursor-pointer font-bold"
        >
          <LogOut className="w-4 h-4 text-red-600 shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>

    </aside>
  );
}

