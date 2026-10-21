import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export interface RandomizedSetStep {
  operation: 'INSERT' | 'REMOVE' | 'GET_RANDOM';
  val: number;
  numsArray: number[];
  mapSnapshot: Record<number, number>; // val -> index
  swappedDetails?: {
    removedVal: number;
    removedIdx: number;
    lastVal: number;
    lastIdx: number;
  };
  randomResult?: number;
  action: 'INIT' | 'DO_INSERT' | 'DO_REMOVE_SWAP' | 'DO_RANDOM' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export const RandomizedSetVisualizer: React.FC = () => {
  const [randomSetIndex, setRandomSetIndex] = useState<number>(0);
  const [randomSetPlaying, setRandomSetPlaying] = useState<boolean>(false);
  const [randomSetSpeed, setRandomSetSpeed] = useState<number>(850);
  const randomSetTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const randomSetSteps = useMemo<RandomizedSetStep[]>(() => {
    const steps: RandomizedSetStep[] = [];
    const nums: number[] = [];
    const valMap: Record<number, number> = {};

    steps.push({
      operation: 'INSERT',
      val: 0,
      numsArray: [],
      mapSnapshot: {},
      action: 'INIT',
      observation: 'Khởi tạo cấu trúc LeetCode 380: Mảng động nums[] (cho phép truy xuất chỉ số O(1)) kết hợp Bảng băm map (val -> index).',
      decision: 'Sẵn sàng tiếp nhận các thao tác: insert(10), insert(20), insert(30), remove(10), getRandom().',
      reason: 'Nếu chỉ dùng Map thì không thể getRandom O(1). Nếu chỉ dùng Mảng thì xóa phần tử ở giữa mất O(N). Kết hợp cả hai để đạt O(1) mọi thao tác!',
    });

    // Operation 1: Insert 10
    nums.push(10);
    valMap[10] = nums.length - 1;
    steps.push({
      operation: 'INSERT',
      val: 10,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      action: 'DO_INSERT',
      observation: 'Thao tác insert(10): Thêm 10 vào cuối mảng nums -> nums[0] = 10.',
      decision: 'Lưu ánh xạ valMap[10] = 0.',
      reason: 'Cả thao tác push_back mảng và insert hash map đều tốn O(1).',
    });

    // Operation 2: Insert 20
    nums.push(20);
    valMap[20] = nums.length - 1;
    steps.push({
      operation: 'INSERT',
      val: 20,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      action: 'DO_INSERT',
      observation: 'Thao tác insert(20): Thêm 20 vào cuối mảng nums -> nums[1] = 20.',
      decision: 'Lưu ánh xạ valMap[20] = 1.',
      reason: 'Tiếp tục duy trì tính toàn vẹn của chỉ số.',
    });

    // Operation 3: Insert 30
    nums.push(30);
    valMap[30] = nums.length - 1;
    steps.push({
      operation: 'INSERT',
      val: 30,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      action: 'DO_INSERT',
      observation: 'Thao tác insert(30): Thêm 30 vào cuối mảng nums -> nums[2] = 30.',
      decision: 'Lưu ánh xạ valMap[30] = 2. Hiện mảng có 3 phần tử [10, 20, 30].',
      reason: 'Mọi phần tử đều có vị trí chính xác trong Map.',
    });

    // Operation 4: Remove 10 (THE SWAP TRICK)
    const removeVal = 10;
    const idxToRemove = valMap[removeVal];
    const lastElement = nums[nums.length - 1];
    const lastElementIdx = nums.length - 1;

    nums[idxToRemove] = lastElement;
    valMap[lastElement] = idxToRemove;
    nums.pop();
    delete valMap[removeVal];

    steps.push({
      operation: 'REMOVE',
      val: removeVal,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      swappedDetails: {
        removedVal: removeVal,
        removedIdx: idxToRemove,
        lastVal: lastElement,
        lastIdx: lastElementIdx,
      },
      action: 'DO_REMOVE_SWAP',
      observation: `KỸ THUẬT SWAP O(1): Muốn xóa giá trị ${removeVal} tại index ${idxToRemove}. Lấy phần tử cuối mảng là ${lastElement} đè vào index ${idxToRemove}!`,
      decision: `Cập nhật valMap[${lastElement}] = ${idxToRemove}, sau đó gọi nums.pop_back() và xóa ${removeVal} khỏi Map.`,
      reason: `Tránh được việc dời toàn bộ mảng O(N). Thao tác xóa đạt chuẩn O(1) hoàn hảo! Mảng sau khi xóa: [${nums.join(', ')}].`,
    });

    // Operation 5: GetRandom
    const randChoice = nums[1]; // Simulate picking index 1 (value 20)
    steps.push({
      operation: 'GET_RANDOM',
      val: randChoice,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      randomResult: randChoice,
      action: 'DO_RANDOM',
      observation: `Thao tác getRandom(): Sinh chỉ số ngẫu nhiên r = rand() % nums.size() = 1.`,
      decision: `Trả về nums[1] = ${randChoice}. Mọi phần tử đều có xác suất xuất hiện đồng đều 1 / ${nums.length}.`,
      reason: `Mảng động hỗ trợ truy xuất ngẫu nhiên nums[r] trong O(1).`,
    });

    return steps;
  }, []);

  useEffect(() => {
    if (randomSetPlaying) {
      randomSetTimerRef.current = setInterval(() => {
        setRandomSetIndex((prev) => {
          if (prev >= randomSetSteps.length - 1) {
            setRandomSetPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, randomSetSpeed);
    } else if (randomSetTimerRef.current) {
      clearInterval(randomSetTimerRef.current);
    }
    return () => {
      if (randomSetTimerRef.current) clearInterval(randomSetTimerRef.current);
    };
  }, [randomSetPlaying, randomSetSteps.length, randomSetSpeed]);

  const currRandomSet = randomSetSteps[randomSetIndex] || randomSetSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        4. Mô Phỏng Thiết Kế: Insert Delete GetRandom O(1) (LeetCode 380)
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Xem kỹ xảo hoán đổi phần tử cuối mảng để đạt thao tác xóa ở giữa mảng trong $O(1)$ thay vì $O(N)$:
      </p>

      <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        {/* Array visualization */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Mảng Động nums[] (Lưu giá trị để lấy ngẫu nhiên O(1))
          </div>
          <div className="flex flex-wrap gap-2">
            {currRandomSet.numsArray.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Mảng đang rỗng</span>
            ) : (
              currRandomSet.numsArray.map((v, idx) => (
                <div
                  key={idx}
                  className="w-12 h-14 rounded-lg bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 flex flex-col items-center justify-center font-mono"
                >
                  <span className="text-sm font-bold text-teal-800 dark:text-teal-200">{v}</span>
                  <span className="text-[10px] text-slate-400">idx: {idx}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hash map snapshot */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 mb-3">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
            Bảng Băm valToIdx (val → index)
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {Object.keys(currRandomSet.mapSnapshot).length === 0 ? (
              <span className="text-xs text-slate-400 italic">Map rỗng</span>
            ) : (
              Object.entries(currRandomSet.mapSnapshot).map(([k, idx]) => (
                <span
                  key={k}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                >
                  <strong>{k}</strong> → {idx}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Explanation */}
        <div
          aria-live="polite"
          className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1 mb-3"
        >
          <div>
            <span className="font-semibold text-slate-500">Quan sát: </span>
            <span className="text-slate-800 dark:text-slate-200">{currRandomSet.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600">Hành động: </span>
            <span className="text-slate-800 dark:text-slate-200">{currRandomSet.decision}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Bản chất CP: </span>
            <span className="text-slate-600 dark:text-slate-400">{currRandomSet.reason}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRandomSetIndex(0)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={randomSetIndex === 0}
              onClick={() => setRandomSetIndex((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setRandomSetPlaying(!randomSetPlaying)}
            >
              {randomSetPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {randomSetPlaying ? 'Dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={randomSetIndex >= randomSetSteps.length - 1}
              onClick={() => setRandomSetIndex((p) => Math.min(randomSetSteps.length - 1, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Bước {randomSetIndex + 1}/{randomSetSteps.length}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {[
                { label: '0.5x', speed: 1200 },
                { label: '1x', speed: 850 },
                { label: '2x', speed: 400 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setRandomSetSpeed(s.speed)}
                  className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    randomSetSpeed === s.speed
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
