import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export interface TwoHeapsStep {
  num: number | null;
  maxHeap: number[]; // Left half (stores smaller values, top is largest)
  minHeap: number[]; // Right half (stores larger values, top is smallest)
  median: number | null;
  action: 'INIT' | 'ADD' | 'BALANCE' | 'CALC' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export const TwoHeapsVisualizer: React.FC = () => {
  const twoHeapsDatasets = [
    { label: 'Luồng số: [5, 15, 1, 3, 8, 9]', stream: [5, 15, 1, 3, 8, 9] },
    { label: 'Luồng tăng dần: [1, 2, 3, 4, 5]', stream: [1, 2, 3, 4, 5] },
  ];
  const [selectedTwoHeapIdx, setSelectedTwoHeapIdx] = useState<number>(0);
  const [twoHeapIndex, setTwoHeapIndex] = useState<number>(0);
  const [twoHeapPlaying, setTwoHeapPlaying] = useState<boolean>(false);
  const [twoHeapSpeed, setTwoHeapSpeed] = useState<number>(750);
  const twoHeapTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const twoHeapsSteps = useMemo<TwoHeapsStep[]>(() => {
    const rawStream = twoHeapsDatasets[selectedTwoHeapIdx].stream;
    const steps: TwoHeapsStep[] = [];
    const maxH: number[] = []; // Stores left half (sorted descending for visual)
    const minH: number[] = []; // Stores right half (sorted ascending for visual)

    steps.push({
      num: null,
      maxHeap: [],
      minHeap: [],
      median: null,
      action: 'INIT',
      observation: 'Khởi tạo cặp Heaps cân bằng: Max-Heap (lưu nửa số nhỏ) và Min-Heap (lưu nửa số lớn).',
      decision: 'Duy trì điều kiện bất biến: size(Max-Heap) >= size(Min-Heap) và chênh lệch không quá 1.',
      reason: 'Đỉnh Max-Heap và đỉnh Min-Heap kẹp sát trung vị của toàn bộ luồng dữ liệu!',
    });

    for (let i = 0; i < rawStream.length; i++) {
      const x = rawStream[i];
      // 1. Add to maxHeap or minHeap
      if (maxH.length === 0 || x <= maxH[0]) {
        maxH.push(x);
        maxH.sort((a, b) => b - a); // Max-heap top is at index 0
      } else {
        minH.push(x);
        minH.sort((a, b) => a - b); // Min-heap top is at index 0
      }

      // 2. Rebalance
      if (maxH.length > minH.length + 1) {
        const moved = maxH.shift()!;
        minH.push(moved);
        minH.sort((a, b) => a - b);
      } else if (minH.length > maxH.length) {
        const moved = minH.shift()!;
        maxH.push(moved);
        maxH.sort((a, b) => b - a);
      }

      // 3. Calc median
      let med: number;
      if (maxH.length > minH.length) {
        med = maxH[0];
      } else {
        med = (maxH[0] + minH[0]) / 2;
      }

      steps.push({
        num: x,
        maxHeap: [...maxH],
        minHeap: [...minH],
        median: med,
        action: 'CALC',
        observation: `Thêm số ${x}. Phân chia: Nửa dưới (Max-Heap) có ${maxH.length} phần tử, Nửa trên (Min-Heap) có ${minH.length} phần tử.`,
        decision: `Tính trung vị = ${med} (lấy từ đỉnh Max-Heap ${maxH[0]}${maxH.length === minH.length ? ` và đỉnh Min-Heap ${minH[0]}` : ''}).`,
        reason: `Mỗi lần thêm số mất O(log N), truy vấn trung vị tức thì trong O(1).`,
      });
    }

    steps.push({
      num: null,
      maxHeap: [...maxH],
      minHeap: [...minH],
      median: maxH.length > minH.length ? maxH[0] : (maxH[0] + minH[0]) / 2,
      action: 'DONE',
      observation: `Hoàn tất luồng dữ liệu. Hệ thống Two Heaps duy trì trạng thái cân bằng tuyệt đối.`,
      decision: `Kết thúc mô phỏng.`,
      reason: `Đây là giải pháp kinh điển LeetCode 295 giúp đạt O(1) findMedian và O(log N) addNum.`,
    });

    return steps;
  }, [selectedTwoHeapIdx]);

  useEffect(() => {
    setTwoHeapIndex(0);
    setTwoHeapPlaying(false);
  }, [selectedTwoHeapIdx]);

  useEffect(() => {
    if (twoHeapPlaying) {
      twoHeapTimerRef.current = setInterval(() => {
        setTwoHeapIndex((prev) => {
          if (prev >= twoHeapsSteps.length - 1) {
            setTwoHeapPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, twoHeapSpeed);
    } else if (twoHeapTimerRef.current) {
      clearInterval(twoHeapTimerRef.current);
    }
    return () => {
      if (twoHeapTimerRef.current) clearInterval(twoHeapTimerRef.current);
    };
  }, [twoHeapPlaying, twoHeapsSteps.length, twoHeapSpeed]);

  const currTwoHeap = twoHeapsSteps[twoHeapIndex] || twoHeapsSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        4. Kỹ Thuật Nâng Cao: Cặp Two Heaps Tìm Trung Vị (LeetCode 295)
      </h2>

      <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
        Tìm trung vị của một luồng số liên tục là câu hỏi phỏng vấn kinh điển tại Google và Meta. Nếu mỗi lần tìm ta sắp xếp mảng mất $O(N \log N)$. Nhưng nếu chia luồng số làm hai nửa bằng <strong>Max-Heap (lưu nửa nhỏ)</strong> và <strong>Min-Heap (lưu nửa lớn)</strong>, ta sẽ tìm được trung vị ngay lập tức trong <span className="font-mono font-bold text-teal-600">O(1)</span>!
      </p>

      {/* Dataset selector Two Heaps */}
      <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
        <span className="text-xs text-slate-500 font-medium">Chọn luồng số mẫu:</span>
        {twoHeapsDatasets.map((d, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedTwoHeapIdx(idx)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
              selectedTwoHeapIdx === idx
                ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Visualizer Card Two Heaps */}
      <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm mt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cơ chế cân bằng Two Heaps (LeetCode 295)
          </span>
          <div className="text-xs font-mono">
            Trung vị hiện tại:{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
              {currTwoHeap.median !== null ? currTwoHeap.median : 'Chưa có'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Left: Max-Heap */}
          <div className="p-3 rounded-lg border border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300">
                Max-Heap (Nửa Nhỏ ≤ Median)
              </span>
              <Badge variant="slate" size="xs">
                {currTwoHeap.maxHeap.length} số
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[44px] items-center">
              {currTwoHeap.maxHeap.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Rỗng</span>
              ) : (
                currTwoHeap.maxHeap.map((v, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                      idx === 0
                        ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
                        : 'bg-white dark:bg-slate-800 text-sky-900 dark:text-sky-200 border border-sky-300'
                    }`}
                  >
                    {v} {idx === 0 && '(top)'}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Right: Min-Heap */}
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Min-Heap (Nửa Lớn ≥ Median)
              </span>
              <Badge variant="slate" size="xs">
                {currTwoHeap.minHeap.length} số
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[44px] items-center">
              {currTwoHeap.minHeap.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Rỗng</span>
              ) : (
                currTwoHeap.minHeap.map((v, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                        : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-300'
                    }`}
                  >
                    {v} {idx === 0 && '(top)'}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Two Heaps Explanation */}
        <div
          aria-live="polite"
          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1 mb-4"
        >
          <div>
            <span className="font-semibold text-slate-500">Quan sát: </span>
            <span className="text-slate-800 dark:text-slate-200">{currTwoHeap.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600">Quy tắc: </span>
            <span className="text-slate-800 dark:text-slate-200">{currTwoHeap.reason}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTwoHeapIndex(0)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={twoHeapIndex === 0}
              onClick={() => setTwoHeapIndex((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setTwoHeapPlaying(!twoHeapPlaying)}
            >
              {twoHeapPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {twoHeapPlaying ? 'Dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={twoHeapIndex >= twoHeapsSteps.length - 1}
              onClick={() => setTwoHeapIndex((p) => Math.min(twoHeapsSteps.length - 1, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Bước {twoHeapIndex + 1}/{twoHeapsSteps.length}
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
                  onClick={() => setTwoHeapSpeed(s.speed)}
                  className={`px-2.5 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    twoHeapSpeed === s.speed
                      ? 'bg-white dark:bg-slate-700 text-amber-600 font-bold shadow-xs'
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
