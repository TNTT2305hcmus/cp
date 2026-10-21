import React, { useState, useMemo } from 'react';
import { FileCode2 } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

export interface CodeTab {
  id: string;
  label: string;
  language?: string;
  iconColor?: string;
  content?: React.ReactNode;
  rawCode: string;
}

export interface CodeViewerProps {
  tabs: CodeTab[];
  defaultTabId?: string;
  title?: string;
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  tabs,
  defaultTabId,
  className = '',
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || (tabs[0]?.id ?? ''));

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const highlightedCode = useMemo(() => {
    if (!activeTab?.rawCode) return '';
    const rawLang = (activeTab.language || activeTab.id || 'cpp').toLowerCase();
    const prismLang =
      rawLang === 'ts' || rawLang === 'typescript'
        ? 'typescript'
        : rawLang === 'py' || rawLang === 'python'
          ? 'python'
          : 'cpp';

    const grammar = Prism.languages[prismLang] || Prism.languages.clike;
    return Prism.highlight(activeTab.rawCode, grammar, prismLang);
  }, [activeTab]);

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-300 dark:border-[#2d2d2d] bg-[#1e1e1e] shadow-md font-mono ${className}`}>
      
      {/* Tab Bar - Clean tabs only (no copy button, no VS Code title) */}
      <div className="flex items-center bg-[#252526] border-b border-[#2d2d2d] px-2 text-xs select-none">
        <div className="flex items-center overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-r border-[#2d2d2d] transition cursor-pointer shrink-0 font-medium ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                    : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                }`}
              >
                <FileCode2 
                  className="w-4 h-4 shrink-0" 
                  style={{ color: tab.iconColor || (tab.id === 'cpp' ? '#007acc' : tab.id === 'python' ? '#3572a5' : '#3178c6') }} 
                />
                <span className="text-xs sm:text-[13px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Body with syntax highlighting */}
      <div className="p-4 sm:p-5 overflow-x-auto text-[#d4d4d4] font-mono leading-relaxed text-[13px] sm:text-[14.5px]">
        {highlightedCode ? (
          <pre className="m-0 p-0 bg-transparent font-mono overflow-x-auto">
            <code
              className={`language-${activeTab?.language || activeTab?.id || 'cpp'}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          activeTab?.content
        )}
      </div>
    </div>
  );
};
