import { AgentLogger } from '../agents/audit/AgentLogger';
import { 
  DEALS, INVENTORY, LEADS, CUSTOMERS, EMPLOYEES, SERVICE_ORDERS, 
  CRM_OPPORTUNITIES, CRM_PREQUAL_APPLICATIONS, CRM_AUDIT_LOGS, LENDERS 
} from '../data/mockDatabase';

/**
 * Global Metadata Map for Dynamic Drilldown Reporting.
 * Provides a highly scalable abstraction layer decoupling rendering from data retrieval.
 */
export const ReportRegistry = {
  /** @type {Map<string, ReportDefinition>} */
  _reports: new Map(),

  /**
   * Registers a new universal report definition into the ecosystem.
   * @param {ReportDefinition} def 
   */
  register(def) {
    if (!def.id || !def.datasetResolver) {
      throw new Error(`[ReportRegistry] Invalid report definition for ID: ${def.id || 'UNKNOWN'}. Must include datasetResolver.`);
    }

    this._reports.set(def.id, {
      title: 'Untitled Report',
      description: 'System-generated analysis bundle.',
      allowedRoles: ['Owner', 'General Manager', 'Finance Manager', 'Employee'], // Default universally open, scoped down internally
      defaultColumns: [],
      formattingRules: {}, // NEW: Declarative conditional CSS rules
      ...def
    });

    // Development logging
    console.debug(`[ReportRegistry] Successfully mounted Report Definition: ${def.id}`);
    return true;
  },

  /**
   * Fetch report metadata for rendering grid headers or access checks.
   * @param {string} id 
   * @returns {ReportDefinition | undefined}
   */
  getDefinition(id) {
    return this._reports.get(id);
  },

  /**
   * Resolves the underlying reporting dataset by executing the definition's fetching rules.
   * Captures an audit telemetry event indicating complex data was unmasked.
   * 
   * @param {string} reportId 
   * @param {DrillDownPayload} payload 
   * @param {ActiveFilterState} filterState 
   * @param {Object} pageConfig - Optional server-side control payload
   * @param {string} userId - Telemetry string mapping back to the executor.
   * @returns {Promise<Array<Record<string, any>> | Object>}
   */
  async resolveDataset(reportId, payload, filterState, pageConfig = null, userId = 'SYSTEM') {
    const report = this.getDefinition(reportId);
    if (!report) {
      throw new Error(`[ReportRegistry] Unknown report ID requested: ${reportId}`);
    }

    try {
      const startMs = Date.now();
      let records = await report.datasetResolver(payload, filterState);
      
      // Provide generic server-side filtering (if requested)
      if (pageConfig && pageConfig.searchTerm) {
          const term = pageConfig.searchTerm.toLowerCase();
          records = records.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(term)));
      }

      // Provide generic server-side sorting (if requested)
      if (pageConfig && pageConfig.sortCol) {
          records.sort((a, b) => {
              const valA = a[pageConfig.sortCol];
              const valB = b[pageConfig.sortCol];
              if (valA === valB) return 0;
              if (pageConfig.sortDir === 'asc') return valA > valB ? 1 : -1;
              return valA < valB ? 1 : -1;
          });
      }

      const latency = Date.now() - startMs;

      // Unmasking Audit logging for regulatory strictness
      AgentLogger.logEvent({
         agentId: 'SYSTEM_REPORT_ENGINE',
         eventType: 'REPORT_DATASET_RESOLVED',
         details: { reportId, recordCount: records.length, filters: filterState, latencyMs: latency, paginated: !!pageConfig },
         userId
      });

      // Simulating API payload structure if pageConfig is present
      if (pageConfig) {
         const skip = ((pageConfig.page || 1) - 1) * (pageConfig.pageSize || 25);
         const slice = records.slice(skip, skip + (pageConfig.pageSize || 25));
         return {
            data: slice,
            totalCount: records.length,
            executionTimeMs: latency
         };
      }

      return records;
    } catch (err) {
      console.error(`[ReportRegistry] Resolution Failed for ${reportId}:`, err);
      // Return synthetic fallback if resolution fails, matching the Phase 17 safety fallback
      return this._generateSyntheticFallback(payload);
    }
  },

  /**
   * Safety catch fallback that generates a tabular matrix out of a scalar KPI.
   * Keeps the drill-down loop safely intact.
   * 
   * @private
   */
  _generateSyntheticFallback(payload) {
    const rawVal = payload?.fallbackValue || '0';
    const isCurrency = String(rawVal).includes('$');
    const records = Array.from({length: 15}).map((_, i) => ({
       id: `REC-FALLBACK-${1000 + i}`,
       timestamp: new Date(Date.now() - (i * 86400000)).toLocaleDateString(),
       context: payload?.metricId || 'Diagnostic Payload',
       attributeVal: isCurrency ? `$${(Math.random() * 500).toFixed(2)}` : Math.floor(Math.random() * 100),
       status: 'Recovered'
    }));
    return records;
  }
};

// --- INITIALIZE PHASE 2 CORE REPORTS ---
ReportRegistry.register({
   id: 'DASHBOARD_REVENUE',
   title: 'Detailed Revenue Ledger (MTD)',
   description: 'Every transaction contributing to the Total Gross Metric.',
   availableFilters: ['manager', 'customer'],
   datasetResolver: async (payload, filterState) => {
      // Simulate database fetch latency
      await new Promise(r => setTimeout(r, 600));
      return Array.from({length: 84}).map((_, i) => ({
         dealId: `DL-${Math.floor(Math.random() * 90000) + 10000}`,
         date: new Date(Date.now() - (i * 36000000)).toLocaleDateString(),
         customer: `Customer ${i+1}`,
         frontGross: `$${(Math.random() * 3000).toFixed(2)}`,
         backGross: `$${(Math.random() * 2000).toFixed(2)}`,
         manager: i % 2 === 0 ? 'Marcus B.' : 'Sarah J.'
      }));
   }
});

ReportRegistry.register({
   id: 'DASHBOARD_UNITS',
   title: 'Retailed Units Registry (MTD)',
   description: 'Chronological log of all metal rolled this month.',
   availableFilters: ['model', 'salesperson', 'status'],
   datasetResolver: async (payload, filterState) => {
      await new Promise(r => setTimeout(r, 450));
      return Array.from({length: 84}).map((_, i) => ({
         stockNum: `STK-${Math.floor(Math.random() * 9000) + 1000}`,
         model: i % 3 === 0 ? 'YZF-R1' : i % 2 === 0 ? 'Sea-Doo Spark' : 'Ranger XP 1000',
         dateSold: new Date(Date.now() - (i * 36000000)).toLocaleDateString(),
         salesperson: `EMP-${(i%5)+1}`,
         status: 'Funded'
      }));
   }
});

// --- PHASE 6 CORE DEALERSHIP REGISTRIES --- 

ReportRegistry.register({
   id: 'SALES_UNITS',
   title: 'Sales Unit Ledger',
   description: 'Chronological log of all sold units.',
   availableFilters: ['status', 'model', 'salesperson'],
   formattingRules: {
      'Front Gross': (val) => Number(val.replace(/[^0-9.-]+/g,"")) > 1500 ? 'text-green-500 font-bold' : '',
      'Back Gross': (val) => Number(val.replace(/[^0-9.-]+/g,"")) > 1000 ? 'text-green-500 font-bold' : '',
      'Status': (val) => val === 'Funded' ? 'text-green-500' : 'text-amber-500'
   },
   datasetResolver: async () => {
      return DEALS.map(d => {
         const emp = EMPLOYEES.find(e => e.id === d.salespersonId);
         const cust = CUSTOMERS.find(c => c.id === d.customerId);
         const inv = INVENTORY.find(i => i.id === d.inventoryId);
         return {
            'Deal ID': d.id,
            'Date': new Date(d.date).toLocaleDateString(),
            'Customer': cust ? cust.name : 'Unknown',
            'Model': inv ? `${inv.year} ${inv.make} ${inv.model}` : 'Unknown Unit',
            'Salesperson': emp ? emp.name : d.salespersonId,
            'Front Gross': `$${d.frontGross.toLocaleString()}`,
            'Back Gross': `$${d.backGross.toLocaleString()}`,
            'Status': d.status
         };
      });
   }
});

ReportRegistry.register({
   id: 'LEAD_SOURCE_CONV',
   title: 'Lead Source Conversion',
   description: 'Tracking lead origins vs. sold outcomes.',
   availableFilters: ['source', 'status', 'salesperson'],
   datasetResolver: async () => {
      return LEADS.map(l => {
         const emp = EMPLOYEES.find(e => e.id === l.empId);
         const cust = CUSTOMERS.find(c => c.id === l.customerId);
         return {
            leadId: l.id,
            dateCreated: new Date(l.createdAt).toLocaleDateString(),
            customer: cust ? cust.name : 'Unknown',
            salesperson: emp ? emp.name : 'Unassigned',
            source: l.sourceId,
            interest: l.unitOfInterest,
            stage: l.stage,
            status: l.status
         };
      });
   }
});

ReportRegistry.register({
   id: 'LEADS_STALLED',
   title: 'Stalled Opportunities',
   description: 'Active pipeline deals with no recent movement.',
   availableFilters: ['stage', 'salesperson'],
   datasetResolver: async () => {
      return CRM_OPPORTUNITIES.filter(o => o.isStalled).map(o => {
         const emp = EMPLOYEES.find(e => e.id === o.repId);
         const cust = CUSTOMERS.find(c => c.id === o.customerId);
         return {
            oppId: o.id,
            customer: cust ? cust.name : 'Unknown',
            salesperson: emp ? emp.name : 'Unassigned',
            stage: o.stage || 'Quote',
            probPct: `${o.probPct}%`,
            estGross: `$${o.estGross.toLocaleString()}`
         };
      });
   }
});

ReportRegistry.register({
   id: 'INV_AGING',
   title: 'Active Inventory Aging Ledger',
   description: 'All units on the ground sorted chronologically by age.',
   availableFilters: ['type', 'make', 'category'],
   formattingRules: {
      'Days Old': (val) => val > 90 ? 'text-red-500 font-bold bg-red-500/10' : val > 60 ? 'text-amber-500 font-bold' : 'text-green-500'
   },
   datasetResolver: async () => {
      const active = INVENTORY.filter(i => i.status !== 'Sold');
      const getMake = (bId) => bId === 'BR-1' ? 'Yamaha' : bId === 'BR-2' ? 'Honda' : bId === 'BR-3' ? 'Polaris' : bId === 'BR-4' ? 'Kawasaki' : 'Unknown';
      return active.map(i => {
         // calculate rough days old based on year relative to now (simulation)
         const days = i.year < 2024 ? 120 + Math.floor(Math.random() * 60) : Math.floor(Math.random() * 45);
         const make = getMake(i.brandId);
         return {
            'Stock #': i.id,
            'Unit': `${i.year} ${make} ${i.model}`,
            'Type': i.type,
            'Category': i.category,
            'Cost': `$${i.cost.toLocaleString()}`,
            'Price': `$${(i.price || 0).toLocaleString()}`,
            'Days Old': days
         };
      }).sort((a,b) => b['Days Old'] - a['Days Old']);
   }
});

ReportRegistry.register({
   id: 'FI_PENETRATION',
   title: 'F&I Product Penetration',
   description: 'Detailed log of auxiliary product attach rates per deal.',
   availableFilters: ['lender', 'financeManager'],
   datasetResolver: async () => {
      return DEALS.map(d => {
         const fIManager = EMPLOYEES.find(e => e.id === d.fiManagerId);
         const lender = LENDERS.find(l => l.id === d.lenderId);
         return {
            dealNo: d.id,
            financeManager: fIManager ? fIManager.name : 'None',
            lender: lender ? lender.name : 'Cash',
            vscSold: d.vscPrice > 0 ? 'Yes' : 'No',
            vscProfit: `$${(d.vscPrice - d.vscCost).toLocaleString()}`,
            gapSold: d.gapPrice > 0 ? 'Yes' : 'No',
            gapProfit: `$${(d.gapPrice - d.gapCost).toLocaleString()}`,
            reserve: `$${d.reserve.toLocaleString()}`
         };
      });
   }
});

ReportRegistry.register({
   id: 'SVC_RO_VOLUME',
   title: 'Service Order Ledger',
   description: 'Comprehensive log of all open and closed ROs.',
   availableFilters: ['status', 'tech', 'type'],
   datasetResolver: async () => {
      return SERVICE_ORDERS.map(ro => {
         const tech = EMPLOYEES.find(e => e.id === ro.techId);
         return {
            roNumber: ro.id,
            opened: new Date(ro.openedAt).toLocaleDateString(),
            tech: tech ? tech.name : 'Unassigned',
            type: ro.type,
            unit: ro.unitDesc,
            status: ro.status
         };
      });
   }
});

ReportRegistry.register({
   id: 'OPS_AUDIT_EVENTS',
   title: 'System Audit Exceptions',
   description: 'Critical compliance and security logging.',
   availableFilters: ['severity', 'module'],
   datasetResolver: async () => {
      return CRM_AUDIT_LOGS.map(log => {
         const user = EMPLOYEES.find(e => e.id === log.userId);
         return {
            eventId: log.id,
            timestamp: new Date(log.timestamp).toLocaleString(),
            user: user ? user.name : 'SYSTEM',
            action: log.action,
            severity: log.severity || 'INFO',
            module: log.module || 'Global'
         };
      });
   }
});

// --- PHASE 10: UNIVERSAL CATCH-ALL LEDGERS ---

ReportRegistry.register({
   id: 'FINANCIAL_LEDGER',
   title: 'Financial Detail Ledger',
   description: 'Comprehensive financial transaction log supporting high-level gross and projection metrics.',
   availableFilters: ['category', 'type', 'status'],
   formattingRules: {
      'Impact': (val) => String(val).includes('-') ? 'text-red-500 font-bold bg-red-500/10' : 'text-green-500 font-bold',
      'Status': (val) => val === 'Realized' ? 'text-green-500' : 'text-amber-500'
   },
   datasetResolver: async () => {
      // Aggregate data from sales and service to simulate a massive financial ledger
      const salesLedger = DEALS.map(d => ({
         'Transaction ID': d.id,
         'Date': new Date(d.date).toLocaleDateString(),
         'Entity': 'Vehicle Sales',
         'Category': 'Front-End Gross',
         'Impact': `$${d.frontGross.toLocaleString()}`,
         'Status': d.status === 'Funded' ? 'Realized' : 'Projected'
      }));
      const backEndLedger = DEALS.map(d => ({
         'Transaction ID': d.id + '-FI',
         'Date': new Date(d.date).toLocaleDateString(),
         'Entity': 'F&I Office',
         'Category': 'Back-End Gross',
         'Impact': `$${d.backGross.toLocaleString()}`,
         'Status': d.status === 'Funded' ? 'Realized' : 'Projected'
      }));
      return [...salesLedger, ...backEndLedger].sort((a,b) => new Date(b.Date) - new Date(a.Date));
   }
});

ReportRegistry.register({
   id: 'EMPLOYEE_PERFORMANCE',
   title: 'Personnel Performance Matrix',
   description: 'Detailed breakdown of employee activities, commissions, and productivity targets.',
   availableFilters: ['role', 'location', 'status'],
   formattingRules: {
      'Commission MTD': (val) => Number(val.replace(/[^0-9.-]+/g,"")) > 4000 ? 'text-green-500 font-bold' : '',
      'Status': (val) => val === 'Clocked In' ? 'text-green-500' : 'text-text-muted'
   },
   datasetResolver: async () => {
      return EMPLOYEES.map(e => ({
         'Employee ID': e.id,
         'Name': e.name,
         'Role': e.role,
         'Location': e.locationId === 'L-001' ? 'Baton Rouge' : e.locationId === 'L-002' ? 'Slidell' : 'Enterprise',
         'Status': e.status === 'active' ? 'Clocked In' : 'Off Duty',
         'Commission MTD': `$${(Math.random() * 8000 + 1000).toFixed(2)}`,
         'Deals Closed': Math.floor(Math.random() * 20),
         'Activity Score': `${(Math.random() * 40 + 60).toFixed(1)}/100`
      }));
   }
});

ReportRegistry.register({
   id: 'OEM_INCENTIVES',
   title: 'OEM Incentive Volume Tracker',
   description: 'Live performance matrix mapping specific deals to factory volume bonuses and holdback reserves.',
   availableFilters: ['brand', 'program', 'status'],
   formattingRules: {
      'Holdback Reserve': (val) => 'text-gold font-bold',
      'Status': (val) => val === 'Eligible' ? 'text-green-500' : 'text-amber-500'
   },
   datasetResolver: async () => {
      // Must import BRANDS if not imported at top, but let's assume it's omitted or we pull it generically.
      // Actually, since BRANDS isn't imported at the top of ReportRegistry.js, we will just use basic mappings.
      const getMake = (bId) => bId === 'BR-1' ? 'Yamaha' : bId === 'BR-2' ? 'Honda' : bId === 'BR-3' ? 'Polaris' : bId === 'BR-4' ? 'Kawasaki' : 'Unknown';

      return INVENTORY.filter(i => i.status === 'Sold').map(i => {
         const deal = DEALS.find(d => d.inventoryId === i.id);
         const make = getMake(i.brandId);
         return {
            'Stock #': i.id,
            'Unit': `${i.year} ${make} ${i.model}`,
            'Brand': make,
            'Sales Date': deal ? new Date(deal.date).toLocaleDateString() : 'N/A',
            'Program': `${make} Q3 Volume Push`,
            'Holdback Reserve': `$${(i.cost * 0.02).toFixed(2)}`,
            'Bonus Accrued': `$${(Math.random() * 400).toFixed(2)}`,
            'Status': deal?.status === 'Funded' ? 'Eligible' : 'Pending Funding'
         };
      });
   }
});
