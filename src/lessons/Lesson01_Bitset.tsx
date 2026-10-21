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
  bitsetCodeTabs,
  bitsetQuizQuestions,
  bitsetPracticeProblems,
} from '../data/lessons/lesson01_bitset.data';
import {
  BitsetSubsetSumVisualizer,
  BitRegisterVisualizer,
} from '../visualizers/bitset';

export const Lesson01_Bitset: React.FC<LessonProps> = ({
  isTheoryCompleted = false,
  onToggleTheory,
  completedProblems = {},
  onToggleProblem,
  onSelectSubtopic,
}) => {
  return (
    <article className="max-w-[740px] mx-auto pb-24 text-slate-800 dark:text-slate-200">
      {/* 1. BREADCRUMBS & HEADER */}
      <LessonHeader
        lessonId="1.7"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Bitset (std::bitset) & Tối Ưu Nén Bit Song Song"
        difficulty="Medium"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'std::bitset<N>',
          'Bitwise Parallelism /64',
          'dp |= (dp << w)',
          'Bitset Sieve 1.2MB',
          'Compile-Time Constexpr',
        ]}
        description={
          <>
            Nén <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">64 giá trị boolean</code> vào một từ máy 64-bit, giảm <code className="font-mono font-bold text-teal-600">64 lần dung lượng RAM</code> và khai thác kỹ thuật <strong>Bitwise Parallelism</strong> tăng tốc độ thuật toán Knapsack, Subset Sum, Sàng nguyên tố gấp <code className="font-mono font-bold text-teal-600">64 lần</code>!
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu: Giới Hạn Tốc Độ Của Quy Hoạch Động 0-1 Knapsack
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán kinh điển <strong>Subset Sum / 0-1 Knapsack dạng boolean</strong>: Cho $N = 1000$ đồ vật có trọng lượng $w_i \le 100$. Cần kiểm tra xem có tập con nào có tổng đúng bằng $W = 10^5$ hay không.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách làm quy hoạch động thông thường: Khai báo mảng <code className="font-mono">bool dp[100001]</code>. Với mỗi đồ vật $x$, ta chạy vòng lặp duyệt ngược:
        </p>

        <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
          {`for (int x : nums) {
    for (int w = W; w >= x; --w) {
        dp[w] = dp[w] || dp[w - x];
    }
}`}
        </div>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Số phép tính là $N \times W = 1000 \times 10^5 = 10^8$ phép tính. Trong thi đấu CP, $10^8$ phép tính mảng thường mất từ $0.4$ đến $0.8$ giây. Nếu Time Limit ngặt nghèo ($0.2$ giây) hoặc có $10$ test cases, bài nộp của bạn sẽ dính <strong>Time Limit Exceeded (TLE)</strong>!
        </p>

        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20 text-xs sm:text-sm text-teal-900 dark:text-teal-200">
          <strong>Phép Thuật Của std::bitset:</strong> Thay vì duyệt từng ô $w$ một cách thủ công, ta thay thế toàn bộ vòng lặp bằng đúng một dòng:
          <code className="block mt-1 font-mono font-bold text-teal-700 dark:text-teal-300 text-sm">
            dp |= (dp &lt;&lt; x);
          </code>
          Thao tác này dịch chuyển và gộp 64 giá trị cùng lúc trong đúng 1 lệnh vi xử lý CPU! Số phép tính giảm còn $10^8 / 64 \approx 1.5 \times 10^6 \to$ chạy chỉ mất <strong>0.003 giây</strong> (nhanh gấp 64 lần)!
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Bitwise Parallelism (Song Song Cấp Độ Bit)
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          CPU hiện đại là kiến trúc 64-bit. Mỗi thanh ghi số nguyên không dấu 64-bit (`uint64_t`) có thể chứa 64 giá trị boolean $0$ hoặc $1$. Khi ta thực hiện phép toán <code className="font-mono">OR (|)</code> hay dịch bit <code className="font-mono">SHL (&lt;&lt;)</code>, CPU biến đổi cả 64 bit này cùng lúc trong đúng 1 chu kỳ xung nhịp (Clock Cycle).
        </p>

        <div className="p-4 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">
            Quy Tắc Vàng Của Huấn Luyện Viên:
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong>"std::bitset biến bài toán có độ phức tạp O(N × W) thành O(N × W / 64). Trong các bài toán Knapsack boolean hoặc Reachability trên đồ thị, bitset chính là chiếc vé vàng biến TLE thành AC!"</strong>
          </p>
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 1: SUBSET SUM VỚI BITSET SHIFT */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          3. Mô Phỏng Tương Tác: Subset Sum Với Lệnh Dịch dp |= (dp &lt;&lt; w)
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Quan sát cách một mảng trạng thái nhị phân được dịch chuyển trái $w$ vị trí và tự động tạo ra tất cả các tổng mới mà không cần vòng lặp:
        </p>

        <BitsetSubsetSumVisualizer />
      </section>

      {/* 5. MÔ PHỎNG TƯƠNG TÁC 2: INTERACTIVE BITSET EXPLORER */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4. Mô Phỏng Tương Tác: Khám Phá Các Hàm Thành Viên Của std::bitset
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Nhấp chuột vào bất kỳ ô bit nào bên dưới để bật/tắt (toggle) và quan sát giá trị các hàm thành viên cập nhật tức thời:
        </p>

        <BitRegisterVisualizer />
      </section>

      {/* 6. KHI NÀO DÙNG BITSET */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Bảng Nhận Diện Bài Toán CP Nên Dùng Bitset
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="p-3">Bài toán / Dấu hiệu</th>
                <th className="p-3">Kỹ thuật Bitset</th>
                <th className="p-3">Tốc độ & Bộ nhớ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans">Subset Sum / 0-1 Knapsack boolean với W ≤ 10⁵</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">dp |= (dp &lt;&lt; w)</td>
                <td className="p-3">O(N × W / 64) (Nhanh gấp 64 lần)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">Sàng nguyên tố Eratosthenes đến 10⁷ hoặc 10⁸</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">std::bitset&lt;MAX_N&gt; is_prime</td>
                <td className="p-3">Chỉ tốn 1.2 MB RAM cho 10 triệu số</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">Đếm số lượng tam giác trong đồ thị vô hướng</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">adj[u] &amp; adj[v] rồi đếm count()</td>
                <td className="p-3">O(V³ / 64) thay vì O(V³)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. TÍNH ĐÚNG ĐẮN */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Chứng Minh Tính Đúng Đắn Của Phép Dịch Bit Trong Subset Sum
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>1. Bất biến:</strong> Trước khi xét phần tử $w_i$, bit thứ $s$ trong `dp` bằng $1$ khi và chỉ khi tồn tại một tập con trong &#123;w_1, ..., w_&#123;i-1&#125;&#125; có tổng đúng bằng $s$.
          </p>
          <p>
            <strong>2. Duy trì:</strong> Khi thực hiện phép dịch bit $dp &lt;&lt; w_i$, bit thứ $s$ chuyển thành bit thứ $s + w_i$. Điều này phản ánh chính xác việc cộng thêm $w_i$ vào mọi tổng con $s$ đã tồn tại trước đó. Phép toán hợp $dp \mid (dp &lt;&lt; w_i)$ thu nhận cả các tổng không chọn $w_i$ (giữ nguyên trong $dp$) và các tổng có chọn $w_i$ (từ $dp &lt;&lt; w_i$), giữ cho bất biến luôn đúng cho bước $i$.
          </p>
          <p>
            <strong>3. Kết thúc:</strong> Sau khi duyệt qua toàn bộ $N$ phần tử, `dp[W] == 1` khi và chỉ khi có thể tạo thành tổng $W$.
          </p>
        </div>
      </section>

      {/* 8. CÀI ĐẶT MẪU */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={bitsetCodeTabs} />
      </section>

      {/* 9. BẪY VÀ LỖI THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy CP & Lỗi Thường GẶP Khi Dùng Bitset
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 1: Khai báo kích thước N là biến động (Variable-Length).</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Lỗi biên dịch `error: non-type template argument is not a constant expression`.
              <br />
              <em>Cách sửa:</em> Bitset bắt buộc kích thước phải là hằng số <code className="font-mono text-teal-600">constexpr</code> hoặc số nguyên cụ thể lúc compile.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 2: Hiểu ngược thứ tự chỉ số trong chuỗi nhị phân to_string().</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Nhầm lẫn bit trọng số cao (MSB) và bit trọng số thấp (LSB).
              <br />
              <em>Quy tắc:</em> Trong <code className="font-mono text-teal-600">bitset&lt;8&gt; b("10000000")</code>, bit `b[0]` là ký tự cuối cùng bên phải ('0'), còn `b[7]` là ký tự đầu tiên bên trái ('1').
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH (QUIZ) */}
      <QuizSection questions={bitsetQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN (LEETCODE PRACTICE) */}
      <PracticeSection
        problems={bitsetPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.8"
        nextLessonTitle="Bài Test 1 — Tháng 1 (1.8)"
        nextLessonDescription="Kiểm tra định kỳ 90 phút (4 bài: Easy, Medium 1, Medium 2, Hard) về Vector, Sorting, Stack, Queue."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_Bitset;
