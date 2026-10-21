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
  stackCodeTabs,
  stackQuizQuestions,
  stackPracticeProblems,
} from '../data/lessons/lesson01_stack.data';
import {
  ParenthesesStackVisualizer,
  MonotonicStackVisualizer,
} from '../visualizers/stack';

export const Lesson01_Stack: React.FC<LessonProps> = ({
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
        lessonId="1.2"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Ngăn Xếp (Stack) & Kỹ Thuật Monotonic Stack"
        difficulty="Easy"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'LIFO O(1)',
          'Fixed Array Stack',
          'Valid Parentheses',
          'RPN Calculator',
          'Min Stack O(1)',
          'Monotonic Stack',
        ]}
        description={
          <>
            Nắm vững cơ chế <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">LIFO (Last In First Out)</code> với chi phí push/pop <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</code>,
            kiểm tra dãy ngoặc hợp lệ, tính biểu thức hậu tố RPN, và đột phá tư duy Monotonic Stack
            giảm độ phức tạp từ <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N²)</code> về <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N)</code>.
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu & Vì Sao Vét Cạn Thất Bại
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán <strong>LeetCode 739 (Daily Temperatures)</strong>: Cho mảng nhiệt độ hàng ngày của $N$ ngày. Với mỗi ngày, hãy tìm xem cần chờ bao nhiêu ngày nữa để gặp một ngày ấm hơn. Nếu trong tương lai không có ngày nào ấm hơn, kết quả là 0.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách tiếp cận ngây thơ là dùng hai vòng lặp lồng nhau: với mỗi ngày $i$, chạy vòng lặp tìm ngày $j &gt; i$ đầu tiên có $T[j] &gt; T[i]$. Thuật toán vét cạn này đòi hỏi khoảng <span className="font-mono font-bold text-rose-600 dark:text-rose-400">N × (N - 1) / 2 ≈ O(N²)</span> phép tính so sánh. Khi đề bài cho <span className="font-mono font-bold">N = 10⁵</span>, số phép tính lên tới <span className="font-mono font-bold text-rose-600">5 × 10⁹</span> phép tính, chắc chắn sẽ dính <strong>Time Limit Exceeded (TLE)</strong> trên hệ thống LeetCode.
        </p>

        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20 text-xs sm:text-sm text-teal-900 dark:text-teal-200">
          <strong>Quan sát mấu chốt:</strong> Khi một ngày có nhiệt độ cao xuất hiện, nó có thể đóng vai trò là "ngày ấm hơn đầu tiên" cho <strong>rất nhiều ngày lạnh hơn trước đó</strong>. Làm sao ta có thể lưu trữ các ngày trong quá khứ theo thứ tự và giải quyết hàng loạt chúng chỉ trong một bước?
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Ngăn Xếp Đơn Điệu (Monotonic Stack)
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Ngăn xếp (Stack) hoạt động theo nguyên lý <strong>LIFO (Last-In, First-Out)</strong>: phần tử vào sau cùng sẽ được lấy ra đầu tiên. Trong kỹ thuật <strong>Monotonic Stack (Ngăn xếp đơn điệu)</strong>, ta duy trì các phần tử trong Stack theo thứ tự giảm dần nghiêm ngặt:
        </p>

        <ul className="list-disc list-inside space-y-1.5 text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300 pl-2">
          <li>Ta duyệt mảng từ trái sang phải. Stack lưu <strong>chỉ số (indices)</strong> của các ngày chưa tìm thấy ngày ấm hơn.</li>
          <li>Khi xét ngày hiện tại i có nhiệt độ T[i]: chừng nào Stack còn phần tử và <code className="font-mono">T[i] &gt; T[st.top()]</code>, ta lấy ngày ở đỉnh ra và ghi nhận kết quả cho ngày đó là <span className="font-mono font-bold text-teal-600">i - st.top()</span>.</li>
          <li>Sau khi loại hết các ngày lạnh hơn, ta push chỉ số $i$ vào Stack để chờ các ngày tương lai ấm hơn nó.</li>
        </ul>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-medium text-slate-900 dark:text-white">
          <strong>Quy tắc bất biến:</strong> Mỗi phần tử chỉ được push vào Stack đúng 1 lần và pop ra tối đa 1 lần. Do đó, tổng số phép tính trong toàn bộ thuật toán luôn là <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">O(N)</code> dù bên trong có vòng lặp while.
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC (2 MÔ HÌNH) */}
      <section className="mb-10 space-y-8">
        {/* MÔ HÌNH 1: DÃY NGOẶC HỢP LỆ (LEETCODE 20) */}
        <div className="space-y-4">
          <div className="border-l-4 border-teal-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              3. Mô phỏng 1: Kiểm Tra Dãy Ngoặc Hợp Lệ (LeetCode 20)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Quan sát cơ chế Push ngoặc mở và Pop khi gặp ngoặc đóng tương ứng theo nguyên lý LIFO.
            </p>
          </div>

          <ParenthesesStackVisualizer />
        </div>

        {/* MÔ HÌNH 2: MONOTONIC STACK */}
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              4. Mô phỏng 2: Monotonic Stack (LeetCode 739 - Daily Temperatures)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Duy trì stack chỉ số theo nhiệt độ giảm dần. Pop và ghi nhận kết quả khi gặp ngày ấm hơn.
            </p>
          </div>

          <MonotonicStackVisualizer />
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
                <th className="p-2.5">Kỹ thuật ứng dụng</th>
                <th className="p-2.5">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Cấu trúc ngoặc lồng nhau, HTML tags, Undo/Redo</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">Stack LIFO</td>
                <td className="p-2.5 font-mono">O(N) time, O(N) space</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm phần tử lớn hơn / nhỏ hơn gần nhất bên phải</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Monotonic Stack (Giảm dần)</td>
                <td className="p-2.5 font-mono">Amortized O(N)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tính biểu thức số học hậu tố hoặc tiền tố</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">RPN Stack Calculator</td>
                <td className="p-2.5 font-mono">O(N)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Diện tích hình chữ nhật lớn nhất trong biểu đồ cột</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Monotonic Stack tăng dần (LeetCode 84)</td>
                <td className="p-2.5 font-mono">O(N)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">KHÔNG DÙNG KHI:</strong>
            Cần truy xuất phần tử theo cơ chế vào trước ra trước FIFO (hàng đợi ngân hàng, duyệt BFS) $\to$ bắt buộc dùng <code className="font-mono font-bold">std::queue</code>.
          </div>
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">DỄ NHẦM VỚI:</strong>
            Monotonic Deque trong Sliding Window Maximum. Monotonic Deque cần loại bỏ phần tử ở cả <strong>hai đầu</strong> (đầu trước vì trượt ra ngoài cửa sổ, đầu sau vì nhỏ hơn giá trị mới).
          </div>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN */}
      <section className="mb-10 space-y-3">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Tính Đúng Đắn (Bất Biến / Invariant)
        </h2>
        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Trong Monotonic Stack giảm dần, tính đơn điệu được bảo toàn:
        </p>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs sm:text-sm font-mono space-y-1">
          <div><span className="text-indigo-600 font-bold">Bất biến:</span> Với mọi i &lt; j trong Stack, ta luôn có Temperatures[st[i]] &gt;= Temperatures[st[j]].</div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Khi một phần tử T[k] xuất hiện mà lớn hơn <code className="font-mono">T[st.top()]</code>, vì các phần tử trong Stack sắp xếp giảm dần từ đáy lên, T[k] chắc chắn là <strong>phần tử lớn hơn đầu tiên</strong> của <code className="font-mono">T[st.top()]</code>. Sau khi pop các phần tử nhỏ hơn, việc push k vào phục hồi lại tính chất giảm dần của Stack.
        </p>
      </section>

      {/* 7. CÀI ĐẶT */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Thuật Toán Chuẩn Thi Đấu
        </h2>
        <CodeViewer tabs={stackCodeTabs} defaultTabId="cpp" />
      </section>

      {/* 8. BẪY THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy Thường Gặp Khi Thi Đấu (Corner Cases)
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">
              1. Gọi st.top() hoặc st.pop() trên Stack rỗng:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Đây là nguyên nhân gây lỗi Runtime Error (SIGSEGV) phổ biến nhất ở các bài Easy. Luôn luôn đặt điều kiện <code className="font-mono text-teal-600 dark:text-teal-400 font-bold">!st.empty()</code> trước khi truy cập đỉnh hoặc pop: <code className="font-mono">while (!st.empty() &amp;&amp; ...)</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">
              2. Quên kiểm tra Stack rỗng khi kết thúc duyệt chuỗi ngoặc:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Với chuỗi như <code className="font-mono">"((("</code>, vòng lặp không bao giờ báo lỗi nhưng chuỗi vẫn không hợp lệ vì ngoặc mở chưa được đóng. Dòng return cuối cùng bắt buộc phải là <code className="font-mono text-teal-600 font-bold">return st.empty();</code> chứ không phải <code className="font-mono">return true;</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
            <strong className="text-teal-700 dark:text-teal-300 block mb-1">
              3. Phân biệt phần tử trùng lặp (&gt; vs &gt;=):
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Trong Monotonic Stack, nếu đề bài yêu cầu "lớn hơn nghiêm ngặt" (Strictly Greater), điều kiện pop là <code className="font-mono">T[i] &gt; T[st.top()]</code>. Nếu yêu cầu "lớn hơn hoặc bằng", điều kiện là <code className="font-mono">T[i] &gt;= T[st.top()]</code>. Nhầm lẫn dấu so sánh sẽ dẫn đến Wrong Answer ở test case có các phần tử trùng lặp.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH */}
      <QuizSection questions={stackQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN */}
      <PracticeSection
        problems={stackPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.3"
        nextLessonTitle="Hàng Đợi (Queue) & Deque"
        nextLessonDescription="Nguyên lý FIFO, cấu trúc Ring Buffer và Monotonic Deque cho Sliding Window Maximum."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_Stack;
