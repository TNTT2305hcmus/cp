import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const queueDequeCodeTabs: CodeTab[] = [
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
        std::deque<int> dq; // Lưu trữ chỉ số

        for (int i = 0; i < n; ++i) {
            // 1. Loại bỏ phần tử trượt ra khỏi cửa sổ ở đầu
            if (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }

            // 2. Duy trì tính giảm dần: pop_back các phần tử nhỏ hơn hoặc bằng
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }

            // 3. Đưa chỉ số hiện tại vào đuôi
            dq.push_back(i);

            // 4. Đầu deque luôn là giá trị lớn nhất của cửa sổ
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
}`}</pre>
      </div>
    ),
  },
];

export const queueDequeQuizQuestions: QuizQuestion[] = [
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

export const queueDequePracticeProblems: PracticeProblem[] = [
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
