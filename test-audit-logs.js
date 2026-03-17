import { getAuditLogs } from './src/data/selectors.js';
console.log('Testing getAuditLogs()');
try {
  const logs = getAuditLogs();
  console.log('Success!', logs.length, 'logs found');
} catch (e) {
  console.error('Crash in getAuditLogs:', e.message);
}
