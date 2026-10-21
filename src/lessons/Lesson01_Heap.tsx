import React from 'react';
import {
  LessonHeader,
  QuizSection,
  PracticeSection,
  NextLessonBanner,
  CodeViewer,
} from '../components';
import type { LessonProps } from '../types/lesson';
import {
  heapCodeTabs,
  heapQuizQuestions,
  heapPracticeProblems,
} from '../data/lessons/lesson01_heap.data';
import { StreamHeapVisualizer } from '../visualizers/heap/StreamHeapVisualizer';
import { TwoHeapsVisualizer } from '../visualizers/heap/TwoHeapsVisualizer';

export const Lesson01_Heap: React.FC<LessonProps> = ({
  isTheoryCompleted = false,
  onToggleTheory,
  completedProblems = {},
  onToggleProblem,
  onSelectSubtopic,
}) => {
  return (
    <article className="max-w-[740px] mx-auto pb-24 text-slate-800 dark:text-slate-200">
      {/* 1. HEADER & BREADCRUMBS */}
      <LessonHeader
        lessonId="1.4"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Hàng Đợi Ưu Tiên (Priority Queue) & Cấu Trúc Heap"
        difficulty="Medium"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'Min-Heap & Max-Heap',
          'std::priority_queue',
          'Top-K Stream O(N log K)',
          'Two Heaps Find Median',
          'K-Way Merge',
        ]}
        description={
          <>
            Làm chủ cấu trúc <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">Binary Heap</code> cho phép truy xuất phần tử cực trị (Min/Max) trong <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(1)</code>, thêm/xóa trong <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(log N)</code>, và giải quyết bài toán Top-K cùng tìm Trung Vị (Median) trên luồng dữ liệu liên tục.
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu & Vì Sao Vét Cạn Thất Bại
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán kinh điển <strong>LeetCode 703 (Kth Largest Element in a Stream)</strong>: Một hệ thống nhận liên tục $M = 10^5$ số nguyên từ luồng dữ liệu. Sau mỗi lần nhận một số mới, hệ thống phải trả về giá trị của <strong>phần tử lớn thứ $K$</strong> trong toàn bộ các số đã thấy từ trước đến nay (với $K \le 10^4$).
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách vét cạn trực giác nhất: Mỗi khi nhận một số mới, ta đẩy số đó vào một mảng động và gọi hàm sắp xếp <span className="font-mono font-bold text-rose-600 dark:text-rose-400">std::sort</span>. Với $N$ số đang có trong mảng, chi phí mỗi lần là $O(N \log N)$. Khi thực hiện $M$ lần chèn, tổng số phép tính sẽ lên tới:
        </p>

        <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-mono">
          Tổng thời gian = ∑ (i log i) ≈ O(M × N log N) ≈ 10⁵ × 10⁵ × 17 ≈ 1.7 × 10¹¹ phép tính → TLE tuyệt đối (ngưỡng 10⁸/giây)!
        </div>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          <strong>Câu hỏi phản biện:</strong> Tại sao ta phải tốn công sắp xếp toàn bộ $N$ phần tử trong khi ta <em>chỉ cần biết phần tử lớn thứ K</em>? Liệu có cách nào chỉ duy trì đúng $K$ phần tử ứng viên sáng giá nhất, và phần tử nhỏ nhất trong nhóm $K$ ứng viên đó luôn nằm ngay tại đỉnh để lấy ra trong $O(1)$?
        </p>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Đảo Nghịch Tư Duy — Min-Heap Kích Thước K
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Nhiều bạn thường nghĩ: "Tìm phần tử <em>lớn</em> thứ K thì phải dùng <em>Max-Heap</em>". Đó là một cạm bẫy! Nếu dùng Max-Heap, bạn buộc phải chứa toàn bộ $N$ phần tử, mỗi lần muốn tìm phần tử thứ $K$ bạn phải pop ra $K-1$ lần rồi push ngược lại.
        </p>

        <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/30 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">
            Quy Tắc Vàng Của Huấn Luyện Viên CP:
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong>"Để duy trì K phần tử LỚN nhất, hãy dùng MIN-Heap kích thước K. Đỉnh của Min-Heap chính là kẻ yếu nhất trong nhóm mạnh nhất — tức là phần tử lớn thứ K!"</strong>
          </p>
        </div>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cơ chế hoạt động cực kỳ tao nhã:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li><strong>Giai đoạn 1 (Thu thập đủ K phần tử đầu tiên):</strong> Đẩy trực tiếp vào Min-Heap. Khi kích thước đạt $K$, phần tử nhỏ nhất trong nhóm này lập tức nằm tại <code className="font-mono text-teal-600">top()</code>.</li>
          <li><strong>Giai đoạn 2 (Duy trì luồng số tiếp theo):</strong> Với mỗi phần tử mới $x$:
            <ul className="list-circle pl-5 mt-1 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Nếu $x \le \text&#123;min\_heap.top()&#125;$: Chắc chắn $x$ không thể lọt vào Top $K$ phần tử lớn nhất $\to$ <strong>Bỏ qua ngay lập tức ($O(1)$)</strong>.</li>
              <li>Nếu $x &gt; \text&#123;min\_heap.top()&#125;$: Giá trị $x$ xứng đáng thuộc Top $K$. Ta loại bỏ kẻ yếu nhất hiện tại (<code className="font-mono">pop()</code>) và thêm $x$ vào (<code className="font-mono">push()</code>) $\to$ <strong>Chỉ tốn $O(\log K)$</strong>.</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 1: TOP-K STREAM */}
      <StreamHeapVisualizer />

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: TWO HEAPS FIND MEDIAN */}
      <TwoHeapsVisualizer />

      {/* 5. KHI NÀO DÙNG HEAP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Bảng Dấu Hiệu Đề Bài Nhận Diện Cấu Trúc Heap
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="p-3">Cụm từ xuất hiện trong đề bài</th>
                <th className="p-3">Mô hình Heap tối ưu</th>
                <th className="p-3">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans">"Kth largest element in a stream / array"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Min-Heap kích thước K</td>
                <td className="p-3">O(N log K) time, O(K) space</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"K closest points to origin"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Max-Heap kích thước K theo khoảng cách</td>
                <td className="p-3">O(N log K) time, O(K) space</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"Find median from continuous data stream"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Two Heaps (Max-Heap + Min-Heap)</td>
                <td className="p-3">O(log N) add, O(1) query</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"Merge K sorted lists / arrays"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Min-Heap đa luồng kích thước K</td>
                <td className="p-3">O(N log K)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <strong>Không nên dùng Heap khi:</strong> Bạn cần tìm kiếm một phần tử bất kỳ theo giá trị trong $O(\log N)$ hoặc duyệt các phần tử theo thứ tự tăng dần. Heap chỉ hỗ trợ xem phần tử cực trị tại gốc trong $O(1)$; thao tác tìm kiếm hay xóa một phần tử ngẫu nhiên ở giữa Heap mất $O(N)$. Với yêu cầu tra cứu ngẫu nhiên, hãy dùng <strong>std::set</strong> hoặc <strong>std::map</strong> (Bài 1.5 & 1.6).
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN (BẤT BIẾN) */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Chứng Minh Tính Đúng Đắn Của Min-Heap Duy Trì Top-K (Bất Biến Vòng Lặp)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>Định lý Bất Biến (Loop Invariant):</strong> Tại mọi thời điểm sau khi duyệt qua $i$ phần tử đầu tiên ($i \ge K$), Min-Heap luôn chứa đúng $K$ phần tử lớn nhất trong tập &#123;a_1, a_2, ..., a_i&#125;, và phần tử đỉnh <code className="font-mono">top()</code> chính là phần tử nhỏ nhất trong $K$ phần tử đó (tức phần tử lớn thứ $K$).
          </p>
          <p>
            <strong>1. Khởi tạo (Initialization):</strong> Khi $i = K$, ta nạp toàn bộ $K$ phần tử đầu vào Min-Heap. Hiển nhiên Heap chứa đúng $K$ phần tử đã thấy, và đỉnh là phần tử nhỏ nhất trong chúng. Bất biến đúng.
          </p>
          <p>
            <strong>2. Duy trì (Maintenance):</strong> Khi nhận phần tử mới $a_&#123;i+1&#125;$:
            Nếu $i &lt; K$, chèn trực tiếp làm tăng kích thước heap lên $i+1$, bất biến giữ nguyên.
            Nếu $i \ge K$, giả sử đỉnh heap hiện tại là $M =$ <code className="font-mono">top()</code>. Nếu $a_&#123;i+1&#125; \le M$, rõ ràng $a_&#123;i+1&#125;$ không thể lớn hơn bất kỳ ai trong top $K$ hiện tại $\to$ bỏ qua là đúng. Nếu $a_&#123;i+1&#125; &gt; M$, khi đó có ít nhất $K$ phần tử lớn hơn $M$ (gồm $K-1$ phần tử còn lại trong heap và $a_&#123;i+1&#125;$), do đó $M$ chắc chắn bị đẩy khỏi top $K$. Việc loại $M$ và nạp $a_&#123;i+1&#125;$ giữ cho tập hợp trong heap tiếp tục là $K$ phần tử lớn nhất.
          </p>
          <p>
            <strong>3. Kết thúc (Termination):</strong> Sau khi duyệt hết $N$ phần tử, Min-Heap chứa đúng $K$ phần tử lớn nhất. Vì là Min-Heap, phần tử tại đỉnh heap có giá trị nhỏ nhất trong tập hợp này, chính là phần tử lớn thứ $K$ chuẩn xác.
          </p>
        </div>
      </section>

      {/* 7. CÀI ĐẶT MẪU CHUẨN CP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={heapCodeTabs} />

        <div className="mt-4 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs sm:text-sm font-mono">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
            Template Khung Khởi Tạo Heap Trong C++20:
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {`// 1. Max-Heap (mặc định):
std::priority_queue<int> max_pq;

// 2. Min-Heap:
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;

// 3. Custom Comparator với Lambda:
auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) {
    return a.first > b.first; // Min-heap theo phần tử đầu
};
std::priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> custom_pq(cmp);`}
          </div>
        </div>
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy CP & Lỗi Thường Gặp Khi Dùng Heap
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 1: Gọi top() hoặc pop() trên Priority Queue rỗng.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Lỗi Runtime Error (SIGSEGV hoặc Segmentation Fault). Trong C++, `top()` trên heap rỗng là Undefined Behavior.
              <br />
              <em>Cách sửa:</em> Luôn bọc điều kiện <code className="font-mono text-teal-600">if (!pq.empty())</code> trước khi truy cập đỉnh hoặc xóa.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 2: Viết ngược logic Comparator trong C++ std::priority_queue.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Cần Min-Heap nhưng Heap lại trả ra giá trị lớn nhất trước.
              <br />
              <em>Nguyên nhân:</em> Trong hàm <code className="font-mono">std::sort</code>, comparator trả về <code className="font-mono">a &lt; b</code> sẽ sắp xếp tăng dần. Nhưng trong <code className="font-mono">std::priority_queue</code>, toán tử so sánh <code className="font-mono">less&lt;T&gt;</code> định nghĩa ai có độ ưu tiên thấp hơn (nằm sâu dưới đáy), do đó phần tử lớn nhất sẽ nằm trên đỉnh (Max-Heap)!
              <br />
              <em>Quy tắc:</em> Toán tử <code className="font-mono">greater&lt;T&gt;</code> (<code className="font-mono">a &gt; b</code>) tạo <strong>Min-Heap</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 3: Xây dựng Heap bằng cách push từng phần tử O(N log N) thay vì O(N).</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Tốn thời gian chạy ban đầu khi có sẵn $N$ số.
              <br />
              <em>Cách sửa:</em> Dùng constructor nhận 2 iterator: <code className="font-mono">priority_queue&lt;int&gt; pq(nums.begin(), nums.end());</code>. C++ sẽ tự động chạy thuật toán <strong>heapify</strong> trong $O(N)$.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH (QUIZ) */}
      <QuizSection questions={heapQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN (LEETCODE PRACTICE) */}
      <PracticeSection
        problems={heapPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.5"
        nextLessonTitle="BST (Set & Multiset)"
        nextLessonDescription="Cây đỏ-đen std::set, std::multiset và kỹ thuật tra cứu lower_bound / upper_bound trong O(log N)."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_Heap;
