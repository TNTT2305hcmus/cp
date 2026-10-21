import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface Model2Step {
  slow: number;
  fast: number;
  currentArray: number[];
  observation: string;
  decision: string;
  reason: string;
  action: 'init' | 'match' | 'diff' | 'done';
}

export const FastSlowPointersVisualizer: React.FC = () => {
  const model2Datasets = [
    { label: 'Có trùng: [1, 1, 2, 2, 3, 4, 4, 5]', arr: [1, 1, 2, 2, 3, 4, 4, 5] },
    { label: 'Không trùng: [1, 2, 3, 4, 5]', arr: [1, 2, 3, 4, 5] },
    { label: 'Toàn bộ trùng: [2, 2, 2, 2]', arr: [2, 2, 2, 2] },
  ];
  const [selectedM2DataIndex, setSelectedM2DataIndex] = useState<number>(0);
  const [model2Index, setModel2Index] = useState<number>(0);
  const [model2Playing, setModel2Playing] = useState<boolean>(false);
  const [model2Speed, setModel2Speed] = useState<number>(650);
  const model2TimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const model2Steps = useMemo<Model2Step[]>(() => {
    const raw = [...model2Datasets[selectedM2DataIndex].arr];
    const steps: Model2Step[] = [];
    const arr = [...raw];
    let slow = 0;

    steps.push({
      slow: 0,
      fast: 1,
      currentArray: [...arr],
      action: 'init',
      observation: `Khởi tạo: arr[0] = ${arr[0]} luôn là phần tử duy nhất đầu tiên.`,
      decision: `Con trỏ SLOW = 0 (vị trí ghi nhận), con trỏ FAST = 1 (thám thính).`,
      reason: `Mảng đã sắp xếp: Các phần tử trùng lặp luôn đứng liền kề nhau.`,
    });

    for (let fast = 1; fast < arr.length; fast++) {
      if (arr[fast] === arr[slow]) {
        steps.push({
          slow,
          fast,
          currentArray: [...arr],
          action: 'match',
          observation: `arr[FAST=${fast}] (${arr[fast]}) trùng với arr[SLOW=${slow}] (${arr[slow]}).`,
          decision: `Bỏ qua! FAST tiếp tục tiến lên tìm giá trị mới (fast++ -> ${fast + 1}).`,
          reason: `Phần tử trùng lặp không được ghi nhận vào vùng duy nhất.`,
        });
      } else {
        slow++;
        arr[slow] = arr[fast];
        steps.push({
          slow,
          fast,
          currentArray: [...arr],
          action: 'diff',
          observation: `arr[FAST=${fast}] (${arr[fast]}) là giá trị MỚI chưa từng có!`,
          decision: `Tăng SLOW -> ${slow}, ghi đè arr[SLOW] = ${arr[fast]}.`,
          reason: `Mở rộng vùng các phần tử duy nhất [0...SLOW].`,
        });
      }
    }

    steps.push({
      slow,
      fast: arr.length,
      currentArray: [...arr],
      action: 'done',
      observation: `FAST đã duyệt hết toàn bộ mảng.`,
      decision: `Hoàn tất! Mảng có ${slow + 1} phần tử duy nhất ở tiền tố [0...${slow}].`,
      reason: `Thuật toán chạy trong 1 lượt duyệt duy nhất O(N) và O(1) in-place.`,
    });

    return steps;
  }, [selectedM2DataIndex]);

  useEffect(() => {
    setModel2Index(0);
    setModel2Playing(false);
  }, [selectedM2DataIndex]);

  useEffect(() => {
    if (model2Playing) {
      model2TimerRef.current = setInterval(() => {
        setModel2Index((prev) => {
          if (prev < model2Steps.length - 1) return prev + 1;
          setModel2Playing(false);
          return prev;
        });
      }, model2Speed);
    } else if (model2TimerRef.current) {
      clearInterval(model2TimerRef.current);
    }
    return () => {
      if (model2TimerRef.current) clearInterval(model2TimerRef.current);
    };
  }, [model2Playing, model2Speed, model2Steps.length]);

  const currStep2 = model2Steps[model2Index] || model2Steps[0] || {
    slow: 0,
    fast: 1,
    currentArray: [],
    action: 'init',
    observation: '',
    decision: '',
    reason: '',
  };

  return (
    <Card className="border-emerald-200 dark:border-emerald-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Bộ test:</span>
          <select
            value={selectedM2DataIndex}
            onChange={(e) => setSelectedM2DataIndex(Number(e.target.value))}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {model2Datasets.map((d, idx) => (
              <option key={idx} value={idx}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
          <button onClick={() => setModel2Speed(1100)} className={`px-2 py-0.5 rounded ${model2Speed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>0.5x</button>
          <button onClick={() => setModel2Speed(650)} className={`px-2 py-0.5 rounded ${model2Speed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setModel2Speed(350)} className={`px-2 py-0.5 rounded ${model2Speed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>2x</button>
        </div>
      </div>

      {/* M2 Visualizer */}
      <div className="py-6 flex flex-col items-center">
        <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full">
          {currStep2.currentArray.map((val, idx) => {
            const isSlow = idx === currStep2.slow;
            const isFast = idx === currStep2.fast;
            const isUniqueZone = idx <= currStep2.slow;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="h-6 flex items-center justify-center text-xs font-mono font-bold">
                  {isSlow && !isFast && <span className="text-emerald-600 dark:text-emerald-400">SLOW</span>}
                  {isFast && !isSlow && <span className="text-amber-600 dark:text-amber-400">FAST</span>}
                  {isSlow && isFast && <span className="text-purple-600 dark:text-purple-400">S,F</span>}
                </div>

                <div
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-150 ${
                    isSlow
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-100 scale-105 shadow-md'
                      : isFast
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-100 scale-105 shadow-md'
                      : isUniqueZone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {val}
                </div>

                <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>

        {/* Status info */}
        <div className="mt-4 flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-500">Độ dài mảng duy nhất [0...SLOW]:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            {currStep2.slow + 1} phần tử
          </span>
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
          onClick={() => { setModel2Playing(false); setModel2Index(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setModel2Playing(false); setModel2Index((prev) => Math.max(0, prev - 1)); }}
            disabled={model2Index === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={model2Playing ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setModel2Playing(!model2Playing)}
            leftIcon={model2Playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {model2Playing ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setModel2Playing(false); setModel2Index((prev) => Math.min(model2Steps.length - 1, prev + 1)); }}
            disabled={model2Index === model2Steps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
