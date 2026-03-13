import React from 'react';
import { AlertCircle, TrendingDown, Lightbulb, ArrowRight, Zap } from 'lucide-react';

export const AutomatedInsights = ({ insights, onDrillDown }) => {
  if (!insights || insights.length === 0) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />;
      case 'action': return <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />;
      default: return <Lightbulb className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
        Automated Intelligence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-charcoal border border-border rounded p-4 flex gap-3 items-start hover:border-gold-dim transition-colors group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {getIcon(insight.type)}
            <div>
              <p className="text-sm text-text leading-relaxed">
                {insight.message}
              </p>
              {insight.actionText && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDrillDown) onDrillDown('Action', { name: insight.actionText, context: 'Automated Insight' });
                  }}
                  className="text-xs font-bold font-mono tracking-wide text-gold mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  {insight.actionText} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
