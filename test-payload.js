const userRole = 'Manager';
const item = { data: { name: 'Audit GL Account 11500', actionId: 'Audit GL Account 11500', records: undefined } };
try {
  const records = [
    { title: 'AUTH_VERIFY', subtitle: `Validate ${userRole} token`, value: '200 OK' },
    { title: 'API_DISPATCH', subtitle: `Route to ${String(item.data.name || item.data.title || 'SYS_ACTION').slice(0, 15)}...`, value: '202 ACCEPT' },
    { title: 'DB_COMMIT', subtitle: 'Transaction row locked', value: '1 ROW' },
    ...(Array.isArray(item.data.records) && item.data.records.length > 0
         ? item.data.records.slice(0,5).map(r => ({ title: 'PAYLOAD_MAP', subtitle: r.title || r.name || 'Data Row', value: 'PARSED' })) 
         : item.data.records && Object.keys(item.data.records).length > 0 
           ? Object.entries(item.data.records).slice(0,5).map(([k, v]) => ({ title: 'PAYLOAD_MAP', subtitle: `Object Key: ${k}`, value: 'PARSED' }))
           : [
              { title: 'PARAM_MAPPING', subtitle: `Execution context validated`, value: 'TRUE' },
              { title: 'STATE_MUTATION', subtitle: `Applying matrix transformations`, value: 'SUCCESS' }
             ])
  ];
  console.log('SUCCESS: ', records.length, 'records generated');
} catch(e) { console.error('ERROR:', e.message); }
