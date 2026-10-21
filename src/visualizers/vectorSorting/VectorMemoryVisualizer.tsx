import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface VectorStep {
  size: number;
  capacity: number;
  elements: number[];
  reallocated: boolean;
  observation: string;
  decision: string;
  reason: string;
}

export const VectorMemoryVisualizer: React.FC = () => {
  const [useReserve, setUseReserve] = useState<boolean>(false);
  const [vectorIndex, setVectorIndex] = useState<number>(0);
  const [vectorPlaying, setVectorPlaying] = useState<boolean>(false);
  const [vectorSpeed, setVectorSpeed] = useState<number>(650);
  const vectorTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const vectorSteps = useMemo<VectorStep[]>(() => {
    const rawValues = [12, 45, 78, 23, 56, 89, 34, 67];
    const steps: VectorStep[] = [];
    const initCap = useReserve ? 8 : 0;

    steps.push({
      size: 0,
      capacity: initCap,
      elements: [],
      reallocated: false,
      observation: useReserve ? 'Đã gọi v.reserve(8): Dung lượng Capacity = 8, Size = 0.' : 'Vector rỗng: Size = 0, Capacity = 0.',
      decision: useReserve ? 'Sẵn sàng nhận 8 phần tử liên tiếp.' : 'Chờ phần tử đầu tiên để cấp phát bộ nhớ ban đầu.',
      reason: useReserve ? 'Cấp phát trước một vùng 8 ô giúp loại bỏ mọi Reallocation.' : 'Chưa có dữ liệu nên vector chưa xin cấp phát RAM.',
    });

    let currentCap = initCap;
    const curElements: number[] = [];

    for (let i = 0; i < rawValues.length; i++) {
      const val = rawValues[i];
      const nextSize = i + 1;
      let didRealloc = false;

      if (useReserve) {
        if (nextSize > currentCap) {
          currentCap = currentCap * 2;
          didRealloc = true;
        }
      } else {
        if (nextSize > currentCap) {
          currentCap = currentCap === 0 ? 1 : currentCap * 2;
          didRealloc = true;
        }
      }

      curElements.push(val);

      steps.push({
        size: nextSize,
        capacity: currentCap,
        elements: [...curElements],
        reallocated: didRealloc,
        observation: `Thêm phần tử ${val} vào cuối. Size tăng lên ${nextSize}/${currentCap}.`,
        decision: didRealloc
          ? `CẤP PHÁT LẠI (Reallocation)! Nhân đôi Capacity từ ${Math.floor(currentCap / 2)} -> ${currentCap}.`
          : `Ghi thẳng giá trị ${val} vào ô nhớ tiếp theo trong vùng đệm hiện tại.`,
        reason: didRealloc
          ? `Size (${nextSize}) vượt quá dung lượng cũ. Phải cấp phát vùng nhớ mới và copy ${nextSize - 1} phần tử cũ sang, tốn O(N).`
          : `Capacity còn chỗ trống (${currentCap - nextSize} ô), thao tác O(1) tức thì.`,
      });
    }

    return steps;
  }, [useReserve]);

  useEffect(() => {
    setVectorIndex(0);
    setVectorPlaying(false);
  }, [useReserve]);

  useEffect(() => {
    if (vectorPlaying) {
      vectorTimerRef.current = setInterval(() => {
        setVectorIndex((prev) => {
          if (prev < vectorSteps.length - 1) return prev + 1;
          setVectorPlaying(false);
          return prev;
        });
      }, vectorSpeed);
    } else if (vectorTimerRef.current) {
      clearInterval(vectorTimerRef.current);
    }
    return () => {
      if (vectorTimerRef.current) clearInterval(vectorTimerRef.current);
    };
  }, [vectorPlaying, vectorSpeed, vectorSteps.length]);

  const currStep1 = vectorSteps[vectorIndex] || vectorSteps[0] || {
    size: 0,
    capacity: 0,
    elements: [],
    reallocated: false,
    observation: '',
    decision: '',
    reason: '',
  };

  return (
    <Card className="border-teal-200 dark:border-teal-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Theo dõi mảng động liên tục trên RAM
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Chuỗi 8 phần tử: [12, 45, 78, 23, 56, 89, 34, 67]
          </span>
        </div>

        {/* Toggle reserve vs speed */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setUseReserve(!useReserve)}
            className={`text-xs px-2.5 py-1 rounded-md font-mono font-semibold transition cursor-pointer border ${
              useReserve
                ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border-teal-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}
          >
            {useReserve ? '✓ Có reserve(8)' : '✕ Không reserve'}
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
            <button onClick={() => setVectorSpeed(1100)} className={`px-2 py-0.5 rounded ${vectorSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>0.5x</button>
            <button onClick={() => setVectorSpeed(650)} className={`px-2 py-0.5 rounded ${vectorSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>1x</button>
            <button onClick={() => setVectorSpeed(350)} className={`px-2 py-0.5 rounded ${vectorSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>2x</button>
          </div>
        </div>
      </div>

      {/* Visualizer 1 */}
      <div className="py-6 flex flex-col items-center">
        {/* Stat badges */}
        <div className="flex items-center gap-6 mb-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Size:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
              {currStep1.size}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Capacity:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              {currStep1.capacity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Trạng thái:</span>
            <span className={`font-semibold px-2 py-0.5 rounded text-xs ${currStep1.reallocated ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'}`}>
              {currStep1.reallocated ? '⚡ REALLOCATION' : 'OK (O(1))'}
            </span>
          </div>
        </div>

        {/* Memory slots */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full">
          {Array.from({ length: Math.max(currStep1.capacity, 1) }).map((_, idx) => {
            const hasElement = idx < currStep1.elements.length;
            const val = hasElement ? currStep1.elements[idx] : null;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-150 ${
                    hasElement
                      ? currStep1.reallocated
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-200'
                        : 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-800 dark:text-teal-200'
                      : 'bg-slate-100/60 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {val !== null ? val : '∅'}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 dòng chuẩn: Quan sát -> Quyết định -> Lý do */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
        <div><strong className="text-teal-600 dark:text-teal-400">Quan sát:</strong> {currStep1.observation}</div>
        <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currStep1.decision}</div>
        <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currStep1.reason}</div>
      </div>

      {/* Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setVectorPlaying(false); setVectorIndex(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setVectorPlaying(false); setVectorIndex((prev) => Math.max(0, prev - 1)); }}
            disabled={vectorIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={vectorPlaying ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setVectorPlaying(!vectorPlaying)}
            leftIcon={vectorPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {vectorPlaying ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setVectorPlaying(false); setVectorIndex((prev) => Math.min(vectorSteps.length - 1, prev + 1)); }}
            disabled={vectorIndex === vectorSteps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
