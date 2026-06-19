import { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, Check, AlertTriangle, Info, CheckCircle2, LogOut, Settings, ChevronDown, Menu, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { NotificationItem, UserSession } from '../types';

interface HeaderProps {
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenHelpModal: () => void;
  userSession: UserSession;
  onUpdateSession?: (session: UserSession) => void;
  onLogout: () => void;
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;

  // Offline mode props
  isOnline?: boolean;
  simulatedOffline?: boolean;
  onToggleSimulateOffline?: () => void;
  offlineDraftsCount?: number;
  onOpenOfflineSync?: () => void;
  reportYear?: string;
  onReportYearChange?: (year: string) => void;
}

export default function Header({
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  searchQuery,
  onSearchChange,
  onOpenHelpModal,
  userSession,
  onUpdateSession,
  onLogout,
  isSidebarOpen = false,
  onSidebarToggle,
  isOnline = true,
  simulatedOffline = false,
  onToggleSimulateOffline,
  offlineDraftsCount = 0,
  onOpenOfflineSync,
  reportYear = '2024',
  onReportYearChange,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white flex justify-between items-center px-4 sm:px-8 z-40 border-b border-[#e1e6ed] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all font-sans select-none">

      {/* Search tool & Central badge next to it */}
      <div className="flex items-center gap-2.5 sm:gap-6">
        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          title="Mở menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* Search bar styled after the screenshot */}
        <div className="relative w-28 sm:w-44 md:w-60 transition-all duration-305">
          <input
            id="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#edf1f7] hover:bg-[#e2e7ef] focus:bg-white border border-transparent focus:border-[#003b72]/30 rounded-lg text-xs outline-none text-[#1e293b] font-semibold transition-all placeholder:text-[#64748b]"
            placeholder="Tìm kiếm..."
            type="text"
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-[#0f172a] font-bold"
            >
              Xóa
            </button>
          )}
        </div>
 
        {/* Dynamic central Vietnamese administration badge */}
        <div className="hidden md:flex items-center">
          <span className="text-[#014285] text-xs lg:text-sm font-black tracking-normal uppercase select-none whitespace-nowrap">
            {userSession.role === 'SUPERVISOR' ? 'Ban Chỉ đạo Trung ương' : userSession.role === 'APPRAISER' ? 'Hội đồng Thẩm định Tỉnh' : 'Ủy ban nhân dân Cấp Xã'}
          </span>
        </div>
      </div>
 
      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-5">
 
        {/* Network connection status indicator (Clickable to toggle simulation - Only for Cấp Xã) */}
        {userSession.role === 'EDITOR' && (
          <>
            {isOnline ? (
              <button
                onClick={onToggleSimulateOffline}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 shadow-sm shrink-0 cursor-pointer transition-colors"
                title="Đang Trực tuyến. Click để giả lập mất kết nối (Offline)."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Trực tuyến</span>
              </button>
            ) : (
              <button
                onClick={onToggleSimulateOffline}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-250 rounded-lg text-xs font-bold text-amber-800 animate-pulse cursor-pointer shadow-sm shrink-0 transition-colors"
                title="Đang Ngoại tuyến (Giả lập). Click để kết nối lại (Online)."
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Ngoại tuyến</span>
              </button>
            )}
 
            {/* Sync trigger button if there are unsynced drafts */}
            {offlineDraftsCount > 0 && (
              <button
                onClick={onOpenOfflineSync}
                className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-full text-amber-900 transition-all relative cursor-pointer flex items-center justify-center shrink-0 border-none"
                title="Đồng bộ bản nháp ngoại tuyến"
              >
                <RefreshCw className="w-4 h-4 text-amber-700" />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-amber-600 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                  {offlineDraftsCount}
                </span>
              </button>
            )}
          </>
        )}
 
        {/* Quick Role Switcher for Demo */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="px-2.5 sm:px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-[#014285] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Chuyển vai trò demo nhanh"
          >
            <Settings className="w-3.5 h-3.5 text-[#014285] animate-spin-hover" />
            <span>Vai trò: <strong className="font-black">
              {userSession.role === 'EDITOR' ? 'Xã' : userSession.role === 'APPRAISER' ? 'Tỉnh' : 'Bộ'}
            </strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-[#014285]" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs font-semibold text-slate-700">
              <div className="px-3 py-1 text-[10px] text-slate-400 uppercase font-black border-b border-slate-100 mb-1">
                Demo Phân Quyền
              </div>
              <button
                onClick={() => {
                  onUpdateSession?.({
                    username: 'canbonhaplieu',
                    fullName: 'Nguyễn Văn An',
                    role: 'EDITOR'
                  });
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-none bg-transparent ${userSession.role === 'EDITOR' ? 'text-[#014285] font-black bg-blue-50/20' : ''}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Cấp Xã (Nhập liệu)</span>
              </button>
              <button
                onClick={() => {
                  onUpdateSession?.({
                    username: 'canbothamđinh',
                    fullName: 'Trần Minh Thẩm',
                    role: 'APPRAISER'
                  });
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-none bg-transparent ${userSession.role === 'APPRAISER' ? 'text-amber-600 font-black bg-amber-50/20' : ''}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Cấp Tỉnh (Thẩm định)</span>
              </button>
              <button
                onClick={() => {
                  onUpdateSession?.({
                    username: 'canbogiamsat',
                    fullName: 'Phạm Hoàng Giám',
                    role: 'SUPERVISOR'
                  });
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-none bg-transparent ${userSession.role === 'SUPERVISOR' ? 'text-emerald-700 font-black bg-emerald-50/20' : ''}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Cấp Bộ (Giám sát)</span>
              </button>
            </div>
          )}
        </div>

        {/* Years of reporting dropdown */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="px-2.5 sm:px-3.5 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span><span className="hidden sm:inline">Năm: </span><strong className="text-[#014285]">{reportYear}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showYearDropdown && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-xs">
              {['2024', '2023', '2022'].map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onReportYearChange?.(year);
                    setShowYearDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Năm {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real-time notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-[#475569] hover:text-[#0f172a] hover:bg-slate-100 rounded-full transition-all relative cursor-pointer"
          >
            <Bell className="w-[19px] h-[19px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notif box dropdown */}
          {showNotifications && (
            <div className="absolute right-[-48px] sm:right-0 mt-3.5 w-[calc(100vw-32px)] sm:w-[360px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Hoạt động Giám sát</span>
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Đã đọc tất cả
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs text-slate-400 font-medium">
                    Không có thông báo mới nào.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onMarkNotificationAsRead(item.id)}
                      className={`p-3.5 text-left hover:bg-slate-50 cursor-pointer transition-colors flex gap-2.5 items-start ${!item.read ? 'bg-indigo-50/20' : ''
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#014285] shrink-0 mt-2" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-slate-700 leading-relaxed ${!item.read ? 'font-bold' : 'font-medium'}`}>
                          {item.content}
                        </p>
                        <span className="text-xs text-slate-400 mt-1 block font-semibold">{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global configuration gear button */}
        <button
          onClick={() => alert('Đang tải cấu hình hệ thống đánh giá nông thôn mới đa tầng...')}
          className="hidden sm:block p-2.5 text-[#475569] hover:text-[#0f172a] hover:bg-slate-100 rounded-full transition-all cursor-pointer"
        >
          <Settings className="w-[19px] h-[19px]" />
        </button>

        {/* Vertical divider */}
        <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1" />

        {/* User profile structure conforming to high fidelity mockup photo */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-slate-800 leading-tight">
              {userSession.fullName}
            </p>
            <p className="text-xs text-[#64748b] font-medium leading-none mt-1">
              {userSession.role === 'EDITOR' ? 'Cấp Xã (Nhập liệu)' : userSession.role === 'APPRAISER' ? 'Cấp Tỉnh (Thẩm định)' : 'Cấp Bộ (Giám sát)'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-100 shadow-sm cursor-pointer select-none">
            <img
              alt="Avatar Admin"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
