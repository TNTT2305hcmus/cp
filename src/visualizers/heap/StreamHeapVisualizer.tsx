import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export interface StreamHeapStep {
  streamIndex: number;
  currentNum: number | null;
  heapSnapshot: number[]; // Min-Heap representation
  kthElement: number | null;
  action: 'INIT' | 'CONSIDER' | 'PUSH' | 'POP_PUSH' | 'IGNORE' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

const streamDatasets = [
  { label: 'Dãy 1: [4, 5, 8, 2, 3, 5, 10, 9, 4] (K = 3)', k: 3, stream: [4, 5, 8, 2, 3, 5, 10, 9, 4] },
  { label: 'Dãy 2: [12, 3, 17, 8, 30, 25] (K = 2)', k: 2, stream: [12, 3, 17, 8, 30, 25] },
  { label: 'Dãy 3: [7, 7, 7, 7, 8, 6] (K = 3)', k: 3, stream: [7, 7, 7, 7, 8, 6] },
];

export const StreamHeapVisualizer: React.FC = () => {
  const [selectedStreamIdx, setSelectedStreamIdx] = useState<number>(0);
  const [streamIndex, setStreamIndex] = useState<number>(0);
  const [streamPlaying, setStreamPlaying] = useState<boolean>(false);
  const [streamSpeed, setStreamSpeed] = useState<number>(750);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSelectStreamDataset = (idx: number) => {
    setSelectedStreamIdx(idx);
    setStreamIndex(0);
    setStreamPlaying(false);
  };

  const activeStreamConfig = streamDatasets[selectedStreamIdx];

  const streamSteps = useMemo<StreamHeapStep[]>(() => {
    const k = activeStreamConfig.k;
    const stream = activeStreamConfig.stream;
    const steps: StreamHeapStep[] = [];
    const heap: number[] = [];

    const siftUp = (h: number[], idx: number) => {
      let cur = idx;
      while (cur > 0) {
        const p = Math.floor((cur - 1) / 2);
        if (h[cur] < h[p]) {
          [h[cur], h[p]] = [h[p], h[cur]];
          cur = p;
        } else break;
      }
    };

    const siftDown = (h: number[], idx: number) => {
      let cur = idx;
      const len = h.length;
      while (2 * cur + 1 < len) {
        let left = 2 * cur + 1;
        let right = 2 * cur + 2;
        let smallest = cur;
        if (left < len && h[left] < h[smallest]) smallest = left;
        if (right < len && h[right] < h[smallest]) smallest = right;
        if (smallest !== cur) {
          [h[cur], h[smallest]] = [h[smallest], h[cur]];
          cur = smallest;
        } else break;
      }
    };

    steps.push({
      streamIndex: -1,
      currentNum: null,
      heapSnapshot: [],
      kthElement: null,
      action: 'INIT',
      observation: `Khởi tạo Min-Heap rỗng để duy trì Top ${k} phần tử lớn nhất từ luồng dữ liệu.`,
      decision: `Sẵn sàng nhận các phần tử từ luồng số.`,
      reason: `Min-Heap kích thước K luôn có đỉnh top() là phần tử nhỏ nhất trong top K, tức là phần tử lớn thứ K!`,
    });

    for (let i = 0; i < stream.length; i++) {
      const val = stream[i];
      if (heap.length < k) {
        heap.push(val);
        siftUp(heap, heap.length - 1);
        const topVal = heap.length === k ? heap[0] : null;
        steps.push({
          streamIndex: i,
          currentNum: val,
          heapSnapshot: [...heap],
          kthElement: topVal,
          action: 'PUSH',
          observation: `Phần tử mới val = ${val}. Kích thước heap hiện tại (${heap.length}) chưa vượt quá K = ${k}.`,
          decision: `Đẩy trực tiếp ${val} vào Heap và Sift-Up để bảo toàn tính chất Min-Heap.`,
          reason: `Khi Heap chưa đủ K phần tử, ta tích lũy đủ dung lượng trước khi bắt đầu so sánh.`,
        });
      } else {
        const currentMin = heap[0];
        if (val > currentMin) {
          heap[0] = val;
          siftDown(heap, 0);
          steps.push({
            streamIndex: i,
            currentNum: val,
            heapSnapshot: [...heap],
            kthElement: heap[0],
            action: 'POP_PUSH',
            observation: `Phần tử mới val = ${val} LỚN HƠN đỉnh heap hiện tại (${currentMin}).`,
            decision: `Loại bỏ đỉnh cũ ${currentMin}, thay bằng ${val} và Sift-Down để khôi phục Min-Heap.`,
            reason: `Giá trị ${val} xứng đáng lọt vào top ${k} phần tử lớn nhất. Đỉnh mới ${heap[0]} trở thành phần tử lớn thứ ${k}.`,
          });
        } else {
          steps.push({
            streamIndex: i,
            currentNum: val,
            heapSnapshot: [...heap],
            kthElement: heap[0],
            action: 'IGNORE',
            observation: `Phần tử mới val = ${val} NHỎ HƠN HOẶC BẰNG đỉnh heap hiện tại (${currentMin}).`,
            decision: `Bỏ qua ${val}, không thay đổi cấu trúc Heap.`,
            reason: `Đã có ít nhất ${k} phần tử lớn hơn hoặc bằng ${val} trong Heap, nên ${val} không thể thuộc Top ${k}.`,
          });
        }
      }
    }

    steps.push({
      streamIndex: stream.length,
      currentNum: null,
      heapSnapshot: [...heap],
      kthElement: heap[0],
      action: 'DONE',
      observation: `Đã xử lý trọn vẹn toàn bộ luồng số. Top ${k} phần tử lớn nhất là [${[...heap].sort((a,b)=>a-b).join(', ')}].`,
      decision: `Kết thúc mô phỏng. Phần tử lớn thứ ${k} hiện tại là ${heap[0]}.`,
      reason: `Độ phức tạp chỉ O(N log K) thời gian và O(K) bộ nhớ, tối ưu vượt trội so với Sort toàn bộ O(N log N).`,
    });

    return steps;
  }, [activeStreamConfig]);

  useEffect(() => {
    if (streamPlaying) {
      streamTimerRef.current = setInterval(() => {
        setStreamIndex((prev) => {
          if (prev >= streamSteps.length - 1) {
            setStreamPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, streamSpeed);
    } else if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [streamPlaying, streamSteps.length, streamSpeed]);

  const currStream = streamSteps[streamIndex] || streamSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        3. Mô Phỏng Tương Tác: Min-Heap Kích Thước K (Top-K Stream)
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Quan sát cách Min-Heap kích thước $K$ duy trì Top $K$ phần tử lớn nhất và tự động cập nhật phần tử lớn thứ $K$ tại đỉnh heap:
      </p>

      {/* Dataset selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium">Chọn bộ test:</span>
        {streamDatasets.map((d, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectStreamDataset(idx)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
              selectedStreamIdx === idx
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
        {/* Stream sequence */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Luồng Dữ Liệu Vào (Stream)
            </span>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
              K = {activeStreamConfig.k}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            {activeStreamConfig.stream.map((num, idx) => {
              const isCurrent = idx === currStream.streamIndex;
              const isProcessed = idx < currStream.streamIndex;
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded flex flex-col items-center justify-center font-mono text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-white font-bold scale-110 shadow-md ring-2 ring-amber-300 dark:ring-amber-700'
                      : isProcessed
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{num}</span>
                  <span className="text-[9px] opacity-75">#{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Min-Heap Container */}
        <div className="mb-5 p-4 rounded-xl border border-teal-200 dark:border-teal-900/70 bg-teal-50/30 dark:bg-teal-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Min-Heap (Kích thước tối đa K = {activeStreamConfig.k})
              </span>
              <Badge variant="teal" size="xs">
                {currStream.heapSnapshot.length}/{activeStreamConfig.k} ô
              </Badge>
            </div>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
              Đỉnh Heap (K-th Largest):{' '}
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                {currStream.kthElement !== null ? currStream.kthElement : 'Chưa đủ K'}
              </span>
            </div>
          </div>

          {/* Heap array boxes */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-3">
            {currStream.heapSnapshot.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-4">Heap hiện tại đang rỗng</div>
            ) : (
              currStream.heapSnapshot.map((val, idx) => {
                const isTop = idx === 0;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-[10px] font-mono text-slate-400 mb-1">
                      {isTop ? 'Đỉnh (top)' : `Node [${idx}]`}
                    </div>
                    <div
                      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-sm ${
                        isTop
                          ? 'bg-teal-600 text-white ring-4 ring-teal-200 dark:ring-teal-900 text-base scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-teal-300 dark:border-teal-700 text-sm'
                      }`}
                    >
                      <span>{val}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Binary Tree visual hint */}
          {currStream.heapSnapshot.length > 0 && (
            <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2 font-mono">
              Thứ tự mảng Heap: [{currStream.heapSnapshot.join(', ')}]
            </div>
          )}
        </div>

        {/* Step Explanation Card (aria-live) */}
        <div
          aria-live="polite"
          className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 mb-4"
        >
          <div>
            <span className="font-semibold text-slate-500 dark:text-slate-400">Quan sát: </span>
            <span className="text-slate-800 dark:text-slate-200">{currStream.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{currStream.decision}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 dark:text-slate-400">Lý do: </span>
            <span className="text-slate-600 dark:text-slate-400">{currStream.reason}</span>
          </div>
        </div>

        {/* Visualizer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStreamIndex(0)}
              title="Đặt lại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={streamIndex === 0}
              onClick={() => setStreamIndex((prev) => Math.max(0, prev - 1))}
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStreamPlaying(!streamPlaying)}
            >
              {streamPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {streamPlaying ? 'Tạm dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={streamIndex >= streamSteps.length - 1}
              onClick={() => setStreamIndex((prev) => Math.min(streamSteps.length - 1, prev + 1))}
              title="Bước tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">
              Bước {streamIndex + 1}/{streamSteps.length}
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
                  onClick={() => setStreamSpeed(s.speed)}
                  className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    streamSpeed === s.speed
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
