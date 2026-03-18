import { ReportRegistry } from './src/reports/ReportRegistry.js';

async function test() {
    console.log("Testing INV_AGING purely...");
    const raw = await ReportRegistry.resolveDataset('INV_AGING', {}, {});
    console.log("Raw INV_AGING length:", raw.length);
    if(raw.length > 0) console.log("First item:", raw[0]);

    console.log("\nTesting INV_AGING with config searchTerm 'Yamaha'...");
    const withSearch = await ReportRegistry.resolveDataset('INV_AGING', {}, {}, { searchTerm: 'Yamaha' });
    console.log("Filtered result:", withSearch);
    
    console.log("\nTesting FINANCIAL_LEDGER purely...");
    const fin = await ReportRegistry.resolveDataset('FINANCIAL_LEDGER', {}, {});
    console.log("Raw FINANCIAL_LEDGER length:", fin.length);
}

test().catch(console.error);
