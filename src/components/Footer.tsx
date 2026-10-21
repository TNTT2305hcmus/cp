import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1017] py-6 px-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}avatar.jpg`}
            alt="Tenrai"
            className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Tenrai's CP Journey
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span>Lộ trình Competitive Programming &amp; LeetCode</span>
        </div>
      </div>
    </footer>
  );
};
