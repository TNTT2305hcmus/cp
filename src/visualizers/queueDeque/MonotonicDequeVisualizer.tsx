import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface MonotonicDequeStep {
  currentIndex: number;
  windowRange: [number, number];
  dequeIndices: number[]; // indices in deque
  maxResults: number[];
  action: 'INIT' | 'POP_FRONT' | 'POP_BACK' | 'PUSH' | 'RECORD_MAX' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export const MonotonicDequeVisualizer: React.FC = () => {
  const monoDatasets = [
    { label: 'Mảng mẫu K=3: [1, 3, -1, -3, 5, 3, 6, 7]', arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
    { label: 'Giảm dần K=3: [9, 7, 5, 3, 1]', arr: [9, 7, 5, 3, 1], k: 3 },
    { label: 'Tăng dần K=3: [1, 3, 5, 7, 9]', arr: [1, 3, 5, 7, 9], k: 3 },
  ];
  const [selectedMonoDataIndex, setSelectedMonoDataIndex] = useState<number>(0);
  const [monoIndex, setMonoIndex] = useState<number>(0);
  const [monoPlaying, setMonoPlaying] = useState<boolean>(false);
  const [monoSpeed, setMonoSpeed] = useState<number>(650);
  const monoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const monoSteps = useMemo<MonotonicDequeStep[]>(() => {
    const rawData = monoDatasets[selectedMonoDataIndex];
    const a = rawData.arr;
    const k = rawData.k;
    const n = a.length;
    const steps: MonotonicDequeStep[] = [];
    const dq: number[] = []; // lưu indices
    const res: number[] = [];

    steps.push({
      currentIndex: -1,
      windowRange: [0, 0],
      dequeIndices: [],
      maxResults: [],
      action: 'INIT',
      observation: `Khởi tạo: Mảng ${n} phần tử, Cửa sổ trượt kích thước K = ${k}. Deque rỗng.`,
      decision: `Bắt đầu duyệt từ chỉ số 0.`,
      reason: `Monotonic Deque lưu chỉ số có giá trị giảm dần. Giá trị ở đầu front luôn là Max của cửa sổ.`,
    });

    for (let i = 0; i < n; i++) {
      // 1. Loại bỏ phần tử trượt ra khỏi cửa sổ
      if (dq.length > 0 && dq[0] <= i - k) {
        const outIdx = dq.shift()!;
        steps.push({
          currentIndex: i,
          windowRange: [Math.max(0, i - k + 1), i],
          dequeIndices: [...dq],
          maxResults: [...res],
          action: 'POP_FRONT',
          observation: `Phần tử tại index ${outIdx} (giá trị ${a[outIdx]}) nằm ngoài cửa sổ [${i - k + 1}...${i}].`,
          decision: `Pop phần tử ở đầu Deque (pop_front).`,
          reason: `Phần tử này đã hết hạn trượt ra khỏi cửa sổ, không được giữ lại.`,
        });
      }

      // 2. Loại bỏ các phần tử ở đuôi nhỏ hơn hoặc bằng a[i]
      while (dq.length > 0 && a[dq[dq.length - 1]] <= a[i]) {
        const backIdx = dq.pop()!;
        steps.push({
          currentIndex: i,
          windowRange: [Math.max(0, i - k + 1), i],
          dequeIndices: [...dq],
          maxResults: [...res],
          action: 'POP_BACK',
          observation: `Phần tử đuôi A[${backIdx}] = ${a[backIdx]} <= phần tử mới A[${i}] = ${a[i]}.`,
          decision: `Pop phần tử ở đuôi Deque (pop_back).`,
          reason: `Phần tử ${a[backIdx]} vào trước mà lại nhỏ hơn ${a[i]}, sẽ không bao giờ có cơ hội trở thành Max nữa!`,
        });
      }

      // 3. Đưa i vào đuôi
      dq.push(i);
      steps.push({
        currentIndex: i,
        windowRange: [Math.max(0, i - k + 1), i],
        dequeIndices: [...dq],
        maxResults: [...res],
        action: 'PUSH',
        observation: `Thêm index ${i} (giá trị ${a[i]}) vào đuôi Deque.`,
        decision: `Duy trì Deque giảm dần từ front đến back.`,
        reason: `Mọi phần tử trước nó trong Deque đều lớn hơn nó.`,
      });

      // 4. Ghi nhận max khi cửa sổ đạt độ dài K
      if (i >= k - 1) {
        const currentMax = a[dq[0]];
        res.push(currentMax);
        steps.push({
          currentIndex: i,
          windowRange: [i - k + 1, i],
          dequeIndices: [...dq],
          maxResults: [...res],
          action: 'RECORD_MAX',
          observation: `Cửa sổ [${i - k + 1}...${i}] hoàn chỉnh. Đỉnh front của Deque là index ${dq[0]} (giá trị ${currentMax}).`,
          decision: `Ghi nhận Max của cửa sổ: ${currentMax}.`,
          reason: `Theo tính chất đơn điệu, phần tử đầu Deque luôn là giá trị lớn nhất trong cửa sổ.`,
        });
      }
    }

    steps.push({
      currentIndex: n,
      windowRange: [n - k, n - 1],
      dequeIndices: [...dq],
      maxResults: [...res],
      action: 'DONE',
      observation: `Hoàn tất duyệt qua toàn bộ ${n} phần tử.`,
      decision: `Mảng kết quả Max: [${res.join(', ')}].`,
      reason: `Mỗi phần tử được thêm và xóa khỏi Deque tối đa 1 lần, tổng thời gian chạy O(N).`,
    });

    return steps;
  }, [selectedMonoDataIndex]);

  useEffect(() => {
    setMonoIndex(0);
    setMonoPlaying(false);
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
    windowRange: [0, 0],
    dequeIndices: [],
    maxResults: [],
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
            onChange={(e) => setSelectedMonoDataIndex(Number(e.target.value))}
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
        {/* Mảng ban đầu và khung cửa sổ */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full mb-4">
          {monoDatasets[selectedMonoDataIndex].arr.map((val, idx) => {
            const inWindow = idx >= currMono.windowRange[0] && idx <= currMono.windowRange[1];
            const inDeque = currMono.dequeIndices.includes(idx);
            const isFront = currMono.dequeIndices[0] === idx;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${
                    isFront
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-200 scale-105 shadow-md'
                      : inDeque
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                      : inWindow
                      ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{val}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">i={idx}</span>
              </div>
            );
          })}
        </div>

        {/* Khối Deque ngang */}
        <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              Trạng thái Monotonic Deque [Front → Back]:
            </span>
            <span className="text-slate-400 text-[11px]">Đầu Front luôn là Max</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {currMono.dequeIndices.length === 0 ? (
              <span className="text-slate-400">Deque rỗng</span>
            ) : (
              currMono.dequeIndices.map((dIdx, pos) => (
                <span
                  key={dIdx}
                  className={`px-2.5 py-1 rounded font-bold border ${
                    pos === 0
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-400'
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border-indigo-300'
                  }`}
                >
                  idx={dIdx} (val={monoDatasets[selectedMonoDataIndex].arr[dIdx]}) {pos === 0 && '★ FRONT MAX'}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Mảng kết quả Result */}
        <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="text-teal-600 dark:text-teal-400 font-bold block mb-1">Mảng kết quả Maximums:</span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {currMono.maxResults.length === 0 ? (
              <span className="text-slate-400">Đang lấp đầy cửa sổ đầu tiên...</span>
            ) : (
              currMono.maxResults.map((resVal, rIdx) => (
                <span key={rIdx} className="px-2.5 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {resVal}
                </span>
              ))
            )}
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
