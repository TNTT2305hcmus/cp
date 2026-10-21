import React, { useRef, useState } from 'react';
import { Download, Upload, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { progressService } from '../services/progressService';
import { Card } from './Card';
import { Button } from './Button';

interface ProgressSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTheories: Record<string, boolean>;
  completedProblems: Record<string, boolean>;
  onProgressImported: (theories: Record<string, boolean>, problems: Record<string, boolean>) => void;
}

export const ProgressSyncModal: React.FC<ProgressSyncModalProps> = ({
  isOpen,
  onClose,
  completedTheories,
  completedProblems,
  onProgressImported,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      progressService.downloadBackup(completedTheories, completedProblems);
      setNotification({
        type: 'success',
        message: 'Đã xuất file sao lưu tiến độ thành công!',
      });
    } catch {
      setNotification({
        type: 'error',
        message: 'Lỗi khi xuất file sao lưu.',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = progressService.importProgress(content);
      if (res.success && res.data) {
        onProgressImported(res.data.completedTheories, res.data.completedProblems);
        setNotification({
          type: 'success',
          message: 'Khôi phục tiến độ từ file thành công!',
        });
      } else {
        setNotification({
          type: 'error',
          message: res.error || 'File sao lưu không hợp lệ.',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const theoriesCount = Object.values(completedTheories).filter(Boolean).length;
  const problemsCount = Object.values(completedProblems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sao Lưu & Đồng Bộ Tiến Độ
            </h3>
            <p className="text-xs text-slate-500">
              Lưu và phục hồi dữ liệu học tập qua file JSON
            </p>
          </div>
        </div>

        {/* Current status */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500">Lý thuyết đã qua:</div>
            <div className="text-lg font-bold text-teal-600 dark:text-teal-400 font-mono">
              {theoriesCount} bài
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Bài LeetCode AC:</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
              {problemsCount} bài
            </div>
          </div>
        </div>

        {notification && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg text-xs mb-4 ${
              notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            Xuất File Sao Lưu (.json)
          </Button>

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold"
          >
            <Upload className="w-4 h-4" />
            Khôi Phục Tiến Độ Từ File
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
        </div>

        <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center">
          Dữ liệu của bạn được lưu an toàn trong trình duyệt. Khi đổi máy tính hoặc sang thiết bị khác, bạn chỉ cần xuất file và khôi phục lại để không mất tiến độ.
        </p>
      </Card>
    </div>
  );
};
