import React, { useState, useMemo } from 'react';
import { Card } from '../../components';

export const BitRegisterVisualizer: React.FC = () => {
  const [interactiveBits, setInteractiveBits] = useState<number>(0b00101011); // 8-bit default

  const toggleBit = (idx: number) => {
    setInteractiveBits((prev) => prev ^ (1 << idx));
  };

  const bitCount = useMemo(() => {
    let cnt = 0;
    let n = interactiveBits;
    while (n > 0) {
      cnt += n & 1;
      n >>= 1;
    }
    return cnt;
  }, [interactiveBits]);

  return (
    <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Thanh Ghi 8-bit Tương Tác
        </span>
        <div className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
          Giá trị thập phân: {interactiveBits}
        </div>
      </div>

      {/* Interactive bits row */}
      <div className="flex flex-wrap gap-2 justify-center py-3">
        {Array.from({ length: 8 }, (_, idx) => {
          const bitPos = 7 - idx; // Display bit 7 on left, bit 0 on right
          const isSet = (interactiveBits & (1 << bitPos)) !== 0;

          return (
            <button
              key={bitPos}
              type="button"
              onClick={() => toggleBit(bitPos)}
              className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                isSet
                  ? 'bg-teal-600 text-white font-bold ring-4 ring-teal-200 dark:ring-teal-900 scale-105 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-teal-400'
              }`}
              title={`Click để đảo bit ${bitPos}`}
            >
              <span className="text-base">{isSet ? '1' : '0'}</span>
              <span className="text-[10px] opacity-75">bit {bitPos}</span>
            </button>
          );
        })}
      </div>

      {/* Member function status grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 font-mono">b.count()</span>
          <div className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
            {bitCount}
          </div>
          <span className="text-[10px] text-slate-500">Số lượng bit 1 (popcount)</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 font-mono">b.any()</span>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
            {interactiveBits > 0 ? 'true' : 'false'}
          </div>
          <span className="text-[10px] text-slate-500">Có ít nhất 1 bit bật</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 font-mono">b.all()</span>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
            {interactiveBits === 255 ? 'true' : 'false'}
          </div>
          <span className="text-[10px] text-slate-500">Tất cả 8 bit đều bật</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-400 font-mono">b.none()</span>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
            {interactiveBits === 0 ? 'true' : 'false'}
          </div>
          <span className="text-[10px] text-slate-500">Không có bit nào bật</span>
        </div>
      </div>
    </Card>
  );
};
