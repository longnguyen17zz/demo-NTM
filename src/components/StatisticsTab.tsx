import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Sliders, Layers, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { CriterionRow } from '../types';

interface StatisticsTabProps {
  reportData: CriterionRow[];
}

export default function StatisticsTab({ reportData }: StatisticsTabProps) {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'group1' | 'group2' | 'group3'>('all');

  // Map data for Recharts bar display Comparison
  const chartData = reportData.map((item) => ({
    name: item.category,
    'Xã nhóm 1 (Thành tựu)': item.group1.currentS1,
    'Xã nhóm 2 (Thành tựu)': item.group2.currentS1,
    'Xã nhóm 3 (Thành tựu)': item.group3.currentS1,
  }));

  // Trigger spreadsheet file download
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'TT,Noi dung tieu chi,Don vi tinh,Nhom 1 (31/12),Nhom 1 (6T),Nhom 1 (KH),Nhom 2 (31/12),Nhom 2 (6T),Nhom 2 (KH),Nhom 3 (31/12),Nhom 3 (6T),Nhom 3 (KH),Ghi chu\n';

    reportData.forEach((row) => {
      const line = [
        row.id,
        `"${row.category}"`,
        row.unit,
        row.group1.prevYear,
        row.group1.currentS1,
        row.group1.planS2,
        row.group2.prevYear,
        row.group2.currentS1,
        row.group2.planS2,
        row.group3.prevYear,
        row.group3.currentS1,
        row.group3.planS2,
        `"${row.note}"`
      ].join(',');
      csvContent += line + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Bao_Cao_Nong_Thon_Moi_2024_BiêuMau05.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group average calculator Helper
  const getSumStats = (group: 'group1' | 'group2' | 'group3') => {
    const totalPrev = reportData.reduce((acc, row) => acc + row[group].prevYear, 0);
    const totalCurrent = reportData.reduce((acc, row) => acc + row[group].currentS1, 0);
    const totalPlan = reportData.reduce((acc, row) => acc + row[group].planS2, 0);
    return { prev: totalPrev, current: totalCurrent, plan: totalPlan };
  };

  const g1Stats = getSumStats('group1');
  const g2Stats = getSumStats('group2');
  const g3Stats = getSumStats('group3');

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      {/* Settings bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-amber-500 rounded-2xl border border-slate-800">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Giám sát &amp; Đối chiếu chỉ chuẩn vùng</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">Biểu đồ giám sát thống kê hạ tầng kỹ thuật giữa ba lớp phân vùng quy hoạch</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Group display selector */}
          <div className="relative w-full sm:w-auto min-w-[200px]">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-2.5 pr-10 rounded-xl text-xs font-black uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all outline-none cursor-pointer text-slate-700"
            >
              <option value="all">Hiển thị toàn Phân nhóm</option>
              <option value="group1">Hạ tầng Trung tâm (N1)</option>
              <option value="group2">Cận đô thị đặc thù (N2)</option>
              <option value="group3">Biên giới, đặc biệt khó khăn (N3)</option>
            </select>
            <Layers className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/10 hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo dữ liệu (Excel)</span>
          </button>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 block">
          TỔNG HỢP TIÊU CHÍ HOÀN THÀNH - ĐỐI SOÁT ĐỒNG BỘ 3 VÙNG ĐẶC THÙ
        </h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }} height={60} stroke="#E2E8F0" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} stroke="#E2E8F0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '11px', fontWeight: 'black', color: '#F59E0B', textTransform: 'uppercase', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
              {(selectedGroup === 'all' || selectedGroup === 'group1') && (
                <Bar name="Hạ tầng Trung tâm (Nhóm 1)" dataKey="Xã nhóm 1 (Thành tựu)" fill="#0F172A" radius={[6, 6, 0, 0]} />
              )}
              {(selectedGroup === 'all' || selectedGroup === 'group2') && (
                <Bar name="Cận Đô thị (Nhóm 2)" dataKey="Xã nhóm 2 (Thành tựu)" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              )}
              {(selectedGroup === 'all' || selectedGroup === 'group3') && (
                <Bar name="Vùng Biên giới (Nhóm 3)" dataKey="Xã nhóm 3 (Thành tựu)" fill="#10B981" radius={[6, 6, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics review summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-slate-950">
            <FileSpreadsheet className="w-20 h-20" />
          </div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Hạ tầng Trung tâm (N1)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-sm" />
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Đạt cuối năm trước:</span>
              <span className="font-extrabold text-slate-800">{g1Stats.prev} tiêu chí</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Đạt kì này (6T):</span>
              <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">{g1Stats.current} tiêu chí</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Kế hoạch cuối năm:</span>
              <span className="font-extrabold text-slate-800">{g1Stats.plan} tiêu chí</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-amber-500">
            <FileSpreadsheet className="w-20 h-20" />
          </div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Cận Đô thị đặc thù (N2)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Đạt cuối năm trước:</span>
              <span className="font-extrabold text-slate-800">{g2Stats.prev} tiêu chí</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Đạt kì này (6T):</span>
              <span className="font-black text-amber-700 bg-amber-50 px-2 py-1 rounded">{g2Stats.current} tiêu chí</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Kế hoạch cuối năm:</span>
              <span className="font-extrabold text-slate-800">{g2Stats.plan} tiêu chí</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-emerald-500">
            <FileSpreadsheet className="w-20 h-20" />
          </div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Biên giới miền núi (N3)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Đạt cuối năm trước:</span>
              <span className="font-extrabold text-slate-800">{g3Stats.prev} tiêu chí</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Đạt kì này (6T):</span>
              <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded">{g3Stats.current} tiêu chí</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-bold">
              <span>Kế hoạch cuối năm:</span>
              <span className="font-extrabold text-slate-800">{g3Stats.plan} tiêu chí</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
