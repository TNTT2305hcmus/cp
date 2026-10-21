import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const twoPointersCodeTabs: CodeTab[] = [
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

export const twoPointersQuizQuestions: QuizQuestion[] = [
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

export const twoPointersPracticeProblems: PracticeProblem[] = [
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
