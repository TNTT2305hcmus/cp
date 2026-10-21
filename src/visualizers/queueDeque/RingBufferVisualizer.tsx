import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../../components';

export interface RingBufferStep {
  buffer: (number | null)[];
  head: number;
  tail: number;
  count: number;
  action: 'INIT' | 'ENQUEUE' | 'DEQUEUE' | 'FULL';
  observation: string;
  decision: string;
  reason: string;
}

export const RingBufferVisualizer: React.FC = () => {
  const ringCap = 5;
  const [ringIndex, setRingIndex] = useState<number>(0);
  const [ringPlaying, setRingPlaying] = useState<boolean>(false);
  const [ringSpeed, setRingSpeed] = useState<number>(650);
  const ringTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ringSteps = useMemo<RingBufferStep[]>(() => {
    const steps: RingBufferStep[] = [];
    const buf: (number | null)[] = new Array(ringCap).fill(null);
    let head = 0;
    let tail = 0;
    let count = 0;

    steps.push({
      buffer: [...buf],
      head: 0,
      tail: 0,
      count: 0,
      action: 'INIT',
      observation: `Khởi tạo Ring Buffer cố định ${ringCap} ô. Head = 0, Tail = 0, Count = 0.`,
      decision: `Hàng đợi rỗng, sẵn sàng nhận các thao tác Enqueue/Dequeue.`,
      reason: `Mảng cố định với 2 con trỏ xoay vòng modulo loại bỏ hoàn toàn chi phí dời mảng O(N).`,
    });

    const operations = [
      { type: 'EN', val: 10 },
      { type: 'EN', val: 20 },
      { type: 'EN', val: 30 },
      { type: 'DE', val: 0 },
      { type: 'EN', val: 40 },
      { type: 'EN', val: 50 },
      { type: 'EN', val: 60 }, // Modulo xoay vòng về ô 0
      { type: 'DE', val: 0 },
    ];

    for (const op of operations) {
      if (op.type === 'EN') {
        if (count === ringCap) {
          steps.push({
            buffer: [...buf],
            head,
            tail,
            count,
            action: 'FULL',
            observation: `Thao tác Enqueue(${op.val}) nhưng Hàng đợi đã ĐẦY (Count = ${count}/${ringCap}).`,
            decision: `Từ chối thêm phần tử, trả về false.`,
            reason: `Buffer đạt giới hạn dung lượng cố định.`,
          });
        } else {
          buf[tail] = op.val;
          const prevTail = tail;
          tail = (tail + 1) % ringCap;
          count++;
          steps.push({
            buffer: [...buf],
            head,
            tail,
            count,
            action: 'ENQUEUE',
            observation: `Enqueue(${op.val}) vào ô [${prevTail}]. Tail xoay vòng sang (${prevTail} + 1) % ${ringCap} = ${tail}.`,
            decision: `Ghi giá trị ${op.val} và tăng Count lên ${count}.`,
            reason: `Thao tác thêm vào đuôi hàng đợi tốn O(1) tức thì.`,
          });
        }
      } else {
        if (count > 0) {
          const removedVal = buf[head];
          buf[head] = null;
          const prevHead = head;
          head = (head + 1) % ringCap;
          count--;
          steps.push({
            buffer: [...buf],
            head,
            tail,
            count,
            action: 'DEQUEUE',
            observation: `Dequeue() lấy phần tử ${removedVal} ở đầu (ô [${prevHead}]). Head xoay vòng sang (${prevHead} + 1) % ${ringCap} = ${head}.`,
            decision: `Xóa phần tử đầu hàng đợi và giảm Count xuống ${count}.`,
            reason: `Chỉ cần dịch con trỏ head, không cần dời các phần tử phía sau! Chi phí O(1).`,
          });
        }
      }
    }

    return steps;
  }, []);

  useEffect(() => {
    if (ringPlaying) {
      ringTimerRef.current = setInterval(() => {
        setRingIndex((prev) => {
          if (prev < ringSteps.length - 1) return prev + 1;
          setRingPlaying(false);
          return prev;
        });
      }, ringSpeed);
    } else if (ringTimerRef.current) {
      clearInterval(ringTimerRef.current);
    }
    return () => {
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    };
  }, [ringPlaying, ringSpeed, ringSteps.length]);

  const currRing = ringSteps[ringIndex] || ringSteps[0] || {
    buffer: [],
    head: 0,
    tail: 0,
    count: 0,
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };

  return (
    <Card className="border-teal-200 dark:border-teal-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-500 font-mono">
          Buffer kích thước cố định K = 5
        </span>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
          <button onClick={() => setRingSpeed(1100)} className={`px-2 py-0.5 rounded ${ringSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>0.5x</button>
          <button onClick={() => setRingSpeed(650)} className={`px-2 py-0.5 rounded ${ringSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setRingSpeed(350)} className={`px-2 py-0.5 rounded ${ringSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>2x</button>
        </div>
      </div>

      {/* Ring Visualizer */}
      <div className="py-6 flex flex-col items-center">
        {/* Stat badges */}
        <div className="flex items-center gap-6 mb-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Head (lấy ra):</span>
            <span className="font-bold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
              {currRing.head}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Tail (thêm vào):</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              {currRing.tail}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Số phần tử:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
              {currRing.count}/{ringCap}
            </span>
          </div>
        </div>

        {/* Buffer Slots */}
        <div className="flex items-center gap-2.5 overflow-x-auto p-2 max-w-full">
          {currRing.buffer.map((val, idx) => {
            const isHead = idx === currRing.head && currRing.count > 0;
            const isTail = idx === currRing.tail;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer marker */}
                <div className="h-5 flex items-center justify-center text-[10px] font-mono font-bold">
                  {isHead && <span className="text-teal-600 dark:text-teal-400 mr-1">HEAD</span>}
                  {isTail && <span className="text-indigo-600 dark:text-indigo-400">TAIL</span>}
                </div>

                {/* Cell */}
                <div
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-base transition-all ${
                    val !== null
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-800 dark:text-teal-200 shadow-xs'
                      : 'bg-slate-100/60 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {val !== null ? val : '∅'}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">ô {idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 dòng chuẩn */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
        <div><strong className="text-teal-600 dark:text-teal-400">Quan sát:</strong> {currRing.observation}</div>
        <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currRing.decision}</div>
        <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currRing.reason}</div>
      </div>

      {/* Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { setRingPlaying(false); setRingIndex(0); }}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setRingPlaying(false); setRingIndex((prev) => Math.max(0, prev - 1)); }}
            disabled={ringIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Lùi
          </Button>

          <Button
            variant={ringPlaying ? 'amber' : 'primary'}
            size="sm"
            onClick={() => setRingPlaying(!ringPlaying)}
            leftIcon={ringPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {ringPlaying ? 'Tạm dừng' : 'Chạy tự động'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setRingPlaying(false); setRingIndex((prev) => Math.min(ringSteps.length - 1, prev + 1)); }}
            disabled={ringIndex === ringSteps.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Tiếp
          </Button>
        </div>
      </div>
    </Card>
  );
};
