// BankPulse AI - Historical Crash Analysis
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { HISTORICAL_CRASHES, MONTHLY_CRASHES } from '../data/bankData';

const darkTooltip = { backgroundColor: "#0d1b2a", border: "1px solid #1a3a5f", color: "white" };

function getMonthBarColor(crashes: number) {
  if (crashes >= 4) return "#8b0000";
  if (crashes >= 2) return "#ff4444";
  return "#ff8800";
}

export default function HistoricalAnalysis() {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        📋 Historical Crash Analysis — 2024
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        {/* LEFT: MONTHLY CRASHES CHART */}
        <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "18px" }}>
          <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.9em", marginBottom: 12 }}>Monthly Crash Events Prevented</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_CRASHES} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
              <XAxis dataKey="month" stroke="#445566" tick={{ fontSize: 10, fill: "#aaccff" }} />
              <YAxis stroke="#445566" tick={{ fontSize: 10, fill: "#445566" }} />
              <Tooltip contentStyle={darkTooltip} formatter={(val: unknown) => [String(val), "Crashes Prevented"]} />
              <Bar dataKey="crashes" radius={[4, 4, 0, 0]}>
                {MONTHLY_CRASHES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMonthBarColor(entry.crashes)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 8, padding: "12px", marginTop: 14, textAlign: "center", fontSize: "0.82em" }}>
            <span style={{ color: "#00ff88" }}>✅ BankPulse AI prevented </span>
            <strong style={{ color: "#00ff88" }}>28 crashes</strong>
            <span style={{ color: "#7090b0" }}> in 2024, saving an estimated </span>
            <strong style={{ color: "#00ff88" }}>₹56+ Crores</strong>
            <span style={{ color: "#7090b0" }}> in revenue</span>
          </div>
        </div>

        {/* RIGHT: CRASH EVENTS TABLE */}
        <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "18px" }}>
          <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.9em", marginBottom: 12 }}>Critical Incident Log — Prevented by BankPulse AI</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78em" }}>
              <thead>
                <tr>
                  {["Date", "Event", "Peak Load", "Duration", "Impact", "Status"].map(h => (
                    <th key={h} style={{ color: "#445566", textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #1a2332" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORICAL_CRASHES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #0d1421" }}>
                    <td style={{ padding: "7px 8px", color: "#7090b0" }}>{row.date}</td>
                    <td style={{ padding: "7px 8px", color: "#aaccff" }}>{row.event}</td>
                    <td style={{ padding: "7px 8px", color: row.load >= 95 ? "#ff4444" : "#ff8800", fontWeight: 700 }}>{row.load}%</td>
                    <td style={{ padding: "7px 8px", color: "#aaccff" }}>{row.duration}</td>
                    <td style={{ padding: "7px 8px", color: "#ff8800", fontWeight: 600 }}>{row.impact}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{
                        background: "rgba(0,255,136,0.12)",
                        border: "1px solid rgba(0,255,136,0.4)",
                        color: "#00ff88",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: "0.85em",
                        fontWeight: 700
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SUMMARY STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
            {[
              { val: "28", label: "Total Prevented", color: "#00d4ff" },
              { val: "₹56 Cr+", label: "Revenue Saved", color: "#00ff88" },
              { val: "99.97%", label: "Uptime", color: "#7b2fff" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", background: "#0d1421", borderRadius: 8, padding: "10px" }}>
                <div style={{ color: s.color, fontWeight: 900, fontSize: "1.3em" }}>{s.val}</div>
                <div style={{ color: "#556", fontSize: "0.72em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
