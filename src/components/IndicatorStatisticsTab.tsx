import React, { useState, useMemo } from 'react';
import { 
  BarChart3, FileSpreadsheet, Printer, Download, Filter, HelpCircle, 
  ChevronRight, Calculator, CheckCircle2, XCircle, Info, RefreshCw, X, Award
} from 'lucide-react';
import { UserSession, CommuneSubmission } from '../types';
import { INITIAL_PROVINCES } from './AdministrativeTab';

interface IndicatorStatisticsTabProps {
  userSession: UserSession;
  communes: CommuneSubmission[];
}

interface IndicatorRow {
  id: string;
  code: string;
  name: string;
  unit: string;
  formulaDesc: string;
  evaluator: (filteredComs: CommuneSubmission[]) => { value: string | number; isPass: boolean };
  note: string;
}

export default function IndicatorStatisticsTab({
  userSession,
  communes
}: IndicatorStatisticsTabProps) {
  // Filters
  const [selectedProv, setSelectedProv] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  
  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf'>('pdf');

  // Defined formulas/indicators
  const indicators: IndicatorRow[] = useMemo(() => [
    {
      id: 'ind-1',
      code: 'CS01',
      name: 'Tỷ lệ xã hoàn thành Quy hoạch chung xây dựng',
      unit: '% xã đạt',
      formulaDesc: '(Số xã Đạt TC01 / Tổng số xã) * 100',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false };
        // Determine how many are approved/submitted as a mock indicator metric
        const passedCount = coms.filter(c => c.status === 'APPROVED' || c.status === 'SUBMITTED').length;
        const value = ((passedCount / coms.length) * 100).toFixed(1);
        return { value, isPass: parseFloat(value) >= 60.0 };
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
        if (coms.length === 0) return { value: '0.0', isPass: false };
        // Group I gets 55M, Group II gets 44M, Group III gets 33M
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'I' ? 56 : c.group === 'II' ? 45 : 34;
          // Add some deterministic pseudo-random factor based on name length
          const offset = c.name.length % 5;
          return acc + base + offset;
        }, 0);
        const value = (sum / coms.length).toFixed(1);
        return { value, isPass: parseFloat(value) >= 42.0 };
      },
      note: 'Ngưỡng chuẩn bình quân liên vùng yêu cầu đạt >= 42 triệu đồng/năm'
    },
    {
      id: 'ind-3',
      code: 'CS03',
      name: 'Tỷ lệ hộ nghèo đa chiều khu vực nông thôn',
      unit: '% hộ',
      formulaDesc: 'Average(Hộ nghèo xã thuộc phân tổ)',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false };
        // Group I gets 1.2%, Group II gets 3.2%, Group III gets 7.8%
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'I' ? 1.2 : c.group === 'II' ? 3.5 : 7.2;
          const offset = (c.name.length % 3) * 0.2;
          return acc + base + offset;
        }, 0);
        const value = (sum / coms.length).toFixed(2);
        return { value, isPass: parseFloat(value) <= 4.0 };
      },
      note: 'Chỉ tiêu đạt yêu cầu phát triển bền vững cần <= 4.0%'
    },
    {
      id: 'ind-4',
      code: 'CS04',
      name: 'Tỷ lệ bao phủ Bảo hiểm y tế toàn dân',
      unit: '% dân số',
      formulaDesc: 'Average(Độ phủ BHYT của xã thuộc phân tổ)',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false };
        // Group I gets 96%, Group II gets 92%, Group III gets 84%
        const sum = coms.reduce((acc, c) => {
          const base = c.group === 'I' ? 96.2 : c.group === 'II' ? 91.5 : 82.8;
          const offset = (c.name.length % 4) * 0.4;
          return acc + base + offset;
        }, 0);
        const value = (sum / coms.length).toFixed(1);
        return { value, isPass: parseFloat(value) >= 90.0 };
      },
      note: 'Chuẩn quốc gia NTM nâng cao yêu cầu độ bao phủ >= 90%'
    },
    {
      id: 'ind-5',
      code: 'CS05',
      name: 'Tổng nguồn lực huy động xây dựng cơ sở hạ tầng',
      unit: 'Tỷ đồng',
      formulaDesc: 'Sum(Vốn đầu tư xã thuộc phân tổ)',
      evaluator: (coms) => {
        if (coms.length === 0) return { value: '0.0', isPass: false };
        // Accumulate a mock source investment based on communes count
        const total = coms.reduce((acc, c) => {
          const multiplier = c.group === 'I' ? 12.5 : c.group === 'II' ? 8.2 : 4.6;
          return acc + multiplier;
        }, 0);
        return { value: total.toFixed(1), isPass: total >= 20.0 };
      },
      note: 'Tổng nguồn đầu tư công, lồng ghép và nhân dân hiến đất đóng góp'
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
      const { value, isPass } = ind.evaluator(calculatedCommunes);
      return {
        ...ind,
        calculatedValue: value,
        isPass
      };
    });
  }, [indicators, calculatedCommunes]);

  const handlePrint = () => {
    window.print();
  };

  const getSubTitleText = () => {
    const provText = selectedProv === 'all' ? 'Tất cả 34 tỉnh' : selectedProv;
    const groupText = selectedGroup === 'all' ? 'tất cả phân tổ xã' : `xã nhóm ${selectedGroup}`;
    return `Số liệu thống kê tích hợp cho: ${provText} (${groupText}) - Tính toán dựa trên ${calculatedCommunes.length} đơn vị hành chính cấp cơ sở.`;
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-1">
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
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
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

        <div className="text-xs text-[#014285] font-black flex items-center gap-1.5 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200">
          <Calculator className="w-4 h-4 animate-pulse" />
          <span>Số xã tính toán: {calculatedCommunes.length} xã</span>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/25">
          <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
            BIỂU MẪU TỔNG HỢP BỘ CHỈ SỐ THEO DÕI NTM
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            {getSubTitleText()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
                  <td className="py-4 px-6 font-bold text-slate-900">{ind.name}</td>
                  <td className="py-4 px-6 text-center">{ind.unit}</td>
                  <td className="py-4 px-6 font-mono text-[10px] text-slate-500 bg-slate-50/50">{ind.formulaDesc}</td>
                  <td className="py-4 px-6 text-center text-sm font-black text-[#014285] bg-blue-50/15">
                    {ind.calculatedValue}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wide flex items-center justify-center gap-1 ${
                      ind.isPass 
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

      {/* EXPORT / PRINT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 animate-slide-up flex flex-col max-h-[95vh] font-sans">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#014285]" />
                <h4 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">
                  Kết xuất biểu mẫu chỉ số NTM (Bản chính thức)
                </h4>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-750">
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
                  <div className="grid grid-cols-3 gap-4 border border-slate-250 rounded-xl p-4 my-6 text-[11px] font-semibold bg-slate-50/50">
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
                  <table className="w-full border-collapse border border-slate-300 text-[10px] text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-300 text-slate-800 font-black uppercase text-[9px]">
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
                        <tr key={ind.id} className="font-semibold">
                          <td className="border border-slate-300 p-2 text-center">{index + 1}</td>
                          <td className="border border-slate-300 p-2 text-center text-[#014285] font-bold">{ind.code}</td>
                          <td className="border border-slate-300 p-2 font-bold">{ind.name}</td>
                          <td className="border border-slate-300 p-2 text-center">{ind.unit}</td>
                          <td className="border border-slate-300 p-2 font-mono text-[8px] text-slate-500">{ind.formulaDesc}</td>
                          <td className="border border-slate-300 p-2 text-center font-black">{ind.calculatedValue}</td>
                          <td className="border border-slate-300 p-2 text-center font-black text-slate-800">
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
                className="px-5 py-2.5 border border-slate-300 text-slate-650 text-xs font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Đóng lại
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-[#014285] hover:bg-[#002d5c] text-white text-xs font-black uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
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
