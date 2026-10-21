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
export interface StreamHeapStep {
  streamIndex: number;
  currentNum: number | null;
  heapSnapshot: number[]; // Min-Heap representation
  kthElement: number | null;
  action: 'INIT' | 'CONSIDER' | 'PUSH' | 'POP_PUSH' | 'IGNORE' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export interface TwoHeapsStep {
  num: number | null;
  maxHeap: number[]; // Left half (stores smaller values, top is largest)
  minHeap: number[]; // Right half (stores larger values, top is smallest)
  median: number | null;
  action: 'INIT' | 'ADD' | 'BALANCE' | 'CALC' | 'DONE';
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

export const Lesson01_Heap: React.FC<LessonProps> = ({
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
  // STATE MÔ HÌNH 1: MIN-HEAP SIZE K (LEETCODE 703 & 215)
  // ==========================================
  const streamDatasets = [
    { label: 'Dãy 1: [4, 5, 8, 2, 3, 5, 10, 9, 4] (K = 3)', k: 3, stream: [4, 5, 8, 2, 3, 5, 10, 9, 4] },
    { label: 'Dãy 2: [12, 3, 17, 8, 30, 25] (K = 2)', k: 2, stream: [12, 3, 17, 8, 30, 25] },
    { label: 'Dãy 3: [7, 7, 7, 7, 8, 6] (K = 3)', k: 3, stream: [7, 7, 7, 7, 8, 6] },
  ];
  const [selectedStreamIdx, setSelectedStreamIdx] = useState<number>(0);
  const [streamIndex, setStreamIndex] = useState<number>(0);
  const [streamPlaying, setStreamPlaying] = useState<boolean>(false);
  const [streamSpeed, setStreamSpeed] = useState<number>(750);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeStreamConfig = streamDatasets[selectedStreamIdx];

  // Helper heap operations for visualization
  const streamSteps = useMemo<StreamHeapStep[]>(() => {
    const k = activeStreamConfig.k;
    const stream = activeStreamConfig.stream;
    const steps: StreamHeapStep[] = [];
    let heap: number[] = [];

    // Helper functions for min-heap
    const siftUp = (h: number[], idx: number) => {
      let cur = idx;
      while (cur > 0) {
        const p = Math.floor((cur - 1) / 2);
        if (h[cur] < h[p]) {
          [h[cur], h[p]] = [h[p], h[cur]];
          cur = p;
        } else break;
      }
    };

    const siftDown = (h: number[], idx: number) => {
      let cur = idx;
      const len = h.length;
      while (2 * cur + 1 < len) {
        let left = 2 * cur + 1;
        let right = 2 * cur + 2;
        let smallest = cur;
        if (left < len && h[left] < h[smallest]) smallest = left;
        if (right < len && h[right] < h[smallest]) smallest = right;
        if (smallest !== cur) {
          [h[cur], h[smallest]] = [h[smallest], h[cur]];
          cur = smallest;
        } else break;
      }
    };

    steps.push({
      streamIndex: -1,
      currentNum: null,
      heapSnapshot: [],
      kthElement: null,
      action: 'INIT',
      observation: `Khởi tạo Min-Heap rỗng để duy trì Top ${k} phần tử lớn nhất từ luồng dữ liệu.`,
      decision: `Sẵn sàng nhận các phần tử từ luồng số.`,
      reason: `Min-Heap kích thước K luôn có đỉnh top() là phần tử nhỏ nhất trong top K, tức là phần tử lớn thứ K!`,
    });

    for (let i = 0; i < stream.length; i++) {
      const val = stream[i];
      if (heap.length < k) {
        heap.push(val);
        siftUp(heap, heap.length - 1);
        const topVal = heap.length === k ? heap[0] : null;
        steps.push({
          streamIndex: i,
          currentNum: val,
          heapSnapshot: [...heap],
          kthElement: topVal,
          action: 'PUSH',
          observation: `Phần tử mới val = ${val}. Kích thước heap hiện tại (${heap.length}) chưa vượt quá K = ${k}.`,
          decision: `Đẩy trực tiếp ${val} vào Heap và Sift-Up để bảo toàn tính chất Min-Heap.`,
          reason: `Khi Heap chưa đủ K phần tử, ta tích lũy đủ dung lượng trước khi bắt đầu so sánh.`,
        });
      } else {
        const currentMin = heap[0];
        if (val > currentMin) {
          heap[0] = val;
          siftDown(heap, 0);
          steps.push({
            streamIndex: i,
            currentNum: val,
            heapSnapshot: [...heap],
            kthElement: heap[0],
            action: 'POP_PUSH',
            observation: `Phần tử mới val = ${val} LỚN HƠN đỉnh heap hiện tại (${currentMin}).`,
            decision: `Loại bỏ đỉnh cũ ${currentMin}, thay bằng ${val} và Sift-Down để khôi phục Min-Heap.`,
            reason: `Giá trị ${val} xứng đáng lọt vào top ${k} phần tử lớn nhất. Đỉnh mới ${heap[0]} trở thành phần tử lớn thứ ${k}.`,
          });
        } else {
          steps.push({
            streamIndex: i,
            currentNum: val,
            heapSnapshot: [...heap],
            kthElement: heap[0],
            action: 'IGNORE',
            observation: `Phần tử mới val = ${val} NHỎ HƠN HOẶC BẰNG đỉnh heap hiện tại (${currentMin}).`,
            decision: `Bỏ qua ${val}, không thay đổi cấu trúc Heap.`,
            reason: `Đã có ít nhất ${k} phần tử lớn hơn hoặc bằng ${val} trong Heap, nên ${val} không thể thuộc Top ${k}.`,
          });
        }
      }
    }

    steps.push({
      streamIndex: stream.length,
      currentNum: null,
      heapSnapshot: [...heap],
      kthElement: heap[0],
      action: 'DONE',
      observation: `Đã xử lý trọn vẹn toàn bộ luồng số. Top ${k} phần tử lớn nhất là [${[...heap].sort((a,b)=>a-b).join(', ')}].`,
      decision: `Kết thúc mô phỏng. Phần tử lớn thứ ${k} hiện tại là ${heap[0]}.`,
      reason: `Độ phức tạp chỉ O(N log K) thời gian và O(K) bộ nhớ, tối ưu vượt trội so với Sort toàn bộ O(N log N).`,
    });

    return steps;
  }, [activeStreamConfig]);

  useEffect(() => {
    setStreamIndex(0);
    setStreamPlaying(false);
  }, [selectedStreamIdx]);

  useEffect(() => {
    if (streamPlaying) {
      streamTimerRef.current = setInterval(() => {
        setStreamIndex((prev) => {
          if (prev >= streamSteps.length - 1) {
            setStreamPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, streamSpeed);
    } else if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [streamPlaying, streamSteps.length, streamSpeed]);

  // ==========================================
  // STATE MÔ HÌNH 2: TWO HEAPS FIND MEDIAN (LEETCODE 295)
  // ==========================================
  const twoHeapsDatasets = [
    { label: 'Luồng số: [5, 15, 1, 3, 8, 9]', stream: [5, 15, 1, 3, 8, 9] },
    { label: 'Luồng tăng dần: [1, 2, 3, 4, 5]', stream: [1, 2, 3, 4, 5] },
  ];
  const [selectedTwoHeapIdx, setSelectedTwoHeapIdx] = useState<number>(0);
  const [twoHeapIndex, setTwoHeapIndex] = useState<number>(0);
  const [twoHeapPlaying, setTwoHeapPlaying] = useState<boolean>(false);
  const [twoHeapSpeed, setTwoHeapSpeed] = useState<number>(750);
  const twoHeapTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const twoHeapsSteps = useMemo<TwoHeapsStep[]>(() => {
    const rawStream = twoHeapsDatasets[selectedTwoHeapIdx].stream;
    const steps: TwoHeapsStep[] = [];
    const maxH: number[] = []; // Stores left half (sorted descending for visual)
    const minH: number[] = []; // Stores right half (sorted ascending for visual)

    steps.push({
      num: null,
      maxHeap: [],
      minHeap: [],
      median: null,
      action: 'INIT',
      observation: 'Khởi tạo cặp Heaps cân bằng: Max-Heap (lưu nửa số nhỏ) và Min-Heap (lưu nửa số lớn).',
      decision: 'Duy trì điều kiện bất biến: size(Max-Heap) >= size(Min-Heap) và chênh lệch không quá 1.',
      reason: 'Đỉnh Max-Heap và đỉnh Min-Heap kẹp sát trung vị của toàn bộ luồng dữ liệu!',
    });

    for (let i = 0; i < rawStream.length; i++) {
      const x = rawStream[i];
      // 1. Add to maxHeap or minHeap
      if (maxH.length === 0 || x <= maxH[0]) {
        maxH.push(x);
        maxH.sort((a, b) => b - a); // Max-heap top is at index 0
      } else {
        minH.push(x);
        minH.sort((a, b) => a - b); // Min-heap top is at index 0
      }

      // 2. Rebalance
      if (maxH.length > minH.length + 1) {
        const moved = maxH.shift()!;
        minH.push(moved);
        minH.sort((a, b) => a - b);
      } else if (minH.length > maxH.length) {
        const moved = minH.shift()!;
        maxH.push(moved);
        maxH.sort((a, b) => b - a);
      }

      // 3. Calc median
      let med: number;
      if (maxH.length > minH.length) {
        med = maxH[0];
      } else {
        med = (maxH[0] + minH[0]) / 2;
      }

      steps.push({
        num: x,
        maxHeap: [...maxH],
        minHeap: [...minH],
        median: med,
        action: 'CALC',
        observation: `Thêm số ${x}. Phân chia: Nửa dưới (Max-Heap) có ${maxH.length} phần tử, Nửa trên (Min-Heap) có ${minH.length} phần tử.`,
        decision: `Tính trung vị = ${med} (lấy từ đỉnh Max-Heap ${maxH[0]}${maxH.length === minH.length ? ` và đỉnh Min-Heap ${minH[0]}` : ''}).`,
        reason: `Mỗi lần thêm số mất O(log N), truy vấn trung vị tức thì trong O(1).`,
      });
    }

    steps.push({
      num: null,
      maxHeap: [...maxH],
      minHeap: [...minH],
      median: maxH.length > minH.length ? maxH[0] : (maxH[0] + minH[0]) / 2,
      action: 'DONE',
      observation: `Hoàn tất luồng dữ liệu. Hệ thống Two Heaps duy trì trạng thái cân bằng tuyệt đối.`,
      decision: `Kết thúc mô phỏng.`,
      reason: `Đây là giải pháp kinh điển LeetCode 295 giúp đạt O(1) findMedian và O(log N) addNum.`,
    });

    return steps;
  }, [selectedTwoHeapIdx]);

  useEffect(() => {
    setTwoHeapIndex(0);
    setTwoHeapPlaying(false);
  }, [selectedTwoHeapIdx]);

  useEffect(() => {
    if (twoHeapPlaying) {
      twoHeapTimerRef.current = setInterval(() => {
        setTwoHeapIndex((prev) => {
          if (prev >= twoHeapsSteps.length - 1) {
            setTwoHeapPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, twoHeapSpeed);
    } else if (twoHeapTimerRef.current) {
      clearInterval(twoHeapTimerRef.current);
    }
    return () => {
      if (twoHeapTimerRef.current) clearInterval(twoHeapTimerRef.current);
    };
  }, [twoHeapPlaying, twoHeapsSteps.length, twoHeapSpeed]);

  // ==========================================
  // CODE TABS IMPLEMENTATION
  // ==========================================
  const codeTabs: CodeTab[] = [
    {
      id: 'cpp',
      label: 'KthLargest.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: `// LeetCode 703 - Kth Largest Element in a Stream
// Time Complexity: O(log K) per add | Space Complexity: O(K)
#include <vector>
#include <queue>

class KthLargest {
private:
    int k;
    // std::priority_queue with greater<int> implements a MIN-HEAP
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;

public:
    KthLargest(int k_val, const std::vector<int>& nums) : k(k_val) {
        for (int num : nums) {
            add(num);
        }
    }

    int add(int val) {
        if (min_heap.size() < static_cast<size_t>(k)) {
            min_heap.push(val);
        } else if (val > min_heap.top()) {
            min_heap.pop();
            min_heap.push(val);
        }
        // Top of min-heap is the smallest among the top-K largest elements
        return min_heap.top();
    }
};`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 703 - Kth Largest Element in a Stream
// Time Complexity: O(log K) per add | Space Complexity: O(K)
#include <vector>
#include <queue>

class KthLargest {
private:
    int k;
    // std::priority_queue with greater<int> implements a MIN-HEAP
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;

public:
    KthLargest(int k_val, const std::vector<int>& nums) : k(k_val) {
        for (int num : nums) {
            add(num);
        }
    }

    int add(int val) {
        if (min_heap.size() < static_cast<size_t>(k)) {
            min_heap.push(val);
        } else if (val > min_heap.top()) {
            min_heap.pop();
            min_heap.push(val);
        }
        // Top of min-heap is the smallest among the top-K largest elements
        return min_heap.top();
    }
};`}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'kth_largest.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: `# LeetCode 703 - Kth Largest Element in a Stream
# Time Complexity: O(log K) per add | Space Complexity: O(K)
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            # heappushpop is more efficient than a separate pop and push
            heapq.heappushpop(self.heap, val)
        return self.heap[0]`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`# LeetCode 703 - Kth Largest Element in a Stream
# Time Complexity: O(log K) per add | Space Complexity: O(K)
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heappushpop(self.heap, val)
        return self.heap[0]`}</pre>
        </div>
      ),
    },
    {
      id: 'typescript',
      label: 'KthLargest.ts',
      language: 'typescript',
      iconColor: '#3178c6',
      rawCode: `// LeetCode 703 - Kth Largest Element in a Stream
// Time Complexity: O(log K) per add | Space Complexity: O(K)
class MinHeap {
    private data: number[] = [];

    push(val: number): void {
        this.data.push(val);
        this.siftUp(this.data.length - 1);
    }

    pop(): number | undefined {
        if (this.data.length === 0) return undefined;
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this.siftDown(0);
        }
        return top;
    }

    peek(): number | undefined {
        return this.data[0];
    }

    size(): number {
        return this.data.length;
    }

    private siftUp(idx: number): void {
        while (idx > 0) {
            const p = Math.floor((idx - 1) / 2);
            if (this.data[idx] < this.data[p]) {
                [this.data[idx], this.data[p]] = [this.data[p], this.data[idx]];
                idx = p;
            } else break;
        }
    }

    private siftDown(idx: number): void {
        const len = this.data.length;
        while (2 * idx + 1 < len) {
            let left = 2 * idx + 1;
            let right = 2 * idx + 2;
            let smallest = idx;
            if (left < len && this.data[left] < this.data[smallest]) smallest = left;
            if (right < len && this.data[right] < this.data[smallest]) smallest = right;
            if (smallest !== idx) {
                [this.data[idx], this.data[smallest]] = [this.data[smallest], this.data[idx]];
                idx = smallest;
            } else break;
        }
    }
}

class KthLargest {
    private k: number;
    private minHeap = new MinHeap();

    constructor(k: number, nums: number[]) {
        this.k = k;
        for (const num of nums) {
            this.add(num);
        }
    }

    add(val: number): number {
        if (this.minHeap.size() < this.k) {
            this.minHeap.push(val);
        } else if (val > (this.minHeap.peek() ?? -Infinity)) {
            this.minHeap.pop();
            this.minHeap.push(val);
        }
        return this.minHeap.peek()!;
    }
}`,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{`// LeetCode 703 - Kth Largest Element in a Stream
// Time Complexity: O(log K) per add | Space Complexity: O(K)
class KthLargest {
    private k: number;
    private minHeap = new MinHeap();

    constructor(k: number, nums: number[]) {
        this.k = k;
        for (const num of nums) {
            this.add(num);
        }
    }

    add(val: number): number {
        if (this.minHeap.size() < this.k) {
            this.minHeap.push(val);
        } else if (val > (this.minHeap.peek() ?? -Infinity)) {
            this.minHeap.pop();
            this.minHeap.push(val);
        }
        return this.minHeap.peek()!;
    }
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
      question: 'Để duy trì K phần tử NHỎ NHẤT trong một luồng dữ liệu 10 triệu số, ta nên dùng cấu trúc nào tối ưu bộ nhớ?',
      options: [
        'A. Min-Heap kích thước K',
        'B. Max-Heap kích thước K',
        'C. Mảng std::vector và gọi std::sort mỗi lần nạp',
        'D. Hàng đợi hai đầu deque',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Muốn lấy K phần tử NHỎ nhất, ta duy trì một MAX-Heap kích thước K. Đỉnh của Max-Heap là phần tử lớn nhất trong top K nhỏ này; khi có số mới nhỏ hơn đỉnh, ta pop đỉnh và nạp số mới vào.',
    },
    {
      id: 2,
      question: 'Độ phức tạp thời gian khi xây dựng Binary Heap từ một mảng n phần tử có sẵn bằng phương pháp Bottom-up (heapify) là bao nhiêu?',
      options: [
        'A. O(N log N)',
        'B. O(N)',
        'C. O(log N)',
        'D. O(N²)',
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Xây dựng heap theo kiểu Bottom-Up (gọi siftDown từ N/2 về 0) có tổng số phép toán tỉ lệ với tổng độ cao các nút: ∑(h / 2^h) hội tụ về hằng số, nên đạt O(N).',
    },
    {
      id: 3,
      question: 'Trong C++ STL, cú pháp nào sau đây khai báo một MIN-HEAP lưu số nguyên đúng chuẩn?',
      options: [
        'A. std::priority_queue<int>',
        'B. std::priority_queue<int, std::greater<int>>',
        'C. std::priority_queue<int, std::vector<int>, std::greater<int>>',
        'D. std::priority_queue<int, std::less<int>>',
      ],
      correctIndex: 2,
      explanation: 'Chính xác! std::priority_queue nhận 3 template parameters: Type, Container (mặc định vector<Type>), và Compare (mặc định less<Type> tạo Max-Heap). Muốn Min-Heap bắt buộc phải truyền đủ: std::priority_queue<int, std::vector<int>, std::greater<int>>.',
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
      id: 'm1_703',
      title: '703. Kth Largest Element in a Stream',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
      pattern: 'Min-Heap Size K',
      priority: 1,
      hints: [
        'Ta chỉ cần quan tâm đến K phần tử lớn nhất, các phần tử nhỏ hơn K-th largest có thể bỏ qua vĩnh viễn.',
        'Duy trì một Min-Heap có tối đa K phần tử. Khi thêm một số, nếu heap chưa đủ K thì push, ngược lại nếu số mới > heap.top() thì pop đỉnh rồi push số mới.',
        'Khung class: priority_queue<int, vector<int>, greater<int>> pq; return pq.top();',
      ],
    },
    {
      id: 'm1_215',
      title: '215. Kth Largest Element in an Array',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      pattern: 'Min-Heap vs QuickSelect',
      priority: 1,
      hints: [
        'Cách 1: Duyệt qua mảng và duy trì Min-Heap kích thước K -> O(N log K) thời gian và O(K) bộ nhớ.',
        'Cách 2: Trong CP, ta có thể dùng std::nth_element(nums.begin(), nums.begin() + k - 1, nums.end(), greater<int>()) để đạt O(N) trung bình.',
        'Khung Heap: Duyệt num trong nums: pq.push(num); if (pq.size() > k) pq.pop(); return pq.top();',
      ],
    },
    {
      id: 'm1_347',
      title: '347. Top K Frequent Elements',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/top-k-frequent-elements/',
      pattern: 'Min-Heap on Frequency / Bucket Sort',
      priority: 1,
      hints: [
        'Bước 1: Đếm tần số xuất hiện của từng số bằng bảng băm unordered_map<int, int>.',
        'Bước 2: Dùng Min-Heap kích thước K lưu pair<frequency, value> để giữ K phần tử có tần số cao nhất.',
        'Khung: Duyệt map: pq.push({count, num}); if (pq.size() > k) pq.pop(); Lấy k phần tử trong heap ra vector kết quả.',
      ],
    },
    {
      id: 'm1_1046',
      title: '1046. Last Stone Weight',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/last-stone-weight/',
      pattern: 'Max-Heap Simulation',
      priority: 2,
      hints: [
        'Mỗi bước cần lấy ra 2 viên đá nặng nhất -> Cấu trúc nào lấy phần tử cực đại liên tục trong O(log N)?',
        'Nạp tất cả hòn đá vào Max-Heap std::priority_queue<int>. Lấy ra x = pq.top(); pq.pop(); y = pq.top(); pq.pop(); nếu x != y thì push x - y vào lại.',
        'Vòng lặp while (pq.size() > 1); return pq.empty() ? 0 : pq.top();',
      ],
    },
    {
      id: 'm1_973',
      title: '973. K Closest Points to Origin',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
      pattern: 'Max-Heap Size K',
      priority: 2,
      hints: [
        'Muốn tìm K điểm GẦN gốc tọa độ nhất, khoảng cách d = x^2 + y^2 là nhỏ nhất. Hãy dùng MAX-Heap kích thước K!',
        'Đỉnh Max-Heap là điểm xa nhất trong top K gần nhất. Nếu điểm mới gần hơn đỉnh, thay thế đỉnh bằng điểm mới.',
        'Khung: struct Compare { bool operator()(auto& a, auto& b) { return dist(a) < dist(b); } };',
      ],
    },
    {
      id: 'm1_451',
      title: '451. Sort Characters By Frequency',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/sort-characters-by-frequency/',
      pattern: 'Max-Heap / Bucket Sort',
      priority: 2,
      hints: [
        'Đếm tần số ký tự, sau đó nạp các cặp (frequency, char) vào Max-Heap để lấy ký tự xuất hiện nhiều nhất trước.',
        'Lần lượt pop từng phần tử từ Max-Heap và nối chuỗi lặp lại count lần.',
        'Khung: while (!pq.empty()) { auto [cnt, ch] = pq.top(); pq.pop(); res.append(cnt, ch); }',
      ],
    },
    {
      id: 'm1_378',
      title: '378. Kth Smallest Element in a Sorted Matrix',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
      pattern: 'Multi-Way Merge với Min-Heap',
      priority: 2,
      hints: [
        'Ma trận có các hàng và cột đều đã sắp xếp. Đây chính là bài toán ghép K danh sách đã sắp xếp!',
        'Đưa phần tử đầu tiên của mỗi hàng vào Min-Heap: tuple<val, row, col>. Pop phần tử nhỏ nhất, sau đó push phần tử kế tiếp của hàng đó matrix[row][col + 1].',
        'Lặp đúng k lần, phần tử lấy ra ở lần thứ k chính là đáp án.',
      ],
    },
    {
      id: 'm1_295',
      title: '295. Find Median from Data Stream',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/find-median-from-data-stream/',
      pattern: 'Two Heaps (Max-Heap & Min-Heap)',
      priority: 3,
      hints: [
        'Chia dữ liệu thành 2 nửa: Nửa nhỏ lưu trong Max-Heap, nửa lớn lưu trong Min-Heap.',
        'Bất biến: size(maxHeap) >= size(minHeap) và chênh lệch tối đa 1 phần tử. Mọi phần tử trong maxHeap <= mọi phần tử trong minHeap.',
        'Khung: Nếu tổng phần tử lẻ, median = maxHeap.top(). Nếu chẵn, median = (maxHeap.top() + minHeap.top()) / 2.0.',
      ],
    },
    {
      id: 'm1_23',
      title: '23. Merge k Sorted Lists',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      pattern: 'K-Way Merge with Min-Heap',
      priority: 3,
      hints: [
        'Có K danh sách liên kết đã sort. Tại mỗi bước, nút nhỏ nhất trong số K đầu danh sách phải được chọn trước.',
        'Duy trì Min-Heap kích thước K chứa con trỏ ListNode*. Pop nút nhỏ nhất nối vào danh sách kết quả, rồi push node->next vào heap nếu khác nullptr.',
        'Độ phức tạp: O(N log K) với N là tổng số nút.',
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

  const currStream = streamSteps[streamIndex] || streamSteps[0];
  const currTwoHeap = twoHeapsSteps[twoHeapIndex] || twoHeapsSteps[0];

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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.4 Heap (Priority Queue)</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.4
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
          Hàng Đợi Ưu Tiên (Priority Queue) & Cấu Trúc Heap
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Làm chủ cấu trúc <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">Binary Heap</code> cho phép truy xuất phần tử cực trị (Min/Max) trong <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(1)</code>, thêm/xóa trong <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">O(log N)</code>, và giải quyết bài toán Top-K cùng tìm Trung Vị (Median) trên luồng dữ liệu liên tục.
        </p>

        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'Min-Heap & Max-Heap',
            'std::priority_queue',
            'Top-K Stream O(N log K)',
            'Two Heaps Find Median',
            'K-Way Merge',
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
          Xét bài toán kinh điển <strong>LeetCode 703 (Kth Largest Element in a Stream)</strong>: Một hệ thống nhận liên tục $M = 10^5$ số nguyên từ luồng dữ liệu. Sau mỗi lần nhận một số mới, hệ thống phải trả về giá trị của <strong>phần tử lớn thứ $K$</strong> trong toàn bộ các số đã thấy từ trước đến nay (với $K \le 10^4$).
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cách vét cạn trực giác nhất: Mỗi khi nhận một số mới, ta đẩy số đó vào một mảng động và gọi hàm sắp xếp <span className="font-mono font-bold text-rose-600 dark:text-rose-400">std::sort</span>. Với $N$ số đang có trong mảng, chi phí mỗi lần là $O(N \log N)$. Khi thực hiện $M$ lần chèn, tổng số phép tính sẽ lên tới:
        </p>

        <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-mono">
          Tổng thời gian = ∑ (i log i) ≈ O(M × N log N) ≈ 10⁵ × 10⁵ × 17 ≈ 1.7 × 10¹¹ phép tính → TLE tuyệt đối (ngưỡng 10⁸/giây)!
        </div>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          <strong>Câu hỏi phản biện:</strong> Tại sao ta phải tốn công sắp xếp toàn bộ $N$ phần tử trong khi ta <em>chỉ cần biết phần tử lớn thứ K</em>? Liệu có cách nào chỉ duy trì đúng $K$ phần tử ứng viên sáng giá nhất, và phần tử nhỏ nhất trong nhóm $K$ ứng viên đó luôn nằm ngay tại đỉnh để lấy ra trong $O(1)$?
        </p>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Đảo Nghịch Tư Duy — Min-Heap Kích Thước K
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Nhiều bạn thường nghĩ: "Tìm phần tử <em>lớn</em> thứ K thì phải dùng <em>Max-Heap</em>". Đó là một cạm bẫy! Nếu dùng Max-Heap, bạn buộc phải chứa toàn bộ $N$ phần tử, mỗi lần muốn tìm phần tử thứ $K$ bạn phải pop ra $K-1$ lần rồi push ngược lại.
        </p>

        <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/30 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">
            Quy Tắc Vàng Của Huấn Luyện Viên CP:
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong>"Để duy trì K phần tử LỚN nhất, hãy dùng MIN-Heap kích thước K. Đỉnh của Min-Heap chính là kẻ yếu nhất trong nhóm mạnh nhất — tức là phần tử lớn thứ K!"</strong>
          </p>
        </div>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Cơ chế hoạt động cực kỳ tao nhã:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li>Khi heap chưa đủ $K$ phần tử: Cứ đẩy số mới vào thẳng heap ($O(\log K)$).</li>
          <li>Khi heap đã đủ $K$ phần tử: So sánh số mới $x$ với đỉnh heap <code className="font-mono text-teal-600 font-bold">top()</code>:
            <ul className="list-disc list-inside ml-5 mt-1 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Nếu $x \le$ <code className="font-mono">top()</code>: Số mới $x$ không đủ điều kiện lọt vào Top K. Bỏ qua ngay lập tức ($O(1)$).</li>
              <li>Nếu $x &gt;$ <code className="font-mono">top()</code>: Đỉnh cũ chắc chắn bị đánh bật khỏi Top K. Ta loại đỉnh cũ bằng <code className="font-mono">pop()</code> và chèn $x$ vào bằng <code className="font-mono">push()</code> ($O(\log K)$).</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 1: TOP-K STREAM */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          3. Mô Phỏng Tương Tác: Min-Heap Kích Thước K (Top-K Stream)
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Quan sát cách Min-Heap kích thước $K$ duy trì Top $K$ phần tử lớn nhất và tự động cập nhật phần tử lớn thứ $K$ tại đỉnh heap:
        </p>

        {/* Dataset selector */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-500 font-medium">Chọn bộ test:</span>
          {streamDatasets.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedStreamIdx(idx)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                selectedStreamIdx === idx
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

          {/* Stream sequence */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Luồng Dữ Liệu Vào (Stream)
              </span>
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
                K = {activeStreamConfig.k}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              {activeStreamConfig.stream.map((num, idx) => {
                const isCurrent = idx === currStream.streamIndex;
                const isProcessed = idx < currStream.streamIndex;
                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 rounded flex flex-col items-center justify-center font-mono text-xs transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-white font-bold scale-110 shadow-md ring-2 ring-amber-300 dark:ring-amber-700'
                        : isProcessed
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{num}</span>
                    <span className="text-[9px] opacity-75">#{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Min-Heap Container */}
          <div className="mb-5 p-4 rounded-xl border border-teal-200 dark:border-teal-900/70 bg-teal-50/30 dark:bg-teal-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Min-Heap (Kích thước tối đa K = {activeStreamConfig.k})
                </span>
                <Badge variant="teal" size="xs">
                  {currStream.heapSnapshot.length}/{activeStreamConfig.k} ô
                </Badge>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
                Đỉnh Heap (K-th Largest):{' '}
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                  {currStream.kthElement !== null ? currStream.kthElement : 'Chưa đủ K'}
                </span>
              </div>
            </div>

            {/* Heap array boxes */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-3">
              {currStream.heapSnapshot.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-4">Heap hiện tại đang rỗng</div>
              ) : (
                currStream.heapSnapshot.map((val, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-[10px] font-mono text-slate-400 mb-1">
                        {isTop ? 'Đỉnh (top)' : `Node [${idx}]`}
                      </div>
                      <div
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-sm ${
                          isTop
                            ? 'bg-teal-600 text-white ring-4 ring-teal-200 dark:ring-teal-900 text-base scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-teal-300 dark:border-teal-700 text-sm'
                        }`}
                      >
                        <span>{val}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Binary Tree visual hint */}
            {currStream.heapSnapshot.length > 0 && (
              <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2 font-mono">
                Thứ tự mảng Heap: [{currStream.heapSnapshot.join(', ')}]
              </div>
            )}
          </div>

          {/* Step Explanation Card (aria-live) */}
          <div
            aria-live="polite"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 mb-4"
          >
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Quan sát: </span>
              <span className="text-slate-800 dark:text-slate-200">{currStream.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{currStream.decision}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Lý do: </span>
              <span className="text-slate-600 dark:text-slate-400">{currStream.reason}</span>
            </div>
          </div>

          {/* Visualizer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStreamIndex(0)}
                title="Đặt lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={streamIndex === 0}
                onClick={() => setStreamIndex((prev) => Math.max(0, prev - 1))}
                title="Bước trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStreamPlaying(!streamPlaying)}
              >
                {streamPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {streamPlaying ? 'Tạm dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={streamIndex >= streamSteps.length - 1}
                onClick={() => setStreamIndex((prev) => Math.min(streamSteps.length - 1, prev + 1))}
                title="Bước tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">
                Bước {streamIndex + 1}/{streamSteps.length}
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
                    onClick={() => setStreamSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      streamSpeed === s.speed
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

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: TWO HEAPS FIND MEDIAN */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4. Kỹ Thuật Nâng Cao: Cặp Two Heaps Tìm Trung Vị (LeetCode 295)
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Tìm trung vị của một luồng số liên tục là câu hỏi phỏng vấn kinh điển tại Google và Meta. Nếu mỗi lần tìm ta sắp xếp mảng mất $O(N \log N)$. Nhưng nếu chia luồng số làm hai nửa bằng <strong>Max-Heap (lưu nửa nhỏ)</strong> và <strong>Min-Heap (lưu nửa lớn)</strong>, ta sẽ tìm được trung vị ngay lập tức trong <span className="font-mono font-bold text-teal-600">O(1)</span>!
        </p>

        {/* Dataset selector Two Heaps */}
        <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
          <span className="text-xs text-slate-500 font-medium">Chọn luồng số mẫu:</span>
          {twoHeapsDatasets.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedTwoHeapIdx(idx)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                selectedTwoHeapIdx === idx
                  ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Visualizer Card Two Heaps */}
        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm mt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cơ chế cân bằng Two Heaps (LeetCode 295)
            </span>
            <div className="text-xs font-mono">
              Trung vị hiện tại:{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                {currTwoHeap.median !== null ? currTwoHeap.median : 'Chưa có'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Left: Max-Heap */}
            <div className="p-3 rounded-lg border border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300">
                  Max-Heap (Nửa Nhỏ ≤ Median)
                </span>
                <Badge variant="slate" size="xs">
                  {currTwoHeap.maxHeap.length} số
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] items-center">
                {currTwoHeap.maxHeap.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Rỗng</span>
                ) : (
                  currTwoHeap.maxHeap.map((v, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                        idx === 0
                          ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
                          : 'bg-white dark:bg-slate-800 text-sky-900 dark:text-sky-200 border border-sky-300'
                      }`}
                    >
                      {v} {idx === 0 && '(top)'}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Right: Min-Heap */}
            <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Min-Heap (Nửa Lớn ≥ Median)
                </span>
                <Badge variant="slate" size="xs">
                  {currTwoHeap.minHeap.length} số
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] items-center">
                {currTwoHeap.minHeap.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Rỗng</span>
                ) : (
                  currTwoHeap.minHeap.map((v, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                          : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-300'
                      }`}
                    >
                      {v} {idx === 0 && '(top)'}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Two Heaps Explanation */}
          <div
            aria-live="polite"
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1 mb-4"
          >
            <div>
              <span className="font-semibold text-slate-500">Quan sát: </span>
              <span className="text-slate-800 dark:text-slate-200">{currTwoHeap.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600">Quy tắc: </span>
              <span className="text-slate-800 dark:text-slate-200">{currTwoHeap.reason}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTwoHeapIndex(0)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={twoHeapIndex === 0}
                onClick={() => setTwoHeapIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setTwoHeapPlaying(!twoHeapPlaying)}
              >
                {twoHeapPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {twoHeapPlaying ? 'Dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={twoHeapIndex >= twoHeapsSteps.length - 1}
                onClick={() => setTwoHeapIndex((p) => Math.min(twoHeapsSteps.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">
                Bước {twoHeapIndex + 1}/{twoHeapsSteps.length}
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
                    onClick={() => setTwoHeapSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      twoHeapSpeed === s.speed
                        ? 'bg-white dark:bg-slate-700 text-amber-600 font-bold shadow-xs'
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

      {/* 5. KHI NÀO DÙNG HEAP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Bảng Dấu Hiệu Đề Bài Nhận Diện Cấu Trúc Heap
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="p-3">Cụm từ xuất hiện trong đề bài</th>
                <th className="p-3">Mô hình Heap tối ưu</th>
                <th className="p-3">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans">"Kth largest element in a stream / array"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Min-Heap kích thước K</td>
                <td className="p-3">O(N log K) time, O(K) space</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"K closest points to origin"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Max-Heap kích thước K theo khoảng cách</td>
                <td className="p-3">O(N log K) time, O(K) space</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"Find median from continuous data stream"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Two Heaps (Max-Heap + Min-Heap)</td>
                <td className="p-3">O(log N) add, O(1) query</td>
              </tr>
              <tr>
                <td className="p-3 font-sans">"Merge K sorted lists / arrays"</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">Min-Heap đa luồng kích thước K</td>
                <td className="p-3">O(N log K)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <strong>Không nên dùng Heap khi:</strong> Bạn cần tìm kiếm một phần tử bất kỳ theo giá trị trong $O(\log N)$ hoặc duyệt các phần tử theo thứ tự tăng dần. Heap chỉ hỗ trợ xem phần tử cực trị tại gốc trong $O(1)$; thao tác tìm kiếm hay xóa một phần tử ngẫu nhiên ở giữa Heap mất $O(N)$. Với yêu cầu tra cứu ngẫu nhiên, hãy dùng <strong>std::set</strong> hoặc <strong>std::map</strong> (Bài 1.5 & 1.6).
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN (BẤT BIẾN) */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Chứng Minh Tính Đúng Đắn (Loop Invariant)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>1. Bất biến (Invariant):</strong> Tại mỗi bước $i$ trong quá trình duyệt luồng số, Min-Heap luôn chứa đúng $\min(i, K)$ phần tử có giá trị lớn nhất trong toàn bộ các phần tử đã duyệt &#123;$a_1, a_2, \dots, a_i$&#125;.
          </p>
          <p>
            <strong>2. Duy trì (Maintenance):</strong> Khi nhận phần tử mới $a_&#123;i+1&#125;$:
            Nếu $i &lt; K$, chèn trực tiếp làm tăng kích thước heap lên $i+1$, bất biến giữ nguyên.
            Nếu $i \ge K$, giả sử đỉnh heap hiện tại là $M =$ <code className="font-mono">top()</code>. Nếu $a_&#123;i+1&#125; \le M$, rõ ràng $a_&#123;i+1&#125;$ không thể lớn hơn bất kỳ ai trong top $K$ hiện tại $\to$ bỏ qua là đúng. Nếu $a_&#123;i+1&#125; &gt; M$, khi đó có ít nhất $K$ phần tử lớn hơn $M$ (gồm $K-1$ phần tử còn lại trong heap và $a_&#123;i+1&#125;$), do đó $M$ chắc chắn bị đẩy khỏi top $K$. Việc loại $M$ và nạp $a_&#123;i+1&#125;$ giữ cho tập hợp trong heap tiếp tục là $K$ phần tử lớn nhất.
          </p>
          <p>
            <strong>3. Kết thúc (Termination):</strong> Sau khi duyệt hết $N$ phần tử, Min-Heap chứa đúng $K$ phần tử lớn nhất. Vì là Min-Heap, phần tử tại đỉnh heap có giá trị nhỏ nhất trong tập hợp này, chính là phần tử lớn thứ $K$ chuẩn xác.
          </p>
        </div>
      </section>

      {/* 7. CÀI ĐẶT MẪU CHUẨN CP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={codeTabs} />

        <div className="mt-4 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs sm:text-sm font-mono">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
            Template Khung Khởi Tạo Heap Trong C++20:
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {`// 1. Max-Heap (mặc định):
std::priority_queue<int> max_pq;

// 2. Min-Heap:
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;

// 3. Custom Comparator với Lambda:
auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) {
    return a.first > b.first; // Min-heap theo phần tử đầu
};
std::priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> custom_pq(cmp);`}
          </div>
        </div>
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy CP & Lỗi Thường Gặp Khi Dùng Heap
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 1: Gọi top() hoặc pop() trên Priority Queue rỗng.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Lỗi Runtime Error (SIGSEGV hoặc Segmentation Fault). Trong C++, `top()` trên heap rỗng là Undefined Behavior.
              <br />
              <em>Cách sửa:</em> Luôn bọc điều kiện <code className="font-mono text-teal-600">if (!pq.empty())</code> trước khi truy cập đỉnh hoặc xóa.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 2: Viết ngược logic Comparator trong C++ std::priority_queue.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Cần Min-Heap nhưng Heap lại trả ra giá trị lớn nhất trước.
              <br />
              <em>Nguyên nhân:</em> Trong hàm <code className="font-mono">std::sort</code>, comparator trả về <code className="font-mono">a &lt; b</code> sẽ sắp xếp tăng dần. Nhưng trong <code className="font-mono">std::priority_queue</code>, toán tử so sánh <code className="font-mono">less&lt;T&gt;</code> định nghĩa ai có độ ưu tiên thấp hơn (nằm sâu dưới đáy), do đó phần tử lớn nhất sẽ nằm trên đỉnh (Max-Heap)!
              <br />
              <em>Quy tắc:</em> Toán tử <code className="font-mono">greater&lt;T&gt;</code> (<code className="font-mono">a &gt; b</code>) tạo <strong>Min-Heap</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 3: Xây dựng Heap bằng cách push từng phần tử O(N log N) thay vì O(N).</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Tốn thời gian chạy ban đầu khi có sẵn $N$ số.
              <br />
              <em>Cách sửa:</em> Dùng constructor nhận 2 iterator: <code className="font-mono">priority_queue&lt;int&gt; pq(nums.begin(), nums.end());</code>. C++ sẽ tự động chạy thuật toán <strong>heapify</strong> trong $O(N)$.
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

      {/* 10. BÀI TẬP RÈN LUYỆN (LEETCODE PRACTICE) */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="heading-section text-slate-900 dark:text-white mb-0">
              10. Ngân Hàng Bài Tập LeetCode
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân loại theo tiêu chuẩn PLANNING.md với hệ thống gợi ý 3 tầng không spoil code.
            </p>
          </div>

          {/* Priority filter buttons */}
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
            Bài tiếp theo: 1.5 BST (Set & Multiset)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cây đỏ-đen std::set, std::multiset và kỹ thuật tra cứu lower_bound / upper_bound trong O(log N).
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.5')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 1.5
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_Heap;
