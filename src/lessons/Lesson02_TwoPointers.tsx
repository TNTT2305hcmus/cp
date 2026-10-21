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
  ArrowRight,
} from 'lucide-react';
import { Button, Badge, Card, CodeViewer, type CodeTab } from '../components';

// ==========================================
// TYPES
// ==========================================
export interface Model1Step {
  left: number;
  right: number;
  currentSum: number;
  observation: string;
  decision: string;
  reason: string;
  isFound: boolean;
  highlightedIndices: number[];
}

export interface Model2Step {
  slow: number;
  fast: number;
  currentArray: number[];
  observation: string;
  decision: string;
  reason: string;
  action: 'init' | 'match' | 'diff' | 'done';
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  pattern: string;
  priority: 1 | 2 | 3;
  hints: [string, string, string]; // 3-tier hints
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

export const Lesson02_TwoPointers: React.FC<LessonProps> = ({
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
  // STATE MÔ HÌNH 1: HAI CON TRỎ ĐỐI ĐẦU (TWO SUM II)
  // ==========================================
  const model1Datasets = [
    { label: 'Có đáp án (Target = 19)', arr: [2, 3, 5, 8, 11, 15, 18, 22], target: 19 },
    { label: 'Không có đáp án (Target = 24)', arr: [2, 3, 5, 8, 11, 15, 18, 22], target: 24 },
    { label: 'Mảng có số âm (Target = 0)', arr: [-8, -3, -1, 0, 1, 4, 8, 12], target: 0 },
  ];
  const [selectedM1DataIndex, setSelectedM1DataIndex] = useState<number>(0);
  const [model1Index, setModel1Index] = useState<number>(0);
  const [model1Playing, setModel1Playing] = useState<boolean>(false);
  const [model1Speed, setModel1Speed] = useState<number>(650);
  const model1TimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const model1Steps = useMemo<Model1Step[]>(() => {
    const data = model1Datasets[selectedM1DataIndex];
    const arr = data.arr;
    const target = data.target;
    const steps: Model1Step[] = [];
    let l = 0;
    let r = arr.length - 1;

    steps.push({
      left: l,
      right: r,
      currentSum: arr[l] + arr[r],
      observation: `Khởi tạo: Con trỏ L = 0 (A[L]=${arr[l]}), con trỏ R = ${r} (A[R]=${arr[r]}). Tổng = ${arr[l] + arr[r]}.`,
      decision: `So sánh Tổng hiện tại với Target = ${target}.`,
      reason: `Mảng đã sắp xếp: A[0] nhỏ nhất, A[${r}] lớn nhất.`,
      isFound: false,
      highlightedIndices: [l, r],
    });

    while (l < r) {
      const sum = arr[l] + arr[r];
      if (sum === target) {
        steps.push({
          left: l,
          right: r,
          currentSum: sum,
          observation: `Tổng A[${l}] (${arr[l]}) + A[${r}] (${arr[r]}) == Target (${target}).`,
          decision: `TÌM THẤY ĐÁP ÁN! Chỉ số 1-indexed: [${l + 1}, ${r + 1}].`,
          reason: `Tổng hai phần tử khớp chính xác với yêu cầu đề bài.`,
          isFound: true,
          highlightedIndices: [l, r],
        });
        break;
      } else if (sum < target) {
        steps.push({
          left: l,
          right: r,
          currentSum: sum,
          observation: `Tổng (${sum}) < Target (${target}): Tổng đang nhỏ hơn mục tiêu.`,
          decision: `Dịch con trỏ trái sang phải: L++ -> ${l + 1}.`,
          reason: `Vì mảng tăng dần, ghép A[${l}] với bất kỳ số nào trước R cũng đều nhỏ hơn ${sum}. Do đó loại hẳn A[${l}].`,
          isFound: false,
          highlightedIndices: [l, r],
        });
        l++;
      } else {
        steps.push({
          left: l,
          right: r,
          currentSum: sum,
          observation: `Tổng (${sum}) > Target (${target}): Tổng đang lớn hơn mục tiêu.`,
          decision: `Dịch con trỏ phải sang trái: R-- -> ${r - 1}.`,
          reason: `Ghép A[${r}] với bất kỳ số nào sau L cũng đều lớn hơn ${sum}. Do đó loại hẳn A[${r}].`,
          isFound: false,
          highlightedIndices: [l, r],
        });
        r--;
      }
    }

    if (steps.length > 0 && !steps[steps.length - 1].isFound) {
      steps.push({
        left: l,
        right: r,
        currentSum: 0,
        observation: `Hai con trỏ đã gặp nhau (L >= R) mà không có cặp nào bằng ${target}.`,
        decision: `Kết luận: Mảng không tồn tại cặp số thỏa mãn.`,
        reason: `Toàn bộ không gian tìm kiếm N*(N-1)/2 đã được triệt tiêu an toàn.`,
        isFound: false,
        highlightedIndices: [],
      });
    }

    return steps;
  }, [selectedM1DataIndex]);

  useEffect(() => {
    setModel1Index(0);
    setModel1Playing(false);
  }, [selectedM1DataIndex]);

  useEffect(() => {
    if (model1Playing) {
      model1TimerRef.current = setInterval(() => {
        setModel1Index((prev) => {
          if (prev < model1Steps.length - 1) return prev + 1;
          setModel1Playing(false);
          return prev;
        });
      }, model1Speed);
    } else if (model1TimerRef.current) {
      clearInterval(model1TimerRef.current);
    }
    return () => {
      if (model1TimerRef.current) clearInterval(model1TimerRef.current);
    };
  }, [model1Playing, model1Speed, model1Steps.length]);

  // ==========================================
  // STATE MÔ HÌNH 2: FAST & SLOW (LEETCODE 26)
  // ==========================================
  const model2Datasets = [
    { label: 'Có trùng: [1, 1, 2, 2, 3, 4, 4, 5]', arr: [1, 1, 2, 2, 3, 4, 4, 5] },
    { label: 'Không trùng: [1, 2, 3, 4, 5]', arr: [1, 2, 3, 4, 5] },
    { label: 'Toàn bộ trùng: [2, 2, 2, 2]', arr: [2, 2, 2, 2] },
  ];
  const [selectedM2DataIndex, setSelectedM2DataIndex] = useState<number>(0);
  const [model2Index, setModel2Index] = useState<number>(0);
  const [model2Playing, setModel2Playing] = useState<boolean>(false);
  const [model2Speed, setModel2Speed] = useState<number>(650);
  const model2TimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const model2Steps = useMemo<Model2Step[]>(() => {
    const raw = [...model2Datasets[selectedM2DataIndex].arr];
    const steps: Model2Step[] = [];
    const arr = [...raw];
    let slow = 0;

    steps.push({
      slow: 0,
      fast: 1,
      currentArray: [...arr],
      action: 'init',
      observation: `Khởi tạo: arr[0] = ${arr[0]} luôn là phần tử duy nhất đầu tiên.`,
      decision: `Con trỏ SLOW = 0 (vị trí ghi nhận), con trỏ FAST = 1 (thám thính).`,
      reason: `Mảng đã sắp xếp: Các phần tử trùng lặp luôn đứng liền kề nhau.`,
    });

    for (let fast = 1; fast < arr.length; fast++) {
      if (arr[fast] === arr[slow]) {
        steps.push({
          slow,
          fast,
          currentArray: [...arr],
          action: 'match',
          observation: `arr[FAST=${fast}] (${arr[fast]}) trùng với arr[SLOW=${slow}] (${arr[slow]}).`,
          decision: `Bỏ qua! FAST tiếp tục tiến lên tìm giá trị mới (fast++ -> ${fast + 1}).`,
          reason: `Phần tử trùng lặp không được ghi nhận vào vùng duy nhất.`,
        });
      } else {
        slow++;
        arr[slow] = arr[fast];
        steps.push({
          slow,
          fast,
          currentArray: [...arr],
          action: 'diff',
          observation: `arr[FAST=${fast}] (${arr[fast]}) là giá trị MỚI chưa từng có!`,
          decision: `Tăng SLOW -> ${slow}, ghi đè arr[SLOW] = ${arr[fast]}.`,
          reason: `Mở rộng vùng các phần tử duy nhất [0...SLOW].`,
        });
      }
    }

    steps.push({
      slow,
      fast: arr.length,
      currentArray: [...arr],
      action: 'done',
      observation: `FAST đã duyệt hết toàn bộ mảng.`,
      decision: `Hoàn tất! Mảng có ${slow + 1} phần tử duy nhất ở tiền tố [0...${slow}].`,
      reason: `Thuật toán chạy trong 1 lượt duyệt duy nhất O(N) và O(1) in-place.`,
    });

    return steps;
  }, [selectedM2DataIndex]);

  useEffect(() => {
    setModel2Index(0);
    setModel2Playing(false);
  }, [selectedM2DataIndex]);

  useEffect(() => {
    if (model2Playing) {
      model2TimerRef.current = setInterval(() => {
        setModel2Index((prev) => {
          if (prev < model2Steps.length - 1) return prev + 1;
          setModel2Playing(false);
          return prev;
        });
      }, model2Speed);
    } else if (model2TimerRef.current) {
      clearInterval(model2TimerRef.current);
    }
    return () => {
      if (model2TimerRef.current) clearInterval(model2TimerRef.current);
    };
  }, [model2Playing, model2Speed, model2Steps.length]);

  // ==========================================
  // PRACTICE PROBLEMS VỚI GỢI Ý 3 TẦNG (PLANNING.md)
  // ==========================================
  const practiceProblems: PracticeProblem[] = [
    {
      id: '167',
      title: '167. Two Sum II - Input Array Is Sorted',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
      pattern: 'Hai con trỏ đối đầu co dần',
      priority: 1,
      hints: [
        'Mảng đã sắp xếp tăng dần. Nếu tổng hiện tại quá nhỏ, bạn nên thay đổi con trỏ nào để làm tăng tổng?',
        'Đặt L = 0, R = N - 1. Nếu sum < target: tăng L. Nếu sum > target: giảm R.',
        'Vòng lặp while (L < R). Trả về [L + 1, R + 1] (chú ý đề bài yêu cầu chỉ số 1-indexed). Time O(N), Space O(1).',
      ],
    },
    {
      id: '11',
      title: '11. Container With Most Water',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/container-with-most-water/',
      pattern: 'Loại trừ biên thấp hơn',
      priority: 1,
      hints: [
        'Lượng nước chứa được bị giới hạn bởi cột thấp hơn trong hai cột: min(H[L], H[R]) * (R - L).',
        'Khi thu hẹp khoảng cách (R - L giảm), nếu bạn dịch chuyển cột cao hơn thì chiều cao không thể tăng mà khoảng cách lại giảm. Vì vậy bắt buộc phải dịch chuyển cột thấp hơn.',
        'L = 0, R = N - 1. Nếu H[L] < H[R] thì L++, ngược lại R--. Liên tục cập nhật maxArea. Time O(N), Space O(1).',
      ],
    },
    {
      id: '15',
      title: '15. 3Sum',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/3sum/',
      pattern: 'Sort + Cố định 1 phần tử + Two Pointers',
      priority: 1,
      hints: [
        'Bài toán 3 số a + b + c = 0 có thể quy về: Cố định a, tìm 2 số b + c = -a trên mảng đã sắp xếp.',
        'Sắp xếp mảng tăng dần. Duyệt i từ 0 đến N - 3. Với mỗi i, dùng Two Pointers đối đầu trên đoạn [i + 1, N - 1] tìm cặp có tổng bằng -nums[i].',
        'Cẩn thận bẫy trùng lặp: Sau khi chọn xong i hoặc tìm thấy cặp (L, R), phải dùng while bỏ qua các giá trị trùng: while (L < R && nums[L] == nums[L+1]) L++.',
      ],
    },
    {
      id: '125',
      title: '125. Valid Palindrome',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/valid-palindrome/',
      pattern: 'Chuỗi đối xứng hai đầu',
      priority: 1,
      hints: [
        'Bỏ qua các ký tự không phải chữ cái và số (dùng isalnum) và chuyển về chữ thường (tolower).',
        'Đặt L = 0, R = len - 1. Nếu ký tự tại L không hợp lệ thì L++. Nếu tại R không hợp lệ thì R--.',
        'So sánh tolower(s[L]) != tolower(s[R]): nếu khác nhau thì return false, ngược lại L++, R--.',
      ],
    },
    {
      id: '26',
      title: '26. Remove Duplicates from Sorted Array',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
      pattern: 'Fast & Slow Pointers ghi đè in-place',
      priority: 2,
      hints: [
        'Dùng 1 con trỏ slow để đánh dấu vị trí ghi nhận phần tử duy nhất, và con trỏ fast để thám thính.',
        'Duyệt fast từ 1 đến N - 1. Nếu nums[fast] != nums[slow], tăng slow lên 1 và ghi đè nums[slow] = nums[fast].',
        'Trả về slow + 1 là số lượng phần tử duy nhất. Time O(N), Space O(1).',
      ],
    },
    {
      id: '283',
      title: '283. Move Zeroes',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/move-zeroes/',
      pattern: 'Fast & Slow Pointers dồn số 0',
      priority: 2,
      hints: [
        'Tương tự như Remove Duplicates: dồn tất cả các số khác 0 về phía trước.',
        'Con trỏ nonZeroPos = 0. Duyệt i từ 0 đến N - 1: nếu nums[i] != 0, swap(nums[nonZeroPos++], nums[i]).',
        'Thao tác swap đảm bảo tất cả các số 0 tự động bị đẩy dần về phía đuôi mảng trong O(N).',
      ],
    },
    {
      id: '977',
      title: '977. Squares of a Sorted Array',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
      pattern: 'Two Pointers điền từ đuôi về đầu',
      priority: 2,
      hints: [
        'Mảng đã sắp xếp có số âm. Bình phương lớn nhất chắc chắn nằm ở một trong hai đầu: nums[0]² hoặc nums[N-1]².',
        'Đặt L = 0, R = N - 1, và con trỏ p = N - 1 trên mảng kết quả.',
        'So sánh nums[L]² và nums[R]²: số nào lớn hơn thì đặt vào ans[p--] rồi dịch con trỏ tương ứng. Time O(N), Space O(N).',
      ],
    },
    {
      id: '42',
      title: '42. Trapping Rain Water',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/trapping-rain-water/',
      pattern: 'Hai con trỏ co dần tối ưu không gian O(1)',
      priority: 2,
      hints: [
        'Lượng nước đọng tại cột i bằng max(0, min(max_left, max_right) - height[i]).',
        'Dùng 2 con trỏ L = 0, R = N - 1 cùng 2 biến leftMax và rightMax.',
        'Nếu height[L] < height[R]: chắc chắn leftMax < rightMax, lượng nước tại L chỉ phụ thuộc vào leftMax. Cập nhật leftMax và tính nước tại L, sau đó L++. Ngược lại xử lý bên R.',
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
      question: 'Trong kỹ thuật Hai con trỏ đối đầu (Two Sum II), tại sao khi Tổng < Target ta lại loại bỏ con trỏ Left mà không sợ bỏ sót nghiệm?',
      options: [
        'Vì đề bài quy định mảng tăng dần nên số bên trái luôn không hợp lệ',
        'Vì mảng đã sắp xếp: ghép A[Left] với bất kỳ phần tử nào trước Right cũng đều cho tổng nhỏ hơn nữa, nên A[Left] không thể ghép với ai để bằng Target',
        'Vì con trỏ Left chỉ được phép tăng chứ không được giảm',
        'Vì ta đã thử mọi khả năng bằng đệ quy ngầm',
      ],
      correctIndex: 1,
      explanation: 'Do tính đơn điệu của mảng tăng dần: với mọi j < Right, ta có A[Left] + A[j] <= A[Left] + A[Right] < Target. Do đó A[Left] hoàn toàn không thể tham gia vào bất kỳ cặp nghiệm nào.',
    },
    {
      id: 2,
      question: 'Trong bài toán Container With Most Water, tại sao ta luôn phải di chuyển con trỏ có chiều cao THẤP HƠN?',
      options: [
        'Vì di chuyển cột cao hơn sẽ làm giảm chiều rộng (R - L) mà chiều cao bị chặn trên bởi min(H[L], H[R]) không thể tăng thêm',
        'Vì cột thấp hơn chứa ít nước hơn nên bỏ đi',
        'Vì thuật toán tham lam yêu cầu giữ lại phần tử lớn nhất',
        'Vì LeetCode bắt buộc di chuyển cột thấp hơn',
      ],
      correctIndex: 0,
      explanation: 'Diện tích = min(H[L], H[R]) × (R - L). Khi dịch con trỏ, khoảng cách (R - L) chắc chắn giảm. Nếu giữ cột thấp và dịch cột cao, chiều cao mới <= cột thấp, diện tích chắc chắn giảm. Chỉ có dịch cột thấp mới có cơ hội gặp cột cao hơn để bù lại khoảng cách bị giảm.',
    },
    {
      id: 3,
      question: 'Độ phức tạp không gian (Space Complexity) của thuật toán Two Sum II dùng Hai con trỏ đối đầu là bao nhiêu?',
      options: [
        'O(N) do phải lưu trữ mảng phụ',
        'O(1) bộ nhớ bổ sung vì chỉ dùng 2 biến con trỏ',
        'O(log N) do sắp xếp nội tại',
        'O(Target)',
      ],
      correctIndex: 1,
      explanation: 'Thuật toán Two Pointers đối đầu chỉ cần đúng 2 biến chỉ số left và right, không cấp phát bất kỳ mảng phụ hay bảng băm nào, đạt O(1) Auxiliary Space tuyệt đối.',
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
      label: 'two_sum_ii.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: `// LeetCode 167 - Two Sum II (Input Array Is Sorted)
// Time Complexity: O(N) | Space Complexity: O(1)
#include <vector>

class Solution {
public:
    std::vector<int> twoSum(const std::vector<int>& numbers, int target) {
        int left = 0;
        int right = static_cast<int>(numbers.size()) - 1;

        while (left < right) {
            long long current_sum = static_cast<long long>(numbers[left]) + numbers[right];

            if (current_sum == target) {
                // 1-indexed output as required by LeetCode 167
                return {left + 1, right + 1};
            } else if (current_sum < target) {
                left++; // Increase sum by moving left boundary
            } else {
                right--; // Decrease sum by moving right boundary
            }
        }

        return {}; // No solution found
    }
};`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 167 - Two Sum II (Input Array Is Sorted)
// Time Complexity: O(N) | Space Complexity: O(1)
#include <vector>

class Solution {
public:
    std::vector<int> twoSum(const std::vector<int>& numbers, int target) {
        int left = 0;
        int right = static_cast<int>(numbers.size()) - 1;

        while (left < right) {
            long long current_sum = static_cast<long long>(numbers[left]) + numbers[right];

            if (current_sum == target) {
                return {left + 1, right + 1}; // 1-indexed
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return {};
    }
};`}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'two_sum_ii.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: `# LeetCode 167 - Two Sum II
# Time Complexity: O(N) | Space Complexity: O(1)
class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        left, right = 0, len(numbers) - 1

        while left < right:
            current_sum = numbers[left] + numbers[right]
            if current_sum == target:
                return [left + 1, right + 1]
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        return []`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`# LeetCode 167 - Two Sum II
# Time Complexity: O(N) | Space Complexity: O(1)
class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        left, right = 0, len(numbers) - 1

        while left < right:
            current_sum = numbers[left] + numbers[right]
            if current_sum == target:
                return [left + 1, right + 1]
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        return []`}</pre>
        </div>
      ),
    },
    {
      id: 'ts',
      label: 'two_sum_ii.ts',
      language: 'typescript',
      iconColor: '#3178c6',
      rawCode: `// LeetCode 167 - Two Sum II
// Time Complexity: O(N) | Space Complexity: O(1)
function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const currentSum = numbers[left] + numbers[right];
        if (currentSum === target) {
            return [left + 1, right + 1];
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return [];
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 167 - Two Sum II
// Time Complexity: O(N) | Space Complexity: O(1)
function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const currentSum = numbers[left] + numbers[right];
        if (currentSum === target) {
            return [left + 1, right + 1];
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return [];
}`}</pre>
        </div>
      ),
    },
  ];

  const currStep1 = model1Steps[model1Index] || model1Steps[0] || {
    left: 0,
    right: 0,
    currentSum: 0,
    observation: '',
    decision: '',
    reason: '',
    isFound: false,
    highlightedIndices: [],
  };
  const currStep2 = model2Steps[model2Index] || model2Steps[0] || {
    slow: 0,
    fast: 1,
    currentArray: [],
    action: 'init',
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
          onClick={() => onSelectSubtopic?.('2.0')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline text-slate-700 dark:text-slate-300 font-semibold"
        >
          Tháng 2: Một Số Kỹ Thuật Căn Bản
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-teal-600 dark:text-teal-400 font-semibold">2.1 Kỹ thuật Hai con trỏ (Two Pointers)</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 2 • 2.1
            </Badge>
            <Badge variant="medium" size="sm">
              Medium
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
          Kỹ Thuật Hai Con Trỏ (Two Pointers)
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Bản chất triệt tiêu không gian tìm kiếm dựa trên tính đơn điệu, tối ưu độ phức tạp từ <code className="font-mono text-rose-600 dark:text-rose-400 font-semibold">O(N²)</code> về <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(N)</code> và không gian <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">O(1)</code>.
          Làm chủ 2 mô hình kinh điển: Đối đầu co dần và Cùng chiều (Fast & Slow).
        </p>


        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'Hai con trỏ đối đầu',
            'Fast & Slow Pointers',
            'Two Sum II',
            'Container With Most Water',
            '3Sum Dup Skipping',
            'In-place Modification',
          ].map((k, idx) => (
            <Badge key={idx} variant="slate" size="xs" className="font-mono">
              {k}
            </Badge>
          ))}
        </div>
      </Card>

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

          <Card className="border-sky-200 dark:border-sky-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Bộ test:</span>
                <select
                  value={selectedM1DataIndex}
                  onChange={(e) => setSelectedM1DataIndex(Number(e.target.value))}
                  className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {model1Datasets.map((d, idx) => (
                    <option key={idx} value={idx}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button onClick={() => setModel1Speed(1100)} className={`px-2 py-0.5 rounded ${model1Speed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-sky-600' : 'text-slate-500'}`}>0.5x</button>
                <button onClick={() => setModel1Speed(650)} className={`px-2 py-0.5 rounded ${model1Speed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-sky-600' : 'text-slate-500'}`}>1x</button>
                <button onClick={() => setModel1Speed(350)} className={`px-2 py-0.5 rounded ${model1Speed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-sky-600' : 'text-slate-500'}`}>2x</button>
              </div>
            </div>

            {/* M1 Visualizer */}
            <div className="py-6 flex flex-col items-center">
              {/* Stat badges */}
              <div className="flex items-center gap-6 mb-4 font-mono text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Target:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                    {model1Datasets[selectedM1DataIndex].target}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Tổng A[L] + A[R]:</span>
                  <span className={`font-bold px-2 py-0.5 rounded border ${
                    currStep1.isFound
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                  }`}>
                    {currStep1.currentSum}
                  </span>
                </div>
              </div>

              {/* Array Cells */}
              <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full">
                {model1Datasets[selectedM1DataIndex].arr.map((val, idx) => {
                  const isLeft = idx === currStep1.left;
                  const isRight = idx === currStep1.right;
                  const isEliminated = idx < currStep1.left || idx > currStep1.right;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Pointer marker */}
                      <div className="h-6 flex items-center justify-center text-xs font-mono font-bold">
                        {isLeft && <span className="text-sky-600 dark:text-sky-400">L</span>}
                        {isRight && <span className="text-amber-600 dark:text-amber-400">R</span>}
                      </div>

                      {/* Cell */}
                      <div
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-150 ${
                          currStep1.isFound && (isLeft || isRight)
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 scale-105 shadow-md'
                            : isLeft
                            ? 'bg-sky-100 dark:bg-sky-950/80 border-sky-500 text-sky-800 dark:text-sky-200 scale-105 shadow-md'
                            : isRight
                            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-200 scale-105 shadow-md'
                            : isEliminated
                            ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {val}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 dòng chuẩn */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
              <div><strong className="text-sky-600 dark:text-sky-400">Quan sát:</strong> {currStep1.observation}</div>
              <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currStep1.decision}</div>
              <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currStep1.reason}</div>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setModel1Playing(false); setModel1Index(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setModel1Playing(false); setModel1Index((prev) => Math.max(0, prev - 1)); }}
                  disabled={model1Index === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={model1Playing ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setModel1Playing(!model1Playing)}
                  leftIcon={model1Playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {model1Playing ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setModel1Playing(false); setModel1Index((prev) => Math.min(model1Steps.length - 1, prev + 1)); }}
                  disabled={model1Index === model1Steps.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </Card>
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

          <Card className="border-emerald-200 dark:border-emerald-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Bộ test:</span>
                <select
                  value={selectedM2DataIndex}
                  onChange={(e) => setSelectedM2DataIndex(Number(e.target.value))}
                  className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {model2Datasets.map((d, idx) => (
                    <option key={idx} value={idx}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button onClick={() => setModel2Speed(1100)} className={`px-2 py-0.5 rounded ${model2Speed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>0.5x</button>
                <button onClick={() => setModel2Speed(650)} className={`px-2 py-0.5 rounded ${model2Speed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>1x</button>
                <button onClick={() => setModel2Speed(350)} className={`px-2 py-0.5 rounded ${model2Speed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>2x</button>
              </div>
            </div>

            {/* M2 Visualizer */}
            <div className="py-6 flex flex-col items-center">
              <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full">
                {currStep2.currentArray.map((val, idx) => {
                  const isSlow = idx === currStep2.slow;
                  const isFast = idx === currStep2.fast;
                  const isUniqueZone = idx <= currStep2.slow;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="h-6 flex items-center justify-center text-xs font-mono font-bold">
                        {isSlow && !isFast && <span className="text-emerald-600 dark:text-emerald-400">SLOW</span>}
                        {isFast && !isSlow && <span className="text-amber-600 dark:text-amber-400">FAST</span>}
                        {isSlow && isFast && <span className="text-purple-600 dark:text-purple-400">S,F</span>}
                      </div>

                      <div
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-150 ${
                          isSlow
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-100 scale-105 shadow-md'
                            : isFast
                            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-100 scale-105 shadow-md'
                            : isUniqueZone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {val}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status info */}
              <div className="mt-4 flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-500">Độ dài mảng duy nhất [0...SLOW]:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  {currStep2.slow + 1} phần tử
                </span>
              </div>
            </div>

            {/* 3 dòng chuẩn */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
              <div><strong className="text-emerald-600 dark:text-emerald-400">Quan sát:</strong> {currStep2.observation}</div>
              <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currStep2.decision}</div>
              <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currStep2.reason}</div>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setModel2Playing(false); setModel2Index(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setModel2Playing(false); setModel2Index((prev) => Math.max(0, prev - 1)); }}
                  disabled={model2Index === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={model2Playing ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setModel2Playing(!model2Playing)}
                  leftIcon={model2Playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {model2Playing ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setModel2Playing(false); setModel2Index((prev) => Math.min(model2Steps.length - 1, prev + 1)); }}
                  disabled={model2Index === model2Steps.length - 1}
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
        <CodeViewer tabs={codeTabs} defaultTabId="cpp" />
      </section>

      {/* 8. BẪY THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
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
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
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
            Bài tiếp theo: 2.2 Cửa Sổ Trượt (Sliding Window)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cửa sổ cố định độ dài K và cửa sổ co giãn linh hoạt kèm bảng đếm tần số ký tự.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('2.2')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 2.2
        </Button>
      </div>

    </article>
  );
};

export default Lesson02_TwoPointers;
