import { describe, it, expect } from 'vitest';

function getSubtopicIdFromHash(hash: string): string {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean || clean === 'home') return 'home';
  const match = clean.match(/^(?:lesson\/|topic\/)?([0-9]+\.[0-9]+)$/);
  if (match) return match[1];
  return 'home';
}

function getHashFromSubtopicId(id: string): string {
  if (id === 'home') return '';
  return `#/lesson/${id}`;
}

describe('URL Hash Routing Helper', () => {
  it('should parse home when hash is empty or #/ or #/home', () => {
    expect(getSubtopicIdFromHash('')).toBe('home');
    expect(getSubtopicIdFromHash('#')).toBe('home');
    expect(getSubtopicIdFromHash('#/')).toBe('home');
    expect(getSubtopicIdFromHash('#/home')).toBe('home');
  });

  it('should parse subtopic id from various URL formats', () => {
    expect(getSubtopicIdFromHash('#/lesson/1.1')).toBe('1.1');
    expect(getSubtopicIdFromHash('#/lesson/2.1')).toBe('2.1');
    expect(getSubtopicIdFromHash('#/topic/1.4')).toBe('1.4');
    expect(getSubtopicIdFromHash('#/1.7')).toBe('1.7');
    expect(getSubtopicIdFromHash('#1.8')).toBe('1.8');
  });

  it('should generate valid canonical hash string from subtopic id', () => {
    expect(getHashFromSubtopicId('home')).toBe('');
    expect(getHashFromSubtopicId('1.1')).toBe('#/lesson/1.1');
    expect(getHashFromSubtopicId('2.1')).toBe('#/lesson/2.1');
  });

  it('should fallback to home for unknown non-subtopic hashes', () => {
    expect(getSubtopicIdFromHash('#/unknown/path')).toBe('home');
    expect(getSubtopicIdFromHash('#/random')).toBe('home');
  });
});
