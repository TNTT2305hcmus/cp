import React from 'react';
import { Sun, Moon, Search, Menu, X } from 'lucide-react';

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  sidebarOpen,
  onToggleSidebar,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo with Trí Thanh's Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onGoHome?.();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/avatar.jpg"
              alt="Tenrai"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="leading-tight">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Tenrai's CP Journey
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">Lộ trình Competitive Programming</p>
            </div>
          </a>
        </div>

        {/* Quick Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 w-56 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm chủ đề..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 w-full placeholder:text-slate-400"
            />
          </div>

          {/* Guardian Goal Badge - Clean Minimalist Style */}
          <div className="flex items-center px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <span>Mục tiêu: Guardian 2100+</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
            title={isDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* GitHub Source Reference */}
          <a
            href="https://github.com/TNTT2305hcmus"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer hidden sm:inline-flex"
            title="Tenrai's Github"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <a
            href="https://leetcode.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition"
          >
            LeetCode
          </a>
        </div>
      </div>
    </header>
  );
};
