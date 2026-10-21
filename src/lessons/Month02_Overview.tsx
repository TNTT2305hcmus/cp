import React from 'react';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Badge, Button, Card } from '../components';
import { ROADMAP_MODULES } from '../data/roadmapData';

interface Month02OverviewProps {
  onSelectSubtopic?: (subtopicId: string) => void;
  completedTheories?: Record<string, boolean>;
  completedProblems?: Record<string, boolean>;
}

export const Month02_Overview: React.FC<Month02OverviewProps> = ({
  onSelectSubtopic,
  completedTheories = {},
  completedProblems = {},
}) => {
  const month2Module = ROADMAP_MODULES.find((m) => m.id === 2);
  const subtopics = month2Module?.subtopics.filter((s) => s.id !== '2.0') || [];

  // Tổng số lượng bài tập theo chuẩn PLANNING.md: 50 bài rèn luyện + 8 bài test = 58 bài
  const totalMonthProblems = 58;

  // Tính số bài tập đã giải thuộc Tháng 2
  const completedProblemKeys = Object.keys(completedProblems).filter((k) => {
    return completedProblems[k] && (k.startsWith('m2_') || !k.includes('_'));
  });
  const completedCount = completedProblemKeys.length;

  // Tính số bài học lý thuyết đã hoàn thành (2.1 -> 2.9)
  const completedTheoryCount = subtopics.filter((s) => completedTheories[s.id]).length;
  const theoryProgressPct = Math.round((completedTheoryCount / Math.max(subtopics.length, 1)) * 100);

  return (
    <article className="max-w-[740px] mx-auto pb-24 text-slate-800 dark:text-slate-200">

      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
        <button
          type="button"
          onClick={() => onSelectSubtopic?.('home')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline"
        >
          Lộ trình CP
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          type="button"
          onClick={() => onSelectSubtopic?.('2.0')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline text-slate-700 dark:text-slate-300 font-semibold"
        >
          Tháng 2: Một Số Kỹ Thuật Căn Bản
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-teal-600 dark:text-teal-400 font-semibold">Tổng quan</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 2 • Tổng quan
            </Badge>
            <Badge variant="medium" size="sm">
              Medium
            </Badge>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onSelectSubtopic?.('2.1')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Tiếp tục
          </Button>
        </div>

        <h1 className="heading-hero font-bold text-slate-900 dark:text-white tracking-tight">
          Tổng quan
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Bước chuyển mình then chốt từ duyệt trâu <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N²)</code> sang
          thuật toán tối ưu <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">O(N)</code> và <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N log N)</code>.
          Làm chủ 9 kỹ thuật nền tảng cùng bộ 58 bài tập LeetCode chọn lọc.
        </p>

        {/* Highlight Stats Row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Kỹ thuật</div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono">9 Kỹ thuật</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Ngân hàng LeetCode</div>
            <div className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono">
              {completedCount > 0 ? `${completedCount}/${totalMonthProblems}` : `${totalMonthProblems} Bài`}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Bài Test 90'</div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">2 Đề (8 bài)</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Mục tiêu Big-O</div>
            <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">O(N) - O(N log N)</div>
          </div>
        </div>

        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'Hai con trỏ đối đầu',
            'Cửa sổ trượt linh hoạt',
            'Prefix Sum & Mảng hiệu',
            'Bit Trick: x & -x',
            'Sàng Eratosthenes & SPF',
            'Binary Search on Answer',
            'Ternary Search Unimodal',
            'Tham lam Exchange Argument',
          ].map((topic, idx) => (
            <Badge key={idx} variant="slate" size="xs" className="font-mono">
              {topic}
            </Badge>
          ))}
        </div>
      </Card>

      {/* 3. TIẾN ĐỘ THÁNG 2 */}
      {(completedTheoryCount > 0 || completedCount > 0) && (
        <section className="mb-6 p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-300 mb-2">
            <span>
              Tiến độ học tập Tháng 2 của Trí Thanh
            </span>
            <span className="font-mono">{theoryProgressPct}% lý thuyết</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 dark:bg-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${theoryProgressPct}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            <span>Hoàn thành: {completedTheoryCount}/{subtopics.length} bài học</span>
            <span>Đã làm: {completedCount}/{totalMonthProblems} bài LeetCode</span>
          </div>
        </section>
      )}

      {/* 4. ĐỘT PHÁ TƯ DUY BIG-O */}
      <section className="mb-8 space-y-3">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Đột Phá Big-O & Nhận Diện Mẫu Thuật Toán
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Khi <code className="font-mono text-slate-900 dark:text-slate-100 font-semibold">N = 10⁵</code>, thuật toán <code className="font-mono text-rose-600 dark:text-rose-400">O(N²)</code> đòi hỏi xấp xỉ <code className="font-mono font-bold">10¹⁰</code> phép tính và chắc chắn dính TLE. Dưới đây là cách Tháng 2 chuyển hóa bài toán:
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-2.5">Bài toán mẫu</th>
                <th className="p-2.5 text-rose-600 dark:text-rose-400">Vét Cạn (Brute-Force)</th>
                <th className="p-2.5 text-emerald-600 dark:text-emerald-400">Kỹ thuật Tháng 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm cặp số có tổng = Target (Mảng đã sort)</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">2 vòng for → O(N²)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Two Pointers đối đầu → O(N), O(1) Space</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Chuỗi con dài nhất không lặp ký tự</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">Duyệt mọi chuỗi con → O(N³)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Sliding Window co giãn → O(N)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Nhiều truy vấn tổng đoạn con [L, R]</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">Vòng for từng truy vấn → O(Q × N)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Prefix Sum mảng cộng dồn → O(1)/truy vấn</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Cộng giá trị lên nhiều đoạn con [L, R]</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">Vòng for từng truy vấn → O(Q × N)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Mảng hiệu (Difference Array) → O(1) cập nhật</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Phân tích thừa số nguyên tố nhiều số</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">Chia thử đến căn N → O(Q × √N)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Sàng nguyên tố nhỏ nhất (SPF) → O(log N)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm giá trị nhỏ nhất thỏa hàm đơn điệu P(x)</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">Dò tuần tự x từ 1 đến Max</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">BS on Answer → O(log(Max) × Check)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm cực trị hàm đơn phong (Unimodal)</td>
                <td className="p-2.5 text-rose-600 dark:text-rose-400">Dò vét cạn rời rạc → O(N)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Ternary Search chia 3 khoảng → O(log₃ N)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. 9 KỸ THUẬT TRỌNG TÂM */}
      <section className="mb-8 space-y-3">
        <h2 className="heading-section text-slate-900 dark:text-white">
          9 Kỹ Thuật Trọng Tâm
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              1. Kỹ Thuật Two Pointers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hai con trỏ đối đầu co dần (Two Sum II, Container With Water, 3Sum) và cùng chiều Fast & Slow (Remove Duplicates, Move Zeroes).
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              2. Cửa Sổ Trượt (Sliding Window)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Duy trì khung nhìn liên tục: Cửa sổ cố định độ dài K và cửa sổ co giãn linh hoạt kèm bảng đếm tần số ký tự.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              3. Prefix Sum & Mảng Hiệu
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mảng cộng dồn 1D/2D truy vấn tổng đoạn trong <code className="font-mono text-teal-600 dark:text-teal-400">O(1)</code>; Mảng hiệu cập nhật cộng đoạn [L, R] trong <code className="font-mono text-teal-600 dark:text-teal-400">O(1)</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              4. Xử Lý Bit (Bit Manipulation)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Thao tác phần cứng <code className="font-mono text-teal-600 dark:text-teal-400">O(1)</code>: bit thấp nhất <code className="font-mono">x & -x</code>, tắt bit 1 <code className="font-mono">x & (x - 1)</code>, khử trùng qua XOR và Bitmask tập con.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              5. Sàng Nguyên Tố & SPF
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sàng Eratosthenes chuẩn <code className="font-mono">O(N log log N)</code>, Sàng phân đoạn và Sàng SPF phân tích thừa số <code className="font-mono">O(log N)</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              6. Chặt Nhị Phân & BS On Answer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mẫu chuẩn tránh loop vô hạn. Nhận diện tính đơn điệu của hàm P(x) để chặt trên miền nghiệm Minimax.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              7. Chặt Tam Phân (Ternary Search)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chia 3 khoảng [L, m₁, m₂, R] để tìm cực trị hàm đơn phong (Unimodal) trên số nguyên hoặc số thực.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              8. Thuật Toán Tham Lam (Greedy)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Lựa chọn tối ưu cục bộ, kỹ thuật chứng minh Exchange Argument và bài toán phủ đoạn Interval Scheduling.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] sm:col-span-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              9. Đệ Quy & Chia Để Trị
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cây đệ quy, định lý Master Theorem xác định Big-O, thuật toán sắp xếp trộn Merge Sort và tìm kiếm Quick Select <code className="font-mono text-teal-600 dark:text-teal-400">O(N)</code>.
            </p>
          </div>
        </div>
      </section>

      {/* 6. DANH MỤC BÀI HỌC THÁNG 2 (BẤM ĐỂ HỌC) */}
      <section className="mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="heading-section text-slate-900 dark:text-white">
            Danh Mục Bài Học Tháng 2
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Bấm để vào bài</span>
        </div>

        <div className="space-y-2">
          {subtopics.map((sub) => {
            const isDone = !!completedTheories[sub.id];
            const diffVariant = sub.difficulty === 'Easy' ? 'easy' : sub.difficulty === 'Medium' ? 'medium' : 'hard';

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubtopic?.(sub.id)}
                className="group p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-teal-500/60 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-teal-500 shrink-0" />
                  )}
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition truncate">
                    {sub.title}
                  </span>
                  {sub.hasInteractiveLesson && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold shrink-0">
                      Demo
                    </span>
                  )}
                  <Badge variant={diffVariant} size="xs">
                    {sub.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    {sub.problemCount} bài
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PHÂN BỔ 58 BÀI TẬP LEETCODE CHỌN LỌC */}
      <section className="mb-8 space-y-4">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Phân Bổ 58 Bài Tập LeetCode Chuẩn PLANNING.md
        </h2>

        <div className="space-y-3">
          {/* Nhóm 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                Nhóm 1: Cốt Lõi Bắt Buộc (10 bài)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ưu tiên số 1</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Các bài mẫu mực phải thuần thục: Two Sum II (167), Container With Most Water (11), 3Sum (15),
              Valid Palindrome (125), Longest Substring Without Repeating (3), Binary Search (704),
              Koko Eating Bananas (875), Range Sum Query (303), Count Primes (204), Number of 1 Bits (191).
            </p>
          </div>

          {/* Nhóm 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                Nhóm 2: Rèn Luyện Phản Xạ (26 bài)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ưu tiên số 2</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nhận diện mẫu trong 2 phút: Trapping Rain Water (42), Minimum Size Subarray Sum (209),
              Longest Repeating Character Replacement (424), Find All Anagrams (438), Permutation in String (567),
              Subarray Sum Equals K (560), Car Pooling (1094), Single Number II & III (137, 260), Search in Rotated Array (33), Capacity To Ship (1011).
            </p>
          </div>

          {/* Nhóm 3 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Nhóm 3: CP Twist & Thử Thách Hard (14 bài)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ưu tiên số 3</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Các bài kết hợp độ khó cao: Minimum Window Substring (76), Substring with Concatenation (30),
              Median of Two Sorted Arrays (4), Split Array Largest Sum (410), Find Kth Smallest Pair Distance (719),
              The Skyline Problem (218), Nth Magical Number (878), Ugly Number III (1201).
            </p>
          </div>

          {/* 2 Bài Test */}
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                2 Đề Kiểm Tra Định Kỳ (8 bài • 90 phút/test)
              </span>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">Bấm giờ contest</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Test 1:</strong> Bit, Two Pointers, Sliding Window, Prefix Sum.<br />
              <strong>Test 2:</strong> Sàng nguyên tố, BS on Answer, Ternary Search, Tham lam. Cấu trúc chuẩn 1 Easy, 2 Medium, 1 Hard (tối đa 18đ).
            </p>
          </div>
        </div>
      </section>

      {/* 8. CHUẨN ĐẦU RA THÁNG 2 (ROADMAP.md) */}
      <section className="mb-8 space-y-2.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Chuẩn Đầu Ra Tháng 2 (ROADMAP.md)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Phản xạ phân tích ràng buộc (Constraint-First):</strong> Nhìn giới hạn $N$ của đề bài và suy ngược chính xác độ phức tạp cần đạt ($N \le 10^5 \to O(N \log N)$, $N \le 10^7 \to O(N)$) trước khi gõ bất kỳ dòng code nào.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Viết Chặt Nhị Phân chuẩn 100%:</strong> Không bao giờ dính vòng lặp vô tận (Infinite Loop), thành thạo cả 2 kỹ thuật chặn cận trái (<code className="font-mono">left = mid</code>) và chặn cận phải (<code className="font-mono">right = mid</code>).
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Tốc độ thi đấu:</strong> Giải thành công ít nhất <strong>70% bài Nhóm 2 (Rèn luyện phản xạ)</strong> trong vòng <strong>25 phút mỗi bài</strong> mà không cần xem gợi ý.
            </p>
          </div>
        </div>
      </section>

      {/* 9. 4 LƯU Ý & BẪY TỬ THẦN CP TRONG THÁNG 2 */}
      <section className="mb-8 space-y-2.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4 Bẫy Lỗi & Nguyên Tắc CP Sống Còn
        </h2>

        <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <strong>1. Bẫy tràn số (Integer Overflow):</strong> Trong Prefix Sum hoặc tổng 4 số trong 4Sum, tổng các phần tử dễ dàng vượt quá $2 \times 10^9$ (ngưỡng của int 32-bit). Luôn chủ động khai báo mảng tiền tố dạng <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">long long</code> hoặc ép kiểu <code className="font-mono">1LL * a * b</code>.
          </div>

          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <strong>2. Bẫy lặp vô hạn trong Binary Search:</strong> Khi cập nhật <code className="font-mono">left = mid</code>, luôn làm tròn lên <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">mid = left + (right - left + 1) / 2</code> để tránh đứng yên khi <code className="font-mono">right - left == 1</code>.
          </div>

          <div className="p-3 rounded-lg border border-sky-200 dark:border-sky-900/40 bg-sky-50/40 dark:bg-sky-950/20">
            <strong>3. Bẫy sai số thực trong Chặt Nhị Phân / Tam Phân:</strong> Trên miền số thực, thay vì điều kiện dừng <code className="font-mono">right - left &gt; 1e-7</code> dễ bị lỗi làm tròn IEEE 754, hãy chạy vòng lặp cố định <strong>60 đến 100 lần</strong> (<code className="font-mono">for (int iter = 0; iter &lt; 80; ++iter)</code>) để đạt độ chính xác tuyệt đối.
          </div>

          <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
            <strong>4. Quy tắc Stuck Checklist 15 phút:</strong> Nếu bí ý tưởng quá 15–20 phút, hãy gấp máy tính và vẽ test nhỏ (3–5 phần tử) ra giấy nháp, nén biên, nghĩ ngược từ kết quả trước khi mở Hint 1. Tuyệt đối không copy code giải ngay lập tức.
          </div>
        </div>
      </section>

      {/* 10. ACTION FOOTER */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Bắt đầu bài học đầu tiên
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            2.1 Kỹ thuật Hai con trỏ (Two Pointers) có mô phỏng trực quan
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSelectSubtopic?.('2.1')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Tiếp tục
        </Button>
      </div>

    </article>
  );
};
