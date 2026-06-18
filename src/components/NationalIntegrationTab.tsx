import React, { useState, useEffect } from 'react';
import {
  Link2,
  Database,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sliders,
  ArrowRightLeft,
  Terminal,
  Save,
  CheckCircle2,
  X
} from 'lucide-react';
import { NationalIntegrationConfigs, SyncLogEntry, UserSession, IntegrationSystemId } from '../types';

interface NationalIntegrationTabProps {
  userSession: UserSession;
  onAddNotification: (content: string, type: 'info' | 'warning' | 'success' | 'alert') => void;
}

const DEFAULT_CONFIGS: NationalIntegrationConfigs = {
  mof: {
    endpointUrl: 'https://api.mof.gov.vn/v1/public-investment/ntm',
    clientId: 'ntm-national-monitor-app',
    accessToken: 'jwt_token_mof_secure_sha255_2026_authorized',
    syncFrequency: 'manual',
    autoMapping: true,
    lastSyncedAt: '2026-06-18 08:15:33',
    status: 'CONNECTED'
  },
  molisa: {
    endpointUrl: 'https://api.molisa.gov.vn/v1/poverty-alleviation/ntm',
    clientId: 'ntm-national-poverty-app',
    accessToken: 'jwt_token_molisa_secure_sha255_2026_authorized',
    syncFrequency: 'manual',
    autoMapping: true,
    lastSyncedAt: '2026-06-18 09:20:12',
    status: 'CONNECTED'
  },
  cema: {
    endpointUrl: 'https://api.cema.gov.vn/v1/ethnic-minorities/ntm',
    clientId: 'ntm-national-ethnic-app',
    accessToken: 'jwt_token_cema_secure_sha255_2026_authorized',
    syncFrequency: 'manual',
    autoMapping: true,
    lastSyncedAt: '2026-06-18 10:05:44',
    status: 'CONNECTED'
  }
};

const DEFAULT_SYNC_LOGS: SyncLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-18 08:15:33',
    formCode: 'Biểu 08',
    status: 'SUCCESS',
    recordsCount: 24,
    operator: 'Phạm Hoàng Giám (Bộ)',
    message: 'Đồng bộ hoàn tất dữ liệu giải ngân ĐTC từ ngân sách Trung ương năm 2024.',
    systemId: 'mof'
  },
  {
    id: 'log-2',
    timestamp: '2026-06-18 11:25:40',
    formCode: 'Chỉ số CS03',
    status: 'SUCCESS',
    recordsCount: 1,
    operator: 'Trần Minh Thẩm (Tỉnh)',
    message: 'Đồng bộ liên thông dữ liệu hộ nghèo đa chiều khu vực nông thôn của 34 tỉnh.',
    systemId: 'molisa'
  },
  {
    id: 'log-3',
    timestamp: '2026-06-17 14:20:10',
    formCode: 'Biểu 11',
    status: 'SUCCESS',
    recordsCount: 6,
    operator: 'Nguyễn Văn An (Xã)',
    message: 'Tải và đối khớp thành công số liệu huy động nguồn vốn 6 tháng đầu năm.',
    systemId: 'mof'
  },
  {
    id: 'log-4',
    timestamp: '2026-06-15 10:05:44',
    formCode: 'Biểu 09',
    status: 'FAILED',
    recordsCount: 0,
    operator: 'Phạm Hoàng Giám (Bộ)',
    message: 'Lỗi xác thực Access Token kết nối API Đầu tư công của Bộ Tài chính (HTTP 401 Unauthorized).',
    systemId: 'mof'
  }
];

export default function NationalIntegrationTab({
  userSession,
  onAddNotification
}: NationalIntegrationTabProps) {
  const [configs, setConfigs] = useState<NationalIntegrationConfigs>(() => {
    const saved = localStorage.getItem('NTM_IntegrationConfigs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Migrate old config if present
    const oldSaved = localStorage.getItem('NTM_IntegrationConfig');
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved);
        if (parsed.endpointUrl) {
          const migrated = { ...DEFAULT_CONFIGS, mof: { ...DEFAULT_CONFIGS.mof, ...parsed } };
          localStorage.setItem('NTM_IntegrationConfigs', JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {}
    }
    return DEFAULT_CONFIGS;
  });

  const [activeTab, setActiveTab] = useState<IntegrationSystemId>('mof');

  const [logs, setLogs] = useState<SyncLogEntry[]>(() => {
    const saved = localStorage.getItem('NTM_SyncLogs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SYNC_LOGS;
  });

  const [endpointUrl, setEndpointUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [syncFrequency, setSyncFrequency] = useState<'manual' | 'daily' | 'weekly'>('manual');
  const [autoMapping, setAutoMapping] = useState(true);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const isReadOnly = userSession.role === 'EDITOR'; // Commune editor cannot change settings

  // Update input values when changing systems
  useEffect(() => {
    const systemConfig = configs[activeTab] || DEFAULT_CONFIGS[activeTab];
    setEndpointUrl(systemConfig.endpointUrl);
    setClientId(systemConfig.clientId);
    setAccessToken(systemConfig.accessToken);
    setSyncFrequency(systemConfig.syncFrequency);
    setAutoMapping(systemConfig.autoMapping);
    setTestResult(null);
  }, [activeTab, configs]);

  // Load new logs list from localStorage in case sync happened elsewhere
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('NTM_SyncLogs');
      if (saved) {
        try { setLogs(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save changes
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const updatedSystemConfig = {
      ...configs[activeTab],
      endpointUrl,
      clientId,
      accessToken,
      syncFrequency,
      autoMapping
    };
    const newConfigs = {
      ...configs,
      [activeTab]: updatedSystemConfig
    };
    setConfigs(newConfigs);
    localStorage.setItem('NTM_IntegrationConfigs', JSON.stringify(newConfigs));
    
    // Also save default for compatibility
    if (activeTab === 'mof') {
      localStorage.setItem('NTM_IntegrationConfig', JSON.stringify(updatedSystemConfig));
    }
    
    const systemNames = {
      mof: 'Bộ Tài chính',
      molisa: 'Bộ LĐ-TB&XH',
      cema: 'Ủy ban Dân tộc'
    };

    setAlertMsg(`Đã lưu cấu hình liên kết ${systemNames[activeTab]} thành công!`);
    onAddNotification(`Cập nhật cấu hình cổng API ${systemNames[activeTab]}.`, 'success');
    setTimeout(() => setAlertMsg(null), 3000);
  };

  // Test connection simulation
  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      const systemNames = {
        mof: 'Bộ Tài chính',
        molisa: 'Bộ LĐ-TB&XH',
        cema: 'Ủy ban Dân tộc'
      };

      let isValid = false;
      if (activeTab === 'mof' && endpointUrl.includes('mof.gov.vn') && accessToken.length > 5) isValid = true;
      if (activeTab === 'molisa' && endpointUrl.includes('molisa.gov.vn') && accessToken.length > 5) isValid = true;
      if (activeTab === 'cema' && endpointUrl.includes('cema.gov.vn') && accessToken.length > 5) isValid = true;

      if (isValid) {
        setTestResult('success');
        const updatedSystem = { ...configs[activeTab], status: 'CONNECTED' as const };
        const newConfigs = { ...configs, [activeTab]: updatedSystem };
        setConfigs(newConfigs);
        localStorage.setItem('NTM_IntegrationConfigs', JSON.stringify(newConfigs));
        onAddNotification(`Kết nối API ${systemNames[activeTab]} thành công (200 OK).`, 'success');
      } else {
        setTestResult('failed');
        const updatedSystem = { ...configs[activeTab], status: 'ERROR' as const };
        const newConfigs = { ...configs, [activeTab]: updatedSystem };
        setConfigs(newConfigs);
        localStorage.setItem('NTM_IntegrationConfigs', JSON.stringify(newConfigs));
        onAddNotification(`Kết nối API ${systemNames[activeTab]} thất bại. Vui lòng kiểm tra lại cấu hình.`, 'warning');
      }
    }, 1500);
  };

  const handleClearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử nhật ký đồng bộ?')) {
      setLogs([]);
      localStorage.setItem('NTM_SyncLogs', JSON.stringify([]));
      setAlertMsg('Đã xóa toàn bộ nhật ký đồng bộ.');
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  const currentSystemConfig = configs[activeTab] || DEFAULT_CONFIGS[activeTab];

  return (
    <div className="space-y-6 relative pb-12 font-sans text-slate-800 text-left animate-fade-in select-none">
      
      {/* Toast Alert */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 border border-slate-800 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 max-w-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold leading-normal">{alertMsg}</span>
          <button onClick={() => setAlertMsg(null)} className="ml-auto bg-transparent border-none text-white/40 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="text-left space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span>Hệ thống</span>
            <span className="text-slate-300">&rarr;</span>
            <span className="text-[#014285] font-black">Tích hợp cổng API quốc gia</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
            Tích hợp & Liên thông 3 Chương trình Quốc gia
          </h1>
          <p className="text-xs text-slate-400 font-bold">Cấu hình liên kết song song các hệ thống Nông thôn mới, Giảm nghèo bền vững, và Dân tộc thiểu số.</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              currentSystemConfig.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
            <span className="text-xs font-black text-slate-600">Trạng thái cổng:</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
            currentSystemConfig.status === 'CONNECTED' 
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
              : 'text-rose-700 bg-rose-50 border border-rose-100'
          }`}>
            {currentSystemConfig.status === 'CONNECTED' ? 'Đã liên kết' : 'Chưa thiết lập'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Config Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-1 text-left">
              <Sliders className="w-5 h-5 text-[#014285] shrink-0" />
              <h2 className="text-sm font-extrabold text-[#0f2942] uppercase tracking-wide">
                Cấu hình cổng liên kết API
              </h2>
            </div>
            
            {/* System select tabs */}
            <div className="flex flex-wrap gap-2 pt-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('mof')}
                className={`px-4 py-2 text-[11px] font-black rounded-xl border cursor-pointer transition-all ${
                  activeTab === 'mof'
                    ? 'bg-blue-50 border-[#014285]/30 text-[#014285]'
                    : 'bg-slate-50/55 border-slate-205 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Bộ Tài chính (Đầu tư công)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('molisa')}
                className={`px-4 py-2 text-[11px] font-black rounded-xl border cursor-pointer transition-all ${
                  activeTab === 'molisa'
                    ? 'bg-blue-50 border-[#014285]/30 text-[#014285]'
                    : 'bg-slate-50/55 border-slate-205 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Bộ LĐ-TB&XH (Giảm nghèo)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cema')}
                className={`px-4 py-2 text-[11px] font-black rounded-xl border cursor-pointer transition-all ${
                  activeTab === 'cema'
                    ? 'bg-blue-50 border-[#014285]/30 text-[#014285]'
                    : 'bg-slate-50/55 border-slate-205 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Ủy ban Dân tộc (Vùng DTTS)
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-bold text-slate-700 pt-2">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-slate-400 uppercase tracking-wide">Đường dẫn Cổng API (Endpoint URL) *</label>
              <input
                type="url"
                required
                disabled={isReadOnly}
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="https://api.chươngtrìnhquốcgia.gov.vn/..."
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold disabled:bg-slate-100 disabled:text-slate-400 transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] text-slate-400 uppercase tracking-wide">Mã định danh kết nối (Client ID) *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] text-slate-400 uppercase tracking-wide">Tần suất đồng bộ tự động</label>
                <select
                  disabled={isReadOnly}
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value as any)}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                >
                  <option value="manual">Đồng bộ thủ công (Nút bấm)</option>
                  <option value="daily">Hằng ngày (Tự động lúc 23:00)</option>
                  <option value="weekly">Hằng tuần (Tối Chủ nhật)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-slate-400 uppercase tracking-wide">Khóa bảo mật xác thực (Access Token) *</label>
              <textarea
                rows={3}
                required
                disabled={isReadOnly}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Nhập khóa JWT xác thực bảo mật liên ngành..."
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold disabled:bg-slate-100 disabled:text-slate-400 transition-all font-mono resize-none"
              />
            </div>

            <div className="flex items-center gap-3 py-2 border-y border-slate-100">
              <input
                type="checkbox"
                id="auto-mapping"
                disabled={isReadOnly}
                checked={autoMapping}
                onChange={(e) => setAutoMapping(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="auto-mapping" className="text-xs text-slate-600 font-extrabold cursor-pointer select-none">
                Tự động ánh xạ (Auto-mapping) theo mã liên kết Bộ ngành và mã NTM
              </label>
            </div>

            {!isReadOnly && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-605 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  {isTesting ? 'Đang kết nối...' : 'Kiểm tra kết nối'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#014285] hover:bg-[#002854] text-white rounded-xl cursor-pointer text-xs font-black uppercase tracking-wider transition-all shadow-md border-none flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Lưu cấu hình
                </button>
              </div>
            )}
          </form>

          {/* Connection status result panel */}
          {testResult && (
            <div className={`p-4.5 rounded-2xl border flex items-start gap-3 text-left animate-fade-in ${
              testResult === 'success'
                ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                : 'bg-rose-50 border-rose-250 text-rose-800'
            }`}>
              {testResult === 'success' ? (
                <>
                  <CheckCircle className="w-5.5 h-5.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="block font-black uppercase">Kết nối cổng thành công!</strong>
                    <p className="font-bold">Đã kiểm nghiệm Cổng API liên kết của Bộ ngành. Phản hồi mã 200 OK. Xác thực token chính xác.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="block font-black uppercase">Kết nối cổng thất bại!</strong>
                    <p className="font-bold">Không thể kết nối đến Endpoint. Vui lòng kiểm tra lại Đường dẫn URL và Khóa bảo mật Access Token.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right column: Data Mapping Schema Preview & Sync Logs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Schema Mapping Preview */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-left">
              <ArrowRightLeft className="w-5 h-5 text-[#014285] shrink-0" />
              <h2 className="text-sm font-extrabold text-[#0f2942] uppercase tracking-wide">
                Bản đồ đối sánh chỉ tiêu
              </h2>
            </div>
            
            {activeTab === 'mof' && (
              <div className="space-y-2.5 text-xs text-left">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Cơ sở dữ liệu BTC (MoF)</span>
                    <span className="text-slate-850">MoF.Budget.Disbursement</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Phân hệ Nông thôn mới</span>
                    <span className="text-slate-900 font-extrabold">Biểu 08 / Biểu 13 (NSTW)</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Cơ sở dữ liệu BTC (MoF)</span>
                    <span className="text-slate-850">MoF.Budget.Mobilization</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Phân hệ Nông thôn mới</span>
                    <span className="text-slate-900 font-extrabold">Biểu 07 / Biểu 11 (Tổ hợp)</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Cơ sở dữ liệu BTC (MoF)</span>
                    <span className="text-slate-850">MoF.NTP.InvestmentData</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Phân hệ Nông thôn mới</span>
                    <span className="text-slate-900 font-extrabold">Biểu 09 / Biểu 12 (Nguồn lực)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'molisa' && (
              <div className="space-y-2.5 text-xs text-left">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Cổng Giảm nghèo (MOLISA)</span>
                    <span className="text-slate-850">Molisa.Poverty.MultiDimPercent</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Dashboard Thống kê (NTM)</span>
                    <span className="text-slate-900 font-extrabold">Chỉ số CS03 (Nghèo đa chiều)</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Cổng Giảm nghèo (MOLISA)</span>
                    <span className="text-slate-850">Molisa.Poverty.LivelihoodBudget</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Dashboard Thống kê (NTM)</span>
                    <span className="text-slate-900 font-extrabold">Bộ chỉ số hỗ trợ sinh kế</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cema' && (
              <div className="space-y-2.5 text-xs text-left">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Hệ thống dữ liệu CEMA</span>
                    <span className="text-slate-855">Cema.Ethnic.SupportInfrastructure</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Dashboard Thống kê (NTM)</span>
                    <span className="text-slate-900 font-extrabold">Chỉ số phát triển đặc thù vùng</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Hệ thống dữ liệu CEMA</span>
                    <span className="text-slate-855">Cema.Ethnic.LandAndWaterSupport</span>
                  </div>
                  <div className="text-[#014285] animate-pulse">&rarr;</div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] font-black text-[#014285] uppercase block">Dashboard Thống kê (NTM)</span>
                    <span className="text-slate-900 font-extrabold">Chỉ số đất ở & nước sinh hoạt</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card: Sync Logs */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-left">
                <Terminal className="w-5 h-5 text-[#014285] shrink-0" />
                <h2 className="text-sm font-extrabold text-[#0f2942] uppercase tracking-wide">
                  Nhật ký đồng bộ liên thông
                </h2>
              </div>
              {logs.length > 0 && !isReadOnly && (
                <button
                  type="button"
                  onClick={handleClearLogs}
                  className="text-rose-600 hover:text-rose-800 text-[10px] font-black uppercase tracking-wider border-none bg-transparent cursor-pointer p-0 font-sans"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar text-left font-sans">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">
                  Không có nhật ký đồng bộ dữ liệu nào gần đây.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 text-xs">
                    {log.status === 'SUCCESS' ? (
                      <CheckCircle className="w-5.5 h-5.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-[9px] border px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                          log.systemId === 'molisa' 
                            ? 'bg-purple-50 text-purple-700 border-purple-150' 
                            : log.systemId === 'cema' 
                              ? 'bg-amber-50 text-amber-800 border-amber-150' 
                              : 'bg-blue-50 text-[#014285] border-blue-150'
                        }`}>
                          {log.systemId === 'molisa' ? 'LĐ-TB&XH' : log.systemId === 'cema' ? 'UBDT' : 'Bộ Tài chính'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{log.timestamp}</span>
                      </div>
                      <p className="font-extrabold text-slate-800 leading-snug">{log.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1">
                        <span>Chỉ mục: <strong className="text-slate-600 font-black">{log.formCode}</strong></span>
                        <span>Người thực hiện: {log.operator}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
