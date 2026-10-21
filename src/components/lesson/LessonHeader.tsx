import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Check } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

export interface LessonHeaderProps {
  lessonId: string;
  monthNumber?: number;
  monthTitle?: string;
  title: string;
  description: React.ReactNode;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  keyTopics?: string[];
  isTheoryCompleted?: boolean;
  onToggleTheory?: () => void;
  onSelectSubtopic?: (subtopicId: string) => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonId,
  monthNumber = 1,
  monthTitle = 'Cấu Trúc Dữ Liệu Cơ Bản',
  title,
  description,
  difficulty = 'Medium',
  keyTopics = [],
  isTheoryCompleted = false,
  onToggleTheory,
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

  const difficultyVariant = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';

  return (
    <>
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
          onClick={() => onSelectSubtopic?.(`${monthNumber}.0`)}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline text-slate-700 dark:text-slate-300 font-semibold"
        >
          Tháng {monthNumber}: {monthTitle}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-teal-600 dark:text-teal-400 font-semibold">{lessonId} {title}</span>
      </nav>

      {/* 2. HEADER CARD */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" size="sm">
              Tháng {monthNumber} • {lessonId}
            </Badge>
            <Badge variant={difficultyVariant} size="sm">
              {difficulty}
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
          {title}
        </h1>

        <div className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {description}
        </div>

        {/* Key topics chips */}
        {keyTopics.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
            {keyTopics.map((k, idx) => (
              <Badge key={idx} variant="slate" size="xs" className="font-mono">
                {k}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};
