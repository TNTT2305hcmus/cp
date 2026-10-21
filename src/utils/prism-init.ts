import Prism from 'prismjs';

// Prism language components (e.g. prism-clike) access `Prism` directly as a global variable.
// Setting it on window and globalThis before language modules are imported ensures they find `Prism`.
if (typeof window !== 'undefined') {
  (window as unknown as { Prism: typeof Prism }).Prism = Prism;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
}

export default Prism;
