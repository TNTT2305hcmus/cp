import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const heapCodeTabs: CodeTab[] = [
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

export const heapQuizQuestions: QuizQuestion[] = [
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

export const heapPracticeProblems: PracticeProblem[] = [
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
