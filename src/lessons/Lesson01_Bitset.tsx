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
export interface BitsetDPStep {
  itemIndex: number;
  weight: number;
  oldDp: number; // Bitmask integer representation
  shiftedDp: number;
  newDp: number;
  action: 'INIT' | 'SHIFT' | 'OR_MERGE' | 'DONE';
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

export const Lesson01_Bitset: React.FC<LessonProps> = ({
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
  // STATE MÔ HÌNH 1: SUBSET SUM VỚI BITSET SHIFT (dp |= (dp << w))
  // ==========================================
  const dpDatasets = [
    { label: 'Tập số [2, 3, 7] (W = 12)', weights: [2, 3, 7], maxWeight: 14 },
    { label: 'Tập số [3, 5, 4] (W = 12)', weights: [3, 5, 4], maxWeight: 14 },
    { label: 'Tập số [1, 2, 4, 8] (Lũy thừa 2)', weights: [1, 2, 4, 8], maxWeight: 16 },
  ];
  const [selectedDpDataIdx, setSelectedDpDataIdx] = useState<number>(0);
  const [dpIndex, setDpIndex] = useState<number>(0);
  const [dpPlaying, setDpPlaying] = useState<boolean>(false);
  const [dpSpeed, setDpSpeed] = useState<number>(850);
  const dpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeDpConfig = dpDatasets[selectedDpDataIdx];

  const dpSteps = useMemo<BitsetDPStep[]>(() => {
    const { weights } = activeDpConfig;
    const steps: BitsetDPStep[] = [];
    let currentMask = 1; // bit 0 is set: sum 0 is always achievable

    steps.push({
      itemIndex: -1,
      weight: 0,
      oldDp: 1,
      shiftedDp: 0,
      newDp: 1,
      action: 'INIT',
      observation: 'Khởi tạo Bitset: std::bitset<16> dp; dp[0] = 1 (tổng bằng 0 luôn luôn tạo được từ tập rỗng).',
      decision: 'Mọi bit khác ban đầu bằng 0.',
      reason: 'Biểu diễn trạng thái nhị phân: Bit thứ i = 1 nghĩa là tổng i có thể tạo thành.',
    });

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      const shifted = (currentMask << w);
      const merged = (currentMask | shifted);

      // Sub-step: Shift
      steps.push({
        itemIndex: i,
        weight: w,
        oldDp: currentMask,
        shiftedDp: shifted,
        newDp: currentMask,
        action: 'SHIFT',
        observation: `Xét phần tử thứ ${i + 1} có giá trị w = ${w}. Thực hiện phép dịch trái: dp << ${w}.`,
        decision: `Tất cả các tổng cũ x được tịnh tiến thành x + ${w} song song cùng lúc trong đúng 1 chu kỳ lệnh!`,
        reason: `Bitwise Shift nhân bản toàn bộ không gian trạng thái chỉ với 1 phép toán CPU.`,
      });

      // Sub-step: OR merge
      steps.push({
        itemIndex: i,
        weight: w,
        oldDp: currentMask,
        shiftedDp: shifted,
        newDp: merged,
        action: 'OR_MERGE',
        observation: `Thực hiện phép OR bit: dp |= (dp << ${w}). Hợp nhất tập các tổng cũ và tập các tổng mới tạo thành.`,
        decision: `Cập nhật trạng thái mới. Các tổng tạo được hiện tại: [${getSetBits(merged).join(', ')}].`,
        reason: `Không cần vòng lặp for duyệt ngược w từ W về 0 như DP thông thường. Tốc độ tăng gấp 64 lần!`,
      });

      currentMask = merged;
    }

    steps.push({
      itemIndex: weights.length,
      weight: 0,
      oldDp: currentMask,
      shiftedDp: 0,
      newDp: currentMask,
      action: 'DONE',
      observation: `Hoàn tất tất cả các phần tử. Toàn bộ các tổng con khả thi: [${getSetBits(currentMask).join(', ')}].`,
      decision: `Để kiểm tra tổng W có đạt được không, chỉ cần kiểm tra dp.test(W) trong O(1)!`,
      reason: `Độ phức tạp toàn bài: O(N × W / 64) thời gian và O(W / 64) bộ nhớ!`,
    });

    return steps;
  }, [activeDpConfig]);

  function getSetBits(mask: number): number[] {
    const res: number[] = [];
    for (let bit = 0; bit <= 16; bit++) {
      if ((mask & (1 << bit)) !== 0) {
        res.push(bit);
      }
    }
    return res;
  }

  useEffect(() => {
    setDpIndex(0);
    setDpPlaying(false);
  }, [selectedDpDataIdx]);

  useEffect(() => {
    if (dpPlaying) {
      dpTimerRef.current = setInterval(() => {
        setDpIndex((prev) => {
          if (prev >= dpSteps.length - 1) {
            setDpPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, dpSpeed);
    } else if (dpTimerRef.current) {
      clearInterval(dpTimerRef.current);
    }
    return () => {
      if (dpTimerRef.current) clearInterval(dpTimerRef.current);
    };
  }, [dpPlaying, dpSteps.length, dpSpeed]);

  // ==========================================
  // STATE MÔ HÌNH 2: INTERACTIVE BITSET EXPLORER
  // ==========================================
  const [interactiveBits, setInteractiveBits] = useState<number>(0b00101011); // 8-bit default

  const toggleBit = (idx: number) => {
    setInteractiveBits((prev) => prev ^ (1 << idx));
  };

  const bitCount = useMemo(() => {
    let cnt = 0;
    let n = interactiveBits;
    while (n > 0) {
      cnt += n & 1;
      n >>= 1;
    }
    return cnt;
  }, [interactiveBits]);

  // ==========================================
  // CODE TABS IMPLEMENTATION
  // ==========================================
  const codeTabs: CodeTab[] = [
    {
      id: 'cpp',
      label: 'Bitset_Knapsack.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: `// 0-1 Knapsack / Subset Sum Tối Ưu Với std::bitset
// Time Complexity: O(N * W / 64) | Space Complexity: O(W / 64) bits
#include <iostream>
#include <vector>
#include <bitset>

const int MAX_W = 100005;

bool canPartitionSubset(const std::vector<int>& nums, int target) {
    // std::bitset size MUST be a compile-time constant
    std::bitset<MAX_W> dp;
    
    // Base case: sum 0 is always achievable (empty set)
    dp[0] = 1;

    for (int x : nums) {
        // Shift entire bitset left by x, then OR with current dp
        // Processes 64 bits simultaneously in 1 CPU cycle!
        dp |= (dp << x);

        // Early exit: if target sum reached, return immediately
        if (dp[target]) {
            return true;
        }
    }

    return dp[target];
}

// Ứng dụng Sàng Nguyên Tố Siêu Tốc (Bitset Sieve):
const int MAX_PRIME = 10000000;
std::bitset<MAX_PRIME> is_prime; // Chỉ tốn ~1.2 MB RAM cho 10 triệu số!

void fastSieve() {
    is_prime.set(); // Bật tất cả các bit thành 1
    is_prime[0] = is_prime[1] = 0;
    for (int p = 2; p * p < MAX_PRIME; ++p) {
        if (is_prime[p]) {
            for (int i = p * p; i < MAX_PRIME; i += p) {
                is_prime[i] = 0;
            }
        }
    }
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// 0-1 Knapsack / Subset Sum Tối Ưu Với std::bitset
// Time Complexity: O(N * W / 64) | Space Complexity: O(W / 64) bits
#include <iostream>
#include <vector>
#include <bitset>

const int MAX_W = 100005;

bool canPartitionSubset(const std::vector<int>& nums, int target) {
    // Kích thước bitset bắt buộc là hằng số lúc biên dịch
    std::bitset<MAX_W> dp;
    dp[0] = 1; // Tổng 0 luôn tạo được

    for (int x : nums) {
        // Dịch toàn bộ bitset sang trái x đơn vị và OR với dp
        // Xử lý 64 giá trị cùng lúc trong đúng 1 chu kỳ xung nhịp CPU!
        dp |= (dp << x);

        if (dp[target]) return true;
    }
    return dp[target];
}

// Sàng nguyên tố siêu nhanh tốn chỉ ~1.2 MB cho 10 triệu số:
const int MAX_PRIME = 10000000;
std::bitset<MAX_PRIME> is_prime; // 10^7 bits = 1.2 MB RAM`}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'bitset_knapsack.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: `# Python 3 integers have arbitrary precision and support bitwise operations
# Time Complexity: O(N * W / 64)
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2 != 0:
            return False
        target = total // 2

        # Integer as bitset: bit 0 is 1
        dp = 1

        for num in nums:
            # Shift and OR in arbitrary precision integer
            dp |= (dp << num)
            if (dp >> target) & 1:
                return True

        return bool((dp >> target) & 1)`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`# Python 3: Dùng số nguyên lớn làm Bitset
# Time Complexity: O(N * W / 64)
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2 != 0:
            return False
        target = total // 2

        dp = 1  # bit 0 = 1

        for num in nums:
            dp |= (dp << num)
            if (dp >> target) & 1:
                return True

        return bool((dp >> target) & 1)`}</pre>
        </div>
      ),
    },
    {
      id: 'typescript',
      label: 'bitsetKnapsack.ts',
      language: 'typescript',
      iconColor: '#3178c6',
      rawCode: `// TypeScript: Sử dụng BigInt để mô phỏng Bitset không giới hạn
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = BigInt(total / 2);

    let dp = 1n; // BigInt 1n (bit 0 = 1)

    for (const x of nums) {
        dp |= (dp << BigInt(x));
        if ((dp >> target) & 1n) {
            return true;
        }
    }
    return Boolean((dp >> target) & 1n);
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// TypeScript: Sử dụng BigInt mô phỏng Bitset
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = BigInt(total / 2);

    let dp = 1n; // Bit 0 bật

    for (const x of nums) {
        dp |= (dp << BigInt(x));
        if ((dp >> target) & 1n) {
            return true;
        }
    }
    return Boolean((dp >> target) & 1n);
}`}</pre>
        </div>
      ),
    },
  ];

  // ==========================================
  // QUIZ QUESTIONS
  // ==========================================
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'So với mảng bool arr[10000000] (10 triệu phần tử) tốn 10 MB RAM, cấu trúc std::bitset<10000000> tiêu tốn bao nhiêu bộ nhớ RAM?',
      options: [
        'A. Khoảng 10 MB (bằng nhau)',
        'B. Khoảng 1.2 MB (giảm 8 lần vì nén 8 bits vào 1 byte)',
        'C. Khoảng 80 MB (tốn hơn)',
        'D. Khoảng 0.1 MB',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Trong C++, kiểu bool thông thường chiếm 1 byte (8 bits) do RAM định địa chỉ theo từng byte. std::bitset nén mỗi giá trị boolean vào đúng 1 bit nhị phân, do đó 10⁷ bits = 10,000,000 / 8 bytes ≈ 1.19 MB RAM!',
    },
    {
      id: 2,
      question: 'Tại sao phép toán dp |= (dp << w) trong bài toán Knapsack lại nhanh gấp khoảng 64 lần so với vòng lặp for cập nhật từng phần tử?',
      options: [
        'A. Vì bitset sử dụng card đồ họa GPU',
        'B. Vì CPU 64-bit thực hiện phép dịch bit (SHL) và phép OR trên thanh ghi 64-bit trong đúng 1 chu kỳ lệnh, xử lý đồng thời 64 trạng thái cùng lúc',
        'C. Vì bitset bỏ qua các phần tử trùng lặp',
        'D. Vì bitset tự động chạy đa luồng đa nhân',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Đây chính là tính chất Bitwise Parallelism (xử lý song song cấp độ bit). Một thanh ghi máy 64-bit thực hiện phép OR và dịch bit cho 64 ô nhớ cùng lúc trong 1 chu kỳ máy (1 clock cycle).',
    },
    {
      id: 3,
      question: 'Điều kiện BẮT BUỘC nào sau đây khi khai báo std::bitset<N> trong C++?',
      options: [
        'A. N phải là một số chia hết cho 64',
        'B. N phải là một hằng số xác định lúc biên dịch (Compile-time constant / constexpr)',
        'C. N không được vượt quá 1000',
        'D. N phải là số nguyên tố',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! std::bitset cấp phát bộ nhớ tĩnh trên Stack lúc biên dịch, do đó tham số N phải là hằng số constexpr. Nếu kích thước N chỉ biết được lúc chạy chương trình (runtime), ta phải dùng vector<bool> hoặc boost::dynamic_bitset.',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const handleSelectAnswer = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  // ==========================================
  // PRACTICE PROBLEMS
  // ==========================================
  const practiceProblems: PracticeProblem[] = [
    {
      id: 'm1_136',
      title: '136. Single Number',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/single-number/',
      pattern: 'XOR Bit Manipulation',
      priority: 1,
      hints: [
        'Mỗi phần tử xuất hiện 2 lần, chỉ có đúng 1 phần tử xuất hiện 1 lần.',
        'Tính chất XOR: a ^ a = 0 và a ^ 0 = a. Phép XOR có tính giao hoán và kết hợp.',
        'XOR dồn tất cả các phần tử trong mảng: int ans = 0; for (int x : nums) ans ^= x; return ans;',
      ],
    },
    {
      id: 'm1_416',
      title: '416. Partition Equal Subset Sum',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
      pattern: 'Subset Sum với Bitset',
      priority: 2,
      hints: [
        'Chia mảng thành 2 tập có tổng bằng nhau tương đương với việc tìm tập con có tổng đúng bằng total / 2.',
        'Nếu tổng lẻ -> chắc chắn false. Khai báo bitset<10001> dp; dp[0] = 1;',
        'Duyệt num: dp |= (dp << num); if (dp[target]) return true;',
      ],
    },
  ];

  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | '1' | '2'>('all');
  const [expandedHintProblemId, setExpandedHintProblemId] = useState<string | null>(null);
  const [expandedHintTier, setExpandedHintTier] = useState<Record<string, number>>({});

  const toggleHintTier = (problemId: string, tier: number) => {
    setExpandedHintTier((prev) => ({
      ...prev,
      [problemId]: prev[problemId] === tier ? 0 : tier,
    }));
  };

  const isProblemDone = (problemId: string) => {
    return !!completedProblems[problemId];
  };

  const handleToggleProblem = (problemId: string) => {
    if (onToggleProblem) {
      onToggleProblem(problemId);
    }
  };

  const filteredProblems = practiceProblems.filter((p) => {
    if (selectedPriorityFilter === 'all') return true;
    return p.priority.toString() === selectedPriorityFilter;
  });

  const solvedCount = practiceProblems.filter((p) => isProblemDone(p.id)).length;

  const currDp = dpSteps[dpIndex] || dpSteps[0];

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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.7 Bitset (std::bitset)</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.7
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
          Bitset (std::bitset) & Tối Ưu Nén Bit Song Song
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Nén <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">64 giá trị boolean</code> vào một từ máy 64-bit, giảm <code className="font-mono font-bold text-teal-600">64 lần dung lượng RAM</code> và khai thác kỹ thuật <strong>Bitwise Parallelism</strong> tăng tốc độ thuật toán Knapsack, Subset Sum, Sàng nguyên tố gấp <code className="font-mono font-bold text-teal-600">64 lần</code>!
        </p>

        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'std::bitset<N>',
            'Bitwise Parallelism /64',
            'dp |= (dp << w)',
            'Bitset Sieve 1.2MB',
            'Compile-Time Constexpr',
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

        {/* Dataset selector */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-500 font-medium">Chọn bộ test:</span>
          {dpDatasets.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDpDataIdx(idx)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                selectedDpDataIdx === idx
                  ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Visualizer Card */}
        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Thanh Ghi Bitset (Từ bit 0 đến bit 14)
            </span>
            <div className="text-xs font-mono">
              Đang xét: <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{currDp.weight > 0 ? `w = ${currDp.weight}` : 'Khởi tạo'}</span>
            </div>
          </div>

          {/* Bit register boxes */}
          <div className="space-y-3 py-2">
            {/* Current DP */}
            <div>
              <div className="text-[11px] font-mono text-slate-500 mb-1">
                Trạng thái hiện tại: <code className="font-bold text-teal-600">dp</code>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {Array.from({ length: 15 }, (_, bit) => {
                  const isSet = (currDp.newDp & (1 << bit)) !== 0;
                  const isOldSet = (currDp.oldDp & (1 << bit)) !== 0;
                  const isNewBit = isSet && !isOldSet;

                  return (
                    <div key={bit} className="flex flex-col items-center">
                      <span className="text-[9px] font-mono text-slate-400 mb-0.5">{bit}</span>
                      <div
                        className={`w-9 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-all ${
                          isNewBit
                            ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-900 scale-105 shadow-sm'
                            : isSet
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isSet ? '1' : '0'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shifted preview if in SHIFT state */}
            {currDp.action === 'SHIFT' && (
              <div className="p-2.5 rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20">
                <div className="text-[11px] font-mono text-sky-800 dark:text-sky-300 mb-1">
                  Kết quả sau khi dịch trái {currDp.weight} bit: <code className="font-bold">(dp &lt;&lt; {currDp.weight})</code>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {Array.from({ length: 15 }, (_, bit) => {
                    const isShiftSet = (currDp.shiftedDp & (1 << bit)) !== 0;
                    return (
                      <div key={bit} className="flex flex-col items-center">
                        <span className="text-[9px] font-mono text-slate-400 mb-0.5">{bit}</span>
                        <div
                          className={`w-9 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            isShiftSet
                              ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
                              : 'bg-white dark:bg-slate-800 text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isShiftSet ? '1' : '0'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Explanation Step */}
          <div
            aria-live="polite"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 my-3"
          >
            <div>
              <span className="font-semibold text-slate-500">Quan sát: </span>
              <span className="text-slate-800 dark:text-slate-200">{currDp.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{currDp.decision}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Lý do: </span>
              <span className="text-slate-600 dark:text-slate-400">{currDp.reason}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDpIndex(0)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={dpIndex === 0}
                onClick={() => setDpIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setDpPlaying(!dpPlaying)}
              >
                {dpPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {dpPlaying ? 'Dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={dpIndex >= dpSteps.length - 1}
                onClick={() => setDpIndex((p) => Math.min(dpSteps.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">
                Bước {dpIndex + 1}/{dpSteps.length}
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                {[
                  { label: '0.5x', speed: 1300 },
                  { label: '1x', speed: 850 },
                  { label: '2x', speed: 400 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setDpSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      dpSpeed === s.speed
                        ? 'bg-white dark:bg-slate-700 text-teal-600 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: INTERACTIVE BITSET EXPLORER */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4. Mô Phỏng Tương Tác: Khám Phá Các Hàm Thành Viên Của std::bitset
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Nhấp chuột vào bất kỳ ô bit nào bên dưới để bật/tắt (toggle) và quan sát giá trị các hàm thành viên cập nhật tức thời:
        </p>

        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Thanh Ghi 8-bit Tương Tác
            </span>
            <div className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
              Giá trị thập phân: {interactiveBits}
            </div>
          </div>

          {/* Interactive bits row */}
          <div className="flex flex-wrap gap-2 justify-center py-3">
            {Array.from({ length: 8 }, (_, idx) => {
              const bitPos = 7 - idx; // Display bit 7 on left, bit 0 on right
              const isSet = (interactiveBits & (1 << bitPos)) !== 0;

              return (
                <button
                  key={bitPos}
                  type="button"
                  onClick={() => toggleBit(bitPos)}
                  className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                    isSet
                      ? 'bg-teal-600 text-white font-bold ring-4 ring-teal-200 dark:ring-teal-900 scale-105 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-teal-400'
                  }`}
                  title={`Click để đảo bit ${bitPos}`}
                >
                  <span className="text-base">{isSet ? '1' : '0'}</span>
                  <span className="text-[10px] opacity-75">bit {bitPos}</span>
                </button>
              );
            })}
          </div>

          {/* Member function status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 font-mono">b.count()</span>
              <div className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                {bitCount}
              </div>
              <span className="text-[10px] text-slate-500">Số lượng bit 1 (popcount)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 font-mono">b.any()</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {interactiveBits > 0 ? 'true' : 'false'}
              </div>
              <span className="text-[10px] text-slate-500">Có ít nhất 1 bit bật</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 font-mono">b.all()</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {interactiveBits === 255 ? 'true' : 'false'}
              </div>
              <span className="text-[10px] text-slate-500">Tất cả 8 bit đều bật</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 font-mono">b.none()</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {interactiveBits === 0 ? 'true' : 'false'}
              </div>
              <span className="text-[10px] text-slate-500">Không có bit nào bật</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. KHI NÀO DÙNG BITSET */}
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

      {/* 6. TÍNH ĐÚNG ĐẮN */}
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

      {/* 7. CÀI ĐẶT MẪU */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={codeTabs} />
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP */}
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
      <section className="mb-10 space-y-4">
        <h2 className="heading-section text-slate-900 dark:text-white">
          9. Kiểm Tra Nhanh Phản Xạ (Quiz)
        </h2>

        <div className="space-y-4">
          {quizQuestions.map((q) => {
            const userChoice = selectedAnswers[q.id];
            const hasAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs"
              >
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Câu {q.id}: {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    if (hasAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                      } else if (optIdx === userChoice) {
                        btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div
                    className={`mt-3 p-2.5 rounded-lg text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <strong>{isCorrect ? 'Tuyệt vời!' : 'Chưa đúng!'}</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. BÀI TẬP RÈN LUYỆN */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="heading-section text-slate-900 dark:text-white mb-0">
              10. Ngân Hàng Bài Tập LeetCode
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân loại theo chuẩn PLANNING.md với gợi ý 3 tầng.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedPriorityFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                selectedPriorityFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
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

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProblems.map((prob) => {
            const isDone = isProblemDone(prob.id);
            const difficultyVariant = prob.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
            const priorityVariant = `priority${prob.priority}` as 'priority1' | 'priority2';
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
            Bước tiếp theo: Bài Test 1 — Tháng 1 (1.8)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kiểm tra định kỳ 90 phút (4 bài: Easy, Medium 1, Medium 2, Hard) về Vector, Sorting, Stack, Queue.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.8')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Vào Làm Bài Test 1
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_Bitset;
