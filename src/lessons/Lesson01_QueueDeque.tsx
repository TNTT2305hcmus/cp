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
export interface RingBufferStep {
  buffer: (number | null)[];
  head: number;
  tail: number;
  count: number;
  action: 'INIT' | 'ENQUEUE' | 'DEQUEUE' | 'FULL';
  observation: string;
  decision: string;
  reason: string;
}

export interface MonotonicDequeStep {
  currentIndex: number;
  windowRange: [number, number];
  dequeIndices: number[]; // indices in deque
  maxResults: number[];
  action: 'INIT' | 'POP_FRONT' | 'POP_BACK' | 'PUSH' | 'RECORD_MAX' | 'DONE';
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

export const Lesson01_QueueDeque: React.FC<LessonProps> = ({
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
  // STATE MÔ HÌNH 1: RING BUFFER / CIRCULAR QUEUE (LEETCODE 622)
  // ==========================================
  const ringCap = 5;
  const [ringIndex, setRingIndex] = useState<number>(0);
  const [ringPlaying, setRingPlaying] = useState<boolean>(false);
  const [ringSpeed, setRingSpeed] = useState<number>(650);
  const ringTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ringSteps = useMemo<RingBufferStep[]>(() => {
    const steps: RingBufferStep[] = [];
    const buf: (number | null)[] = new Array(ringCap).fill(null);
    let head = 0;
    let tail = 0;
    let count = 0;

    steps.push({
      buffer: [...buf],
      head: 0,
      tail: 0,
      count: 0,
      action: 'INIT',
      observation: `Khởi tạo Ring Buffer cố định ${ringCap} ô. Head = 0, Tail = 0, Count = 0.`,
      decision: `Hàng đợi rỗng, sẵn sàng nhận các thao tác Enqueue/Dequeue.`,
      reason: `Mảng cố định với 2 con trỏ xoay vòng modulo loại bỏ hoàn toàn chi phí dời mảng O(N).`,
    });

    const operations = [
      { type: 'EN', val: 10 },
      { type: 'EN', val: 20 },
      { type: 'EN', val: 30 },
      { type: 'DE', val: 0 },
      { type: 'EN', val: 40 },
      { type: 'EN', val: 50 },
      { type: 'EN', val: 60 }, // Modulo xoay vòng về ô 0
      { type: 'DE', val: 0 },
    ];

    for (const op of operations) {
      if (op.type === 'EN') {
        if (count === ringCap) {
          steps.push({
            buffer: [...buf],
            head,
            tail,
            count,
            action: 'FULL',
            observation: `Thao tác Enqueue(${op.val}) nhưng Hàng đợi đã ĐẦY (Count = ${count}/${ringCap}).`,
            decision: `Từ chối thêm phần tử, trả về false.`,
            reason: `Buffer đạt giới hạn dung lượng cố định.`,
          });
        } else {
          buf[tail] = op.val;
          const prevTail = tail;
          tail = (tail + 1) % ringCap;
          count++;
          steps.push({
            buffer: [...buf],
            head,
            tail,
            count,
            action: 'ENQUEUE',
            observation: `Enqueue(${op.val}) vào ô [${prevTail}]. Tail xoay vòng sang (${prevTail} + 1) % ${ringCap} = ${tail}.`,
            decision: `Ghi giá trị ${op.val} và tăng Count lên ${count}.`,
            reason: `Thao tác thêm vào đuôi hàng đợi tốn O(1) tức thì.`,
          });
        }
      } else {
        if (count === 0) {
          // empty
        } else {
          const removedVal = buf[head];
          buf[head] = null;
          const prevHead = head;
          head = (head + 1) % ringCap;
          count--;
          steps.push({
            buffer: [...buf],
            head,
            tail,
            count,
            action: 'DEQUEUE',
            observation: `Dequeue() lấy phần tử ${removedVal} ở đầu (ô [${prevHead}]). Head xoay vòng sang (${prevHead} + 1) % ${ringCap} = ${head}.`,
            decision: `Xóa phần tử đầu hàng đợi và giảm Count xuống ${count}.`,
            reason: `Chỉ cần dịch con trỏ head, không cần dời các phần tử phía sau! Chi phí O(1).`,
          });
        }
      }
    }

    return steps;
  }, []);

  useEffect(() => {
    if (ringPlaying) {
      ringTimerRef.current = setInterval(() => {
        setRingIndex((prev) => {
          if (prev < ringSteps.length - 1) return prev + 1;
          setRingPlaying(false);
          return prev;
        });
      }, ringSpeed);
    } else if (ringTimerRef.current) {
      clearInterval(ringTimerRef.current);
    }
    return () => {
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    };
  }, [ringPlaying, ringSpeed, ringSteps.length]);

  // ==========================================
  // STATE MÔ HÌNH 2: MONOTONIC DEQUE (LEETCODE 239)
  // ==========================================
  const monoDatasets = [
    { label: 'Mảng mẫu K=3: [1, 3, -1, -3, 5, 3, 6, 7]', arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
    { label: 'Giảm dần K=3: [9, 7, 5, 3, 1]', arr: [9, 7, 5, 3, 1], k: 3 },
    { label: 'Tăng dần K=3: [1, 3, 5, 7, 9]', arr: [1, 3, 5, 7, 9], k: 3 },
  ];
  const [selectedMonoDataIndex, setSelectedMonoDataIndex] = useState<number>(0);
  const [monoIndex, setMonoIndex] = useState<number>(0);
  const [monoPlaying, setMonoPlaying] = useState<boolean>(false);
  const [monoSpeed, setMonoSpeed] = useState<number>(650);
  const monoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const monoSteps = useMemo<MonotonicDequeStep[]>(() => {
    const rawData = monoDatasets[selectedMonoDataIndex];
    const a = rawData.arr;
    const k = rawData.k;
    const n = a.length;
    const steps: MonotonicDequeStep[] = [];
    const dq: number[] = []; // lưu indices
    const res: number[] = [];

    steps.push({
      currentIndex: -1,
      windowRange: [0, 0],
      dequeIndices: [],
      maxResults: [],
      action: 'INIT',
      observation: `Khởi tạo: Mảng ${n} phần tử, Cửa sổ trượt kích thước K = ${k}. Deque rỗng.`,
      decision: `Bắt đầu duyệt từ chỉ số 0.`,
      reason: `Monotonic Deque lưu chỉ số có giá trị giảm dần. Giá trị ở đầu front luôn là Max của cửa sổ.`,
    });

    for (let i = 0; i < n; i++) {
      // 1. Loại bỏ phần tử trượt ra khỏi cửa sổ
      if (dq.length > 0 && dq[0] <= i - k) {
        const outIdx = dq.shift()!;
        steps.push({
          currentIndex: i,
          windowRange: [Math.max(0, i - k + 1), i],
          dequeIndices: [...dq],
          maxResults: [...res],
          action: 'POP_FRONT',
          observation: `Phần tử tại index ${outIdx} (giá trị ${a[outIdx]}) nằm ngoài cửa sổ [${i - k + 1}...${i}].`,
          decision: `Pop phần tử ở đầu Deque (pop_front).`,
          reason: `Phần tử này đã hết hạn trượt ra khỏi cửa sổ, không được giữ lại.`,
        });
      }

      // 2. Loại bỏ các phần tử ở đuôi nhỏ hơn hoặc bằng a[i]
      while (dq.length > 0 && a[dq[dq.length - 1]] <= a[i]) {
        const backIdx = dq.pop()!;
        steps.push({
          currentIndex: i,
          windowRange: [Math.max(0, i - k + 1), i],
          dequeIndices: [...dq],
          maxResults: [...res],
          action: 'POP_BACK',
          observation: `Phần tử đuôi A[${backIdx}] = ${a[backIdx]} <= phần tử mới A[${i}] = ${a[i]}.`,
          decision: `Pop phần tử ở đuôi Deque (pop_back).`,
          reason: `Phần tử ${a[backIdx]} vào trước mà lại nhỏ hơn ${a[i]}, sẽ không bao giờ có cơ hội trở thành Max nữa!`,
        });
      }

      // 3. Đưa i vào đuôi
      dq.push(i);
      steps.push({
        currentIndex: i,
        windowRange: [Math.max(0, i - k + 1), i],
        dequeIndices: [...dq],
        maxResults: [...res],
        action: 'PUSH',
        observation: `Thêm index ${i} (giá trị ${a[i]}) vào đuôi Deque.`,
        decision: `Duy trì Deque giảm dần từ front đến back.`,
        reason: `Mọi phần tử trước nó trong Deque đều lớn hơn nó.`,
      });

      // 4. Ghi nhận max khi cửa sổ đạt độ dài K
      if (i >= k - 1) {
        const currentMax = a[dq[0]];
        res.push(currentMax);
        steps.push({
          currentIndex: i,
          windowRange: [i - k + 1, i],
          dequeIndices: [...dq],
          maxResults: [...res],
          action: 'RECORD_MAX',
          observation: `Cửa sổ [${i - k + 1}...${i}] hoàn chỉnh. Đỉnh front của Deque là index ${dq[0]} (giá trị ${currentMax}).`,
          decision: `Ghi nhận Max của cửa sổ: ${currentMax}.`,
          reason: `Theo tính chất đơn điệu, phần tử đầu Deque luôn là giá trị lớn nhất trong cửa sổ.`,
        });
      }
    }

    steps.push({
      currentIndex: n,
      windowRange: [n - k, n - 1],
      dequeIndices: [...dq],
      maxResults: [...res],
      action: 'DONE',
      observation: `Hoàn tất duyệt qua toàn bộ ${n} phần tử.`,
      decision: `Mảng kết quả Max: [${res.join(', ')}].`,
      reason: `Mỗi phần tử được thêm và xóa khỏi Deque tối đa 1 lần, tổng thời gian chạy O(N).`,
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
      id: '232',
      title: '232. Implement Queue using Stacks',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
      pattern: 'Mô phỏng FIFO bằng 2 Stack LIFO (Amortized O(1))',
      priority: 1,
      hints: [
        'Stack là LIFO (đảo ngược thứ tự). Đảo ngược hai lần sẽ ra thứ tự ban đầu (FIFO)!',
        'Dùng 2 stack: stack_in nhận phần tử push. stack_out phục vụ pop và peek.',
        'Khi stack_out rỗng, chuyển toàn bộ phần tử từ stack_in sang stack_out. Mỗi phần tử chuyển đúng 1 lần nên chi phí khấu hao amortized là O(1).',
      ],
    },
    {
      id: '622',
      title: '622. Design Circular Queue',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/design-circular-queue/',
      pattern: 'Ring Buffer mảng cố định với con trỏ Modulo',
      priority: 2,
      hints: [
        'Tránh cấp phát lại bộ nhớ và tránh dời mảng khi xóa phần tử đầu.',
        'Dùng mảng cố định kích thước K cùng biến head, count (hoặc tail).',
        'Công thức xoay vòng: tail = (head + count) % K. Khi dequeue: head = (head + 1) % K, count--. Mọi hàm chạy trong O(1).',
      ],
    },
    {
      id: '641',
      title: '641. Design Circular Deque',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/design-circular-deque/',
      pattern: 'Hàng đợi 2 đầu xoay vòng (Ring Deque)',
      priority: 2,
      hints: [
        'Mở rộng Circular Queue cho phép thêm/xóa ở cả 2 đầu front và rear.',
        'Khi insertFront: front = (front - 1 + K) % K (lưu ý cộng thêm K trước khi modulo để tránh số âm trong C++).',
        'Khi deleteFront: front = (front + 1) % K. Tương tự cho rear. Duy trì biến count để kiểm tra isEmpty và isFull.',
      ],
    },
    {
      id: '239',
      title: '239. Sliding Window Maximum',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/sliding-window-maximum/',
      pattern: 'Monotonic Deque cửa sổ trượt O(N)',
      priority: 3,
      hints: [
        'Vét cạn O(N × K) dính TLE khi N = 10⁵, K = 50,000. Cần tìm max mỗi cửa sổ trong O(1).',
        'Dùng std::deque lưu chỉ số theo thứ tự giá trị giảm dần. Loại bỏ phần tử lỗi thời ở đầu (dq.front() <= i - k).',
        'Trước khi push i vào đuôi, pop_back mọi phần tử có a[dq.back()] <= a[i]. Ghi nhận ans.push_back(a[dq.front()]) khi i >= k - 1.',
      ],
    },
    {
      id: '862',
      title: '862. Shortest Subarray with Sum at Least K',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/',
      pattern: 'Monotonic Deque trên Prefix Sum có số âm',
      priority: 3,
      hints: [
        'Mảng có chứa số âm nên Two Pointers/Sliding Window thông thường thất bại vì tính đơn điệu của tổng đoạn bị phá vỡ.',
        'Tính mảng cộng dồn Prefix Sum: P[j] - P[i] >= K (tìm j - i nhỏ nhất).',
        'Dùng Monotonic Deque lưu chỉ số i có P[i] tăng dần. Khi P[j] - P[dq.front()] >= K: cập nhật minLength và pop_front (vì các j sau ghép với dq.front() sẽ cho độ dài lớn hơn).',
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
      question: 'Tại sao trong Monotonic Deque giải bài Sliding Window Maximum ta nên lưu chỉ số (indices) thay vì giá trị phần tử?',
      options: [
        'Vì lưu chỉ số tốn ít bộ nhớ RAM hơn lưu giá trị int',
        'Vì cần dùng chỉ số để kiểm tra xem phần tử ở đầu Deque đã hết hạn trượt ra ngoài cửa sổ (front <= i - k) hay chưa',
        'Vì C++ không hỗ trợ deque lưu kiểu số âm',
        'Vì LeetCode yêu cầu trả về danh sách các chỉ số',
      ],
      correctIndex: 1,
      explanation: 'Nếu chỉ lưu giá trị, bạn sẽ không thể biết được phần tử lớn nhất đó đang nằm ở vị trí nào trong mảng và liệu nó đã trượt ra ngoài phạm vi cửa sổ hiện tại (i - k + 1) hay chưa.',
    },
    {
      id: 2,
      question: 'Trong Ring Buffer mảng cố định kích thước K = 5, nếu con trỏ tail đang ở ô số 4 và thực hiện Enqueue thành công, tail tiếp theo sẽ ở ô nào?',
      options: [
        'Ô số 5 (báo lỗi tràn mảng)',
        'Ô số 0 theo công thức (4 + 1) % 5 = 0',
        'Ô số 4 giữ nguyên',
        'Ô số 1',
      ],
      correctIndex: 1,
      explanation: 'Phép toán modulo (tail + 1) % K giúp con trỏ tự động xoay vòng về đầu mảng (ô 0) khi chạm tới cuối, tạo thành cấu trúc vòng tròn hoàn hảo.',
    },
    {
      id: 3,
      question: 'Độ phức tạp thời gian của thuật toán Monotonic Deque cho bài toán Sliding Window Maximum trên mảng N phần tử là bao nhiêu?',
      options: [
        'O(N × K)',
        'O(N log K)',
        'O(N) tuyến tính',
        'O(K log N)',
      ],
      correctIndex: 2,
      explanation: 'Mỗi chỉ số từ 0 đến N-1 được push vào Deque đúng 1 lần và pop ra khỏi Deque tối đa 1 lần (hoặc qua pop_front khi hết hạn, hoặc qua pop_back khi gặp số lớn hơn). Tổng số thao tác trên Deque <= 2N, đạt O(N).',
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
      label: 'sliding_window_max.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: `// LeetCode 239 - Sliding Window Maximum
// Time Complexity: O(N) | Space Complexity: O(K)
#include <vector>
#include <deque>

class Solution {
public:
    std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
        int n = static_cast<int>(nums.size());
        std::vector<int> result;
        result.reserve(n - k + 1);
        std::deque<int> dq; // Stores indices of elements in decreasing order

        for (int i = 0; i < n; ++i) {
            // 1. Remove indices that are out of current window [i - k + 1, i]
            if (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }

            // 2. Remove indices whose values are smaller than or equal to nums[i]
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }

            // 3. Push current index
            dq.push_back(i);

            // 4. Record maximum when window reaches size k
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }

        return result;
    }
};`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 239 - Sliding Window Maximum
// Time Complexity: O(N) | Space Complexity: O(K)
#include <vector>
#include <deque>

class Solution {
public:
    std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
        int n = static_cast<int>(nums.size());
        std::vector<int> result;
        result.reserve(n - k + 1);
        std::deque<int> dq; // Stores indices

        for (int i = 0; i < n; ++i) {
            // 1. Remove expired elements from front
            if (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }

            // 2. Maintain decreasing order by popping smaller elements from back
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }

            // 3. Add current element index
            dq.push_back(i);

            // 4. The front of deque is always the maximum of window
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        return result;
    }
};`}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'sliding_window_max.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: `# LeetCode 239 - Sliding Window Maximum
# Time Complexity: O(N) | Space Complexity: O(K)
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()  # Stores indices
        result = []

        for i, val in enumerate(nums):
            # Remove expired elements
            if dq and dq[0] <= i - k:
                dq.popleft()

            # Remove smaller elements from back
            while dq and nums[dq[-1]] <= val:
                dq.pop()

            dq.append(i)

            # Record max
            if i >= k - 1:
                result.append(nums[dq[0]])

        return result`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`# LeetCode 239 - Sliding Window Maximum
# Time Complexity: O(N) | Space Complexity: O(K)
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()  # Stores indices
        result = []

        for i, val in enumerate(nums):
            if dq and dq[0] <= i - k:
                dq.popleft()

            while dq and nums[dq[-1]] <= val:
                dq.pop()

            dq.append(i)

            if i >= k - 1:
                result.append(nums[dq[0]])

        return result`}</pre>
        </div>
      ),
    },
    {
      id: 'ts',
      label: 'sliding_window_max.ts',
      language: 'typescript',
      iconColor: '#3178c6',
      rawCode: `// LeetCode 239 - Sliding Window Maximum
// Time Complexity: O(N) | Space Complexity: O(K)
function maxSlidingWindow(nums: number[], k: number): number[] {
    const n = nums.length;
    const result: number[] = [];
    const dq: number[] = []; // Stores indices

    for (let i = 0; i < n; i++) {
        if (dq.length > 0 && dq[0] <= i - k) {
            dq.shift();
        }

        while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[i]) {
            dq.pop();
        }

        dq.push(i);

        if (i >= k - 1) {
            result.push(nums[dq[0]]);
        }
    }

    return result;
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 239 - Sliding Window Maximum
// Time Complexity: O(N) | Space Complexity: O(K)
function maxSlidingWindow(nums: number[], k: number): number[] {
    const n = nums.length;
    const result: number[] = [];
    const dq: number[] = [];

    for (let i = 0; i < n; i++) {
        if (dq.length > 0 && dq[0] <= i - k) {
            dq.shift();
        }

        while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[i]) {
            dq.pop();
        }

        dq.push(i);

        if (i >= k - 1) {
            result.push(nums[dq[0]]);
        }
    }
    return result;
}`}</pre>
        </div>
      ),
    },
  ];

  const currRing = ringSteps[ringIndex] || ringSteps[0] || {
    buffer: [],
    head: 0,
    tail: 0,
    count: 0,
    action: 'INIT',
    observation: '',
    decision: '',
    reason: '',
  };
  const currMono = monoSteps[monoIndex] || monoSteps[0] || {
    currentIndex: -1,
    windowRange: [0, 0],
    dequeIndices: [],
    maxResults: [],
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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.3 Hàng Đợi (Queue) & Deque</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.3
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
          Hàng Đợi (Queue), Deque & Monotonic Deque
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Nắm vững cơ chế <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">FIFO (First In First Out)</code>,
          cài đặt Ring Buffer mảng cố định không phân mảnh bộ nhớ, và làm chủ cấu trúc
          Monotonic Deque giải quyết bài toán Sliding Window Maximum từ <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N × K)</code> về <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N)</code>.
        </p>


        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'FIFO O(1)',
            'Ring Buffer Modulo',
            'std::deque Memory Chunk',
            'Monotonic Deque',
            'Sliding Window Maximum',
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

          <Card className="border-teal-200 dark:border-teal-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-mono">
                Buffer kích thước cố định K = 5
              </span>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button onClick={() => setRingSpeed(1100)} className={`px-2 py-0.5 rounded ${ringSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>0.5x</button>
                <button onClick={() => setRingSpeed(650)} className={`px-2 py-0.5 rounded ${ringSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>1x</button>
                <button onClick={() => setRingSpeed(350)} className={`px-2 py-0.5 rounded ${ringSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>2x</button>
              </div>
            </div>

            {/* Ring Visualizer */}
            <div className="py-6 flex flex-col items-center">
              {/* Stat badges */}
              <div className="flex items-center gap-6 mb-4 font-mono text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Head (lấy ra):</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                    {currRing.head}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Tail (thêm vào):</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                    {currRing.tail}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Số phần tử:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                    {currRing.count}/{ringCap}
                  </span>
                </div>
              </div>

              {/* Buffer Slots */}
              <div className="flex items-center gap-2.5 overflow-x-auto p-2 max-w-full">
                {currRing.buffer.map((val, idx) => {
                  const isHead = idx === currRing.head && currRing.count > 0;
                  const isTail = idx === currRing.tail;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Pointer marker */}
                      <div className="h-5 flex items-center justify-center text-[10px] font-mono font-bold">
                        {isHead && <span className="text-teal-600 dark:text-teal-400 mr-1">HEAD</span>}
                        {isTail && <span className="text-indigo-600 dark:text-indigo-400">TAIL</span>}
                      </div>

                      {/* Cell */}
                      <div
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-base transition-all ${
                          val !== null
                            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-800 dark:text-teal-200 shadow-xs'
                            : 'bg-slate-100/60 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {val !== null ? val : '∅'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">ô {idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 dòng chuẩn */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
              <div><strong className="text-teal-600 dark:text-teal-400">Quan sát:</strong> {currRing.observation}</div>
              <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currRing.decision}</div>
              <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currRing.reason}</div>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setRingPlaying(false); setRingIndex(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setRingPlaying(false); setRingIndex((prev) => Math.max(0, prev - 1)); }}
                  disabled={ringIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={ringPlaying ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setRingPlaying(!ringPlaying)}
                  leftIcon={ringPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {ringPlaying ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setRingPlaying(false); setRingIndex((prev) => Math.min(ringSteps.length - 1, prev + 1)); }}
                  disabled={ringIndex === ringSteps.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </Card>
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
              {/* Mảng ban đầu và khung cửa sổ */}
              <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full mb-4">
                {monoDatasets[selectedMonoDataIndex].arr.map((val, idx) => {
                  const inWindow = idx >= currMono.windowRange[0] && idx <= currMono.windowRange[1];
                  const inDeque = currMono.dequeIndices.includes(idx);
                  const isFront = currMono.dequeIndices[0] === idx;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${
                          isFront
                            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-200 scale-105 shadow-md'
                            : inDeque
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                            : inWindow
                            ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>{val}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">i={idx}</span>
                    </div>
                  );
                })}
              </div>

              {/* Khối Deque ngang */}
              <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Trạng thái Monotonic Deque [Front → Back]:
                  </span>
                  <span className="text-slate-400 text-[11px]">Đầu Front luôn là Max</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {currMono.dequeIndices.length === 0 ? (
                    <span className="text-slate-400">Deque rỗng</span>
                  ) : (
                    currMono.dequeIndices.map((dIdx, pos) => (
                      <span
                        key={dIdx}
                        className={`px-2.5 py-1 rounded font-bold border ${
                          pos === 0
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-400'
                            : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border-indigo-300'
                        }`}
                      >
                        idx={dIdx} (val={monoDatasets[selectedMonoDataIndex].arr[dIdx]}) {pos === 0 && '★ FRONT MAX'}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Mảng kết quả Result */}
              <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <span className="text-teal-600 dark:text-teal-400 font-bold block mb-1">Mảng kết quả Maximums:</span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {currMono.maxResults.length === 0 ? (
                    <span className="text-slate-400">Đang lấp đầy cửa sổ đầu tiên...</span>
                  ) : (
                    currMono.maxResults.map((resVal, rIdx) => (
                      <span key={rIdx} className="px-2.5 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {resVal}
                      </span>
                    ))
                  )}
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
              className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
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
            Bài tiếp theo: 1.4 Heap (Priority Queue)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cấu trúc Min-Heap, Max-Heap và duy trì Top-K phần tử trong luồng dữ liệu.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.4')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 1.4
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_QueueDeque;
