import type { CodeTab } from '../../components/CodeViewer';
import type { PracticeProblem, QuizQuestion } from '../../types/lesson';

export const mapHashCodeTabs: CodeTab[] = [
  {
    id: 'cpp',
    label: 'CustomHashAndRandomSet.cpp',
    language: 'cpp',
    iconColor: '#00599c',
    rawCode: `// 1. Template Custom Hash chuẩn thi đấu CP (Chống Hack Anti-Hash trên Codeforces)
// Dùng hàm xáo trộn bit splitmix64 kết hợp thời gian thực ngẫu nhiên
#include <chrono>
#include <vector>
#include <unordered_map>
#include <cstdlib>

struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        // http://xorshift.di.unimi.it/splitmix64.c
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }

    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM =
            std::chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

// Cách khai báo an toàn:
// std::unordered_map<long long, int, custom_hash> safe_map;

// 2. LeetCode 380 - Insert Delete GetRandom O(1)
class RandomizedSet {
private:
    std::vector<int> nums;
    std::unordered_map<int, int, custom_hash> val_to_idx;

public:
    RandomizedSet() {}

    bool insert(int val) {
        if (val_to_idx.count(val)) return false;
        nums.push_back(val);
        val_to_idx[val] = static_cast<int>(nums.size() - 1);
        return true;
    }

    bool remove(int val) {
        if (!val_to_idx.count(val)) return false;
        int idx = val_to_idx[val];
        int last_element = nums.back();

        // Swap last element into the position of element to remove
        nums[idx] = last_element;
        val_to_idx[last_element] = idx;

        // Pop last element in O(1)
        nums.pop_back();
        val_to_idx.erase(val);
        return true;
    }

    int getRandom() {
        return nums[std::rand() % nums.size()];
    }
};`,
    content: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
        <pre>{`// Template Custom Hash chuẩn thi đấu CP
// Chống Hack Anti-Hash trên Codeforces bằng splitmix64
#include <chrono>
#include <vector>
#include <unordered_map>
#include <cstdlib>

struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }

    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM =
            std::chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

// LeetCode 380 - Insert Delete GetRandom O(1)
class RandomizedSet {
private:
    std::vector<int> nums;
    std::unordered_map<int, int, custom_hash> val_to_idx;

public:
    bool insert(int val) {
        if (val_to_idx.count(val)) return false;
        nums.push_back(val);
        val_to_idx[val] = nums.size() - 1;
        return true;
    }

    bool remove(int val) {
        if (!val_to_idx.count(val)) return false;
        int idx = val_to_idx[val];
        int last = nums.back();

        nums[idx] = last;
        val_to_idx[last] = idx;

        nums.pop_back();
        val_to_idx.erase(val);
        return true;
    }

    int getRandom() {
        return nums[std::rand() % nums.size()];
    }
};`}</pre>
      </div>
    ),
  },
  {
    id: 'python',
    label: 'randomized_set.py',
    language: 'python',
    iconColor: '#3572a5',
    rawCode: `# LeetCode 380 - Insert Delete GetRandom O(1)
# Python dict uses SipHash with a randomized process seed by default.
import random

class RandomizedSet:
    def __init__(self):
        self.nums = []
        self.val_to_idx = {}

    def insert(self, val: int) -> bool:
        if val in self.val_to_idx:
            return False
        self.nums.append(val)
        self.val_to_idx[val] = len(self.nums) - 1
        return True

    def remove(self, val: int) -> bool:
        if val not in self.val_to_idx:
            return False
        idx = self.val_to_idx[val]
        last_val = self.nums[-1]

        # Overwrite position with last element
        self.nums[idx] = last_val
        self.val_to_idx[last_val] = idx

        # Pop from array and remove from map in O(1)
        self.nums.pop()
        del self.val_to_idx[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.nums)`,
    content: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
        <pre>{`# LeetCode 380 - Insert Delete GetRandom O(1)
import random

class RandomizedSet:
    def __init__(self):
        self.nums = []
        self.val_to_idx = {}

    def insert(self, val: int) -> bool:
        if val in self.val_to_idx:
            return False
        self.nums.append(val)
        self.val_to_idx[val] = len(self.nums) - 1
        return True

    def remove(self, val: int) -> bool:
        if val not in self.val_to_idx:
            return False
        idx = self.val_to_idx[val]
        last = self.nums[-1]

        self.nums[idx] = last
        self.val_to_idx[last] = idx

        self.nums.pop()
        del self.val_to_idx[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.nums)`}</pre>
      </div>
    ),
  },
  {
    id: 'typescript',
    label: 'RandomizedSet.ts',
    language: 'typescript',
    iconColor: '#3178c6',
    rawCode: `// LeetCode 380 - Insert Delete GetRandom O(1)
class RandomizedSet {
    private nums: number[] = [];
    private valToIdx = new Map<number, number>();

    insert(val: number): boolean {
        if (this.valToIdx.has(val)) return false;
        this.nums.push(val);
        this.valToIdx.set(val, this.nums.length - 1);
        return true;
    }

    remove(val: number): boolean {
        if (!this.valToIdx.has(val)) return false;
        const idx = this.valToIdx.get(val)!;
        const lastVal = this.nums[this.nums.length - 1];

        // Swap with last element
        this.nums[idx] = lastVal;
        this.valToIdx.set(lastVal, idx);

        this.nums.pop();
        this.valToIdx.delete(val);
        return true;
    }

    getRandom(): number {
        const randIdx = Math.floor(Math.random() * this.nums.length);
        return this.nums[randIdx];
    }
}`,
    content: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
        <pre>{`// LeetCode 380 - Insert Delete GetRandom O(1)
class RandomizedSet {
    private nums: number[] = [];
    private valToIdx = new Map<number, number>();

    insert(val: number): boolean {
        if (this.valToIdx.has(val)) return false;
        this.nums.push(val);
        this.valToIdx.set(val, this.nums.length - 1);
        return true;
    }

    remove(val: number): boolean {
        if (!this.valToIdx.has(val)) return false;
        const idx = this.valToIdx.get(val)!;
        const last = this.nums[this.nums.length - 1];

        this.nums[idx] = last;
        this.valToIdx.set(last, idx);

        this.nums.pop();
        this.valToIdx.delete(val);
        return true;
    }

    getRandom(): number {
        const idx = Math.floor(Math.random() * this.nums.length);
        return this.nums[idx];
    }
}`}</pre>
      </div>
    ),
  },
];

export const mapHashQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Tại sao std::unordered_map mặc định trên GCC compiler lại dễ dàng bị hack TLE trên Codeforces?',
    options: [
      'A. Vì hàm băm mặc định của kiểu số nguyên là hàm đồng nhất h(x) = x kết hợp với modulo bảng nguyên tố cố định, đối thủ có thể dựng sẵn test va chạm 100% vào 1 bucket',
      'B. Vì std::unordered_map tự động sắp xếp lại các phần tử',
      'C. Vì g++ không hỗ trợ bảng băm',
      'D. Vì bộ nhớ của unordered_map bị rò rỉ (memory leak)',
    ],
    correctIndex: 0,
    explanation: 'Chính xác! GCC std::hash<int> triển khai toán tử đồng nhất operator()(int x) { return x; } và kích thước bảng nguyên tố được định nghĩa sẵn trong mã nguồn g++. Bất kỳ ai cũng có thể tạo 10⁵ số chia hết cho số nguyên tố đó để dồn tất cả vào cùng 1 bucket, biến O(1) thành O(N) và tổng thời gian thành O(N²).',
  },
  {
    id: 2,
    question: 'Trong C++, điều gì xảy ra nếu bạn kiểm tra: if (my_map[100] == 5) khi số 100 CHƯA TỒN TẠI trong my_map?',
    options: [
      'A. Chương trình báo lỗi Undefined Behavior',
      'B. Số 100 sẽ bị ngầm định chèn vào map với giá trị mặc định là 0, làm tăng kích thước của map',
      'C. Biểu thức trả về false và không làm thay đổi map',
      'D. Chương trình ném ngoại lệ std::out_of_range',
    ],
    correctIndex: 1,
    explanation: 'Chính xác! Toán tử operator[] trong map/unordered_map sẽ tự động chèn key nếu key chưa có. Muốn kiểm tra mà không làm biến đổi map, bắt buộc phải dùng my_map.count(key) hoặc my_map.find(key) != my_map.end().',
  },
  {
    id: 3,
    question: 'Trong thiết kế LeetCode 380, kỹ thuật cốt lõi nào giúp hàm remove() đạt O(1) thay vì O(N)?',
    options: [
      'A. Dùng danh sách liên kết đơn',
      'B. Dùng cây nhị phân tìm kiếm BST',
      'C. Lấy phần tử cuối mảng ghi đè vào vị trí của phần tử cần xóa, cập nhật lại index trong map rồi gọi pop_back()',
      'D. Dùng mảng cố định kích thước 1 triệu',
    ],
    correctIndex: 2,
    explanation: 'Chính xác! Việc xóa ở giữa mảng tốn O(N) do phải dời các phần tử phía sau. Bằng cách hoán đổi phần tử cần xóa với phần tử cuối mảng, ta chỉ cần xóa phần tử cuối bằng pop_back() trong O(1).',
  },
];

export const mapHashPracticeProblems: PracticeProblem[] = [
  {
    id: 'm1_706',
    title: '706. Design HashMap',
    difficulty: 'Easy',
    url: 'https://leetcode.com/problems/design-hashmap/',
    pattern: 'Hash Table Chaining',
    priority: 1,
    hints: [
      'Tạo một mảng các bucket có kích thước là một số nguyên tố (ví dụ 10007). Mỗi bucket chứa danh sách các cặp (key, value).',
      'Hàm put: Tính hash = key % PRIME. Duyệt bucket, nếu thấy key thì cập nhật value, chưa có thì thêm cặp mới.',
      'Hàm get và remove tương tự, trả về -1 nếu không tìm thấy key.',
    ],
  },
  {
    id: 'm1_1',
    title: '1. Two Sum',
    difficulty: 'Easy',
    url: 'https://leetcode.com/problems/two-sum/',
    pattern: 'Complement Lookup Hash Map',
    priority: 1,
    hints: [
      'Với mỗi số x = nums[i], ta cần tìm xem số bù target - x đã xuất hiện trước đó chưa.',
      'Lưu ánh xạ num -> index vào Hash Map trong khi duyệt mảng một lượt duy nhất.',
      'Khung: if (mp.count(target - x)) return {mp[target - x], i}; mp[x] = i;',
    ],
  },
  {
    id: 'm1_49',
    title: '49. Group Anagrams',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/group-anagrams/',
    pattern: 'Canonical Key Hash Map',
    priority: 2,
    hints: [
      'Hai từ là Anagram của nhau khi và chỉ khi sau khi sắp xếp các ký tự chúng trở thành cùng một chuỗi.',
      'Dùng chuỗi đã sắp xếp làm khóa trong unordered_map<string, vector<string>>.',
      'Trong CP, nếu chuỗi rất dài, ta có thể dùng vector tần số 26 ký tự làm key để đạt O(N * L) thay vì O(N * L log L).',
    ],
  },
  {
    id: 'm1_380',
    title: '380. Insert Delete GetRandom O(1)',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
    pattern: 'Vector + Hash Map Swap Delete',
    priority: 2,
    hints: [
      'Mảng vector cho phép getRandom O(1) theo chỉ số ngẫu nhiên.',
      'Hash Map cho phép kiểm tra tồn tại và định vị chỉ số của phần tử trong O(1).',
      'Khi xóa: Đổi chỗ phần tử cần xóa với nums.back(), cập nhật map của phần tử cuối, rồi gọi nums.pop_back().',
    ],
  },
  {
    id: 'm1_432',
    title: '432. All O`one Data Structure',
    difficulty: 'Hard',
    url: 'https://leetcode.com/problems/all-oone-data-structure/',
    pattern: 'Doubly Linked List + Hash Map',
    priority: 3,
    hints: [
      'Cần lấy MaxKey và MinKey trong O(1), đồng thời inc và dec key trong O(1).',
      'Dùng danh sách liên kết đôi (Doubly Linked List) lưu các Node tần số tăng dần: mỗi Node chứa một giá trị count và một HashSet các key có cùng count đó.',
      'Hai Hash Map: một map lưu key -> con trỏ Node trong list; một map lưu liên kết hai đầu.',
    ],
  },
];
