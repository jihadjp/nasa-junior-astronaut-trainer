// Minimalistic Desktop Hover Tooltip Component

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-1 text-[11px] font-sans leading-tight text-slate-200 bg-[#0A1020]/95 border border-slate-700/80 rounded-md shadow-xl backdrop-blur-md pointer-events-none z-50 whitespace-nowrap animate-fadeIn ${
            position === 'top'
              ? 'bottom-full mb-1.5'
              : 'top-full mt-1.5'
          }`}
        >
          {content}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0A1020] border-r border-b border-slate-700 transform rotate-45 ${
              position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'
            }`}
          />
        </div>
      )}
    </div>
  );
};
