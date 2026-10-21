import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export interface SlidingSetStep {
  currentIndex: number;
  currentVal: number;
  windowElements: number[]; // Sorted set representation
  targetDiff: number; // t
  windowSize: number; // k
  matchedPair: [number, number] | null;
  action: 'INIT' | 'QUERY' | 'MATCH_FOUND' | 'INSERT' | 'SLIDE_REMOVE' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

const slidingDatasets = [
  {
    label: 'Có nghiệm: nums = [1, 5, 9, 1, 5, 9], k = 2, t = 3',
    nums: [1, 5, 9, 1, 5, 9],
    k: 2,
    t: 3,
  },
  {
    label: 'Không nghiệm: nums = [1, 2, 3, 1], k = 3, t = 0 (trùng tại k=3)',
    nums: [1, 2, 3, 1],
    k: 3,
    t: 0,
  },
];

export const SlidingSetVisualizer: React.FC = () => {
  const [selectedSlidingIdx, setSelectedSlidingIdx] = useState<number>(0);
  const [slidingIndex, setSlidingIndex] = useState<number>(0);
  const [slidingPlaying, setSlidingPlaying] = useState<boolean>(false);
  const [slidingSpeed, setSlidingSpeed] = useState<number>(850);
  const slidingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectSlidingDataset = (idx: number) => {
    setSelectedSlidingIdx(idx);
    setSlidingIndex(0);
    setSlidingPlaying(false);
  };

  const activeSlidingConfig = slidingDatasets[selectedSlidingIdx];

  const slidingSteps = useMemo<SlidingSetStep[]>(() => {
    const nums = activeSlidingConfig.nums;
    const k = activeSlidingConfig.k;
    const t = activeSlidingConfig.t;
    const steps: SlidingSetStep[] = [];
    const windowSet: number[] = [];

    steps.push({
      currentIndex: -1,
      currentVal: 0,
      windowElements: [],
      targetDiff: t,
      windowSize: k,
      matchedPair: null,
      action: 'INIT',
      observation: `Bắt đầu duyệt mảng. Cần tìm cặp chỉ số i, j sao cho |i - j| <= ${k} và |nums[i] - nums[j]| <= ${t}.`,
      decision: `Duy trì cửa sổ trượt kích thước tối đa k = ${k} bằng std::set (BST).`,
      reason: `Tra cứu phần tử thỏa mãn hiệu giá trị tốn O(log k) bằng set.lower_bound.`,
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];

      // Step: Query
      // Find smallest in window >= val - t
      const minTarget = val - t;
      const maxTarget = val + t;
      const sortedWindow = [...windowSet].sort((a, b) => a - b);
      const candidate = sortedWindow.find((x) => x >= minTarget);

      steps.push({
        currentIndex: i,
        currentVal: val,
        windowElements: [...sortedWindow],
        targetDiff: t,
        windowSize: k,
        matchedPair: null,
        action: 'QUERY',
        observation: `Xét nums[${i}] = ${val}. Cần tìm phần tử trong cửa sổ thuộc đoạn [${minTarget}, ${maxTarget}].`,
        decision: `Gọi window.lower_bound(${minTarget}) trên cây BST.`,
        reason: candidate !== undefined
          ? `Tìm thấy ứng viên nhỏ nhất >= ${minTarget} là ${candidate}.`
          : `Không có phần tử nào trong cửa sổ >= ${minTarget}.`,
      });

      if (candidate !== undefined && candidate <= maxTarget) {
        steps.push({
          currentIndex: i,
          currentVal: val,
          windowElements: [...sortedWindow],
          targetDiff: t,
          windowSize: k,
          matchedPair: [candidate, val],
          action: 'MATCH_FOUND',
          observation: `Phần tử ${candidate} thỏa mãn điều kiện! Khoảng cách giá trị: |${val} - ${candidate}| = ${Math.abs(val - candidate)} <= ${t}.`,
          decision: `Tìm thấy cặp thỏa mãn tại cửa sổ hiện tại -> Trả về TRUE ngay lập tức!`,
          reason: `Thuật toán dừng sớm (Early return) giúp tối ưu thời gian thi đấu.`,
        });
        return steps;
      }

      // Add to set
      windowSet.push(val);

      // Slide window if needed
      if (i >= k) {
        const removed = nums[i - k];
        const remIdx = windowSet.indexOf(removed);
        if (remIdx !== -1) windowSet.splice(remIdx, 1);

        steps.push({
          currentIndex: i,
          currentVal: val,
          windowElements: [...windowSet].sort((a, b) => a - b),
          targetDiff: t,
          windowSize: k,
          matchedPair: null,
          action: 'SLIDE_REMOVE',
          observation: `Cửa sổ trượt vượt quá kích thước k = ${k}. Loại bỏ phần tử hết hạn nums[${i - k}] = ${removed}.`,
          decision: `Gọi window.erase(${removed}) để giữ kích thước <= ${k}.`,
          reason: `Đảm bảo mọi phần tử trong set luôn có khoảng cách chỉ số <= k với phần tử tiếp theo.`,
        });
      } else {
        steps.push({
          currentIndex: i,
          currentVal: val,
          windowElements: [...windowSet].sort((a, b) => a - b),
          targetDiff: t,
          windowSize: k,
          matchedPair: null,
          action: 'INSERT',
          observation: `Thêm ${val} vào set. Cửa sổ hiện có ${windowSet.length} phần tử (chưa vượt quá k = ${k}).`,
          decision: `Tiếp tục bước kế tiếp.`,
          reason: `Tập set duy trì trạng thái có thứ tự của cửa sổ.`,
        });
      }
    }

    steps.push({
      currentIndex: nums.length,
      currentVal: 0,
      windowElements: [...windowSet].sort((a, b) => a - b),
      targetDiff: t,
      windowSize: k,
      matchedPair: null,
      action: 'DONE',
      observation: `Đã duyệt hết mảng mà không tìm thấy bất kỳ cặp chỉ số nào thỏa mãn.`,
      decision: `Trả về FALSE.`,
      reason: `Độ phức tạp toàn thuật toán: O(N log k) thời gian, O(k) không gian bộ nhớ.`,
    });

    return steps;
  }, [activeSlidingConfig]);

  useEffect(() => {
    if (slidingPlaying) {
      slidingTimerRef.current = setInterval(() => {
        setSlidingIndex((prev) => {
          if (prev >= slidingSteps.length - 1) {
            setSlidingPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, slidingSpeed);
    } else if (slidingTimerRef.current) {
      clearInterval(slidingTimerRef.current);
    }
    return () => {
      if (slidingTimerRef.current) clearInterval(slidingTimerRef.current);
    };
  }, [slidingPlaying, slidingSteps.length, slidingSpeed]);

  const currSliding = slidingSteps[slidingIndex] || slidingSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        4. Mô Phỏng Thực Chiến: Cửa Sổ Trượt Với BST (LeetCode 220)
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Trực quan hóa cách <code className="font-mono text-teal-600 font-bold">std::set</code> hoạt động trong cửa sổ trượt kích thước $k$ để kiểm tra $|nums[i] - nums[j]| \le t$ trong $O(N \log k)$:
      </p>

      {/* Dataset selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium">Chọn bộ test:</span>
        {slidingDatasets.map((d, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSlidingDataset(idx)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
              selectedSlidingIdx === idx
                ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Sliding Window Card */}
      <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        {/* Numbers list */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Dãy số nums (k = {activeSlidingConfig.k}, t = {activeSlidingConfig.t})
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSlidingConfig.nums.map((val, idx) => {
              const isCurrent = idx === currSliding.currentIndex;
              const isMatched = currSliding.matchedPair && (currSliding.matchedPair[0] === val || currSliding.matchedPair[1] === val);

              return (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs transition-all ${
                    isMatched
                      ? 'bg-emerald-600 text-white font-bold ring-4 ring-emerald-300 scale-110 shadow-md'
                      : isCurrent
                      ? 'bg-teal-600 text-white font-bold ring-2 ring-teal-300 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[9px] opacity-75">#{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Set in current window */}
        <div className="p-3.5 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase">
              Tập Hợp std::set Trong Cửa Sổ Trượt (Tối đa k = {activeSlidingConfig.k} phần tử)
            </span>
            <Badge variant="teal" size="xs">
              {currSliding.windowElements.length} phần tử
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
            {currSliding.windowElements.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Cửa sổ đang rỗng</span>
            ) : (
              currSliding.windowElements.map((v, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 font-mono text-xs font-bold border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 shadow-xs"
                >
                  {v}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Explanation */}
        <div
          aria-live="polite"
          className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 mb-3"
        >
          <div>
            <span className="font-semibold text-slate-500">Quan sát: </span>
            <span className="text-slate-800 dark:text-slate-200">{currSliding.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{currSliding.decision}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Lý do: </span>
            <span className="text-slate-600 dark:text-slate-400">{currSliding.reason}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSlidingIndex(0)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={slidingIndex === 0}
              onClick={() => setSlidingIndex((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSlidingPlaying(!slidingPlaying)}
            >
              {slidingPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {slidingPlaying ? 'Dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={slidingIndex >= slidingSteps.length - 1}
              onClick={() => setSlidingIndex((p) => Math.min(slidingSteps.length - 1, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Bước {slidingIndex + 1}/{slidingSteps.length}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {[
                { label: '0.5x', speed: 1300 },
                { label: '1x', speed: 850 },
                { label: '2x', speed: 400 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSlidingSpeed(s.speed)}
                  className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    slidingSpeed === s.speed
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
