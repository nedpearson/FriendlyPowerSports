import React from 'react';

export const KPICard = ({ label, value, delta, color, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-charcoal p-4 rounded border border-border flex flex-col cursor-pointer hover:border-border-light transition-all"
    >
      <span className="font-mono text-text-dim text-xs tracking-wider uppercase">{label}</span>
      <span className="font-playfair text-3xl text-gold my-2">{value}</span>
      <span className={`text-xs font-bold ${color}`}>{delta}</span>
    </div>
  );
};
