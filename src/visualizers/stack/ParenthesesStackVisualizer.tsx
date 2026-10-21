import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface ParenthesesStep {
  currentIndex: number;
  stackSnapshot: string[];
  action: 'INIT' | 'PUSH' | 'MATCH' | 'ERROR' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

const parenDatasets = [
  { label: 'Hợp lệ: {[()]}', str: ['{', '[', '(', ')', ']', '}'] },
  { label: 'Lỗi không khớp: {[(])}', str: ['{', '[', '(', ']', ')', '}'] },
  { label: 'Lỗi thiếu ngoặc đóng: ((()', str: ['(', '(', '(', ')'] },
];

export const ParenthesesStackVisualizer: React.FC = () => {
  const [selectedParenDataIndex, setSelectedParenDataIndex] = useState<number>(0);
  const [parenIndex, setParenIndex] = useState<number>(0);
  const [parenPlaying, setParenPlaying] = useState<boolean>(false);
  const [parenSpeed, setParenSpeed] = useState<number>(650);
  const parenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectParenDataset = (idx: number) => {
    setSelectedParenDataIndex(idx);
    setParenIndex(0);
    setParenPlaying(false);
  };

  const parenSteps = useMemo<ParenthesesStep[]>(() => {
    const rawChars = [...parenDatasets[selectedParenDataIndex].str];
    const steps: ParenthesesStep[] = [];
    const st: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

    steps.push({
      currentIndex: -1,
      stackSnapshot: [],
      action: 'INIT',
      observation: `Khởi tạo: Chuỗi ngoặc "${rawChars.join('')}", Stack rỗng.`,
      decision: `Bắt đầu duyệt từ ký tự đầu tiên tại index 0.`,
      reason: `Stack tuân thủ LIFO: Ngoặc mở vào sau phải được đóng trước.`,
    });

    let hasError = false;

    for (let i = 0; i < rawChars.length; i++) {
      const ch = rawChars[i];

      if (ch === '(' || ch === '[' || ch === '{') {
        st.push(ch);
        steps.push({
          currentIndex: i,
          stackSnapshot: [...st],
          action: 'PUSH',
          observation: `Ký tự '${ch}' tại vị trí ${i} là ngoặc mở.`,
          decision: `Push '${ch}' vào đỉnh Stack.`,
          reason: `Cần lưu trữ ngoặc mở để chờ ngoặc đóng tương ứng ở phía sau.`,
        });
      } else {
        if (st.length === 0) {
          steps.push({
            currentIndex: i,
            stackSnapshot: [...st],
            action: 'ERROR',
            observation: `Gặp ngoặc đóng '${ch}' nhưng Stack đang rỗng!`,
            decision: `Dừng thuật toán và kết luận: Chuỗi KHÔNG hợp lệ.`,
            reason: `Không có ngoặc mở nào tương ứng cho ngoặc đóng này.`,
          });
          hasError = true;
          break;
        }

        const top = st[st.length - 1];
        if (top === pairs[ch]) {
          st.pop();
          steps.push({
            currentIndex: i,
            stackSnapshot: [...st],
            action: 'MATCH',
            observation: `Ngoặc đóng '${ch}' khớp hoàn hảo với đỉnh Stack '${top}'.`,
            decision: `Pop '${top}' ra khỏi Stack.`,
            reason: `Cặp ngoặc '${top}${ch}' đã triệt tiêu hợp lệ.`,
          });
        } else {
          steps.push({
            currentIndex: i,
            stackSnapshot: [...st],
            action: 'ERROR',
            observation: `Ngoặc đóng '${ch}' KHÔNG khớp với đỉnh Stack '${top}' (cần '${pairs[ch]}').`,
            decision: `Dừng thuật toán và kết luận: Chuỗi KHÔNG hợp lệ.`,
            reason: `Vi phạm nguyên tắc ngoặc lồng nhau (LIFO).`,
          });
          hasError = true;
          break;
        }
      }
    }

    if (!hasError) {
      if (st.length === 0) {
        steps.push({
          currentIndex: rawChars.length,
          stackSnapshot: [],
          action: 'DONE',
          observation: `Duyệt hết chuỗi và Stack rỗng hoàn toàn.`,
          decision: `Kết luận: Chuỗi ngoặc HỢP LỆ (True).`,
          reason: `Mọi ngoặc mở đều đã được đóng khớp theo đúng thứ tự lồng nhau.`,
        });
      } else {
        steps.push({
          currentIndex: rawChars.length,
          stackSnapshot: [...st],
          action: 'ERROR',
          observation: `Duyệt hết chuỗi nhưng Stack vẫn còn ${st.length} ngoặc mở chưa đóng!`,
          decision: `Kết luận: Chuỗi KHÔNG hợp lệ (False).`,
          reason: `Còn tồn tại ngoặc mở chưa có ngoặc đóng tương ứng.`,
        });
      }
    }

    return steps;
  }, [selectedParenDataIndex]);

  useEffect(() => {
    if (parenPlaying) {
      parenTimerRef.current = setInterval(() => {
        setParenIndex((prev) => {
          if (prev < parenSteps.length - 1) return prev + 1;
          setParenPlaying(false);
          return prev;
        });
      }, parenSpeed);
    } else if (parenTimerRef.current) {
      clearInterval(parenTimerRef.current);
    }
    return () => {
      if (parenTimerRef.current) clearInterval(parenTimerRef.current);
    };
  }, [parenPlaying, parenSpeed, parenSteps.length]);

  const currParen = parenSteps[parenIndex] || parenSteps[0] || {
    currentIndex: -1,
    stackSnapshot: [],
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };

  return (
    <Card className="border-teal-200 dark:border-teal-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Bộ test:</span>
          <select
            value={selectedParenDataIndex}
            onChange={(e) => handleSelectParenDataset(Number(e.target.value))}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {parenDatasets.map((d, idx) => (
              <option key={idx} value={idx}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
          <button onClick={() => setParenSpeed(1100)} className={`px-2 py-0.5 rounded ${parenSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>0.5x</button>
          <button onClick={() => setParenSpeed(650)} className={`px-2 py-0.5 rounded ${parenSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setParenSpeed(350)} className={`px-2 py-0.5 rounded ${parenSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>2x</button>
        </div>
      </div>

      {/* Paren Visualizer */}
      <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Chuỗi đầu vào */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 mb-2 font-medium">Chuỗi ký tự đang duyệt:</span>
          <div className="flex items-center gap-2">
            {parenDatasets[selectedParenDataIndex].str.map((ch, idx) => {
              const isCurrent = idx === currParen.currentIndex;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-base transition-all ${
                      isCurrent
                        ? 'bg-teal-100 dark:bg-teal-900/80 border-teal-500 text-teal-800 dark:text-teal-200 scale-110 shadow-sm'
                        : idx < currParen.currentIndex
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {ch}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stack dọc mô phỏng */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 mb-2 font-medium">Ngăn xếp Stack (Đỉnh ở trên):</span>
          <div className="w-20 min-h-[140px] border-2 border-t-0 border-slate-400 dark:border-slate-600 rounded-b-xl p-1.5 flex flex-col-reverse items-center gap-1.5 bg-slate-50/50 dark:bg-slate-900/40">
            {currParen.stackSnapshot.length === 0 ? (
              <span className="text-xs text-slate-400 my-auto font-mono">Rỗng (∅)</span>
            ) : (
              currParen.stackSnapshot.map((ch, idx) => {
                const isTop = idx === currParen.stackSnapshot.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-full py-1.5 rounded-md border text-center font-mono font-bold text-sm ${
                      isTop
                        ? 'bg-teal-500 text-white border-teal-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {ch} {isTop && <span className="text-[10px] block font-normal">(TOP)</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3 dòng chuẩn */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
        <div><strong className="text-teal-600 dark:text-teal-400">Quan sát:</strong> {currParen.observation}</div>
        <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currParen.decision}</div>
        <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currParen.reason}</div>
      </div>

      {/* Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setParenPlaying(false); setParenIndex(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setParenPlaying(false); setParenIndex((prev) => Math.max(0, prev - 1)); }}
            disabled={parenIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={parenPlaying ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setParenPlaying(!parenPlaying)}
            leftIcon={parenPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {parenPlaying ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setParenPlaying(false); setParenIndex((prev) => Math.min(parenSteps.length - 1, prev + 1)); }}
            disabled={parenIndex === parenSteps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
