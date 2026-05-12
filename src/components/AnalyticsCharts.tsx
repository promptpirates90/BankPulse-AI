// BankPulse AI - Analytics & Trends Charts

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Cell, ResponsiveContainer, BarChart as HBarChart, Bar as HBar
} from 'recharts';
import type { LiveState } from '../store/liveState';

interface AnalyticsChartsProps {
  liveState: LiveState;
  scenarioName: string;
  simHour: number;
  servers: { primary: string; secondary: string; tertiary: string };
  connected: boolean;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

export default function AnalyticsCharts({ liveState, simHour, servers, connected }: AnalyticsChartsProps) {
  const loadData = HOURS.map((h, i) => ({
    time: `${h}:00`,
    load: connected ? (liveState.load_series[i] || 0) : 0,
    isCurrent: h === simHour
  }));

  const txData = HOURS.map((h, i) => ({
    time: `${h}:00`,
    tx: connected ? (liveState.transaction_series[i] || 0) : 0,
    isCurrent: h === simHour
  }));

  const serverData = [
    { server: servers.primary.replace("-PROD", "").replace("-01", " P1"), load: connected ? (liveState.failover_active ? 0 : liveState.primary_load) : 0 },
    { server: servers.secondary.replace("-PROD", "").replace("-02", " P2"), load: connected ? liveState.secondary_load : 0 },
    { server: servers.tertiary.replace("-PROD", "").replace("-03", " P3"), load: connected ? liveState.tertiary_load : 0 },
  ];

  const getBarColor = (tx: number) => {
    if (tx >= 30000) return "#ff4444";
    if (tx >= 15000) return "#ff8800";
    if (tx >= 5000) return "#ffcc00";
    return "#00ff88";
  };

  const getServerBarColor = (load: number) => {
    if (load >= 80) return "#ff4444";
    if (load >= 65) return "#ffcc00";
    return "#00ff88";
  };

  const bgStyle = { background: "rgba(13,27,42,0.8)" };
  const darkTooltip = { backgroundColor: "#0d1b2a", border: "1px solid #1a3a5f", color: "white" };

  const maxTx = Math.max(...txData.map(d => d.tx), 5000);
  const yMaxTx = Math.ceil(maxTx * 1.15 / 5000) * 5000;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        📈 Analytics & Trends
      </div>
      {!connected && (
        <div style={{ textAlign: "center", color: "#445566", padding: "40px", background: "#0d1421", borderRadius: 12, marginBottom: 16 }}>
          📡 Connect to bank server to stream live infrastructure metrics
        </div>
      )}
      {connected && (
        <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 14 }}>
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* SERVER LOAD AREA CHART */}
            <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "16px" }}>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.9em", marginBottom: 12 }}>Server Load by Hour</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={loadData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="criticalZone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ff4444" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
                  <XAxis dataKey="time" stroke="#445566" tick={{ fontSize: 10, fill: "#445566" }} />
                  <YAxis domain={[0, 100]} stroke="#445566" tick={{ fontSize: 10, fill: "#445566" }} />
                  <Tooltip contentStyle={darkTooltip} formatter={(val: unknown) => [`${Number(val).toFixed(1)}%`, "Load"]} />
                  <ReferenceLine y={80} stroke="#ff4444" strokeDasharray="4 4" label={{ value: "⚠️ Critical 80%", fill: "#ff4444", fontSize: 9 }} />
                  <ReferenceLine y={65} stroke="#ffcc00" strokeDasharray="4 4" label={{ value: "Warning 65%", fill: "#ffcc00", fontSize: 9 }} />
                  <ReferenceLine x={`${simHour}:00`} stroke="#ff8800" strokeWidth={2} label={{ value: "NOW", fill: "#ff8800", fontSize: 9 }} />
                  <Area type="monotone" dataKey="load" stroke="#00d4ff" strokeWidth={2} fill="url(#loadGradient)" style={bgStyle} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* TRANSACTIONS BAR CHART */}
            <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "16px" }}>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.9em", marginBottom: 12 }}>Transactions Per Minute</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={txData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
                  <XAxis dataKey="time" stroke="#445566" tick={{ fontSize: 10, fill: "#445566" }} />
                  <YAxis domain={[0, yMaxTx]} stroke="#445566" tick={{ fontSize: 10, fill: "#445566" }}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                  <Tooltip contentStyle={darkTooltip} formatter={(val: unknown) => [Number(val).toLocaleString(), "tx/min"]} />
                  <ReferenceLine y={15000} stroke="#ff8800" strokeDasharray="4 4" label={{ value: "15K Capacity", fill: "#ff8800", fontSize: 9 }} />
                  <Bar dataKey="tx" radius={[3, 3, 0, 0]}>
                    {txData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.tx)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* SERVER COMPARISON */}
            <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "16px" }}>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.9em", marginBottom: 12 }}>Server Load Comparison</div>
              <ResponsiveContainer width="100%" height={180}>
                <HBarChart data={serverData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
                  <XAxis type="number" domain={[0, 100]} stroke="#445566" tick={{ fontSize: 10, fill: "#445566" }} />
                  <YAxis type="category" dataKey="server" stroke="#445566" tick={{ fontSize: 9, fill: "#aaccff" }} width={65} />
                  <Tooltip contentStyle={darkTooltip} formatter={(val: unknown) => [`${Number(val).toFixed(1)}%`, "Load"]} />
                  <ReferenceLine x={80} stroke="#ff4444" strokeDasharray="4 4" />
                  <HBar dataKey="load" radius={[0, 4, 4, 0]}>
                    {serverData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getServerBarColor(entry.load)} />
                    ))}
                  </HBar>
                </HBarChart>
              </ResponsiveContainer>
            </div>

            {/* SUMMARY BOX */}
            <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "16px" }}>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.88em", marginBottom: 12 }}>Load Distribution Summary</div>
              <div style={{ fontSize: "0.82em", lineHeight: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#7090b0" }}>Primary Load</span>
                  <span style={{ color: liveState.primary_load >= 80 ? "#ff4444" : liveState.primary_load >= 65 ? "#ffcc00" : "#00ff88", fontWeight: 700 }}>
                    {liveState.failover_active ? "0%" : `${liveState.primary_load.toFixed(0)}%`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#7090b0" }}>Secondary Load</span>
                  <span style={{ color: liveState.secondary_load >= 80 ? "#ff4444" : "#00ff88", fontWeight: 700 }}>
                    {liveState.secondary_load.toFixed(0)}%
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#7090b0" }}>Tertiary Load</span>
                  <span style={{ color: "#445566", fontWeight: 700 }}>{liveState.tertiary_load.toFixed(0)}%</span>
                </div>
                <div style={{ borderTop: "1px solid #1a2332", paddingTop: 6, marginTop: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7090b0" }}>Risk Score</span>
                    <span style={{ color: liveState.risk_score >= 70 ? "#ff4444" : liveState.risk_score >= 40 ? "#ffcc00" : "#00ff88", fontWeight: 700 }}>
                      {liveState.risk_score}/100
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7090b0" }}>Status</span>
                    <span style={{ color: liveState.failover_active ? "#ff8800" : "#00ff88", fontWeight: 700 }}>
                      {liveState.failover_active ? "FAILOVER ACTIVE" : "MONITORING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RISK SCORE */}
            <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "16px" }}>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.88em", marginBottom: 10 }}>Risk Score</div>
              <div style={{ fontSize: "2.5em", fontWeight: 900, textAlign: "center",
                color: liveState.risk_score >= 70 ? "#ff4444" : liveState.risk_score >= 40 ? "#ffcc00" : "#00ff88",
                marginBottom: 8 }}>
                {liveState.risk_score}<span style={{ fontSize: "0.4em", color: "#556" }}>/100</span>
              </div>
              <div style={{ background: "#0d1421", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${liveState.risk_score}%`,
                  background: liveState.risk_score >= 70 ? "linear-gradient(90deg, #ff4444, #ff0000)" :
                    liveState.risk_score >= 40 ? "linear-gradient(90deg, #ffcc00, #ff8800)" :
                    "linear-gradient(90deg, #00ff88, #00d4ff)",
                  transition: "width 0.5s ease",
                  borderRadius: 6
                }} />
              </div>
              <div style={{ color: "#445566", fontSize: "0.75em", marginTop: 6, textAlign: "center" }}>
                Crash Probability: {liveState.crash_probability}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
