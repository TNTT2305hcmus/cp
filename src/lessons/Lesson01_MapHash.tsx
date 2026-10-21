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
export interface HashCollisionStep {
  scenario: 'UNIFORM' | 'ANTI_HASH';
  insertedKey: number;
  bucketIndex: number;
  buckets: number[][]; // 7 buckets containing keys
  action: 'INIT' | 'INSERT' | 'COLLISION' | 'LOOKUP_SLOW' | 'DONE';
  observation: string;
  decision: string;
  reason: string;
}

export interface RandomizedSetStep {
  operation: 'INSERT' | 'REMOVE' | 'GET_RANDOM';
  val: number;
  numsArray: number[];
  mapSnapshot: Record<number, number>; // val -> index
  swappedDetails?: {
    removedVal: number;
    removedIdx: number;
    lastVal: number;
    lastIdx: number;
  };
  randomResult?: number;
  action: 'INIT' | 'DO_INSERT' | 'DO_REMOVE_SWAP' | 'DO_RANDOM' | 'DONE';
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

export const Lesson01_MapHash: React.FC<LessonProps> = ({
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
  // STATE MÔ HÌNH 1: HASH COLLISION & ANTI-HASH EXPLANATION
  // ==========================================
  const [hashScenario, setHashScenario] = useState<'UNIFORM' | 'ANTI_HASH'>('ANTI_HASH');
  const [collisionIndex, setCollisionIndex] = useState<number>(0);
  const [collisionPlaying, setCollisionPlaying] = useState<boolean>(false);
  const [collisionSpeed, setCollisionSpeed] = useState<number>(800);
  const collisionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const numBuckets = 7;

  const collisionSteps = useMemo<HashCollisionStep[]>(() => {
    const steps: HashCollisionStep[] = [];
    const b: number[][] = Array.from({ length: numBuckets }, () => []);

    if (hashScenario === 'ANTI_HASH') {
      // Keys crafted to collide at bucket 0: h(x) = x % 7 == 0
      const evilKeys = [7, 14, 21, 28, 35, 42];

      steps.push({
        scenario: 'ANTI_HASH',
        insertedKey: 0,
        bucketIndex: -1,
        buckets: b.map((arr) => [...arr]),
        action: 'INIT',
        observation: `Mô phỏng Anti-Hash Test trên Codeforces với bảng gồm ${numBuckets} buckets. Hàm băm mặc định: h(x) = x % 7.`,
        decision: `Đối thủ khai thác lỗ hổng bằng cách nạp toàn bộ các số là bội số của 7: [7, 14, 21, 28, 35, 42].`,
        reason: `Mọi số đều có cùng số dư 0 khi chia cho 7 -> Dồn 100% vào Bucket 0!`,
      });

      for (const k of evilKeys) {
        const bucket = k % numBuckets;
        b[bucket].push(k);
        steps.push({
          scenario: 'ANTI_HASH',
          insertedKey: k,
          bucketIndex: bucket,
          buckets: b.map((arr) => [...arr]),
          action: 'COLLISION',
          observation: `Nạp key = ${k}. Hàm băm h(${k}) = ${k} % ${numBuckets} = ${bucket}. Bucket ${bucket} đã có ${b[bucket].length - 1} phần tử trước đó!`,
          decision: `Xảy ra va chạm (Collision). Thêm ${k} vào cuối danh sách liên kết tại Bucket ${bucket}.`,
          reason: `Độ dài chuỗi liên kết tại Bucket 0 tăng lên ${b[bucket].length}. Tra cứu một key bất kỳ phải duyệt qua toàn bộ chuỗi này -> mất O(N)!`,
        });
      }

      steps.push({
        scenario: 'ANTI_HASH',
        insertedKey: 42,
        bucketIndex: 0,
        buckets: b.map((arr) => [...arr]),
        action: 'LOOKUP_SLOW',
        observation: `Thực hiện truy vấn tìm kiếm key = 42.`,
        decision: `Bảng băm phải duyệt qua 7 -> 14 -> 21 -> 28 -> 35 -> 42 (tốn 6 phép so sánh thay vì 1 phép tính O(1))!`,
        reason: `Với N = 10⁵ phần tử, tổng thời gian bị thoái hóa thành O(N²) ≈ 5 × 10⁹ phép tính -> Time Limit Exceeded (TLE) chắc chắn!`,
      });
    } else {
      // Uniform random distribution with Custom Hash
      const goodKeys = [12, 25, 9, 31, 18, 44];
      steps.push({
        scenario: 'UNIFORM',
        insertedKey: 0,
        bucketIndex: -1,
        buckets: b.map((arr) => [...arr]),
        action: 'INIT',
        observation: `Sử dụng Custom Hash (splitmix64 + random seed theo thời gian). Các khóa được xáo trộn bit hoàn hảo.`,
        decision: `Nạp các số [12, 25, 9, 31, 18, 44] vào bảng ${numBuckets} buckets.`,
        reason: `Hacker không thể đoán trước seed ngẫu nhiên sinh ra lúc chạy chương trình.`,
      });

      for (const k of goodKeys) {
        // pseudo hash distribution
        const bucket = (k * 3 + 1) % numBuckets;
        b[bucket].push(k);
        steps.push({
          scenario: 'UNIFORM',
          insertedKey: k,
          bucketIndex: bucket,
          buckets: b.map((arr) => [...arr]),
          action: 'INSERT',
          observation: `Nạp key = ${k}. Băm ngẫu nhiên ánh xạ vào Bucket ${bucket}.`,
          decision: `Chèn ${k} vào Bucket ${bucket}.`,
          reason: `Các phần tử phân tán đều trên mọi buckets, mỗi bucket chỉ chứa tối đa 1-2 phần tử -> Tra cứu đạt O(1) hoàn hảo!`,
        });
      }

      steps.push({
        scenario: 'UNIFORM',
        insertedKey: 44,
        bucketIndex: (44 * 3 + 1) % numBuckets,
        buckets: b.map((arr) => [...arr]),
        action: 'DONE',
        observation: `Bảng băm cân bằng lý tưởng. Chiều dài danh sách liên kết tại mọi bucket đều xấp xỉ O(1).`,
        decision: `Thời gian trung bình luôn được bảo vệ ở ngưỡng O(1), miễn nhiễm 100% với hack test!`,
        reason: `Đây là lý do mọi Competitive Programmer bắt buộc dùng Custom Hash cho unordered_map trên Codeforces.`,
      });
    }

    return steps;
  }, [hashScenario]);

  useEffect(() => {
    setCollisionIndex(0);
    setCollisionPlaying(false);
  }, [hashScenario]);

  useEffect(() => {
    if (collisionPlaying) {
      collisionTimerRef.current = setInterval(() => {
        setCollisionIndex((prev) => {
          if (prev >= collisionSteps.length - 1) {
            setCollisionPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, collisionSpeed);
    } else if (collisionTimerRef.current) {
      clearInterval(collisionTimerRef.current);
    }
    return () => {
      if (collisionTimerRef.current) clearInterval(collisionTimerRef.current);
    };
  }, [collisionPlaying, collisionSteps.length, collisionSpeed]);

  // ==========================================
  // STATE MÔ HÌNH 2: INSERT DELETE GETRANDOM O(1) (LEETCODE 380)
  // ==========================================
  const [randomSetIndex, setRandomSetIndex] = useState<number>(0);
  const [randomSetPlaying, setRandomSetPlaying] = useState<boolean>(false);
  const [randomSetSpeed, setRandomSetSpeed] = useState<number>(850);
  const randomSetTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const randomSetSteps = useMemo<RandomizedSetStep[]>(() => {
    const steps: RandomizedSetStep[] = [];
    const nums: number[] = [];
    const valMap: Record<number, number> = {};

    steps.push({
      operation: 'INSERT',
      val: 0,
      numsArray: [],
      mapSnapshot: {},
      action: 'INIT',
      observation: 'Khởi tạo cấu trúc LeetCode 380: Mảng động nums[] (cho phép truy xuất chỉ số O(1)) kết hợp Bảng băm map (val -> index).',
      decision: 'Sẵn sàng tiếp nhận các thao tác: insert(10), insert(20), insert(30), remove(10), getRandom().',
      reason: 'Nếu chỉ dùng Map thì không thể getRandom O(1). Nếu chỉ dùng Mảng thì xóa phần tử ở giữa mất O(N). Kết hợp cả hai để đạt O(1) mọi thao tác!',
    });

    // Operation 1: Insert 10
    nums.push(10);
    valMap[10] = nums.length - 1;
    steps.push({
      operation: 'INSERT',
      val: 10,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      action: 'DO_INSERT',
      observation: 'Thao tác insert(10): Thêm 10 vào cuối mảng nums -> nums[0] = 10.',
      decision: 'Lưu ánh xạ valMap[10] = 0.',
      reason: 'Cả thao tác push_back mảng và insert hash map đều tốn O(1).',
    });

    // Operation 2: Insert 20
    nums.push(20);
    valMap[20] = nums.length - 1;
    steps.push({
      operation: 'INSERT',
      val: 20,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      action: 'DO_INSERT',
      observation: 'Thao tác insert(20): Thêm 20 vào cuối mảng nums -> nums[1] = 20.',
      decision: 'Lưu ánh xạ valMap[20] = 1.',
      reason: 'Tiếp tục duy trì tính toàn vẹn của chỉ số.',
    });

    // Operation 3: Insert 30
    nums.push(30);
    valMap[30] = nums.length - 1;
    steps.push({
      operation: 'INSERT',
      val: 30,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      action: 'DO_INSERT',
      observation: 'Thao tác insert(30): Thêm 30 vào cuối mảng nums -> nums[2] = 30.',
      decision: 'Lưu ánh xạ valMap[30] = 2. Hiện mảng có 3 phần tử [10, 20, 30].',
      reason: 'Mọi phần tử đều có vị trí chính xác trong Map.',
    });

    // Operation 4: Remove 10 (THE SWAP TRICK)
    const removeVal = 10;
    const idxToRemove = valMap[removeVal];
    const lastElement = nums[nums.length - 1];
    const lastElementIdx = nums.length - 1;

    // Swap last element into removed index
    nums[idxToRemove] = lastElement;
    valMap[lastElement] = idxToRemove;
    nums.pop();
    delete valMap[removeVal];

    steps.push({
      operation: 'REMOVE',
      val: removeVal,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      swappedDetails: {
        removedVal: removeVal,
        removedIdx: idxToRemove,
        lastVal: lastElement,
        lastIdx: lastElementIdx,
      },
      action: 'DO_REMOVE_SWAP',
      observation: `KỸ THUẬT SWAP O(1): Muốn xóa giá trị ${removeVal} tại index ${idxToRemove}. Lấy phần tử cuối mảng là ${lastElement} đè vào index ${idxToRemove}!`,
      decision: `Cập nhật valMap[${lastElement}] = ${idxToRemove}, sau đó gọi nums.pop_back() và xóa ${removeVal} khỏi Map.`,
      reason: `Tránh được việc dời toàn bộ mảng O(N). Thao tác xóa đạt chuẩn O(1) hoàn hảo! Mảng sau khi xóa: [${nums.join(', ')}].`,
    });

    // Operation 5: GetRandom
    const randChoice = nums[1]; // Simulate picking index 1 (value 20)
    steps.push({
      operation: 'GET_RANDOM',
      val: randChoice,
      numsArray: [...nums],
      mapSnapshot: { ...valMap },
      randomResult: randChoice,
      action: 'DO_RANDOM',
      observation: `Thao tác getRandom(): Sinh chỉ số ngẫu nhiên r = rand() % nums.size() = 1.`,
      decision: `Trả về nums[1] = ${randChoice}. Mọi phần tử đều có xác suất xuất hiện đồng đều 1 / ${nums.length}.`,
      reason: `Mảng động hỗ trợ truy xuất ngẫu nhiên nums[r] trong O(1).`,
    });

    return steps;
  }, []);

  useEffect(() => {
    if (randomSetPlaying) {
      randomSetTimerRef.current = setInterval(() => {
        setRandomSetIndex((prev) => {
          if (prev >= randomSetSteps.length - 1) {
            setRandomSetPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, randomSetSpeed);
    } else if (randomSetTimerRef.current) {
      clearInterval(randomSetTimerRef.current);
    }
    return () => {
      if (randomSetTimerRef.current) clearInterval(randomSetTimerRef.current);
    };
  }, [randomSetPlaying, randomSetSteps.length, randomSetSpeed]);

  // ==========================================
  // CODE TABS IMPLEMENTATION
  // ==========================================
  const codeTabs: CodeTab[] = [
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

  // ==========================================
  // QUIZ QUESTIONS
  // ==========================================
  const quizQuestions: QuizQuestion[] = [
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

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const handleSelectAnswer = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  // ==========================================
  // PRACTICE PROBLEMS
  // ==========================================
  const practiceProblems: PracticeProblem[] = [
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

  const currCollision = collisionSteps[collisionIndex] || collisionSteps[0];
  const currRandomSet = randomSetSteps[randomSetIndex] || randomSetSteps[0];

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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.6 BST (Map & Custom Hash)</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • 1.6
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
          Bảng Băm (Hash Map), Cây Map & Kỹ Thuật Custom Hash
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          So sánh bản chất giữa <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">std::map</code> ($O(\log N)$) và <code className="font-mono text-teal-600 dark:text-teal-400 font-semibold">std::unordered_map</code> ($O(1)$ trung bình), vạch trần bẫy <strong>Anti-Hash Test trên Codeforces</strong> và trang bị vũ khí <strong>Custom Hash (splitmix64)</strong> miễn nhiễm hack TLE.
        </p>

        {/* Key topics chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
          {[
            'std::map vs unordered_map',
            'Anti-Hash Hack Codeforces',
            'splitmix64 Random Seed',
            'Insert Delete GetRandom O(1)',
            'Chaining vs Open Addressing',
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
          1. Bài Toán Mở Đầu: Thảm Họa Anti-Hash Test Trên Codeforces
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Hãy tưởng tượng bạn tham gia một contest Codeforces hoặc kỳ thi ICPC. Đề bài yêu cầu đếm tần số của $N = 10^5$ số nguyên. Bạn tự tin viết <code className="font-mono text-teal-600 font-bold">std::unordered_map&lt;long long, int&gt;</code> vì lý thuyết sách vở khẳng định bảng băm có độ phức tạp trung bình là <code className="font-mono text-teal-600 font-bold">O(1)</code> cho mỗi truy vấn, tổng thời gian $O(N)$.
        </p>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Sau khi nộp bài, bạn nhận kết quả <strong>Time Limit Exceeded (TLE)</strong> tức tưởi ở một test case ẩn của ban giám khảo, hoặc bài của bạn bị đối thủ trong phòng "Hack" thành công ở vòng Challenge! Chuyện gì đã xảy ra?
        </p>

        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-xs sm:text-sm text-rose-950 dark:text-rose-200 space-y-2">
          <strong className="text-rose-700 dark:text-rose-400 text-sm">
            Bí Mật Cơ Chế g++ STL Khiến Bạn Bị Hack:
          </strong>
          <p>
            1. Trong trình biên dịch GCC (g++), hàm băm mặc định cho số nguyên chỉ đơn giản là hàm đồng nhất: <code className="font-mono">std::hash&lt;int&gt;(x) = x</code>.
          </p>
          <p>
            2. Số lượng bucket của g++ được xác định bằng một danh sách các số nguyên tố cố định (ví dụ $P = 126271$).
          </p>
          <p>
            3. Đối thủ chỉ việc tạo ra một dãy $10^5$ số có dạng: $x_i = i \times P$. Khi đó, mọi số $x_i$ khi lấy modulo cho $P$ đều cho số dư bằng $0$!
          </p>
          <p className="font-mono font-bold text-rose-600 dark:text-rose-300">
            Hậu quả: Toàn bộ 10⁵ số bị nhồi nhét vào đúng 1 bucket duy nhất! Thao tác tra cứu thoái hóa từ O(1) thành O(N). Tổng thời gian: O(N²) ≈ 5 × 10⁹ phép tính → TLE!
          </p>
        </div>
      </section>

      {/* 3. Ý TƯỞNG CỐT LÕI */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section font-bold text-slate-900 dark:text-white">
          2. Ý Tưởng Cốt Lõi: Vũ Khí Custom Hash (splitmix64)
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] text-slate-700 dark:text-slate-300">
          Để miễn nhiễm hoàn toàn với Anti-Hash, hàm băm của chúng ta phải thỏa mãn 2 điều kiện:
        </p>

        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li>
            <strong>Số ngẫu nhiên bí mật lúc chạy (Runtime Random Seed):</strong> Lấy timestamp từ đồng hồ phân giải cao <code className="font-mono text-teal-600">chrono::steady_clock::now()</code> cộng vào khóa. Mỗi lần chạy contest là một seed khác nhau, hacker không thể đoán trước.
          </li>
          <li>
            <strong>Thuật toán xáo trộn bit (Bit Mixer):</strong> Thuật toán <code className="font-mono text-teal-600 font-bold">splitmix64</code> đảo và nhân bit để một sự thay đổi nhỏ của key tạo ra giá trị băm hoàn toàn ngẫu nhiên và phân tán đều trên mọi bucket.
          </li>
        </ul>

        <div className="p-4 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">
            Quy Tắc Sống Còn Của Huấn Luyện Viên:
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            <strong>"Trên Codeforces và các kỳ thi CP, KHÔNG BAO GIỜ dùng unordered_map mặc định với khóa số nguyên. Luôn bọc bằng template custom_hash hoặc dùng std::map nếu N ≤ 2·10⁵."</strong>
          </p>
        </div>
      </section>

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 1: HASH COLLISION & ANTI-HASH */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          3. Mô Phỏng Tương Tác: Thảm Họa Va Chạm (Anti-Hash vs Custom Hash)
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          So sánh trực quan giữa việc bị dồn 100% va chạm vào một bucket đơn lẻ và sự phân tán hoàn hảo của Custom Hash:
        </p>

        {/* Scenario Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-500 font-medium">Chọn kịch bản:</span>
          <button
            type="button"
            onClick={() => setHashScenario('ANTI_HASH')}
            className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition cursor-pointer ${
              hashScenario === 'ANTI_HASH'
                ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
            }`}
          >
            Bị Tấn Công Anti-Hash (h(x) = x % 7)
          </button>
          <button
            type="button"
            onClick={() => setHashScenario('UNIFORM')}
            className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition cursor-pointer ${
              hashScenario === 'UNIFORM'
                ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            Custom Hash An Toàn (splitmix64)
          </button>
        </div>

        {/* Visualizer Card */}
        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bảng Băm Gồm 7 Buckets
            </span>
            <Badge
              variant={currCollision.scenario === 'ANTI_HASH' ? 'hard' : 'teal'}
              size="xs"
            >
              {currCollision.scenario === 'ANTI_HASH' ? 'Nguy cơ TLE' : 'Tối ưu O(1)'}
            </Badge>
          </div>

          {/* Buckets display */}
          <div className="space-y-2 py-2">
            {currCollision.buckets.map((bucketItems, bIdx) => {
              const isTargetBucket = bIdx === currCollision.bucketIndex;
              return (
                <div
                  key={bIdx}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                    isTargetBucket
                      ? currCollision.scenario === 'ANTI_HASH'
                        ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-400'
                        : 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-400'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="w-20 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                    Bucket [{bIdx}]:
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] flex-1">
                    {bucketItems.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">Rỗng</span>
                    ) : (
                      bucketItems.map((val, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded font-mono text-xs font-bold flex items-center gap-1 shadow-2xs ${
                            val === currCollision.insertedKey
                              ? currCollision.scenario === 'ANTI_HASH'
                                ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                                : 'bg-teal-600 text-white ring-2 ring-teal-300'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {val}
                          {idx < bucketItems.length - 1 && <span className="text-slate-400 font-normal">→</span>}
                        </span>
                      ))
                    )}
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
              <span className="text-slate-800 dark:text-slate-200">{currCollision.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600 dark:text-teal-400">Quyết định: </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{currCollision.decision}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Hậu quả CP: </span>
              <span className="text-slate-600 dark:text-slate-400">{currCollision.reason}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCollisionIndex(0)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={collisionIndex === 0}
                onClick={() => setCollisionIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCollisionPlaying(!collisionPlaying)}
              >
                {collisionPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {collisionPlaying ? 'Dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={collisionIndex >= collisionSteps.length - 1}
                onClick={() => setCollisionIndex((p) => Math.min(collisionSteps.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">
                Bước {collisionIndex + 1}/{collisionSteps.length}
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                {[
                  { label: '0.5x', speed: 1200 },
                  { label: '1x', speed: 800 },
                  { label: '2x', speed: 400 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setCollisionSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      collisionSpeed === s.speed
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

      {/* 4. MÔ PHỎNG TƯƠNG TÁC 2: INSERT DELETE GETRANDOM O(1) */}
      <section className="mb-12">
        <h2 className="heading-section text-slate-900 dark:text-white">
          4. Mô Phỏng Thiết Kế: Insert Delete GetRandom O(1) (LeetCode 380)
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Xem kỹ xảo hoán đổi phần tử cuối mảng để đạt thao tác xóa ở giữa mảng trong $O(1)$ thay vì $O(N)$:
        </p>

        <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
          {/* Array visualization */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Mảng Động nums[] (Lưu giá trị để lấy ngẫu nhiên O(1))
            </div>
            <div className="flex flex-wrap gap-2">
              {currRandomSet.numsArray.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Mảng đang rỗng</span>
              ) : (
                currRandomSet.numsArray.map((v, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-14 rounded-lg bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 flex flex-col items-center justify-center font-mono"
                  >
                    <span className="text-sm font-bold text-teal-800 dark:text-teal-200">{v}</span>
                    <span className="text-[10px] text-slate-400">idx: {idx}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hash map snapshot */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 mb-3">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Bảng Băm valToIdx (val → index)
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {Object.keys(currRandomSet.mapSnapshot).length === 0 ? (
                <span className="text-xs text-slate-400 italic">Map rỗng</span>
              ) : (
                Object.entries(currRandomSet.mapSnapshot).map(([k, idx]) => (
                  <span
                    key={k}
                    className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  >
                    <strong>{k}</strong> → {idx}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Explanation */}
          <div
            aria-live="polite"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1 mb-3"
          >
            <div>
              <span className="font-semibold text-slate-500">Quan sát: </span>
              <span className="text-slate-800 dark:text-slate-200">{currRandomSet.observation}</span>
            </div>
            <div>
              <span className="font-semibold text-teal-600">Hành động: </span>
              <span className="text-slate-800 dark:text-slate-200">{currRandomSet.decision}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Bản chất CP: </span>
              <span className="text-slate-600 dark:text-slate-400">{currRandomSet.reason}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRandomSetIndex(0)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={randomSetIndex === 0}
                onClick={() => setRandomSetIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setRandomSetPlaying(!randomSetPlaying)}
              >
                {randomSetPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {randomSetPlaying ? 'Dừng' : 'Chạy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={randomSetIndex >= randomSetSteps.length - 1}
                onClick={() => setRandomSetIndex((p) => Math.min(randomSetSteps.length - 1, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">
                Bước {randomSetIndex + 1}/{randomSetSteps.length}
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
                    onClick={() => setRandomSetSpeed(s.speed)}
                    className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
                      randomSetSpeed === s.speed
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

      {/* 5. KHI NÀO DÙNG MAP / UNORDERED_MAP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          5. Bảng So Sánh Chiến Lược: std::map vs std::unordered_map
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="p-3">Tiêu chí</th>
                <th className="p-3">std::map (Cây Đỏ-Đen)</th>
                <th className="p-3">std::unordered_map (Bảng Băm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans font-semibold">Thời gian trung bình</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">O(log N)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400">O(1)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Thời gian xấu nhất (Worst Case)</td>
                <td className="p-3 text-teal-600 dark:text-teal-400">O(log N) (Đảm bảo 100%)</td>
                <td className="p-3 text-rose-600 dark:text-rose-400">O(N) (Dễ bị hack TLE nếu không custom hash)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Thứ tự các Key</td>
                <td className="p-3 font-sans">Luôn sắp xếp tăng dần</td>
                <td className="p-3 font-sans">Không xác định</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">lower_bound / upper_bound</td>
                <td className="p-3 text-teal-600 font-bold">Hỗ trợ đầy đủ O(log N)</td>
                <td className="p-3 text-rose-600 font-bold">KHÔNG hỗ trợ</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Khi nào nên dùng trong Contest</td>
                <td className="p-3 font-sans text-xs">Cần duyệt theo thứ tự hoặc N ≤ 2·10⁵ an toàn tuyệt đối</td>
                <td className="p-3 font-sans text-xs">Cần tốc độ tối đa O(1) và đã trang bị custom_hash</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. TÍNH ĐÚNG ĐẮN */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          6. Chứng Minh Tính Đúng Đắn Của Kỹ Thuật Swap Xóa O(1)
        </h2>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>1. Bất biến:</strong> Tại mọi thời điểm, mảng `nums` chứa đúng tập hợp các phần tử hiện có không có lỗ hổng rỗng (dense array), và `val_to_idx[x]` luôn lưu chính xác chỉ số thực tế của $x$ trong `nums`.
          </p>
          <p>
            <strong>2. Duy trì:</strong> Khi xóa $x$ tại vị trí $i$: Thay vì dời tất cả phần tử sau $i$ về trước (tốn $O(N)$), ta đưa phần tử cuối cùng $last = nums.back()$ vào vị trí $i$. Cập nhật $val\_to\_idx[last] = i$. Sau đó gọi $nums.pop\_back()$. Tập hợp các phần tử sau khi xóa vẫn đầy đủ và trọn vẹn, không thứ tự nào bị vi phạm vì bài toán không yêu cầu thứ tự.
          </p>
          <p>
            <strong>3. GetRandom:</strong> Vì các phần tử nằm liên tục từ $0$ đến $size - 1$, việc lấy ngẫu nhiên $rand() \% size$ đảm bảo xác suất chọn mỗi phần tử là chính xác $1 / size$.
          </p>
        </div>
      </section>

      {/* 7. CÀI ĐẶT MẪU */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          7. Cài Đặt Mẫu (C++20, Python 3, TypeScript)
        </h2>

        <CodeViewer tabs={codeTabs} />
      </section>

      {/* 8. BẪY VÀ LỖI THƯỜNG GẶP */}
      <section className="mb-10 space-y-3.5">
        <h2 className="heading-section text-slate-900 dark:text-white">
          8. Bẫy CP & Lỗi Thường Gặp
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 1: Dùng toán tử my_map[x] để kiểm tra tồn tại.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Tốn bộ nhớ không cần thiết (MLE) hoặc sai logic.
              <br />
              <em>Cách sửa:</em> Dùng <code className="font-mono text-teal-600">if (my_map.count(x))</code> hoặc <code className="font-mono">if (my_map.find(x) != my_map.end())</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs sm:text-sm">
            <strong className="text-rose-700 dark:text-rose-400">Bẫy 2: Chi phí Rehash làm chậm đột ngột.</strong>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              <em>Triệu chứng:</em> Quá nhiều thao tác insert liên tục kích hoạt việc cấp phát lại mảng bucket và băm lại toàn bộ phần tử.
              <br />
              <em>Cách sửa:</em> Nếu biết trước mảng có $N$ phần tử, hãy gọi <code className="font-mono text-teal-600">my_map.reserve(N)</code> ngay từ đầu.
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
              Phân loại theo chuẩn PLANNING.md với gợi ý 3 tầng.
            </p>
          </div>

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
              className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
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

        {/* List */}
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
            Bài tiếp theo: 1.7 Bitset (std::bitset)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Nén 64 giá trị boolean vào một từ máy 64-bit và tăng tốc độ tính toán gấp 64 lần.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.7')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Học Bài 1.7
        </Button>
      </div>

    </article>
  );
};

export default Lesson01_MapHash;
