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
export interface BoundSearchStep {
  target: number;
  arraySnapshot: number[];
  left: number;
  right: number;
  mid: number;
  lowerIndex: number | null;
  upperIndex: number | null;
  action: 'INIT' | 'CHECK_MID' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'FOUND_LOWER' | 'FOUND_UPPER' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export interface SlidingSetStep {
  currentIndex: number;
  currentVal: number;
  windowElements: number[]; // Sorted set representation
  targetDiff: number; // t
  windowSize: number; // k
  matchedPair: [number, number] | null;
  action: 'INIT' | 'QUERY' | 'MATCH_FOUND' | 'INSERT' | 'SLIDE_REMOVE' | 'DONE';
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

export const Lesson01_BSTSet: React.FC<LessonProps> = ({
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
  // STATE MÔ HÌNH 1: LOWER_BOUND & UPPER_BOUND TRÊN TẬP CÓ THỨ TỰ
  // ==========================================
  const sortedArray = useMemo(() => [10, 20, 20, 20, 35, 50, 65, 80], []);
  const targetOptions = [20, 30, 50, 5, 90];
  const [selectedTarget, setSelectedTarget] = useState<number>(20);

  const [boundIndex, setBoundIndex] = useState<number>(0);
  const [boundPlaying, setBoundPlaying] = useState<boolean>(false);
  const [boundSpeed, setBoundSpeed] = useState<number>(750);
  const boundTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const boundSteps = useMemo<BoundSearchStep[]>(() => {
    const steps: BoundSearchStep[] = [];
    const arr = sortedArray;
    const X = selectedTarget;

    steps.push({
      target: X,
      arraySnapshot: [...arr],
      left: 0,
      right: arr.length,
      mid: -1,
      lowerIndex: null,
      upperIndex: null,
      action: 'INIT',
      observation: `Khởi tạo tập có thứ tự std::set/multiset gồm ${arr.length} phần tử. Giá trị cần tìm: X = ${X}.`,
      decision: `Chuẩn bị xác định vị trí iterator của s.lower_bound(${X}) và s.upper_bound(${X}).`,
      reason: `lower_bound tìm phần tử đầu tiên >= X. upper_bound tìm phần tử đầu tiên > X.`,
    });

    // Step 1: Simulate lower_bound
    let l = 0, r = arr.length;
    while (l < r) {
      const m = Math.floor((l + r) / 2);
      steps.push({
        target: X,
        arraySnapshot: [...arr],
        left: l,
        right: r,
        mid: m,
        lowerIndex: null,
        upperIndex: null,
        action: 'CHECK_MID',
        observation: `Xét phần tử giữa arr[${m}] = ${arr[m]} để tìm lower_bound(${X}).`,
        decision: arr[m] >= X ? `arr[${m}] >= ${X} -> Có thể là đáp án, co cận phải: right = ${m}` : `arr[${m}] < ${X} -> Bỏ nửa trái: left = ${m + 1}`,
        reason: `lower_bound tìm vị trí nhỏ nhất có giá trị >= ${X}.`,
      });
      if (arr[m] >= X) {
        r = m;
      } else {
        l = m + 1;
      }
    }
    const lowerRes = l;

    steps.push({
      target: X,
      arraySnapshot: [...arr],
      left: lowerRes,
      right: lowerRes,
      mid: lowerRes,
      lowerIndex: lowerRes < arr.length ? lowerRes : null,
      upperIndex: null,
      action: 'FOUND_LOWER',
      observation: lowerRes < arr.length
        ? `Đã xác định được lower_bound(${X}) tại index ${lowerRes} với giá trị ${arr[lowerRes]}.`
        : `Mọi phần tử đều nhỏ hơn ${X} -> lower_bound(${X}) trả về s.end().`,
      decision: `Tiếp tục xác định upper_bound(${X}).`,
      reason: `Phần tử đầu tiên có giá trị >= ${X} nằm tại vị trí này.`,
    });

    // Step 2: Simulate upper_bound
    l = 0;
    r = arr.length;
    while (l < r) {
      const m = Math.floor((l + r) / 2);
      if (arr[m] > X) {
        r = m;
      } else {
        l = m + 1;
      }
    }
    const upperRes = l;

    const countMatches = upperRes - lowerRes;

    steps.push({
      target: X,
      arraySnapshot: [...arr],
      left: lowerRes,
      right: upperRes,
      mid: upperRes,
      lowerIndex: lowerRes < arr.length ? lowerRes : null,
      upperIndex: upperRes < arr.length ? upperRes : null,
      action: 'DONE',
      observation: `upper_bound(${X}) tại index ${upperRes} ${upperRes < arr.length ? `(giá trị ${arr[upperRes]})` : '(s.end())'}.`,
      decision: `Khoảng nửa mở [lower_bound, upper_bound) chứa chính xác ${Math.max(0, countMatches)} phần tử bằng ${X}.`,
      reason: `Trong std::multiset, số lượng bản sao của giá trị X chính là khoảng cách giữa 2 iterator này!`,
    });

    return steps;
  }, [sortedArray, selectedTarget]);

  useEffect(() => {
    setBoundIndex(0);
    setBoundPlaying(false);
  }, [selectedTarget]);

  useEffect(() => {
    if (boundPlaying) {
      boundTimerRef.current = setInterval(() => {
        setBoundIndex((prev) => {
          if (prev >= boundSteps.length - 1) {
            setBoundPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, boundSpeed);
    } else if (boundTimerRef.current) {
      clearInterval(boundTimerRef.current);
    }
    return () => {
      if (boundTimerRef.current) clearInterval(boundTimerRef.current);
    };
  }, [boundPlaying, boundSteps.length, boundSpeed]);

  // ==========================================
  // STATE MÔ HÌNH 2: CONTAINS DUPLICATE III (LEETCODE 220)
  // ==========================================
  const slidingDatasets = [
    {
      label: 'Có nghiệm: nums = [1, 5, 9, 1, 5, 9], k = 2, t = 3',
      nums: [1, 5, 9, 1, 5, 9],
      k: 2,
      t: 3,
    },
    {
      label: 'Không nghiệm: nums = [1, 2, 3, 1], k = 3, t = 0 (trùng tại k=3)',
      nums: [1, 2, 3, 1],
      k: 3,
      t: 0,
    },
  ];
  const [selectedSlidingIdx, setSelectedSlidingIdx] = useState<number>(0);
  const [slidingIndex, setSlidingIndex] = useState<number>(0);
  const [slidingPlaying, setSlidingPlaying] = useState<boolean>(false);
  const [slidingSpeed, setSlidingSpeed] = useState<number>(850);
  const slidingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSlidingConfig = slidingDatasets[selectedSlidingIdx];

  const slidingSteps = useMemo<SlidingSetStep[]>(() => {
    const { nums, k, t } = activeSlidingConfig;
    const steps: SlidingSetStep[] = [];
    const windowSet: number[] = [];

    steps.push({
      currentIndex: -1,
      currentVal: 0,
      windowElements: [],
      targetDiff: t,
      windowSize: k,
      matchedPair: null,
      action: 'INIT',
      observation: `Khởi tạo bài toán LeetCode 220: Cửa sổ k = ${k}, khoảng chênh lệch t = ${t}. Cây std::set cửa sổ rỗng.`,
      decision: `Duyệt mảng nums từ trái qua phải. Mỗi bước truy vấn lower_bound(nums[i] - t).`,
      reason: `Điều kiện |nums[i] - nums[j]| <= t tương đương với: nums[i] - t <= nums[j] <= nums[i] + t.`,
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];

      // Query lower_bound(val - t)
      const needMin = val - t;
      const needMax = val + t;
      const sortedWin = [...windowSet].sort((a, b) => a - b);
      const cand = sortedWin.find((v) => v >= needMin);

      steps.push({
        currentIndex: i,
        currentVal: val,
        windowElements: [...sortedWin],
        targetDiff: t,
        windowSize: k,
        matchedPair: null,
        action: 'QUERY',
        observation: `Xét nums[${i}] = ${val}. Cần tìm phần tử x trong cửa sổ thỏa mãn: ${needMin} <= x <= ${needMax}.`,
        decision: `Gọi window.lower_bound(${needMin}). Ứng viên nhỏ nhất >= ${needMin} là: ${cand !== undefined ? cand : 'Không có'}.`,
        reason: `std::set::lower_bound tìm được ứng viên đầu tiên trong O(log k).`,
      });

      if (cand !== undefined && cand <= needMax) {
        steps.push({
          currentIndex: i,
          currentVal: val,
          windowElements: [...sortedWin],
          targetDiff: t,
          windowSize: k,
          matchedPair: [val, cand],
          action: 'MATCH_FOUND',
          observation: `THÀNH CÔNG! Tìm thấy cặp số nums[${i}] = ${val} và ${cand} trong cửa sổ có |${val} - ${cand}| = ${Math.abs(val - cand)} <= ${t}.`,
          decision: `Dừng thuật toán và trả về TRUE ngay lập tức.`,
          reason: `Khoảng cách chỉ số <= ${k} và độ chênh lệch <= ${t} được thỏa mãn trọn vẹn!`,
        });
        return steps;
      }

      // Insert current val
      windowSet.push(val);

      // Slide window: remove element outside window size k
      if (i >= k) {
        const removeVal = nums[i - k];
        const remIdx = windowSet.indexOf(removeVal);
        if (remIdx !== -1) windowSet.splice(remIdx, 1);
        steps.push({
          currentIndex: i,
          currentVal: val,
          windowElements: [...windowSet].sort((a, b) => a - b),
          targetDiff: t,
          windowSize: k,
          matchedPair: null,
          action: 'SLIDE_REMOVE',
          observation: `Thêm ${val} vào set. Cửa sổ vượt quá k = ${k} -> Xóa phần tử cũ nums[${i - k}] = ${removeVal}.`,
          decision: `Gọi window.erase(${removeVal}) để giữ kích thước set <= ${k}.`,
          reason: `Chỉ số i - k đã ra ngoài phạm vi cửa sổ trượt.`,
        });
      } else {
        steps.push({
          currentIndex: i,
          currentVal: val,
          windowElements: [...windowSet].sort((a, b) => a - b),
          targetDiff: t,
          windowSize: k,
          matchedPair: null,
          action: 'INSERT',
          observation: `Thêm ${val} vào set. Cửa sổ hiện có ${windowSet.length} phần tử (chưa vượt quá k = ${k}).`,
          decision: `Tiếp tục bước kế tiếp.`,
          reason: `Tập set duy trì trạng thái có thứ tự của cửa sổ.`,
        });
      }
    }

    steps.push({
      currentIndex: nums.length,
      currentVal: 0,
      windowElements: [...windowSet].sort((a, b) => a - b),
      targetDiff: t,
      windowSize: k,
      matchedPair: null,
      action: 'DONE',
      observation: `Đã duyệt hết mảng mà không tìm thấy bất kỳ cặp chỉ số nào thỏa mãn.`,
      decision: `Trả về FALSE.`,
      reason: `Độ phức tạp toàn thuật toán: O(N log k) thời gian, O(k) không gian bộ nhớ.`,
    });

    return steps;
  }, [activeSlidingConfig]);

  useEffect(() => {
    setSlidingIndex(0);
    setSlidingPlaying(false);
  }, [selectedSlidingIdx]);

  useEffect(() => {
    if (slidingPlaying) {
      slidingTimerRef.current = setInterval(() => {
        setSlidingIndex((prev) => {
          if (prev >= slidingSteps.length - 1) {
            setSlidingPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, slidingSpeed);
    } else if (slidingTimerRef.current) {
      clearInterval(slidingTimerRef.current);
    }
    return () => {
      if (slidingTimerRef.current) clearInterval(slidingTimerRef.current);
    };
  }, [slidingPlaying, slidingSteps.length, slidingSpeed]);

  // ==========================================
  // CODE TABS IMPLEMENTATION
  // ==========================================
  const codeTabs: CodeTab[] = [
    {
      id: 'cpp',
      label: 'ContainsDuplicateIII.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: `// LeetCode 220 - Contains Duplicate III
// Time Complexity: O(N log K) | Space Complexity: O(K)
#include <vector>
#include <set>
#include <cmath>

class Solution {
public:
    bool containsNearbyAlmostDuplicate(const std::vector<int>& nums, int indexDiff, int valueDiff) {
        int n = static_cast<int>(nums.size());
        // Use std::set (Red-Black Tree) to store elements in current window of size indexDiff
        // Use long long to prevent integer overflow when computing (nums[i] - valueDiff)
        std::set<long long> window;

        for (int i = 0; i < n; ++i) {
            long long cur = nums[i];

            // Find the smallest element in window >= (cur - valueDiff)
            // CRITICAL: Call member function window.lower_bound(), NOT std::lower_bound()!
            auto it = window.lower_bound(cur - valueDiff);

            // Check if this candidate is <= (cur + valueDiff)
            if (it != window.end() && *it <= cur + valueDiff) {
                return true;
            }

            // Insert current element into window set
            window.insert(cur);

            // Maintain window size <= indexDiff
            if (i >= indexDiff) {
                window.erase(nums[i - indexDiff]);
            }
        }

        return false;
    }
};`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 220 - Contains Duplicate III
// Time Complexity: O(N log K) | Space Complexity: O(K)
#include <vector>
#include <set>
#include <cmath>

class Solution {
public:
    bool containsNearbyAlmostDuplicate(const std::vector<int>& nums, int indexDiff, int valueDiff) {
        int n = static_cast<int>(nums.size());
        std::set<long long> window;

        for (int i = 0; i < n; ++i) {
            long long cur = nums[i];

            // 1. Query: smallest element in window >= (cur - valueDiff)
            // MUST use window.lower_bound() for O(log K) complexity!
            auto it = window.lower_bound(cur - valueDiff);

            // 2. Condition: is it <= (cur + valueDiff)?
            if (it != window.end() && *it <= cur + valueDiff) {
                return true;
            }

            // 3. Add to window
            window.insert(cur);

            // 4. Slide window: remove expired element
            if (i >= indexDiff) {
                window.erase(nums[i - indexDiff]);
            }
        }
        return false;
    }
};`}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'contains_duplicate_iii.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: `# LeetCode 220 - Contains Duplicate III
# Time Complexity: O(N log K) | Space Complexity: O(K)
# In Python, we can use bisect with a sorted list or Bucket Sort in O(N).
# Below is the BST-equivalent simulation using bisect.
import bisect

class Solution:
    def containsNearbyAlmostDuplicate(self, nums: list[int], indexDiff: int, valueDiff: int) -> bool:
        window = []  # Maintain sorted list of size <= indexDiff

        for i, val in enumerate(nums):
            # Binary search for val - valueDiff
            idx = bisect.bisect_left(window, val - valueDiff)

            # Check if element exists within [val - valueDiff, val + valueDiff]
            if idx < len(window) and window[idx] <= val + valueDiff:
                return True

            # Insert val maintaining sorted order
            bisect.insort(window, val)

            # Remove expired element outside window
            if i >= indexDiff:
                window.remove(nums[i - indexDiff])

        return False`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`# LeetCode 220 - Contains Duplicate III
# Time Complexity: O(N log K) | Space Complexity: O(K)
import bisect

class Solution:
    def containsNearbyAlmostDuplicate(self, nums: list[int], indexDiff: int, valueDiff: int) -> bool:
        window = []

        for i, val in enumerate(nums):
            idx = bisect.bisect_left(window, val - valueDiff)
            if idx < len(window) and window[idx] <= val + valueDiff:
                return True

            bisect.insort(window, val)

            if i >= indexDiff:
                window.remove(nums[i - indexDiff])

        return False`}</pre>
        </div>
      ),
    },
    {
      id: 'typescript',
      label: 'containsDuplicateIII.ts',
      language: 'typescript',
      iconColor: '#3178c6',
      rawCode: `// LeetCode 220 - Contains Duplicate III
// Bucket Sort approach: Time Complexity: O(N) | Space Complexity: O(K)
function containsNearbyAlmostDuplicate(nums: number[], indexDiff: number, valueDiff: number): boolean {
    if (valueDiff < 0) return false;
    const bucketMap = new Map<number, number>();
    const w = valueDiff + 1; // Width of bucket

    const getBucketId = (x: number): number => {
        return Math.floor(x / w);
    };

    for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        const bucket = getBucketId(val);

        if (bucketMap.has(bucket)) return true;
        if (bucketMap.has(bucket - 1) && Math.abs(val - bucketMap.get(bucket - 1)!) <= valueDiff) return true;
        if (bucketMap.has(bucket + 1) && Math.abs(val - bucketMap.get(bucket + 1)!) <= valueDiff) return true;

        bucketMap.set(bucket, val);

        if (i >= indexDiff) {
            bucketMap.delete(getBucketId(nums[i - indexDiff]));
        }
    }
    return false;
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 220 - Contains Duplicate III
// Time Complexity: O(N) using Bucketing | Space Complexity: O(K)
function containsNearbyAlmostDuplicate(nums: number[], indexDiff: number, valueDiff: number): boolean {
    if (valueDiff < 0) return false;
    const buckets = new Map<number, number>();
    const w = valueDiff + 1;

    const getId = (x: number) => Math.floor(x / w);

    for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        const id = getId(val);

        if (buckets.has(id)) return true;
        if (buckets.has(id - 1) && Math.abs(val - buckets.get(id - 1)!) <= valueDiff) return true;
        if (buckets.has(id + 1) && Math.abs(val - buckets.get(id + 1)!) <= valueDiff) return true;

        buckets.set(id, val);

        if (i >= indexDiff) {
            buckets.delete(getId(nums[i - indexDiff]));
        }
    }
    return false;
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
      question: 'Cho std::multiset<int> ms = {2, 3, 3, 3, 5}. Nếu bạn thực hiện ms.erase(3), kích thước còn lại của ms là bao nhiêu?',
      options: [
        'A. Còn 4 phần tử (chỉ xóa đúng một số 3)',
        'B. Còn 2 phần tử (xóa sạch toàn bộ tất cả các số 3)',
        'C. Bị lỗi biên dịch (Compile Error)',
        'D. Kích thước không đổi',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Đây là bẫy kinh điển nhất trong CP với std::multiset: lệnh ms.erase(value) sẽ xóa TẤT CẢ các phần tử có giá trị bằng value. Nếu chỉ muốn xóa đúng 1 bản sao, bạn bắt buộc phải truyền iterator: auto it = ms.find(value); if (it != ms.end()) ms.erase(it);',
    },
    {
      id: 2,
      question: 'Tại sao trong C++ bạn KHÔNG BAO GIỜ được gọi std::lower_bound(s.begin(), s.end(), x) trên một std::set s?',
      options: [
        'A. Vì hàm này trả về sai kết quả',
        'B. Vì iterator của std::set là Bidirectional, hàm std::lower_bound sẽ duyệt tuần tự từng node làm thoái hóa về O(N) gây TLE',
        'C. Vì std::set không hỗ trợ hàm toán tử <',
        'D. Vì std::set đã có sẵn hash table',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! std::lower_bound tổng quát chỉ đạt O(log N) khi container có Random Access Iterator (như vector). Với std::set (cây đỏ đen), nó phải bước từng bước ++it làm mất O(N). Hãy luôn dùng hàm thành viên s.lower_bound(x) để đạt O(log N)!',
    },
    {
      id: 3,
      question: 'Trong tập std::set<int> s = {10, 20, 30, 40}, kết quả của *s.upper_bound(20) là gì?',
      options: [
        'A. 20',
        'B. 30',
        'C. 10',
        'D. s.end()',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! lower_bound(20) tìm phần tử ĐẦU TIÊN >= 20 (kết quả là 20). Còn upper_bound(20) tìm phần tử ĐẦU TIÊN LỚN HƠN HẲN 20 (kết quả là 30).',
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
      id: 'm1_705',
      title: '705. Design HashSet',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/design-hashset/',
      pattern: 'Hash Set vs BST Set',
      priority: 1,
      hints: [
        'Một Hash Set cơ bản có thể cài đặt bằng mảng bucket cố định với kỹ thuật Chaining (mỗi bucket là vector<int> hoặc list<int>).',
        'Chọn kích thước bảng là một số nguyên tố vừa phải (ví dụ 769 hoặc 10007) để phân tán hàm băm key % PRIME.',
        'Thao tác add: nếu chưa có thì push_back. remove: tìm và erase. contains: duyệt bucket xem có tồn tại không.',
      ],
    },
    {
      id: 'm1_217',
      title: '217. Contains Duplicate',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/contains-duplicate/',
      pattern: 'Set Traversal',
      priority: 1,
      hints: [
        'So sánh 2 hướng tiếp cận: Sắp xếp vector mất O(N log N) thời gian, O(1) bộ nhớ.',
        'Dùng Hash Set std::unordered_set<int> mất O(N) thời gian, O(N) bộ nhớ.',
        'Kiểm tra: if (seen.count(num)) return true; seen.insert(num);',
      ],
    },
    {
      id: 'm1_981',
      title: '981. Time Based Key-Value Store',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/time-based-key-value-store/',
      pattern: 'BST / Upper Bound trên Timestamp',
      priority: 2,
      hints: [
        'Mỗi key lưu một danh sách các mốc (timestamp, value) tăng dần theo thời gian.',
        'Khi truy vấn get(key, timestamp), ta cần tìm giá trị có timestamp_prev <= timestamp lớn nhất.',
        'Dùng std::upper_bound tìm phần tử đầu tiên có timestamp > target, sau đó lùi lại 1 iterator (--it) để lấy đáp án.',
      ],
    },
    {
      id: 'm1_220',
      title: '220. Contains Duplicate III',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/contains-duplicate-iii/',
      pattern: 'BST Sliding Window (std::set::lower_bound)',
      priority: 2,
      hints: [
        'Duy trì cửa sổ trượt độ dài k bằng std::set<long long>.',
        'Với mỗi số x, tra cứu phần tử nhỏ nhất >= x - t bằng window.lower_bound(x - t). Kiểm tra xem phần tử này có <= x + t không.',
        'Luôn dùng long long để tránh tràn số âm/dương khi trừ t.',
      ],
    },
  ];

  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | '1' | '2' | '3'>('all');
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

  const currBound = boundSteps[boundIndex] || boundSteps[0];
  const currSliding = slidingSteps[slidingIndex] || slidingSteps[0];

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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.5 BST (Set & Multiset)</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.5
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
          Cây Tìm Kiếm Nhị Phân (BST) — std::set & std::multiset
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Nắm vững cơ chế <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">Cây Đỏ-Đen (Red-Black Tree)</code> tự cân bằng, làm chủ hai hàm tra cứu sống còn trong CP: <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">lower_bound (≥ X)</code> và <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">upper_bound (&gt; X)</code> trong <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(log N)</code>, cùng bẫy xóa phần tử chí mạng trong multiset.
        </p>

        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'Red-Black Tree O(log N)',
            's.lower_bound(x) vs std::lower_bound',
            'upper_bound (> x)',
            'Multiset Erase Iterator Bug',
            'Sliding Window BST',
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
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          3. Mô Phỏng Tương Tác: lower_bound & upper_bound Trên Set/Multiset
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Chọn giá trị cần tìm $X$ và xem quá trình thu hẹp phạm vi để xác định con trỏ <code className="font-mono text-teal-600">lower_bound</code> (≥ X) và <code className="font-mono text-amber-600">upper_bound</code> (&gt; X):
        </p>

        {/* Target selector */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-500 font-medium">Chọn giá trị X cần tìm:</span>
          {targetOptions.map((tVal) => (
            <button
              key={tVal}
              type="button"
              onClick={() => setSelectedTarget(tVal)}
              className={`px-3 py-1 text-xs rounded-lg border font-mono transition cursor-pointer ${
                selectedTarget === tVal
                  ? 'bg-teal-600 text-white border-teal-600 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
              }`}
            >
              X = {tVal}
            </button>
          ))}
        </div>

        {/* Bound Visualizer Card */}
        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tập Hợp Có Thứ Tự (Sorted Elements / BST)
            </span>
            <div className="text-xs font-mono">
              Mục tiêu: <span className="font-bold text-teal-600 dark:text-teal-400">X = {currBound.target}</span>
            </div>
          </div>

          {/* Array visualization */}
          <div className="flex flex-wrap gap-2 justify-center py-4">
            {currBound.arraySnapshot.map((num, idx) => {
              const isLower = currBound.lowerIndex === idx;
              const isUpper = currBound.upperIndex === idx;
              const isMid = currBound.mid === idx;
              const inRange = idx >= currBound.left && idx < currBound.right;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                    <span>[{idx}]</span>
                    {isLower && <span className="text-teal-600 font-bold">lower</span>}
                    {isUpper && <span className="text-amber-600 font-bold">upper</span>}
                  </div>
                  <div
                    className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-sm ${
                      isLower && isUpper
                        ? 'bg-purple-600 text-white ring-4 ring-purple-300 scale-105'
                        : isLower
                        ? 'bg-teal-600 text-white ring-4 ring-teal-200 dark:ring-teal-900 scale-105'
                        : isUpper
                        ? 'bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900 scale-105'
                        : isMid
                        ? 'bg-sky-500 text-white ring-2 ring-sky-300'
                        : inRange
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600'
                        : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-base">{num}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Step */}
          <div
            aria-live="polite"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 my-3"
          >
            <div>
              <span className="font-semibold text-slate-500">Quan sát: </span>
              <span className="text-slate-800 dark:text-slate-200">{currBound.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{currBound.decision}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Ý nghĩa: </span>
              <span className="text-slate-600 dark:text-slate-400">{currBound.reason}</span>
            </div>
          </div>

          {/* Bound Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setBoundIndex(0)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={boundIndex === 0}
                onClick={() => setBoundIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setBoundPlaying(!boundPlaying)}
              >
                {boundPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {boundPlaying ? 'Dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={boundIndex >= boundSteps.length - 1}
                onClick={() => setBoundIndex((p) => Math.min(boundSteps.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">
                Bước {boundIndex + 1}/{boundSteps.length}
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                {[
                  { label: '0.5x', speed: 1200 },
                  { label: '1x', speed: 750 },
                  { label: '2x', speed: 350 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setBoundSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      boundSpeed === s.speed
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

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: CONTAINS DUPLICATE III (LEETCODE 220) */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4. Mô Phỏng Thực Chiến: Cửa Sổ Trượt Với BST (LeetCode 220)
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Trực quan hóa cách <code className="font-mono text-teal-600 font-bold">std::set</code> hoạt động trong cửa sổ trượt kích thước $k$ để kiểm tra $|nums[i] - nums[j]| \le t$ trong $O(N \log k)$:
        </p>

        {/* Dataset selector */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-500 font-medium">Chọn bộ test:</span>
          {slidingDatasets.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedSlidingIdx(idx)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                selectedSlidingIdx === idx
                  ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Sliding Window Card */}
        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
          {/* Numbers list */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Dãy số nums (k = {activeSlidingConfig.k}, t = {activeSlidingConfig.t})
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSlidingConfig.nums.map((val, idx) => {
                const isCurrent = idx === currSliding.currentIndex;
                const isMatched = currSliding.matchedPair && (currSliding.matchedPair[0] === val || currSliding.matchedPair[1] === val);

                return (
                  <div
                    key={idx}
                    className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs transition-all ${
                      isMatched
                        ? 'bg-emerald-600 text-white font-bold ring-4 ring-emerald-300 scale-110 shadow-md'
                        : isCurrent
                        ? 'bg-teal-600 text-white font-bold ring-2 ring-teal-300 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{val}</span>
                    <span className="text-[9px] opacity-75">#{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Set in current window */}
          <div className="p-3.5 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase">
                Tập Hợp std::set Trong Cửa Sổ Trượt (Tối đa k = {activeSlidingConfig.k} phần tử)
              </span>
              <Badge variant="teal" size="xs">
                {currSliding.windowElements.length} phần tử
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
              {currSliding.windowElements.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Cửa sổ đang rỗng</span>
              ) : (
                currSliding.windowElements.map((v, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 font-mono text-xs font-bold border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 shadow-xs"
                  >
                    {v}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Explanation */}
          <div
            aria-live="polite"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 mb-3"
          >
            <div>
              <span className="font-semibold text-slate-500">Quan sát: </span>
              <span className="text-slate-800 dark:text-slate-200">{currSliding.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{currSliding.decision}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Lý do: </span>
              <span className="text-slate-600 dark:text-slate-400">{currSliding.reason}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSlidingIndex(0)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={slidingIndex === 0}
                onClick={() => setSlidingIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSlidingPlaying(!slidingPlaying)}
              >
                {slidingPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {slidingPlaying ? 'Dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={slidingIndex >= slidingSteps.length - 1}
                onClick={() => setSlidingIndex((p) => Math.min(slidingSteps.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">
                Bước {slidingIndex + 1}/{slidingSteps.length}
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                {[
                  { label: '0.5x', speed: 1200 },
                  { label: '1x', speed: 850 },
                  { label: '2x', speed: 400 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSlidingSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      slidingSpeed === s.speed
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

        <CodeViewer tabs={codeTabs} />

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
              Phân loại theo tiêu chuẩn PLANNING.md với gợi ý 3 tầng.
            </p>
          </div>

          {/* Filter */}
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
            Bài tiếp theo: 1.6 BST (Map & Custom Hash)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            std::map vs std::unordered_map và kỹ thuật Custom Hash splitmix64 chống Anti-hash trên Codeforces.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.6')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 1.6
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_BSTSet;
