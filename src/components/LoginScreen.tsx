import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, HelpCircle, BookOpen, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('canbonhaplieu');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'EDITOR' | 'APPRAISER' | 'SUPERVISOR'>('EDITOR');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const presetUsers = [
    {
      username: 'canbonhaplieu',
      fullName: 'Nguyễn Văn An',
      role: 'EDITOR' as const,
      desc: 'Cán bộ Chuyên viên xã/huyện',
      dept: 'Phòng Nông nghiệp & Phát triển Nông thôn',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      username: 'canbothamđinh',
      fullName: 'Trần Minh Thẩm',
      role: 'APPRAISER' as const,
      desc: 'Hội đồng Thẩm định liên ngành',
      dept: 'Hội đồng Khoa học & Thẩm định cấp Tỉnh',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      username: 'canbogiamsat',
      fullName: 'Phạm Hoàng Giám',
      role: 'SUPERVISOR' as const,
      desc: 'Văn phòng Giám sát Trung ương',
      dept: 'Ủy ban MTTQ Việt Nam & Ban Chỉ đạo Trung ương',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
  ];

  const handleSelectPreset = (user: typeof presetUsers[0]) => {
    setUsername(user.username);
    setRole(user.role);
    setPassword('••••••••');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = presetUsers.find((u) => u.username === username) || {
      username: username,
      fullName: username === 'canbothamđinh' ? 'Trần Minh Thẩm' : username === 'canbogiamsat' ? 'Phạm Hoàng Giám' : 'Nguyễn Văn An',
      role: role
    };

    onLoginSuccess({
      username: selectedUser.username,
      fullName: selectedUser.fullName,
      role: selectedUser.role,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Light mist overlay mirroring the misty hill atmosphere in the screenshot */}
      <div className="absolute inset-0 bg-[#f1f5f9]/80 backdrop-blur-[1px] pointer-events-none" />

      {/* Top spacer */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-10">

        {/* Main white login card conforming exactly to the reference mockup */}
        <div id="login-card" className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10 flex flex-col items-stretch transition-all duration-300">

          {/* Logo Brand Title Group */}
          <div className="flex items-center justify-center gap-3">
            {/* High-Fidelity Official Green Logo */}
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-white border border-emerald-100 shadow-sm relative p-1.5 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Circular frame in official deep green */}
                <circle cx="50" cy="50" r="47" stroke="#135236" strokeWidth="4" fill="#ffffff" />
                {/* Yellow accent inner track */}
                <circle cx="50" cy="50" r="40" stroke="#eab308" strokeWidth="4" fill="none" />

                {/* Geometric traditional architecture representation (NTM Pillars and Arcs) */}
                <g transform="translate(15, 12)">
                  <path d="M15 45 C15 32, 23 20, 35 20 C47 20, 55 32, 55 45" stroke="#135236" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <path d="M25 45 C25 36, 29 28, 35 28 C41 28, 45 36, 45 45" stroke="#135236" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <line x1="35" y1="20" x2="35" y2="48" stroke="#135236" strokeWidth="5" strokeLinecap="round" />
                  <line x1="35" y1="48" x2="10" y2="48" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                  <line x1="35" y1="48" x2="60" y2="48" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* Dynamic agricultural leaf shape */}
                <path d="M50 78 C35 78, 25 74, 25 74 C25 74, 35 68, 50 68 C65 68, 75 74, 75 74 C75 74, 65 78, 50 78Z" fill="#135236" />
              </svg>
            </div>

            {/* Title Brand in green uppercase font resembling original logo */}
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#135236] uppercase select-none font-sans">
              Nông Thôn Mới
            </span>
          </div>

          {/* Core System Header Title */}
          <h2 className="text-[#014285] text-base sm:text-lg font-bold text-center leading-snug mt-6 max-w-sm mx-auto select-none font-sans">
            Hệ thống thông tin Theo dõi, giám sát và đánh giá Chương trình MTQG xây dựng Nông thôn mới
          </h2>

          <p className="text-gray-500 text-xs text-center mt-2 font-medium select-none">
            Đăng nhập để tiếp tục
          </p>

          {/* Form fields */}
          <form id="login-form" onSubmit={handleSubmit} className="mt-6 space-y-4">

            {/* Field: Username */}
            <div>
              <label htmlFor="input-username" className="block text-gray-800 text-xs font-bold tracking-wider uppercase mb-1.5">
                TÀI KHOẢN
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tài khoản hoặc email"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 focus:border-[#014285] focus:ring-1 focus:ring-[#014285] rounded-md text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="input-password" className="text-gray-800 text-xs font-bold tracking-wider uppercase">
                  MẬT KHẨU
                </label>
                <a href="#forgot" className="text-[#014285] hover:text-[#002b5c] transition-colors text-xs font-bold">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 hover:border-gray-400 focus:border-[#014285] focus:ring-1 focus:ring-[#014285] rounded-md text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-700 cursor-pointer p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Field: Keep signed in Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#014285] focus:ring-[#014285] cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#014285] hover:bg-[#003366] active:scale-[0.99] text-white font-extrabold py-3 px-4 rounded-md text-sm tracking-wide transition-all flex items-center justify-center gap-2 mt-5 shadow-sm cursor-pointer"
            >
              <span>Đăng nhập</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* Horizontal divider */}
          <div className="h-px bg-gray-100 my-6" />

          {/* Help Links mimicking support items in reference photo */}
          <div className="space-y-3">
            {/* Tech support */}
            <div className="flex items-center gap-3.5 p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl hover:bg-[#f1f5f9] transition-all cursor-pointer text-left select-none group">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#014285] flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-800 leading-tight">Hỗ trợ kỹ thuật</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-semibold">Liên hệ đội ngũ quản trị viên</p>
              </div>
            </div>

            {/* User Handbook */}
            <div className="flex items-center gap-3.5 p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl hover:bg-[#f1f5f9] transition-all cursor-pointer text-left select-none group">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#014285] flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-800 leading-tight">Hướng dẫn sử dụng</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-semibold">Xem tài liệu hướng dẫn nghiệp vụ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable versioning metrics */}
        <div className="w-full max-w-[560px] flex justify-between items-center text-xs mt-3 text-gray-500 px-2 font-medium z-10 select-none">
          <span>v2.4.0-PROD</span>
          <div className="flex gap-3">
            <button className="font-extrabold text-[#014285] underline cursor-pointer">Tiếng Việt</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">English</button>
          </div>
        </div>

        {/* Collapsible drawer for test accounts configuration (Crucial for workspace evaluations) */}
        <div className="w-full max-w-[560px] bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/60 p-4 mt-5 text-xs text-gray-700 z-10 animate-fade-in transition-all">
          <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#014285]" />
            <span className="font-extrabold text-[#014285] uppercase tracking-wider text-xs">Tài khoản Thử nghiệm Phân quyền (Demo)</span>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Hệ thống áp dụng phân quyền chức năng riêng biệt. Chọn một trong ba cấp dưới đây để điền nhanh thông tin:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presetUsers.map((u) => {
              const isSelected = username === u.username;
              return (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => handleSelectPreset(u)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all hover:bg-white flex flex-col justify-between cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'border-[#014285] bg-blue-50/50 ring-1 ring-[#014285]/20 font-bold'
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-gray-800 truncate">{u.fullName}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-tight line-clamp-2">{u.desc}</div>
                  </div>
                  <div className="text-xs font-extrabold text-[#014285] uppercase tracking-wide mt-2 pt-1 border-t border-gray-100 w-full">
                    {u.role === 'EDITOR' ? 'Cấp Xã' : u.role === 'APPRAISER' ? 'Cấp Tỉnh' : 'Cấp Bộ'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Full-width sticky legal footer strip exactly as reference mockup */}
      <footer className="w-full bg-[#e9eef5]/90 border-t border-gray-200 py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600 z-10 select-none">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center md:text-left">
          <span className="font-extrabold text-[#014285]">Nông thôn mới</span>
          <span className="text-gray-500">© 2026 Văn phòng Điều phối Nông thôn mới Trung ương</span>
        </div>
        <div className="flex gap-5 text-gray-500 font-medium">
          <a href="#contact" className="hover:text-[#014285] transition-colors">Liên hệ</a>
          <a href="#help" className="hover:text-[#014285] transition-colors">Hướng dẫn</a>
          <a href="#privacy" className="hover:text-[#014285] transition-colors">Chính sách bảo mật</a>
        </div>
      </footer>
    </div>
  );
}
