import React, { useState, useEffect } from 'react';
import { isAgentEnabled } from '../../agents/config/features';
import { AgentMemory } from '../../agents/core/AgentMemory';
import { ActionLayer } from '../../agents/executors/ActionLayer';
import { BrainCircuit, CheckCircle2, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';

/**
 * A non-disruptive widget that displays pending agent recommendations 
 * to managers without altering the global application layout.
 */
export const AgentWidget = ({ userContext }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (isAgentEnabled('super_agents')) {
      const pending = AgentMemory.getPendingRecommendations(userContext);
      setRecommendations(pending);
    }
  }, [userContext, refresh]);

  if (!isAgentEnabled('super_agents')) return null;
  if (recommendations.length === 0) return null;

  const handleAction = async (rec, actionId) => {
    const action = rec.proposedActions.find(a => a.id === actionId);
    if (!action) return;

    // Simulate approving the action since it's the manager clicking
    action._userApproved = true;
    
    await ActionLayer.execute(action, userContext, rec.agentId);
    AgentMemory.updateRecommendationStatus(rec.id, 'ACTIONED', userContext.userId);
    setRefresh(r => r + 1);
  };

  const handleDismiss = (recId) => {
    AgentMemory.updateRecommendationStatus(recId, 'DISMISSED', userContext.userId);
    setRefresh(r => r + 1);
  };

  return (
    <div className="bg-gradient-to-br from-charcoal to-black border border-gold/30 rounded-lg p-4 mb-6 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
      <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
         <BrainCircuit className="w-5 h-5 text-gold" />
         <h3 className="font-playfair text-gold text-lg tracking-wide">Super Agent Intelligence</h3>
         <span className="bg-red-900/40 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-mono tracking-widest ml-auto">
            {recommendations.length} PENDING
         </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {recommendations.map(rec => (
          <div key={rec.id} className="bg-panel p-3 rounded border border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <strong className="text-white text-sm">{rec.title}</strong>
                 {rec.priority === 'URGENT' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                 <span className="text-[10px] bg-black px-1.5 py-0.5 rounded text-gold border border-gold/20 font-mono">{rec.confidenceScore}% CONFIDENCE</span>
               </div>
               <p className="text-text-muted text-xs mb-2 leading-relaxed">{rec.description}</p>
               {rec.relatedEntities.map(ent => (
                 <span key={ent.entityId} className="inline-block text-[10px] bg-charcoal px-2 py-1 rounded border border-border/50 text-text-dim mr-2">
                   Link: {ent.label} ({ent.entityType})
                 </span>
               ))}
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
               {rec.proposedActions.map(act => (
                 <button 
                    key={act.id} 
                    onClick={() => handleAction(rec, act.id)}
                    className="bg-green-900/20 hover:bg-green-900/40 border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1 flex-1 sm:flex-initial justify-center"
                 >
                   <CheckCircle2 className="w-3 h-3" /> Approve
                 </button>
               ))}
               <button 
                  onClick={() => handleDismiss(rec.id)}
                  className="bg-red-900/10 hover:bg-red-900/30 border border-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1 flex-1 sm:flex-initial justify-center"
               >
                 <XCircle className="w-3 h-3" /> Dismiss
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
