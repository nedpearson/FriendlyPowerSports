/**
 * @file REPORTING_ARCHITECTURE.md
 * 
 * # Friendly PowerSports Reporting & Drill-Down Architecture Map
 * 
 * ## 1. Current System Topology
 * - **Dashboard & KPI Cards**: `src/components/ui/KPICard.jsx` acts as the primary wrapper. KPI values are wrapped in `<DrillDownValue>` components.
 * - **Reporting Routes/Pages**: Handled via conditional rendering in `src/App.jsx` (`activeTab` state switches between `DashboardModule`, `InventoryModule`, `ForensicAnalysisModule`, etc.).
 * - **Charts**: `recharts` is utilized in `App.jsx`. Chart `onClick` events trigger `onDrillDown`.
 * - **Tables/Grids**: `src/components/ui/GenericDataTable.jsx` serves as the universal grid for drilldown expansion, providing pagination and native CSV exports.
 * - **Filters**: Managed globally by `GlobalFilterBar` in `App.jsx` (providing Location and Date Multipliers).
 * - **Role-Based Access**: Application-wide state `currentUser.role` enforces conditional rendering and logic gates.
 * - **Queries/Data Services**: Business logic and data aggregation reside in `src/data/selectors.js`, wrapping raw arrays from `src/data/mockDatabase.js`.
 * - **Drill-Down Logic**: Centralized in `src/components/ui/DrillDownModal.jsx`. Relies on `type` and `data` objects passed from triggers to render contextual overlays.
 * 
 * ## 2. Next-Gen Abstraction Strategy (Universal Reporting)
 * To enforce a scalable "everything is drillable and exportable" paradigm, reports are abstracted into a central registry (`ReportRegistry`).
 * 
 * - **Report Definitions**: Centralized in `src/reports/ReportRegistry.js`.
 * - **Query Building**: Bound to dataset resolvers (`fetchData` methods in the Registry payload).
 * - **Filter Application**: Abstracted into a generic `ExportRequestPayload` inside the drilldown state.
 * - **Exports**: Triggered via `GenericDataTable` or headless export services mapped via the Registry.
 * - **Component Reuse**: `GenericDataTable` and `DrillDownModal` act as the rendering host for all Registry-defined reports.
 * 
 */
