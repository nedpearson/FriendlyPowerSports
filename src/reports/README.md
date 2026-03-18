# DealerCommand Reporting Engine

The `ReportRegistry` provides a centralized, decoupled architecture for translating dashboard clicks into native, full-screen data grids with built-in export and pagination.

## How to Add a New Drill-Down-Enabled KPI

To make an existing dashboard metric drillable, wrap its numerical text with the `<DrillDownValue>` component and pass a valid `reportId` registered in `ReportRegistry.js`.

```jsx
import { DrillDownValue } from './DrillDownValue';

<DrillDownValue 
   value="142" 
   label="Stalled Deals" 
   type="Report" // 'Report' forces it to use the full-screen DetailReportView
   onDrillDown={onDrillDown} 
   reportId="CRM_STALLED_DEALS" 
/>
```

## How to Register a New Report

All complex data resolvers must be registered centrally in `src/reports/ReportRegistry.js`.

```javascript
ReportRegistry.register({
   id: 'CRM_STALLED_DEALS',
   title: 'Stalled Opportunities Ledger',
   description: 'All pipeline items languishing greater than 7 days.',
   availableFilters: ['salesperson', 'leadSource', 'status'],
   
   // The resolver must be asynchronous, and supports optional server-side pagination
   datasetResolver: async (payload, filterState) => {
      // 1. Fetch from mock DB or exact backend API
      return myDatabase.filter(deal => deal.daysOld > 7).map(deal => ({
         customer: deal.name,
         daysOld: deal.daysOld,
         gross: `$${deal.projectedGross}` // Format UI representations here
      }));
   }
});
```

## How to Define Columns

The Universal engine uses **dynamic inference** to compile columns. 
The keys returned by your `datasetResolver` map directly to column headers. 
- Use camelCase keys in JS; the table automatically converts `daysOld` to "Days Old".
- Format currencies or percentages as raw strings inside the resolver.

## Export Behavior

`GenericDataTable` handles all UI/UX related to Exporting.
- **Client-Side Mode**: Automatically slices local array states into clean CSVs.
- **Server-Side Mode** (`DetailReportView`): Dispatches requests to `ExportService.handleLargeExport()`.
- **Export Filters**: Automatically honors visible columns (`hiddenColumns` toggle) and dynamic search text `searchTerm`.

**Large Payload Safety:**
If your resolver returns >3,000 rows, `ExportService` automatically slices the payload mapping into micro-chunks and yields to the browser thread using `setTimeout(0)`. This guarantees the UI will never freeze under massive memory load.
