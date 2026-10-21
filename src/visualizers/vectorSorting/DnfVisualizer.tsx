import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface DNFStep {
  arr: number[];
  low: number;
  mid: number;
  high: number;
  action: 'INIT' | 'SWAP_0' | 'KEEP_1' | 'SWAP_2' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

const dnfDatasets = [
  { label: 'Bộ mẫu chuẩn (xáo trộn)', arr: [2, 0, 2, 1, 1, 0, 2, 1] },
  { label: 'Đã sắp xếp sẵn', arr: [0, 0, 1, 1, 2, 2] },
  { label: 'Sắp xếp ngược', arr: [2, 2, 1, 1, 0, 0] },
];

export const DnfVisualizer: React.FC = () => {
  const [selectedDnfDataIndex, setSelectedDnfDataIndex] = useState<number>(0);
  const [dnfIndex, setDnfIndex] = useState<number>(0);
  const [dnfPlaying, setDnfPlaying] = useState<boolean>(false);
  const [dnfSpeed, setDnfSpeed] = useState<number>(650);
  const dnfTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectDnfDataset = (idx: number) => {
    setSelectedDnfDataIndex(idx);
    setDnfIndex(0);
    setDnfPlaying(false);
  };

  const dnfSteps = useMemo<DNFStep[]>(() => {
    const raw = [...dnfDatasets[selectedDnfDataIndex].arr];
    const steps: DNFStep[] = [];
    const a = [...raw];
    let low = 0;
    let mid = 0;
    let high = a.length - 1;

    steps.push({
      arr: [...a],
      low,
      mid,
      high,
      action: 'INIT',
      observation: `Khởi tạo: low = 0, mid = 0, high = ${high}. Mảng chưa xét [mid...high].`,
      decision: `Bắt đầu xét phần tử tại vị trí mid = 0.`,
      reason: `Vùng [0...low-1] chứa 0, [low...mid-1] chứa 1, [high+1...N-1] chứa 2.`,
    });

    while (mid <= high) {
      const val = a[mid];
      if (val === 0) {
        const temp = a[low];
        a[low] = a[mid];
        a[mid] = temp;
        steps.push({
          arr: [...a],
          low: low + 1,
          mid: mid + 1,
          high,
          action: 'SWAP_0',
          observation: `A[mid] == 0. Đổi chỗ A[low] (${temp}) và A[mid] (${val}).`,
          decision: `Đưa 0 về phân vùng đầu: Tăng low -> ${low + 1}, tăng mid -> ${mid + 1}.`,
          reason: `Phần tử vừa hoán vị sang mid chắc chắn là 1 (vì mid >= low), không cần xét lại.`,
        });
        low++;
        mid++;
      } else if (val === 1) {
        steps.push({
          arr: [...a],
          low,
          mid: mid + 1,
          high,
          action: 'KEEP_1',
          observation: `A[mid] == 1. Đã nằm đúng phân vùng số 1.`,
          decision: `Giữ nguyên và mở rộng biên: mid++ -> ${mid + 1}.`,
          reason: `Số 1 thuộc phân vùng [low...mid-1], chỉ cần dịch mid sang phải.`,
        });
        mid++;
      } else {
        const temp = a[high];
        a[high] = a[mid];
        a[mid] = temp;
        steps.push({
          arr: [...a],
          low,
          mid,
          high: high - 1,
          action: 'SWAP_2',
          observation: `A[mid] == 2. Đổi chỗ A[mid] (${val}) với A[high] (${temp}).`,
          decision: `Đưa 2 về cuối mảng: high-- -> ${high - 1}. Giữ nguyên mid!`,
          reason: `Phần tử vừa hoán vị từ high về mid chưa được kiểm tra, bước tiếp theo phải xét lại tại mid.`,
        });
        high--;
      }
    }

    steps.push({
      arr: [...a],
      low,
      mid,
      high,
      action: 'DONE',
      observation: `mid (${mid}) > high (${high}): Khoảng chưa xét rỗng.`,
      decision: `Hoàn tất thuật toán lá cờ Hà Lan trong đúng 1 lượt duyệt O(N).`,
      reason: `Toàn bộ mảng đã được phân vùng hoàn hảo: 0 ở đầu, 1 ở giữa, 2 ở cuối.`,
    });

    return steps;
  }, [selectedDnfDataIndex]);

  useEffect(() => {
    if (dnfPlaying) {
      dnfTimerRef.current = setInterval(() => {
        setDnfIndex((prev) => {
          if (prev < dnfSteps.length - 1) return prev + 1;
          setDnfPlaying(false);
          return prev;
        });
      }, dnfSpeed);
    } else if (dnfTimerRef.current) {
      clearInterval(dnfTimerRef.current);
    }
    return () => {
      if (dnfTimerRef.current) clearInterval(dnfTimerRef.current);
    };
  }, [dnfPlaying, dnfSpeed, dnfSteps.length]);

  const currStep2 = dnfSteps[dnfIndex] || dnfSteps[0] || {
    arr: [],
    low: 0,
    mid: 0,
    high: 0,
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };

  return (
    <Card className="border-emerald-200 dark:border-emerald-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Bộ dữ liệu:</span>
          <select
            value={selectedDnfDataIndex}
            onChange={(e) => handleSelectDnfDataset(Number(e.target.value))}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {dnfDatasets.map((d, idx) => (
              <option key={idx} value={idx}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
          <button onClick={() => setDnfSpeed(1100)} className={`px-2 py-0.5 rounded ${dnfSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>0.5x</button>
          <button onClick={() => setDnfSpeed(650)} className={`px-2 py-0.5 rounded ${dnfSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setDnfSpeed(350)} className={`px-2 py-0.5 rounded ${dnfSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>2x</button>
        </div>
      </div>

      {/* DNF Visualizer */}
      <div className="py-6 flex flex-col items-center">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto p-2 max-w-full">
          {currStep2.arr.map((val, idx) => {
            const isLow = idx === currStep2.low;
            const isMid = idx === currStep2.mid;
            const isHigh = idx === currStep2.high;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointers Label */}
                <div className="h-6 flex items-center justify-center text-[11px] font-mono font-extrabold">
                  {isLow && <span className="text-emerald-600 dark:text-emerald-400 mr-0.5">L</span>}
                  {isMid && <span className="text-amber-600 dark:text-amber-400 mr-0.5">M</span>}
                  {isHigh && <span className="text-indigo-600 dark:text-indigo-400">H</span>}
                </div>

                {/* Cell */}
                <div
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-extrabold text-base sm:text-lg transition-all duration-150 ${
                    val === 0
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-700 dark:text-rose-300'
                      : val === 1
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-300'
                      : 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 text-sky-700 dark:text-sky-300'
                  }`}
                >
                  {val}
                </div>

                <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold">0 (Đỏ)</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">1 (Trắng)</span>
          <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-semibold">2 (Xanh)</span>
        </div>
      </div>

      {/* 3 dòng chuẩn */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
        <div><strong className="text-emerald-600 dark:text-emerald-400">Quan sát:</strong> {currStep2.observation}</div>
        <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currStep2.decision}</div>
        <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currStep2.reason}</div>
      </div>

      {/* Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setDnfPlaying(false); setDnfIndex(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setDnfPlaying(false); setDnfIndex((prev) => Math.max(0, prev - 1)); }}
            disabled={dnfIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={dnfPlaying ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setDnfPlaying(!dnfPlaying)}
            leftIcon={dnfPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {dnfPlaying ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setDnfPlaying(false); setDnfIndex((prev) => Math.min(dnfSteps.length - 1, prev + 1)); }}
            disabled={dnfIndex === dnfSteps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
