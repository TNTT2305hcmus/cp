import React, { useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Badge } from '../Badge';
import type { PracticeProblem } from '../../types/lesson';

export interface PracticeSectionProps {
  problems: PracticeProblem[];
  completedProblems?: Record<string, boolean>;
  onToggleProblem?: (problemId: string) => void;
  title?: string;
  sectionNumber?: string;
  subtitle?: string;
}

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  problems,
  completedProblems = {},
  onToggleProblem,
  title = 'Ngân Hàng Bài Tập LeetCode',
  sectionNumber = '10',
  subtitle = 'Phân loại theo tiêu chuẩn PLANNING.md với hệ thống gợi ý 3 tầng không spoil code.',
}) => {
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [expandedHintProblemId, setExpandedHintProblemId] = useState<string | null>(null);
  const [expandedHintTier, setExpandedHintTier] = useState<Record<string, number>>({});
  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});

  const isProblemDone = (id: string) => {
    if (completedProblems && completedProblems[id] !== undefined) {
      return completedProblems[id];
    }
    return !!localCompleted[id];
  };

  const handleToggleProblem = (id: string) => {
    if (onToggleProblem) {
      onToggleProblem(id);
    } else {
      setLocalCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleHintTier = (probId: string, tier: number) => {
    setExpandedHintTier((prev) => ({
      ...prev,
      [probId]: prev[probId] === tier ? tier - 1 : tier,
    }));
  };

  const filteredProblems = problems.filter((p) => {
    if (selectedPriorityFilter === 'all') return true;
    return p.priority === Number(selectedPriorityFilter);
  });

  const solvedCount = problems.filter((p) => isProblemDone(p.id)).length;

  return (
    <section className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="heading-section text-slate-900 dark:text-white mb-0">
            {sectionNumber}. {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        {/* Priority filter buttons */}
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
            Tất cả ({problems.length})
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
            {solvedCount}/{problems.length} ({Math.round((solvedCount / Math.max(1, problems.length)) * 100)}%)
          </span>
        </div>
      </div>

      {/* Problem list */}
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

              {/* 3-Tier Progressive Hints */}
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
  );
};
