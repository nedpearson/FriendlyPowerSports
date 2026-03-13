import React from 'react';
import { DrillDownValue } from './DrillDownValue';

export const KPICard = ({ label, value, delta, color, onClick }) => {
  return (
    <div 
      className="bg-charcoal p-4 rounded border border-border flex flex-col hover:border-gold-dim transition-all"
    >
      <span className="font-mono text-text-dim text-xs tracking-wider uppercase">{label}</span>
      <div className="font-playfair text-3xl my-2">
        <DrillDownValue 
          value={value} 
          label={label} 
          type="KPI" 
          onDrillDown={() => onClick()} 
          color="text-gold" 
        />
      </div>
      <span className={`text-xs font-bold ${color}`}>{delta}</span>
    </div>
  );
};
