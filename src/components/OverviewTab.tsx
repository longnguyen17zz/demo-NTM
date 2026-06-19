import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  ClipboardCheck,
  Calendar,
  Download,
  Check,
  Loader2,
  MapPin,
  Clock,
  AlertTriangle,
  FileCheck2,
  Flame,
  Sprout
} from 'lucide-react';

interface OverviewTabProps {
  onGoToReport: () => void;
}

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const value = payload.value;
  let line1 = value;
  let line2 = "";

  if (value === 'T. Đan Phượng') { line1 = 'T. Đan'; line2 = 'Phượng'; }
  else if (value === 'T. Đông Anh') { line1 = 'T. Đông'; line2 = 'Anh'; }
  else if (value === 'T. Thanh Trì') { line1 = 'T. Thanh'; line2 = 'Trì'; }
  else if (value === 'T. Gia Lâm') { line1 = 'T. Gia Lâm'; line2 = ''; }
  else if (value === 'T. Hoài Đức') { line1 = 'T. Hoài'; line2 = 'Đức'; }
  else if (value === 'T. Quốc Oai') { line1 = 'T. Quốc'; line2 = 'Oai'; }

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#64748b" className="text-xs font-bold" dy={4}>
        <tspan x="0" dy="8">{line1}</tspan>
        {line2 && <tspan x="0" dy="13">{line2}</tspan>}
      </text>
    </g>
  );
};

export default function OverviewTab({ onGoToReport }: OverviewTabProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);

  // Grouped Bar Chart Data (Tỷ lệ hoàn thành tiêu chí)
  const barChartData = [
    { name: 'T. Đan Phượng', datChuan: 19, dangThucHien: 2 },
    { name: 'T. Đông Anh', datChuan: 18, dangThucHien: 3 },
    { name: 'T. Thanh Trì', datChuan: 16, dangThucHien: 5 },
    { name: 'T. Gia Lâm', datChuan: 17, dangThucHien: 4 },
    { name: 'T. Hoài Đức', datChuan: 15, dangThucHien: 6 },
    { name: 'T. Quốc Oai', datChuan: 12, dangThucHien: 9 },
  ];

  // Donut chart progress matching 142/185 (76.75% achieved)
  const donutData = [
    { name: 'Đạt chuẩn NTM', value: 142, color: '#1d4ed8' },
    { name: 'Đang xây dựng', value: 43, color: '#e2e8f0' }
  ];

  // Heatmap criteria matrix (11 criteria for 4 core districts)
  const matrixData = [
    {
      district: 'Đan Phượng',
      scores: [100, 98, 85, 95, 88, 100, 80, 75, 92, 85, 96]
    },
    {
      district: 'Đông Anh',
      scores: [95, 85, 70, 88, 92, 80, 94, 98, 72, 81, 84]
    },
    {
      district: 'Thanh Trì',
      scores: [88, 94, 92, 85, 75, 72, 80, 65, 82, 90, 88]
    },
    {
      district: 'Gia Lâm',
      scores: [75, 68, 45, 72, 81, 90, 92, 84, 60, 78, 85]
    }
  ];

  const criteriaHeaders = ['TC 01', 'TC 02', 'TC 03', 'TC 04', 'TC 05', 'TC 06', 'TC 07', 'TC 08', 'TC 09', 'TC 10', 'TC 11'];

  // Helper function to color code percentages in the criteria matrix
  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-[#10b981] text-white border-[#10b981]'; // Glowing Green
    if (score >= 80) return 'bg-[#a7f3d0] text-[#065f46] border-[#a7f3d0]'; // Pale Green
    if (score >= 70) return 'bg-[#fef08a] text-[#854d0e] border-[#fef08a]'; // Pale Yellow
    if (score >= 60) return 'bg-[#fed7aa] text-[#9a3412] border-[#fed7aa]'; // Pale Orange
    return 'bg-[#fecaca] text-[#991b1b] border-[#fecaca]'; // Pale Red/Pink
  };

  // Simulated export PDF functionality as premium feature
  const handleExportReport = () => {
    setDownloading(true);
    setDownloadStep(1);

    setTimeout(() => {
      setDownloadStep(2);
      setTimeout(() => {
        setDownloadStep(3);
        setTimeout(() => {
          setDownloading(false);
          setDownloadStep(0);
          // Trigger actual file download download pattern
          const element = document.createElement("a");
          const file = new Blob(["BÁO CÁO GIÁM SÁT MỨC ĐỘ HOÀN THÀNH TIÊU CHÍ NÔNG THÔN MỚI\n\nTỷ lệ đạt chuẩn toàn tỉnh: 76.7% (142/185 Xã)\nThời gian xuất bản: " + new Date().toLocaleString()], { type: 'text/plain' });
          element.href = URL.createObjectURL(file);
          element.download = `Bao_Cao_Tong_Hop_NTM_${new Date().getFullYear()}.txt`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none animate-fade-in text-[#2d3748]">

      {/* Dynamic breadcrumb & Title header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs font-semibold text-[#64748b] tracking-wide mb-1 flex items-center gap-1.5">
            <span>Trang chủ</span>
            <span>&gt;</span>
            <span className="text-[#014285] font-bold">Tổng quan Dashboard</span>
          </nav>
          <h1 className="text-2xl font-black text-[#0f2942] tracking-tight flex items-center gap-2">
            Tổng quan Hệ thống Giám sát
          </h1>
        </div>

        {/* Filters and export button exactly matching mockup */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="bg-white border border-[#cbd5e1] rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-[#334155] shadow-sm flex-1 sm:flex-initial justify-center">
            <Calendar className="w-4 h-4 text-[#64748b]" />
            <span>Quý 3, 2024</span>
          </div>

          <button
            onClick={handleExportReport}
            disabled={downloading}
            className="bg-[#014285] hover:bg-[#00346a] text-white rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer select-none active:scale-95 disabled:bg-slate-400 disabled:shadow-none flex-1 sm:flex-initial justify-center"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloading ? "Đang xuất..." : "Xuất BCTH"}</span>
          </button>
        </div>
      </div>

      {/* Export Loader Modal Overlay */}
      {downloading && (
        <div className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#edf5ff] flex items-center justify-center text-[#014285]">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#0f2942]">Đang khởi tạo báo cáo đồng bộ</h4>
                <p className="text-xs text-slate-400">Vui lòng đợi giây lát trong khi hệ thống kết hợp tệp dữ liệu</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className={downloadStep >= 1 ? "text-emerald-600 font-bold" : "text-slate-400"}>1. Trích xuất dữ liệu bản đồ số</span>
                {downloadStep >= 1 ? <Check className="w-4 h-4 text-emerald-500 font-black" /> : null}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={downloadStep >= 2 ? "text-emerald-600 font-bold" : "text-slate-400"}>2. Tính toán ma trận hoàn thành 47 tiêu chí</span>
                {downloadStep >= 2 ? <Check className="w-4 h-4 text-emerald-500 font-black" /> : null}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={downloadStep >= 3 ? "text-emerald-600 font-bold" : "text-slate-400"}>3. Nén tệp văn bản và tải xuống hồ sơ</span>
                {downloadStep >= 3 ? <Check className="w-4 h-4 text-emerald-500 font-black" /> : null}
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#014285] h-full transition-all duration-500"
                style={{ width: `${(downloadStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Stats Summary Grid (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">

        {/* Stat Card 1: THU NHẬP BÌNH QUÂN */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e2e8f0] hover:border-blue-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 z-10 min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#64748b] uppercase">THU NHẬP BÌNH QUÂN</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0f2942] tracking-tight">54.2 Tr VNĐ</h3>
              <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 mt-2">
                <span>▲ +8.4%</span>
                <span className="text-[#64748b] font-medium">so với 2023</span>
              </p>
            </div>
            {/* Premium gradient icon container */}
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#014285] to-[#0284c7] rounded-xl text-white shadow-[0_4px_12px_rgba(1,66,133,0.2)] group-hover:scale-110 transition-transform duration-300 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          {/* Abstract bottom decoration */}
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#014285]/10 to-transparent rounded-full group-hover:scale-150 transition-all duration-500" />
        </div>

        {/* Stat Card 2: TỶ LỆ HỘ NGHÈO */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e2e8f0] hover:border-emerald-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 z-10 min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#64748b] uppercase">TỶ LỆ HỘ NGHÈO</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0f2942] tracking-tight">1.82%</h3>
              <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 mt-2">
                <span>▼ -0.45%</span>
                <span className="text-[#64748b] font-medium">cải thiện</span>
              </p>
            </div>
            {/* Premium gradient icon container */}
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full group-hover:scale-150 transition-all duration-500" />
        </div>

        {/* Stat Card 3: TỶ LỆ NƯỚC SẠCH */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e2e8f0] hover:border-blue-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group cursor-pointer">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 z-10 min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#64748b] uppercase">TỶ LỆ NƯỚC SẠCH</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0f2942] tracking-tight">94.5%</h3>
              <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 mt-2">
                <span>✓ Đã vượt chỉ tiêu</span>
              </p>
            </div>
            {/* Premium gradient icon container */}
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] rounded-xl text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full group-hover:scale-150 transition-all duration-500" />
        </div>

        {/* Stat Card 4: XÃ ĐẠT CHUẨN NTM (Progress style card with matching layout) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e2e8f0] hover:border-purple-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group cursor-pointer">
          <div className="z-10 relative flex justify-between items-start gap-3 mb-3">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#64748b] uppercase">XÃ ĐẠT CHUẨN NTM</p>
              <div className="flex items-baseline gap-1 mt-1 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-[#0f2942] tracking-tight">142</h3>
                <span className="text-xs font-semibold text-slate-400">/ 185 xã</span>
              </div>
            </div>
            {/* Premium gradient icon container */}
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-xl text-white shadow-[0_4px_12px_rgba(139,92,246,0.2)] group-hover:scale-110 transition-transform duration-300 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>

          <div className="z-10 relative">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#64748b] font-semibold">Tiến độ năm 2024</span>
              <span className="text-[#8b5cf6] bg-[#f5f3ff] px-2 py-0.5 rounded-md border border-purple-100">76.7%</span>
            </div>

            {/* Standard progress bar underneath */}
            <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: '76.7%' }}
              />
            </div>

            <p className="text-[10px] sm:text-xs text-[#64748b] mt-2 font-medium">76.7% hoàn thành kế hoạch năm</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full group-hover:scale-150 transition-all duration-500" />
        </div>

      </div>

      {/* Main visual graphic sections (Grouped bar chart & Donut status chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Card: Recharts Grouped Bar chart */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
                Tỷ lệ hoàn thành tiêu chí giữa các Tỉnh
              </h3>
              <p className="text-xs text-slate-400 font-medium">Số liệu chi tiết phân lượng đạt chuẩn của từng đơn vị hành chính</p>
            </div>

            {/* Recharts Legend custom indicator box */}
            <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#1d4ed8] rounded" />
                <span className="text-slate-600 font-bold">Đạt chuẩn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#93c5fd] rounded" />
                <span className="text-slate-600 font-bold">Đang thực hiện</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full relative min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                barSize={16}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={<CustomXAxisTick />}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(226, 232, 240, 0.3)' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f2942', marginBottom: '4px' }}
                />
                <Bar name="Đạt chuẩn" dataKey="datChuan" fill="#1d4ed8" radius={[3, 3, 0, 0]} />
                <Bar name="Đang thực hiện" dataKey="dangThucHien" fill="#93c5fd" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card: Donut visual chart */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
              Tỉ lệ đạt chuẩn toàn tỉnh
            </h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5 tracking-wide">Trạng thái tổng hợp 185 Xã</p>
          </div>

          {/* Centered Donut with absolute overlay text exactly as mockup */}
          <div className="h-44 w-full relative flex items-center justify-center my-2 min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute text-center flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-black text-[#0f2942] leading-tight">76.7%</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Xã đạt chuẩn</span>
            </div>
          </div>

          {/* Underlay criteria indicator statistics */}
          <div className="space-y-3.5 pt-2 border-t border-slate-50">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1d4ed8]" />
                <span className="text-[#334155] font-bold">Đạt chuẩn NTM</span>
              </div>
              <span className="font-extrabold text-[#1d4ed8] bg-[#edf2f8] px-2.5 py-1 rounded-md border border-slate-100">142 Xã</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
                <span className="text-[#334155] font-bold">Đang xây dựng</span>
              </div>
              <span className="font-extrabold text-[#0f2942] bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">43 Xã</span>
            </div>
          </div>
        </div>

      </div>

      {/* Heatmap Section: Criteria Completion Matrix (Ma trận hoàn thành 47 tiêu chí) */}
      <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
              Ma trận mức độ hoàn thành tiêu chí
            </h3>
            <p className="text-xs text-slate-400 font-medium">Phân tích chi tiết 47 tiêu chí NTM theo từng đơn vị hành chính</p>
          </div>

          {/* Interactive Heatmap Colors Legend */}
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <span>Thấp</span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded bg-[#fecaca] inline-block" title="Dưới 60%" />
              <span className="w-3.5 h-3.5 rounded bg-[#fed7aa] inline-block" title="60-69%" />
              <span className="w-3.5 h-3.5 rounded bg-[#fef08a] inline-block" title="70-79%" />
              <span className="w-3.5 h-3.5 rounded bg-[#a7f3d0] inline-block" title="80-91%" />
              <span className="w-3.5 h-3.5 rounded bg-[#10b981] inline-block" title="Trên 92%" />
            </div>
            <span>Cao</span>
          </div>
        </div>

        {/* Scalable responsive matrix table wrapper */}
        <div className="overflow-x-auto rounded-lg border border-[#cbd5e1]/60">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#cbd5e1]/40 text-slate-500 text-xs font-extrabold uppercase tracking-wide">
                <th className="py-3 px-4 font-black border-r border-[#cbd5e1]/40 sticky left-0 bg-[#f8fafc] z-10 w-32">
                  Đơn vị \ Tiêu chí
                </th>
                {criteriaHeaders.map((header) => (
                  <th key={header} className="py-3 px-2.5 text-center min-w-[55px]">
                    {header}
                  </th>
                ))}
                <th className="py-3 px-3 text-center text-[#0b4aa6] bg-blue-50/40">
                  ...
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#cbd5e1]/30">
              {matrixData.map((row) => (
                <tr key={row.district} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-xs font-black text-[#0f2942] bg-white border-r border-[#cbd5e1]/40 sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                    {row.district}
                  </td>
                  {row.scores.map((score, idx) => (
                    <td key={idx} className="py-2.5 px-1.5 text-center">
                      <div className={`mx-auto w-11 py-1.5 rounded-lg text-xs font-black border text-center transition-transform hover:scale-105 duration-200 cursor-help ${getHeatmapColor(score)}`}>
                        {score}%
                      </div>
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center text-slate-400 font-extrabold bg-slate-50/30">
                    ...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Second main grid row (Heatmap map & alert logs side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Card: Bản đồ nhiệt khu vực */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between lg:col-span-2">
          <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
                Bản đồ nhiệt khu vực
              </h3>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5 tracking-wide">Tương tác trực quan địa hình</p>
            </div>

            <MapPin className="w-4 h-4 text-[#014285]" />
          </div>

          <div className="relative w-full h-[240px] bg-[#0c2e27] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#115e4a]/20 shadow-[inner_0_2px_8px_rgba(0,0,0,0.4)] group">

            {/* Custom SVG Drawing of premium geographic map */}
            <svg viewBox="0 0 400 240" className="w-full h-full opacity-90 transition-transform duration-700 group-hover:scale-[1.03]">
              {/* Regional outer bounding path in dark green */}
              <path d="M50 40 C70 30, 110 50, 130 30 C150 10, 190 20, 210 40 C230 60, 270 50, 290 70 C310 90, 350 110, 360 130 C370 150, 340 180, 320 200 C300 220, 240 210, 210 220 C180 230, 150 200, 120 210 Q90 220, 70 180 C50 140, 30 110, 40 80 C50 50, 30 50, 50 40 Z" fill="#0c473a" stroke="#10b981" strokeWidth="1.8" />

              {/* Secondary district dividing lines */}
              <path d="M130 30 Q170 100 210 220" stroke="#052e25" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
              <path d="M60 160 Q180 130 360 130" stroke="#052e25" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
              <path d="M220 40 Q210 120 320 200" stroke="#052e25" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

              {/* Major Glowing nodes green/orange/red */}
              <circle cx="90" cy="70" r="14" fill="#10b981" fillOpacity="0.15" />
              <circle cx="90" cy="70" r="6" fill="#10b981" />
              <text x="90" y="52" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">T. Đan Phượng</text>

              <circle cx="210" cy="80" r="14" fill="#10b981" fillOpacity="0.15" />
              <circle cx="210" cy="80" r="6" fill="#10b981" />
              <text x="210" y="62" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">T. Đông Anh</text>

              <circle cx="160" cy="170" r="14" fill="#eab308" fillOpacity="0.15" />
              <circle cx="160" cy="170" r="6" fill="#eab308" />
              <text x="160" y="152" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">T. Thanh Trì</text>

              <circle cx="290" cy="140" r="14" fill="#ef4444" fillOpacity="0.15" />
              <circle cx="290" cy="140" r="6" fill="#ef4444" />
              <text x="290" y="122" fill="#fecaca" fontSize="10" fontWeight="bold" textAnchor="middle">T. Gia Lâm</text>
            </svg>

            {/* Floating layout legend card with white background matching reference screenshot */}
            <div className="absolute bottom-2 sm:bottom-3 left-2 right-2 sm:left-auto sm:right-3 bg-white/95 backdrop-blur-sm p-2 sm:p-2.5 rounded-lg border border-slate-200 shadow-lg z-10 sm:w-44">
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-[#0f2942] hidden sm:block uppercase border-b border-slate-100 pb-1">Chú dẫn bản đồ</span>
              <div className="flex sm:flex-col justify-around sm:justify-start gap-x-2 gap-y-0.5 sm:space-y-1 text-[9px] sm:text-xs font-bold text-slate-600 mt-0.5 sm:mt-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block shrink-0" />
                  <span>Đạt chuẩn (&gt;95%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#eab308] inline-block shrink-0" />
                  <span className="truncate">Cơ bản đạt (75-95%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block shrink-0" />
                  <span>Chưa đạt (&lt;75%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Thông báo & Sự kiện quan trọng */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-[#0f2942] tracking-tight">
                Thông báo & Sự kiện quan trọng
              </h3>
              <p className="text-xs text-slate-400 font-medium">Bản tin cập nhật số liệu tiến độ tự động hằng giờ</p>
            </div>

            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">

            {/* Box 1: Blue highlighted notification */}
            <div className="p-3.5 bg-[#edf5ff] hover:bg-[#e1eeff] rounded-lg border-l-4 border-blue-600 transition-colors space-y-1 relative">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-black text-[#0f2942] pr-6 leading-tight">
                  Xã Đông Anh đã gửi hồ sơ xét công nhận NTM nâng cao
                </h4>
                <span className="text-xs text-blue-600 font-bold whitespace-nowrap">2 giờ trước</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Hồ sơ bao gồm 47 tiêu chí đã qua thẩm định nội bộ. Đang chờ Hội đồng tỉnh phê duyệt.
              </p>
            </div>

            {/* Box 2: Green highlighted indicator */}
            <div className="p-3.5 bg-emerald-50 hover:bg-emerald-100/50 rounded-lg border-l-4 border-emerald-600 transition-colors space-y-1 relative">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-black text-[#0f2942] pr-6 leading-tight">
                  Chỉ số Thu nhập bình quân Quý 2 vượt dự kiến 1.2%
                </h4>
                <span className="text-xs text-emerald-600 font-bold whitespace-nowrap">5 giờ trước</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Sự tăng trưởng mạnh mẽ ở khu vực làng nghề truyền thống đóng góp vào kết quả chung.
              </p>
            </div>

            {/* Box 3: Red alert highlight */}
            <div className="p-3.5 bg-rose-50 hover:bg-rose-100/50 rounded-lg border-l-4 border-rose-500 transition-colors space-y-1 relative">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-black text-rose-950 pr-6 leading-tight">
                  Cảnh báo: Tỷ lệ xử lý rác thải tại Xã Gia Lâm chưa đạt tiến độ
                </h4>
                <span className="text-xs text-rose-600 font-bold whitespace-nowrap">Hôm qua</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Cần có biện pháp đôn đốc tiến độ xây dựng nhà máy xử lý rác tập trung.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
