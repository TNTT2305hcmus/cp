import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export interface HashCollisionStep {
  scenario: 'UNIFORM' | 'ANTI_HASH';
  insertedKey: number;
  bucketIndex: number;
  buckets: number[][]; // 7 buckets containing keys
  action: 'INIT' | 'INSERT' | 'COLLISION' | 'LOOKUP_SLOW' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export const HashCollisionVisualizer: React.FC = () => {
  const [hashScenario, setHashScenario] = useState<'UNIFORM' | 'ANTI_HASH'>('ANTI_HASH');
  const [collisionIndex, setCollisionIndex] = useState<number>(0);
  const [collisionPlaying, setCollisionPlaying] = useState<boolean>(false);
  const [collisionSpeed, setCollisionSpeed] = useState<number>(800);
  const collisionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const numBuckets = 7;

  const collisionSteps = useMemo<HashCollisionStep[]>(() => {
    const steps: HashCollisionStep[] = [];
    const b: number[][] = Array.from({ length: numBuckets }, () => []);

    if (hashScenario === 'ANTI_HASH') {
      const evilKeys = [7, 14, 21, 28, 35, 42];

      steps.push({
        scenario: 'ANTI_HASH',
        insertedKey: 0,
        bucketIndex: -1,
        buckets: b.map((arr) => [...arr]),
        action: 'INIT',
        observation: `Mô phỏng Anti-Hash Test trên Codeforces với bảng gồm ${numBuckets} buckets. Hàm băm mặc định: h(x) = x % 7.`,
        decision: `Đối thủ khai thác lỗ hổng bằng cách nạp toàn bộ các số là bội số của 7: [7, 14, 21, 28, 35, 42].`,
        reason: `Mọi số đều có cùng số dư 0 khi chia cho 7 -> Dồn 100% vào Bucket 0!`,
      });

      for (const k of evilKeys) {
        const bucket = k % numBuckets;
        b[bucket].push(k);
        steps.push({
          scenario: 'ANTI_HASH',
          insertedKey: k,
          bucketIndex: bucket,
          buckets: b.map((arr) => [...arr]),
          action: 'COLLISION',
          observation: `Nạp key = ${k}. Hàm băm h(${k}) = ${k} % ${numBuckets} = ${bucket}. Bucket ${bucket} đã có ${b[bucket].length - 1} phần tử trước đó!`,
          decision: `Xảy ra va chạm (Collision). Thêm ${k} vào cuối danh sách liên kết tại Bucket ${bucket}.`,
          reason: `Độ dài chuỗi liên kết tại Bucket 0 tăng lên ${b[bucket].length}. Tra cứu một key bất kỳ phải duyệt qua toàn bộ chuỗi này -> mất O(N)!`,
        });
      }

      steps.push({
        scenario: 'ANTI_HASH',
        insertedKey: 42,
        bucketIndex: 0,
        buckets: b.map((arr) => [...arr]),
        action: 'LOOKUP_SLOW',
        observation: `Thực hiện truy vấn tìm kiếm key = 42.`,
        decision: `Bảng băm phải duyệt qua 7 -> 14 -> 21 -> 28 -> 35 -> 42 (tốn 6 phép so sánh thay vì 1 phép tính O(1))!`,
        reason: `Với N = 10⁵ phần tử, tổng thời gian bị thoái hóa thành O(N²) ≈ 5 × 10⁹ phép tính -> Time Limit Exceeded (TLE) chắc chắn!`,
      });
    } else {
      const goodKeys = [12, 25, 9, 31, 18, 44];
      steps.push({
        scenario: 'UNIFORM',
        insertedKey: 0,
        bucketIndex: -1,
        buckets: b.map((arr) => [...arr]),
        action: 'INIT',
        observation: `Sử dụng Custom Hash (splitmix64 + random seed theo thời gian). Các khóa được xáo trộn bit hoàn hảo.`,
        decision: `Nạp các số [12, 25, 9, 31, 18, 44] vào bảng ${numBuckets} buckets.`,
        reason: `Hacker không thể đoán trước seed ngẫu nhiên sinh ra lúc chạy chương trình.`,
      });

      for (const k of goodKeys) {
        const bucket = (k * 3 + 1) % numBuckets;
        b[bucket].push(k);
        steps.push({
          scenario: 'UNIFORM',
          insertedKey: k,
          bucketIndex: bucket,
          buckets: b.map((arr) => [...arr]),
          action: 'INSERT',
          observation: `Nạp key = ${k}. Băm ngẫu nhiên ánh xạ vào Bucket ${bucket}.`,
          decision: `Chèn ${k} vào Bucket ${bucket}.`,
          reason: `Các phần tử phân tán đều trên mọi buckets, mỗi bucket chỉ chứa tối đa 1-2 phần tử -> Tra cứu đạt O(1) hoàn hảo!`,
        });
      }

      steps.push({
        scenario: 'UNIFORM',
        insertedKey: 44,
        bucketIndex: (44 * 3 + 1) % numBuckets,
        buckets: b.map((arr) => [...arr]),
        action: 'DONE',
        observation: `Bảng băm cân bằng lý tưởng. Chiều dài danh sách liên kết tại mọi bucket đều xấp xỉ O(1).`,
        decision: `Thời gian trung bình luôn được bảo vệ ở ngưỡng O(1), miễn nhiễm 100% với hack test!`,
        reason: `Đây là lý do mọi Competitive Programmer bắt buộc dùng Custom Hash cho unordered_map trên Codeforces.`,
      });
    }

    return steps;
  }, [hashScenario]);

  useEffect(() => {
    setCollisionIndex(0);
    setCollisionPlaying(false);
  }, [hashScenario]);

  useEffect(() => {
    if (collisionPlaying) {
      collisionTimerRef.current = setInterval(() => {
        setCollisionIndex((prev) => {
          if (prev >= collisionSteps.length - 1) {
            setCollisionPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, collisionSpeed);
    } else if (collisionTimerRef.current) {
      clearInterval(collisionTimerRef.current);
    }
    return () => {
      if (collisionTimerRef.current) clearInterval(collisionTimerRef.current);
    };
  }, [collisionPlaying, collisionSteps.length, collisionSpeed]);

  const currCollision = collisionSteps[collisionIndex] || collisionSteps[0];

  return (
    <section className="mb-12">
      <h2 className="heading-section text-slate-900 dark:text-white">
        3. Mô Phỏng Tương Tác: Thảm Họa Va Chạm (Anti-Hash vs Custom Hash)
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        So sánh trực quan giữa việc bị dồn 100% va chạm vào một bucket đơn lẻ và sự phân tán hoàn hảo của Custom Hash:
      </p>

      {/* Scenario Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium">Chọn kịch bản:</span>
        <button
          type="button"
          onClick={() => setHashScenario('ANTI_HASH')}
          className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition cursor-pointer ${
            hashScenario === 'ANTI_HASH'
              ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
          }`}
        >
          Bị Tấn Công Anti-Hash (h(x) = x % 7)
        </button>
        <button
          type="button"
          onClick={() => setHashScenario('UNIFORM')}
          className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition cursor-pointer ${
            hashScenario === 'UNIFORM'
              ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
          }`}
        >
          Custom Hash An Toàn (splitmix64)
        </button>
      </div>

      {/* Visualizer Card */}
      <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Bảng Băm Gồm 7 Buckets
          </span>
          <Badge
            variant={currCollision.scenario === 'ANTI_HASH' ? 'hard' : 'teal'}
            size="xs"
          >
            {currCollision.scenario === 'ANTI_HASH' ? 'Nguy cơ TLE' : 'Tối ưu O(1)'}
          </Badge>
        </div>

        {/* Buckets display */}
        <div className="space-y-2 py-2">
          {currCollision.buckets.map((bucketItems, bIdx) => {
            const isTargetBucket = bIdx === currCollision.bucketIndex;
            return (
              <div
                key={bIdx}
                className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                  isTargetBucket
                    ? currCollision.scenario === 'ANTI_HASH'
                      ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-400'
                      : 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="w-20 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  Bucket [{bIdx}]:
                </div>

                <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] flex-1">
                  {bucketItems.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">Rỗng</span>
                  ) : (
                    bucketItems.map((val, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded font-mono text-xs font-bold flex items-center gap-1 shadow-2xs ${
                          val === currCollision.insertedKey
                            ? currCollision.scenario === 'ANTI_HASH'
                              ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                              : 'bg-teal-600 text-white ring-2 ring-teal-300'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {val}
                        {idx < bucketItems.length - 1 && <span className="text-slate-400 font-normal">→</span>}
                      </span>
                    ))
                  )}
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
            <span className="text-slate-800 dark:text-slate-200">{currCollision.observation}</span>
          </div>
          <div>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{currCollision.decision}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Hậu quả CP: </span>
            <span className="text-slate-600 dark:text-slate-400">{currCollision.reason}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCollisionIndex(0)}
              title="Đặt lại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={collisionIndex === 0}
              onClick={() => setCollisionIndex((p) => Math.max(0, p - 1))}
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCollisionPlaying(!collisionPlaying)}
            >
              {collisionPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {collisionPlaying ? 'Dừng' : 'Chạy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={collisionIndex >= collisionSteps.length - 1}
              onClick={() => setCollisionIndex((p) => Math.min(collisionSteps.length - 1, p + 1))}
              title="Bước tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Bước {collisionIndex + 1}/{collisionSteps.length}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {[
                { label: '0.5x', speed: 1200 },
                { label: '1x', speed: 800 },
                { label: '2x', speed: 400 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setCollisionSpeed(s.speed)}
                  className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                    collisionSpeed === s.speed
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
