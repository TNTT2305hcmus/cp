import React from 'react';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Badge, Button, Card } from '../components';
import { ROADMAP_MODULES } from '../data/roadmapData';

interface Month01OverviewProps {
  onSelectSubtopic?: (subtopicId: string) => void;
  completedTheories?: Record<string, boolean>;
  completedProblems?: Record<string, boolean>;
}

export const Month01_Overview: React.FC<Month01OverviewProps> = ({
  onSelectSubtopic,
  completedTheories = {},
  completedProblems = {},
}) => {
  const month1Module = ROADMAP_MODULES.find((m) => m.id === 1);
  const subtopics = month1Module?.subtopics.filter((s) => s.id !== '1.0') || [];

  // Tổng số lượng bài tập theo chuẩn PLANNING.md: 42 bài rèn luyện + 8 bài test = 50 bài
  const totalMonthProblems = 50;

  // Tính số bài tập đã giải thuộc Tháng 1
  const completedProblemKeys = Object.keys(completedProblems).filter((k) => {
    return completedProblems[k] && (k.startsWith('m1_') || !k.includes('_'));
  });
  const completedCount = completedProblemKeys.length;

  // Tính số bài học lý thuyết đã hoàn thành (1.1 -> 1.7)
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
          onClick={() => onSelectSubtopic?.('1.0')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline text-slate-700 dark:text-slate-300 font-semibold"
        >
          Tháng 1: Cấu Trúc Dữ Liệu Cơ Bản
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-teal-600 dark:text-teal-400 font-semibold">Tổng quan</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • Tổng quan
            </Badge>
            <Badge variant="medium" size="sm">
              Medium
            </Badge>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onSelectSubtopic?.('1.1')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Bắt đầu học 1.1
          </Button>
        </div>

        <h1 className="heading-hero font-bold text-slate-900 dark:text-white tracking-tight">
          Tổng quan
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Nền tảng sống còn của mọi lập trình viên thi đấu: từ làm chủ cơ chế bộ nhớ mảng động,
          ngăn xếp LIFO, hàng đợi FIFO, cho đến cấu trúc cây đỏ-đen tự cân bằng (BST), Min/Max Heap,
          kỹ thuật chống Anti-hash và nén bit song song.
        </p>

        {/* Highlight Stats Row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Cấu trúc dữ liệu</div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono">7 Chuyên đề</div>
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
            <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">O(1) - O(log N)</div>
          </div>
        </div>

        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề cốt lõi:</span>
          {[
            'Vector & Reallocation',
            'Stack LIFO & RPN',
            'Queue & Ring Buffer',
            'Min/Max Heap',
            'BST Set & Multiset',
            'Map & splitmix64',
            'Bitset 64x Speedup',
          ].map((topic, idx) => (
            <Badge key={idx} variant="slate" size="xs" className="font-mono">
              {topic}
            </Badge>
          ))}
        </div>
      </Card>

      {/* 3. TIẾN ĐỘ THÁNG 1 */}
      {(completedTheoryCount > 0 || completedCount > 0) && (
        <section className="mb-6 p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-300 mb-2">
            <span>
              Tiến độ học tập Tháng 1 của Trí Thanh
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

      {/* 4. BẢNG SO SÁNH HIỆU NĂNG STL C++ */}
      <section className="mb-8 space-y-3">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Bảng Tra Cứu Hiệu Năng STL C++
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Hiểu sâu bản chất cơ chế cấp phát bộ nhớ giúp tránh TLE do thao tác phân bổ lại (reallocation)
          hoặc va chạm băm (hash collision) trong thi đấu:
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-2.5">Cấu trúc STL</th>
                <th className="p-2.5">Truy Cập</th>
                <th className="p-2.5">Thêm / Xóa</th>
                <th className="p-2.5">Bộ Nhớ & Cache</th>
                <th className="p-2.5 text-amber-600 dark:text-amber-400">Bẫy CP Thường Gặp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::vector</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400">O(1) đuôi / O(N) giữa</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Liên tục, Cache Locality tối ưu</td>
                <td className="p-2.5 font-sans text-rose-600 dark:text-rose-400">Quên reserve(N) gây Reallocation x2</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::stack / queue</td>
                <td className="p-2.5 text-slate-500">O(1) đỉnh</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1) push / pop</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Wrapper trên std::deque/vector</td>
                <td className="p-2.5 font-sans text-rose-600 dark:text-rose-400">Gọi top()/front() khi rỗng gây crash</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::deque</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1) cả hai đầu</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Khối phân đoạn (Chunky)</td>
                <td className="p-2.5 font-sans text-amber-600 dark:text-amber-400">Truy cập ngẫu nhiên chậm hơn vector</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::priority_queue</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1) top</td>
                <td className="p-2.5 text-teal-600 dark:text-teal-400 font-semibold">O(log N) push/pop</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Binary Heap trên mảng liên tục</td>
                <td className="p-2.5 font-sans text-amber-600 dark:text-amber-400">Mặc định là Max-Heap; Min-Heap cần greater</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::set / map</td>
                <td className="p-2.5 text-teal-600 dark:text-teal-400">O(log N)</td>
                <td className="p-2.5 text-teal-600 dark:text-teal-400">O(log N)</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Cây đỏ-đen (Node pointers phân mảnh)</td>
                <td className="p-2.5 font-sans text-amber-600 dark:text-amber-400">Tốn 32–48 bytes/node; hằng số lớn hơn bảng băm</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::unordered_map</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1) TB</td>
                <td className="p-2.5 text-rose-500 font-bold">O(N) xấu nhất</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Bảng băm Bucket Chaining</td>
                <td className="p-2.5 font-sans text-rose-600 dark:text-rose-400 font-semibold">Anti-hash test trên Codeforces biến thành O(N²)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">std::bitset</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">O(1) / O(N/64)</td>
                <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Nén 64 bit vào 1 từ máy (Bitwise)</td>
                <td className="p-2.5 font-sans text-amber-600 dark:text-amber-400">Kích thước N phải cố định tại thời điểm compile</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. 7 CHUYÊN ĐỀ CỐT LÕI (NGẮN GỌN) */}
      <section className="mb-8 space-y-3">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7 Chuyên Đề Cốt Lõi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              1. Big-O, Vector & Sorting
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Quy tắc <code className="font-mono text-teal-600 dark:text-teal-400">10⁸</code> phép tính/giây. Chi phí khấu hao vector, <code className="font-mono">reserve(N)</code> và thuật toán IntroSort tùy biến.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              2. Ngăn Xếp (Stack)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nguyên lý LIFO, kiểm tra chuỗi ngoặc hợp lệ, biểu thức hậu tố RPN và Monotonic Stack tìm Next Greater Element.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              3. Hàng Đợi (Queue) & Deque
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nguyên lý FIFO, cơ chế Ring Buffer mảng cố định, và cấu trúc Monotonic Deque cho bài toán Sliding Window Maximum <code className="font-mono text-teal-600 dark:text-teal-400">O(N)</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              4. Heap (Priority Queue)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cây nhị phân hoàn chỉnh Min/Max Heap, duy trì Top-K phần tử trong luồng dữ liệu và kỹ thuật ghép cặp Dual-Heap tìm Median.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              5. Set & Multiset (BST)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cây đỏ-đen tự cân bằng, truy vấn tìm kiếm phần tử cận trên <code className="font-mono">lower_bound</code> và <code className="font-mono">upper_bound</code> trong <code className="font-mono text-teal-600 dark:text-teal-400">O(log N)</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              6. Map, Hash & splitmix64
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cơ chế bảng băm tra cứu bù số <code className="font-mono text-teal-600 dark:text-teal-400">O(1)</code>. Kỹ thuật Custom Hash với <code className="font-mono">splitmix64</code> hóa giải triệt để các bộ test Anti-hash.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] sm:col-span-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              7. Nén Bit Song Song (std::bitset)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tối ưu bộ nhớ 8 lần so với mảng boolean và tăng tốc độ xử lý các phép toán tập hợp (AND, OR, XOR) lên 64 lần nhờ lệnh xử lý từ máy 64-bit.
            </p>
          </div>
        </div>
      </section>

      {/* 6. DANH MỤC BÀI HỌC THÁNG 1 (BẤM ĐỂ HỌC) */}
      <section className="mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="heading-section text-slate-900 dark:text-white">
            Danh Mục Bài Học Tháng 1
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

      {/* 7. PHÂN BỔ 50 BÀI TẬP LEETCODE CHỌN LỌC */}
      <section className="mb-8 space-y-4">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Phân Bổ 50 Bài Tập LeetCode Chuẩn PLANNING.md
        </h2>

        <div className="space-y-3">
          {/* Nhóm 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                Nhóm 1: Cốt Lõi Bắt Buộc (13 bài)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ưu tiên số 1</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Các bài kinh điển rèn phản xạ STL: Two Sum (1), Valid Parentheses (20), Min Stack (155),
              Merge Sorted Array (88), Contains Duplicate (217), Queue using Stacks (232), Kth Largest (215, 703),
              Top K Frequent (347), Design HashSet/HashMap (705, 706), Largest Number (179).
            </p>
          </div>

          {/* Nhóm 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                Nhóm 2: Rèn Luyện Phản Xạ (19 bài)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ưu tiên số 2</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Biến thể thực chiến: Sort Colors (75 - 3 con trỏ DNF), Sort an Array (912), Max Consecutive Ones (485),
              Evaluate RPN (150), Simplify Path (71), Decode String (394), Daily Temperatures (739 - Monotonic Stack),
              Next Greater Element I & II (496, 503), Design Circular Queue & Deque (622, 641), Time-based KV Store (981).
            </p>
          </div>

          {/* Nhóm 3 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Nhóm 3: CP Twist & Thử Thách Hard (10 bài)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ưu tiên số 3</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Đỉnh cao giải thuật cấu trúc dữ liệu: Maximum Gap (164 - Bucket Sort), Largest Rectangle in Histogram (84),
              Maximal Rectangle (85), Sliding Window Maximum (239 - Monotonic Deque), Shortest Subarray with Sum at Least K (862),
              Find Median from Data Stream (295 - Dual Heap), Merge k Sorted Lists (23).
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
              <strong>Test 1:</strong> Vector, Sorting, Stack, Queue (485, 150, 622, 84).<br />
              <strong>Test 2:</strong> Hash Set, Heap, BST / Map (705, 215, 981, 295). Thang điểm chuẩn 18đ LeetCode Contest.
            </p>
          </div>
        </div>
      </section>

      {/* 8. CHUẨN ĐẦU RA THÁNG 1 (ROADMAP.md) */}
      <section className="mb-8 space-y-2.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Chuẩn Đầu Ra Tháng 1 (ROADMAP.md)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Bảo vệ bảng băm:</strong> Giải thích vì sao <code className="font-mono">unordered_map</code> có thể thoái hóa về <code className="font-mono text-rose-500 font-semibold">O(N)</code> và cách khắc phục triệt để bằng hàm băm ngẫu nhiên <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">splitmix64</code>.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Phản xạ chọn cấu trúc dữ liệu:</strong> Đọc một đề bài bất kỳ và chọn chính xác cấu trúc dữ liệu tối ưu trong vòng <strong>2 phút</strong>.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Kỷ luật bộ nhớ:</strong> Loại bỏ hoàn toàn lỗi truyền vector theo giá trị (<code className="font-mono">pass-by-value</code>) gây sao chép $O(N)$ bộ nhớ, luôn truyền bằng <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">const vector&lt;int&gt;&amp;</code>.
            </p>
          </div>
        </div>
      </section>

      {/* 9. 4 NGUYÊN TẮC CP SỐNG CÒN TRONG THÁNG 1 */}
      <section className="mb-8 space-y-2.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4 Bẫy Lỗi & Nguyên Tắc CP Sống Còn
        </h2>

        <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <strong>1. Luôn dùng vector::reserve(N):</strong> Nếu biết trước số lượng phần tử N, hãy gọi <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">v.reserve(N)</code>. Tránh thao tác nhân đôi dung lượng ngầm định khiến thời gian chạy tăng vọt và tốn bộ nhớ phân mảnh.
          </div>

          <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
            <strong>2. Bật Fast I/O ngay dòng đầu hàm main:</strong> Trong C++, thêm <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">cin.tie(nullptr)-&gt;sync_with_stdio(false);</code> để tốc độ đọc ghi nhanh gấp 5-10 lần, tránh bị TLE oan ở các bài có input lớn tới 10⁶ dòng.
          </div>

          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <strong>3. Chống Anti-Hash khi dùng unordered_map:</strong> Hàm băm mặc định của C++ trên số nguyên rất dễ bị test cố tình băm vào cùng một bucket, biến thời gian từ O(1) thành O(N²). Giải pháp: dùng hàm băm an toàn <code>splitmix64</code> kết hợp thời gian ngẫu nhiên.
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <strong>4. Đề phòng tràn Stack khi đệ quy sâu:</strong> Giới hạn stack của hệ thống thường chỉ từ 8MB đến 256MB. Với độ sâu đệ quy trên 10⁵, hãy chuyển sang vòng lặp với <code>std::vector</code> làm ngăn xếp để sử dụng bộ nhớ Heap.
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
            1.1 Big-O, Vector & Sorting (Mô phỏng bộ nhớ trực quan)
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSelectSubtopic?.('1.1')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Tiếp tục
        </Button>
      </div>

    </article>
  );
};
