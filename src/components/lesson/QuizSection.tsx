import React, { useState } from 'react';
import type { QuizQuestion } from '../../types/lesson';

export interface QuizSectionProps {
  questions: QuizQuestion[];
  title?: string;
  sectionNumber?: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  title = 'Kiểm Tra Nhanh Phản Xạ (Quiz)',
  sectionNumber = '9',
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    if (selectedAnswers[qId] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;

  return (
    <section className="mb-10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="heading-section text-slate-900 dark:text-white mb-0">
          {sectionNumber}. {title}
        </h2>
        {answeredCount > 0 && (
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Đúng: {correctCount}/{answeredCount} (Tổng: {questions.length} câu)
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const userChoice = selectedAnswers[q.id];
          const hasAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs"
            >
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Câu {q.id}: {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle =
                    'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400';
                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      btnStyle =
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                    } else if (optIdx === userChoice) {
                      btnStyle =
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(q.id, optIdx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs sm:text-sm border transition cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div
                  className={`mt-3 p-2.5 rounded-lg text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <strong>{isCorrect ? 'Tuyệt vời!' : 'Chưa đúng!'}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
