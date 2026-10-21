import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface Model1Step {
  left: number;
  right: number;
  currentSum: number;
  observation: string;
  decision: string;
  reason: string;
  isFound: boolean;
  highlightedIndices: number[];
}

export const OppositePointersVisualizer: React.FC = () => {
  const model1Datasets = [
    { label: 'Có đáp án (Target = 19)', arr: [2, 3, 5, 8, 11, 15, 18, 22], target: 19 },
    { label: 'Không có đáp án (Target = 24)', arr: [2, 3, 5, 8, 11, 15, 18, 22], target: 24 },
    { label: 'Mảng có số âm (Target = 0)', arr: [-8, -3, -1, 0, 1, 4, 8, 12], target: 0 },
  ];
  const [selectedM1DataIndex, setSelectedM1DataIndex] = useState<number>(0);
  const [model1Index, setModel1Index] = useState<number>(0);
  const [model1Playing, setModel1Playing] = useState<boolean>(false);
  const [model1Speed, setModel1Speed] = useState<number>(650);
  const model1TimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const model1Steps = useMemo<Model1Step[]>(() => {
    const data = model1Datasets[selectedM1DataIndex];
    const arr = data.arr;
    const target = data.target;
    const steps: Model1Step[] = [];
    let l = 0;
    let r = arr.length - 1;

    steps.push({
      left: l,
      right: r,
      currentSum: arr[l] + arr[r],
      observation: `Khởi tạo: Con trỏ L = 0 (A[L]=${arr[l]}), con trỏ R = ${r} (A[R]=${arr[r]}). Tổng = ${arr[l] + arr[r]}.`,
      decision: `So sánh Tổng hiện tại với Target = ${target}.`,
      reason: `Mảng đã sắp xếp: A[0] nhỏ nhất, A[${r}] lớn nhất.`,
      isFound: false,
      highlightedIndices: [l, r],
    });

    while (l < r) {
      const sum = arr[l] + arr[r];
      if (sum === target) {
        steps.push({
          left: l,
          right: r,
          currentSum: sum,
          observation: `Tổng A[${l}] (${arr[l]}) + A[${r}] (${arr[r]}) == Target (${target}).`,
          decision: `TÌM THẤY ĐÁP ÁN! Chỉ số 1-indexed: [${l + 1}, ${r + 1}].`,
          reason: `Tổng hai phần tử khớp chính xác với yêu cầu đề bài.`,
          isFound: true,
          highlightedIndices: [l, r],
        });
        break;
      } else if (sum < target) {
        steps.push({
          left: l,
          right: r,
          currentSum: sum,
          observation: `Tổng (${sum}) < Target (${target}): Tổng đang nhỏ hơn mục tiêu.`,
          decision: `Dịch con trỏ trái sang phải: L++ -> ${l + 1}.`,
          reason: `Vì mảng tăng dần, ghép A[${l}] với bất kỳ số nào trước R cũng đều nhỏ hơn ${sum}. Do đó loại hẳn A[${l}].`,
          isFound: false,
          highlightedIndices: [l, r],
        });
        l++;
      } else {
        steps.push({
          left: l,
          right: r,
          currentSum: sum,
          observation: `Tổng (${sum}) > Target (${target}): Tổng đang lớn hơn mục tiêu.`,
          decision: `Dịch con trỏ phải sang trái: R-- -> ${r - 1}.`,
          reason: `Ghép A[${r}] với bất kỳ số nào sau L cũng đều lớn hơn ${sum}. Do đó loại hẳn A[${r}].`,
          isFound: false,
          highlightedIndices: [l, r],
        });
        r--;
      }
    }

    if (steps.length > 0 && !steps[steps.length - 1].isFound) {
      steps.push({
        left: l,
        right: r,
        currentSum: 0,
        observation: `Hai con trỏ đã gặp nhau (L >= R) mà không có cặp nào bằng ${target}.`,
        decision: `Kết luận: Mảng không tồn tại cặp số thỏa mãn.`,
        reason: `Toàn bộ không gian tìm kiếm N*(N-1)/2 đã được triệt tiêu an toàn.`,
        isFound: false,
        highlightedIndices: [],
      });
    }

    return steps;
  }, [selectedM1DataIndex]);

  useEffect(() => {
    setModel1Index(0);
    setModel1Playing(false);
  }, [selectedM1DataIndex]);

  useEffect(() => {
    if (model1Playing) {
      model1TimerRef.current = setInterval(() => {
        setModel1Index((prev) => {
          if (prev < model1Steps.length - 1) return prev + 1;
          setModel1Playing(false);
          return prev;
        });
      }, model1Speed);
    } else if (model1TimerRef.current) {
      clearInterval(model1TimerRef.current);
    }
    return () => {
      if (model1TimerRef.current) clearInterval(model1TimerRef.current);
    };
  }, [model1Playing, model1Speed, model1Steps.length]);

  const currStep1 = model1Steps[model1Index] || model1Steps[0] || {
    left: 0,
    right: 0,
    currentSum: 0,
    observation: '',
    decision: '',
    reason: '',
    isFound: false,
    highlightedIndices: [],
  };

  return (
    <Card className="border-sky-200 dark:border-sky-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Bộ test:</span>
          <select
            value={selectedM1DataIndex}
            onChange={(e) => setSelectedM1DataIndex(Number(e.target.value))}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {model1Datasets.map((d, idx) => (
              <option key={idx} value={idx}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
          <button onClick={() => setModel1Speed(1100)} className={`px-2 py-0.5 rounded ${model1Speed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-sky-600' : 'text-slate-500'}`}>0.5x</button>
          <button onClick={() => setModel1Speed(650)} className={`px-2 py-0.5 rounded ${model1Speed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-sky-600' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setModel1Speed(350)} className={`px-2 py-0.5 rounded ${model1Speed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-sky-600' : 'text-slate-500'}`}>2x</button>
        </div>
      </div>

      {/* M1 Visualizer */}
      <div className="py-6 flex flex-col items-center">
        {/* Stat badges */}
        <div className="flex items-center gap-6 mb-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Target:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              {model1Datasets[selectedM1DataIndex].target}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Tổng A[L] + A[R]:</span>
            <span className={`font-bold px-2 py-0.5 rounded border ${
              currStep1.isFound
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}>
              {currStep1.currentSum}
            </span>
          </div>
        </div>

        {/* Array Cells */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full">
          {model1Datasets[selectedM1DataIndex].arr.map((val, idx) => {
            const isLeft = idx === currStep1.left;
            const isRight = idx === currStep1.right;
            const isEliminated = idx < currStep1.left || idx > currStep1.right;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer marker */}
                <div className="h-6 flex items-center justify-center text-xs font-mono font-bold">
                  {isLeft && <span className="text-sky-600 dark:text-sky-400">L</span>}
                  {isRight && <span className="text-amber-600 dark:text-amber-400">R</span>}
                </div>

                {/* Cell */}
                <div
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-150 ${
                    currStep1.isFound && (isLeft || isRight)
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 scale-105 shadow-md'
                      : isLeft
                      ? 'bg-sky-100 dark:bg-sky-950/80 border-sky-500 text-sky-800 dark:text-sky-200 scale-105 shadow-md'
                      : isRight
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-200 scale-105 shadow-md'
                      : isEliminated
                      ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
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
      </div>

      {/* 3 dòng chuẩn */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
        <div><strong className="text-sky-600 dark:text-sky-400">Quan sát:</strong> {currStep1.observation}</div>
        <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currStep1.decision}</div>
        <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currStep1.reason}</div>
      </div>

      {/* Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setModel1Playing(false); setModel1Index(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setModel1Playing(false); setModel1Index((prev) => Math.max(0, prev - 1)); }}
            disabled={model1Index === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={model1Playing ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setModel1Playing(!model1Playing)}
            leftIcon={model1Playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {model1Playing ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setModel1Playing(false); setModel1Index((prev) => Math.min(model1Steps.length - 1, prev + 1)); }}
            disabled={model1Index === model1Steps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
