import React from 'react';
import type { MonthModule } from '../data/roadmapData';
import { ChevronDown, CheckCircle2, Check, Home } from 'lucide-react';

export interface SidebarProps {
  modules: MonthModule[];
  selectedSubtopicId: string;
  onSelectSubtopic: (subtopicId: string) => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  expandedMonths: Record<number, boolean>;
  onToggleMonth: (monthId: number) => void;
  completedTheories: Record<string, boolean>;
  completedProblems: Record<string, boolean>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  selectedSubtopicId,
  onSelectSubtopic,
  sidebarOpen,
  onCloseSidebar,
  expandedMonths,
  onToggleMonth,
  completedTheories,
  completedProblems,
}) => {
  // Compute progress stats
  const totalTheoriesCount = modules.reduce((acc, m) => acc + m.subtopics.length, 0);
  const solvedTheoriesCount = Object.values(completedTheories).filter(Boolean).length;
  const solvedProblemsCount = Object.values(completedProblems).filter(Boolean).length;
  const estimatedTotalProblems = 450;
  const overallPercentage = Math.round(
    ((solvedProblemsCount + solvedTheoriesCount) / (estimatedTotalProblems + totalTheoriesCount)) * 100
  );

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-76 bg-white dark:bg-[#0c1017] border-r border-slate-200 dark:border-slate-800 pt-16 lg:pt-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] transition-transform duration-200 ease-in-out shrink-0
          ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col p-4 overflow-hidden">

          <div className="pb-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
            {/* Prominent Progress Bar Card */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tiến độ Lộ trình
                </span>
                <span className="font-mono text-sm font-extrabold text-teal-600 dark:text-teal-400">
                  {overallPercentage}%
                </span>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(overallPercentage, 2)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
                <span>{solvedProblemsCount} AC / {estimatedTotalProblems} bài</span>
                <span>{solvedTheoriesCount} / {totalTheoriesCount} lý thuyết</span>
              </div>
            </div>
          </div>

          {/* Subtopics Tree with its own internal scroll */}
          <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-1">
            {/* Home / Overview Landing button */}
            <button
              type="button"
              onClick={() => {
                onSelectSubtopic('home');
                onCloseSidebar();
              }}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-semibold transition cursor-pointer mb-1 ${
                selectedSubtopicId === 'home'
                  ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold border-l-2 border-teal-600 dark:border-teal-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Trang chủ Lộ trình</span>
            </button>

            {modules.map((m) => {
              const isExpanded = !!expandedMonths[m.id];
              const hasActiveSubtopic = m.subtopics.some((s) => s.id === selectedSubtopicId);
              const monthTheoriesDone = m.subtopics.filter((s) => completedTheories[s.id]).length;

              return (
                <div key={m.id} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => onToggleMonth(m.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-semibold transition cursor-pointer ${hasActiveSubtopic
                      ? 'bg-slate-100/90 dark:bg-slate-800/70 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-bold shrink-0">
                        {m.monthLabel}
                      </span>
                      <span className="truncate text-xs">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {monthTheoriesDone > 0 && (
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> {monthTheoriesDone}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Subtopics list with concise titles - Overview and Demo badges removed */}
                  {isExpanded && (
                    <div className="ml-3 my-1 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                      {m.subtopics.map((sub) => {
                        const isSelected = sub.id === selectedSubtopicId;
                        const isTheoryDone = !!completedTheories[sub.id];

                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onSelectSubtopic(sub.id);
                              onCloseSidebar();
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition flex items-center justify-between gap-1.5 cursor-pointer ${isSelected
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border-l-2 border-teal-600 dark:border-teal-400'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {isTheoryDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                              )}
                              <span className="truncate">{sub.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={onCloseSidebar}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-20 lg:hidden"
        ></div>
      )}
    </>
  );
};
