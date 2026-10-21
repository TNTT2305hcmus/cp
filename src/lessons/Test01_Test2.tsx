import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button, Badge, Card, CodeViewer, type CodeTab } from '../components';

export interface TestProblem {
  id: string;
  order: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  timeTargetMinutes: number;
  title: string;
  url: string;
  pattern: string;
  trapWarning: string;
  cppSolution: string;
  pythonSolution: string;
}

interface TestProps {
  onSelectSubtopic?: (subtopicId: string) => void;
  completedTheories?: Record<string, boolean>;
}

export const Test01_Test2: React.FC<TestProps> = ({
  onSelectSubtopic,
  completedTheories = {},
}) => {
  // Điều kiện mở: Đã học lý thuyết 1.4, 1.5, 1.6, 1.7
  const isPrerequisiteMet =
    !!completedTheories['1.4'] &&
    !!completedTheories['1.5'] &&
    !!completedTheories['1.6'] &&
    !!completedTheories['1.7'];

  // Timer states (90 minutes = 5400 seconds)
  const TOTAL_SECONDS = 90 * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SECONDS);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [pauseCount, setPauseCount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Problem submission statuses
  const [statuses, setStatuses] = useState<Record<string, 'TODO' | 'AC' | 'WA' | 'TLE'>>({
    'm1_705': 'TODO',
    'm1_215': 'TODO',
    'm1_981': 'TODO',
    'm1_295': 'TODO',
  });

  const [penaltyAttempts, setPenaltyAttempts] = useState<Record<string, number>>({
    'm1_705': 0,
    'm1_215': 0,
    'm1_981': 0,
    'm1_295': 0,
  });

  const [activeSolutionProblemId, setActiveSolutionProblemId] = useState<string>('m1_705');

  const problems: TestProblem[] = [
    {
      id: 'm1_705',
      order: 'Q1',
      difficulty: 'Easy',
      points: 3,
      timeTargetMinutes: 5,
      title: '705. Design HashSet',
      url: 'https://leetcode.com/problems/design-hashset/',
      pattern: 'Hash Table Chaining / Collision Resolution',
      trapWarning: 'Chọn kích thước bucket là số nguyên tố (ví dụ 10007 hoặc 769) để phân tán hàm băm đồng đều, tránh dồn cục vào 1 bucket!',
      cppSolution: `// LeetCode 705 - Design HashSet
// Time: O(1) average | Space: O(N)
#include <vector>
#include <list>
#include <algorithm>

class MyHashSet {
private:
    static const int BUCKET_SIZE = 10007; // Prime number
    std::vector<std::list<int>> table;

    int hash(int key) const {
        return key % BUCKET_SIZE;
    }

public:
    MyHashSet() : table(BUCKET_SIZE) {}

    void add(int key) {
        int h = hash(key);
        auto& chain = table[h];
        if (std::find(chain.begin(), chain.end(), key) == chain.end()) {
            chain.push_back(key);
        }
    }

    void remove(int key) {
        int h = hash(key);
        auto& chain = table[h];
        auto it = std::find(chain.begin(), chain.end(), key);
        if (it != chain.end()) {
            chain.erase(it);
        }
    }

    bool contains(int key) const {
        int h = hash(key);
        const auto& chain = table[h];
        return std::find(chain.begin(), chain.end(), key) != chain.end();
    }
};`,
      pythonSolution: `# LeetCode 705 - Design HashSet
# Time: O(1) average | Space: O(N)
class MyHashSet:
    def __init__(self):
        self.size = 10007
        self.table = [[] for _ in range(self.size)]

    def _hash(self, key: int) -> int:
        return key % self.size

    def add(self, key: int) -> None:
        h = self._hash(key)
        if key not in self.table[h]:
            self.table[h].append(key)

    def remove(self, key: int) -> None:
        h = self._hash(key)
        if key in self.table[h]:
            self.table[h].remove(key)

    def contains(self, key: int) -> bool:
        h = self._hash(key)
        return key in self.table[h]`,
    },
    {
      id: 'm1_215',
      order: 'Q2',
      difficulty: 'Medium',
      points: 4,
      timeTargetMinutes: 15,
      title: '215. Kth Largest Element in an Array',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      pattern: 'Min-Heap Size K vs nth_element',
      trapWarning: 'Nếu dùng Heap, PHẢI DÙNG MIN-HEAP kích thước K để đạt O(N log K). Dùng Max-Heap sẽ tốn O(N log N) bộ nhớ và thời gian!',
      cppSolution: `// LeetCode 215 - Kth Largest Element in an Array
// Cách 1 (Heap): O(N log K) time, O(K) space
// Cách 2 (CP QuickSelect): O(N) average với std::nth_element
#include <vector>
#include <queue>
#include <algorithm>

class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        // Trong CP thi đấu: std::nth_element đạt O(N) trung bình
        std::nth_element(nums.begin(), nums.begin() + k - 1, nums.end(), std::greater<int>());
        return nums[k - 1];

        /* Cách dùng Min-Heap chuẩn:
        std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
        for (int x : nums) {
            min_pq.push(x);
            if (min_pq.size() > k) min_pq.pop();
        }
        return min_pq.top();
        */
    }
};`,
      pythonSolution: `# LeetCode 215 - Kth Largest Element in an Array
# Time: O(N log K) | Space: O(K)
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        min_heap = []
        for x in nums:
            heapq.heappush(min_heap, x)
            if len(min_heap) > k:
                heapq.heappop(min_heap)
        return min_heap[0]`,
    },
    {
      id: 'm1_981',
      order: 'Q3',
      difficulty: 'Medium',
      points: 5,
      timeTargetMinutes: 20,
      title: '981. Time Based Key-Value Store',
      url: 'https://leetcode.com/problems/time-based-key-value-store/',
      pattern: 'BST / Upper Bound trên Timestamp',
      trapWarning: 'Timestamp được nạp theo thứ tự tăng dần -> Dùng std::upper_bound tìm phần tử đầu tiên > timestamp, rồi lùi iterator (--it) để lấy giá trị gần nhất!',
      cppSolution: `// LeetCode 981 - Time Based Key-Value Store
// Time: O(log M) per get | Space: O(Total Entries)
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>

class TimeMap {
private:
    struct Entry {
        int timestamp;
        std::string value;
    };
    std::unordered_map<std::string, std::vector<Entry>> store;

public:
    TimeMap() {}

    void set(const std::string& key, const std::string& value, int timestamp) {
        store[key].push_back({timestamp, value});
    }

    std::string get(const std::string& key, int timestamp) {
        auto it = store.find(key);
        if (it == store.end()) return "";

        const auto& entries = it->second;
        // Binary search upper_bound for timestamp
        auto comp = [](int t, const Entry& e) {
            return t < e.timestamp;
        };
        auto bound = std::upper_bound(entries.begin(), entries.end(), timestamp, comp);

        if (bound == entries.begin()) {
            return ""; // No entry has timestamp <= query timestamp
        }

        return std::prev(bound)->value;
    }
};`,
      pythonSolution: `# LeetCode 981 - Time Based Key-Value Store
# Time: O(log M) per get | Space: O(Total Entries)
import bisect
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        entries = self.store[key]
        # Binary search for rightmost timestamp <= query
        idx = bisect.bisect_right(entries, timestamp, key=lambda x: x[0])
        if idx == 0:
            return ""
        return entries[idx - 1][1]`,
    },
    {
      id: 'm1_295',
      order: 'Q4',
      difficulty: 'Hard',
      points: 6,
      timeTargetMinutes: 45,
      title: '295. Find Median from Data Stream',
      url: 'https://leetcode.com/problems/find-median-from-data-stream/',
      pattern: 'Dual Heaps Balancing (Max-Heap & Min-Heap)',
      trapWarning: 'Quy ước bất biến: Max-Heap (lưu nửa nhỏ) luôn có số lượng phần tử bằng hoặc nhiều hơn Min-Heap (lưu nửa lớn) đúng 1 phần tử. Không để chênh lệch quá 1!',
      cppSolution: `// LeetCode 295 - Find Median from Data Stream
// Time: O(log N) addNum, O(1) findMedian | Space: O(N)
#include <queue>
#include <vector>

class MedianFinder {
private:
    std::priority_queue<int> max_heap; // Left half
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap; // Right half

public:
    MedianFinder() {}

    void addNum(int num) {
        // Step 1: Push to max_heap
        max_heap.push(num);

        // Step 2: Balance values (max of left <= min of right)
        min_heap.push(max_heap.top());
        max_heap.pop();

        // Step 3: Balance sizes (size(max_heap) >= size(min_heap))
        if (max_heap.size() < min_heap.size()) {
            max_heap.push(min_heap.top());
            min_heap.pop();
        }
    }

    double findMedian() {
        if (max_heap.size() > min_heap.size()) {
            return max_heap.top();
        }
        return (max_heap.top() + min_heap.top()) / 2.0;
    }
};`,
      pythonSolution: `# LeetCode 295 - Find Median from Data Stream
# Time: O(log N) addNum, O(1) findMedian | Space: O(N)
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # Max-heap (invert values)
        self.large = []  # Min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)

        # Ensure small elements <= large elements
        heapq.heappush(self.large, -heapq.heappop(self.small))

        # Balance sizes
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0`,
    },
  ];

  useEffect(() => {
    if (timerRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, secondsLeft]);

  const handleStart = () => {
    setTimerRunning(true);
  };

  const handlePause = () => {
    if (pauseCount < 1) {
      setTimerRunning(false);
      setPauseCount((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setTimerRunning(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setSecondsLeft(TOTAL_SECONDS);
    setPauseCount(0);
    setIsSubmitted(false);
    setStatuses({
      'm1_705': 'TODO',
      'm1_215': 'TODO',
      'm1_981': 'TODO',
      'm1_295': 'TODO',
    });
    setPenaltyAttempts({
      'm1_705': 0,
      'm1_215': 0,
      'm1_981': 0,
      'm1_295': 0,
    });
  };

  const setStatus = (pId: string, st: 'TODO' | 'AC' | 'WA' | 'TLE') => {
    setStatuses((prev) => ({ ...prev, [pId]: st }));
    if (st === 'WA' || st === 'TLE') {
      setPenaltyAttempts((prev) => ({ ...prev, [pId]: (prev[pId] || 0) + 1 }));
    }
  };

  const totalEarnedPoints = problems.reduce((acc, p) => {
    return acc + (statuses[p.id] === 'AC' ? p.points : 0);
  }, 0);

  const totalPenaltiesCount = Object.values(penaltyAttempts).reduce((a, b) => a + b, 0);
  const totalPenaltyMinutes = totalPenaltiesCount * 5;
  const elapsedMinutes = Math.floor((TOTAL_SECONDS - secondsLeft) / 60);
  const totalContestTimeWithPenalty = elapsedMinutes + totalPenaltyMinutes;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeProblem = problems.find((p) => p.id === activeSolutionProblemId) || problems[0];

  const solutionTabs: CodeTab[] = [
    {
      id: 'cpp',
      label: 'Solution.cpp',
      language: 'cpp',
      iconColor: '#00599c',
      rawCode: activeProblem.cppSolution,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{activeProblem.cppSolution}</pre>
        </div>
      ),
    },
    {
      id: 'python',
      label: 'solution.py',
      language: 'python',
      iconColor: '#3572a5',
      rawCode: activeProblem.pythonSolution,
      content: (
        <div className="font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
          <pre>{activeProblem.pythonSolution}</pre>
        </div>
      ),
    },
  ];

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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.9 Bài Test 2</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • Bài Test 2
            </Badge>
            <Badge variant="hard" size="sm">
              Contest 90 Phút
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {isPrerequisiteMet ? (
              <Badge variant="teal" size="sm" className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Đủ điều kiện thi
              </Badge>
            ) : (
              <Badge variant="hard" size="sm" className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Cần hoàn thành 1.4-1.7
              </Badge>
            )}
          </div>
        </div>

        <h1 className="heading-hero font-bold text-slate-900 dark:text-white tracking-tight">
          Bài Test 2 — Hash Set, Heap, BST / Map & Bitset
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Đề kiểm tra định kỳ 90 phút thứ hai đánh giá mức độ làm chủ các cấu trúc dữ liệu nâng cao
          (Heap, BST, Bảng băm và Nén bit). Thang điểm chuẩn 18 điểm LeetCode Contest kèm cơ chế phạt WA/TLE.
        </p>

        {/* TIMER BAR */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Thời gian còn lại:</div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-teal-400">
                {formatTime(secondsLeft)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!timerRunning && !isSubmitted && secondsLeft === TOTAL_SECONDS && (
              <Button
                variant="primary"
                size="md"
                onClick={handleStart}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Bắt Đầu Làm Bài
              </Button>
            )}

            {timerRunning && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePause}
                  disabled={pauseCount >= 1}
                  title={pauseCount >= 1 ? 'Chỉ được tạm dừng tối đa 1 lần' : 'Tạm dừng 1 lần'}
                  leftIcon={<Pause className="w-3.5 h-3.5" />}
                >
                  Tạm dừng ({1 - pauseCount})
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSubmit}
                  className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Nộp Bài Ngay
                </Button>
              </>
            )}

            {!timerRunning && secondsLeft < TOTAL_SECONDS && !isSubmitted && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStart}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Tiếp Tục Thi
              </Button>
            )}

            {isSubmitted && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Thi Lại Từ Đầu
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. BẢNG TỔNG KẾT SAU THI */}
      {isSubmitted && (
        <Card className="mb-6 border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-teal-900 dark:text-teal-200">
              Kết Quả Bài Test 2 Của Bạn
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[11px] text-slate-500">Điểm số</span>
              <div className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">
                {totalEarnedPoints} / 18
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[11px] text-slate-500">Số câu AC</span>
              <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">
                {Object.values(statuses).filter((s) => s === 'AC').length} / 4
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[11px] text-slate-500">Thời gian làm bài</span>
              <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">
                {elapsedMinutes}'
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[11px] text-slate-500">Thời gian có phạt (+5'/lần)</span>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {totalContestTimeWithPenalty}'
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {totalEarnedPoints === 18 ? (
              <strong className="text-emerald-600">Đỉnh cao! Bạn đã chinh phục hoàn hảo toàn bộ kiến thức cấu trúc dữ liệu Tháng 1. Sẵn sàng 100% bước sang Tháng 2!</strong>
            ) : totalEarnedPoints >= 12 ? (
              <strong className="text-teal-600">Làm rất tốt! Bạn đã đủ chuẩn đầu ra chuyển sang Tháng 2. Hãy hoàn tất upsolving câu Hard (LeetCode 295).</strong>
            ) : (
              <strong className="text-amber-600">Cần củng cố thêm phần Heap và Map. Xem lời giải chi tiết và thi lại để nắm chắc chuẩn đầu ra.</strong>
            )}
          </p>
        </Card>
      )}

      {/* 4. DANH SÁCH 4 BÀI TEST */}
      <section className="mb-10 space-y-4">
        <h2 className="heading-section text-slate-900 dark:text-white">
          Đề Bài Thi (Bấm link làm trực tiếp trên LeetCode)
        </h2>

        <div className="space-y-4">
          {problems.map((prob) => {
            const currentStatus = statuses[prob.id];
            const attempts = penaltyAttempts[prob.id] || 0;

            return (
              <Card key={prob.id} className="p-4 sm:p-5 border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {prob.order} ({prob.points}đ)
                    </span>
                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-teal-600 flex items-center gap-1.5"
                    >
                      {prob.title} <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={prob.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} size="xs">
                      {prob.difficulty}
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">
                      Mục tiêu: ≤ {prob.timeTargetMinutes}p
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-mono">
                  Mẫu CP: {prob.pattern}
                </div>

                {/* Status selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-500 mr-1">Kết quả nộp:</span>
                    <button
                      type="button"
                      onClick={() => setStatus(prob.id, 'AC')}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition ${
                        currentStatus === 'AC'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-emerald-600'
                      }`}
                    >
                      AC
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(prob.id, 'WA')}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition ${
                        currentStatus === 'WA'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-rose-600'
                      }`}
                    >
                      WA
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(prob.id, 'TLE')}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition ${
                        currentStatus === 'TLE'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-amber-600'
                      }`}
                    >
                      TLE
                    </button>
                  </div>

                  {attempts > 0 && (
                    <span className="text-xs text-rose-500 font-mono">
                      {attempts} lần nộp lỗi (+{attempts * 5} phút phạt)
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. PHÂN TÍCH BẪY & LỜI GIẢI MẪU */}
      <section className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-section text-slate-900 dark:text-white mb-0">
            Lời Giải Mẫu & Phân Tích Bẫy
          </h2>
          {!isSubmitted && (
            <span className="text-xs text-amber-600 font-medium">
              (Khuyên làm bài xong trước khi xem giải pháp)
            </span>
          )}
        </div>

        {/* Tab problem selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {problems.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveSolutionProblemId(p.id)}
              className={`px-3 py-1.5 text-xs rounded-md font-mono transition cursor-pointer ${
                activeSolutionProblemId === p.id
                  ? 'bg-white dark:bg-slate-900 text-teal-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {p.order}: {p.title.split('.')[0]}
            </button>
          ))}
        </div>

        {/* Trap Warning Alert */}
        <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <strong>Bẫy thường dính WA/TLE của {activeProblem.order}:</strong> {activeProblem.trapWarning}
        </div>

        <CodeViewer tabs={solutionTabs} />
      </section>

      {/* 6. HOÀN THÀNH THÁNG 1 -> CHUYỂN SANG THÁNG 2 */}
      <div className="mt-14 p-6 bg-linear-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200 dark:border-teal-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Chúc Mừng Bạn Đã Hoàn Thành Tháng 1!
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Nền tảng Cấu Trúc Dữ Liệu Cơ Bản đã vững vàng. Hãy bắt đầu chinh phục <strong>Tháng 2: Một Số Kỹ Thuật Căn Bản</strong> (Two Pointers, Sliding Window, Prefix Sum, Bitwise, Sàng nguyên tố &amp; Chặt nhị phân).
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('2.0')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sang Tháng 2: Tổng Quan
        </Button>
      </div>

    </article>
  );
};

export default Test01_Test2;
