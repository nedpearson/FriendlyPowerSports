import React from 'react';

export const SectionHeader = ({ title, actionText, onAction }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase">{title}</h3>
      {actionText && (
        <span 
          onClick={(e) => {
            if (onAction) {
              e.stopPropagation();
              onAction(e);
            }
          }}
          className="text-xs text-gold cursor-pointer hover:underline"
        >
          {actionText}
        </span>
      )}
    </div>
  );
};
