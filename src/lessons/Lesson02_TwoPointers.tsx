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
  twoPointersCodeTabs,
  twoPointersQuizQuestions,
  twoPointersPracticeProblems,
} from '../data/lessons/lesson02_twoPointers.data';
import {
  OppositePointersVisualizer,
  FastSlowPointersVisualizer,
} from '../visualizers/twoPointers';

export const Lesson02_TwoPointers: React.FC<LessonProps> = ({
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
        lessonId="2.1"
        monthNumber={2}
        monthTitle="Một Số Kỹ Thuật Căn Bản"
        title="Kỹ Thuật Hai Con Trỏ (Two Pointers)"
        difficulty="Medium"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'Hai con trỏ đối đầu',
          'Fast & Slow Pointers',
          'Two Sum II',
          'Container With Most Water',
          '3Sum Dup Skipping',
          'In-place Modification',
        ]}
        description={
          <>
            Bản chất triệt tiêu không gian tìm kiếm dựa trên tính đơn điệu, tối ưu độ phức tạp từ <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N²)</code> về <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N)</code> và không gian <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</code>.
            Làm chủ 2 mô hình kinh điển: Đối đầu co dần và Cùng chiều (Fast & Slow).
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu & Vì Sao Vét Cạn Thất Bại
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán kinh điển <strong>LeetCode 167 (Two Sum II)</strong>: Cho một mảng các số nguyên đã được sắp xếp tăng dần, hãy tìm hai số có tổng đúng bằng một giá trị Target cho trước.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách vét cạn là dùng hai vòng lặp lồng nhau duyệt qua mọi cặp chỉ số $(i, j)$ với $i &lt; j$. Số cặp cần kiểm tra là <span className="font-mono font-bold">N × (N - 1) / 2</span>, tương đương độ phức tạp <span className="font-mono font-bold text-rose-600 dark:text-rose-400">O(N²)</span>. Khi <span className="font-mono font-bold">N = 10⁵</span>, số phép tính lên tới <span className="font-mono font-bold text-rose-600">5 × 10⁹</span> phép tính, chắc chắn vượt quá ngưỡng $10^8$ phép tính/giây và dính <strong>Time Limit Exceeded (TLE)</strong>.
        </p>

        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20 text-xs sm:text-sm text-teal-900 dark:text-teal-200">
          <strong>Thông tin mà vét cạn bỏ quên:</strong> Mảng đã được sắp xếp tăng dần! Nếu tổng của phần tử nhỏ nhất và phần tử lớn nhất hiện tại vẫn nhỏ hơn Target, liệu ta có cần thử ghép phần tử nhỏ nhất đó với bất kỳ số nào khác ở giữa không? Chắc chắn không!
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Triệt Tiêu Không Gian Tìm Kiếm
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Thay vì thử mọi cặp, ta đặt một con trỏ <span className="font-mono font-bold text-sky-600">Left = 0</span> ở đầu mảng và một con trỏ <span className="font-mono font-bold text-amber-600">Right = N - 1</span> ở cuối mảng:
        </p>

        <ul className="list-disc list-inside space-y-1.5 text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300 pl-2">
          <li>Nếu <span className="font-mono font-bold">A[Left] + A[Right] == Target</span>: Đã tìm thấy cặp nghiệm hợp lệ.</li>
          <li>Nếu <span className="font-mono font-bold">A[Left] + A[Right] &lt; Target</span>: Tổng đang nhỏ hơn mục tiêu. Vì mảng tăng dần, ghép A[Left] với bất kỳ số nào trước Right cũng đều nhỏ hơn tổng hiện tại. Do đó loại bỏ A[Left] bằng cách tăng <span className="font-mono font-bold text-sky-600">Left++</span>.</li>
          <li>Nếu <span className="font-mono font-bold">A[Left] + A[Right] &gt; Target</span>: Tổng đang lớn hơn mục tiêu. Ghép A[Right] với bất kỳ số nào sau Left cũng đều lớn hơn tổng hiện tại. Do đó loại bỏ A[Right] bằng cách giảm <span className="font-mono font-bold text-amber-600">Right--</span>.</li>
        </ul>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-medium text-slate-900 dark:text-white">
          <strong>Quy tắc bất biến:</strong> Mỗi bước di chuyển con trỏ loại bỏ vĩnh viễn ít nhất một hàng hoặc một cột trong ma trận cặp $(i, j)$ mà không thể chứa đáp án. Không gian tìm kiếm thu hẹp từ $N$ xuống 0 sau đúng $N$ bước!
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC (2 MÔ HÌNH) */}
      <section className="mb-10 space-y-8">
        {/* MÔ HÌNH 1: ĐỐI ĐẦU CO DẦN */}
        <div className="space-y-4">
          <div className="border-l-4 border-sky-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              3. Mô phỏng 1: Hai Con Trỏ Đối Đầu Co Dần (Two Sum II)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Quan sát con trỏ Left và Right co dần vào giữa để tìm cặp số có tổng bằng Target.
            </p>
          </div>

          <OppositePointersVisualizer />
        </div>

        {/* MÔ HÌNH 2: FAST & SLOW */}
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              4. Mô phỏng 2: Hai Con Trỏ Cùng Chiều Fast & Slow (LeetCode 26)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Xóa các phần tử trùng lặp in-place: con trỏ Slow ghi nhận giá trị duy nhất, Fast thám thính phía trước.
            </p>
          </div>

          <FastSlowPointersVisualizer />
        </div>
      </section>

      {/* 5. KHI NÀO DÙNG KỸ THUẬT NÀY */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          5. Khi Nào Dùng Kỹ Thuật Này
        </h2>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-2.5">Đặc điểm / Yêu cầu đề bài</th>
                <th className="p-2.5">Mô hình Two Pointers</th>
                <th className="p-2.5">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm cặp số có tổng bằng Target trên mảng đã sắp xếp</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">Hai con trỏ đối đầu (Opposite Direction)</td>
                <td className="p-2.5 font-mono">O(N) time, O(1) space</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Lọc phần tử, xóa trùng lặp in-place không cấp phát mảng phụ</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Fast & Slow Pointers cùng chiều</td>
                <td className="p-2.5 font-mono">O(N) time, O(1) space</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Chứa nhiều nước nhất (Container With Most Water)</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">Đối đầu loại trừ biên thấp hơn</td>
                <td className="p-2.5 font-mono">O(N) time, O(1) space</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Kiểm tra chuỗi đối xứng (Palindrome)</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">Đối đầu so sánh hai đầu</td>
                <td className="p-2.5 font-mono">O(N) time, O(1) space</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">KHÔNG DÙNG KHI:</strong>
            Mảng chưa được sắp xếp và đề bài yêu cầu trả về chỉ số ban đầu gốc (không được phép xáo trộn thứ tự mảng) $\to$ bắt buộc dùng <code className="font-mono font-bold">std::unordered_map</code> tra cứu bù số $O(N)$ bộ nhớ.
          </div>
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">DỄ NHẦM VỚI:</strong>
            Cửa sổ trượt (Sliding Window). Sliding Window duy trì một phân đoạn liên tục $[L, R]$ chứa tất cả phần tử bên trong, còn Two Pointers chỉ quan tâm tới hai phần tử tại chính xác vị trí $L$ và $R$.
          </div>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN */}
      <section className="mb-10 space-y-3">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          6. Tính Đúng Đắn (Bất Biến / Invariant)
        </h2>
        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Trong Two Pointers đối đầu:
        </p>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs sm:text-sm font-mono space-y-1">
          <div><span className="text-indigo-600 font-bold">Bất biến:</span> Nếu cặp nghiệm hợp lệ (i*, j*) tồn tại, thì i* và j* luôn nằm trong đoạn [Left, Right].</div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <strong>Chứng minh duy trì:</strong> Giả sử <code className="font-mono">A[Left] + A[Right] &lt; Target</code>. Với mọi <code className="font-mono">k &le; Right</code>, ta có <code className="font-mono">A[Left] + A[k] &le; A[Left] + A[Right] &lt; Target</code>. Do đó Left không thể là một nửa của bất kỳ cặp nghiệm nào. Việc tăng <code className="font-mono">Left &rarr; Left + 1</code> loại bỏ an toàn các trường hợp không thể xảy ra mà không bao giờ bỏ sót nghiệm.
        </p>
      </section>

      {/* 7. CÀI ĐẶT */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          7. Cài Đặt Thuật Toán Chuẩn Thi Đấu
        </h2>
        <CodeViewer tabs={twoPointersCodeTabs} defaultTabId="cpp" />
      </section>

      {/* 8. BẪY THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy Thường Gặp Khi Thi Đấu (Corner Cases)
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">
              1. Tràn số nguyên khi tính tổng (Integer Overflow):
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Trong bài toán 4Sum hoặc khi phần tử mảng lên tới $10^9$, tổng $A[L] + A[R]$ dễ dàng vượt quá $2 \times 10^9$ của kiểu <code className="font-mono">int</code>. Luôn ép kiểu sang <code className="font-mono text-teal-600 font-bold">long long</code> trước khi cộng: <code className="font-mono">(long long)numbers[left] + numbers[right]</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">
              2. Quên bỏ qua phần tử trùng lặp trong 3Sum / 4Sum:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Sau khi tìm thấy một bộ nghiệm thỏa mãn, nếu không dùng vòng lặp <code className="font-mono">while (left &lt; right &amp;&amp; nums[left] == nums[left + 1]) left++;</code> thì kết quả trả về sẽ bị trùng lặp bộ ba, dẫn tới kết quả Wrong Answer.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
            <strong className="text-teal-700 dark:text-teal-300 block mb-1">
              3. Lỗi 1-indexed vs 0-indexed:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Đọc kỹ đề bài: LeetCode 167 yêu cầu kết quả trả về là chỉ số bắt đầu từ 1 (<code className="font-mono">[left + 1, right + 1]</code>). Quên cộng 1 là lỗi sơ đẳng phổ biến nhất khiến nộp bài bị sai ở test 1.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH */}
      <QuizSection questions={twoPointersQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN */}
      <PracticeSection
        problems={twoPointersPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="2.2"
        nextLessonTitle="Cửa Sổ Trượt (Sliding Window)"
        nextLessonDescription="Cửa sổ cố định độ dài K và cửa sổ co giãn linh hoạt kèm bảng đếm tần số ký tự."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson02_TwoPointers;
