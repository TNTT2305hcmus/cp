import { describe, it, expect } from 'vitest';
import { ROADMAP_MODULES } from '../src/data/roadmapData';

describe('Roadmap Data Integrity', () => {
  it('should define all 12 modules matching TopAlgo 13-month curriculum', () => {
    expect(ROADMAP_MODULES).toHaveLength(12);
  });

  it('should have unique module IDs from 1 to 12', () => {
    const ids = ROADMAP_MODULES.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(12);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should have non-empty titles and valid subtopics for each month', () => {
    for (const module of ROADMAP_MODULES) {
      expect(module.title.trim().length).toBeGreaterThan(0);
      expect(module.monthLabel).toMatch(/^Tháng \d{1,2}$/);
      expect(module.subtopics.length).toBeGreaterThan(0);
    }
  });

  it('should ensure all subtopic IDs across the entire roadmap are unique', () => {
    const subtopicIds: string[] = [];
    for (const module of ROADMAP_MODULES) {
      for (const sub of module.subtopics) {
        subtopicIds.push(sub.id);
        expect(sub.id.startsWith(`${module.id}.`)).toBe(true);
        expect(sub.title.trim().length).toBeGreaterThan(0);
      }
    }
    const uniqueSubtopicIds = new Set(subtopicIds);
    expect(uniqueSubtopicIds.size).toBe(subtopicIds.length);
  });

  it('should have valid problem definitions with title and links', () => {
    for (const module of ROADMAP_MODULES) {
      for (const sub of module.subtopics) {
        if (sub.problems && sub.problems.length > 0) {
          for (const prob of sub.problems) {
            expect(prob.id.trim().length).toBeGreaterThan(0);
            expect(prob.title.trim().length).toBeGreaterThan(0);
            expect(prob.link).toMatch(/^https?:\/\//);
            expect(['Easy', 'Medium', 'Hard']).toContain(prob.difficulty);
          }
        }
      }
    }
  });
});
