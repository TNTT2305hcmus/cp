import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export interface BitsetDPStep {
  itemIndex: number;
  weight: number;
  oldDp: number;
  shiftedDp: number;
  newDp: number;
  action: 'INIT' | 'SHIFT' | 'OR_MERGE' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

const dpDatasets = [
  { label: 'Tập số [2, 3, 7] (W = 12)', weights: [2, 3, 7], maxWeight: 14 },
  { label: 'Tập số [3, 5, 4] (W = 12)', weights: [3, 5, 4], maxWeight: 14 },
  { label: 'Tập số [1, 2, 4, 8] (Lũy thừa 2)', weights: [1, 2, 4, 8], maxWeight: 16 },
];

export const BitsetSubsetSumVisualizer: React.FC = () => {
  const [selectedDpDataIdx, setSelectedDpDataIdx] = useState<number>(0);
  const [dpIndex, setDpIndex] = useState<number>(0);
  const [dpPlaying, setDpPlaying] = useState<boolean>(false);
  const [dpSpeed, setDpSpeed] = useState<number>(850);
  const dpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectDpDataset = (idx: number) => {
    setSelectedDpDataIdx(idx);
    setDpIndex(0);
    setDpPlaying(false);
  };

  const activeDpConfig = dpDatasets[selectedDpDataIdx];

  const dpSteps = useMemo<BitsetDPStep[]>(() => {
    const { weights } = activeDpConfig;
    const steps: BitsetDPStep[] = [];
    let currentMask = 1;

    steps.push({
      itemIndex: -1,
      weight: 0,
      oldDp: 1,
      shiftedDp: 0,
      newDp: 1,
      action: 'INIT',
      observation: 'Khởi tạo Bitset: std::bitset<16> dp; dp[0] = 1 (tổng bằng 0 luôn luôn tạo được từ tập rỗng).',
      decision: 'Mọi bit khác ban đầu bằng 0.',
      reason: 'Biểu diễn trạng thái nhị phân: Bit thứ i = 1 nghĩa là tổng i có thể tạo thành.',
    });

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      const shifted = currentMask << w;
      const merged = currentMask | shifted;

      steps.push({
        itemIndex: i,
        weight: w,
        oldDp: currentMask,
        shiftedDp: shifted,
        newDp: currentMask,
        action: 'SHIFT',
        observation: `Xét phần tử thứ ${i + 1} có giá trị w = ${w}. Thực hiện phép dịch trái: dp << ${w}.`,
        decision: `Tất cả các tổng cũ x được tịnh tiến thành x + ${w} song song cùng lúc trong đúng 1 chu kỳ lệnh!`,
        reason: `Bitwise Shift nhân bản toàn bộ không gian trạng thái chỉ với 1 phép toán CPU.`,
      });

      steps.push({
        itemIndex: i,
        weight: w,
        oldDp: currentMask,
        shiftedDp: shifted,
        newDp: merged,
        action: 'OR_MERGE',
        observation: `Thực hiện phép OR bit: dp |= (dp << ${w}). Hợp nhất tập các tổng cũ và tập các tổng mới tạo thành.`,
        decision: `Cập nhật trạng thái mới. Các tổng tạo được hiện tại: [${getSetBits(merged).join(', ')}].`,
        reason: `Không cần vòng lặp for duyệt ngược w từ W về 0 như DP thông thường. Tốc độ tăng gấp 64 lần!`,
      });

      currentMask = merged;
    }

    steps.push({
      itemIndex: weights.length,
      weight: 0,
      oldDp: currentMask,
      shiftedDp: 0,
      newDp: currentMask,
      action: 'DONE',
      observation: `Hoàn tất tất cả các phần tử. Toàn bộ các tổng con khả thi: [${getSetBits(currentMask).join(', ')}].`,
      decision: `Để kiểm tra tổng W có đạt được không, chỉ cần kiểm tra dp.test(W) trong O(1)!`,
      reason: `Độ phức tạp toàn bài: O(N × W / 64) thời gian và O(W / 64) bộ nhớ!`,
    });

    return steps;
  }, [activeDpConfig]);

  function getSetBits(mask: number): number[] {
    const res: number[] = [];
    for (let bit = 0; bit <= 16; bit++) {
      if ((mask & (1 << bit)) !== 0) {
        res.push(bit);
      }
    }
    return res;
  }

  useEffect(() => {
    if (dpPlaying) {
      dpTimerRef.current = setInterval(() => {
        setDpIndex((prev) => {
          if (prev >= dpSteps.length - 1) {
            setDpPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, dpSpeed);
    } else if (dpTimerRef.current) {
      clearInterval(dpTimerRef.current);
    }
    return () => {
      if (dpTimerRef.current) clearInterval(dpTimerRef.current);
    };
  }, [dpPlaying, dpSteps.length, dpSpeed]);

  const currDp = dpSteps[dpIndex] || dpSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        3. Mô Phỏng Tương Tác: Subset Sum Với Lệnh Dịch dp |= (dp &lt;&lt; w)
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Quan sát cách một mảng trạng thái nhị phân được dịch chuyển trái $w$ vị trí và tự động tạo ra tất cả các tổng mới mà không cần vòng lặp:
      </p>

      {/* Dataset selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium">Chọn bộ test:</span>
        {dpDatasets.map((d, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectDpDataset(idx)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
              selectedDpDataIdx === idx
                ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Visualizer Card */}
      <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Thanh Ghi Bitset (Từ bit 0 đến bit 14)
          </span>
          <div className="text-xs font-mono">
            Đang xét: <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{currDp.weight > 0 ? `w = ${currDp.weight}` : 'Khởi tạo'}</span>
          </div>
        </div>

        {/* Bit register boxes */}
        <div className="space-y-3 py-2">
          {/* Current DP */}
          <div>
            <div className="text-[11px] font-mono text-slate-500 mb-1">
              Trạng thái hiện tại: <code className="font-bold text-teal-600">dp</code>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {Array.from({ length: 15 }, (_, bit) => {
                const isSet = (currDp.newDp & (1 << bit)) !== 0;
                const isOldSet = (currDp.oldDp & (1 << bit)) !== 0;
                const isNewBit = isSet && !isOldSet;

                return (
                  <div key={bit} className="flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-400 mb-0.5">{bit}</span>
                    <div
                      className={`w-9 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-all ${
                        isNewBit
                          ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-900 scale-105 shadow-sm'
                          : isSet
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isSet ? '1' : '0'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shifted preview if in SHIFT state */}
          {currDp.action === 'SHIFT' && (
            <div className="p-2.5 rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20">
              <div className="text-[11px] font-mono text-sky-800 dark:text-sky-300 mb-1">
                Kết quả sau khi dịch trái {currDp.weight} bit: <code className="font-bold">(dp &lt;&lt; {currDp.weight})</code>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {Array.from({ length: 15 }, (_, bit) => {
                  const isShiftSet = (currDp.shiftedDp & (1 << bit)) !== 0;
                  return (
                    <div key={bit} className="flex flex-col items-center">
                      <span className="text-[9px] font-mono text-slate-400 mb-0.5">{bit}</span>
                      <div
                        className={`w-9 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isShiftSet
                            ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
                            : 'bg-white dark:bg-slate-800 text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isShiftSet ? '1' : '0'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Explanation Step */}
        <div
          aria-live="polite"
          className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 my-3"
        >
          <div>
            <span className="font-semibold text-slate-500">Quan sát: </span>
            <span className="text-slate-800 dark:text-slate-200">{currDp.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{currDp.decision}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Lý do: </span>
            <span className="text-slate-600 dark:text-slate-400">{currDp.reason}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDpIndex(0)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={dpIndex === 0}
              onClick={() => setDpIndex((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setDpPlaying(!dpPlaying)}
            >
              {dpPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {dpPlaying ? 'Dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={dpIndex >= dpSteps.length - 1}
              onClick={() => setDpIndex((p) => Math.min(dpSteps.length - 1, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Bước {dpIndex + 1}/{dpSteps.length}
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
                  onClick={() => setDpSpeed(s.speed)}
                  className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    dpSpeed === s.speed
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
