declare module 'katex/dist/contrib/auto-render.mjs' {
  interface RenderMathInElementSpecificOptionsDelimiters {
    left: string;
    right: string;
    display: boolean;
  }

  interface RenderMathInElementOptions {
    delimiters?: readonly RenderMathInElementSpecificOptionsDelimiters[];
    ignoredTags?: readonly string[];
    ignoredClasses?: readonly string[];
    errorCallback?: (msg: string, err: Error) => void;
    preProcess?: (math: string) => string;
    throwOnError?: boolean;
    displayMode?: boolean;
  }

  export default function renderMathInElement(
    elem: HTMLElement,
    options?: RenderMathInElementOptions
  ): void;
}
