import React, { useState } from 'react';
import { X, Wifi, WifiOff, RefreshCw, Trash2, Database, AlertCircle, FileText } from 'lucide-react';
import { OfflineDraft } from '../types';

interface OfflineSyncModalProps {
  offlineDrafts: OfflineDraft[];
  onClose: () => void;
  onDeleteDraft: (id: string) => void;
  onSyncAll: () => void;
  isOnline: boolean;
}

export default function OfflineSyncModal({
  offlineDrafts,
  onClose,
  onDeleteDraft,
  onSyncAll,
  isOnline
}: OfflineSyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleSyncClick = () => {
    if (!isOnline || offlineDrafts.length === 0) return;
    setIsSyncing(true);
    
    // Simulate a premium sync progress
    setTimeout(() => {
      onSyncAll();
      setIsSyncing(false);
      setSyncDone(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <Database className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Quản lý bản nháp ngoại tuyến
              </h4>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                Các biểu mẫu được cán bộ xã nhập và lưu tạm tại địa phương khi không có Internet.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isSyncing}
            className="text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent disabled:opacity-50"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 text-left space-y-4">
          
          {/* Connection check banner inside modal */}
          {isOnline ? (
            <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
              <Wifi className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>Hệ thống đã nhận diện được mạng Internet. Bạn có thể đồng bộ các bản nháp ngay bây giờ.</span>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-pulse">
              <WifiOff className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>Thiết bị hiện đang ngoại tuyến. Vui lòng kết nối Internet hoặc tắt chế độ Giả lập Offline để đồng bộ.</span>
            </div>
          )}

          {/* Sync Progress Screen */}
          {isSyncing ? (
            <div className="py-16 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h5 className="text-sm font-black text-slate-850">Đang đẩy dữ liệu lên máy chủ...</h5>
                <p className="text-xs text-slate-400 font-bold">Xác thực chứng thư số và hợp nhất số liệu bảng biểu...</p>
              </div>
            </div>
          ) : syncDone ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <X className="w-6 h-6 rotate-45" /> {/* simple checkmark fallback or we can use none */}
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-black text-[#10b981]">Đồng bộ hoàn tất!</h5>
                <p className="text-xs text-slate-400 font-bold">Dữ liệu đã được lưu trữ an toàn trong Đợt báo cáo chính thức.</p>
              </div>
            </div>
          ) : offlineDrafts.length === 0 ? (
            /* Empty Drafts queue state */
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-50 border border-dashed border-slate-250 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-black text-slate-500 uppercase tracking-wide">Hàng đợi bản nháp trống</h5>
                <p className="text-xs text-slate-400 font-bold">Không có biểu mẫu nào đang được đệm ngoại tuyến trên thiết bị này.</p>
              </div>
            </div>
          ) : (
            /* Drafts List */
            <div className="space-y-3">
              <h5 className="text-xs font-black text-[#0f2942] uppercase tracking-wider">Danh sách bản nháp đang lưu tạm ({offlineDrafts.length})</h5>
              <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {offlineDrafts.map((draft) => (
                  <div key={draft.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-800 uppercase border border-amber-200 tracking-wider shrink-0">
                          {draft.formCode}
                        </span>
                        <h6 className="font-extrabold text-slate-800 truncate leading-snug">{draft.formTitle}</h6>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400 font-bold">
                        <div>Đơn vị: <strong className="text-slate-600 font-black">{draft.communeName}</strong></div>
                        <div>Đợt rà soát: <strong className="text-slate-600 font-black">{draft.periodName}</strong></div>
                        <div className="col-span-2 mt-1">Lưu tạm lúc: <span className="font-mono text-slate-500">{draft.updatedAt}</span></div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa bản nháp ngoại tuyến của ${draft.formCode}? Dữ liệu đã thay đổi sẽ bị mất.`)) {
                          onDeleteDraft(draft.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-none bg-transparent shrink-0"
                      title="Xóa bản nháp này"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        {!isSyncing && !syncDone && (
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-650 text-xs font-black uppercase rounded-xl hover:bg-slate-50 cursor-pointer border-none bg-transparent"
            >
              Đóng lại
            </button>
            {offlineDrafts.length > 0 && (
              <button
                disabled={!isOnline}
                onClick={handleSyncClick}
                className="px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black uppercase rounded-xl flex items-center gap-1.5 cursor-pointer border-none disabled:cursor-not-allowed shadow-md transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đồng bộ tất cả</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
