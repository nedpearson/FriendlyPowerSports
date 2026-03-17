import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { DEALS, INVENTORY, SERVICE_ORDERS } from '../../data/mockDatabase';

export const PartsProfitAgent = {
  id: 'parts_profit_agent',
  name: 'Parts Profit Agent',
  description: 'Analyzes active deals and service orders to maximize accessory attachment margins and track WIP parts delay bottlenecks.',
  supportedRoles: ['General Manager', 'Owner', 'Service Tech', 'Sales Associate'],
  supportedTriggers: ['APP_BOOT', 'DEAL_UPDATED', 'SERVICE_ORDER_UPDATED'],

  async evaluate(trigger, context) {
    const recommendations = [];

    // 1. High Margin Bundle Opportunity (Front-End Sales)
    const activeDeals = DEALS.filter(d => d.status === 'Approved' || d.status === 'Pending Stips');
    activeDeals.forEach(deal => {
       const unit = INVENTORY.find(i => i.id === deal.inventoryId);
       
       if (unit && unit.category === 'SxS') {
           // SxS models carry high-margin accessory profiles (Roofs, Winches, Audio)
           recommendations.push(
             RecommendationEngine.generateRecommendation(this, {
               title: `Accessory Up-Sell: ${unit.model} Bundle`,
               description: `Deal ${deal.id} is structured for a Side-By-Side. The average SxS buyer attaches $1,200 in accessories. Propose the 'Terrain Bundle' (Roof/Winch).`,
               confidenceScore: 92,
               priority: 'MEDIUM',
               relatedEntities: [ EntityLinker.createLink('Deal', deal.id, `Working Deal`) ],
               proposedActions: [
                  { id: `ACT-PRT-${Date.now()}-1`, actionType: 'ADD_ACCESSORY_QUOTE', payload: { dealId: deal.id, bundle: 'Terrain' }, requiresApproval: false, requiredScopes: [] }
               ]
             }, context)
           );
       }
    });

    // 2. Parts Delay Attention (Impacting Cycle Time)
    const waitingROs = SERVICE_ORDERS.filter(ro => ro.status === 'Waiting Parts');
    waitingROs.forEach(ro => {
        // Calculate age
        const delayMs = Date.now() - new Date(ro.openedAt).getTime();
        const delayDays = delayMs / (1000 * 60 * 60 * 24);

        if (delayDays > 0.5) { // Any RO waiting more than half a day on parts
           recommendations.push(
             RecommendationEngine.generateRecommendation(this, {
               title: `Cycle Time Risk: Parts Delay RO ${ro.id}`,
               description: `Service Order ${ro.id} has been stalled in 'Waiting Parts' for ${delayDays.toFixed(1)} days. Bay utilization is backing up. Expedite requested.`,
               confidenceScore: 98,
               priority: 'URGENT',
               relatedEntities: [ EntityLinker.createLink('ServiceOrder', ro.id, `Stalled RO`) ],
               proposedActions: [
                  { id: `ACT-PRT-${Date.now()}-2`, actionType: 'ESCALATE_TO_PARTS_MGR', payload: { roId: ro.id }, requiresApproval: false, requiredScopes: [] }
               ]
             }, context)
           );
        }
    });

    // 3. Service Parts Up-Sell (Identifying large labor but low parts sale)
    const laborHeavyROs = SERVICE_ORDERS.filter(ro => ro.status === 'In Progress' && ro.type === 'Customer Pay' && ro.laborHoursSold > 3.0 && ro.partsSale < 50);
    laborHeavyROs.forEach(ro => {
        recommendations.push(
             RecommendationEngine.generateRecommendation(this, {
               title: `Service Inspection Up-Sell: RO ${ro.id}`,
               description: `RO ${ro.id} has substantial labor (${ro.laborHoursSold} hrs) but minimal parts attached. Recommend tech inspection for wearables (pads, belts, filters).`,
               confidenceScore: 80,
               priority: 'LOW',
               relatedEntities: [ EntityLinker.createLink('ServiceOrder', ro.id, `Active RO`) ],
               proposedActions: [
                  { id: `ACT-PRT-${Date.now()}-3`, actionType: 'NOTIFY_TECH', payload: { techId: ro.techId, message: "Check wearable items" }, requiresApproval: false, requiredScopes: [] }
               ]
             }, context)
           );
    });

    return recommendations;
  }
};

AgentRegistry.register(PartsProfitAgent);
