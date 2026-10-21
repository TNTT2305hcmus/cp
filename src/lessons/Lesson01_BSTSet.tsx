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
  bstSetCodeTabs,
  bstSetQuizQuestions,
  bstSetPracticeProblems,
} from '../data/lessons/lesson01_bstSet.data';
import { BoundSearchVisualizer } from '../visualizers/bstSet/BoundSearchVisualizer';
import { SlidingSetVisualizer } from '../visualizers/bstSet/SlidingSetVisualizer';

export const Lesson01_BSTSet: React.FC<LessonProps> = ({
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
        lessonId="1.5"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Cây Tìm Kiếm Nhị Phân (BST) — std::set & std::multiset"
        difficulty="Medium"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'Red-Black Tree O(log N)',
          's.lower_bound(x) vs std::lower_bound',
          'upper_bound (> x)',
          'Multiset Erase Iterator Bug',
          'Sliding Window BST',
        ]}
        description={
          <>
            Nắm vững cơ chế <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">Cây Đỏ-Đen (Red-Black Tree)</code> tự cân bằng, làm chủ hai hàm tra cứu sống còn trong CP: <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">lower_bound (≥ X)</code> và <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">upper_bound (&gt; X)</code> trong <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(log N)</code>, cùng bẫy xóa phần tử chí mạng trong multiset.
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu & Vì Sao Vét Cạn Thất Bại
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán kiểm tra độ lệch cửa sổ trượt <strong>LeetCode 220 (Contains Duplicate III)</strong>: Cho một mảng $N = 10^5$ số nguyên. Hãy kiểm tra xem có tồn tại hai chỉ số $i, j$ thỏa mãn đồng thời hai điều kiện: khoảng cách chỉ số $|i - j| \le k$ và độ chênh lệch giá trị $|nums[i] - nums[j]| \le t$ hay không (với $k \le 10^5$).
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách vét cạn: Tại mỗi phần tử $i$, ta duyệt qua toàn bộ $k$ phần tử đứng trước nó trong cửa sổ trượt để kiểm tra xem có phần tử nào thỏa mãn hiệu không quá $t$. Tổng số phép so sánh là:
        </p>

        <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-mono">
          Thời gian = O(N × k) ≈ 10⁵ × 10⁵ = 10¹⁰ phép tính → TLE (vượt 100 lần ngưỡng 10⁸ phép tính/giây)!
        </div>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          <strong>Vì sao Hash Set và Heap đều bất lực?</strong> Hash Set (bảng băm) chỉ hỗ trợ tìm kiếm giá trị <em>chính xác</em> $nums[i] == x$ trong $O(1)$, hoàn toàn không thể tìm giá trị nằm trong đoạn $[nums[i] - t, nums[i] + t]$. Heap thì chỉ biết đỉnh cực đại/cực tiểu.
          Ta cần một cấu trúc <strong>vừa duy trì thứ tự tăng dần liên tục, vừa cho phép tìm kiếm nhị phân phần tử gần nhất trong $O(\log k)$</strong>! Đó chính là Cây Tìm Kiếm Nhị Phân tự cân bằng (Balanced BST) — hiện thân của <code className="font-mono text-teal-600 font-bold">std::set</code>.
        </p>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Bản Chất Của lower_bound & upper_bound
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Trong cấu trúc cây tìm kiếm nhị phân tự cân bằng (Red-Black Tree), mọi phần tử được tổ chức theo thứ tự nghiêm ngặt. Hai hàm tra cứu sau đây là vũ khí quan trọng bậc nhất của mọi thí sinh CP:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20">
            <div className="font-mono font-bold text-teal-800 dark:text-teal-300 text-sm mb-1">
              s.lower_bound(X)
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Trả về con trỏ tới phần tử <strong>đầu tiên có giá trị ≥ X</strong>. Nếu mọi phần tử đều &lt; X, trả về <code className="font-mono">s.end()</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="font-mono font-bold text-amber-800 dark:text-amber-300 text-sm mb-1">
              s.upper_bound(X)
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Trả về con trỏ tới phần tử <strong>đầu tiên có giá trị &gt; X</strong> (lớn hơn hẳn). Nếu không có, trả về <code className="font-mono">s.end()</code>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">
            Quy Tắc Sống Còn Của Huấn Luyện Viên:
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong>"Luôn gọi s.lower_bound(x) (phương thức thành viên của Set/Map) để đạt độ phức tạp O(log N). Tuyệt đối không gọi std::lower_bound(s.begin(), s.end(), x) vì hàm ngoài sẽ bước tuần tự từng node mất O(N) gây TLE ngay lập tức!"</strong>
          </p>
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 1: LOWER_BOUND & UPPER_BOUND */}
      <BoundSearchVisualizer />

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: CONTAINS DUPLICATE III (LEETCODE 220) */}
      <SlidingSetVisualizer />

      {/* 5. KHI NÀO DÙNG BST SET */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Bảng Nhận Diện Bài Toán Cần Dùng BST Set
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="p-3">Dấu hiệu trong đề bài</th>
                <th className="p-3">Cấu trúc dữ liệu tối ưu</th>
                <th className="p-3">Thao tác mấu chốt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans">"Tìm số nhỏ nhất ≥ X trong tập động"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">std::set&lt;int&gt;</td>
                <td className="p-3">s.lower_bound(X) O(log N)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"Đếm số phần tử trong khoảng [L, R] động"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">std::multiset hoặc Fenwick</td>
                <td className="p-3">distance(s.lower_bound(L), s.upper_bound(R))</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"Cửa sổ trượt kiểm tra khoảng cách giá trị |a - b| ≤ t"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">BST Sliding Window</td>
                <td className="p-3">lower_bound(cur - t) &lt;= cur + t</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN (BẤT BIẾN) */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Chứng Minh Tính Đúng Đắn (Loop Invariant)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>1. Bất biến:</strong> Tại thời điểm xét chỉ số $i$, cấu trúc `window` chứa chính xác các phần tử thuộc cửa sổ &#123;$nums[\max(0, i - k)], \dots, nums[i - 1]$&#125; được sắp xếp tự động theo thứ tự tăng dần trên cây nhị phân cân bằng với chiều cao $H \le 2 \log_2(k + 1)$.
          </p>
          <p>
            <strong>2. Duy trì:</strong> Việc gọi `window.lower_bound(nums[i] - t)` sẽ định vị phần tử $y$ nhỏ nhất trong cửa sổ thỏa mãn $y \ge nums[i] - t$. Nếu $y \le nums[i] + t$, điều kiện $|nums[i] - y| \le t$ được thỏa mãn $\to$ trả về true. Nếu $y &gt; nums[i] + t$ hoặc không tồn tại (trả về `end()`), thì mọi phần tử khác trong cửa sổ chắc chắn hoặc nhỏ hơn $nums[i] - t$ hoặc lớn hơn $nums[i] + t$, không thể có nghiệm nào khác.
          </p>
          <p>
            <strong>3. Kết thúc:</strong> Sau khi kiểm tra, nạp $nums[i]$ vào set và xóa $nums[i - k]$ (nếu $i \ge k$) giữ cho bất biến luôn đúng với mọi bước, không bỏ sót nghiệm và không phát sinh nghiệm giả.
          </p>
        </div>
      </section>

      {/* 7. CÀI ĐẶT MẪU */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={bstSetCodeTabs} />

        <div className="mt-4 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs sm:text-sm font-mono">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
            Mẫu Thao Tác Chuẩn Trên std::multiset:
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {`// Cách xóa đúng 1 phần tử có giá trị X trong multiset (không xóa sạch):
auto it = ms.find(X);
if (it != ms.end()) {
    ms.erase(it); // Truyền iterator -> Chỉ xóa đúng 1 node!
}

// KHÔNG VIẾT: ms.erase(X); // Sẽ xóa sạch toàn bộ các bản sao của X!`}
          </div>
        </div>
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy CP & Lỗi Thường Gặp
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 1: Gọi std::lower_bound(s.begin(), s.end(), val) biến O(log N) thành O(N).</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Time Limit Exceeded (TLE) trên các test $N = 10^5$.
              <br />
              <em>Cách sửa:</em> Bắt buộc viết <code className="font-mono text-teal-600 font-bold">s.lower_bound(val)</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 2: Lỗi multiset.erase(val) xóa sạch bản sao trùng lặp.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Wrong Answer (WA) do làm mất dữ liệu của các phần tử trùng lặp khác.
              <br />
              <em>Cách sửa:</em> Luôn tìm iterator bằng `find()` rồi mới erase iterator đó: <code className="font-mono">ms.erase(ms.find(val))</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 3: Tràn số nguyên 32-bit khi trừ độ lệch t.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Sai kết quả với các giá trị biên như $-2^{31}$ hoặc $2^{31} - 1$.
              <br />
              <em>Cách sửa:</em> Khai báo set kiểu <code className="font-mono text-teal-600 font-bold">std::set&lt;long long&gt;</code>.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH (QUIZ) */}
      <QuizSection questions={bstSetQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN (LEETCODE PRACTICE) */}
      <PracticeSection
        problems={bstSetPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.6"
        nextLessonTitle="BST (Map & Custom Hash)"
        nextLessonDescription="std::map vs std::unordered_map và kỹ thuật Custom Hash splitmix64 chống Anti-hash trên Codeforces."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_BSTSet;
