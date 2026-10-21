import { describe, it, expect, beforeEach } from 'vitest';
import { progressService } from '../src/services/progressService';

describe('Progress Service & Storage', () => {
  beforeEach(() => {
    progressService.clearProgress();
  });

  it('should export progress matching backup schema', () => {
    const theories = { '1.1': true, '1.2': true };
    const problems = { 'lc-1': true, 'lc-15': true };

    const backup = progressService.exportProgress(theories, problems);

    expect(backup.version).toBe(1);
    expect(backup.appName).toBe('topalgo-cp-coach');
    expect(backup.completedTheories).toEqual(theories);
    expect(backup.completedProblems).toEqual(problems);
    expect(backup.user).toBe('Trí Thanh');
    expect(typeof backup.exportedAt).toBe('string');
  });

  it('should save and load progress via localStorage', () => {
    const theories = { '1.1': true, '1.5': true };
    const problems = { 'lc-217': true };

    progressService.saveTheories(theories);
    progressService.saveProblems(problems);

    const loaded = progressService.loadProgress();
    expect(loaded.completedTheories).toEqual(theories);
    expect(loaded.completedProblems).toEqual(problems);
  });

  it('should successfully import valid progress JSON', () => {
    const backupJson = JSON.stringify({
      version: 1,
      appName: 'topalgo-cp-coach',
      exportedAt: new Date().toISOString(),
      user: 'Trí Thanh',
      completedTheories: { '1.1': true, '1.3': true },
      completedProblems: { 'lc-20': true, 'lc-239': true },
    });

    const result = progressService.importProgress(backupJson);
    expect(result.success).toBe(true);
    expect(result.data?.completedTheories).toEqual({ '1.1': true, '1.3': true });
    expect(result.data?.completedProblems).toEqual({ 'lc-20': true, 'lc-239': true });

    // Verify persisted in localStorage
    const stored = progressService.loadProgress();
    expect(stored.completedTheories).toEqual({ '1.1': true, '1.3': true });
  });

  it('should safely reject corrupted or invalid JSON', () => {
    const badJson = '{ invalid_json: ';
    const result = progressService.importProgress(badJson);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should safely reject empty JSON objects missing required keys', () => {
    const emptyJson = JSON.stringify({ foo: 'bar' });
    const result = progressService.importProgress(emptyJson);
    expect(result.success).toBe(false);
  });

  it('should clear stored progress when requested', () => {
    progressService.saveTheories({ '1.1': true });
    progressService.saveProblems({ 'lc-1': true });
    progressService.clearProgress();

    const loaded = progressService.loadProgress();
    expect(loaded.completedTheories).toEqual({});
    expect(loaded.completedProblems).toEqual({});
  });
});
