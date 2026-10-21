import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface MonotonicStep {
  currentIndex: number;
  stackSnapshot: number[]; // indices
  resultSnapshot: number[];
  action: 'INIT' | 'POP' | 'PUSH' | 'DONE';
  poppedIndex?: number;
  observation: string;
  decision: string;
  reason: string;
}

const monoDatasets = [
  { label: 'Nhiệt độ mẫu: [73, 74, 75, 71, 69, 72, 76, 73]', arr: [73, 74, 75, 71, 69, 72, 76, 73] },
  { label: 'Giảm dần: [90, 80, 70, 60]', arr: [90, 80, 70, 60] },
  { label: 'Tăng dần: [60, 70, 80, 90]', arr: [60, 70, 80, 90] },
];

export const MonotonicStackVisualizer: React.FC = () => {
  const [selectedMonoDataIndex, setSelectedMonoDataIndex] = useState<number>(0);
  const [monoIndex, setMonoIndex] = useState<number>(0);
  const [monoPlaying, setMonoPlaying] = useState<boolean>(false);
  const [monoSpeed, setMonoSpeed] = useState<number>(650);
  const monoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectMonoDataset = (idx: number) => {
    setSelectedMonoDataIndex(idx);
    setMonoIndex(0);
    setMonoPlaying(false);
  };

  const monoSteps = useMemo<MonotonicStep[]>(() => {
    const rawTemps = [...monoDatasets[selectedMonoDataIndex].arr];
    const steps: MonotonicStep[] = [];
    const n = rawTemps.length;
    const ans = new Array(n).fill(0);
    const st: number[] = []; // lưu indices

    steps.push({
      currentIndex: -1,
      stackSnapshot: [],
      resultSnapshot: [...ans],
      action: 'INIT',
      observation: `Khởi tạo: Mảng ${n} ngày. Mảng kết quả khởi tạo toàn 0.`,
      decision: `Bắt đầu duyệt từ ngày 0 với Monotonic Stack giảm dần.`,
      reason: `Stack lưu các chỉ số ngày mà nhiệt độ đang giảm dần chờ ngày ấm hơn.`,
    });

    for (let i = 0; i < n; i++) {
      const curTemp = rawTemps[i];

      while (st.length > 0 && curTemp > rawTemps[st[st.length - 1]]) {
        const prevIdx = st.pop()!;
        ans[prevIdx] = i - prevIdx;
        steps.push({
          currentIndex: i,
          stackSnapshot: [...st],
          resultSnapshot: [...ans],
          action: 'POP',
          poppedIndex: prevIdx,
          observation: `Ngày ${i} (${curTemp}°C) > Ngày đỉnh Stack ${prevIdx} (${rawTemps[prevIdx]}°C).`,
          decision: `Ghi nhận kết quả: ans[${prevIdx}] = ${i} - ${prevIdx} = ${i - prevIdx} ngày. Pop ngày ${prevIdx} ra.`,
          reason: `Ngày ${i} chính là ngày ấm hơn đầu tiên của ngày ${prevIdx}.`,
        });
      }

      st.push(i);
      steps.push({
        currentIndex: i,
        stackSnapshot: [...st],
        resultSnapshot: [...ans],
        action: 'PUSH',
        observation: `Ngày ${i} (${curTemp}°C) <= đỉnh Stack (hoặc Stack rỗng).`,
        decision: `Push chỉ số ${i} vào đỉnh Stack.`,
        reason: `Duy trì tính chất đơn điệu giảm dần của Stack.`,
      });
    }

    steps.push({
      currentIndex: n,
      stackSnapshot: [...st],
      resultSnapshot: [...ans],
      action: 'DONE',
      observation: `Duyệt hết mảng. Các ngày còn lại trong Stack giữ nguyên ans = 0 (không có ngày ấm hơn).`,
      decision: `Hoàn tất thuật toán Daily Temperatures trong thời gian O(N).`,
      reason: `Mỗi chỉ số được push đúng 1 lần và pop tối đa 1 lần.`,
    });

    return steps;
  }, [selectedMonoDataIndex]);

  useEffect(() => {
    if (monoPlaying) {
      monoTimerRef.current = setInterval(() => {
        setMonoIndex((prev) => {
          if (prev < monoSteps.length - 1) return prev + 1;
          setMonoPlaying(false);
          return prev;
        });
      }, monoSpeed);
    } else if (monoTimerRef.current) {
      clearInterval(monoTimerRef.current);
    }
    return () => {
      if (monoTimerRef.current) clearInterval(monoTimerRef.current);
    };
  }, [monoPlaying, monoSpeed, monoSteps.length]);

  const currMono = monoSteps[monoIndex] || monoSteps[0] || {
    currentIndex: -1,
    stackSnapshot: [],
    resultSnapshot: [],
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };

  return (
    <Card className="border-indigo-200 dark:border-indigo-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Bộ test:</span>
          <select
            value={selectedMonoDataIndex}
            onChange={(e) => handleSelectMonoDataset(Number(e.target.value))}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {monoDatasets.map((d, idx) => (
              <option key={idx} value={idx}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
          <button onClick={() => setMonoSpeed(1100)} className={`px-2 py-0.5 rounded ${monoSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600' : 'text-slate-500'}`}>0.5x</button>
          <button onClick={() => setMonoSpeed(650)} className={`px-2 py-0.5 rounded ${monoSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setMonoSpeed(350)} className={`px-2 py-0.5 rounded ${monoSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600' : 'text-slate-500'}`}>2x</button>
        </div>
      </div>

      {/* Mono Visualizer */}
      <div className="py-6 flex flex-col items-center">
        {/* Nhiệt độ */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full mb-4">
          {monoDatasets[selectedMonoDataIndex].arr.map((val, idx) => {
            const isCurrent = idx === currMono.currentIndex;
            const inStack = currMono.stackSnapshot.includes(idx);
            const isPopped = idx === currMono.poppedIndex;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${
                    isCurrent
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-200 scale-105 shadow-md'
                      : isPopped
                      ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200'
                      : inStack
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{val}°</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">i={idx}</span>
              </div>
            );
          })}
        </div>

        {/* Mảng kết quả answer */}
        <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono mb-2">
          <span className="text-slate-500 font-bold block mb-1">Mảng kết quả Answer [số ngày chờ]:</span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {currMono.resultSnapshot.map((res, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[2.5rem]">
                <span className={`px-2 py-0.5 rounded font-bold ${res > 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {res}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 dòng chuẩn */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
        <div><strong className="text-indigo-600 dark:text-indigo-400">Quan sát:</strong> {currMono.observation}</div>
        <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currMono.decision}</div>
        <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currMono.reason}</div>
      </div>

      {/* Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setMonoPlaying(false); setMonoIndex(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setMonoPlaying(false); setMonoIndex((prev) => Math.max(0, prev - 1)); }}
            disabled={monoIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={monoPlaying ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setMonoPlaying(!monoPlaying)}
            leftIcon={monoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {monoPlaying ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setMonoPlaying(false); setMonoIndex((prev) => Math.min(monoSteps.length - 1, prev + 1)); }}
            disabled={monoIndex === monoSteps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
