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
  vectorSortingCodeTabs,
  vectorSortingQuizQuestions,
  vectorSortingPracticeProblems,
} from '../data/lessons/lesson01_vectorSorting.data';
import {
  VectorMemoryVisualizer,
  DnfVisualizer,
} from '../visualizers/vectorSorting';

export const Lesson01_VectorSorting: React.FC<LessonProps> = ({
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
        lessonId="1.1"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Độ Phức Tạp Thuật Toán, Mảng Động Vector & Kỹ Thuật Sorting"
        difficulty="Easy"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'Big-O 10^8 ops',
          'Capacity Doubling',
          'vector::reserve',
          'IntroSort',
          'Strict Weak Ordering',
          'Dutch National Flag',
        ]}
        description={
          <>
            Làm chủ quy tắc <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">10⁸</code> phép tính/giây,
            cơ chế nhân đôi dung lượng của mảng động <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">std::vector</code>,
            chi phí khấu hao Amortized <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(1)</code>,
            và các thuật toán sắp xếp chuyên sâu (IntroSort, Custom Comparator, Dutch National Flag).
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu & Vì Sao Vét Cạn Thất Bại
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Xét bài toán kinh điển <strong>LeetCode 75 (Sort Colors)</strong>: Cho một mảng gồm $N$ quả bóng mang một trong ba màu <strong>0 (đỏ), 1 (trắng), 2 (xanh)</strong>. Nhiệm vụ là sắp xếp các quả bóng cùng màu đứng cạnh nhau theo thứ tự 0, 1, 2.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Nếu giải theo phản xạ vét cạn (Bubble Sort hay duyệt tìm kiếm nhiều lần), ta tốn khoảng <span className="font-mono font-bold text-rose-600 dark:text-rose-400">O(N²)</span> phép tính. Với <span className="font-mono font-bold">N = 10⁵</span>, số phép tính lên tới <span className="font-mono font-bold text-rose-600">10¹⁰</span>, gấp đúng <strong>100 lần</strong> ngưỡng chịu đựng của máy chấm (10⁸ phép tính/giây) và dính <strong>Time Limit Exceeded (TLE)</strong>. Ngay cả khi dùng <code className="font-mono">std::sort</code>, ta vẫn tốn <span className="font-mono text-amber-600 font-semibold">O(N log N)</span> phép so sánh không cần thiết.
        </p>

        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20 text-xs sm:text-sm text-teal-900 dark:text-teal-200">
          <strong>Câu hỏi mở:</strong> Khi số lượng giá trị phân biệt chỉ vỏn vẹn là 3 phần tử (0, 1, 2), liệu ta có thể sắp xếp mảng trong <strong>đúng 1 lượt duyệt duy nhất O(N)</strong> và <strong>không tốn thêm bất kỳ byte bộ nhớ phụ nào O(1)</strong> không?
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Để giải quyết bài toán trong $O(N)$ thời gian và $O(1)$ không gian, nhà khoa học máy tính Edsger Dijkstra đã phát minh ra thuật toán <strong>Lá cờ Hà Lan (Dutch National Flag - DNF)</strong>. Ta dùng 3 con trỏ <span className="font-mono font-bold text-emerald-600">low</span>, <span className="font-mono font-bold text-amber-600">mid</span>, và <span className="font-mono font-bold text-indigo-600">high</span> để chia mảng thành 4 vùng bất biến:
        </p>

        <ul className="list-disc list-inside space-y-1.5 text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300 pl-2">
          <li>Đoạn <span className="font-mono font-bold text-emerald-600">[0 ... low - 1]</span>: Chắc chắn toàn số <strong>0</strong>.</li>
          <li>Đoạn <span className="font-mono font-bold text-amber-600">[low ... mid - 1]</span>: Chắc chắn toàn số <strong>1</strong>.</li>
          <li>Đoạn <span className="font-mono font-bold text-slate-600 dark:text-slate-400">[mid ... high]</span>: Miền <strong>chưa xét</strong> (Unprocessed elements).</li>
          <li>Đoạn <span className="font-mono font-bold text-indigo-600">[high + 1 ... N - 1]</span>: Chắc chắn toàn số <strong>2</strong>.</li>
        </ul>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-medium text-slate-900 dark:text-white">
          <strong>Quy tắc ghi nhớ:</strong> Luôn dự đoán trước kích thước để gọi <code className="font-mono text-teal-600 dark:text-teal-400 font-bold">vector::reserve(N)</code> triệt tiêu chi phí cấp phát, và dùng 3 con trỏ phân vùng mảng để phân loại các tập giá trị rời rạc trong đúng một lượt duyệt <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">O(N)</code>.
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC (2 MÔ HÌNH) */}
      <section className="mb-10 space-y-8">
        {/* MÔ HÌNH 1: VECTOR CAPACITY & REALLOCATION */}
        <div className="space-y-4">
          <div className="border-l-4 border-teal-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              3. Mô phỏng 1: Cơ Chế Cấp Phát & Reallocation Của Vector
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Quan sát sự thay đổi giữa Size và Capacity qua từng thao tác <code className="font-mono">push_back</code>.
            </p>
          </div>

          <VectorMemoryVisualizer />
        </div>

        {/* MÔ HÌNH 2: DUTCH NATIONAL FLAG */}
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              4. Mô phỏng 2: Thuật Toán Lá Cờ Hà Lan (Dutch National Flag)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Phân vùng 3 con trỏ <code className="font-mono text-emerald-600">low</code>, <code className="font-mono text-amber-600">mid</code>, <code className="font-mono text-indigo-600">high</code> cho bài toán Sort Colors (LeetCode 75).
            </p>
          </div>

          <DnfVisualizer />
        </div>
      </section>

      {/* 5. KHI NÀO DÙNG KỸ THUẬT NÀY */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Khi Nào Dùng Kỹ Thuật Này
        </h2>

        {/* Bảng dấu hiệu nhận diện */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-2.5">Đặc điểm / Ràng buộc đề bài</th>
                <th className="p-2.5">Kỹ thuật nên dùng</th>
                <th className="p-2.5">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">$N \le 2 \times 10^5$, cần sắp xếp tổng quát</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">std::sort (IntroSort)</td>
                <td className="p-2.5 font-mono">O(N log N)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Chỉ có 3 giá trị cố định (ví dụ 0, 1, 2)</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Dutch National Flag (3 con trỏ)</td>
                <td className="p-2.5 font-mono">O(N) time, O(1) space</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Tìm phần tử lớn thứ K không cần sort hết</td>
                <td className="p-2.5 font-mono text-teal-600 dark:text-teal-400 font-semibold">std::nth_element (Quick Select)</td>
                <td className="p-2.5 font-mono">O(N) trung bình</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-white">Ghép 2 mảng tăng dần mà mảng 1 có chỗ trống đuôi</td>
                <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Duyệt điền từ đuôi về đầu</td>
                <td className="p-2.5 font-mono">O(M + N) time, O(1) space</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">KHÔNG DÙNG KHI:</strong>
            Thứ tự ban đầu của các phần tử có giá trị bằng nhau phải được giữ nguyên (Stability). Khi đó bắt buộc phải dùng <code className="font-mono font-bold">std::stable_sort</code> (Merge Sort) thay vì <code className="font-mono">std::sort</code>.
          </div>
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">DỄ NHẦM VỚI:</strong>
            Two Pointers đối đầu (Two Sum II). DNF sử dụng 3 con trỏ để duy trì 4 phân vùng rời nhau, không phải để tìm cặp số có tổng bằng Target.
          </div>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN (BẤT BIẾN / INVARIANT) */}
      <section className="mb-10 space-y-3">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Tính Đúng Đắn (Bất Biến / Invariant)
        </h2>
        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Tại mỗi bước lặp trong thuật toán DNF, 4 phân vùng luôn thỏa mãn:
        </p>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs sm:text-sm font-mono space-y-1">
          <div><span className="text-emerald-600 font-bold">∀ i ∈ [0, low - 1]</span>: a[i] == 0</div>
          <div><span className="text-amber-600 font-bold">∀ i ∈ [low, mid - 1]</span>: a[i] == 1</div>
          <div><span className="text-indigo-600 font-bold">∀ i ∈ [high + 1, N - 1]</span>: a[i] == 2</div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <strong>Điều kiện kết thúc:</strong> Sau mỗi bước, hoặc <code className="font-mono">mid</code> tăng lên 1, hoặc <code className="font-mono">high</code> giảm đi 1. Đoạn chưa xét <code className="font-mono">[mid...high]</code> có độ dài giảm nghiêm ngặt sau từng bước. Khi <code className="font-mono">mid &gt; high</code>, đoạn chưa xét trở nên rỗng và toàn bộ mảng được phân loại chính xác sau tối đa $N$ bước lặp.
        </p>
      </section>

      {/* 7. CÀI ĐẶT MÃ NGUỒN CHUẨN */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Thuật Toán Chuẩn Thi Đấu
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Mã nguồn mẫu bài toán LeetCode 75 (Sort Colors) bằng C++20, Python và TypeScript:
        </p>
        <CodeViewer tabs={vectorSortingCodeTabs} defaultTabId="cpp" />
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP (CORNER CASES) */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy Thường Gặp Khi Thi Đấu (Corner Cases)
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">
              1. Bẫy truyền vector theo kiểu Pass-by-Value:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Viết hàm <code className="font-mono font-bold">void solve(vector&lt;int&gt; a)</code> khiến toàn bộ $N$ phần tử bị sao chép sang vùng nhớ mới mỗi lần gọi hàm. Khi $N = 2 \times 10^5$ hoặc gọi đệ quy, chương trình chắc chắn dính TLE hoặc Memory Limit Exceeded. Luôn truyền tham chiếu hằng: <code className="font-mono text-teal-600 dark:text-teal-400 font-bold">const vector&lt;int&gt;&amp; a</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <strong className="text-amber-700 dark:text-amber-300 block mb-1">
              2. Vi phạm nguyên tắc Strict Weak Ordering trong Comparator:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Khi viết hàm so sánh cho <code className="font-mono">std::sort</code>, bạn chỉ được phép dùng dấu <code className="font-mono text-teal-600 font-bold">&lt;</code>, tuyệt đối không dùng <code className="font-mono text-rose-500 font-bold">&lt;=</code>. Nếu 2 phần tử bằng nhau mà trả về <code className="font-mono">true</code>, hàm sort sẽ truy cập tràn ra ngoài biên mảng gây <strong>Segmentation Fault</strong> ngẫu nhiên.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20">
            <strong className="text-teal-700 dark:text-teal-300 block mb-1">
              3. Quên gọi vector::reserve khi biết trước số lượng N:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">
              Với $N$ lớn ($10^6$ dòng input), việc <code className="font-mono">push_back</code> liên tục không có <code className="font-mono">reserve(N)</code> sẽ kích hoạt reallocation liên tục làm tăng thời gian chạy gấp 2–3 lần. Luôn gọi <code className="font-mono text-teal-600 font-bold">v.reserve(N)</code> ngay sau khi đọc $N$.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH (3 CÂU QUIZ) */}
      <QuizSection questions={vectorSortingQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN (GỢI Ý 3 TẦNG) */}
      <PracticeSection
        problems={vectorSortingPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.2"
        nextLessonTitle="Ngăn Xếp (Stack) & Monotonic Stack"
        nextLessonDescription="Nguyên lý LIFO, kiểm tra chuỗi ngoặc hợp lệ và kỹ thuật Monotonic Stack."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_VectorSorting;
