// BankPulse AI - Bank API Connection Panel
import { useState } from 'react';
import type { BankConfig } from '../data/bankData';
import { ALERT_HISTORY, BRANCHES } from '../data/bankData';

interface BankConnectionProps {
  bankConfig: BankConfig;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  liveMetrics: Record<string, number> | null;
}

const TRANSACTION_TYPES = [
  { label: "UPI", pct: 45, color: "#00d4ff" },
  { label: "NEFT", pct: 20, color: "#00ff88" },
  { label: "RTGS", pct: 15, color: "#7b2fff" },
  { label: "IMPS", pct: 12, color: "#ff8800" },
  { label: "ATM", pct: 8, color: "#ff4444" },
];

const CHANNELS = [
  { label: "Mobile Banking", pct: 52, color: "#00d4ff" },
  { label: "Internet Banking", pct: 28, color: "#00ff88" },
  { label: "Branch", pct: 12, color: "#7b2fff" },
  { label: "ATM", pct: 8, color: "#ff8800" },
];

type TabId = "infrastructure" | "transactions" | "alerts" | "branches";

function TabButton({ id, label, active, onClick }: { id: TabId; label: string; active: boolean; onClick: (id: TabId) => void }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        background: active ? "rgba(0,212,255,0.15)" : "transparent",
        border: active ? "1px solid #00d4ff" : "1px solid #1a2332",
        color: active ? "#00d4ff" : "#7090b0",
        padding: "8px 16px",
        borderRadius: 8,
        fontWeight: active ? 700 : 400,
        fontSize: "0.85em",
        cursor: "pointer"
      }}>
      {label}
    </button>
  );
}

function MiniDonut({ data }: { data: { label: string; pct: number; color: string }[] }) {
  let cumulative = 0;
  const size = 100;
  const r = 35;
  const cx = 50;
  const cy = 50;

  const slices = data.map(d => {
    const startAngle = (cumulative / 100) * 360 - 90;
    cumulative += d.pct;
    const endAngle = (cumulative / 100) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = d.pct > 50 ? 1 : 0;

    return { ...d, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} opacity={0.85} />
      ))}
      <circle cx={cx} cy={cy} r={22} fill="#0d1b2a" />
    </svg>
  );
}

export default function BankConnection({ bankConfig, connected, onConnect, onDisconnect, liveMetrics }: BankConnectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("infrastructure");
  const [connecting, setConnecting] = useState(false);
  const [connectSteps, setConnectSteps] = useState<{ text: string; done: boolean }[]>([]);
  const [apiKey, setApiKey] = useState(bankConfig.api_key);
  const [env, setEnv] = useState<"Production" | "Sandbox">("Production");
  const [scenario, setScenario] = useState("normal");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSev, setAlertSev] = useState("HIGH");
  const [sentAlert, setSentAlert] = useState<{ id: string; pagerduty: string } | null>(null);

  const CONNECTION_STEPS = [
    { pending: "⏳ Validating API credentials...", done: `✅ Credentials valid (${Math.floor(Math.random() * 60) + 20}ms)` },
    { pending: "⏳ Initiating TLS 1.3 handshake...", done: "✅ Encrypted tunnel established (123ms)" },
    { pending: "⏳ OAuth 2.0 authentication...", done: "✅ JWT token issued (89ms)" },
    { pending: `⏳ Connecting to ${bankConfig.name} CBS...`, done: `✅ Core Banking System reached (234ms)` },
    { pending: "⏳ Fetching infrastructure data...", done: "✅ Live metrics streaming (67ms)" },
    { pending: "", done: "✅ SECURE CONNECTION ESTABLISHED!" },
  ];

  const handleConnect = async () => {
    setConnecting(true);
    setConnectSteps([]);
    for (let i = 0; i < CONNECTION_STEPS.length; i++) {
      setConnectSteps(prev => [...prev, { text: CONNECTION_STEPS[i].pending, done: false }]);
      await new Promise(r => setTimeout(r, 700));
      setConnectSteps(prev => prev.map((s, idx) => idx === i ? { text: CONNECTION_STEPS[i].done, done: true } : s));
    }
    await new Promise(r => setTimeout(r, 400));
    setConnecting(false);
    onConnect();
  };

  const handleSendAlert = () => {
    const id = `ALT-${Math.floor(100000 + Math.random() * 900000)}`;
    const pager = `INC-${Math.floor(100000 + Math.random() * 900000)}`;
    setSentAlert({ id, pagerduty: pager });
  };

  if (!connected) {
    return (
      <div style={{ background: "linear-gradient(135deg, #0d1a2e, #0a1520)", border: "1px solid #1a3a5c", borderRadius: 15, padding: "24px", marginBottom: 20 }}>
        <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, marginBottom: 4 }}>🔌 Connect to Bank Core Banking System</div>
        <div style={{ color: "#445566", fontSize: "0.85em", marginBottom: 20 }}>Establish secure API connection to begin live monitoring</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* COL 1: Bank Info */}
          <div>
            <div style={{ color: "#aaccff", fontWeight: 700, marginBottom: 10, fontSize: "0.9em" }}>
              {bankConfig.emoji} {bankConfig.name}
            </div>
            {[
              { icon: "📍", label: "HQ", val: bankConfig.headquarters },
              { icon: "🏢", label: "Branches", val: bankConfig.branches },
              { icon: "🏧", label: "ATMs", val: bankConfig.atms },
              { icon: "👥", label: "Employees", val: bankConfig.employees },
              { icon: "💳", label: "Daily Tx", val: bankConfig.daily_transactions },
              { icon: "💰", label: "Daily Vol", val: bankConfig.daily_volume || "N/A" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontSize: "0.8em" }}>
                <span style={{ color: "#7090b0" }}>{item.icon} {item.label}: </span>
                <span style={{ color: "#aaccff" }}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* COL 2: Settings */}
          <div>
            <div style={{ color: "#aaccff", fontWeight: 700, marginBottom: 10, fontSize: "0.9em" }}>Connection Settings</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 6 }}>Environment</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["Production", "Sandbox"].map(e => (
                  <button key={e} onClick={() => setEnv(e as "Production" | "Sandbox")}
                    style={{
                      background: env === e ? "rgba(0,212,255,0.15)" : "transparent",
                      border: env === e ? "1px solid #00d4ff" : "1px solid #1a2332",
                      color: env === e ? "#00d4ff" : "#7090b0",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: "0.82em",
                      cursor: "pointer",
                      fontWeight: env === e ? 700 : 400
                    }}>{e === "Production" ? "● " : "○ "}{e}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 6 }}>Bank API Key</div>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0d1421",
                  border: "1px solid #1a3f5f",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#aaccff",
                  fontSize: "0.82em",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 6 }}>Simulate Bank Condition</div>
              <select
                value={scenario}
                onChange={e => setScenario(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0d1421",
                  border: "1px solid #1a3f5f",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#aaccff",
                  fontSize: "0.82em"
                }}>
                <option value="normal">Normal</option>
                <option value="salary_day">Salary Day</option>
                <option value="festival">Festival</option>
                <option value="year_end">Year End</option>
                <option value="gst_filing">GST Filing</option>
              </select>
            </div>

            {connecting && connectSteps.length > 0 && (
              <div style={{ background: "#0d1421", borderRadius: 8, padding: "12px", marginTop: 8 }}>
                {connectSteps.map((s, i) => (
                  <div key={i} style={{ color: s.done ? "#00ff88" : "#00d4ff", fontSize: "0.78em", marginBottom: 4 }}>
                    {s.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COL 3: Security */}
          <div>
            <div style={{ color: "#aaccff", fontWeight: 700, marginBottom: 10, fontSize: "0.9em" }}>Security Protocol</div>
            <div style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 10, padding: "14px", marginBottom: 10 }}>
              <div style={{ color: "#00d4ff", fontWeight: 700, fontSize: "0.82em", marginBottom: 8 }}>🔐 Security Protocol</div>
              {[
                "✅ TLS 1.3 Encryption",
                "✅ OAuth 2.0 + JWT Auth",
                "✅ Rate Limit: 1000 req/min",
                "✅ IP Whitelist Active",
                "✅ PCI-DSS Level 1",
                "✅ RBI Compliant",
                "✅ ISO 20022 Standard",
                "✅ Audit Logging ON",
              ].map((item, i) => (
                <div key={i} style={{ color: "#00ff88", fontSize: "0.78em", marginBottom: 3 }}>{item}</div>
              ))}
            </div>
            <div style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 10, padding: "12px" }}>
              <div style={{ color: "#00d4ff", fontWeight: 700, fontSize: "0.78em", marginBottom: 6 }}>📋 Connection Target</div>
              <div style={{ color: "#7090b0", fontSize: "0.75em" }}>{bankConfig.base_url}/api/v2/</div>
              <div style={{ color: "#7090b0", fontSize: "0.75em" }}>Environment: {env}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={connecting}
          style={{
            width: "100%",
            background: connecting ? "#1a2332" : `linear-gradient(135deg, ${bankConfig.color}, ${bankConfig.accent})`,
            border: "none",
            color: "white",
            padding: "16px",
            borderRadius: 10,
            fontWeight: 800,
            fontSize: "1em",
            cursor: connecting ? "not-allowed" : "pointer"
          }}>
          {connecting ? "🔄 Establishing Secure Connection..." : `🔌 ESTABLISH SECURE CONNECTION TO ${bankConfig.name.toUpperCase()}`}
        </button>
      </div>
    );
  }

  /* ===== CONNECTED STATE ===== */
  const infMetrics = liveMetrics || {};

  return (
    <div style={{ marginBottom: 20 }}>
      {/* GREEN BANNER */}
      <div style={{
        background: "rgba(0,255,136,0.08)",
        border: "2px solid #00ff88",
        borderRadius: 10,
        padding: "12px 20px",
        marginBottom: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10
      }}>
        <div style={{ color: "#00ff88", fontWeight: 800 }}>
          🟢 LIVE — Connected to {bankConfig.name} CBS
        </div>
        <div style={{ color: "#7090b0", fontSize: "0.82em" }}>
          Latency: {infMetrics.latency_ms ? `${infMetrics.latency_ms.toFixed(0)}ms` : "38ms"} | TLS 1.3 | Synced: {new Date().toLocaleTimeString()} | {env}
        </div>
        <button onClick={onDisconnect} style={{
          background: "rgba(255,68,68,0.1)",
          border: "1px solid #ff4444",
          color: "#ff4444",
          padding: "6px 16px",
          borderRadius: 8,
          fontSize: "0.82em",
          fontWeight: 700,
          cursor: "pointer"
        }}>🔌 Disconnect</button>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <TabButton id="infrastructure" label="📊 Live Infrastructure" active={activeTab === "infrastructure"} onClick={setActiveTab} />
        <TabButton id="transactions" label="💳 Transaction Intelligence" active={activeTab === "transactions"} onClick={setActiveTab} />
        <TabButton id="alerts" label="🚨 Alert Command Center" active={activeTab === "alerts"} onClick={setActiveTab} />
        <TabButton id="branches" label="🏢 Branch Network" active={activeTab === "branches"} onClick={setActiveTab} />
      </div>

      {/* TAB: INFRASTRUCTURE */}
      {activeTab === "infrastructure" && (
        <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Primary Server Load", val: `${(infMetrics.primary_server_load || 45).toFixed(1)}%`, color: "#ff4444" },
              { label: "Secondary Server Load", val: `${(infMetrics.secondary_server_load || 12).toFixed(1)}%`, color: "#00ff88" },
              { label: "Database Pool Usage", val: `${(infMetrics.database_pool_usage || 40).toFixed(1)}%`, color: "#ffcc00" },
              { label: "Cache Hit Ratio", val: `${(infMetrics.cache_hit_ratio || 87).toFixed(1)}%`, color: "#00d4ff" },
              { label: "Active Connections", val: (infMetrics.active_connections || 8500).toLocaleString(), color: "#bb88ff" },
              { label: "Network Latency", val: `${(infMetrics.network_latency_ms || 38).toFixed(0)}ms`, color: "#00d4ff" },
              { label: "CPU Usage", val: `${(infMetrics.cpu_usage || 42).toFixed(1)}%`, color: "#ff8800" },
              { label: "RAM Usage", val: `${(infMetrics.ram_usage || 38).toFixed(1)}%`, color: "#7b2fff" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 8, padding: "12px", textAlign: "center" }}>
                <div style={{ color: "#556", fontSize: "0.72em", marginBottom: 4 }}>{m.label}</div>
                <div style={{ color: m.color, fontWeight: 900, fontSize: "1.2em" }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ color: "#445566", fontSize: "0.75em", textAlign: "center" }}>
            📡 Live from {bankConfig.name} CBS API | Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* TAB: TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Total Today", val: `${(Math.floor(Math.random() * 3 + 2)).toFixed(1)}M`, color: "#00d4ff" },
              { label: "Success Rate", val: "99.2%", color: "#00ff88" },
              { label: "Avg Value", val: "₹2,500", color: "#7b2fff" },
              { label: "Total Value", val: "₹187 Cr", color: "#ff8800" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#0d1421", borderRadius: 8, padding: "12px", textAlign: "center" }}>
                <div style={{ color: "#556", fontSize: "0.72em", marginBottom: 4 }}>{m.label}</div>
                <div style={{ color: m.color, fontWeight: 900, fontSize: "1.3em" }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* TX TYPE DONUT */}
            <div>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.85em", marginBottom: 10 }}>Transaction Types</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <MiniDonut data={TRANSACTION_TYPES} />
                <div>
                  {TRANSACTION_TYPES.map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.78em" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: t.color, display: "inline-block" }} />
                      <span style={{ color: "#aaccff" }}>{t.label}</span>
                      <span style={{ color: "#556" }}>{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* CHANNEL DONUT */}
            <div>
              <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.85em", marginBottom: 10 }}>Channel Breakdown</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <MiniDonut data={CHANNELS} />
                <div>
                  {CHANNELS.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.78em" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color, display: "inline-block" }} />
                      <span style={{ color: "#aaccff" }}>{c.label}</span>
                      <span style={{ color: "#556" }}>{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALERTS */}
      {activeTab === "alerts" && (
        <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "18px" }}>
          {/* SUMMARY ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "CRITICAL", count: 2, color: "#ff4444" },
              { label: "HIGH", count: 2, color: "#ff8800" },
              { label: "MEDIUM", count: 2, color: "#ffcc00" },
              { label: "LOW", count: 2, color: "#00aaff" },
            ].map((s, i) => (
              <div key={i} style={{ background: `${s.color}15`, border: `1px solid ${s.color}44`, borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ color: s.color, fontWeight: 900, fontSize: "1.5em" }}>{s.count}</div>
                <div style={{ color: s.color, fontSize: "0.72em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ALERT CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {ALERT_HISTORY.map((alert, i) => {
              const borderColor = alert.severity === "CRITICAL" ? "#ff4444" : alert.severity === "HIGH" ? "#ff8800" : alert.severity === "MEDIUM" ? "#ffcc00" : "#00aaff";
              return (
                <div key={i} style={{ background: "#0d1421", borderLeft: `4px solid ${borderColor}`, borderRadius: "0 8px 8px 0", padding: "12px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ background: `${borderColor}22`, border: `1px solid ${borderColor}44`, color: borderColor, padding: "2px 8px", borderRadius: 12, fontSize: "0.7em", fontWeight: 700 }}>
                        {alert.severity}
                      </span>
                      <span style={{ color: "#445566", fontSize: "0.75em" }}>{alert.id}</span>
                    </div>
                    <span style={{ color: "#445566", fontSize: "0.75em" }}>{alert.time}</span>
                  </div>
                  <div style={{ color: "#aaccff", fontSize: "0.85em", marginBottom: 4 }}>{alert.message}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#445566", fontSize: "0.72em" }}>Team: {alert.team}</span>
                    <span style={{
                      color: alert.resolved ? "#00ff88" : "#ff4444",
                      fontSize: "0.72em",
                      fontWeight: 700
                    }}>
                      {alert.resolved ? `✅ Resolved in ${alert.resolution}min` : "🔴 ACTIVE"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SEND ALERT */}
          <div style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 10, padding: "14px" }}>
            <div style={{ color: "#00d4ff", fontWeight: 700, fontSize: "0.85em", marginBottom: 10 }}>📤 Send Alert to IT Team</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, alignItems: "flex-end" }}>
              <select value={alertSev} onChange={e => setAlertSev(e.target.value)}
                style={{ background: "#0a0f1e", border: "1px solid #1a3f5f", borderRadius: 8, padding: "8px", color: "#aaccff", fontSize: "0.82em" }}>
                <option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option>
              </select>
              <input value={alertMsg} onChange={e => setAlertMsg(e.target.value)}
                placeholder="Alert message..."
                style={{ background: "#0a0f1e", border: "1px solid #1a3f5f", borderRadius: 8, padding: "8px 12px", color: "#aaccff", fontSize: "0.82em" }} />
              <button onClick={handleSendAlert}
                style={{ background: "#ff440022", border: "1px solid #ff4444", color: "#ff4444", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: "0.82em", cursor: "pointer" }}>
                Send
              </button>
            </div>
            {sentAlert && (
              <div style={{ color: "#00ff88", fontSize: "0.78em", marginTop: 8 }}>
                ✅ Alert sent | ID: {sentAlert.id} | PagerDuty: {sentAlert.pagerduty} | Response: &lt;5 min
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BRANCHES */}
      {activeTab === "branches" && (
        <div style={{ background: "linear-gradient(135deg,#1a2332,#0d1b2a)", border: "1px solid #2a3f5f", borderRadius: 12, padding: "18px" }}>
          <div style={{ color: "#ff8800", fontSize: "0.85em", marginBottom: 14 }}>
            ⚠️ {BRANCHES.filter(b => b.status !== "Normal").length} of 8 branches experiencing high load
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {BRANCHES.map((b, i) => {
              const loadColor = b.load >= 80 ? "#ff4444" : b.load >= 60 ? "#ffcc00" : "#00ff88";
              const statusColor = b.status === "Overloaded" ? "#ff4444" : b.status === "Busy" ? "#ffcc00" : "#00ff88";
              return (
                <div key={i} style={{ background: "#0d1421", border: `1px solid ${loadColor}33`, borderRadius: 10, padding: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.88em" }}>{b.city}</div>
                      <div style={{ color: "#556", fontSize: "0.72em" }}>{b.name}</div>
                    </div>
                    <span style={{ background: `${statusColor}22`, border: `1px solid ${statusColor}44`, color: statusColor, padding: "2px 8px", borderRadius: 12, fontSize: "0.7em", fontWeight: 700 }}>
                      {b.status}
                    </span>
                  </div>
                  <div style={{ background: "#1a2332", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ width: `${b.load}%`, height: "100%", background: loadColor, borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72em", color: "#445566" }}>
                    <span>Load: {b.load}%</span>
                    <span>Counters: {b.counters}</span>
                    <span>ATM: {b.atm === "Operational" ? "✅" : "🔧"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
