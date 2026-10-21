import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const bitsetCodeTabs: CodeTab[] = [
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

export const bitsetQuizQuestions: QuizQuestion[] = [
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

export const bitsetPracticeProblems: PracticeProblem[] = [
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
