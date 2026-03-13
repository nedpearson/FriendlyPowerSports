import React from 'react';

export const DrillDownValue = ({ value, label, type, onDrillDown, color, className = '' }) => {
  return (
    <span 
      onClick={(e) => {
        e.stopPropagation();
        onDrillDown(type || 'KPI', { label: label || 'Metric', value });
      }}
      className={`cursor-pointer hover:underline decoration-gold underline-offset-4 decoration-2 transition-all ${color || 'text-white'} ${className}`}
      title={`Click to analyze ${label || 'this metric'}`}
    >
      {value}
    </span>
  );
};
