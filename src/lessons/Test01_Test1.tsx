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
  ShieldCheck
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

export const Test01_Test1: React.FC<TestProps> = ({
  onSelectSubtopic,
  completedTheories = {},
}) => {
  // Điều kiện mở: Đã học lý thuyết 1.1, 1.2, 1.3
  const isPrerequisiteMet = !!completedTheories['1.1'] && !!completedTheories['1.2'] && !!completedTheories['1.3'];

  // Timer states (90 minutes = 5400 seconds)
  const TOTAL_SECONDS = 90 * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SECONDS);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [pauseCount, setPauseCount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Problem submission statuses: 'TODO' | 'AC' | 'WA' | 'TLE'
  const [statuses, setStatuses] = useState<Record<string, 'TODO' | 'AC' | 'WA' | 'TLE'>>({
    'm1_485': 'TODO',
    'm1_150': 'TODO',
    'm1_622': 'TODO',
    'm1_84': 'TODO',
  });

  // WA / TLE count for penalty (each adds 5 minutes)
  const [penaltyAttempts, setPenaltyAttempts] = useState<Record<string, number>>({
    'm1_485': 0,
    'm1_150': 0,
    'm1_622': 0,
    'm1_84': 0,
  });

  // Active solution tab to review
  const [activeSolutionProblemId, setActiveSolutionProblemId] = useState<string>('m1_485');

  const problems: TestProblem[] = [
    {
      id: 'm1_485',
      order: 'Q1',
      difficulty: 'Easy',
      points: 3,
      timeTargetMinutes: 5,
      title: '485. Max Consecutive Ones',
      url: 'https://leetcode.com/problems/max-consecutive-ones/',
      pattern: 'Vector Cache Locality',
      trapWarning: 'Dãy kết thúc bằng chuỗi 1 mà không có số 0 ở cuối -> Phải cập nhật max_cnt lần cuối cùng sau vòng lặp!',
      cppSolution: `// LeetCode 485 - Max Consecutive Ones
// Time: O(N) | Space: O(1)
#include <vector>
#include <algorithm>

class Solution {
public:
    int findMaxConsecutiveOnes(const std::vector<int>& nums) {
        int max_len = 0;
        int cur_len = 0;
        for (int x : nums) {
            if (x == 1) {
                cur_len++;
                max_len = std::max(max_len, cur_len);
            } else {
                cur_len = 0;
            }
        }
        return max_len;
    }
};`,
      pythonSolution: `# LeetCode 485 - Max Consecutive Ones
# Time: O(N) | Space: O(1)
class Solution:
    def findMaxConsecutiveOnes(self, nums: list[int]) -> int:
        max_len = cur_len = 0
        for x in nums:
            if x == 1:
                cur_len += 1
                if cur_len > max_len:
                    max_len = cur_len
            else:
                cur_len = 0
        return max_len`,
    },
    {
      id: 'm1_150',
      order: 'Q2',
      difficulty: 'Medium',
      points: 4,
      timeTargetMinutes: 15,
      title: '150. Evaluate Reverse Polish Notation',
      url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
      pattern: 'Stack Postfix Evaluation',
      trapWarning: 'Thứ tự phép trừ và chia: Số lấy ra đầu tiên là toán hạng thứ hai (b), số lấy ra tiếp theo là toán hạng thứ nhất (a) -> Kết quả là a - b hoặc a / b!',
      cppSolution: `// LeetCode 150 - Evaluate Reverse Polish Notation
// Time: O(N) | Space: O(N)
#include <vector>
#include <string>
#include <stack>

class Solution {
public:
    int evalRPN(const std::vector<std::string>& tokens) {
        std::stack<long long> st;
        for (const std::string& s : tokens) {
            if (s == "+" || s == "-" || s == "*" || s == "/") {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                if (s == "+") st.push(a + b);
                else if (s == "-") st.push(a - b);
                else if (s == "*") st.push(a * b);
                else if (s == "/") st.push(a / b);
            } else {
                st.push(std::stoll(s));
            }
        }
        return static_cast<int>(st.top());
    }
};`,
      pythonSolution: `# LeetCode 150 - Evaluate Reverse Polish Notation
# Time: O(N) | Space: O(N)
class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []
        for token in tokens:
            if token in "+-*/":
                b = stack.pop()
                a = stack.pop()
                if token == "+": stack.append(a + b)
                elif token == "-": stack.append(a - b)
                elif token == "*": stack.append(a * b)
                elif token == "/": stack.append(int(a / b))  # truncate toward zero
            else:
                stack.append(int(token))
        return stack[0]`,
    },
    {
      id: 'm1_622',
      order: 'Q3',
      difficulty: 'Medium',
      points: 5,
      timeTargetMinutes: 20,
      title: '622. Design Circular Queue',
      url: 'https://leetcode.com/problems/design-circular-queue/',
      pattern: 'Ring Buffer Array',
      trapWarning: 'Bẫy tính chỉ số Rear: tail là vị trí chuẩn bị chèn số kế tiếp, nên phần tử cuối cùng hiện tại nằm ở (tail - 1 + capacity) % capacity!',
      cppSolution: `// LeetCode 622 - Design Circular Queue
// Time: O(1) for all ops | Space: O(K)
#include <vector>

class MyCircularQueue {
private:
    std::vector<int> buf;
    int head;
    int tail;
    int count;
    int cap;

public:
    MyCircularQueue(int k) : buf(k), head(0), tail(0), count(0), cap(k) {}

    bool enQueue(int value) {
        if (isFull()) return false;
        buf[tail] = value;
        tail = (tail + 1) % cap;
        count++;
        return true;
    }

    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        count--;
        return true;
    }

    int Front() {
        return isEmpty() ? -1 : buf[head];
    }

    int Rear() {
        return isEmpty() ? -1 : buf[(tail - 1 + cap) % cap];
    }

    bool isEmpty() {
        return count == 0;
    }

    bool isFull() {
        return count == cap;
    }
};`,
      pythonSolution: `# LeetCode 622 - Design Circular Queue
# Time: O(1) all ops | Space: O(K)
class MyCircularQueue:
    def __init__(self, k: int):
        self.buf = [0] * k
        self.head = 0
        self.tail = 0
        self.count = 0
        self.cap = k

    def enQueue(self, value: int) -> bool:
        if self.isFull(): return False
        self.buf[self.tail] = value
        self.tail = (self.tail + 1) % self.cap
        self.count += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty(): return False
        self.head = (self.head + 1) % self.cap
        self.count -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.buf[self.head]

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.buf[(self.tail - 1) % self.cap]

    def isEmpty(self) -> bool:
        return self.count == 0

    def isFull() -> bool:
        return self.count == self.cap`,
    },
    {
      id: 'm1_84',
      order: 'Q4',
      difficulty: 'Hard',
      points: 6,
      timeTargetMinutes: 45,
      title: '84. Largest Rectangle in Histogram',
      url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
      pattern: 'Monotonic Stack',
      trapWarning: 'Khi duyệt xong toàn bộ mảng, vẫn còn các phần tử nằm trong stack chưa được pop -> Thêm lính canh (sentinel) 0 vào cuối mảng để vét sạch stack!',
      cppSolution: `// LeetCode 84 - Largest Rectangle in Histogram
// Time: O(N) | Space: O(N)
#include <vector>
#include <stack>
#include <algorithm>

class Solution {
public:
    int largestRectangleArea(std::vector<int>& heights) {
        // Add dummy 0 height sentinel at the end
        heights.push_back(0);
        int n = static_cast<int>(heights.size());
        std::stack<int> st; // Monotonic increasing stack of indices
        int max_area = 0;

        for (int i = 0; i < n; ++i) {
            while (!st.empty() && heights[st.top()] > heights[i]) {
                int h = heights[st.top()];
                st.pop();
                int w = st.empty() ? i : (i - st.top() - 1);
                max_area = std::max(max_area, h * w);
            }
            st.push(i);
        }

        heights.pop_back(); // Restore original
        return max_area;
    }
};`,
      pythonSolution: `# LeetCode 84 - Largest Rectangle in Histogram
# Time: O(N) | Space: O(N)
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        heights.append(0)  # Sentinel
        stack = []
        max_area = 0

        for i, h in enumerate(heights):
            while stack and heights[stack[-1]] > h:
                cur_h = heights[stack.pop()]
                w = i if not stack else (i - stack[-1] - 1)
                max_area = max(max_area, cur_h * w)
            stack.append(i)

        heights.pop()
        return max_area`,
    },
  ];

  // Timer loop
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
      'm1_485': 'TODO',
      'm1_150': 'TODO',
      'm1_622': 'TODO',
      'm1_84': 'TODO',
    });
    setPenaltyAttempts({
      'm1_485': 0,
      'm1_150': 0,
      'm1_622': 0,
      'm1_84': 0,
    });
  };

  const setStatus = (pId: string, st: 'TODO' | 'AC' | 'WA' | 'TLE') => {
    setStatuses((prev) => ({ ...prev, [pId]: st }));
    if (st === 'WA' || st === 'TLE') {
      setPenaltyAttempts((prev) => ({ ...prev, [pId]: (prev[pId] || 0) + 1 }));
    }
  };

  // Scores calculation
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
        <span className="text-teal-600 dark:text-teal-400 font-semibold">1.8 Bài Test 1</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng 1 • Bài Test 1
            </Badge>
            <Badge variant="medium" size="sm">
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
                <AlertTriangle className="w-3.5 h-3.5" /> Cần hoàn thành 1.1-1.3
              </Badge>
            )}
          </div>
        </div>

        <h1 className="heading-hero font-bold text-slate-900 dark:text-white tracking-tight">
          Bài Test 1 — Vector, Sorting, Stack, Queue & Deque
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Đề thi kiểm tra phản xạ định kỳ 90 phút mô phỏng LeetCode Contest: 4 câu phân tầng độ khó
          (Easy $\to$ Medium 1 $\to$ Medium 2 $\to$ Hard), thang điểm tối đa 18 điểm kèm hệ thống tính phút phạt (+5 phút cho mỗi lần nộp WA/TLE).
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
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
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

      {/* 3. BẢNG TỔNG KẾT SAU THI (NẾU ĐÃ NỘP) */}
      {isSubmitted && (
        <Card className="mb-6 border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-teal-900 dark:text-teal-200">
              Kết Quả Bài Test 1 Của Bạn
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
              <strong className="text-emerald-600">Đẳng cấp xuất sắc! Bạn đã vượt qua 100% đề thi trong thời gian cho phép.</strong>
            ) : totalEarnedPoints >= 12 ? (
              <strong className="text-teal-600">Rất tốt! Bạn đã nắm chắc nền tảng Vector, Stack và Queue. Hãy upsolving các câu còn lại.</strong>
            ) : (
              <strong className="text-amber-600">Cần ôn luyện thêm! Xem kỹ lời giải chi tiết và phân tích bẫy bên dưới để thi lại.</strong>
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

                {/* Status selector buttons */}
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

      {/* 5. PHÂN TÍCH BẪY & LỜI GIẢI MẪU (MỞ KHOÁ KHI SUBMIT HOẶC MUỐN XEM) */}
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

        {/* CodeViewer */}
        <CodeViewer tabs={solutionTabs} />
      </section>

      {/* 6. HƯỚNG DẪN UPSOLVING & TIẾP THEO */}
      <div className="mt-14 p-6 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Bài tiếp theo: 1.9 Bài Test 2 (Heap, BST, Map & Bitset)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Đề kiểm tra định kỳ 90 phút thứ hai về các cấu trúc cây, bảng băm và nén bit.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onSelectSubtopic?.('1.9')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sang Bài Test 2
        </Button>
      </div>

    </article>
  );
};

export default Test01_Test1;
