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
export interface VectorStep {
  size: number;
  capacity: number;
  elements: number[];
  reallocated: boolean;
  observation: string;
  decision: string;
  reason: string;
}

export interface DNFStep {
  arr: number[];
  low: number;
  mid: number;
  high: number;
  action: 'INIT' | 'SWAP_0' | 'KEEP_1' | 'SWAP_2' | 'DONE';
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
  hints: [string, string, string]; // 3-tier hints: insight, strategy, skeleton
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

export const Lesson01_VectorSorting: React.FC<LessonProps> = ({
  isTheoryCompleted = false,
  onToggleTheory,
  completedProblems = {},
  onToggleProblem,
  onSelectSubtopic,
}) => {
  // Local fallback state
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
  // STATE MÔ HÌNH 1: CƠ CHẾ BỘ NHỚ VECTOR & REALLOCATION
  // ==========================================
  const [useReserve, setUseReserve] = useState<boolean>(false);
  const [vectorIndex, setVectorIndex] = useState<number>(0);
  const [vectorPlaying, setVectorPlaying] = useState<boolean>(false);
  const [vectorSpeed, setVectorSpeed] = useState<number>(650);
  const vectorTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const vectorSteps = useMemo<VectorStep[]>(() => {
    const rawValues = [12, 45, 78, 23, 56, 89, 34, 67];
    const steps: VectorStep[] = [];
    const initCap = useReserve ? 8 : 0;

    steps.push({
      size: 0,
      capacity: initCap,
      elements: [],
      reallocated: false,
      observation: useReserve ? 'Đã gọi v.reserve(8): Dung lượng Capacity = 8, Size = 0.' : 'Vector rỗng: Size = 0, Capacity = 0.',
      decision: useReserve ? 'Sẵn sàng nhận 8 phần tử liên tiếp.' : 'Chờ phần tử đầu tiên để cấp phát bộ nhớ ban đầu.',
      reason: useReserve ? 'Cấp phát trước một vùng 8 ô giúp loại bỏ mọi Reallocation.' : 'Chưa có dữ liệu nên vector chưa xin cấp phát RAM.',
    });

    let currentCap = initCap;
    const curElements: number[] = [];

    for (let i = 0; i < rawValues.length; i++) {
      const val = rawValues[i];
      const nextSize = i + 1;
      let didRealloc = false;

      if (useReserve) {
        if (nextSize > currentCap) {
          currentCap = currentCap * 2;
          didRealloc = true;
        }
      } else {
        if (nextSize > currentCap) {
          currentCap = currentCap === 0 ? 1 : currentCap * 2;
          didRealloc = true;
        }
      }

      curElements.push(val);

      steps.push({
        size: nextSize,
        capacity: currentCap,
        elements: [...curElements],
        reallocated: didRealloc,
        observation: `Thêm phần tử ${val} vào cuối. Size tăng lên ${nextSize}/${currentCap}.`,
        decision: didRealloc
          ? `CẤP PHÁT LẠI (Reallocation)! Nhân đôi Capacity từ ${Math.floor(currentCap / 2)} -> ${currentCap}.`
          : `Ghi thẳng giá trị ${val} vào ô nhớ tiếp theo trong vùng đệm hiện tại.`,
        reason: didRealloc
          ? `Size (${nextSize}) vượt quá dung lượng cũ. Phải cấp phát vùng nhớ mới và copy ${nextSize - 1} phần tử cũ sang, tốn O(N).`
          : `Capacity còn chỗ trống (${currentCap - nextSize} ô), thao tác O(1) tức thì.`,
      });
    }

    return steps;
  }, [useReserve]);

  useEffect(() => {
    setVectorIndex(0);
    setVectorPlaying(false);
  }, [useReserve]);

  useEffect(() => {
    if (vectorPlaying) {
      vectorTimerRef.current = setInterval(() => {
        setVectorIndex((prev) => {
          if (prev < vectorSteps.length - 1) return prev + 1;
          setVectorPlaying(false);
          return prev;
        });
      }, vectorSpeed);
    } else if (vectorTimerRef.current) {
      clearInterval(vectorTimerRef.current);
    }
    return () => {
      if (vectorTimerRef.current) clearInterval(vectorTimerRef.current);
    };
  }, [vectorPlaying, vectorSpeed, vectorSteps.length]);

  // ==========================================
  // STATE MÔ HÌNH 2: DUTCH NATIONAL FLAG (LEETCODE 75)
  // ==========================================
  const dnfDatasets = [
    { label: 'Bộ mẫu chuẩn (xáo trộn)', arr: [2, 0, 2, 1, 1, 0, 2, 1] },
    { label: 'Đã sắp xếp sẵn', arr: [0, 0, 1, 1, 2, 2] },
    { label: 'Sắp xếp ngược', arr: [2, 2, 1, 1, 0, 0] },
  ];
  const [selectedDnfDataIndex, setSelectedDnfDataIndex] = useState<number>(0);
  const [dnfIndex, setDnfIndex] = useState<number>(0);
  const [dnfPlaying, setDnfPlaying] = useState<boolean>(false);
  const [dnfSpeed, setDnfSpeed] = useState<number>(650);
  const dnfTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dnfSteps = useMemo<DNFStep[]>(() => {
    const raw = [...dnfDatasets[selectedDnfDataIndex].arr];
    const steps: DNFStep[] = [];
    const a = [...raw];
    let low = 0;
    let mid = 0;
    let high = a.length - 1;

    steps.push({
      arr: [...a],
      low,
      mid,
      high,
      action: 'INIT',
      observation: `Khởi tạo: low = 0, mid = 0, high = ${high}. Mảng chưa xét [mid...high].`,
      decision: `Bắt đầu xét phần tử tại vị trí mid = 0.`,
      reason: `Vùng [0...low-1] chứa 0, [low...mid-1] chứa 1, [high+1...N-1] chứa 2.`,
    });

    while (mid <= high) {
      const val = a[mid];
      if (val === 0) {
        const temp = a[low];
        a[low] = a[mid];
        a[mid] = temp;
        steps.push({
          arr: [...a],
          low: low + 1,
          mid: mid + 1,
          high,
          action: 'SWAP_0',
          observation: `A[mid] == 0. Đổi chỗ A[low] (${temp}) và A[mid] (${val}).`,
          decision: `Đưa 0 về phân vùng đầu: Tăng low -> ${low + 1}, tăng mid -> ${mid + 1}.`,
          reason: `Phần tử vừa hoán vị sang mid chắc chắn là 1 (vì mid >= low), không cần xét lại.`,
        });
        low++;
        mid++;
      } else if (val === 1) {
        steps.push({
          arr: [...a],
          low,
          mid: mid + 1,
          high,
          action: 'KEEP_1',
          observation: `A[mid] == 1. Đã nằm đúng phân vùng số 1.`,
          decision: `Giữ nguyên và mở rộng biên: mid++ -> ${mid + 1}.`,
          reason: `Số 1 thuộc phân vùng [low...mid-1], chỉ cần dịch mid sang phải.`,
        });
        mid++;
      } else {
        const temp = a[high];
        a[high] = a[mid];
        a[mid] = temp;
        steps.push({
          arr: [...a],
          low,
          mid,
          high: high - 1,
          action: 'SWAP_2',
          observation: `A[mid] == 2. Đổi chỗ A[mid] (${val}) với A[high] (${temp}).`,
          decision: `Đưa 2 về cuối mảng: high-- -> ${high - 1}. Giữ nguyên mid!`,
          reason: `Phần tử vừa hoán vị từ high về mid chưa được kiểm tra, bước tiếp theo phải xét lại tại mid.`,
        });
        high--;
      }
    }

    steps.push({
      arr: [...a],
      low,
      mid,
      high,
      action: 'DONE',
      observation: `mid (${mid}) > high (${high}): Khoảng chưa xét rỗng.`,
      decision: `Hoàn tất thuật toán lá cờ Hà Lan trong đúng 1 lượt duyệt O(N).`,
      reason: `Toàn bộ mảng đã được phân vùng hoàn hảo: 0 ở đầu, 1 ở giữa, 2 ở cuối.`,
    });

    return steps;
  }, [selectedDnfDataIndex]);

  useEffect(() => {
    setDnfIndex(0);
    setDnfPlaying(false);
  }, [selectedDnfDataIndex]);

  useEffect(() => {
    if (dnfPlaying) {
      dnfTimerRef.current = setInterval(() => {
        setDnfIndex((prev) => {
          if (prev < dnfSteps.length - 1) return prev + 1;
          setDnfPlaying(false);
          return prev;
        });
      }, dnfSpeed);
    } else if (dnfTimerRef.current) {
      clearInterval(dnfTimerRef.current);
    }
    return () => {
      if (dnfTimerRef.current) clearInterval(dnfTimerRef.current);
    };
  }, [dnfPlaying, dnfSpeed, dnfSteps.length]);

  // ==========================================
  // PRACTICE PROBLEMS VỚI GỢI Ý 3 TẦNG (PLANNING.md)
  // ==========================================
  const practiceProblems: PracticeProblem[] = [
    {
      id: '217',
      title: '217. Contains Duplicate',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/contains-duplicate/',
      pattern: 'Vector Sorting vs Hash Set',
      priority: 1,
      hints: [
        'Nếu sắp xếp mảng tăng dần, hai phần tử giống nhau sẽ nằm ở đâu so với nhau?',
        'Sau khi std::sort(a.begin(), a.end()), duyệt i từ 0 đến N-2: nếu a[i] == a[i+1] thì kết luận có phần tử trùng lặp.',
        'Sort mảng: O(N log N) time, O(1) space. So sánh: std::unordered_set tốn O(N) time nhưng tốn thêm O(N) bộ nhớ heap.',
      ],
    },
    {
      id: '88',
      title: '88. Merge Sorted Array',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/merge-sorted-array/',
      pattern: 'Vector điền từ đuôi về đầu O(N)',
      priority: 1,
      hints: [
        'Mảng nums1 đã có sẵn dung lượng đủ lớn ở phần đuôi. Nếu điền từ đầu mảng, bạn sẽ ghi đè lên các phần tử chưa xét.',
        'Dùng 3 con trỏ: p1 ở cuối phần có dữ liệu của nums1 (m - 1), p2 ở cuối nums2 (n - 1), và p ở đuôi cùng nums1 (m + n - 1).',
        'So sánh nums1[p1] và nums2[p2], đặt số lớn hơn vào nums1[p--]. Lặp đến khi p2 < 0. Thời gian O(M + N), Space O(1).',
      ],
    },
    {
      id: '179',
      title: '179. Largest Number',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/largest-number/',
      pattern: 'Custom Comparator chuỗi: A + B > B + A',
      priority: 1,
      hints: [
        'So sánh số nguyên trực tiếp không hiệu quả (ví dụ 9 và 34). Làm sao biết ghép 9 với 34 hay 34 với 9 số nào lớn hơn?',
        'Chuyển các số thành chuỗi string. Viết comparator: chuỗi A đứng trước B khi và chỉ khi (A + B) > (B + A).',
        'Cài đặt: sort(strs.begin(), strs.end(), [](const string& a, const string& b){ return a + b > b + a; }). Lưu ý corner case mảng toàn số 0.',
      ],
    },
    {
      id: '75',
      title: '75. Sort Colors',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/sort-colors/',
      pattern: 'Thuật toán lá cờ Hà Lan (DNF) 3 con trỏ',
      priority: 2,
      hints: [
        'Đề bài yêu cầu One-pass O(N) và O(1) in-place mà không dùng hàm sort có sẵn.',
        'Dùng 3 con trỏ low, mid, high để duy trì 4 phân vùng: [0..low-1] là 0, [low..mid-1] là 1, [high+1..N-1] là 2.',
        'Khi a[mid] == 0: swap(a[low++], a[mid++]). Khi a[mid] == 1: mid++. Khi a[mid] == 2: swap(a[mid], a[high--]). Chạy khi mid <= high.',
      ],
    },
    {
      id: '912',
      title: '912. Sort an Array',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/sort-an-array/',
      pattern: 'Merge Sort hoặc Randomized Quick Sort O(N log N)',
      priority: 2,
      hints: [
        'LeetCode có các test case chống Quick Sort cố định chọn pivot ở đầu (gây O(N²)).',
        'Lựa chọn an toàn nhất: Viết thuật toán Merge Sort chia để trị (Divide & Conquer) hoặc Heap Sort để đảm bảo O(N log N) mọi trường hợp.',
        'Nếu dùng Quick Sort, bắt buộc phải chọn pivot ngẫu nhiên: int pivotIdx = low + rand() % (high - low + 1).',
      ],
    },
    {
      id: '485',
      title: '485. Max Consecutive Ones',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/max-consecutive-ones/',
      pattern: 'Duyệt tuần tự tận dụng Cache Locality',
      priority: 2,
      hints: [
        'Duyệt mảng một lượt duy nhất từ trái sang phải, không cấp phát thêm bất kỳ mảng phụ nào.',
        'Duy trì biến count và maxCount. Nếu gặp số 1: count++. Nếu gặp số 0: maxCount = max(maxCount, count), count = 0.',
        'Lưu ý cập nhật maxCount một lần cuối sau khi kết thúc vòng lặp để xử lý trường hợp mảng kết thúc bằng dãy số 1.',
      ],
    },
    {
      id: '380',
      title: '380. Insert Delete GetRandom O(1)',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
      pattern: 'Vector + Hash Map: Hoán vị phần tử cuối để xóa O(1)',
      priority: 2,
      hints: [
        'Vector cho phép getRandom O(1) qua chỉ số ngẫu nhiên, nhưng xóa ở giữa tốn O(N). Hash Map tra cứu O(1) nhưng không thể chọn ngẫu nhiên đều.',
        'Kết hợp: Dùng vector lưu giá trị và unordered_map lưu cặp {giá trị -> chỉ số trong vector}.',
        'Khi xóa giá trị val: Lấy chỉ số idx của val từ map. Hoán vị phần tử tại idx với phần tử cuối vector, cập nhật map, rồi gọi vector::pop_back().',
      ],
    },
    {
      id: '164',
      title: '164. Maximum Gap',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/maximum-gap/',
      pattern: 'Bucket Sort / Radix Sort tuyến tính O(N)',
      priority: 3,
      hints: [
        'Đề bài yêu cầu thời gian O(N) và không gian O(N). Thuật toán sắp xếp so sánh (Comparison Sort) có chặn dưới O(N log N) nên không thỏa mãn.',
        'Nguyên lý Dirichlet (Pigeonhole): Chia miền [minVal, maxVal] thành N-1 thùng (buckets). Khoảng cách lớn nhất chắc chắn không thể nằm trong cùng một thùng.',
        'Mỗi thùng chỉ cần lưu min và max của các phần tử rơi vào đó. Khoảng cách lớn nhất chính là hiệu giữa min của thùng hiện tại và max của thùng trước đó.',
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
  // QUIZ TƯƠNG TÁC (PHẦN 9)
  // ==========================================
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Khi đề bài Competitive Programming cho N = 2 × 10⁵, thuật toán nào dưới đây chắc chắn KHÔNG bị dính TLE?',
      options: [
        'O(N²) - Hai vòng for duyệt mọi cặp',
        'O(N log N) - Sắp xếp IntroSort hoặc Merge Sort',
        'O(N√N) - Chia căn bậc hai với hằng số lớn',
        'O(2ᴺ) - Quay lui thử mọi tập con',
      ],
      correctIndex: 1,
      explanation: 'Với N = 2 × 10⁵, thuật toán O(N log N) tốn khoảng 2 × 10⁵ × 18 ≈ 3.6 × 10⁶ phép tính, hoàn toàn nằm trong giới hạn an toàn 10⁸ phép tính/giây.',
    },
    {
      id: 2,
      question: 'Tại sao viết bool cmp(int a, int b) { return a <= b; } trong std::sort lại là lỗi nghiêm trọng?',
      options: [
        'Vì dấu <= làm hàm sort chạy chậm hơn 2 lần',
        'Vì vi phạm nguyên tắc Strict Weak Ordering, khi a == b hàm trả về true gây lỗi tràn bộ nhớ (Segmentation Fault)',
        'Vì C++20 cấm dùng toán tử so sánh trong lambda',
        'Vì hàm sort sẽ tự động đảo ngược mảng thành giảm dần',
      ],
      correctIndex: 1,
      explanation: 'std::sort yêu cầu quan hệ Strict Weak Ordering (nếu a == b thì cmp(a,b) và cmp(b,a) đều phải false). Trả về true khi bằng nhau sẽ khiến std::sort chạy vượt quá biên mảng.',
    },
    {
      id: 3,
      question: 'Một vector có Size = 4, Capacity = 4. Khi bạn gọi push_back(10), điều gì xảy ra ở mức phần cứng?',
      options: [
        'Chương trình báo lỗi Overflow và dừng đột ngột',
        'Vector giữ nguyên Capacity 4 và ghi đè ô nhớ kế tiếp',
        'Vector xin cấp phát vùng nhớ mới kích thước 8 ô, sao chép 4 phần tử cũ sang, giải phóng vùng cũ, rồi thêm 10 vào ô thứ 5',
        'Vector tự động chuyển thành danh sách liên kết kép std::list',
      ],
      correctIndex: 2,
      explanation: 'Đây chính là sự kiện Reallocation (nhân đôi dung lượng 4 -> 8). Thao tác này tốn O(N) trong bước này, nhưng nhờ nhân đôi nên chi phí trung bình amortized là O(1).',
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
      label: 'sort_colors.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: `// LeetCode 75 - Sort Colors (Dutch National Flag)
// Time Complexity: O(N) one-pass | Space Complexity: O(1) in-place
#include <vector>
#include <algorithm>

class Solution {
public:
    void sortColors(std::vector<int>& nums) {
        int low = 0;
        int mid = 0;
        int high = static_cast<int>(nums.size()) - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                // Move 0 to the front region [0...low-1]
                std::swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                // 1 is in the correct middle region [low...mid-1]
                mid++;
            } else { // nums[mid] == 2
                // Move 2 to the end region [high+1...N-1]
                std::swap(nums[mid], nums[high]);
                high--;
                // Note: Do not advance mid here!
                // The newly swapped element at mid must be examined.
            }
        }
    }
};`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 75 - Sort Colors (Dutch National Flag)
// Time Complexity: O(N) one-pass | Space Complexity: O(1) in-place
#include <vector>
#include <algorithm>

class Solution {
public:
    void sortColors(std::vector<int>& nums) {
        int low = 0;
        int mid = 0;
        int high = static_cast<int>(nums.size()) - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                // Move 0 to the front region [0...low-1]
                std::swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                // 1 is in the correct middle region [low...mid-1]
                mid++;
            } else { // nums[mid] == 2
                // Move 2 to the end region [high+1...N-1]
                std::swap(nums[mid], nums[high]);
                high--;
                // Do not increment mid, re-check element swapped from high
            }
        }
    }
};`}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'sort_colors.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: `# LeetCode 75 - Sort Colors
# Time Complexity: O(N) | Space Complexity: O(1)
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1

        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`# LeetCode 75 - Sort Colors
# Time Complexity: O(N) | Space Complexity: O(1)
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1

        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1`}</pre>
        </div>
      ),
    },
    {
      id: 'ts',
      label: 'sort_colors.ts',
      language: 'typescript',
      iconColor: '#3178c6',
      rawCode: `// LeetCode 75 - Sort Colors
// Time Complexity: O(N) | Space Complexity: O(1)
function sortColors(nums: number[]): void {
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 75 - Sort Colors
// Time Complexity: O(N) | Space Complexity: O(1)
function sortColors(nums: number[]): void {
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}`}</pre>
        </div>
      ),
    },
  ];

  const currStep1 = vectorSteps[vectorIndex] || vectorSteps[0] || {
    size: 0,
    capacity: 0,
    elements: [],
    reallocated: false,
    observation: '',
    decision: '',
    reason: '',
  };
  const currStep2 = dnfSteps[dnfIndex] || dnfSteps[0] || {
    arr: [],
    low: 0,
    mid: 0,
    high: 0,
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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.1 Big-O, Vector & Sorting</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.1
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
          Độ Phức Tạp Thuật Toán, Mảng Động Vector & Kỹ Thuật Sorting
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Làm chủ quy tắc <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">10⁸</code> phép tính/giây,
          cơ chế nhân đôi dung lượng của mảng động <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">std::vector</code>,
          chi phí khấu hao Amortized <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(1)</code>,
          và các thuật toán sắp xếp chuyên sâu (IntroSort, Custom Comparator, Dutch National Flag).
        </p>


        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'Big-O 10^8 ops',
            'Capacity Doubling',
            'vector::reserve',
            'IntroSort',
            'Strict Weak Ordering',
            'Dutch National Flag',
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

          <Card className="border-teal-200 dark:border-teal-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Theo dõi mảng động liên tục trên RAM
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Chuỗi 8 phần tử: [12, 45, 78, 23, 56, 89, 34, 67]
                </span>
              </div>

              {/* Toggle reserve vs speed */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setUseReserve(!useReserve)}
                  className={`text-xs px-2.5 py-1 rounded-md font-mono font-semibold transition cursor-pointer border ${
                    useReserve
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border-teal-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {useReserve ? '✓ Có reserve(8)' : '✕ Không reserve'}
                </button>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                  <button onClick={() => setVectorSpeed(1100)} className={`px-2 py-0.5 rounded ${vectorSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>0.5x</button>
                  <button onClick={() => setVectorSpeed(650)} className={`px-2 py-0.5 rounded ${vectorSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>1x</button>
                  <button onClick={() => setVectorSpeed(350)} className={`px-2 py-0.5 rounded ${vectorSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-teal-600' : 'text-slate-500'}`}>2x</button>
                </div>
              </div>
            </div>

            {/* Visualizer 1 */}
            <div className="py-6 flex flex-col items-center">
              {/* Stat badges */}
              <div className="flex items-center gap-6 mb-4 font-mono text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Size:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                    {currStep1.size}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Capacity:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                    {currStep1.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-xs ${currStep1.reallocated ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'}`}>
                    {currStep1.reallocated ? '⚡ REALLOCATION' : 'OK (O(1))'}
                  </span>
                </div>
              </div>

              {/* Memory slots */}
              <div className="flex items-center gap-2 overflow-x-auto p-2 max-w-full">
                {Array.from({ length: Math.max(currStep1.capacity, 1) }).map((_, idx) => {
                  const hasElement = idx < currStep1.elements.length;
                  const val = hasElement ? currStep1.elements[idx] : null;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-150 ${
                          hasElement
                            ? currStep1.reallocated
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-200'
                              : 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-800 dark:text-teal-200'
                            : 'bg-slate-100/60 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {val !== null ? val : '∅'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 dòng chuẩn: Quan sát -> Quyết định -> Lý do */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm space-y-1">
              <div><strong className="text-teal-600 dark:text-teal-400">Quan sát:</strong> {currStep1.observation}</div>
              <div><strong className="text-amber-600 dark:text-amber-400">Quyết định:</strong> {currStep1.decision}</div>
              <div><strong className="text-slate-600 dark:text-slate-400">Lý do:</strong> {currStep1.reason}</div>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setVectorPlaying(false); setVectorIndex(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setVectorPlaying(false); setVectorIndex((prev) => Math.max(0, prev - 1)); }}
                  disabled={vectorIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={vectorPlaying ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setVectorPlaying(!vectorPlaying)}
                  leftIcon={vectorPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {vectorPlaying ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setVectorPlaying(false); setVectorIndex((prev) => Math.min(vectorSteps.length - 1, prev + 1)); }}
                  disabled={vectorIndex === vectorSteps.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </Card>
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

          <Card className="border-emerald-200 dark:border-emerald-900/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Bộ dữ liệu:</span>
                <select
                  value={selectedDnfDataIndex}
                  onChange={(e) => setSelectedDnfDataIndex(Number(e.target.value))}
                  className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {dnfDatasets.map((d, idx) => (
                    <option key={idx} value={idx}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button onClick={() => setDnfSpeed(1100)} className={`px-2 py-0.5 rounded ${dnfSpeed === 1100 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>0.5x</button>
                <button onClick={() => setDnfSpeed(650)} className={`px-2 py-0.5 rounded ${dnfSpeed === 650 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>1x</button>
                <button onClick={() => setDnfSpeed(350)} className={`px-2 py-0.5 rounded ${dnfSpeed === 350 ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600' : 'text-slate-500'}`}>2x</button>
              </div>
            </div>

            {/* DNF Visualizer */}
            <div className="py-6 flex flex-col items-center">
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto p-2 max-w-full">
                {currStep2.arr.map((val, idx) => {
                  const isLow = idx === currStep2.low;
                  const isMid = idx === currStep2.mid;
                  const isHigh = idx === currStep2.high;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Pointers Label */}
                      <div className="h-6 flex items-center justify-center text-[11px] font-mono font-extrabold">
                        {isLow && <span className="text-emerald-600 dark:text-emerald-400 mr-0.5">L</span>}
                        {isMid && <span className="text-amber-600 dark:text-amber-400 mr-0.5">M</span>}
                        {isHigh && <span className="text-indigo-600 dark:text-indigo-400">H</span>}
                      </div>

                      {/* Cell */}
                      <div
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-extrabold text-base sm:text-lg transition-all duration-150 ${
                          val === 0
                            ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-700 dark:text-rose-300'
                            : val === 1
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-300'
                            : 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 text-sky-700 dark:text-sky-300'
                        }`}
                      >
                        {val}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status bar */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold">0 (Đỏ)</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">1 (Trắng)</span>
                <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-semibold">2 (Xanh)</span>
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
                onClick={() => { setDnfPlaying(false); setDnfIndex(0); }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setDnfPlaying(false); setDnfIndex((prev) => Math.max(0, prev - 1)); }}
                  disabled={dnfIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Lùi
                </Button>

                <Button
                  variant={dnfPlaying ? 'amber' : 'primary'}
                  size="sm"
                  onClick={() => setDnfPlaying(!dnfPlaying)}
                  leftIcon={dnfPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                >
                  {dnfPlaying ? 'Tạm dừng' : 'Chạy tự động'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setDnfPlaying(false); setDnfIndex((prev) => Math.min(dnfSteps.length - 1, prev + 1)); }}
                  disabled={dnfIndex === dnfSteps.length - 1}
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
        <CodeViewer tabs={codeTabs} defaultTabId="cpp" />
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

      {/* 10. BÀI TẬP RÈN LUYỆN (GỢI Ý 3 TẦNG) */}
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
            Bài tiếp theo: 1.2 Ngăn Xếp (Stack)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Nguyên lý LIFO, kiểm tra chuỗi ngoặc hợp lệ và kỹ thuật Monotonic Stack.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.2')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 1.2
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_VectorSorting;
