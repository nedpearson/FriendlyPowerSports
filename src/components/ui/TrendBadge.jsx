import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const TrendBadge = ({ trend, value }) => {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-900/40 px-2 py-0.5 rounded border border-green-800">
        <TrendingUp className="w-3 h-3" /> {value}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-900/40 px-2 py-0.5 rounded border border-red-800">
        <TrendingDown className="w-3 h-3" /> {value}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-bold text-text-muted bg-panel px-2 py-0.5 rounded border border-border">
      <Minus className="w-3 h-3" /> {value}
    </span>
  );
};
