import { useEffect, type RefObject } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

/**
 * Hook to automatically render LaTeX math formulas ($...$ for inline, $$...$$ for block)
 * inside a container using KaTeX.
 */
export function useKaTeX(containerRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const render = () => {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
          ignoredClasses: ['katex', 'katex-display', 'katex-html'],
        });
      } catch {
        // Silently catch parsing edge cases
      }
    };

    // Render immediately
    render();

    // Observe future DOM updates containing '$'
    const observer = new MutationObserver((mutations) => {
      let shouldRender = false;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          if (mutation.target.nodeValue && mutation.target.nodeValue.includes('$')) {
            shouldRender = true;
            break;
          }
        } else if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.includes('$')) {
              shouldRender = true;
              break;
            } else if (
              node.nodeType === Node.ELEMENT_NODE &&
              !(node as HTMLElement).classList?.contains('katex') &&
              (node as HTMLElement).textContent?.includes('$')
            ) {
              shouldRender = true;
              break;
            }
          }
          if (shouldRender) break;
        }
      }

      if (shouldRender) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(render, 40);
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
