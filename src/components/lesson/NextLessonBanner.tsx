import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../Button';

export interface NextLessonBannerProps {
  nextLessonId: string;
  nextLessonTitle: string;
  nextLessonDescription: string;
  onSelectSubtopic?: (subtopicId: string) => void;
  buttonText?: string;
}

export const NextLessonBanner: React.FC<NextLessonBannerProps> = ({
  nextLessonId,
  nextLessonTitle,
  nextLessonDescription,
  onSelectSubtopic,
  buttonText,
}) => {
  return (
    <div className="mt-14 p-6 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
          Bài tiếp theo: {nextLessonId} {nextLessonTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {nextLessonDescription}
        </p>
      </div>
      <Button
        variant="primary"
        size="md"
        onClick={() => onSelectSubtopic?.(nextLessonId)}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        {buttonText || `Học Bài ${nextLessonId}`}
      </Button>
    </div>
  );
};
