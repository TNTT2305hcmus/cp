import React from 'react';

export const LessonLoadingFallback: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-4">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      </div>

      {/* Header Skeleton */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="h-8 sm:h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-20 bg-teal-100 dark:bg-teal-950/50 rounded-full"></div>
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>

      {/* Paragraphs Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>

      {/* Visualizer Skeleton */}
      <div className="h-72 w-full bg-slate-200 dark:bg-slate-850 rounded-2xl border border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center p-6 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
        <span className="text-xs font-mono text-slate-400">Đang tải học phần tương tác...</span>
      </div>

      {/* Code Viewer Skeleton */}
      <div className="h-48 w-full bg-slate-200 dark:bg-slate-850 rounded-xl border border-slate-300 dark:border-slate-800"></div>
    </div>
  );
};
