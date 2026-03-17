import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { LEADS, INVENTORY, DEALS } from '../../data/mockDatabase';

export const InventoryMatchmakingAgent = {
  id: 'inventory_matchmaking_agent',
  name: 'Inventory Matchmaking Agent',
  description: 'Cross-references active leads to physical inventory tracking to recommend backups, pairings, and prevent aged unit stagnation.',
  supportedRoles: ['Sales Associate', 'General Manager'],
  supportedTriggers: ['APP_BOOT', 'LEAD_CREATED', 'INVENTORY_ADDED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    const recommendations = [];

    // 1. Identify active leads trying to buy a common category
    const buyingLeads = LEADS.filter(l => l.status !== 'Sold' && l.status !== 'Lost');
    
    buyingLeads.forEach(lead => {
      // For this mock logic, if we have standard deals or quotes pending, let's see what inventory category they are looking at
      const relatedDeal = DEALS.find(d => d.leadId === lead.id);
      if (relatedDeal) {
         const attachedUnit = INVENTORY.find(i => i.id === relatedDeal.inventoryId);
         
         if (attachedUnit) {
           // 2. Recommend Backup Unit (Same Category, Similar Price)
           const backups = INVENTORY.filter(i => 
             i.id !== attachedUnit.id && 
             i.category === attachedUnit.category &&
             i.status === 'Active' &&
             i.price && attachedUnit.price && 
             Math.abs(i.price - attachedUnit.price) <= 3000
           );

           if (backups.length > 0) {
             const bestBackup = backups[0]; // Simplest mock logic grabs the first match
             
             recommendations.push(
                RecommendationEngine.generateRecommendation(this, {
                title: `Backup Unit Available: ${bestBackup.year} ${bestBackup.model}`,
                description: `Lead ${lead.id} is working a deal on a ${attachedUnit.model}. If funding falls through, ${bestBackup.stock} is a direct match backup option on the lot.`,
                confidenceScore: 80,
                priority: 'LOW',
                relatedEntities: [ 
                  EntityLinker.createLink('Lead', lead.id, `Lead Data`),
                  EntityLinker.createLink('Inventory', bestBackup.id, `${bestBackup.stock}`)
                ],
                proposedActions: [
                   { id: `ACT-INV-${Date.now()}-1`, actionType: 'NOTIFY_SALES_REP', payload: { empId: lead.empId, unitId: bestBackup.id }, requiresApproval: false, requiredScopes: [] }
                ]
              }, context)
             );
           }
         }
      }
    });

    // 3. Aging Inventory Match -> Lead Mapping
    // Who is looking for units that are aging on our lot?
    const agedInventory = INVENTORY.filter(i => i.ageDays > 60 && i.status === 'Active');
    
    agedInventory.forEach(agedUnit => {
      // In a real system, we'd do NLP matching. Here we just brute-force cross-reference categories.
      // E.g., leads that originated from Campaigns attached to this category (Campaign 3 = Used Inventory for example)
      if (agedUnit.condition === 'Used') {
         const potentialUsedBuyers = LEADS.filter(l => l.sourceId === 'CAMP-3' && l.status !== 'Sold');
         
         if (potentialUsedBuyers.length > 0) {
            recommendations.push(
               RecommendationEngine.generateRecommendation(this, {
               title: `Aged Unit Match: ${agedUnit.year} ${agedUnit.model}`,
               description: `Unit ${agedUnit.stock} is ${agedUnit.ageDays} days old. We have ${potentialUsedBuyers.length} active leads sourced from the Used Inventory campaign. Recommend sending blast.`,
               confidenceScore: 88,
               priority: 'HIGH',
               relatedEntities: [ EntityLinker.createLink('Inventory', agedUnit.id, `Aged Stock`) ],
               proposedActions: [
                  { id: `ACT-INV-${Date.now()}-2`, actionType: 'SEND_SMS_BLAST', payload: { unitId: agedUnit.id, leadIds: potentialUsedBuyers.map(l=>l.id) }, requiresApproval: true, requiredScopes: ['WRITE_MARKETING'] }
               ]
             }, context)
            );
         }
      }
    });

    return recommendations;
  }
};

AgentRegistry.register(InventoryMatchmakingAgent);
