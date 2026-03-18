import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight, FileSpreadsheet, Columns, Bookmark } from 'lucide-react';
import { ExportService } from '../../reports/ExportService';

export const GenericDataTable = ({ 
  data = [], 
  tableName = "Export Data", 
  fullScreen = false, 
  availableFilters = [], 
  onFilteredDataChange,
  // UX Enhancements
  formattingRules = {},
  onRowAction = null,
  // Server-Side Extensions
  serverSide = false,
  totalServerRows = 0,
  onServerStateChange = null,
  getFullExportPayload = null,
  isLoading = false,
  initialSearchTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(fullScreen ? 25 : 15);
  const [hiddenColumns, setHiddenColumns] = useState(new Set());
  const [showColChooser, setShowColChooser] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [savedViews, setSavedViews] = useState({});
  const colChooserRef = useRef(null);
  const savedViewsRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dealercmd_views_${tableName}`);
      if (stored) setSavedViews(JSON.parse(stored));
    } catch (e) {}
  }, [tableName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colChooserRef.current && !colChooserRef.current.contains(event.target)) {
        setShowColChooser(false);
      }
      if (savedViewsRef.current && !savedViewsRef.current.contains(event.target)) {
        setShowSavedViews(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveCurrentView = () => {
     const viewName = prompt("Enter a name for this custom view:");
     if (!viewName) return;
     const newViews = {
        ...savedViews,
        [viewName]: {
           hiddenColumns: Array.from(hiddenColumns),
           activeFilters,
           searchTerm
        }
     };
     setSavedViews(newViews);
     localStorage.setItem(`dealercmd_views_${tableName}`, JSON.stringify(newViews));
     setShowSavedViews(false);
  };

  const loadView = (viewName) => {
     const view = savedViews[viewName];
     if (!view) return;
     setHiddenColumns(new Set(view.hiddenColumns || []));
     setActiveFilters(view.activeFilters || {});
     setSearchTerm(view.searchTerm || '');
     setShowSavedViews(false);
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Extract unique keys from all rows to ensure comprehensive coverage
    const keySet = new Set();
    data.forEach(row => {
      Object.keys(row).forEach(k => keySet.add(k));
    });
    return Array.from(keySet).map(key => ({
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
    }));
  }, [data]);

  const visibleColumns = useMemo(() => {
     return columns.filter(c => !hiddenColumns.has(c.key));
  }, [columns, hiddenColumns]);

  const filteredAndSortedData = useMemo(() => {
    if (serverSide) return data; // Data arrives pre-sliced from the API

    let result = [...data];

    // 0. Strict Column Filters
    Object.keys(activeFilters).forEach(key => {
       const targetVal = activeFilters[key];
       if (targetVal) {
          result = result.filter(row => String(row[key]) === targetVal);
       }
    });

    // 1. Global Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // 2. Sort
    if (sortCol) {
      result.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return sortDir === 'asc' ? 1 : -1;
        if (valB === null || valB === undefined) return sortDir === 'asc' ? -1 : 1;

        // Try numeric sort first
        const numA = Number(String(valA).replace(/[^0-9.-]+/g,""));
        const numB = Number(String(valB).replace(/[^0-9.-]+/g,""));
        
        if (!isNaN(numA) && !isNaN(numB) && String(valA).match(/\d/) && String(valB).match(/\d/)) {
            return sortDir === 'asc' ? numA - numB : numB - numA;
        }

        // Fallback to string sort
        return sortDir === 'asc' 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, sortCol, sortDir, serverSide, activeFilters]);

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colKey);
      setSortDir('asc');
    }
  };

  // Check state propagation back to host component
  useEffect(() => {
     if (serverSide && onServerStateChange) {
        onServerStateChange({ page: currentPage, pageSize: rowsPerPage, sortCol, sortDir, searchTerm, activeFilters });
     }
  }, [serverSide, currentPage, rowsPerPage, sortCol, sortDir, searchTerm, activeFilters]);

  // Pagination bounds
  const totalRecordCount = serverSide ? totalServerRows : filteredAndSortedData.length;
  const totalPages = Math.ceil(totalRecordCount / rowsPerPage) || 1;
  const currentSafePage = Math.min(currentPage, totalPages);
  
  const paginatedData = useMemo(() => {
    if (serverSide) return data; // Server-side data arrives exactly sized
    const startIdx = (currentSafePage - 1) * rowsPerPage;
    return filteredAndSortedData.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredAndSortedData, currentSafePage, rowsPerPage, serverSide, data]);

  useEffect(() => {
    if (onFilteredDataChange) onFilteredDataChange(filteredAndSortedData.length);
  }, [filteredAndSortedData, onFilteredDataChange]);



  if (!data || data.length === 0) {
     return <div className="p-8 text-center text-text-muted bg-charcoal rounded border border-border">No data available to display.</div>;
  }

  return (
    <div className={`flex flex-col space-y-4 bg-charcoal border border-border rounded shadow-inner p-1 ${fullScreen ? 'h-full flex-1' : ''}`}>
      
      {/* Table Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-black p-4 rounded-t border-b border-border gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-charcoal border border-border text-white text-sm pl-9 pr-3 py-2 rounded focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto relative" ref={colChooserRef}>
          {/* Saved Views Control */}
          <div className="relative" ref={savedViewsRef}>
             <button 
                onClick={() => setShowSavedViews(!showSavedViews)}
                className="text-xs font-bold bg-panel hover:bg-black border border-border text-white px-4 py-2 rounded shadow flex items-center gap-2 transition-all w-full md:w-auto justify-center tracking-wide"
             >
                <Bookmark className="w-3.5 h-3.5 text-gold" /> Views
             </button>
             {showSavedViews && (
                <div className="absolute top-10 right-0 w-56 bg-black border border-border rounded shadow-xl z-50 p-2 max-h-64 overflow-y-auto no-print">
                   <div className="text-[10px] uppercase text-text-muted font-mono tracking-widest mb-2 px-2">Saved Presets</div>
                   {Object.keys(savedViews).length === 0 ? (
                      <div className="text-xs text-text-dim px-2 py-2 italic">No custom views saved.</div>
                   ) : (
                      Object.keys(savedViews).map(vName => (
                         <button 
                           key={vName}
                           onClick={() => loadView(vName)}
                           className="w-full text-left px-2 py-1.5 hover:bg-panel rounded text-xs text-white truncate transition-colors"
                         >
                            {vName}
                         </button>
                      ))
                   )}
                   <div className="border-t border-border mt-2 pt-2">
                       <button 
                         onClick={saveCurrentView}
                         className="w-full text-left px-2 py-1.5 hover:bg-gold hover:text-black rounded text-xs text-gold font-bold transition-colors"
                       >
                          + Save Current View
                       </button>
                   </div>
                </div>
             )}
          </div>

          <button 
             onClick={() => setShowColChooser(!showColChooser)}
             className="text-xs font-bold bg-panel hover:bg-black border border-border text-white px-4 py-2 rounded shadow flex items-center gap-2 transition-all w-full md:w-auto justify-center tracking-wide"
          >
             <Columns className="w-3.5 h-3.5 text-gold" /> Columns
          </button>
          
          {showColChooser && (
              <div className="absolute top-10 right-0 md:right-36 w-48 bg-black border border-border rounded shadow-xl z-50 p-2 max-h-64 overflow-y-auto no-print">
                 <div className="text-[10px] uppercase text-text-muted font-mono tracking-widest mb-2 px-2">Toggle Columns</div>
                 {columns.map(col => (
                    <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-panel rounded cursor-pointer text-xs text-white">
                       <input 
                         type="checkbox" 
                         checked={!hiddenColumns.has(col.key)} 
                         onChange={(e) => {
                            const next = new Set(hiddenColumns);
                            if (e.target.checked) next.delete(col.key);
                            else next.add(col.key);
                            setHiddenColumns(next);
                         }}
                         className="accent-gold cursor-pointer"
                       />
                       <span className="truncate">{col.label}</span>
                    </label>
                 ))}
              </div>
          )}

          <div className="flex bg-panel rounded border border-border shadow overflow-hidden no-print">
             <button 
                onClick={() => {
                   if (serverSide && getFullExportPayload) {
                      ExportService.handleLargeExport(getFullExportPayload, visibleColumns, tableName);
                   } else {
                      ExportService.downloadCSV(filteredAndSortedData, visibleColumns, tableName);
                   }
                }}
                className="text-xs font-bold bg-gold hover:bg-gold-light text-black px-4 py-2 flex items-center gap-2 transition-all uppercase tracking-wide"
             >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
             </button>
             <button 
                onClick={() => ExportService.triggerNativePDF()}
                className="text-xs font-bold hover:bg-black text-white px-4 py-2 flex items-center gap-2 transition-all uppercase tracking-wide border-l border-border hover:text-gold"
             >
                <Download className="w-3.5 h-3.5" /> PDF
             </button>
          </div>
        </div>
      </div>

      {/* Dynamic Filter Bar */}
      {(availableFilters.length > 0 || Object.keys(activeFilters).length > 0) && (
        <div className="flex flex-col gap-3 px-4 pb-4 no-print border-b border-border bg-black">
           <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[10px] uppercase text-text-muted font-mono tracking-widest mr-2">Dimensions:</span>
              {availableFilters.map(filterKey => {
                 const colLabel = columns.find(c => c.key === filterKey)?.label || filterKey;
                 // Extract unique values
                 const uniqueVals = [...new Set(data.filter(r => r[filterKey] !== null && r[filterKey] !== undefined).map(r => String(r[filterKey])))].sort();
                 if (uniqueVals.length === 0) return null;
                 
                 return (
                    <select 
                       key={filterKey}
                       className="bg-panel border border-border text-xs text-white px-2 py-1.5 rounded outline-none focus:border-gold cursor-pointer max-w-[200px] truncate"
                       value={activeFilters[filterKey] || ''}
                       onChange={(e) => {
                          const val = e.target.value;
                          setActiveFilters(prev => {
                             const next = {...prev};
                             if (!val) delete next[filterKey];
                             else next[filterKey] = val;
                             return next;
                          });
                          setCurrentPage(1);
                       }}
                    >
                       <option value="">{colLabel} (All)</option>
                       {uniqueVals.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                 );
              })}
           </div>
           
           {/* Active Filter Chips */}
           {Object.keys(activeFilters).length > 0 && (
              <div className="flex flex-wrap gap-2 items-center mt-1">
                 {Object.entries(activeFilters).map(([key, val]) => {
                    const colLabel = columns.find(c => c.key === key)?.label || key;
                    return (
                       <span key={key} className="bg-gold/10 border border-gold/30 text-gold text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="font-bold">{colLabel}:</span> {val}
                          <button onClick={() => {
                             setActiveFilters(prev => { const next={...prev}; delete next[key]; return next; });
                          }} className="hover:text-white ml-1">&times;</button>
                       </span>
                    );
                 })}
                 <button 
                  onClick={() => setActiveFilters({})}
                  className="text-[10px] text-text-muted hover:text-white underline ml-2"
                 >Clear All</button>
              </div>
           )}
        </div>
      )}
      {/* Responsive Table Wrapper */}
      <div className={`overflow-x-auto overflow-y-auto w-full border-b border-border ${fullScreen ? 'flex-1 min-h-[500px]' : 'max-h-[60vh]'}`}>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-black text-left text-[10px] uppercase font-mono tracking-widest text-text-dim border-b border-border sticky top-0 z-10">
             <tr>
               {visibleColumns.map(col => (
                 <th key={col.key} className="px-4 py-3 font-normal cursor-pointer hover:text-gold transition-colors select-none group relative" onClick={() => handleSort(col.key)}>
                   <div className="flex items-center gap-2">
                     {col.label}
                     {sortCol === col.key && (
                       sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-gold" /> : <ChevronDown className="w-3 h-3 text-gold" />
                     )}
                   </div>
                 </th>
               ))}
               {onRowAction && <th className="px-4 py-3 font-normal w-12 text-center no-print">ACTION</th>}
             </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-charcoal text-sm">
             {paginatedData.map((row, i) => {
               // Quick Actions heuristic: Look for canonical IDs
               const rowIds = Object.values(row).filter(val => typeof val === 'string' && (val.startsWith('DL-') || val.startsWith('STK-') || val.startsWith('EMP-') || val.startsWith('INV-')));
               const primaryId = rowIds.length > 0 ? rowIds[0] : null;

               return (
                 <tr key={i} onClick={() => onRowAction && primaryId && onRowAction(primaryId, row)} className={`hover:bg-panel transition-colors ${onRowAction ? 'cursor-pointer' : ''} ${i % 2 === 0 ? 'bg-charcoal/30' : ''}`}>
                   {visibleColumns.map(col => {
                      let val = row[col.key];
                      if (typeof val === 'object' && val !== null) {
                         val = '[Object]'; // Simplify complex embedded schemas for table view
                      }
                      
                      // Inject conditional formatting rules dynamically
                      let customClasses = "";
                      if (formattingRules[col.key]) {
                         customClasses = formattingRules[col.key](val, row) || "";
                      }

                      return (
                        <td key={col.key} className={`px-4 py-3 max-w-[200px] truncate ${customClasses}`} title={val}>
                          {val === null || val === undefined ? <span className="text-text-dim text-xs">-</span> : String(val)}
                        </td>
                      )
                   })}
                   {onRowAction && (
                      <td className="px-4 py-2 text-center no-print align-middle">
                         {primaryId ? (
                             <button 
                               onClick={() => onRowAction(primaryId, row)}
                               className="text-text-muted hover:text-gold transition-colors p-1"
                               title={`Inspect ${primaryId}`}
                             >
                                <ChevronRight className="w-4 h-4" />
                             </button>
                         ) : <span className="text-text-dim">-</span>}
                      </td>
                   )}
                 </tr>
               );
             })}
            {paginatedData.length === 0 && (
               <tr>
                 <td colSpan={visibleColumns.length + (onRowAction ? 1 : 0)} className="px-4 py-8 text-center text-text-muted text-sm font-mono bg-charcoal">
                    No matching records found.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-black p-4 rounded-b border-t border-border gap-4 no-print">
         <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="uppercase tracking-widest">Rows per page:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-charcoal border border-border text-white px-2 py-1 rounded outline-none focus:border-gold"
            >
               <option value={10}>10</option>
               <option value={15}>15</option>
               <option value={25}>25</option>
               <option value={50}>50</option>
               <option value={100}>100</option>
            </select>
         </div>
         
         <div className="flex items-center gap-4 text-xs">
            {isLoading && <span className="text-gold font-mono animate-pulse">Fetching...</span>}
            <span className="text-text-muted font-mono">
               Global Match: {totalRecordCount} records
            </span>
            <div className="flex items-center gap-1">
               <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentSafePage === 1}
                  className="p-1 rounded bg-charcoal border border-border text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold transition-colors"
               >
                 <ChevronLeft className="w-4 h-4" />
               </button>
               <span className="px-3 text-white font-bold font-mono text-[11px]">{currentSafePage} / {totalPages}</span>
               <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentSafePage === totalPages}
                  className="p-1 rounded bg-charcoal border border-border text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold transition-colors"
               >
                 <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
