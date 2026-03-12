import React from 'react';

export const StatusChip = ({ status, type = 'neutral' }) => {
  const types = {
    success: 'bg-green-900/40 text-green-500 border border-green-500',
    warning: 'bg-amber-900/40 text-amber-500 border border-amber-500',
    critical: 'bg-red-900/40 text-red-500 border border-red-500',
    neutral: 'bg-panel text-text-muted border border-border'
  };

  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${types[type]}`}>
      {status}
    </span>
  );
};
