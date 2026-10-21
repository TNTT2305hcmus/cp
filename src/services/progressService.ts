/**
 * Quản lý và đồng bộ tiến độ học tập Competitive Programming của Trí Thanh.
 * Hỗ trợ lưu trữ cục bộ (localStorage), xuất/nhập file JSON để chuyển đổi thiết bị,
 * và sẵn sàng kết nối Cloud Backend (Supabase/Firebase/REST API).
 */

export interface UserProgressBackup {
  version: 1;
  appName: 'topalgo-cp-coach';
  exportedAt: string;
  user: string;
  completedTheories: Record<string, boolean>;
  completedProblems: Record<string, boolean>;
}

const THEORIES_STORAGE_KEY = 'tri_thanh_theories_progress';
const PROBLEMS_STORAGE_KEY = 'tri_thanh_problems_progress';

const memoryStore: Record<string, string> = {};

function getStorage() {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return {
    getItem: (key: string) => memoryStore[key] ?? null,
    setItem: (key: string, val: string) => { memoryStore[key] = val; },
    removeItem: (key: string) => { delete memoryStore[key]; },
    clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); },
  };
}

export const progressService = {
  loadProgress(): {
    completedTheories: Record<string, boolean>;
    completedProblems: Record<string, boolean>;
  } {
    try {
      const storage = getStorage();
      const theoriesRaw = storage.getItem(THEORIES_STORAGE_KEY);
      const problemsRaw = storage.getItem(PROBLEMS_STORAGE_KEY);
      return {
        completedTheories: theoriesRaw ? JSON.parse(theoriesRaw) : {},
        completedProblems: problemsRaw ? JSON.parse(problemsRaw) : {},
      };
    } catch (e) {
      console.error('Failed to load progress from storage', e);
      return { completedTheories: {}, completedProblems: {} };
    }
  },

  saveTheories(theories: Record<string, boolean>): void {
    try {
      getStorage().setItem(THEORIES_STORAGE_KEY, JSON.stringify(theories));
    } catch (e) {
      console.error('Failed to save theories progress', e);
    }
  },

  saveProblems(problems: Record<string, boolean>): void {
    try {
      getStorage().setItem(PROBLEMS_STORAGE_KEY, JSON.stringify(problems));
    } catch (e) {
      console.error('Failed to save problems progress', e);
    }
  },

  exportProgress(
    completedTheories: Record<string, boolean>,
    completedProblems: Record<string, boolean>
  ): UserProgressBackup {
    return {
      version: 1,
      appName: 'topalgo-cp-coach',
      exportedAt: new Date().toISOString(),
      user: 'Trí Thanh',
      completedTheories,
      completedProblems,
    };
  },

  downloadBackup(
    completedTheories: Record<string, boolean>,
    completedProblems: Record<string, boolean>
  ): void {
    const backup = this.exportProgress(completedTheories, completedProblems);
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `tri-thanh-cp-progress-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importProgress(
    jsonString: string
  ): {
    success: boolean;
    data?: {
      completedTheories: Record<string, boolean>;
      completedProblems: Record<string, boolean>;
    };
    error?: string;
  } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Dữ liệu không đúng định dạng JSON.' };
      }

      if (!parsed.completedTheories && !parsed.completedProblems) {
        return {
          success: false,
          error: 'File sao lưu thiếu dữ liệu lý thuyết hoặc bài tập.',
        };
      }

      const theories = (parsed.completedTheories && typeof parsed.completedTheories === 'object')
        ? parsed.completedTheories
        : {};
      const problems = (parsed.completedProblems && typeof parsed.completedProblems === 'object')
        ? parsed.completedProblems
        : {};

      this.saveTheories(theories);
      this.saveProblems(problems);

      return {
        success: true,
        data: {
          completedTheories: theories,
          completedProblems: problems,
        },
      };
    } catch {
      return { success: false, error: 'Không thể đọc file JSON hợp lệ.' };
    }
  },

  clearProgress(): void {
    try {
      const storage = getStorage();
      storage.removeItem(THEORIES_STORAGE_KEY);
      storage.removeItem(PROBLEMS_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear progress', e);
    }
  },
};
