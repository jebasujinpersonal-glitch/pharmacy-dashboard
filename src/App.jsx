import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const C = {
  primary: "#2B3A8F", bg: "#F0F2F8", white: "#FFFFFF",
  border: "#E2E6F0", text: "#1A2340", muted: "#7A869A",
  green: "#16A34A", red: "#DC2626", orange: "#D97706",
  blue: "#2563EB", purple: "#7C3AED",
};

const trendData = [
  { m: "Dec", d: 68, t: 14, h: 26, b: 14 },
  { m: "Jan", d: 67, t: 18, h: 36, b: 14 },
  { m: "Feb", d: 66, t: 20, h: 44, b: 13 },
  { m: "Mar", d: 67, t: 22, h: 52, b: 13 },
  { m: "Apr", d: 69, t: 21, h: 65, b: 12 },
  { m: "May", d: 64, t: 20, h: 78, b: 11 },
];

const bounceData = [
  { m: "Dec", r: 8.2 }, { m: "Jan", r: 9.1 }, { m: "Feb", r: 7.8 },
  { m: "Mar", r: 6.9 }, { m: "Apr", r: 8.2 }, { m: "May", r: 6.4 },
];

const categoryData = [
  { name: "Medicines",      v: 61.7, amt: "₹1.45 Cr", color: "#2563EB" },
  { name: "Surgical Items", v: 19.1, amt: "₹0.45 Cr", color: "#16A34A" },
  { name: "Consumables",    v: 10.6, amt: "₹0.25 Cr", color: "#D97706" },
  { name: "IV Fluids",      v: 5.1,  amt: "₹0.12 Cr", color: "#7C3AED" },
  { name: "Others",         v: 3.4,  amt: "₹0.08 Cr", color: "#DC2626" },
];

const items = [
  { name: "Paracetamol 650mg",  c: "12,450", t: "12.45", up: true  },
  { name: "Amoxicillin 500mg",  c: "9,875",  t: "9.32",  up: true  },
  { name: "Pantoprazole 40mg",  c: "8,765",  t: "8.91",  up: false },
  { name: "Metformin 500mg",    c: "7,654",  t: "7.85",  up: true  },
  { name: "Atorvastatin 10mg",  c: "6,543",  t: "6.78",  up: true  },
];

const alerts = [
  { e: "⚠️", label: "Low Stock Items",   desc: "23 items below minimum stock",  n: 23, color: "#D97706", bg: "#FEF3C7" },
  { e: "🕐", label: "Near Expiry Items", desc: "18 items expire in 60 days",     n: 18, color: "#EA580C", bg: "#FFF7ED" },
  { e: "📦", label: "Overstock Items",   desc: "15 items are overstocked",        n: 15, color: "#2563EB", bg: "#DBEAFE" },
  { e: "🔴", label: "High Bounce Items", desc: "7 items bounce rate >15%",        n:  7, color: "#DC2626", bg: "#FEE2E2" },
];

const navItems = [
  { icon: "⊞", label: "Overview" },
  { icon: "▣", label: "Inventory Analysis" },
  { icon: "◈", label: "Consumption Analysis" },
  { icon: "⊠", label: "Purchase Analysis" },
  { icon: "◎", label: "Financial Analysis" },
  { icon: "↘", label: "Bounce Analysis" },
  { icon: "🔔", label: "Alerts & Notifications" },
  { icon: "▤", label: "Reports" },
  { icon: "⚙", label: "Settings" },
];

const mobileNav = [
  { icon: "⊞", label: "Overview" },
  { icon: "▣", label: "Inventory" },
  { icon: "◈", label: "Consumption" },
  { icon: "🔔", label: "Alerts" },
  { icon: "▤", label: "Reports" },
];

function Spark({ data, color }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={70} height={28}>
      <LineChart data={d}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function KPICard({ icon, bg, label, value, unit, change, pos, spark, sparkColor }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: "16px",
      border: `1px solid ${C.border}`, flex: "1 1 150px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, lineHeight: 1.2 }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8, lineHeight: 1 }}>
        {value} <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>{unit}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: pos ? C.green : C.red, fontWeight: 600 }}>
          {pos ? "↑" : "↓"} {change} <span style={{ color: C.muted, fontWeight: 400 }}>vs Apr</span>
        </span>
        <Spark data={spark} color={sparkColor} />
      </div>
    </div>
  );
}

function TT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: C.text }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></div>)}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Overview");
  const [sidebar, setSidebar] = useState(true);
  const [upload, setUpload] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebar(false);
      else setSidebar(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: "relative" }}>

      {/* ── SIDEBAR OVERLAY (mobile) ── */}
      {isMobile && sidebar && (
        <div onClick={() => setSidebar(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40
        }} />
      )}

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 220, background: C.primary, display: "flex", flexDirection: "column",
        flexShrink: 0, boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, height: "100vh", zIndex: 50,
        transform: sidebar ? "translateX(0)" : "translateX(-220px)",
        transition: "transform 0.3s ease",
      }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏥</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Hospital Pharmacy</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>KPI Dashboard</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {navItems.map((item) => (
            <div key={item.label} onClick={() => { setPage(item.label); if (isMobile) setSidebar(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 9, marginBottom: 2, cursor: "pointer",
              background: page === item.label ? "rgba(255,255,255,0.18)" : "transparent",
              color: page === item.label ? "#fff" : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: page === item.label ? 700 : 400,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🏛️</div>
            <div>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>City Care Hospital</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Pharmacy Dept</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
              Live · {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: isMobile ? 0 : 0 }}>

        {/* ── TOPBAR ── */}
        <div style={{
          background: C.white, borderBottom: `1px solid ${C.border}`,
          padding: "0 16px", height: 56, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <button onClick={() => setSidebar(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.muted, padding: 4, flexShrink: 0 }}>☰</button>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dashboard Overview</div>
              {!isMobile && <div style={{ fontSize: 11, color: C.muted }}>Real-time monitoring of pharmacy performance indicators</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, flexShrink: 0 }}>
            {!isMobile && (
              <>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: C.text, background: "#fafbff", whiteSpace: "nowrap" }}>
                  📅 01–31 May 2025
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.green, whiteSpace: "nowrap" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />Auto refresh: On
                </div>
              </>
            )}
            <button onClick={() => setUpload(v => !v)} style={{
              background: C.primary, color: "#fff", border: "none",
              borderRadius: 8, padding: isMobile ? "6px 10px" : "6px 14px",
              fontSize: isMobile ? 11 : 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
            }}>
              {isMobile ? "📤" : "📤 Upload CSV"}
            </button>
            <div style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <div style={{ position: "absolute", top: -3, right: -3, width: 13, height: 13, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
              {!isMobile && <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>Pharmacist</div>
                <div style={{ fontSize: 10, color: C.muted }}>Admin</div>
              </div>}
            </div>
          </div>
        </div>

        {/* ── UPLOAD BANNER ── */}
        {upload && (
          <div style={{ background: "#EFF6FF", borderBottom: `1px solid #BFDBFE`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: C.blue, fontWeight: 600 }}>📂 Upload Today's Inventory CSV / Excel</span>
            <input type="file" accept=".csv,.xlsx" style={{ fontSize: 11, flex: 1, minWidth: 0 }} />
            <button onClick={() => setUpload(false)} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Process</button>
            <button onClick={() => setUpload(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        )}

        {/* ── BODY ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "12px" : "20px", display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16, paddingBottom: isMobile ? 70 : 20 }}>

          {/* ── KPI CARDS ── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <KPICard icon="📅" bg="#EEF2FF" label="Inventory Days"     value="64.2" unit="Days" change="5.3"  pos={false} spark={[68,67,66,67,69,64]} sparkColor={C.blue}   />
            <KPICard icon="📈" bg="#ECFDF5" label="Inventory Turnover" value="5.68" unit=""     change="0.45" pos={true}  spark={[14,18,20,22,21,20]} sparkColor={C.green}  />
            <KPICard icon="💰" bg="#FFFBEB" label="Holding Cost"       value="₹18.76" unit="L" change="8.2%" pos={false} spark={[26,36,44,52,65,78]} sparkColor={C.orange} />
            <KPICard icon="🔴" bg="#FFF1F2" label="Bounce Rate"        value="6.42" unit="%"   change="1.8%" pos={true}  spark={[14,14,13,13,12,11]} sparkColor={C.red}    />
            <KPICard icon="📊" bg="#F5F3FF" label="Stock Value"        value="₹2.35" unit="Cr" change="6.7%" pos={true}  spark={[2.1,2.15,2.2,2.25,2.3,2.35]} sparkColor={C.purple} />
          </div>

          {/* ── TREND + DONUT ── */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>

            {/* KPI TREND */}
            <div style={{ flex: "1 1 320px", background: C.white, borderRadius: 12, padding: "18px", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>KPI Trend Overview</span>
                <select style={{ border: `1px solid ${C.border}`, borderRadius: 7, padding: "4px 8px", fontSize: 11, color: C.text, background: "#fafbff" }}>
                  <option>6 Months</option><option>3 Months</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                {[{ color: C.blue, label: "Inv Days" }, { color: C.green, label: "Turnover" }, { color: C.orange, label: "Holding" }, { color: C.red, label: "Bounce" }].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                    <div style={{ width: 16, height: 3, background: l.color, borderRadius: 2 }} />{l.label}
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
                <LineChart data={trendData} margin={{ top: 4, right: 10, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.muted }} />
                  <YAxis tick={{ fontSize: 10, fill: C.muted }} />
                  <Tooltip content={<TT />} />
                  <Line type="monotone" dataKey="d" stroke={C.blue}   strokeWidth={2.5} dot={{ r: 3, fill: C.blue }}   name="Inv Days" />
                  <Line type="monotone" dataKey="t" stroke={C.green}  strokeWidth={2.5} dot={{ r: 3, fill: C.green }}  name="Turnover" />
                  <Line type="monotone" dataKey="h" stroke={C.orange} strokeWidth={2.5} dot={{ r: 3, fill: C.orange }} name="Holding" />
                  <Line type="monotone" dataKey="b" stroke={C.red}    strokeWidth={2.5} dot={{ r: 3, fill: C.red }}    name="Bounce" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* DONUT */}
            <div style={{ flex: "1 1 260px", background: C.white, borderRadius: 12, padding: "18px", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Inventory Value by Category</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0, margin: "0 auto" }}>
                  <ResponsiveContainer width={130} height={130}>
                    <PieChart>
                      <Pie data={categoryData} cx={60} cy={60} innerRadius={42} outerRadius={62} dataKey="v" paddingAngle={2}>
                        {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.muted }}>Total</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.text }}>₹2.35Cr</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, minWidth: 140 }}>
                  {categoryData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, color: C.text }}>{d.name}</span>
                      <span style={{ color: C.muted }}>{d.amt}</span>
                      <span style={{ color: C.muted }}>({d.v}%)</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <div><div style={{ fontSize: 10, color: C.muted }}>Total Items</div><div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>4,782</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: C.muted }}>Active Items</div><div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>4,125 <span style={{ fontSize: 11, color: C.green }}>(86.3%)</span></div></div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>

            {/* TABLE */}
            <div style={{ flex: "1 1 280px", background: C.white, borderRadius: 12, padding: "18px", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Top 5 Fast Moving Items</span>
                <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "4px 8px", fontSize: 11, color: C.muted, cursor: "pointer" }}>View All</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 300 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {["Item Name", "Units", "Turnover", "Trend"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 8px 8px", color: C.muted, fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "8px", color: C.text, fontWeight: 500, whiteSpace: "nowrap" }}>{row.name}</td>
                        <td style={{ padding: "8px", color: C.text, whiteSpace: "nowrap" }}>{row.c}</td>
                        <td style={{ padding: "8px", color: C.text, fontWeight: 600, whiteSpace: "nowrap" }}>{row.t}</td>
                        <td style={{ padding: "8px" }}>
                          <Spark data={row.up ? [3, 4, 5, 5, 6, 7] : [6, 5, 5, 4, 4, 5]} color={row.up ? C.green : C.red} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ALERTS */}
            <div style={{ flex: "1 1 220px", background: C.white, borderRadius: 12, padding: "18px", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Alerts Summary</span>
                <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "4px 8px", fontSize: 11, color: C.muted, cursor: "pointer" }}>View All</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alerts.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, background: a.bg, border: `1px solid ${a.color}22`, cursor: "pointer" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{a.e}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.label}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{a.desc}</div>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: a.color, flexShrink: 0 }}>{a.n}</span>
                    <span style={{ color: C.muted, flexShrink: 0 }}>›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BOUNCE BAR */}
            <div style={{ flex: "1 1 220px", background: C.white, borderRadius: 12, padding: "18px", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Bounce Rate Trend</span>
                <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "4px 8px", fontSize: 11, color: C.muted, cursor: "pointer" }}>View All</button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={bounceData} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.muted }} />
                  <YAxis tick={{ fontSize: 10, fill: C.muted }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={v => [`${v}%`, "Bounce Rate"]} />
                  <Bar dataKey="r" radius={[4, 4, 0, 0]}>
                    {bounceData.map((d, i) => <Cell key={i} fill={d.r > 8 ? "#EF4444" : "#F87171"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "space-around", fontSize: 10, marginTop: 4 }}>
                {bounceData.map((d, i) => (
                  <span key={i} style={{ color: d.r > 8 ? C.red : C.green, fontWeight: 700 }}>{d.r}%</span>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, paddingTop: 4, flexWrap: "wrap", gap: 8 }}>
            <span>© 2025 City Care Hospital · Pharmacy Department</span>
            <div style={{ display: "flex", gap: 14 }}>
              <span>Dashboard v1.0.0</span>
              <span style={{ cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 60,
          background: C.white, borderTop: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-around",
          zIndex: 30, boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
        }}>
          {mobileNav.map((item) => (
            <div key={item.label} onClick={() => setPage(item.label)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              cursor: "pointer", flex: 1, padding: "6px 0",
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 9, color: page === item.label ? C.primary : C.muted, fontWeight: page === item.label ? 700 : 400 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}