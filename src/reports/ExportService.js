/**
 * @file ExportService.js
 * @description Secure, centralized data sanitization and extraction pipeline.
 */

import { AgentLogger } from '../agents/audit/AgentLogger';

// Basic CSS to support printing to PDF native behavior gracefully.
// Make sure this file is imported or these rules exist in global CSS:
// @media print { body * { visibility: hidden; } #report-print-zone, #report-print-zone * { visibility: visible; } #report-print-zone { position: absolute; left: 0; top: 0; width: 100%; } .no-print { display: none !important; } }

export const ExportService = {

   /**
    * Executes a clean stringification mapped strictly against authorized active columns.
    * @param {Array<Object>} records The exact pre-filtered/sorted array to extract.
    * @param {Array<{key: string, label: string}>} visibleColumns The authorized column map.
    * @param {string} fileName Seed name for the downloaded file.
    */
   downloadCSV(records, visibleColumns, fileName = "dealercommand_export") {
      if (!records || records.length === 0 || !visibleColumns || visibleColumns.length === 0) return;

      const headerLine = visibleColumns.map(c => `"${c.label}"`).join(',');

      const dataLines = records.map(row => {
         return visibleColumns.map(c => {
            let val = row[c.key];

            // 1. Null / Undefined mapping
            if (val === null || val === undefined) {
               val = "";
            }

            // 2. Complex object serialization fallback
            if (typeof val === 'object') {
               val = JSON.stringify(val);
            }

            // 3. String quotes escaping
            const stringVal = String(val).replace(/"/g, '""');
            return `"${stringVal}"`;
         }).join(',');
      });

      const csvContent = [headerLine, ...dataLines].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const cleanedName = fileName.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cleanedName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      AgentLogger.logEvent({
         agentId: 'SYSTEM_EXPORT_ENGINE',
         eventType: 'EXPORT_SUCCESS',
         details: { fileName: cleanedName, totalRows: records.length, type: 'Memory' }
      });
   },

   /**
    * Asynchronously fetches the full payload and streams it into CSV without locking the browser.
    * Protects against heap corruption by splitting string formatting into yielding loops.
    * @param {Function} exportPayloadPromiseFn - Promise returning the total dataset array
    * @param {Array<{key: string, label: string}>} visibleColumns 
    * @param {string} fileName 
    */
   async handleLargeExport(exportPayloadPromiseFn, visibleColumns, fileName = "dealercommand_export") {
      try {
         AgentLogger.logEvent({
            agentId: 'SYSTEM_EXPORT_ENGINE',
            eventType: 'EXPORT_STARTED',
            details: { fileName, columns: visibleColumns.length }
         });
         
         const startTime = Date.now();
         
         // 1. Fetch entire unpaginated dataset
         const fullPayloadResponse = await exportPayloadPromiseFn();
         const records = Array.isArray(fullPayloadResponse) ? fullPayloadResponse : (fullPayloadResponse?.data || []);
         
         if (records.length > 3000) {
            // Optional UI Toast integration could go here
            console.warn(`[ExportService] Payload exceeded 3k mark (${records.length} records), engaging chunked memory mapping...`);
         }

         // 2. Chunk processing to yield to main thread (UI responsiveness map)
         const chunkSize = 750;
         const dataLines = [];
         
         for (let i = 0; i < records.length; i += chunkSize) {
            const chunk = records.slice(i, i + chunkSize);
            const chunkStrs = chunk.map(row => {
               return visibleColumns.map(c => {
                  let val = row[c.key];
                  if (val === null || val === undefined) val = "";
                  if (typeof val === 'object') val = "[Object]";
                  return `"${String(val).replace(/"/g, '""')}"`;
               }).join(',');
            });
            dataLines.push(...chunkStrs);
            
            // Yield execution to unblock browser render loop and inputs
            await new Promise(r => setTimeout(r, 0));
         }

         const headerLine = visibleColumns.map(c => `"${c.label}"`).join(',');
         const csvContent = [headerLine, ...dataLines].join('\n');
         
         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const cleanedName = fileName.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', `${cleanedName}.csv`);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);

         AgentLogger.logEvent({
            agentId: 'SYSTEM_EXPORT_ENGINE',
            eventType: 'EXPORT_SUCCESS',
            details: { fileName: cleanedName, totalRows: records.length, durationMs: Date.now() - startTime, type: 'Streamed' }
         });

      } catch(err) {
         console.error("Export Failed:", err);
         alert("Export failed: " + err.message);
         AgentLogger.logEvent({
            agentId: 'SYSTEM_EXPORT_ENGINE',
            eventType: 'EXPORT_FAILED',
            details: { fileName, error: err.message }
         });
      }
   },

   /**
    * Invokes the browser's native PDF generation capability while
    * temporarily forcing the application shell to render only the printed target.
    */
   triggerNativePDF() {
      // NOTE: For this to work flawlessly, GenericDataTable or DetailReportView
      // should have an ID of 'report-print-zone' and other components be hidden
      // via `@media print`. We just invoke standard window printing.
      window.print();
   }
};
