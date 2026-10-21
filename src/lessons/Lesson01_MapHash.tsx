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
  mapHashCodeTabs,
  mapHashQuizQuestions,
  mapHashPracticeProblems,
} from '../data/lessons/lesson01_mapHash.data';
import { HashCollisionVisualizer } from '../visualizers/mapHash/HashCollisionVisualizer';
import { RandomizedSetVisualizer } from '../visualizers/mapHash/RandomizedSetVisualizer';

export const Lesson01_MapHash: React.FC<LessonProps> = ({
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
        lessonId="1.6"
        monthNumber={1}
        monthTitle="Cấu Trúc Dữ Liệu Cơ Bản"
        title="Bảng Băm (Hash Map), Cây Map & Kỹ Thuật Custom Hash"
        difficulty="Medium"
        isTheoryCompleted={isTheoryCompleted}
        onToggleTheory={onToggleTheory}
        onSelectSubtopic={onSelectSubtopic}
        keyTopics={[
          'std::map vs unordered_map',
          'Anti-Hash Hack Codeforces',
          'splitmix64 Random Seed',
          'Insert Delete GetRandom O(1)',
          'Chaining vs Open Addressing',
        ]}
        description={
          <>
            So sánh bản chất giữa <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">std::map</code> ($O(\log N)$) và <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">std::unordered_map</code> ($O(1)$ trung bình), vạch trần bẫy <strong>Anti-Hash Test trên Codeforces</strong> và trang bị vũ khí <strong>Custom Hash (splitmix64)</strong> miễn nhiễm hack TLE.
          </>
        }
      />

      {/* 2. BÀI TOÁN MỞ ĐẦU & VÌ SAO VÉT CẠN THẤT BẠI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          1. Bài Toán Mở Đầu: Thảm Họa Anti-Hash Test Trên Codeforces
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Hãy tưởng tượng bạn tham gia một contest Codeforces hoặc kỳ thi ICPC. Đề bài yêu cầu đếm tần số của $N = 10^5$ số nguyên. Bạn tự tin viết <code className="font-mono text-teal-600 font-bold">std::unordered_map&lt;long long, int&gt;</code> vì lý thuyết sách vở khẳng định bảng băm có độ phức tạp trung bình là <code className="font-mono text-teal-600 font-bold">O(1)</code> cho mỗi truy vấn, tổng thời gian $O(N)$.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Sau khi nộp bài, bạn nhận kết quả <strong>Time Limit Exceeded (TLE)</strong> tức tưởi ở một test case ẩn của ban giám khảo, hoặc bài của bạn bị đối thủ trong phòng "Hack" thành công ở vòng Challenge! Chuyện gì đã xảy ra?
        </p>

        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-xs sm:text-sm text-rose-950 dark:text-rose-200 space-y-2">
          <strong className="text-rose-700 dark:text-rose-400 text-sm">
            Bí Mật Cơ Chế g++ STL Khiến Bạn Bị Hack:
          </strong>
          <p>
            1. Trong trình biên dịch GCC (g++), hàm băm mặc định cho số nguyên chỉ đơn giản là hàm đồng nhất: <code className="font-mono">std::hash&lt;int&gt;(x) = x</code>.
          </p>
          <p>
            2. Số lượng bucket của g++ được xác định bằng một danh sách các số nguyên tố cố định (ví dụ $P = 126271$).
          </p>
          <p>
            3. Đối thủ chỉ việc tạo ra một dãy $10^5$ số có dạng: $x_i = i \times P$. Khi đó, mọi số $x_i$ khi lấy modulo cho $P$ đều cho số dư bằng $0$!
          </p>
          <p className="font-mono font-bold text-rose-600 dark:text-rose-300">
            Hậu quả: Toàn bộ 10⁵ số bị nhồi nhét vào đúng 1 bucket duy nhất! Thao tác tra cứu thoái hóa từ O(1) thành O(N). Tổng thời gian: O(N²) ≈ 5 × 10⁹ phép tính → TLE!
          </p>
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Vũ Khí Custom Hash (splitmix64)
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Để miễn nhiễm hoàn toàn với Anti-Hash, hàm băm của chúng ta phải thỏa mãn 2 điều kiện:
        </p>

        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li>
            <strong>Số ngẫu nhiên bí mật lúc chạy (Runtime Random Seed):</strong> Lấy timestamp từ đồng hồ phân giải cao <code className="font-mono text-teal-600">chrono::steady_clock::now()</code> cộng vào khóa. Mỗi lần chạy contest là một seed khác nhau, hacker không thể đoán trước.
          </li>
          <li>
            <strong>Thuật toán xáo trộn bit (Bit Mixer):</strong> Thuật toán <code className="font-mono text-teal-600 font-bold">splitmix64</code> đảo và nhân bit để một sự thay đổi nhỏ của key tạo ra giá trị băm hoàn toàn ngẫu nhiên và phân tán đều trên mọi bucket.
          </li>
        </ul>

        <div className="p-4 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">
            Quy Tắc Sống Còn Của Huấn Luyện Viên:
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong>"Trên Codeforces và các kỳ thi CP, KHÔNG BAO GIỜ dùng unordered_map mặc định với khóa số nguyên. Luôn bọc bằng template custom_hash hoặc dùng std::map nếu N ≤ 2·10⁵."</strong>
          </p>
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 1: HASH COLLISION & ANTI-HASH */}
      <HashCollisionVisualizer />

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: INSERT DELETE GETRANDOM O(1) */}
      <RandomizedSetVisualizer />

      {/* 5. KHI NÀO DÙNG MAP / UNORDERED_MAP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Bảng So Sánh Chiến Lược: std::map vs std::unordered_map
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="p-3">Tiêu chí</th>
                <th className="p-3">std::map (Cây Đỏ-Đen)</th>
                <th className="p-3">std::unordered_map (Bảng Băm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans font-semibold">Thời gian trung bình</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">O(log N)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400">O(1)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Thời gian xấu nhất (Worst Case)</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">O(log N) (Đảm bảo 100%)</td>
                <td className="p-3 text-rose-600 dark:text-rose-400">O(N) (Dễ bị hack TLE nếu không custom hash)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Thứ tự các Key</td>
                <td className="p-3 font-sans">Luôn sắp xếp tăng dần</td>
                <td className="p-3 font-sans">Không xác định</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">lower_bound / upper_bound</td>
                <td className="p-3 text-teal-600 font-bold">Hỗ trợ đầy đủ O(log N)</td>
                <td className="p-3 text-rose-600 font-bold">KHÔNG hỗ trợ</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Khi nào nên dùng trong Contest</td>
                <td className="p-3 font-sans text-xs">Cần duyệt theo thứ tự hoặc N ≤ 2·10⁵ an toàn tuyệt đối</td>
                <td className="p-3 font-sans text-xs">Cần tốc độ tối đa O(1) và đã trang bị custom_hash</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Chứng Minh Tính Đúng Đắn Của Kỹ Thuật Swap Xóa O(1)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>1. Bất biến:</strong> Tại mọi thời điểm, mảng `nums` chứa đúng tập hợp các phần tử hiện có không có lỗ hổng rỗng (dense array), và `val_to_idx[x]` luôn lưu chính xác chỉ số thực tế của $x$ trong `nums`.
          </p>
          <p>
            <strong>2. Duy trì:</strong> Khi xóa $x$ tại vị trí $i$: Thay vì dời tất cả phần tử sau $i$ về trước (tốn $O(N)$), ta đưa phần tử cuối cùng $last = nums.back()$ vào vị trí $i$. Cập nhật $val\_to\_idx[last] = i$. Sau đó gọi $nums.pop\_back()$. Tập hợp các phần tử sau khi xóa vẫn đầy đủ và trọn vẹn, không thứ tự nào bị vi phạm vì bài toán không yêu cầu thứ tự.
          </p>
          <p>
            <strong>3. GetRandom:</strong> Vì các phần tử nằm liên tục từ $0$ đến $size - 1$, việc lấy ngẫu nhiên $rand() \% size$ đảm bảo xác suất chọn mỗi phần tử là chính xác $1 / size$.
          </p>
        </div>
      </section>

      {/* 7. CÀI ĐẶT MẪU */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={mapHashCodeTabs} />
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy CP & Lỗi Thường Gặp
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 1: Dùng toán tử my_map[x] để kiểm tra tồn tại.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Tốn bộ nhớ không cần thiết (MLE) hoặc sai logic.
              <br />
              <em>Cách sửa:</em> Dùng <code className="font-mono text-teal-600">if (my_map.count(x))</code> hoặc <code className="font-mono">if (my_map.find(x) != my_map.end())</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 2: Chi phí Rehash làm chậm đột ngột.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Quá nhiều thao tác insert liên tục kích hoạt việc cấp phát lại mảng bucket và băm lại toàn bộ phần tử.
              <br />
              <em>Cách sửa:</em> Nếu biết trước mảng có $N$ phần tử, hãy gọi <code className="font-mono text-teal-600">my_map.reserve(N)</code> ngay từ đầu.
            </p>
          </div>
        </div>
      </section>

      {/* 9. KIỂM TRA NHANH (QUIZ) */}
      <QuizSection questions={mapHashQuizQuestions} sectionNumber="9" />

      {/* 10. BÀI TẬP RÈN LUYỆN (LEETCODE PRACTICE) */}
      <PracticeSection
        problems={mapHashPracticeProblems}
        completedProblems={completedProblems}
        onToggleProblem={onToggleProblem}
        sectionNumber="10"
      />

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <NextLessonBanner
        nextLessonId="1.7"
        nextLessonTitle="Bitset (std::bitset)"
        nextLessonDescription="Nén 64 giá trị boolean vào một từ máy 64-bit và tăng tốc độ tính toán gấp 64 lần."
        onSelectSubtopic={onSelectSubtopic}
      />
    </article>
  );
};

export default Lesson01_MapHash;
