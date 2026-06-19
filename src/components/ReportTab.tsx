import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  Save,
  Send,
  Info,
  CheckCircle2,
  AlertTriangle,
  Upload,
  File,
  X,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { CriterionRow, ReportMeta, SubmissionStatus, ProofFile } from '../types';

interface ReportTabProps {
  reportData: CriterionRow[];
  onDataChange: (newData: CriterionRow[]) => void;
  reportMeta: ReportMeta;
  onMetaChange: (newMeta: ReportMeta) => void;
}

export default function ReportTab({
  reportData,
  onDataChange,
  reportMeta,
  onMetaChange,
}: ReportTabProps) {
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [digitalSignInput, setDigitalSignInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [cellFlashes, setCellFlashes] = useState<Record<string, boolean>>({});

  // Dynamic Sum Calculation for all columns
  const columnSums = useMemo(() => {
    return reportData.reduce(
      (sums, row) => {
        sums.g1Pre += Number(row.group1.prevYear) || 0;
        sums.g1Cur += Number(row.group1.currentS1) || 0;
        sums.g1Plan += Number(row.group1.planS2) || 0;

        sums.g2Pre += Number(row.group2.prevYear) || 0;
        sums.g2Cur += Number(row.group2.currentS1) || 0;
        sums.g2Plan += Number(row.group2.planS2) || 0;

        sums.g3Pre += Number(row.group3.prevYear) || 0;
        sums.g3Cur += Number(row.group3.currentS1) || 0;
        sums.g3Plan += Number(row.group3.planS2) || 0;
        return sums;
      },
      { g1Pre: 0, g1Cur: 0, g1Plan: 0, g2Pre: 0, g2Cur: 0, g2Plan: 0, g3Pre: 0, g3Cur: 0, g3Plan: 0 }
    );
  }, [reportData]);

  // Handle Input Change and trigger real-time changes
  const handleInputChange = (
    rowId: number,
    group: 'group1' | 'group2' | 'group3',
    field: 'prevYear' | 'currentS1' | 'planS2',
    val: string
  ) => {
    const numVal = val === '' ? 0 : Math.max(0, parseInt(val) || 0);

    const updated = reportData.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          [group]: {
            ...row[group],
            [field]: numVal,
          },
        };
      }
      return row;
    });

    onDataChange(updated);

    // Trigger cell flash feedback
    const key = `${rowId}-${group}-${field}`;
    setCellFlashes((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCellFlashes((prev) => ({ ...prev, [key]: false }));
    }, 450);
  };

  const handleNoteChange = (rowId: number, noteVal: string) => {
    const updated = reportData.map((row) => {
      if (row.id === rowId) {
        return { ...row, note: noteVal };
      }
      return row;
    });
    onDataChange(updated);
  };

  // Safe manual draft save triggers local persistence
  const handleSaveDraft = () => {
    localStorage.setItem('Draft_NTM_Data', JSON.stringify(reportData));
    localStorage.setItem('Draft_NTM_Meta', JSON.stringify({ ...reportMeta, status: 'UPDATING' }));
    onMetaChange({ ...reportMeta, status: 'UPDATING' });

    setNotifyMessage('Đã lưu dữ liệu báo cáo thành bản nháp thành công vào hệ thống.');
    setTimeout(() => setNotifyMessage(null), 4000);
  };

  // Submit report flow with electronic signature (Chữ ký số)
  const handleOpenSubmitPopup = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!digitalSignInput.trim()) {
      alert('Vui lòng nhập họ và tên để ký số xác thực báo cáo.');
      return;
    }

    onMetaChange({
      ...reportMeta,
      status: 'SUBMITTED',
      editor: digitalSignInput,
      updatedAt: new Date().toISOString(),
    });

    localStorage.setItem(
      'Draft_NTM_Meta',
      JSON.stringify({
        ...reportMeta,
        status: 'SUBMITTED',
        editor: digitalSignInput,
        updatedAt: new Date().toISOString(),
      })
    );

    setShowConfirmPopup(false);
    setDigitalSignInput('');

    setNotifyMessage('Chúc mừng! Báo cáo kết quả bộ tiêu chí xây dựng Nông thôn mới đã được gửi lên cấp quốc gia.');
    setTimeout(() => setNotifyMessage(null), 5000);
  };

  // MOCK FILE UPLOAD drag & drop support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: ProofFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const isXls = f.name.endsWith('.xlsx') || f.name.endsWith('.xls');
      newFiles.push({
        name: f.name,
        size: f.size,
        uploadedAt: new Date().toISOString().split('T')[0],
        type: isXls ? 'xlsx' : 'pdf',
      });
    }

    const updatedMeta = {
      ...reportMeta,
      proofFiles: [...reportMeta.proofFiles, ...newFiles],
    };
    onMetaChange(updatedMeta);

    setNotifyMessage(`Đã tải lên thành công ${files.length} tệp tài liệu chứng thực.`);
    setTimeout(() => setNotifyMessage(null), 4000);
  };

  const handleDeleteFile = (fileName: string) => {
    const updatedMeta = {
      ...reportMeta,
      proofFiles: reportMeta.proofFiles.filter((f) => f.name !== fileName),
    };
    onMetaChange(updatedMeta);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      {/* Toast Notification */}
      {notifyMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 max-w-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-status-complete" />
          <span className="text-xs font-semibold leading-relaxed">{notifyMessage}</span>
          <button onClick={() => setNotifyMessage(null)} className="ml-auto text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-secondary">
        <span className="hover:text-primary cursor-pointer transition-colors">Báo cáo trung ương</span>
        <span className="text-slate-400 font-normal">/</span>
        <span className="text-primary font-extrabold">Biểu mẫu số 05</span>
      </nav>

      {/* Primary Program Header */}
      <div className="bg-white p-8 rounded-xl border border-surface-border shadow-sm flex flex-col md:flex-row justify-between items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <FileText className="w-36 h-36 text-primary rotate-12" />
        </div>
        <div className="relative z-10 flex-1">
          <span className="inline-block px-3 py-1 bg-primary-fixed text-primary font-bold text-xs rounded-full uppercase tracking-wider mb-3">
            {reportMeta.code}
          </span>
          <h3 className="text-xl font-bold text-primary tracking-tight leading-snug">
            {reportMeta.title}
          </h3>
          <p className="text-xs text-secondary mt-2 max-w-3xl leading-relaxed font-medium">
            {reportMeta.subTitle}
          </p>
        </div>

        {/* Dynamic Status indicators */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {reportMeta.status === 'UPDATING' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-status-pending rounded-lg border border-yellow-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-pending opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-pending"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">Đang cập nhật</span>
            </div>
          )}
          {reportMeta.status === 'SUBMITTED' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-status-submitted rounded-lg border border-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-submitted opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-submitted"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">Đã gửi báo cáo</span>
            </div>
          )}
          <span className="text-xs text-secondary font-medium block">Hạn chót: {reportMeta.deadline}</span>
        </div>
      </div>

      {/* Central Table Container */}
      <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[1200px]">
            <thead>
              {/* Row 1 Headers */}
              <tr className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-surface-border">
                <th className="px-3 py-4 border-r border-surface-border text-center w-12 sticky left-0 bg-slate-50 z-20" rowSpan={2}>
                  TT
                </th>
                <th className="px-6 py-4 border-r border-surface-border min-w-[280px] sticky left-12 bg-slate-50 z-20" rowSpan={2}>
                  Nội dung tiêu chí
                </th>
                <th className="px-4 py-4 border-r border-surface-border text-center w-20" rowSpan={2}>
                  ĐVT
                </th>
                <th className="px-4 py-3 border-r border-surface-border text-center bg-slate-100/50" colSpan={3}>
                  Xã nhóm 1
                </th>
                <th className="px-4 py-3 border-r border-surface-border text-center bg-slate-100" colSpan={3}>
                  Xã nhóm 2
                </th>
                <th className="px-4 py-3 border-r border-surface-border text-center bg-slate-100/50" colSpan={3}>
                  Xã nhóm 3
                </th>
                <th className="px-6 py-4 min-w-[200px]" rowSpan={2}>
                  Ghi chú
                </th>
              </tr>
              {/* Row 2 Headers */}
              <tr className="bg-slate-50 text-xs text-secondary font-bold text-center border-b border-surface-border">
                <th className="px-2 py-3 border-r border-surface-border w-24">Kết quả đến 31/12 năm trước</th>
                <th className="px-2 py-3 border-r border-surface-border w-24">Thực hiện 6 tháng năm...</th>
                <th className="px-2 py-3 border-r border-surface-border w-24">Kế hoạch 6 tháng cuối năm</th>

                <th className="px-2 py-3 border-r border-surface-border w-24">Kết quả đến 31/12 năm trước</th>
                <th className="px-2 py-3 border-r border-surface-border w-24">Thực hiện 6 tháng năm...</th>
                <th className="px-2 py-3 border-r border-surface-border w-24">Kế hoạch 6 tháng cuối năm</th>

                <th className="px-2 py-3 border-r border-surface-border w-24">Kết quả đến 31/12 năm trước</th>
                <th className="px-2 py-3 border-r border-surface-border w-24">Thực hiện 6 tháng năm...</th>
                <th className="px-2 py-3 border-r border-surface-border w-24">Kế hoạch 6 tháng cuối năm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs text-slate-700">
              {reportData.map((row) => (
                <tr key={row.id} className="hover:bg-data-logic-blue/30 transition-colors">
                  {/* TT */}
                  <td className="px-3 py-3 text-center border-r border-surface-border font-mono text-secondary font-medium sticky left-0 bg-white z-10">
                    {row.id}
                  </td>
                  {/* Category content text */}
                  <td className="px-6 py-3 border-r border-surface-border font-semibold text-slate-800 sticky left-12 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.015)]">
                    {row.category}
                  </td>
                  {/* Unit */}
                  <td className="px-4 py-3 text-center border-r border-surface-border text-secondary">
                    {row.unit}
                  </td>

                  {/* Group 1 values */}
                  <td className="p-1 border-r border-surface-border">
                    <input
                      type="number"
                      value={row.group1.prevYear}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group1', 'prevYear', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group1-prevYear`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>
                  <td className="p-1 border-r border-surface-border">
                    <input
                      type="number"
                      value={row.group1.currentS1}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group1', 'currentS1', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group1-currentS1`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>
                  <td className="p-1 border-r border-surface-border bg-data-logic-blue/10">
                    <input
                      type="number"
                      value={row.group1.planS2}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group1', 'planS2', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group1-planS2`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>

                  {/* Group 2 values */}
                  <td className="p-1 border-r border-surface-border">
                    <input
                      type="number"
                      value={row.group2.prevYear}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group2', 'prevYear', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group2-prevYear`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>
                  <td className="p-1 border-r border-surface-border">
                    <input
                      type="number"
                      value={row.group2.currentS1}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group2', 'currentS1', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group2-currentS1`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>
                  <td className="p-1 border-r border-surface-border bg-data-logic-blue/10">
                    <input
                      type="number"
                      value={row.group2.planS2}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group2', 'planS2', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group2-planS2`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>

                  {/* Group 3 values */}
                  <td className="p-1 border-r border-surface-border">
                    <input
                      type="number"
                      value={row.group3.prevYear}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group3', 'prevYear', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group3-prevYear`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>
                  <td className="p-1 border-r border-surface-border">
                    <input
                      type="number"
                      value={row.group3.currentS1}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group3', 'currentS1', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group3-currentS1`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>
                  <td className="p-1 border-r border-surface-border bg-data-logic-blue/10">
                    <input
                      type="number"
                      value={row.group3.planS2}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleInputChange(row.id, 'group3', 'planS2', e.target.value)}
                      className={`w-full bg-transparent border-0 text-center py-2 px-1 focus:bg-white transition-all rounded outline-none data-cell-input text-xs ${
                        cellFlashes[`${row.id}-group3-planS2`] ? 'bg-indigo-100 font-bold' : ''
                      }`}
                    />
                  </td>

                  {/* Notes columns */}
                  <td className="p-1">
                    <input
                      type="text"
                      placeholder="Nhập ghi chú..."
                      value={row.note}
                      disabled={reportMeta.status === 'SUBMITTED'}
                      onChange={(e) => handleNoteChange(row.id, e.target.value)}
                      className="w-full bg-transparent border-0 italic py-2 px-2 focus:bg-white tracking-tight text-xs outline-none focus:ring-1 focus:ring-primary rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table bottom Total Row */}
            <tfoot>
              <tr className="bg-slate-100 font-extrabold text-xs text-slate-800 border-t border-slate-300">
                <td className="px-6 py-4 text-right border-r border-surface-border sticky left-0 bg-slate-100 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.015)]" colSpan={3}>
                  TỔNG CỘNG
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g1Pre}
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g1Cur}
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g1Plan}
                </td>

                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g2Pre}
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g2Cur}
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g2Plan}
                </td>

                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g3Pre}
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g3Cur}
                </td>
                <td className="px-2 py-4 text-center border-r border-surface-border bg-primary-fixed/20">
                  {columnSums.g3Plan}
                </td>
                <td className="px-4 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Footer Action segment */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-xl border border-surface-border shadow-sm">
        <div className="flex items-center gap-3 text-secondary">
          <Info className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            Mọi dữ liệu thay đổi sẽ được lưu tự động thành bản nháp cục bộ vào trình duyệt của bạn.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={handleSaveDraft}
            className="flex-1 md:flex-none px-6 py-3 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu nháp</span>
          </button>
          <button
            onClick={handleOpenSubmitPopup}
            disabled={reportMeta.status === 'SUBMITTED'}
            className="flex-1 md:flex-none px-8 py-3 bg-primary hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{reportMeta.status === 'SUBMITTED' ? 'Đã gửi báo cáo' : 'Ký số &amp; Gửi báo cáo'}</span>
          </button>
        </div>
      </div>

      {/* Upload and technical instructions grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* PDF attachments and Drop zone */}
        <div className="md:col-span-2 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${
              dragActive
                ? 'border-primary bg-indigo-50/50'
                : 'border-slate-300 bg-white hover:border-primary/55 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              id="proof-uploader"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <label htmlFor="proof-uploader" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div className="p-3 bg-slate-100 rounded-xl mb-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Tải hồ sơ minh chứng đính kèm</h4>
              <p className="text-xs text-secondary mt-1">Kéo thả tệp hoặc click vào đây để chọn. Hỗ trợ tệp PDF, Word, Excel tối đa 25MB.</p>
            </label>
          </div>

          {/* List of uploaded files */}
          {reportMeta.proofFiles.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-surface-border">
              <h5 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Hồ sơ minh chứng đã tải lên</h5>
              <div className="space-y-2.5">
                {reportMeta.proofFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {file.type === 'xlsx' ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <File className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-800 block truncate leading-tight">{file.name}</span>
                        <span className="text-xs text-secondary">{Math.round(file.size / 1024 / 1024 * 10) / 10} MB • Ngày tải {file.uploadedAt}</span>
                      </div>
                    </div>
                    {reportMeta.status !== 'SUBMITTED' && (
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        className="text-secondary/50 hover:text-red-500 p-1 rounded"
                        title="Xóa tệp"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Requirements check list panel */}
        <div className="bg-white p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Yêu cầu kỹ thuật xét duyệt</span>
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-600 list-none pl-0">
              <li className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>Số liệu thực hiện 6 tháng được đối chứng tự động từ cổng cơ sở dữ liệu quản lý thuộc các cấp xã vệ tinh.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>Mục "Kế hoạch 6 tháng cuối năm" hiển thị tổng thể tiến trình bù đắp chỉ tiêu xã còn thiếu hụt.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>Bắt buộc có Ký số xác minh của đại diện pháp lý Sở Nông nghiệp và ban điều phối Văn phòng NTM trước khi trình Ủy ban Tỉnh phê chuẩn.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-6 flex gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-status-pending shrink-0 mt-0.5" />
            <p className="text-xs text-secondary leading-normal">
              Hệ thống sẽ từ chối tự động nếu tệp minh chứng đính kèm không có định dạng chữ ký số hợp lệ (.p12, .pfx, hoặc CA).
            </p>
          </div>
        </div>
      </div>

      {/* Digital Signature Confirmation Dialog */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg text-primary">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">Xác thực Ký số điện tử</h4>
              </div>
              <button onClick={() => setShowConfirmPopup(false)} className="text-secondary/60 hover:text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn chuẩn bị gửi báo cáo kết quả thực hiện bộ tiêu chí quốc gia xây dựng Nông thôn mới 6 tháng đầu năm 2024.
                Hành động này yêu cầu ký xác thực tên người chỉnh sửa bổ sung đại diện tỉnh để lưu trữ dấu vết kiểm toán dữ liệu.
              </p>

              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Mã biểu mẫu:</span>
                  <span className="font-bold text-slate-800">{reportMeta.code}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Hạn gửi phê duyệt:</span>
                  <span className="font-bold text-red-600">{reportMeta.deadline}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Họ và tên người ký đại diện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={digitalSignInput}
                  onChange={(e) => setDigitalSignInput(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/25 outline-none font-semibold text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmPopup(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác nhận Ký &amp; Gửi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
