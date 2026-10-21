import { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { useKaTeX } from './utils/useKaTeX';
import { progressService } from './services/progressService';
import { ROADMAP_MODULES, type MonthModule, type SubTopic } from './data/roadmapData';
import {
  Header,
  Sidebar,
  Footer,
  Button,
  Badge,
  Card,
  HomeLanding,
  ProgressSyncModal,
  LessonLoadingFallback,
} from './components';
import {
  BookOpen,
  ChevronRight,
  Check,
  CheckCircle2
} from 'lucide-react';

// Lazy loading lessons for optimal bundle splitting and performance
const Month01_Overview = lazy(() => import('./lessons/Month01_Overview').then(m => ({ default: m.Month01_Overview })));
const Month02_Overview = lazy(() => import('./lessons/Month02_Overview').then(m => ({ default: m.Month02_Overview })));
const Lesson01_VectorSorting = lazy(() => import('./lessons/Lesson01_VectorSorting').then(m => ({ default: m.Lesson01_VectorSorting })));
const Lesson01_Stack = lazy(() => import('./lessons/Lesson01_Stack').then(m => ({ default: m.Lesson01_Stack })));
const Lesson01_QueueDeque = lazy(() => import('./lessons/Lesson01_QueueDeque').then(m => ({ default: m.Lesson01_QueueDeque })));
const Lesson01_Heap = lazy(() => import('./lessons/Lesson01_Heap').then(m => ({ default: m.Lesson01_Heap })));
const Lesson01_BSTSet = lazy(() => import('./lessons/Lesson01_BSTSet').then(m => ({ default: m.Lesson01_BSTSet })));
const Lesson01_MapHash = lazy(() => import('./lessons/Lesson01_MapHash').then(m => ({ default: m.Lesson01_MapHash })));
const Lesson01_Bitset = lazy(() => import('./lessons/Lesson01_Bitset').then(m => ({ default: m.Lesson01_Bitset })));
const Test01_Test1 = lazy(() => import('./lessons/Test01_Test1').then(m => ({ default: m.Test01_Test1 })));
const Test01_Test2 = lazy(() => import('./lessons/Test01_Test2').then(m => ({ default: m.Test01_Test2 })));
const Lesson02_TwoPointers = lazy(() => import('./lessons/Lesson02_TwoPointers').then(m => ({ default: m.Lesson02_TwoPointers })));

function getSubtopicIdFromHash(): string {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash || hash === 'home') return 'home';
  const match = hash.match(/^(?:lesson\/|topic\/)?([0-9]+\.[0-9]+)$/);
  if (match) return match[1];
  return 'home';
}

function getHashFromSubtopicId(id: string): string {
  if (id === 'home') return '';
  return `#/lesson/${id}`;
}

export function App() {
  // Theme state: light by default
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Selected subtopic initialized from URL Hash for deep link sharing
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>(() => {
    return getSubtopicIdFromHash();
  });

  // Sidebar expanded months: default open month 1 & 2 + current active month
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>(() => {
    const initialId = getSubtopicIdFromHash();
    const initialMonth = parseInt(initialId.split('.')[0], 10);
    return {
      1: true,
      2: true,
      ...(isNaN(initialMonth) ? {} : { [initialMonth]: true }),
    };
  });

  const toggleMonth = (monthId: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthId]: !prev[monthId],
    }));
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  const mainContentRef = useRef<HTMLElement | null>(null);
  useKaTeX(mainContentRef, [selectedSubtopicId]);

  // Global Progress Tracking for Trí Thanh with progressService
  const [completedTheories, setCompletedTheories] = useState<Record<string, boolean>>(() => {
    return progressService.loadProgress().completedTheories;
  });

  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>(() => {
    return progressService.loadProgress().completedProblems;
  });

  const toggleTheory = (subtopicId: string) => {
    const updated = { ...completedTheories, [subtopicId]: !completedTheories[subtopicId] };
    setCompletedTheories(updated);
    progressService.saveTheories(updated);
  };

  const toggleProblem = (problemId: string) => {
    const updated = { ...completedProblems, [problemId]: !completedProblems[problemId] };
    setCompletedProblems(updated);
    progressService.saveProblems(updated);
  };

  const handleProgressImported = (theories: Record<string, boolean>, problems: Record<string, boolean>) => {
    setCompletedTheories(theories);
    setCompletedProblems(problems);
  };

  // URL Hash Synchronized Navigation
  const navigateToSubtopic = useCallback((id: string) => {
    setSelectedSubtopicId(id);
    const targetHash = getHashFromSubtopicId(id);
    if (window.location.hash !== targetHash) {
      if (!targetHash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = targetHash;
      }
    }
    const monthId = parseInt(id.split('.')[0], 10);
    if (!isNaN(monthId)) {
      setExpandedMonths((prev) => ({ ...prev, [monthId]: true }));
    }
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const id = getSubtopicIdFromHash();
      setSelectedSubtopicId(id);
      const monthId = parseInt(id.split('.')[0], 10);
      if (!isNaN(monthId)) {
        setExpandedMonths((prev) => ({ ...prev, [monthId]: true }));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Find active subtopic and parent month
  let activeMonth: MonthModule = ROADMAP_MODULES[1];
  let activeSubtopic: SubTopic = ROADMAP_MODULES[1].subtopics[0];

  for (const m of ROADMAP_MODULES) {
    for (const sub of m.subtopics) {
      if (sub.id === selectedSubtopicId) {
        activeMonth = m;
        activeSubtopic = sub;
        break;
      }
    }
  }

  // Filter modules/subtopics by search query
  const filteredModules = ROADMAP_MODULES.map((m) => {
    if (!searchQuery.trim()) return m;
    const query = searchQuery.toLowerCase();
    const matchesMonth = m.title.toLowerCase().includes(query) || m.monthLabel.toLowerCase().includes(query);
    const matchingSubtopics = m.subtopics.filter(
      (s) => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
    );
    if (matchesMonth || matchingSubtopics.length > 0) {
      return {
        ...m,
        subtopics: matchesMonth ? m.subtopics : matchingSubtopics,
      };
    }
    return null;
  }).filter(Boolean) as MonthModule[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">

      {/* 1. TOP NAVIGATION HEADER */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onGoHome={() => navigateToSubtopic('home')}
        onOpenSync={() => setIsSyncModalOpen(true)}
      />

      {/* 2. MAIN LAYOUT: FULL SCREEN HOMELANDING OR SIDEBAR + LESSON */}
      {selectedSubtopicId === 'home' ? (
        <main className="flex-1 flex flex-col justify-center items-center w-full min-h-[calc(100vh-3.5rem-4.5rem)]">
          <HomeLanding
            onStartLearning={() => navigateToSubtopic('1.0')}
            completedProblemsCount={Object.values(completedProblems).filter(Boolean).length}
            completedTheoriesCount={Object.values(completedTheories).filter(Boolean).length}
          />
        </main>
      ) : (
        <div className="max-w-7xl mx-auto w-full flex-1 flex">
          {/* LEFT SIDEBAR */}
          <Sidebar
            modules={filteredModules}
            selectedSubtopicId={selectedSubtopicId}
            onSelectSubtopic={navigateToSubtopic}
            sidebarOpen={sidebarOpen}
            onCloseSidebar={() => setSidebarOpen(false)}
            expandedMonths={expandedMonths}
            onToggleMonth={toggleMonth}
            completedTheories={completedTheories}
            completedProblems={completedProblems}
          />

          {/* MAIN VIEWPORT WITH SUSPENSE */}
          <main ref={mainContentRef} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
            <Suspense fallback={<LessonLoadingFallback />}>
              {activeSubtopic.id === '1.0' ? (
                <Month01_Overview
                  onSelectSubtopic={navigateToSubtopic}
                  completedTheories={completedTheories}
                  completedProblems={completedProblems}
                />
              ) : activeSubtopic.id === '1.1' ? (
                <Lesson01_VectorSorting
                  isTheoryCompleted={!!completedTheories['1.1']}
                  onToggleTheory={() => toggleTheory('1.1')}
                  completedProblems={completedProblems}
                  onToggleProblem={toggleProblem}
                  onSelectSubtopic={navigateToSubtopic}
                />
            ) : activeSubtopic.id === '1.2' ? (
              <Lesson01_Stack
                isTheoryCompleted={!!completedTheories['1.2']}
                onToggleTheory={() => toggleTheory('1.2')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : activeSubtopic.id === '1.3' ? (
              <Lesson01_QueueDeque
                isTheoryCompleted={!!completedTheories['1.3']}
                onToggleTheory={() => toggleTheory('1.3')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : activeSubtopic.id === '1.4' ? (
              <Lesson01_Heap
                isTheoryCompleted={!!completedTheories['1.4']}
                onToggleTheory={() => toggleTheory('1.4')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : activeSubtopic.id === '1.5' ? (
              <Lesson01_BSTSet
                isTheoryCompleted={!!completedTheories['1.5']}
                onToggleTheory={() => toggleTheory('1.5')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : activeSubtopic.id === '1.6' ? (
              <Lesson01_MapHash
                isTheoryCompleted={!!completedTheories['1.6']}
                onToggleTheory={() => toggleTheory('1.6')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : activeSubtopic.id === '1.7' ? (
              <Lesson01_Bitset
                isTheoryCompleted={!!completedTheories['1.7']}
                onToggleTheory={() => toggleTheory('1.7')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : activeSubtopic.id === '1.8' ? (
              <Test01_Test1
                onSelectSubtopic={navigateToSubtopic}
                completedTheories={completedTheories}
              />
            ) : activeSubtopic.id === '1.9' ? (
              <Test01_Test2
                onSelectSubtopic={navigateToSubtopic}
                completedTheories={completedTheories}
              />
            ) : activeSubtopic.id === '2.0' ? (
              <Month02_Overview
                onSelectSubtopic={navigateToSubtopic}
                completedTheories={completedTheories}
                completedProblems={completedProblems}
              />
            ) : activeSubtopic.id === '2.1' ? (
              <Lesson02_TwoPointers
                isTheoryCompleted={!!completedTheories['2.1']}
                onToggleTheory={() => toggleTheory('2.1')}
                completedProblems={completedProblems}
                onToggleProblem={toggleProblem}
                onSelectSubtopic={navigateToSubtopic}
              />
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <button
                    type="button"
                    onClick={() => navigateToSubtopic('home')}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline"
                  >
                    Lộ trình CP
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <button
                    type="button"
                    onClick={() => navigateToSubtopic(`${activeMonth.id}.0`)}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer underline-offset-2 hover:underline"
                    title={`Xem Tổng Quan ${activeMonth.monthLabel}`}
                  >
                    {activeMonth.monthLabel}: {activeMonth.title}
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">{activeSubtopic.title}</span>
                </nav>

              {/* Title Card */}
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="teal" size="sm">
                      {activeMonth.monthLabel} • {activeSubtopic.id}
                    </Badge>
                    <Badge
                      variant={
                        activeSubtopic.difficulty === 'Easy'
                          ? 'easy'
                          : activeSubtopic.difficulty === 'Medium'
                            ? 'medium'
                            : 'hard'
                      }
                      size="sm"
                    >
                      {activeSubtopic.difficulty}
                    </Badge>
                  </div>

                  <Button
                    variant={completedTheories[activeSubtopic.id] ? 'success' : 'secondary'}
                    size="sm"
                    onClick={() => toggleTheory(activeSubtopic.id)}
                    leftIcon={
                      completedTheories[activeSubtopic.id] ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      )
                    }
                  >
                    {completedTheories[activeSubtopic.id] ? 'Đã Xong Lý Thuyết' : 'Đánh dấu Xong Lý Thuyết'}
                  </Button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {activeSubtopic.title}
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {activeSubtopic.description}
                </p>

                {/* Key topics chips */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium mr-1">Chủ đề trọng tâm:</span>
                  {activeSubtopic.keyTopics.map((k, idx) => (
                    <Badge key={idx} variant="slate" size="xs" className="font-mono">
                      {k}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Status Notice */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-teal-600 dark:text-teal-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Bài Giảng Đang Được Biên Soạn
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Đã có sẵn danh mục 30-45 bài tập và đề thi trong <code className="text-slate-700 dark:text-slate-300 font-mono">docs/PLANNING.md</code>.
                </p>
              </div>

            </div>
          )}
            </Suspense>
        </main>
      </div>
      )}

      {/* 3. FOOTER */}
      <Footer />

      {/* 4. PROGRESS SYNC / BACKUP MODAL */}
      <ProgressSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        completedTheories={completedTheories}
        completedProblems={completedProblems}
        onProgressImported={handleProgressImported}
      />

    </div>
  );
}

export default App;
