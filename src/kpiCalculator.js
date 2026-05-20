import * as XLSX from 'xlsx';

export function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: 0 });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function calculateHoldingCost(purchaseData) {
  let total = 0;
  purchaseData.forEach(row => {
    const amt = parseFloat(row['GRN Amt'] || row['GRNAmt'] || 0);
    total += amt;
  });
  return (total / 100000).toFixed(2);
}

export function calculateConsumptionKPIs(consumptionData) {
  let totalQty = 0;
  let totalQOH = 0;
  let count = 0;
  consumptionData.forEach(row => {
    const qty = parseFloat(row['Qty'] || row['QTY'] || 0);
    const qoh = parseFloat(row['QOH'] || 0);
    const ret = parseFloat(row['Return Qty'] || 0);
    totalQty += (qty - ret);
    totalQOH += qoh;
    count++;
  });
  const avgStock = totalQOH / (count || 1);
  const consumption = totalQty;
  const inventoryDays = consumption > 0
    ? ((avgStock / consumption) * 31).toFixed(1)
    : 0;
  const turnover = avgStock > 0
    ? (consumption / avgStock).toFixed(2)
    : 0;
  return { inventoryDays, turnover, consumption, avgStock };
}

export function calculateBounceRate(bounceData, totalPrescriptions) {
  const bounced = bounceData.length;
  const total = totalPrescriptions || bounced * 15;
  return ((bounced / total) * 100).toFixed(2);
}

export function getTopItems(consumptionData) {
  const itemMap = {};
  consumptionData.forEach(row => {
    const name = row['Item Desc'] || row['ItemDesc'] || 'Unknown';
    const qty = parseFloat(row['Qty'] || 0);
    const ret = parseFloat(row['Return Qty'] || 0);
    if (!itemMap[name]) itemMap[name] = 0;
    itemMap[name] += (qty - ret);
  });
  return Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      consumption: qty.toLocaleString(),
      turnover: (qty / 1000).toFixed(2),
      up: true
    }));
}

export function getBounceAlerts(bounceData) {
  const itemMap = {};
  bounceData.forEach(row => {
    const name = row['OrderDesc'] || 'Unknown';
    if (!itemMap[name]) itemMap[name] = 0;
    itemMap[name]++;
  });
  return Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}