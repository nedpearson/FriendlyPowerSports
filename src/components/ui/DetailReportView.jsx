import React, { useState, useEffect } from 'react';
import { DrillDownValue } from './DrillDownValue';
import { GenericDataTable } from './GenericDataTable';
import { ReportRegistry } from '../../reports/ReportRegistry';
import { 
  FileBarChart, ChevronRight, Activity, Calendar, MapPin, Search
} from 'lucide-react';

export const DetailReportView = ({ reportPayload, onNavigate, onDrillDown }) => {
  const [universalData, setUniversalData] = useState([]);
  const [activeRowCount, setActiveRowCount] = useState(0);
  const [totalServerRows, setTotalServerRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleServerStateChange = (pageConfig) => {
    if (!reportPayload?.reportId) {
       setErrorMsg("Invalid reporting context provided. Missing Registry ID.");
       setIsInitialLoad(false);
       return;
    }
    
    setIsLoading(true);
    ReportRegistry.resolveDataset(reportPayload.reportId, reportPayload, { locationId: 'ALL', dateRange: 'MTD' }, pageConfig)
      .then(result => {
        setUniversalData(result.data || []);
        setTotalServerRows(result.totalCount || 0);
        setActiveRowCount(result.totalCount || 0);
        setIsLoading(false);
        setIsInitialLoad(false);
      })
      .catch(err => {
        setErrorMsg(err.message);
        setIsLoading(false);
        setIsInitialLoad(false);
      });
  };

  // BREAK DEADLOCK: Fire initial payload resolution outside of the table's conditionally isolated lifecycle
  useEffect(() => {
      handleServerStateChange({ page: 1, pageSize: 25, sortCol: null, sortDir: 'asc', searchTerm: reportPayload?.searchTerm || '', activeFilters: {} });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportPayload]);

  const getFullExportPayload = () => {
     return ReportRegistry.resolveDataset(reportPayload.reportId, reportPayload, { locationId: 'ALL', dateRange: 'MTD' }); // No pageConfig = returns all
  };

  const def = ReportRegistry.getDefinition(reportPayload?.reportId) || { title: reportPayload?.label || 'Detail Report', description: '' };

  return (
    <div id="report-print-zone" className="flex flex-col h-[calc(100vh-80px)] space-y-4 animate-in fade-in duration-300 bg-black">
      
      {/* Print-Only Corporate Header */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
         <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-3xl font-playfair font-bold text-black">{def.title}</h1>
                 <p className="text-sm text-gray-600 font-mono mt-1">DealerCommand Forensic Reporting Engine</p>
             </div>
             <div className="text-right text-xs font-mono text-gray-500">
                 <div>Report Generated: {new Date().toLocaleString()}</div>
                 <div>Total Records: {totalServerRows}</div>
                 <div>Scope: All Locations | MTD</div>
             </div>
         </div>
      </div>

      {/* Breadcrumbs & Header Section */}
      <div className="bg-charcoal border border-border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
         <div>
            <div className="flex items-center text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
               <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => onNavigate('Dashboard')}>Dashboard</span>
               <ChevronRight className="w-3 h-3 mx-1" />
               <span className="text-white">{def.title}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-playfair text-white flex items-center gap-3">
               <FileBarChart className="w-7 h-7 text-gold" />
               {def.title}
            </h2>
            {def.description && <p className="text-sm text-text-muted mt-1 max-w-2xl">{def.description}</p>}
         </div>

         {/* Active Filters / Scope */}
         <div className="flex flex-wrap gap-2">
            <span className="bg-black border border-border text-text-muted text-xs px-3 py-1.5 rounded flex items-center gap-2">
               <Calendar className="w-3 h-3 text-gold" /> MTD
            </span>
            <span className="bg-black border border-border text-text-muted text-xs px-3 py-1.5 rounded flex items-center gap-2">
               <MapPin className="w-3 h-3 text-gold" /> All Locations
            </span>
         </div>
      </div>

      {/* Summary Cards Row (Optional, driven by data size) */}
      {!isLoading && !errorMsg && universalData && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-charcoal border border-border rounded p-4 flex flex-col justify-center">
               <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Row Density</span>
               <span className="text-3xl font-playfair text-white">{activeRowCount || totalServerRows}</span>
            </div>
            <div className="bg-charcoal border border-border rounded p-4 flex flex-col justify-center">
               <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Report State</span>
               <span className="text-sm font-bold text-green-500 uppercase flex items-center gap-1 mt-1"><Activity className="w-4 h-4" /> Live Registry Connected</span>
            </div>
            <div className="bg-charcoal border border-border rounded p-4 flex flex-col justify-center">
               <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Extracted Target</span>
               <span className="text-sm font-bold text-gold mt-1 break-words">{reportPayload?.label || reportPayload?.reportId}</span>
            </div>
         </div>
      )}

      {/* Main Grid View */}
      {isInitialLoad ? (
         <div className="flex-1 bg-charcoal border border-border rounded flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-10 h-10 rounded-full border-t-2 border-gold animate-spin"></div>
            <div className="text-sm font-mono tracking-widest text-gold uppercase">Resolving Enterprise Dataset...</div>
         </div>
      ) : errorMsg ? (
         <div className="flex-1 bg-charcoal border border-red-500/20 rounded flex items-center justify-center p-12">
            <div className="text-red-500 font-mono text-center">
               <div className="text-lg font-bold mb-2">Resolution Error</div>
               <div>{errorMsg}</div>
            </div>
         </div>
      ) : (
         <div className="flex-1 flex flex-col min-h-0 relative">
            <GenericDataTable 
              data={universalData || []} 
              tableName={def.title} 
              fullScreen={true} 
              availableFilters={def.availableFilters || []}
              onFilteredDataChange={setActiveRowCount}
              formattingRules={def.formattingRules || {}}
              onRowAction={(id, row) => {
                 if (id.startsWith('STK-') || id.startsWith('INV-') || reportPayload?.reportId === 'INV_AGING') {
                     onDrillDown('InventoryUnit', { unitId: id, dataPayload: row });
                 } else {
                     onDrillDown('Action', { name: `Inspect ${id}`, relatedEntities: [{ label: id, entityId: id }], dataPayload: row });
                 }
              }}
              serverSide={true}
              totalServerRows={totalServerRows}
              onServerStateChange={handleServerStateChange}
              getFullExportPayload={getFullExportPayload}
              isLoading={isLoading}
              initialSearchTerm={reportPayload?.searchTerm || ''}
            />
         </div>
      )}

    </div>
  );
};
