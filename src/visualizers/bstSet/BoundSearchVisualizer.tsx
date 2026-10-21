import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export interface BoundSearchStep {
  target: number;
  arraySnapshot: number[];
  left: number;
  right: number;
  mid: number;
  lowerIndex: number | null;
  upperIndex: number | null;
  action: 'INIT' | 'CHECK_MID' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'FOUND_LOWER' | 'FOUND_UPPER' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

const sortedArray = [10, 20, 20, 20, 35, 50, 65, 80];
const targetOptions = [20, 30, 50, 5, 90];

export const BoundSearchVisualizer: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<number>(20);

  const [boundIndex, setBoundIndex] = useState<number>(0);
  const [boundPlaying, setBoundPlaying] = useState<boolean>(false);
  const [boundSpeed, setBoundSpeed] = useState<number>(750);
  const boundTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectTarget = (tVal: number) => {
    setSelectedTarget(tVal);
    setBoundIndex(0);
    setBoundPlaying(false);
  };

  const boundSteps = useMemo<BoundSearchStep[]>(() => {
    const steps: BoundSearchStep[] = [];
    const arr = sortedArray;
    const X = selectedTarget;

    steps.push({
      target: X,
      arraySnapshot: [...arr],
      left: 0,
      right: arr.length,
      mid: -1,
      lowerIndex: null,
      upperIndex: null,
      action: 'INIT',
      observation: `Khởi tạo tập có thứ tự std::set/multiset gồm ${arr.length} phần tử. Giá trị cần tìm: X = ${X}.`,
      decision: `Chuẩn bị xác định vị trí iterator của s.lower_bound(${X}) và s.upper_bound(${X}).`,
      reason: `lower_bound tìm phần tử đầu tiên >= X. upper_bound tìm phần tử đầu tiên > X.`,
    });

    // Step 1: Simulate lower_bound
    let l = 0, r = arr.length;
    while (l < r) {
      const m = Math.floor((l + r) / 2);
      steps.push({
        target: X,
        arraySnapshot: [...arr],
        left: l,
        right: r,
        mid: m,
        lowerIndex: null,
        upperIndex: null,
        action: 'CHECK_MID',
        observation: `Xét phần tử giữa arr[${m}] = ${arr[m]} để tìm lower_bound(${X}).`,
        decision: arr[m] >= X ? `arr[${m}] >= ${X} -> Có thể là đáp án, co cận phải: right = ${m}` : `arr[${m}] < ${X} -> Bỏ nửa trái: left = ${m + 1}`,
        reason: `lower_bound tìm vị trí nhỏ nhất có giá trị >= ${X}.`,
      });
      if (arr[m] >= X) {
        r = m;
      } else {
        l = m + 1;
      }
    }
    const lowerRes = l;

    steps.push({
      target: X,
      arraySnapshot: [...arr],
      left: lowerRes,
      right: lowerRes,
      mid: lowerRes,
      lowerIndex: lowerRes < arr.length ? lowerRes : null,
      upperIndex: null,
      action: 'FOUND_LOWER',
      observation: lowerRes < arr.length
        ? `Đã xác định được lower_bound(${X}) tại index ${lowerRes} với giá trị ${arr[lowerRes]}.`
        : `Mọi phần tử đều nhỏ hơn ${X} -> lower_bound(${X}) trả về s.end().`,
      decision: `Tiếp tục xác định upper_bound(${X}).`,
      reason: `Phần tử đầu tiên có giá trị >= ${X} nằm tại vị trí này.`,
    });

    // Step 2: Simulate upper_bound
    l = 0;
    r = arr.length;
    while (l < r) {
      const m = Math.floor((l + r) / 2);
      if (arr[m] > X) {
        r = m;
      } else {
        l = m + 1;
      }
    }
    const upperRes = l;
    const countMatches = upperRes - lowerRes;

    steps.push({
      target: X,
      arraySnapshot: [...arr],
      left: lowerRes,
      right: upperRes,
      mid: upperRes,
      lowerIndex: lowerRes < arr.length ? lowerRes : null,
      upperIndex: upperRes < arr.length ? upperRes : null,
      action: 'DONE',
      observation: `upper_bound(${X}) tại index ${upperRes} ${upperRes < arr.length ? `(giá trị ${arr[upperRes]})` : '(s.end())'}.`,
      decision: `Khoảng nửa mở [lower_bound, upper_bound) chứa chính xác ${Math.max(0, countMatches)} phần tử bằng ${X}.`,
      reason: `Trong std::multiset, số lượng bản sao của giá trị X chính là khoảng cách giữa 2 iterator này!`,
    });

    return steps;
  }, [selectedTarget]);

  useEffect(() => {
    if (boundPlaying) {
      boundTimerRef.current = setInterval(() => {
        setBoundIndex((prev) => {
          if (prev >= boundSteps.length - 1) {
            setBoundPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, boundSpeed);
    } else if (boundTimerRef.current) {
      clearInterval(boundTimerRef.current);
    }
    return () => {
      if (boundTimerRef.current) clearInterval(boundTimerRef.current);
    };
  }, [boundPlaying, boundSteps.length, boundSpeed]);

  const currBound = boundSteps[boundIndex] || boundSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        3. Mô Phỏng Tương Tác: lower_bound & upper_bound Trên Set/Multiset
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Chọn giá trị cần tìm $X$ và xem quá trình thu hẹp phạm vi để xác định con trỏ <code className="font-mono text-teal-600">lower_bound</code> (≥ X) và <code className="font-mono text-amber-600">upper_bound</code> (&gt; X):
      </p>

      {/* Target selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium">Chọn giá trị X cần tìm:</span>
        {targetOptions.map((tVal) => (
          <button
            key={tVal}
            type="button"
            onClick={() => handleSelectTarget(tVal)}
            className={`px-3 py-1 text-xs rounded-lg border font-mono transition cursor-pointer ${
              selectedTarget === tVal
                ? 'bg-teal-600 text-white border-teal-600 font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            X = {tVal}
          </button>
        ))}
      </div>

      {/* Bound Visualizer Card */}
      <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tập Hợp Có Thứ Tự (Sorted Elements / BST)
          </span>
          <div className="text-xs font-mono">
            Mục tiêu: <span className="font-bold text-teal-600 dark:text-teal-400">X = {currBound.target}</span>
          </div>
        </div>

        {/* Array visualization */}
        <div className="flex flex-wrap gap-2 justify-center py-4">
          {currBound.arraySnapshot.map((num, idx) => {
            const isLower = currBound.lowerIndex === idx;
            const isUpper = currBound.upperIndex === idx;
            const isMid = currBound.mid === idx;
            const inRange = idx >= currBound.left && idx < currBound.right;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <span>[{idx}]</span>
                  {isLower && <span className="text-teal-600 font-bold">lower</span>}
                  {isUpper && <span className="text-amber-600 font-bold">upper</span>}
                </div>
                <div
                  className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-sm ${
                    isLower && isUpper
                      ? 'bg-purple-600 text-white ring-4 ring-purple-300 scale-105'
                      : isLower
                      ? 'bg-teal-600 text-white ring-4 ring-teal-200 dark:ring-teal-900 scale-105'
                      : isUpper
                      ? 'bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900 scale-105'
                      : isMid
                      ? 'bg-sky-500 text-white ring-2 ring-sky-300'
                      : inRange
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600'
                      : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <span className="text-base">{num}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation Step */}
        <div
          aria-live="polite"
          className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 my-3"
        >
          <div>
            <span className="font-semibold text-slate-500">Quan sát: </span>
            <span className="text-slate-800 dark:text-slate-200">{currBound.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{currBound.decision}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Ý nghĩa: </span>
            <span className="text-slate-600 dark:text-slate-400">{currBound.reason}</span>
          </div>
        </div>

        {/* Bound Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBoundIndex(0)}
              title="Đặt lại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={boundIndex === 0}
              onClick={() => setBoundIndex((p) => Math.max(0, p - 1))}
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setBoundPlaying(!boundPlaying)}
            >
              {boundPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {boundPlaying ? 'Dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={boundIndex >= boundSteps.length - 1}
              onClick={() => setBoundIndex((p) => Math.min(boundSteps.length - 1, p + 1))}
              title="Bước tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Bước {boundIndex + 1}/{boundSteps.length}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {[
                { label: '0.5x', speed: 1200 },
                { label: '1x', speed: 750 },
                { label: '2x', speed: 350 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setBoundSpeed(s.speed)}
                  className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    boundSpeed === s.speed
                      ? 'bg-white dark:bg-slate-700 text-teal-600 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};
