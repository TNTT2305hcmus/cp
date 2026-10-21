import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Check,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button, Badge, Card, CodeViewer, type CodeTab } from '../components';

// ==========================================
// TYPES
// ==========================================
export interface ParenthesesStep {
  currentIndex: number;
  stackSnapshot: string[];
  action: 'INIT' | 'PUSH' | 'MATCH' | 'ERROR' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export interface MonotonicStep {
  currentIndex: number;
  stackSnapshot: number[]; // indices
  resultSnapshot: number[];
  action: 'INIT' | 'POP' | 'PUSH' | 'DONE';
  poppedIndex?: number;
  observation: string;
  decision: string;
  reason: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  pattern: string;
  priority: 1 | 2 | 3;
  hints: [string, string, string];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonProps {
  isTheoryCompleted?: boolean;
  onToggleTheory?: () => void;
  completedProblems?: Record<string, boolean>;
  onToggleProblem?: (problemId: string) => void;
  onSelectSubtopic?: (subtopicId: string) => void;
}

export const Lesson01_Stack: React.FC<LessonProps> = ({
  isTheoryCompleted = false,
  onToggleTheory,
  completedProblems = {},
  onToggleProblem,
  onSelectSubtopic,
}) => {
  const [localTheoryDone, setLocalTheoryDone] = useState<boolean>(isTheoryCompleted);
  const theoryDone = onToggleTheory !== undefined ? isTheoryCompleted : localTheoryDone;

  const handleToggleTheory = () => {
    if (onToggleTheory) {
      onToggleTheory();
    } else {
      setLocalTheoryDone(!localTheoryDone);
    }
  };

  // ==========================================
  // STATE MÔ HÌNH 1: DÃY NGOẶC HỢP LỆ (LEETCODE 20)
  // ==========================================
  const parenDatasets = [
    { label: 'Hợp lệ: {[()]}', str: ['{', '[', '(', ')', ']', '}'] },
    { label: 'Lỗi không khớp: {[(])}', str: ['{', '[', '(', ']', ')', '}'] },
    { label: 'Lỗi thiếu ngoặc đóng: ((()', str: ['(', '(', '(', ')'] },
  ];
  const [selectedParenDataIndex, setSelectedParenDataIndex] = useState<number>(0);
  const [parenIndex, setParenIndex] = useState<number>(0);
  const [parenPlaying, setParenPlaying] = useState<boolean>(false);
  const [parenSpeed, setParenSpeed] = useState<number>(650);
  const parenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const parenSteps = useMemo<ParenthesesStep[]>(() => {
    const rawChars = [...parenDatasets[selectedParenDataIndex].str];
    const steps: ParenthesesStep[] = [];
    const st: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

    steps.push({
      currentIndex: -1,
      stackSnapshot: [],
      action: 'INIT',
      observation: `Khởi tạo: Chuỗi ngoặc "${rawChars.join('')}", Stack rỗng.`,
      decision: `Bắt đầu duyệt từ ký tự đầu tiên tại index 0.`,
      reason: `Stack tuân thủ LIFO: Ngoặc mở vào sau phải được đóng trước.`,
    });

    let hasError = false;

    for (let i = 0; i < rawChars.length; i++) {
      const ch = rawChars[i];

      if (ch === '(' || ch === '[' || ch === '{') {
        st.push(ch);
        steps.push({
          currentIndex: i,
          stackSnapshot: [...st],
          action: 'PUSH',
          observation: `Ký tự '${ch}' tại vị trí ${i} là ngoặc mở.`,
          decision: `Push '${ch}' vào đỉnh Stack.`,
          reason: `Cần lưu trữ ngoặc mở để chờ ngoặc đóng tương ứng ở phía sau.`,
        });
      } else {
        if (st.length === 0) {
          steps.push({
            currentIndex: i,
            stackSnapshot: [...st],
            action: 'ERROR',
            observation: `Gặp ngoặc đóng '${ch}' nhưng Stack đang rỗng!`,
            decision: `Dừng thuật toán và kết luận: Chuỗi KHÔNG hợp lệ.`,
            reason: `Không có ngoặc mở nào tương ứng cho ngoặc đóng này.`,
          });
          hasError = true;
          break;
        }

        const top = st[st.length - 1];
        if (top === pairs[ch]) {
          st.pop();
          steps.push({
            currentIndex: i,
            stackSnapshot: [...st],
            action: 'MATCH',
            observation: `Ngoặc đóng '${ch}' khớp hoàn hảo với đỉnh Stack '${top}'.`,
            decision: `Pop '${top}' ra khỏi Stack.`,
            reason: `Cặp ngoặc '${top}${ch}' đã triệt tiêu hợp lệ.`,
          });
        } else {
          steps.push({
            currentIndex: i,
            stackSnapshot: [...st],
            action: 'ERROR',
            observation: `Ngoặc đóng '${ch}' KHÔNG khớp với đỉnh Stack '${top}' (cần '${pairs[ch]}').`,
            decision: `Dừng thuật toán và kết luận: Chuỗi KHÔNG hợp lệ.`,
            reason: `Vi phạm nguyên tắc ngoặc lồng nhau (LIFO).`,
          });
          hasError = true;
          break;
        }
      }
    }

    if (!hasError) {
      if (st.length === 0) {
        steps.push({
          currentIndex: rawChars.length,
          stackSnapshot: [],
          action: 'DONE',
          observation: `Duyệt hết chuỗi và Stack rỗng hoàn toàn.`,
          decision: `Kết luận: Chuỗi ngoặc HỢP LỆ (True).`,
          reason: `Mọi ngoặc mở đều đã được đóng khớp theo đúng thứ tự lồng nhau.`,
        });
      } else {
        steps.push({
          currentIndex: rawChars.length,
          stackSnapshot: [...st],
          action: 'ERROR',
          observation: `Duyệt hết chuỗi nhưng Stack vẫn còn ${st.length} ngoặc mở chưa đóng!`,
          decision: `Kết luận: Chuỗi KHÔNG hợp lệ (False).`,
          reason: `Còn tồn tại ngoặc mở chưa có ngoặc đóng tương ứng.`,
        });
      }
    }

    return steps;
  }, [selectedParenDataIndex]);

  useEffect(() => {
    setParenIndex(0);
    setParenPlaying(false);
  }, [selectedParenDataIndex]);

  useEffect(() => {
    if (parenPlaying) {
      parenTimerRef.current = setInterval(() => {
        setParenIndex((prev) => {
          if (prev < parenSteps.length - 1) return prev + 1;
          setParenPlaying(false);
          return prev;
        });
      }, parenSpeed);
    } else if (parenTimerRef.current) {
      clearInterval(parenTimerRef.current);
    }
    return () => {
      if (parenTimerRef.current) clearInterval(parenTimerRef.current);
    };
  }, [parenPlaying, parenSpeed, parenSteps.length]);

  // ==========================================
  // STATE MÔ HÌNH 2: MONOTONIC STACK (LEETCODE 739)
  // ==========================================
  const monoDatasets = [
    { label: 'Nhiệt độ mẫu: [73, 74, 75, 71, 69, 72, 76, 73]', arr: [73, 74, 75, 71, 69, 72, 76, 73] },
    { label: 'Giảm dần: [90, 80, 70, 60]', arr: [90, 80, 70, 60] },
    { label: 'Tăng dần: [60, 70, 80, 90]', arr: [60, 70, 80, 90] },
  ];
  const [selectedMonoDataIndex, setSelectedMonoDataIndex] = useState<number>(0);
  const [monoIndex, setMonoIndex] = useState<number>(0);
  const [monoPlaying, setMonoPlaying] = useState<boolean>(false);
  const [monoSpeed, setMonoSpeed] = useState<number>(650);
  const monoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const monoSteps = useMemo<MonotonicStep[]>(() => {
    const rawTemps = [...monoDatasets[selectedMonoDataIndex].arr];
    const steps: MonotonicStep[] = [];
    const n = rawTemps.length;
    const ans = new Array(n).fill(0);
    const st: number[] = []; // lưu indices

    steps.push({
      currentIndex: -1,
      stackSnapshot: [],
      resultSnapshot: [...ans],
      action: 'INIT',
      observation: `Khởi tạo: Mảng ${n} ngày. Mảng kết quả khởi tạo toàn 0.`,
      decision: `Bắt đầu duyệt từ ngày 0 với Monotonic Stack giảm dần.`,
      reason: `Stack lưu các chỉ số ngày mà nhiệt độ đang giảm dần chờ ngày ấm hơn.`,
    });

    for (let i = 0; i < n; i++) {
      const curTemp = rawTemps[i];

      while (st.length > 0 && curTemp > rawTemps[st[st.length - 1]]) {
        const prevIdx = st.pop()!;
        ans[prevIdx] = i - prevIdx;
        steps.push({
          currentIndex: i,
          stackSnapshot: [...st],
          resultSnapshot: [...ans],
          action: 'POP',
          poppedIndex: prevIdx,
          observation: `Ngày ${i} (${curTemp}°C) > Ngày đỉnh Stack ${prevIdx} (${rawTemps[prevIdx]}°C).`,
          decision: `Ghi nhận kết quả: ans[${prevIdx}] = ${i} - ${prevIdx} = ${i - prevIdx} ngày. Pop ngày ${prevIdx} ra.`,
          reason: `Ngày ${i} chính là ngày ấm hơn đầu tiên của ngày ${prevIdx}.`,
        });
      }

      st.push(i);
      steps.push({
        currentIndex: i,
        stackSnapshot: [...st],
        resultSnapshot: [...ans],
        action: 'PUSH',
        observation: `Ngày ${i} (${curTemp}°C) <= đỉnh Stack (hoặc Stack rỗng).`,
        decision: `Push chỉ số ${i} vào đỉnh Stack.`,
        reason: `Duy trì tính chất đơn điệu giảm dần của Stack.`,
      });
    }

    steps.push({
      currentIndex: n,
      stackSnapshot: [...st],
      resultSnapshot: [...ans],
      action: 'DONE',
      observation: `Duyệt hết mảng. Các ngày còn lại trong Stack giữ nguyên ans = 0 (không có ngày ấm hơn).`,
      decision: `Hoàn tất thuật toán Daily Temperatures trong thời gian O(N).`,
      reason: `Mỗi chỉ số được push đúng 1 lần và pop tối đa 1 lần.`,
    });

    return steps;
  }, [selectedMonoDataIndex]);

  useEffect(() => {
    setMonoIndex(0);
    setMonoPlaying(false);
  }, [selectedMonoDataIndex]);

  useEffect(() => {
    if (monoPlaying) {
      monoTimerRef.current = setInterval(() => {
        setMonoIndex((prev) => {
          if (prev < monoSteps.length - 1) return prev + 1;
          setMonoPlaying(false);
          return prev;
        });
      }, monoSpeed);
    } else if (monoTimerRef.current) {
      clearInterval(monoTimerRef.current);
    }
    return () => {
      if (monoTimerRef.current) clearInterval(monoTimerRef.current);
    };
  }, [monoPlaying, monoSpeed, monoSteps.length]);

  // ==========================================
  // PRACTICE PROBLEMS VỚI GỢI Ý 3 TẦNG (PLANNING.md)
  // ==========================================
  const practiceProblems: PracticeProblem[] = [
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

  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [expandedHintProblemId, setExpandedHintProblemId] = useState<string | null>(null);
  const [expandedHintTier, setExpandedHintTier] = useState<Record<string, number>>({});

  const filteredProblems = practiceProblems.filter((p) => {
    if (selectedPriorityFilter === 'all') return true;
    return p.priority === parseInt(selectedPriorityFilter);
  });

  const isProblemDone = (id: string) => !!completedProblems[id];
  const handleToggleProblem = (id: string) => {
    if (onToggleProblem) {
      onToggleProblem(id);
    }
  };

  const solvedCount = practiceProblems.filter((p) => isProblemDone(p.id)).length;

  const toggleHintTier = (problemId: string, tier: number) => {
    setExpandedHintTier((prev) => ({
      ...prev,
      [problemId]: prev[problemId] === tier ? 0 : tier,
    }));
  };

  // ==========================================
  // QUIZ TƯƠNG TÁC
  // ==========================================
  const quizQuestions: QuizQuestion[] = [
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

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<number, boolean>>({});

  const handleSelectAnswer = (qId: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowQuizResults((prev) => ({ ...prev, [qId]: true }));
  };

  // ==========================================
  // CODE SNIPPETS
  // ==========================================
  const codeTabs: CodeTab[] = [
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
        std::stack<int> st; // Stores indices

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

  const currParen = parenSteps[parenIndex] || parenSteps[0] || {
    currentIndex: -1,
    stackSnapshot: [],
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };
  const currMono = monoSteps[monoIndex] || monoSteps[0] || {
    currentIndex: -1,
    stackSnapshot: [],
    resultSnapshot: [],
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };

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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.2 Ngăn Xếp (Stack)</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.2
            </Badge>
            <Badge variant="easy" size="sm">
              Easy
            </Badge>
          </div>

          <Button
            variant={theoryDone ? 'success' : 'secondary'}
            size="sm"
            onClick={handleToggleTheory}
            leftIcon={
              theoryDone ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              )
            }
          >
            {theoryDone ? 'Đã Xong Lý Thuyết' : 'Đánh dấu Xong Lý Thuyết'}
          </Button>
        </div>

        <h1 className="heading-hero font-bold text-slate-900 dark:text-white tracking-tight">
          Ngăn Xếp (Stack) & Kỹ Thuật Monotonic Stack
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Nắm vững cơ chế <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">LIFO (Last In First Out)</code> với chi phí push/pop <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</code>,
          kiểm tra dãy ngoặc hợp lệ, tính biểu thức hậu tố RPN, và đột phá tư duy Monotonic Stack
          giảm độ phức tạp từ <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N²)</code> về <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N)</code>.
        </p>


        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'LIFO O(1)',
            'Fixed Array Stack',
            'Valid Parentheses',
            'RPN Calculator',
            'Min Stack O(1)',
            'Monotonic Stack',
          ].map((k, idx) => (
            <Badge key={idx} variant="slate" size="xs" className="font-mono">
              {k}
            </Badge>
          ))}
        </div>
      </Card>

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

        {/* MÔ HÌNH 1: DÃY NGOẶC HỢP LỆ */}
        <div className="space-y-4">
          <div className="border-l-4 border-teal-500 pl-4 py-1">
            <h2 className="heading-section font-bold text-slate-900 dark:text-white">
              3. Mô phỏng 1: Kiểm Tra Dãy Ngoặc Hợp Lệ (LeetCode 20)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Quan sát cơ chế Push ngoặc mở và Pop khi gặp ngoặc đóng tương ứng theo nguyên lý LIFO.
            </p>
          </div>

          <Card className="border-teal-200 dark:border-teal-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Bộ test:</span>
                <select
                  value={selectedParenDataIndex}
                  onChange={(e) => setSelectedParenDataIndex(Number(e.target.value))}
                  className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {parenDatasets.map((d, idx) => (
                    <option key={idx} value={idx}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button onClick={() => setParenSpeed(1100)} className={`px-2 py-0.5 rounded ${parenSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>0.5x</button>
                <button onClick={() => setParenSpeed(650)} className={`px-2 py-0.5 rounded ${parenSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>1x</button>
                <button onClick={() => setParenSpeed(350)} className={`px-2 py-0.5 rounded ${parenSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>2x</button>
              </div>
            </div>

            {/* Paren Visualizer */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Chuỗi đầu vào */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 mb-2 font-medium">Chuỗi ký tự đang duyệt:</span>
                <div className="flex items-center gap-2">
                  {parenDatasets[selectedParenDataIndex].str.map((ch, idx) => {
                    const isCurrent = idx === currParen.currentIndex;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-base transition-all ${
                            isCurrent
                              ? 'bg-teal-100 dark:bg-teal-900/80 border-teal-500 text-teal-800 dark:text-teal-200 scale-110 shadow-sm'
                              : idx < currParen.currentIndex
                              ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {ch}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stack dọc mô phỏng */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 mb-2 font-medium">Ngăn xếp Stack (Đỉnh ở trên):</span>
                <div className="w-20 min-h-[140px] border-2 border-t-0 border-slate-400 dark:border-slate-600 rounded-b-xl p-1.5 flex flex-col-reverse items-center gap-1.5 bg-slate-50/50 dark:bg-slate-900/40">
                  {currParen.stackSnapshot.length === 0 ? (
                    <span className="text-xs text-slate-400 my-auto font-mono">Rỗng (∅)</span>
                  ) : (
                    currParen.stackSnapshot.map((ch, idx) => {
                      const isTop = idx === currParen.stackSnapshot.length - 1;
                      return (
                        <div
                          key={idx}
                          className={`w-full py-1.5 rounded-md border text-center font-mono font-bold text-sm ${
                            isTop
                              ? 'bg-teal-500 text-white border-teal-600 shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {ch} {isTop && <span className="text-[10px] block font-normal">(TOP)</span>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* 3 dòng chuẩn */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
              <div><strong className="text-teal-600 dark:text-teal-400">Quan sát:</strong> {currParen.observation}</div>
              <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currParen.decision}</div>
              <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currParen.reason}</div>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setParenPlaying(false); setParenIndex(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setParenPlaying(false); setParenIndex((prev) => Math.max(0, prev - 1)); }}
                  disabled={parenIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={parenPlaying ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setParenPlaying(!parenPlaying)}
                  leftIcon={parenPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {parenPlaying ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setParenPlaying(false); setParenIndex((prev) => Math.min(parenSteps.length - 1, prev + 1)); }}
                  disabled={parenIndex === parenSteps.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </Card>
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

          <Card className="border-indigo-200 dark:border-indigo-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Bộ test:</span>
                <select
                  value={selectedMonoDataIndex}
                  onChange={(e) => setSelectedMonoDataIndex(Number(e.target.value))}
                  className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {monoDatasets.map((d, idx) => (
                    <option key={idx} value={idx}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button onClick={() => setMonoSpeed(1100)} className={`px-2 py-0.5 rounded ${monoSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600' : 'text-slate-500'}`}>0.5x</button>
                <button onClick={() => setMonoSpeed(650)} className={`px-2 py-0.5 rounded ${monoSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600' : 'text-slate-500'}`}>1x</button>
                <button onClick={() => setMonoSpeed(350)} className={`px-2 py-0.5 rounded ${monoSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600' : 'text-slate-500'}`}>2x</button>
              </div>
            </div>

            {/* Mono Visualizer */}
            <div className="py-6 flex flex-col items-center">
              {/* Nhiệt độ */}
              <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full mb-4">
                {monoDatasets[selectedMonoDataIndex].arr.map((val, idx) => {
                  const isCurrent = idx === currMono.currentIndex;
                  const inStack = currMono.stackSnapshot.includes(idx);
                  const isPopped = idx === currMono.poppedIndex;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${
                          isCurrent
                            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-200 scale-105 shadow-md'
                            : isPopped
                            ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200'
                            : inStack
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{val}°</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">i={idx}</span>
                    </div>
                  );
                })}
              </div>

              {/* Mảng kết quả answer */}
              <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono mb-2">
                <span className="text-slate-500 font-bold block mb-1">Mảng kết quả Answer [số ngày chờ]:</span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {currMono.resultSnapshot.map((res, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[2.5rem]">
                      <span className={`px-2 py-0.5 rounded font-bold ${res > 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {res}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 dòng chuẩn */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
              <div><strong className="text-indigo-600 dark:text-indigo-400">Quan sát:</strong> {currMono.observation}</div>
              <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currMono.decision}</div>
              <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currMono.reason}</div>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setMonoPlaying(false); setMonoIndex(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setMonoPlaying(false); setMonoIndex((prev) => Math.max(0, prev - 1)); }}
                  disabled={monoIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={monoPlaying ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setMonoPlaying(!monoPlaying)}
                  leftIcon={monoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {monoPlaying ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setMonoPlaying(false); setMonoIndex((prev) => Math.min(monoSteps.length - 1, prev + 1)); }}
                  disabled={monoIndex === monoSteps.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </Card>
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
        <CodeViewer tabs={codeTabs} defaultTabId="cpp" />
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
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          9. Kiểm Tra Nhanh
        </h2>

        <div className="space-y-4">
          {quizQuestions.map((q) => {
            const hasAnswered = !!showQuizResults[q.id];
            const userChoice = selectedAnswers[q.id];

            return (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Câu {q.id}: {q.question}
                </h3>

                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    const isCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <strong className="text-teal-600 dark:text-teal-400">Giải thích:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. BÀI TẬP RÈN LUYỆN */}
      <section className="mb-10 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          10. Bài Tập Rèn Luyện (Gợi Ý 3 Tầng)
        </h2>

        {/* Thanh điều khiển */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedPriorityFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                selectedPriorityFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
              }`}
            >
              Tất cả ({practiceProblems.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedPriorityFilter('1')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
                selectedPriorityFilter === '1'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-current" />
              Ưu tiên 1
            </button>
            <button
              type="button"
              onClick={() => setSelectedPriorityFilter('2')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                selectedPriorityFilter === '2'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              Ưu tiên 2
            </button>
            <button
              type="button"
              onClick={() => setSelectedPriorityFilter('3')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                selectedPriorityFilter === '3'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              Ưu tiên 3
            </button>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <span className="text-xs text-slate-500 font-medium">Tiến độ:</span>
            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
              {solvedCount}/{practiceProblems.length} ({Math.round((solvedCount / practiceProblems.length) * 100)}%)
            </span>
          </div>
        </div>

        {/* Problem list */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProblems.map((prob) => {
            const isDone = isProblemDone(prob.id);
            const difficultyVariant = prob.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
            const priorityVariant = `priority${prob.priority}` as 'priority1' | 'priority2' | 'priority3';
            const isHintOpen = expandedHintProblemId === prob.id;
            const currentTier = expandedHintTier[prob.id] || 0;

            return (
              <div key={prob.id} className="py-4 space-y-2">
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => handleToggleProblem(prob.id)}
                      className="mt-1 sm:mt-0 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-sm font-semibold hover:underline flex items-center gap-1.5 ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {prob.title} <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                        {prob.priority === 1 && (
                          <Badge variant={priorityVariant} size="xs" className="flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> Core
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{prob.pattern}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={difficultyVariant} size="xs">
                      {prob.difficulty}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setExpandedHintProblemId(isHintOpen ? null : prob.id)}
                      className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
                    >
                      {isHintOpen ? 'Đóng gợi ý' : 'Xem gợi ý'}
                    </button>
                  </div>
                </div>

                {/* 3-Tier Progressive Hints */}
                {isHintOpen && (
                  <div className="ml-7 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 font-medium mr-1">Chọn tầng gợi ý:</span>
                      {[1, 2, 3].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => toggleHintTier(prob.id, tier)}
                          className={`px-2 py-0.5 rounded text-xs font-mono font-medium border transition cursor-pointer ${
                            currentTier >= tier
                              ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border-teal-300'
                              : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          Tầng {tier} {tier === 1 ? '(Insight)' : tier === 2 ? '(Chiến lược)' : '(Khung code)'}
                        </button>
                      ))}
                    </div>

                    {currentTier >= 1 && (
                      <div className="p-2 rounded bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Tầng 1 (Insight):</strong> {prob.hints[0]}
                      </div>
                    )}
                    {currentTier >= 2 && (
                      <div className="p-2 rounded bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Tầng 2 (Chiến lược):</strong> {prob.hints[1]}
                      </div>
                    )}
                    {currentTier >= 3 && (
                      <div className="p-2 rounded bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Tầng 3 (Khung code):</strong> {prob.hints[2]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. TÓM TẮT & BÀI KẾ TIẾP */}
      <div className="mt-14 p-6 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Bài tiếp theo: 1.3 Hàng Đợi (Queue) & Deque
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Nguyên lý FIFO, cấu trúc Ring Buffer và Monotonic Deque cho Sliding Window Maximum.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.3')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 1.3
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_Stack;
