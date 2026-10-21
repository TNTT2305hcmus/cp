import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const stackCodeTabs: CodeTab[] = [
  {
    id: 'cpp',
    label: 'daily_temperatures.cpp',
    language: 'cpp',
    iconColor: '#00599c',
    rawCode: `// LeetCode 739 - Daily Temperatures
// Time Complexity: O(N) amortized | Space Complexity: O(N)
#include <vector>
#include <stack>

class Solution {
public:
    std::vector<int> dailyTemperatures(const std::vector<int>& temperatures) {
        int n = static_cast<int>(temperatures.size());
        std::vector<int> answer(n, 0);
        std::stack<int> st; // Stores indices of decreasing temperatures

        for (int i = 0; i < n; ++i) {
            // While current temperature is warmer than the temperature at stack top
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int prevDay = st.top();
                st.pop();
                answer[prevDay] = i - prevDay;
            }
            st.push(i);
        }
        return answer;
    }
};`,
    content: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
        <pre>{`// LeetCode 739 - Daily Temperatures
// Time Complexity: O(N) amortized | Space Complexity: O(N)
#include <vector>
#include <stack>

class Solution {
public:
    std::vector<int> dailyTemperatures(const std::vector<int>& temperatures) {
        int n = static_cast<int>(temperatures.size());
        std::vector<int> answer(n, 0);
        std::stack<int> st; // Lưu trữ chỉ số

        for (int i = 0; i < n; ++i) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int prevDay = st.top();
                st.pop();
                answer[prevDay] = i - prevDay;
            }
            st.push(i);
        }
        return answer;
    }
};`}</pre>
      </div>
    ),
  },
  {
    id: 'python',
    label: 'daily_temperatures.py',
    language: 'python',
    iconColor: '#3572a5',
    rawCode: `# LeetCode 739 - Daily Temperatures
# Time Complexity: O(N) | Space Complexity: O(N)
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        n = len(temperatures)
        answer = [0] * n
        stack = []  # Stores indices

        for i, temp in enumerate(temperatures):
            while stack and temp > temperatures[stack[-1]]:
                prev_day = stack.pop()
                answer[prev_day] = i - prev_day
            stack.append(i)

        return answer`,
    content: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
        <pre>{`# LeetCode 739 - Daily Temperatures
# Time Complexity: O(N) | Space Complexity: O(N)
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        n = len(temperatures)
        answer = [0] * n
        stack = []  # Stores indices

        for i, temp in enumerate(temperatures):
            while stack and temp > temperatures[stack[-1]]:
                prev_day = stack.pop()
                answer[prev_day] = i - prev_day
            stack.append(i)

        return answer`}</pre>
      </div>
    ),
  },
  {
    id: 'ts',
    label: 'daily_temperatures.ts',
    language: 'typescript',
    iconColor: '#3178c6',
    rawCode: `// LeetCode 739 - Daily Temperatures
// Time Complexity: O(N) | Space Complexity: O(N)
function dailyTemperatures(temperatures: number[]): number[] {
    const n = temperatures.length;
    const answer = new Array(n).fill(0);
    const stack: number[] = []; // Stores indices

    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevDay = stack.pop()!;
            answer[prevDay] = i - prevDay;
        }
        stack.push(i);
    }

    return answer;
}`,
    content: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
        <pre>{`// LeetCode 739 - Daily Temperatures
// Time Complexity: O(N) | Space Complexity: O(N)
function dailyTemperatures(temperatures: number[]): number[] {
    const n = temperatures.length;
    const answer = new Array(n).fill(0);
    const stack: number[] = [];

    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevDay = stack.pop()!;
            answer[prevDay] = i - prevDay;
        }
        stack.push(i);
    }

    return answer;
}`}</pre>
      </div>
    ),
  },
];

export const stackQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Trong thuật toán Daily Temperatures với vòng lặp while lồng trong for, độ phức tạp thời gian tổng thể là bao nhiêu?',
    options: [
      'O(N²) vì có 2 vòng lặp lồng nhau',
      'O(N log N) tương tự như Heap',
      'Amortized O(N) tuyến tính',
      'O(N√N)',
    ],
    correctIndex: 2,
    explanation: 'Dù có vòng lặp while lồng nhau, mỗi chỉ số chỉ được push vào Stack đúng 1 lần và pop ra tối đa 1 lần trong toàn bộ chương trình. Do đó tổng số phép tính pop trên toàn mảng là <= N, dẫn tới chi phí khấu hao Amortized O(N).',
  },
  {
    id: 2,
    question: 'Biểu thức hậu tố Reverse Polish Notation "4 13 5 / +" có giá trị bằng bao nhiêu?',
    options: [
      '6',
      '3',
      '7',
      '2',
    ],
    correctIndex: 0,
    explanation: 'Gặp 5 và 13 trước dấu "/": tính 13 / 5 = 2 (chia số nguyên). Sau đó gặp 4 và 2 trước dấu "+": tính 4 + 2 = 6.',
  },
  {
    id: 3,
    question: 'Khi nào việc gọi hàm std::stack::top() trong C++ sẽ làm chương trình bị sập ngay lập tức (Crash/SIGSEGV)?',
    options: [
      'Khi Stack chứa nhiều hơn 10⁵ phần tử',
      'Khi Stack đang rỗng (st.empty() == true)',
      'Khi phần tử ở đỉnh là số âm',
      'Khi gọi top() nhiều hơn 2 lần liên tiếp',
    ],
    correctIndex: 1,
    explanation: 'std::stack::top() trên stack rỗng là lỗi Undefined Behavior. Trong thi đấu, nó sẽ dẫn tới lỗi Crash (SIGSEGV) ngay lập tức. Luôn phải kiểm tra if (!st.empty()) trước khi gọi top() hoặc pop().',
  },
];

export const stackPracticeProblems: PracticeProblem[] = [
  {
    id: '20',
    title: '20. Valid Parentheses',
    difficulty: 'Easy',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    pattern: 'Kiểm tra dãy ngoặc lồng nhau LIFO',
    priority: 1,
    hints: [
      'Ngoặc đóng xuất hiện phải khớp ngay lập tức với ngoặc mở gần nhất trước đó.',
      'Sử dụng std::stack<char>. Khi gặp ngoặc mở: push vào stack. Khi gặp ngoặc đóng: kiểm tra xem đỉnh stack có phải ngoặc mở tương ứng không, nếu có thì pop, nếu không thì trả về false.',
      'Kết thúc duyệt, kiểm tra return st.empty(); để tránh bỏ sót trường hợp chuỗi còn ngoặc mở dư thừa (ví dụ "((("). Time O(N), Space O(N).',
    ],
  },
  {
    id: '155',
    title: '155. Min Stack',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/min-stack/',
    pattern: 'Thiết kế ngăn xếp truy vấn min trong O(1)',
    priority: 1,
    hints: [
      'Làm sao để biết phần tử nhỏ nhất trước đó khi ta pop phần tử nhỏ nhất hiện tại ra khỏi Stack?',
      'Duy trì song song hai ngăn xếp: stack chính lưu giá trị, và min_stack lưu giá trị nhỏ nhất tính đến thời điểm hiện tại.',
      'Khi push(x): min_stack.push(min(x, min_stack.top())). Khi pop(): pop cả hai stack. Hàm getMin() chỉ cần trả về min_stack.top() trong O(1).',
    ],
  },
  {
    id: '150',
    title: '150. Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    pattern: 'Tính biểu thức hậu tố RPN',
    priority: 2,
    hints: [
      'Trong biểu thức hậu tố, toán tử luôn nằm sau 2 toán hạng mà nó tác động.',
      'Duyệt từng token: Nếu là số thì push vào stack. Nếu là toán tử (+, -, *, /), pop 2 số b = st.top(), st.pop() rồi a = st.top(), st.pop().',
      'Lưu ý thứ tự phép tính: a / b và a - b (phần tử pop trước là toán hạng sau). Sau khi tính xong kết quả, push lại vào stack.',
    ],
  },
  {
    id: '739',
    title: '739. Daily Temperatures',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    pattern: 'Monotonic Stack tìm Next Greater Element',
    priority: 2,
    hints: [
      'Thay vì tìm kiếm về phía trước tốn O(N²), hãy để các ngày trong quá khứ nằm trong stack chờ ngày ấm hơn xuất hiện.',
      'Duy trì stack lưu chỉ số của các ngày có nhiệt độ giảm dần. Khi ngày hiện tại i có nhiệt độ cao hơn ngày prevIdx ở đỉnh stack, ta tính ans[prevIdx] = i - prevIdx.',
      'Vòng lặp while (st.size() && T[i] > T[st.top()]) st.pop(). Sau đó push i vào stack. Tổng thời gian chạy là O(N).',
    ],
  },
  {
    id: '496',
    title: '496. Next Greater Element I',
    difficulty: 'Easy',
    url: 'https://leetcode.com/problems/next-greater-element-i/',
    pattern: 'Monotonic Stack + Hash Map',
    priority: 2,
    hints: [
      'Mảng nums1 là tập con của nums2. Hãy tiền xử lý tìm phần tử lớn hơn tiếp theo cho mọi phần tử trong nums2 trước.',
      'Áp dụng Monotonic Stack trên nums2 để tìm Next Greater Element, lưu kết quả vào unordered_map<int, int>.',
      'Duyệt nums1 và tra cứu O(1) từ map. Nếu không có trong map thì gán -1.',
    ],
  },
  {
    id: '503',
    title: '503. Next Greater Element II',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/next-greater-element-ii/',
    pattern: 'Monotonic Stack trên mảng xoay vòng 2N',
    priority: 2,
    hints: [
      'Mảng là hình tròn: Phần tử cuối cùng có thể tìm phần tử lớn hơn ở đầu mảng.',
      'Kỹ thuật CP kinh điển cho mảng vòng tròn: Nhân đôi mảng ảo bằng cách chạy vòng lặp 2N bước với chỉ số i % N.',
      'Chỉ ghi nhận kết quả khi i < N, nhưng vẫn push chỉ số (i % N) vào stack trong cả 2 lượt duyệt.',
    ],
  },
  {
    id: '71',
    title: '71. Simplify Path',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/simplify-path/',
    pattern: 'Mô phỏng đường dẫn Unix bằng Stack chuỗi',
    priority: 2,
    hints: [
      'Cắt chuỗi đường dẫn bởi dấu gạch chéo "/" thành các phần tử riêng biệt.',
      'Bỏ qua chuỗi rỗng "" và ".". Nếu gặp "..", pop phần tử thư mục gần nhất ra khỏi stack (nếu stack không rỗng). Nếu gặp tên thư mục hợp lệ, push vào stack.',
      'Nối các phần tử trong stack lại với nhau bằng dấu "/" từ đáy lên đỉnh.',
    ],
  },
  {
    id: '84',
    title: '84. Largest Rectangle in Histogram',
    difficulty: 'Hard',
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    pattern: 'Monotonic Stack diện tích cực đại O(N)',
    priority: 3,
    hints: [
      'Với mỗi cột i, chiều cao của hình chữ nhật bị giới hạn bởi chính cột đó. Nó có thể mở rộng sang trái và sang phải đến đâu?',
      'Nó mở rộng được sang hai bên chừng nào các cột xung quanh vẫn có chiều cao >= heights[i]. Nghĩa là ta cần tìm cột thấp hơn đầu tiên bên trái và bên phải.',
      'Dùng Monotonic Stack tăng dần. Khi gặp cột thấp hơn, pop cột ở đỉnh ra và tính diện tích: height * (i - left_smaller - 1). Thêm một cột có chiều cao 0 ở cuối mảng để vét cạn stack.',
    ],
  },
];
