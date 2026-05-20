// Supabase connection — Pharmacy KPI Dashboard
const SUPABASE_URL = "https://xyuxpwjfxocmyzcmqgls.supabase.co";
const SUPABASE_KEY = "sb_publishable_sryPs9KdA8y67T2pcPVUrw_TLIJv_Gm";

const HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

// ── SAVE KPI snapshot for a month ─────────────────────────────────────────────
export async function saveKPISnapshot(data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/kpi_snapshots`, {
    method: "POST",
    headers: { ...HEADERS, "Prefer": "resolution=merge-duplicates" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Save failed: ${err}`);
  }
  return true;
}

// ── GET all KPI snapshots ordered by date ─────────────────────────────────────
export async function getKPIHistory() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/kpi_snapshots?select=*&order=year.asc,uploaded_at.asc`,
    { headers: HEADERS }
  );
  if (!response.ok) throw new Error("Failed to fetch history");
  return await response.json();
}

// ── GET latest KPI snapshot ───────────────────────────────────────────────────
export async function getLatestKPI() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/kpi_snapshots?select=*&order=uploaded_at.desc&limit=1`,
    { headers: HEADERS }
  );
  if (!response.ok) throw new Error("Failed to fetch latest KPI");
  const data = await response.json();
  return data[0] || null;
}

// ── GET last 6 months for trend chart ────────────────────────────────────────
export async function getLast6Months() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/kpi_snapshots?select=*&order=uploaded_at.desc&limit=6`,
    { headers: HEADERS }
  );
  if (!response.ok) throw new Error("Failed to fetch trend data");
  const data = await response.json();
  return data.reverse(); // oldest first for chart
}