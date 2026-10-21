import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const bstSetCodeTabs: CodeTab[] = [
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

export const bstSetQuizQuestions: QuizQuestion[] = [
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

export const bstSetPracticeProblems: PracticeProblem[] = [
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
