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

// ── CONSUMPTION FILE ─────────────────────────────────────────────────────────
// Columns: Location | Item Code | Item Desc | Qty | Return Qty | MRP | QOH | Category
export function calculateConsumptionKPIs(data) {
  let totalConsumption = 0;
  let totalQOH = 0;

  data.forEach(row => {
    const qty = parseFloat(row['Qty'] || row['QTY'] || 0);
    const ret = parseFloat(row['Return Qty'] || row['ReturnQty'] || 0);
    const qoh = parseFloat(row['QOH'] || row['Qoh'] || 0);
    totalConsumption += Math.max(0, qty - ret);
    totalQOH += qoh;
  });

  const inventoryDays = totalConsumption > 0
    ? ((totalQOH / totalConsumption) * 31).toFixed(1)
    : "0";

  const turnover = totalQOH > 0
    ? (totalConsumption / totalQOH).toFixed(2)
    : "0";

  return { inventoryDays, turnover, totalConsumption, totalQOH };
}

export function getTopItems(data) {
  const itemMap = {};

  data.forEach(row => {
    const name = String(row['Item Desc'] || row['ItemDesc'] || row['Item Name'] || '');
    const qty  = parseFloat(row['Qty'] || 0);
    const ret  = parseFloat(row['Return Qty'] || 0);
    const net  = Math.max(0, qty - ret);
    if (name && net > 0) {
      if (!itemMap[name]) itemMap[name] = 0;
      itemMap[name] += net;
    }
  });

  return Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({
      name: name.length > 28 ? name.substring(0, 28) + '...' : name,
      c: Math.round(qty).toLocaleString(),
      t: (qty / 500).toFixed(2),
      up: true,
    }));
}

// ── PURCHASE FILE ─────────────────────────────────────────────────────────────
// Columns: Vendor | GRN NO | GRN Date | GRN Location | Invoice No | Item Code |
//          Item Name | UOM | BatchNo | ExpireDate | QTY | GRN Amt | Tax Rate | ...
export function calculateHoldingCost(data) {
  let total = 0;
  data.forEach(row => {
    const amt = parseFloat(
      row['GRN Amt'] || row['GRNAmt'] || row['Amt'] || row['Amount'] || 0
    );
    total += amt;
  });
  // Convert to Lakhs
  return (total / 100000).toFixed(2);
}

// ── BOUNCE FILE ───────────────────────────────────────────────────────────────
// Columns: S.No | Date | Hospital No | Name | Age | Doctor Name |
//          Location | OrderCode | OrderDesc | Qty | User | Remarks
export function calculateBounceRate(data, totalPrescriptions) {
  const bounced = data.length;
  // If total prescriptions not provided, estimate (bounce is typically 5-10% of total)
  const total = totalPrescriptions > 0 ? totalPrescriptions : bounced * 12;
  return ((bounced / total) * 100).toFixed(2);
}

export function getBounceAlerts(data) {
  const itemMap = {};
  data.forEach(row => {
    const name = String(row['OrderDesc'] || row['Order Desc'] || row['Drug'] || '');
    if (name && name !== '0') {
      if (!itemMap[name]) itemMap[name] = 0;
      itemMap[name]++;
    }
  });
  return Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}