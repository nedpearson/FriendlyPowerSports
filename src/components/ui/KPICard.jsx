import React from 'react';
import { DrillDownValue } from './DrillDownValue';

export const KPICard = ({ label, value, delta, color, onClick, reportId }) => {
  return (
    <div 
      className="bg-charcoal p-4 rounded border border-border flex flex-col hover:border-gold-dim transition-all cursor-pointer"
      onClick={onClick}
    >
      <span className="font-mono text-text-dim text-xs tracking-wider uppercase">
        <DrillDownValue value={label} label={`${label} Context`} type="KPI" onDrillDown={onClick} color="text-text-dim" reportId={reportId} metricId="label" />
      </span>
      <div className="font-playfair text-3xl my-2">
        <DrillDownValue 
          value={value} 
          label={label} 
          type="KPI" 
          onDrillDown={onClick} 
          color="text-gold" 
          reportId={reportId}
          metricId="value"
        />
      </div>
      <span className={`text-xs font-bold ${color}`}>
        <DrillDownValue value={delta} label={`${label} Trend`} type="KPI" onDrillDown={onClick} color={color} reportId={reportId} metricId="delta" />
      </span>
    </div>
  );
};
