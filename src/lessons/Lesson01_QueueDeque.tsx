import React from 'react';
import { CodeViewer } from '../components';
import {
  LessonHeader,
  QuizSection,
  PracticeSection,
  NextLessonBanner,
} from '../components/lesson';
import type { LessonProps } from '../types/lesson';
import {
  queueDequeCodeTabs,
  queueDequeQuizQuestions,
  queueDequePracticeProblems,
} from '../data/lessons/lesson01_queueDeque.data';
import {
  RingBufferVisualizer,
  MonotonicDequeVisualizer,
} from '../visualizers/queueDeque';

export const Lesson01_QueueDeque: React.FC<LessonProps> = ({
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
        lessonId="1.3"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Hàng Đợi (Queue), Deque & Monotonic Deque"
        difficulty="Easy"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'FIFO O(1)',
          'Ring Buffer Modulo',
          'std::deque Memory Chunk',
          'Monotonic Deque',
          'Sliding Window Maximum',
        ]}
        description={
          <>
            Nắm vững cơ chế <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">FIFO (First In First Out)</code>,
            cài đặt Ring Buffer mảng cố định không phân mảnh bộ nhớ, và làm chủ cấu trúc
            Monotonic Deque giải quyết bài toán Sliding Window Maximum từ <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N × K)</code> về <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N)</code>.
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu & Vì Sao Vét Cạn Thất Bại
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán đỉnh cao <strong>LeetCode 239 (Sliding Window Maximum)</strong>: Cho một mảng số nguyên $N$ phần tử và một khung cửa sổ trượt có độ dài cố định $K$. Cửa sổ trượt từ trái sang phải mỗi bước 1 phần tử. Yêu cầu tìm giá trị lớn nhất trong cửa sổ tại mỗi bước dừng.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách vét cạn là tại mỗi vị trí của cửa sổ, ta duyệt qua toàn bộ $K$ phần tử để tìm phần tử lớn nhất. Tổng thời gian tốn khoảng <span className="font-mono font-bold text-rose-600 dark:text-rose-400">O(N × K)</span>. Khi đề bài cho <span className="font-mono font-bold">N = 10⁵, K = 5 × 10⁴</span>, số phép tính lên tới <span className="font-mono font-bold text-rose-600">5 × 10⁹</span> phép tính $\to$ chắc chắn <strong>Time Limit Exceeded (TLE)</strong>.
        </p>

        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20 text-xs sm:text-sm text-teal-900 dark:text-teal-200">
          <strong>Vấn đề của Priority Queue (Max-Heap):</strong> Dùng Heap có thể tìm max trong $O(\log K)$, nhưng khi cửa sổ trượt đi, việc xóa phần tử cũ đã hết hạn khỏi Heap rất phức tạp và tốn $O(K)$. Liệu có cấu trúc nào cho phép thêm ở đuôi và xóa ở cả hai đầu trong <code className="font-mono text-teal-600 font-bold">O(1)</code> không?
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Hàng Đợi Hai Đầu Đơn Điệu (Monotonic Deque)
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Hàng đợi <code className="font-mono">std::deque</code> (Double-Ended Queue) cho phép thêm và xóa phần tử ở cả hai đầu <code className="font-mono text-teal-600 font-bold">O(1)</code>. Trong <strong>Monotonic Deque</strong>, ta duy trì các chỉ số có giá trị giảm dần:
        </p>

        <ul className="list-disc list-inside space-y-1.5 text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300 pl-2">
          <li><strong>Đầu trước (Front):</strong> Luôn là chỉ số của phần tử lớn nhất trong cửa sổ hiện tại.</li>
          <li><strong>Khi cửa sổ trượt:</strong> Nếu <span className="font-mono font-bold">dq.front() &lt;= i - K</span>, phần tử ở đầu đã trượt ra ngoài cửa sổ, ta gọi <code className="font-mono text-rose-500 font-bold">dq.pop_front()</code>.</li>
          <li><strong>Khi thêm phần tử A[i]:</strong> Trước khi đưa $i$ vào đuôi, ta gọi <code className="font-mono text-amber-500 font-bold">dq.pop_back()</code> loại bỏ tất cả các phần tử nhỏ hơn hoặc bằng $A[i]$.</li>
        </ul>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-medium text-slate-900 dark:text-white">
          <strong>Quy tắc triệt tiêu:</strong> Bất kỳ phần tử nào vào sau mà lại lớn hơn phần tử vào trước, thì phần tử vào trước sẽ <em>không bao giờ</em> có cơ hội trở thành Max trong bất kỳ cửa sổ nào trong tương lai nữa, và phải bị loại bỏ ngay lập tức!
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC (2 MÔ HÌNH) */}
      <section className="mb-10 space-y-8">
        {/* MÔ HÌNH 1: RING BUFFER */}
        <div className="space-y-4">
          <div className="border-l-4 border-teal-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              3. Mô phỏng 1: Ring Buffer / Circular Queue (LeetCode 622)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Quan sát con trỏ Head và Tail xoay vòng theo công thức Modulo mảng cố định 5 ô.
            </p>
          </div>

          <RingBufferVisualizer />
        </div>

        {/* MÔ HÌNH 2: MONOTONIC DEQUE */}
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              4. Mô phỏng 2: Monotonic Deque (LeetCode 239 - Sliding Window Maximum)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Cửa sổ trượt kích thước K = 3, Deque 2 đầu tự động loại bỏ phần tử hết hạn và phần tử nhỏ hơn.
            </p>
          </div>

          <MonotonicDequeVisualizer />
        </div>
      </section>

      {/* 5. KHI NÀO DÙNG KỸ THUẬT NÀY */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Khi Nào Dùng Kỹ Thuật Này
        </h2>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-2.5">Dấu hiệu trong đề bài</th>
                <th className="p-2.5">Cấu trúc / Thuật toán</th>
                <th className="p-2.5">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Thứ tự xử lý vào trước ra trước FIFO, hàng đợi BFS</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">Queue (std::queue)</td>
                <td className="p-2.5 font-mono">O(1) push/pop</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Bộ đệm giới hạn dung lượng K, không được dời mảng</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Circular Queue (Ring Buffer)</td>
                <td className="p-2.5 font-mono">O(1) time, O(K) space cố định</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm Max/Min trong cửa sổ trượt độ dài K</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Monotonic Deque (2 đầu)</td>
                <td className="p-2.5 font-mono">O(N) toàn mảng</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Đoạn con ngắn nhất có tổng &gt;= K (có số âm)</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">Monotonic Deque + Prefix Sum (LeetCode 862)</td>
                <td className="p-2.5 font-mono">O(N)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">KHÔNG DÙNG KHI:</strong>
            Cần truy cập ngẫu nhiên liên tục ở giữa và tối ưu hóa bộ nhớ đệm CPU Cache $\to$ nên dùng <code className="font-mono font-bold">std::vector</code> vì các phần tử của vector nằm liên tục trên RAM, trong khi <code className="font-mono">std::deque</code> cấp phát theo từng khối (chunky blocks).
          </div>
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">DỄ NHẦM VỚI:</strong>
            Monotonic Stack. Monotonic Stack chỉ cho phép pop ở một đầu (đỉnh). Monotonic Deque bắt buộc phải pop ở <strong>cả hai đầu</strong>: đầu trước khi phần tử trượt ra ngoài cửa sổ, và đầu sau khi gặp phần tử mới lớn hơn.
          </div>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN */}
      <section className="mb-10 space-y-3">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          6. Tính Đúng Đắn (Bất Biến / Invariant)
        </h2>
        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Trong thuật toán Monotonic Deque:
        </p>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs sm:text-sm font-mono space-y-1">
          <div><span className="text-indigo-600 font-bold">Bất biến 1:</span> Với mọi chỉ số i nằm trong Deque, ta luôn có i ∈ [current_index - K + 1, current_index].</div>
          <div><span className="text-amber-600 font-bold">Bất biến 2:</span> Các phần tử trong Deque luôn có giá trị giảm dần nghiêm ngặt: nums[dq[0]] &gt; nums[dq[1]] &gt; ... &gt; nums[dq[m-1]].</div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Nhờ hai bất biến này, <code className="font-mono font-bold text-teal-600">nums[dq.front()]</code> luôn là phần tử lớn nhất hợp lệ trong cửa sổ trượt hiện tại mà không cần duyệt tìm kiếm.
        </p>
      </section>

      {/* 7. CÀI ĐẶT */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Thuật Toán Chuẩn Thi Đấu
        </h2>
        <CodeViewer tabs={queueDequeCodeTabs} defaultTabId="cpp" />
      </section>

      {/* 8. BẪY THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy Thường Gặp Khi Thi Đấu (Corner Cases)
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">
              1. Lưu giá trị thay vì lưu chỉ số (indices) vào Deque:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Lỗi phổ biến nhất của người mới học là lưu giá trị trực tiếp vào Deque. Khi đó bạn không thể kiểm tra được phần tử lớn nhất ở đầu đã hết hạn trượt ra khỏi cửa sổ hay chưa. Luôn lưu <code className="font-mono text-teal-600 font-bold">int index</code> vào Deque!
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">
              2. Bẫy số âm trong Circular Queue khi lùi con trỏ:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Trong bài Design Circular Deque, khi chèn vào đầu (insertFront), con trỏ lùi <code className="font-mono">front = (front - 1) % K</code>. Trong C++, <code className="font-mono">-1 % 5</code> cho kết quả là <code className="font-mono">-1</code> chứ không phải <code className="font-mono">4</code>! Bắt buộc phải cộng thêm dung lượng trước khi modulo: <code className="font-mono text-teal-600 font-bold">(front - 1 + K) % K</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
            <strong className="text-teal-700 dark:text-teal-300 block mb-1">
              3. Trường hợp biên K = 1:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Khi $K = 1$, mảng kết quả chính là bản sao của mảng ban đầu. Kiểm tra xem điều kiện <code className="font-mono">i &gt;= k - 1</code> có kích hoạt ngay từ phần tử đầu tiên $i = 0$ hay không.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH */}
      <QuizSection questions={queueDequeQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN */}
      <PracticeSection
        problems={queueDequePracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.4"
        nextLessonTitle="Hàng Đợi Ưu Tiên (Priority Queue) & Heap"
        nextLessonDescription="Cấu trúc Min-Heap, Max-Heap và duy trì Top-K phần tử trong luồng dữ liệu."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_QueueDeque;
