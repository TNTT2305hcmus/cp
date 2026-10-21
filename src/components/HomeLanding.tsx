import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from './Button';

interface HomeLandingProps {
  onStartLearning: () => void;
  completedProblemsCount: number;
  completedTheoriesCount: number;
}

export const HomeLanding: React.FC<HomeLandingProps> = ({
  onStartLearning,
  completedProblemsCount,
  completedTheoriesCount,
}) => {
  // Dynamic slogan cycling
  const slogans = [
    "Biến tư duy giải thuật từ 'vừa hiểu' thành 'phản xạ tức thì'.",
    "Khóa cứng ngưỡng Big-O trước khi viết bất kỳ dòng code nào.",
    "Hành trình chinh phục LeetCode Guardian 2100+.",
    "Kỷ luật mỗi ngày: 1 bài lý thuyết, 1-2 bài rèn luyện."
  ];

  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center text-center px-4 py-12 sm:py-16">
      
      {/* 1. TOP DYNAMIC PILL */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 mb-6 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 tracking-wide">
          Lộ Trình Cá Nhân Hóa • Target Guardian 2100+
        </span>
      </div>

      {/* 2. MAIN TITLE */}
      <h1 className="heading-hero text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Tenrai's CP Journey
      </h1>

      {/* 3. DYNAMIC CYCLING SLOGAN */}
      <div className="h-7 my-3 flex items-center justify-center">
        <p className="text-sm sm:text-base font-mono font-medium text-teal-600 dark:text-teal-400 transition-all duration-300">
          {slogans[sloganIndex]}
        </p>
      </div>

      {/* 4. HUMANIZED DESCRIPTION */}
      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-1 mb-8">
        Không chỉ là giải bài tập thông thường, đây là không gian rèn luyện phản xạ thi đấu: 
        từ đọc ràng buộc dữ liệu để chọn thuật toán, triệt tiêu nhánh thừa bằng Two Pointers & Binary Search, 
        cho tới làm chủ Quy hoạch động và Lý thuyết Đồ thị.
      </p>

      {/* 5. ACTION BUTTONS - ONLY START LEARNING */}
      <div className="flex items-center justify-center mb-10">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartLearning}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-md shadow-teal-500/20 px-8 py-3 text-base"
        >
          Bắt đầu học ngay
        </Button>
      </div>

      {/* 6. METRIC HIGHLIGHTS CARDS - CLEAN TYPOGRAPHY PALETTE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
            Thời lượng
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">12 Tháng</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">2 Giai đoạn chính</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
            Kho bài tập
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">450+ Bài</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">LeetCode chọn lọc</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
            Đề kiểm tra
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">24 Test</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">90 phút bấm giờ</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
            Mục tiêu
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">2100+</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Guardian & Expert</div>
        </div>
      </div>

      {/* 7. CURRENT PROGRESS SNIPPET */}
      {(completedProblemsCount > 0 || completedTheoriesCount > 0) && (
        <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300">
            Tiến độ hiện tại của bạn:
          </span>
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
            {completedProblemsCount} bài tập AC • {completedTheoriesCount} bài lý thuyết
          </span>
        </div>
      )}

    </div>
  );
};
