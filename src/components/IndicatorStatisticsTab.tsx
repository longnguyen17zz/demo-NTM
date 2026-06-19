import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart3, FileSpreadsheet, Printer, Download, Filter, HelpCircle,
  ChevronRight, Calculator, CheckCircle2, XCircle, Info, RefreshCw, X, Award, AlertTriangle, Loader2
} from 'lucide-react';
import { UserSession, CommuneSubmission } from '../types';
import { INITIAL_PROVINCES } from './AdministrativeTab';

interface IndicatorStatisticsTabProps {
  userSession: UserSession;
  communes: CommuneSubmission[];
  onAddNotification?: (content: string, type: 'info' | 'warning' | 'success' | 'alert') => void;
}

interface IndicatorRow {
  id: string;
  code: string;
  name: string;
  unit: string;
  formulaDesc: string;
  evaluator: (filteredComs: CommuneSubmission[], synced: any) => { value: string | number; isPass: boolean; isSynced: boolean };
  note: string;
}

export default function IndicatorStatisticsTab({
  userSession,
  communes,
  onAddNotification
}: IndicatorStatisticsTabProps) {
  // Filters
  const [selectedProv, setSelectedProv] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf'>('pdf');

  // National Integration Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0); // 0: Idle, 1-5: Steps, 6: Success, -2: Authentication failure
  const [syncError, setSyncError] = useState<string | null>(null);

  const [syncedData, setSyncedData] = useState<{
    povertyRate: number;
    landWaterSupport: number;
    ethnicInfra: number;
    lastSyncedAt: string;
  } | null>(() => {
    const saved = localStorage.getItem('NTM_Synced_Stats_Indicators');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return null;
  });

  // Listener to updates from localStorage (in case sync happened in National Integration tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('NTM_Synced_Stats_Indicators');
      if (saved) {
        try {
          setSyncedData(JSON.parse(saved));
        } catch (e) { }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Defined formulas/indicators
  const indicators: IndicatorRow[] = useMemo(() => [
    {
      id: 'ind-1',
      code: 'CS01',
      name: 'Tỷ lệ xã hoàn thành Quy hoạch chung xây dựng',
      unit: '% xã đạt',
      formulaDesc: '(Số xã Đạt TC01 / Tổng số xã) * 100',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const passedCount = coms.filter(c => c.status === 'APPROVED' || c.status === 'SUBMITTED').length;
        const value = ((passedCount / coms.length) * 100).toFixed(1);
        return { value, isPass: parseFloat(value) >= 60.0, isSynced: false };
      },
      note: 'Yêu cầu tối thiểu đạt 60% theo định hướng phát triển tổng hoà'
    },
    {
      id: 'ind-2',
      code: 'CS02',
      name: 'Thu nhập bình quân đầu người nông thôn mới',
      unit: 'Triệu đồng/người/năm',
      formulaDesc: 'Average(Thu nhập xã thuộc phân tổ)',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'I' ? 56 : c.group === 'II' ? 45 : 34;
          const offset = c.name.length % 5;
          return acc + base + offset;
        }, 0);
        const value = (sum / coms.length).toFixed(1);
        return { value, isPass: parseFloat(value) >= 42.0, isSynced: false };
      },
      note: 'Ngưỡng chuẩn bình quân liên vùng yêu cầu đạt >= 42 triệu đồng/năm'
    },
    {
      id: 'ind-3',
      code: 'CS03',
      name: 'Tỷ lệ hộ nghèo đa chiều khu vực nông thôn',
      unit: '% hộ',
      formulaDesc: 'Average(Hộ nghèo xã thuộc phân tổ)',
      evaluator: (coms, synced) => {
        if (synced && typeof synced.povertyRate === 'number') {
          return { value: synced.povertyRate.toFixed(2), isPass: synced.povertyRate <= 4.0, isSynced: true };
        }
        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'I' ? 1.2 : c.group === 'II' ? 3.5 : 7.2;
          const offset = (c.name.length % 3) * 0.2;
          return acc + base + offset;
        }, 0);
        const value = (sum / coms.length).toFixed(2);
        return { value, isPass: parseFloat(value) <= 4.0, isSynced: false };
      },
      note: 'Chỉ tiêu đạt yêu cầu phát triển bền vững cần <= 4.0% (MOLISA liên thông)'
    },
    {
      id: 'ind-4',
      code: 'CS04',
      name: 'Tỷ lệ bao phủ Bảo hiểm y tế toàn dân',
      unit: '% dân số',
      formulaDesc: 'Average(Độ phủ BHYT của xã thuộc phân tổ)',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'I' ? 96.2 : c.group === 'II' ? 91.5 : 82.8;
          const offset = (c.name.length % 4) * 0.4;
          return acc + base + offset;
        }, 0);
        const value = (sum / coms.length).toFixed(1);
        return { value, isPass: parseFloat(value) >= 90.0, isSynced: false };
      },
      note: 'Chuẩn quốc gia NTM nâng cao yêu cầu độ bao phủ >= 90%'
    },
    {
      id: 'ind-5',
      code: 'CS05',
      name: 'Tổng nguồn lực huy động xây dựng cơ sở hạ tầng',
      unit: 'Tỷ đồng',
      formulaDesc: 'Sum(Vốn đầu tư xã thuộc phân tổ)',
      evaluator: (coms, synced) => {
        let totalBillion = 0;
        let isSyncedFromMof = false;

        // Try reading from synced Biểu 11 / Biểu 07 first
        const saved11 = localStorage.getItem('NôngThônMới_Biểu11_Data');
        const saved07 = localStorage.getItem('NôngThônMới_Biểu07_Data');

        const sumBieuData = (dataStr: string | null) => {
          if (!dataStr) return 0;
          try {
            const data = JSON.parse(dataStr);
            const sum = (data.i1_plan || 0) + (data.i2_plan || 0) + (data.ii1_plan || 0) +
              (data.ii2_plan || 0) + (data.iii_plan || 0) + (data.iv_plan || 0) +
              (data.v_plan || 0) + (data.vi1_plan || 0) + (data.vi2_plan || 0);
            isSyncedFromMof = true;
            return sum / 1000; // convert to Billion
          } catch (e) {
            return 0;
          }
        };

        totalBillion += sumBieuData(saved11);
        totalBillion += sumBieuData(saved07);

        // Also check if there's project reports data from periods (Biểu 09 or Biểu 12)
        const periodsStr = localStorage.getItem('NTM_Periods');
        if (periodsStr) {
          try {
            const periods = JSON.parse(periodsStr);
            periods.forEach((p: any) => {
              if (p.forms) {
                p.forms.forEach((f: any) => {
                  if ((f.code === 'Biểu 09' || f.code === 'Biểu 12') && Array.isArray(f.data)) {
                    f.data.forEach((row: any) => {
                      if (!row.isHeader) {
                        const rowSum = (row.hd_nstw_dtpt || 0) + (row.hd_nstw_sn || 0) +
                          (row.hd_nsdp || 0) + (row.hd_longGhep || 0) +
                          (row.hd_tinDung || 0) + (row.hd_doanhNghiep || 0) +
                          (row.hd_danGop || 0);
                        if (rowSum > 0) {
                          totalBillion += rowSum / 1000;
                          isSyncedFromMof = true;
                        }
                      }
                    });
                  }
                });
              }
            });
          } catch (e) { }
        }

        if (totalBillion > 0) {
          return { value: totalBillion.toFixed(1), isPass: totalBillion >= 20.0, isSynced: isSyncedFromMof };
        }

        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const total = coms.reduce((acc, c) => {
          const multiplier = c.group === 'I' ? 12.5 : c.group === 'II' ? 8.2 : 4.6;
          return acc + multiplier;
        }, 0);
        return { value: total.toFixed(1), isPass: total >= 20.0, isSynced: false };
      },
      note: 'Tổng đầu tư công, lồng ghép, đóng góp xã hội (Bộ Tài chính liên thông)'
    },
    {
      id: 'ind-6',
      code: 'CS06',
      name: 'Tỷ lệ hộ dân tộc thiểu số được hỗ trợ đất ở, nước sinh hoạt',
      unit: '% hộ',
      formulaDesc: 'Average(Hộ DTTS được hỗ trợ / Tổng hộ DTTS vùng khó khăn)',
      evaluator: (coms, synced) => {
        if (synced && typeof synced.landWaterSupport === 'number') {
          return { value: synced.landWaterSupport.toFixed(1), isPass: synced.landWaterSupport >= 85.0, isSynced: true };
        }
        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'III' ? 78.5 : 88.2;
          return acc + base;
        }, 0);
        const value = (sum / coms.length).toFixed(1);
        return { value, isPass: parseFloat(value) >= 85.0, isSynced: false };
      },
      note: 'Ngưỡng chuẩn theo đề án phát triển đặc thù vùng DTTS & MN >= 85% (UBDT liên thông)'
    },
    {
      id: 'ind-7',
      code: 'CS07',
      name: 'Tỷ lệ thôn đặc biệt khó khăn đạt chuẩn nông thôn mới',
      unit: '% thôn',
      formulaDesc: '(Số thôn ĐBKK đạt chuẩn / Tổng thôn ĐBKK vùng dân tộc) * 100',
      evaluator: (coms, synced) => {
        if (synced && typeof synced.ethnicInfra === 'number') {
          return { value: synced.ethnicInfra.toFixed(1), isPass: synced.ethnicInfra >= 50.0, isSynced: true };
        }
        if (coms.length === 0) return { value: '0.0', isPass: false, isSynced: false };
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'III' ? 42.0 : 68.0;
          return acc + base;
        }, 0);
        const value = (sum / coms.length).toFixed(1);
        return { value, isPass: parseFloat(value) >= 50.0, isSynced: false };
      },
      note: 'Mục tiêu hoàn thành đạt chuẩn NTM cấp thôn bản khó khăn >= 50% (UBDT liên thông)'
    }
  ], []);

  // Filtered communes for calculations
  const calculatedCommunes = useMemo(() => {
    return communes.filter(c => {
      const matchesProv = selectedProv === 'all' || c.province === selectedProv;
      const matchesGroup = selectedGroup === 'all' || c.group === selectedGroup;
      return matchesProv && matchesGroup;
    });
  }, [communes, selectedProv, selectedGroup]);

  // Compute values
  const indicatorResults = useMemo(() => {
    return indicators.map(ind => {
      const { value, isPass, isSynced } = ind.evaluator(calculatedCommunes, syncedData);
      return {
        ...ind,
        calculatedValue: value,
        isPass,
        isSynced
      };
    });
  }, [indicators, calculatedCommunes, syncedData]);

  const handlePrint = () => {
    window.print();
  };

  const getSubTitleText = () => {
    const provText = selectedProv === 'all' ? 'Tất cả 34 tỉnh' : selectedProv;
    const groupText = selectedGroup === 'all' ? 'tất cả phân tổ xã' : `xã nhóm ${selectedGroup}`;
    return `Số liệu thống kê tích hợp cho: ${provText} (${groupText}) - Tính toán dựa trên ${calculatedCommunes.length} đơn vị hành chính cấp cơ sở.`;
  };

  // Perform parallel multi-program integration sync simulation
  const handleSyncStats = () => {
    setIsSyncing(true);
    setSyncStep(1);
    setSyncError(null);

    // Timeout chain representing parallel integrations gateways
    setTimeout(() => {
      // Step 1 check configs
      const savedConfigs = localStorage.getItem('NTM_IntegrationConfigs');
      let configs: any = null;
      if (savedConfigs) {
        try {
          configs = JSON.parse(savedConfigs);
        } catch (e) { }
      }

      // Check if credentials exist and match domain constraints
      const molisaValid = configs?.molisa?.endpointUrl?.includes('molisa.gov.vn') && configs?.molisa?.accessToken?.length > 5;
      const cemaValid = configs?.cema?.endpointUrl?.includes('cema.gov.vn') && configs?.cema?.accessToken?.length > 5;

      if (!molisaValid || !cemaValid) {
        setSyncStep(-2); // FAILED authentication state
        setSyncError(
          "Lỗi xác thực khóa bảo mật hoặc máy chủ không hồi đáp. Vui lòng kiểm tra lại cấu hình Endpoint URL và Access Token của cổng Bộ LĐ-TB&XH và Ủy ban Dân tộc trong module 'Tích hợp hệ thống'."
        );
        if (onAddNotification) {
          onAddNotification("Đồng bộ liên thông thất bại. Cấu hình cổng API không hợp lệ.", "warning");
        }
        return;
      }

      // Go to Step 2
      setSyncStep(2);

      setTimeout(() => {
        // Go to Step 3
        setSyncStep(3);

        setTimeout(() => {
          // Go to Step 4
          setSyncStep(4);

          setTimeout(() => {
            // Go to Step 5
            setSyncStep(5);

            setTimeout(() => {
              // Successfully complete sync!
              const newSynced = {
                povertyRate: 2.25,
                landWaterSupport: 92.4,
                ethnicInfra: 58.5,
                lastSyncedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
              };
              setSyncedData(newSynced);
              localStorage.setItem('NTM_Synced_Stats_Indicators', JSON.stringify(newSynced));

              // Add logs into NTM_SyncLogs
              const savedLogs = localStorage.getItem('NTM_SyncLogs');
              let logsList: any[] = [];
              if (savedLogs) {
                try {
                  logsList = JSON.parse(savedLogs);
                } catch (e) { }
              }

              const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
              const op = `${userSession.fullName} (${userSession.role === 'SUPERVISOR' ? 'Bộ' : userSession.role === 'APPRAISER' ? 'Tỉnh' : 'Xã'})`;

              const logPoverty = {
                id: `log-stats-poverty-${Date.now()}`,
                timestamp,
                formCode: 'Chỉ số CS03',
                status: 'SUCCESS' as const,
                recordsCount: 1,
                operator: op,
                message: 'Đồng bộ liên thông cổng Bộ LĐ-TB&XH thành công. Tỷ lệ nghèo đa chiều nông thôn cập nhật: 2.25%.',
                systemId: 'molisa' as const
              };

              const logEthnic = {
                id: `log-stats-ethnic-${Date.now() + 1}`,
                timestamp,
                formCode: 'Chỉ số CS06, CS07',
                status: 'SUCCESS' as const,
                recordsCount: 2,
                operator: op,
                message: 'Đồng bộ cổng UBDT thành công. Đã ánh xạ dữ liệu đất ở, nước sinh hoạt và hạ tầng đặc thù.',
                systemId: 'cema' as const
              };

              logsList.unshift(logPoverty, logEthnic);
              localStorage.setItem('NTM_SyncLogs', JSON.stringify(logsList));

              if (onAddNotification) {
                onAddNotification("Đồng bộ liên thông dữ liệu liên ngành thành công!", "success");
              }
              setSyncStep(6); // Go to finished state
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1200);
  };

  const closeSyncModal = () => {
    setIsSyncing(false);
    setSyncStep(0);
    setSyncError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans relative">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-1 text-left">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
          <span>Hệ thống</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>Thống kê phân tích</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#014285] font-bold">Thống kê Bộ Chỉ số</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2">
          <div>
            <h2 className="text-2xl font-black text-[#0f2942] tracking-tight">Thống kê & Kết xuất Bộ Chỉ số</h2>
            <p className="text-xs text-[#64748b] font-medium mt-1">
              Phân tích hiệu suất đạt chuẩn dựa trên các công thức chỉ số được cấu thành riêng. Lọc dữ liệu chính xác theo phân tổ quản lý.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setExportType('pdf');
                setShowExportModal(true);
              }}
              className="px-4 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Kết xuất Biểu mẫu chỉ số</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and settings Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-left">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Phân tổ Tỉnh:</span>
          </div>
          <select
            value={selectedProv}
            onChange={(e) => setSelectedProv(e.target.value)}
            className="p-2 border border-slate-350 rounded-lg text-xs outline-none font-bold text-slate-700 bg-white"
          >
            <option value="all">Tất cả 34 Tỉnh thành</option>
            {INITIAL_PROVINCES.map(p => (
              <option key={p.code} value={p.name}>{p.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Phân tổ Nhóm Xã:</span>
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="p-2 border border-slate-350 rounded-lg text-xs outline-none font-bold text-slate-700 bg-white"
          >
            <option value="all">Tất cả Nhóm xã</option>
            <option value="I">Nhóm I (Đồng bằng nâng cao)</option>
            <option value="II">Nhóm II (Cận nghèo / Biên giới)</option>
            <option value="III">Nhóm III (Đặc thù vùng khó khăn)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSyncStats}
            className="px-3.5 py-2 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đồng bộ dữ liệu liên thông</span>
          </button>

          <div className="text-xs text-[#014285] font-black flex items-center gap-1.5 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200">
            <Calculator className="w-4 h-4 animate-pulse" />
            <span>Số xã tính toán: {calculatedCommunes.length} xã</span>
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
        <div className="p-5 border-b border-slate-200 bg-slate-50/25">
          <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
            BIỂU MẪU TỔNG HỢP BỘ CHỈ SỐ THEO DÕI NTM
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            {getSubTitleText()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[#0f2942] text-xs font-black uppercase tracking-wider">
                <th className="py-4.5 px-6 w-16">STT</th>
                <th className="py-4.5 px-6 w-20">Mã CS</th>
                <th className="py-4.5 px-6">Tên chỉ số đánh giá</th>
                <th className="py-4.5 px-6 w-28 text-center">Đơn vị tính</th>
                <th className="py-4.5 px-6">Công thức cấu thành chỉ số</th>
                <th className="py-4.5 px-6 w-32 text-center">Giá trị tính</th>
                <th className="py-4.5 px-6 w-28 text-center">Trạng thái</th>
                <th className="py-4.5 px-6">Ghi chú yêu cầu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {indicatorResults.map((ind, index) => (
                <tr key={ind.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-400 font-black">{index + 1}</td>
                  <td className="py-4 px-6 text-[#014285] font-black">{ind.code}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{ind.name}</span>
                      {ind.isSynced && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-700 uppercase border border-emerald-150 tracking-wider">
                          Liên thông
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">{ind.unit}</td>
                  <td className="py-4 px-6 font-mono text-[10px] text-slate-500 bg-slate-50/50">{ind.formulaDesc}</td>
                  <td className="py-4 px-6 text-center text-sm font-black text-[#014285] bg-blue-50/15">
                    {ind.calculatedValue}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wide flex items-center justify-center gap-1 ${ind.isPass
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                      {ind.isPass ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đạt chuẩn</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Chưa đạt</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-medium leading-relaxed">{ind.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYNCING PROCESS MODAL */}
      {isSyncing && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-slide-up flex flex-col text-left font-sans">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0f2942] uppercase tracking-wide flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-amber-500 ${syncStep > 0 && syncStep <= 5 ? 'animate-spin' : ''}`} />
                <span>Tiến trình đồng bộ liên thông quốc gia</span>
              </h3>
              {syncStep <= 0 || syncStep >= 6 || syncStep === -2 ? (
                <button onClick={closeSyncModal} className="text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent">
                  <X className="w-5 h-5" />
                </button>
              ) : null}
            </div>

            <div className="space-y-4 py-2 flex-1">
              {/* Failed Authentication state */}
              {syncStep === -2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-800">
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div className="text-xs space-y-1">
                      <strong className="block font-black uppercase text-rose-900">Xác thực cổng thất bại!</strong>
                      <p className="font-bold leading-normal">{syncError}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-bold leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    Mẹo: Vào mục <span className="text-blue-700 font-black">Tích hợp hệ thống</span> để cấu hình Endpoint và Token của Bộ Lao động - Thương binh và Xã hội (molisa.gov.vn) và Ủy ban Dân tộc (cema.gov.vn) trước khi tiếp tục.
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={closeSyncModal}
                      className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer border-none"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleSyncStats}
                      className="px-4.5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl text-xs font-black uppercase transition-colors cursor-pointer border-none flex items-center gap-1.5 shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Thử lại</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Steps loading checklist */}
              {syncStep > 0 && syncStep <= 5 && (
                <div className="space-y-3.5 text-xs">
                  <p className="text-slate-400 font-bold">Hệ thống đang thiết lập các kết nối API song song để truy xuất dữ liệu...</p>

                  {/* Step 1 */}
                  <div className="flex items-center justify-between p-3 rounded-xl border transition-all bg-slate-50 border-slate-200">
                    <span className={`font-bold ${syncStep === 1 ? 'text-blue-700 font-extrabold' : syncStep > 1 ? 'text-slate-500' : 'text-slate-400'}`}>
                      Bước 1: Xác thực chứng thư số & mã định danh liên ngành
                    </span>
                    {syncStep > 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : syncStep === 1 ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                  </div>

                  {/* Step 2 */}
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${syncStep === 2 ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-slate-100'
                    }`}>
                    <span className={`font-bold ${syncStep === 2 ? 'text-blue-700 font-extrabold' : syncStep > 2 ? 'text-slate-500' : 'text-slate-400'}`}>
                      Bước 2: Kết nối & truy vấn gói dữ liệu nghèo đa chiều & hỗ trợ đặc thù
                    </span>
                    {syncStep > 2 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : syncStep === 2 ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${syncStep === 3 ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-slate-100'
                    }`}>
                    <span className={`font-bold ${syncStep === 3 ? 'text-blue-700 font-extrabold' : syncStep > 3 ? 'text-slate-500' : 'text-slate-400'}`}>
                      Bước 3: Ánh xạ dữ liệu (Auto-mapping) theo phân tổ Tỉnh
                    </span>
                    {syncStep > 3 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : syncStep === 3 ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                  </div>

                  {/* Step 4 */}
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${syncStep === 4 ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-slate-100'
                    }`}>
                    <span className={`font-bold ${syncStep === 4 ? 'text-blue-700 font-extrabold' : syncStep > 4 ? 'text-slate-500' : 'text-slate-400'}`}>
                      Bước 4: Giải mã khóa JWT liên ngành & kiểm tra vẹn toàn
                    </span>
                    {syncStep > 4 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : syncStep === 4 ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                  </div>

                  {/* Step 5 */}
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${syncStep === 5 ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-slate-100'
                    }`}>
                    <span className={`font-bold ${syncStep === 5 ? 'text-blue-700 font-extrabold' : 'text-slate-400'}`}>
                      Bước 5: Đồng bộ cơ sở dữ liệu và nạp kết quả chỉ số
                    </span>
                    {syncStep === 5 ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                  </div>
                </div>
              )}

              {/* Success screen */}
              {syncStep === 6 && (
                <div className="space-y-4 py-3 text-center">
                  <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce-slow">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Liên thông dữ liệu thành công!</h4>
                    <p className="text-xs text-slate-500 font-semibold px-4">
                      Hệ thống đã kết nối trực tiếp đến các cổng API quốc gia và cập nhật thành công các chỉ số kết quả đầu ra.
                    </p>
                  </div>

                  {/* Synced summary details */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs font-bold text-left space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-400">Tỷ lệ nghèo đa chiều (MOLISA):</span>
                      <strong className="text-slate-800 font-black">2.25% (CS03)</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-400">Hỗ trợ đặc thù vùng DTTS (CEMA):</span>
                      <strong className="text-slate-800 font-black">92.4% (CS06)</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-400">Thôn ĐBKK đạt chuẩn (CEMA):</span>
                      <strong className="text-slate-800 font-black">58.5% (CS07)</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Thời gian đồng bộ:</span>
                      <span className="text-slate-500 font-mono text-[10px]">{syncedData?.lastSyncedAt}</span>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={closeSyncModal}
                      className="px-6 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white rounded-xl text-xs font-black uppercase transition-colors cursor-pointer border-none shadow-md"
                    >
                      Đóng tiến trình
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EXPORT / PRINT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 animate-slide-up flex flex-col max-h-[95vh] font-sans">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2 text-left">
                <FileSpreadsheet className="w-5 h-5 text-[#014285]" />
                <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">
                  Kết xuất biểu mẫu chỉ số NTM (Bản chính thức)
                </h4>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-750 cursor-pointer border-none bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Preview Canvas */}
            <div className="flex-1 overflow-y-auto pr-1 p-8 bg-slate-100 border border-slate-200 rounded-xl" id="print-area">
              <div className="bg-white p-10 shadow-sm border border-slate-200 mx-auto max-w-[210mm] min-h-[297mm] text-slate-900 flex flex-col justify-between">

                {/* Formal header */}
                <div>
                  <div className="flex justify-between items-start text-xs font-black uppercase text-center tracking-normal leading-relaxed">
                    <div className="max-w-[250px]">
                      <p>Văn phòng điều phối NTM</p>
                      <p className="font-extrabold text-[#014285]">HỘI ĐỒNG THẨM ĐỊNH LIÊN NGÀNH</p>
                      <div className="w-16 h-px bg-slate-400 mx-auto my-1.5" />
                    </div>
                    <div className="max-w-[320px]">
                      <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                      <p className="font-extrabold">Độc lập - Tự do - Hạnh phúc</p>
                      <div className="w-24 h-px bg-slate-600 mx-auto my-1.5" />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic text-right mt-4">Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>

                  <h2 className="text-center font-black text-sm uppercase text-[#014285] tracking-wide mt-6 leading-snug">
                    BÁO CÁO KẾT QUẢ TỔNG HỢP BỘ CHỈ SỐ KIỂM TRA ĐẠT CHUẨN NTM
                  </h2>
                  <p className="text-center text-[11px] text-slate-500 mt-1 font-bold">
                    Áp dụng phân tổ tính toán: {selectedProv === 'all' ? 'Toàn quốc (34 Tỉnh thành)' : selectedProv} - Xã {selectedGroup === 'all' ? 'Tất cả Nhóm' : `Nhóm ${selectedGroup}`}
                  </p>

                  {/* Summary grid */}
                  <div className="grid grid-cols-3 gap-4 border border-slate-250 rounded-xl p-4 my-6 text-[11px] font-semibold bg-slate-50/50 text-left">
                    <div>
                      <span className="text-slate-400 block font-bold">Tổng số xã phân tổ:</span>
                      <strong className="text-slate-800 text-sm">{calculatedCommunes.length} xã</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Tỉnh áp dụng:</span>
                      <strong className="text-slate-800 text-sm">{selectedProv === 'all' ? '34 Tỉnh' : selectedProv}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Nhóm xã:</span>
                      <strong className="text-slate-800 text-sm">{selectedGroup === 'all' ? 'Nhóm I, II, III' : `Nhóm ${selectedGroup}`}</strong>
                    </div>
                  </div>

                  {/* Indicators Table */}
                  <table className="w-full border-collapse border border-slate-350 text-[10px] text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-355 text-slate-800 font-black uppercase text-[9px]">
                        <th className="border border-slate-300 p-2 text-center w-8">STT</th>
                        <th className="border border-slate-300 p-2 w-14 text-center">Mã CS</th>
                        <th className="border border-slate-300 p-2">Tên chỉ số nông thôn mới</th>
                        <th className="border border-slate-300 p-2 text-center w-20">ĐVT</th>
                        <th className="border border-slate-300 p-2">Công thức tính</th>
                        <th className="border border-slate-300 p-2 text-center w-20">Kết quả</th>
                        <th className="border border-slate-300 p-2 text-center w-20">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indicatorResults.map((ind, index) => (
                        <tr key={ind.id} className="font-semibold text-slate-700">
                          <td className="border border-slate-300 p-2 text-center">{index + 1}</td>
                          <td className="border border-slate-300 p-2 text-center text-[#014285] font-bold">{ind.code}</td>
                          <td className="border border-slate-300 p-2 font-bold text-slate-900">{ind.name}</td>
                          <td className="border border-slate-300 p-2 text-center">{ind.unit}</td>
                          <td className="border border-slate-300 p-2 font-mono text-[8px] text-slate-500">{ind.formulaDesc}</td>
                          <td className="border border-slate-300 p-2 text-center font-black">{ind.calculatedValue}</td>
                          <td className="border border-slate-300 p-2 text-center font-black">
                            {ind.isPass ? 'Đạt' : 'Chưa đạt'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sign and stamp area */}
                <div className="grid grid-cols-2 text-center text-xs font-bold mt-12 pt-6">
                  <div>
                    <p className="uppercase text-slate-500">Cán bộ lập biểu</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">(Ký ghi rõ họ tên)</p>
                    <div className="h-16" />
                    <p className="text-slate-800 font-extrabold">{userSession.fullName}</p>
                  </div>
                  <div>
                    <p className="uppercase text-slate-800 font-extrabold">CHỦ TỊCH HỘI ĐỒNG THẨM ĐỊNH</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">(Ký tên và đóng dấu)</p>
                    <div className="h-16" />
                    <p className="text-slate-800 font-extrabold">Phạm Hoàng Giám</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2.5 border border-slate-350 text-slate-650 text-xs font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Đóng lại
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white text-xs font-black uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm border-none"
              >
                <Printer className="w-4 h-4" />
                <span>In biểu mẫu hoặc Xuất PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
