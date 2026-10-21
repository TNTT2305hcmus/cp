import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const vectorSortingCodeTabs: CodeTab[] = [
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

export const vectorSortingQuizQuestions: QuizQuestion[] = [
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

export const vectorSortingPracticeProblems: PracticeProblem[] = [
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
