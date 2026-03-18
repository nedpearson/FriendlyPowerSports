/**
 * @file types.js
 * @description Core Domain Models for the Universal Drill-Down Reporting Engine
 */

/**
 * @typedef {Object} DrillDownPayload
 * @property {string} reportId - The unique identifier of the target report definition.
 * @property {string} [metricId] - The unique identifier of the specific metric clicked (e.g., 'total_gross').
 * @property {Record<string, any>} [context] - Key-Value pair of the specific slice clicked (e.g., { salespersonId: 'EMP-1', location: 'LOC-1' }).
 * @property {string} [fallbackValue] - The raw string value clicked, used to generate synthetic tables if the resolver fails.
 * @property {string} [label] - Human readable breadcrumb title.
 */

/**
 * @typedef {Object} ActiveFilterState
 * @property {string} globalSearch - User inputted text matching across row cells.
 * @property {string} locationId - The currently scoped physical dealership location.
 * @property {string} dateRange - The currently scoped time boundary (e.g., 'MTD', 'QTD', 'YTD').
 * @property {Record<string, any>} [customFilters] - Any report-specific dimension filters.
 */

/**
 * @typedef {Object} ExportRequestPayload
 * @property {string} reportId - Target report to export.
 * @property {string} exportFormat - 'CSV' | 'PDF'
 * @property {ActiveFilterState} filterState - The active filters bounding the dataset.
 * @property {Object} sortState - The requested order.
 * @property {string} sortState.columnKey
 * @property {'asc'|'desc'} sortState.direction
 * @property {string[]} visibleColumns - Explicit array of keys to include in the export output.
 * @property {Object} [scope] - Security/Role scope wrapper.
 * @property {string} scope.userRole - The execution context role.
 * @property {string} scope.userId - Execution tracking ID.
 */

/**
 * @typedef {Object} ReportDefinition
 * @property {string} id - Unique report string (e.g., 'SALES_BY_REP').
 * @property {string} title - Human readable display title.
 * @property {string} [description] - Subtext explanation.
 * @property {string[]} allowedRoles - Array of roles permitted to view/export the dataset (e.g., ['Owner', 'General Manager']).
 * @property {Array<{key: string, label: string, type?: 'currency'|'number'|'date'|'string'}>} defaultColumns - Predefined table structure.
 * @property {function(DrillDownPayload, ActiveFilterState): Promise<Array<Record<string, any>>>} datasetResolver - Async function that queries mockDatabase/services.
 * @property {function(Array<Record<string, any>>, ExportRequestPayload): Promise<Blob>} [exportOverride] - Optional custom export formatter (defaults to generic CSV).
 */

/**
 * @typedef {Object} BreadcrumbModel
 * @property {string} id - Unique nav level ID.
 * @property {string} label - Display string.
 * @property {DrillDownPayload} payload - Reversal state payload to jump back.
 */

export {};
