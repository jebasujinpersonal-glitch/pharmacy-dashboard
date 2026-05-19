import { useState, useEffect } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = {
  primary: "#2B3A8F",
  primaryDark: "#1e2d6e",
  primaryLight: "#e8ecf8",
  bg: "#F0F2F8",
  white: "#FFFFFF",
  border: "#E2E6F0",
  text: "#1A2340",
  muted: "#7A869A",
  green: "#16A34A",
  greenBg: "#DCFCE7",
  red: "#DC2626",
  redBg: "#FEE2E2",
  orange: "#D97706",
  orangeBg: "#FEF3C7",
  blue: "#2563EB",
  blueBg: "#DBEAFE",
  purple: "#7C3AED",
  purpleBg: "#EDE9FE",
  teal: "#0D9488",
  tealBg: "#CCFBF1",
};

const trendData = [
  { month: "Dec 2024", invDays: 68, turnover: 14, holding: 26, bounce: 14 },
  { month: "Jan 2025", invDays: 67, turnover: 18, holding: 36, bounce: 14 },
  { month: "Feb 2025", invDays: 66, turnover: 20, holding: 44, bounce: 13 },
  { month: "Mar 2025", invDays: 67, turnover: 22, holding: 52, bounce: 13 },
  { month: "Apr 2025", invDays: 69, turnover: 21, holding: 65, bounce: 12 },
  { month: "May 2025", invDays: 64, turnover: 20, holding: 78, bounce: 11 },
];

const bounceBarData = [
  { month: "Dec 2024", rate: 8.2 },
  { month: "Jan 2025", rate: 9.1 },
  { month: "Feb 2025", rate: 7.8 },
  { month: "Mar 2025", rate: 6.9 },
  { month: "Apr 2025", rate: 8.2 },
  { month: "May 2025", rate: 6.4 },
];

const categoryData = [
  { name: "Medicines",      value: 61.7, amount: "₹ 1.45 Cr", color: "#2563EB" },
  { name: "Surgical Items", value: 19.1, amount: "₹ 0.45 Cr", color: "#16A34A" },
  { name: "Consumables",    value: 10.6, amount: "₹ 0.25 Cr", color: "#D97706" },
  { name: "IV Fluids",      value: 5.1,  amount: "₹ 0.12 Cr", color: "#7C3AED" },
  { name: "Others",         value: 3.4,  amount: "₹ 0.08 Cr", color: "#DC2626" },
];

const fastMoving = [
  { name: "Paracetamol 650mg",  consumption: "12,450", turnover: "12.45", trend: [3,5,4,7,5,8], up: true },
  { name: "Amoxicillin 500mg",  consumption: "9,875",  turnover: "9.32",  trend: [4,4,5,5,6,5], up: true },
  { name: "Pantoprazole 40mg",  consumption: "8,765",  turnover: "8.91",  trend: [5,4,4,5,4,5], up: false },
  { name: "Metformin 500mg",    consumption: "7,654",  turnover: "7.85",  trend: [3,4,3,4,5,4], up: true },
  { name: "Atorvastatin 10mg",  consumption: "6,543",  turnover: "6.78",  trend: [3,3,4,3,4,4], up: true },
];

const alerts = [
  { emoji: "⚠️", label: "Low Stock Items",   desc: "23 items are below minimum stock level",  count: 23, color: COLORS.orange, bg: COLORS.orangeBg },
  { emoji: "🕐", label: "Near Expiry Items", desc: "18 items will expire in next 60 days",     count: 18, color: COLORS.orange, bg: "#FFF7ED" },
  { emoji: "📦", label: "Overstock Items",   desc: "15 items are overstocked",                 count: 15, color: COLORS.blue,   bg: COLORS.blueBg },
  { emoji: "🔴", label: "High Bounce Items", desc: "7 items have bounce rate > 15%",           count: 7,  color: COLORS.red,    bg: COLORS.redBg },
];

const navItems = [
  { icon: "⊞", label: "Overview",              active: true  },
  { icon: "▣", label: "Inventory Analysis",    active: false },
  { icon: "◈", label: "Consumption Analysis",  active: false },
  { icon: "⊠", label: "Purchase Analysis",     active: false },
  { icon: "◎", label: "Financial Analysis",    active: false },
  { icon: "↘", label: "Bounce Analysis",       active: false },
  { icon: "🔔", label: "Alerts & Notifications", active: false },
  { icon: "▤", label: "Reports",               active: false },
  { icon: "⚙", label: "Settings",              active: false },
];

function MiniSparkline({ data, color, up }) {
  const pts = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={pts}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function KPICard({ icon, iconBg, iconColor, label, value, unit, change, vsLabel, positive, sparkData, sparkColor }) {
  const trendColor = positive ? COLORS.green : COLORS.red;
  const arrow = positive ? "↑" : "↓";
  return (
    <div style={{
      background: COLORS.white, borderRadius: 14, padding: "18px 20px",
      border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 160,
      display: "flex", flexDirection: "column", gap: 8,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: iconBg, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18,
        }}>{icon}</div>
        <span style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500, fontFamily: "Georgia, serif" }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, lineHeight: 1, fontFamily: "Georgia, serif" }}>
        {value} <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.muted }}>{unit}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>
          {arrow} {change} <span style={{ color: COLORS.muted, fontWeight: 400 }}>{vsLabel}</span>
        </span>
        <MiniSparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: COLORS.text }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: <b>{p.value}</b></div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [now, setNow] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", background: COLORS.bg, overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? 220 : 0, minWidth: sidebarOpen ? 220 : 0,
        background: COLORS.primary, display: "flex", flexDirection: "column",
        transition: "width 0.3s, min-width 0.3s", overflow: "hidden",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🏥</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Hospital Pharmacy</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>KPI Dashboard</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {navItems.map((item) => (
            <div key={item.label}
              onClick={() => setActivePage(item.label)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, marginBottom: 3,
                background: activePage === item.label ? "rgba(255,255,255,0.18)" : "transparent",
                color: activePage === item.label ? "#fff" : "rgba(255,255,255,0.62)",
                cursor: "pointer", fontSize: 13, fontWeight: activePage === item.label ? 700 : 400,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (activePage !== item.label) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { if (activePage !== item.label) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div style={{ padding: "16px 18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏛️</div>
            <div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>City Care Hospital</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Pharmacy Department</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80" }} />
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Data Last Updated</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2, paddingLeft: 14 }}>
            31 May 2025 &nbsp;{timeStr}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── Top bar ── */}
        <div style={{
          background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 28px", height: 64, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(s => !s)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.muted, padding: 4 }}>☰</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>Dashboard Overview</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>Real-time monitoring of pharmacy performance indicators</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Date range */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, border: `1px solid ${COLORS.border}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.text, background: "#fafbff",
            }}>
              📅 01 May 2025 – 31 May 2025 ▾
            </div>
            {/* Filter */}
            <button onClick={() => setFilterOpen(f => !f)} style={{
              display: "flex", alignItems: "center", gap: 6, border: `1px solid ${COLORS.border}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.text,
              background: "#fafbff", cursor: "pointer",
            }}>⚙ Filter</button>
            {/* Auto refresh */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.green }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green }} />
              Auto refresh: On
            </div>
            {/* Upload */}
            <button onClick={() => setUploadVisible(v => !v)} style={{
              background: COLORS.primary, color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>📤 Upload CSV</button>
            {/* Bell */}
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div style={{
                position: "absolute", top: -4, right: -4, width: 16, height: 16,
                borderRadius: "50%", background: "#EF4444", color: "#fff",
                fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
              }}>3</div>
            </div>
            {/* User */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Pharmacist</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Banner */}
        {uploadVisible && (
          <div style={{
            background: "#EFF6FF", borderBottom: `1px solid #BFDBFE`,
            padding: "12px 28px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, color: COLORS.blue, fontWeight: 600 }}>📂 Upload Today's Inventory CSV</span>
            <input type="file" accept=".csv,.xlsx" style={{ fontSize: 13 }} />
            <button onClick={() => setUploadVisible(false)} style={{
              marginLeft: "auto", background: COLORS.blue, color: "#fff", border: "none",
              borderRadius: 7, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>Process File</button>
            <button onClick={() => setUploadVisible(false)} style={{
              background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 18,
            }}>✕</button>
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── KPI Cards Row ── */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <KPICard icon="📅" iconBg="#EEF2FF" label="Inventory Days"
              value="64.2" unit="Days" change="5.3" vsLabel="vs Apr 2025"
              positive={false} sparkData={[68,67,66,67,69,64]} sparkColor={COLORS.blue} />
            <KPICard icon="〰" iconBg="#ECFDF5" label="Inventory Turnover"
              value="5.68" unit="" change="0.45" vsLabel="vs Apr 2025"
              positive={true} sparkData={[14,18,20,22,21,20]} sparkColor={COLORS.green} />
            <KPICard icon="💰" iconBg="#FFFBEB" label="Holding Cost"
              value="₹ 18.76" unit="L" change="8.2%" vsLabel="vs Apr 2025"
              positive={false} sparkData={[26,36,44,52,65,78]} sparkColor={COLORS.orange} />
            <KPICard icon="🔴" iconBg="#FFF1F2" label="Bounce Rate"
              value="6.42" unit="%" change="1.8%" vsLabel="vs Apr 2025"
              positive={true} sparkData={[14,14,13,13,12,11]} sparkColor={COLORS.red} />
            <KPICard icon="📊" iconBg="#F5F3FF" label="Stock Value"
              value="₹ 2.35" unit="Cr" change="6.7%" vsLabel="vs Apr 2025"
              positive={true} sparkData={[2.1,2.15,2.2,2.25,2.3,2.35]} sparkColor={COLORS.purple} />
          </div>

          {/* ── Middle row: Trend + Donut ── */}
          <div style={{ display: "flex", gap: 20 }}>

            {/* KPI Trend */}
            <div style={{
              flex: 1.4, background: COLORS.white, borderRadius: 14, padding: "22px 24px",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>KPI Trend Overview</span>
                <select style={{
                  border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "5px 12px",
                  fontSize: 13, color: COLORS.text, background: "#fafbff", cursor: "pointer",
                }}>
                  <option>6 Months</option>
                  <option>3 Months</option>
                  <option>12 Months</option>
                </select>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
                {[
                  { color: COLORS.blue,   label: "Inventory Days" },
                  { color: COLORS.green,  label: "Turnover Ratio" },
                  { color: COLORS.orange, label: "Holding Cost (L)" },
                  { color: COLORS.red,    label: "Bounce Rate (%)" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.muted }}>
                    <div style={{ width: 24, height: 3, borderRadius: 2, background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: COLORS.muted }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: COLORS.muted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line yAxisId="left" type="monotone" dataKey="invDays" stroke={COLORS.blue} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.blue }} name="Inventory Days" />
                  <Line yAxisId="right" type="monotone" dataKey="turnover" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.green }} name="Turnover Ratio" />
                  <Line yAxisId="left" type="monotone" dataKey="holding" stroke={COLORS.orange} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.orange }} name="Holding Cost (L)" />
                  <Line yAxisId="right" type="monotone" dataKey="bounce" stroke={COLORS.red} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.red }} name="Bounce Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Inventory by Category */}
            <div style={{
              flex: 1, background: COLORS.white, borderRadius: 14, padding: "22px 24px",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Inventory Value by Category</span>
                <select style={{ border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "5px 10px", fontSize: 12, color: COLORS.text, background: "#fafbff" }}>
                  <option>By Category</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={categoryData} cx={75} cy={75} innerRadius={48} outerRadius={72}
                        dataKey="value" startAngle={90} endAngle={-270} paddingAngle={2}>
                        {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>Total</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>₹ 2.35 Cr</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {categoryData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, color: COLORS.text }}>{d.name}</span>
                      <span style={{ color: COLORS.muted, minWidth: 56, textAlign: "right" }}>{d.amount}</span>
                      <span style={{ color: COLORS.muted, minWidth: 42, textAlign: "right" }}>({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Total Items</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>4,782</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Active Items</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>4,125 <span style={{ fontSize: 13, color: COLORS.green }}>(86.3%)</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div style={{ display: "flex", gap: 20 }}>

            {/* Top 5 Fast Moving */}
            <div style={{
              flex: 1.2, background: COLORS.white, borderRadius: 14, padding: "22px 24px",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Top 5 Fast Moving Items</span>
                <button style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "5px 12px", fontSize: 12, color: COLORS.muted, cursor: "pointer" }}>View All</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                    {["Item Name", "Consumption (Units)", "Turnover", "Trend"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px 10px", color: COLORS.muted, fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fastMoving.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 10px", color: COLORS.text, fontWeight: 500 }}>{row.name}</td>
                      <td style={{ padding: "10px 10px", color: COLORS.text }}>{row.consumption}</td>
                      <td style={{ padding: "10px 10px", color: COLORS.text, fontWeight: 600 }}>{row.turnover}</td>
                      <td style={{ padding: "10px 10px" }}>
                        <MiniSparkline data={row.trend} color={row.up ? COLORS.green : COLORS.red} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alerts Summary */}
            <div style={{
              flex: 1, background: COLORS.white, borderRadius: 14, padding: "22px 24px",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Alerts Summary</span>
                <button style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "5px 12px", fontSize: 12, color: COLORS.muted, cursor: "pointer" }}>View All</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {alerts.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 14px", borderRadius: 10, background: a.bg,
                    border: `1px solid ${a.color}22`, cursor: "pointer",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
                    <span style={{ fontSize: 20 }}>{a.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{a.desc}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: a.color }}>{a.count}</span>
                      <span style={{ fontSize: 14, color: COLORS.muted }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bounce Rate Trend */}
            <div style={{
              flex: 1, background: COLORS.white, borderRadius: 14, padding: "22px 24px",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Bounce Rate Trend</span>
                <button style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "5px 12px", fontSize: 12, color: COLORS.muted, cursor: "pointer" }}>View All</button>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={bounceBarData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: COLORS.muted }}
                    tickFormatter={v => v.replace(" 2024","").replace(" 2025","")} />
                  <YAxis tick={{ fontSize: 10, fill: COLORS.muted }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, "Bounce Rate"]} />
                  <Bar dataKey="rate" fill={COLORS.red} radius={[4, 4, 0, 0]}>
                    {bounceBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.rate > 8 ? "#EF4444" : "#F87171"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.muted, marginTop: 4, paddingTop: 4 }}>
                {bounceBarData.map((d, i) => (
                  <span key={i} style={{ color: d.rate > 8 ? COLORS.red : COLORS.green, fontWeight: 600 }}>{d.rate}%</span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: COLORS.muted, paddingTop: 4 }}>
            <span>© 2025 City Care Hospital · Pharmacy Department</span>
            <div style={{ display: "flex", gap: 20 }}>
              <span>Dashboard v1.0.0</span>
              <span style={{ cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>
              <span style={{ cursor: "pointer", textDecoration: "underline" }}>Terms of Use</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}