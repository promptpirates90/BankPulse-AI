// BankPulse AI - Failover Simulation Center
import { useState } from 'react';
import type { LiveState } from '../store/liveState';

interface FailoverSimulationProps {
  liveState: LiveState;
  scenarioName?: string;
  servers: { primary: string; secondary: string; tertiary: string };
  connected: boolean;
  onCrash: () => void;
  onFailover: () => void;
  onRestore: () => void;
}

const ROOT_CAUSES: Record<string, string> = {
  "Salary Day": "DB connection pool overwhelmed by simultaneous salary credits. 52,847 concurrent write operations exceeded PostgreSQL connection limit of 15,000. JVM heap memory at 100%. GC paused all threads.",
  "Year End": "Bulk ITR processing consumed all 32,000 server threads. RTGS settlement queue backed up by 2.1 million transactions. Redis cache eviction rate: 94%. Tomcat thread pool exhausted.",
  "Festival": "UPI payment gateway API timeout rate reached 34%. Razorpay webhook queue: 4.2 million pending. CDN cache miss rate: 89%. Origin server flooded.",
  "GST Filing": "GST portal OAuth token service rate limited. 48,000 simultaneous business auth requests exceeded IDP capacity. SSL handshake queue full.",
  "Flash Sale": "Payment aggregator concurrent session limit hit. Card tokenization service timeout: 78%. Database read replicas 3 seconds behind primary.",
  "Normal": "Unexpected traffic spike detected. Load balancer health check failure. Network partition between primary and replica."
};

const FAILOVER_STEPS = [
  "🔍 Detecting server failure...",
  "📡 Load balancer switching traffic...",
  "🔄 DNS rerouting → secondary server...",
  "🗄️ Database connections migrating...",
  "🔐 SSL certificates transferring...",
  "👥 Active sessions preserving...",
  "🎯 Traffic flowing to secondary...",
  "✅ FAILOVER COMPLETE — 0 data loss!"
];

export default function FailoverSimulation({
  liveState,
  servers,
  connected,
  onCrash,
  onFailover,
  onRestore
}: FailoverSimulationProps) {
  const [failoverSteps, setFailoverSteps] = useState<string[]>([]);
  const [failoverAnimating, setFailoverAnimating] = useState(false);

  const canCrash = liveState.current_load >= 70 || ["Salary Day", "Year End", "Festival", "GST Filing", "Flash Sale"].includes(liveState.scenario);

  const handleFailoverAnimation = async () => {
    if (!connected) return;
    setFailoverAnimating(true);
    setFailoverSteps([]);
    for (let i = 0; i < FAILOVER_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setFailoverSteps(prev => [...prev, FAILOVER_STEPS[i]]);
    }
    await new Promise(r => setTimeout(r, 400));
    setFailoverAnimating(false);
    onFailover();
  };

  const rootCause = ROOT_CAUSES[liveState.scenario] || ROOT_CAUSES["Normal"];

  if (!connected) {
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
          🔄 Failover Simulation Center
        </div>
        <div style={{ background: "#0d1421", borderRadius: 12, padding: "30px", textAlign: "center", color: "#445566" }}>
          <div style={{ fontSize: "2em", marginBottom: 10 }}>🔌</div>
          ⚠️ Failover simulation unavailable until CBS connection is established.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        🔄 Failover Simulation Center
      </div>

      {/* BUTTONS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <button
          onClick={onCrash}
          disabled={liveState.failover_active}
          style={{
            background: "rgba(255,0,0,0.1)",
            border: "2px solid #ff4444",
            color: "#ff4444",
            padding: "14px",
            borderRadius: 10,
            fontWeight: 800,
            fontSize: "1em",
            cursor: liveState.failover_active ? "not-allowed" : "pointer",
            opacity: liveState.failover_active ? 0.5 : 1
          }}>
          🔴 SIMULATE CRASH
        </button>
        <button
          onClick={handleFailoverAnimation}
          disabled={failoverAnimating || liveState.failover_active}
          style={{
            background: "rgba(255,204,0,0.1)",
            border: "2px solid #ffcc00",
            color: "#ffcc00",
            padding: "14px",
            borderRadius: 10,
            fontWeight: 800,
            fontSize: "1em",
            cursor: (failoverAnimating || liveState.failover_active) ? "not-allowed" : "pointer",
            opacity: (failoverAnimating || liveState.failover_active) ? 0.5 : 1
          }}>
          🔄 TRIGGER FAILOVER
        </button>
        <button
          onClick={() => { setFailoverSteps([]); onRestore(); }}
          style={{
            background: "rgba(0,255,136,0.08)",
            border: "2px solid #00ff88",
            color: "#00ff88",
            padding: "14px",
            borderRadius: 10,
            fontWeight: 800,
            fontSize: "1em",
            cursor: "pointer"
          }}>
          ✅ RESTORE SYSTEM
        </button>
      </div>

      {/* CRASH PANEL */}
      {liveState.crash_active && (
        <>
          {!canCrash ? (
            <div style={{ background: "rgba(0,100,200,0.1)", border: "1px solid #0055aa", borderRadius: 12, padding: "20px", marginBottom: 12 }}>
              <div style={{ color: "#4488ff", fontWeight: 700, marginBottom: 8 }}>ℹ️ System Too Stable to Crash!</div>
              <div style={{ color: "#7090b0", fontSize: "0.88em" }}>
                Current load {liveState.current_load.toFixed(0)}% is below danger zone.
                <br />Switch to: 🔴 Salary Day | 📊 Year End | 🎆 Festival or increase Load Override above 80%
              </div>
            </div>
          ) : (
            <div style={{
              background: "#1a0000",
              border: "3px solid #ff0000",
              borderRadius: 12,
              padding: "22px",
              marginBottom: 12,
              animation: "pulse 1.5s infinite"
            }}>
              <div style={{ color: "#ff4444", fontWeight: 900, fontSize: "1.1em", marginBottom: 14 }}>
                ⚠️ 🚨 SIMULATED CRASH — {servers.primary} DOWN
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                {[
                  { label: "Crash Time", val: new Date().toLocaleTimeString() },
                  { label: "Failed Tx", val: Math.floor(liveState.current_tx * 0.85).toLocaleString() },
                  { label: "Affected Users", val: Math.floor(liveState.current_users * 0.9).toLocaleString() },
                  { label: "Revenue/Min", val: `₹${((liveState.current_tx * 0.85 * 2500) / 10000000).toFixed(2)} Cr` },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#200000", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                    <div style={{ color: "#556", fontSize: "0.72em" }}>{m.label}</div>
                    <div style={{ color: "#ff4444", fontWeight: 800, fontSize: "0.95em" }}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#200808", borderRadius: 8, padding: "12px", marginBottom: 12, fontSize: "0.82em", color: "#cc6666", lineHeight: 1.6 }}>
                <strong style={{ color: "#ff4444" }}>Root Cause:</strong> {rootCause}
              </div>
              <div style={{ color: "#ffcc00", fontSize: "0.85em" }}>
                ⚡ Initiating emergency failover to {servers.secondary}... Click TRIGGER FAILOVER
              </div>
            </div>
          )}
        </>
      )}

      {/* FAILOVER ANIMATION */}
      {failoverAnimating && failoverSteps.length > 0 && (
        <div style={{ background: "#0d1421", border: "1px solid #1a3a5f", borderRadius: 12, padding: "20px", marginBottom: 12 }}>
          <div style={{ color: "#00d4ff", fontWeight: 700, marginBottom: 12 }}>🔄 Failover Sequence in Progress...</div>
          {failoverSteps.map((step, i) => (
            <div key={i} style={{
              background: "#0d1b2a",
              borderLeft: `4px solid ${step.includes("✅") ? "#00ff88" : "#00d4ff"}`,
              padding: "8px 16px",
              margin: "4px 0",
              borderRadius: "0 8px 8px 0",
              color: step.includes("✅") ? "#00ff88" : "#aaccff",
              fontSize: "0.85em",
              fontWeight: step.includes("✅") ? 700 : 400,
              animation: "slideIn 0.4s ease"
            }}>
              {step}
            </div>
          ))}
        </div>
      )}

      {/* FAILOVER SUCCESS */}
      {liveState.failover_active && !failoverAnimating && (
        <div style={{
          background: "#001a0d",
          border: "2px solid #00ff88",
          borderRadius: 12,
          padding: "22px",
        }}>
          <div style={{ color: "#00ff88", fontWeight: 900, fontSize: "1.1em", marginBottom: 14 }}>
            ✅ FAILOVER SUCCESSFUL — {servers.secondary} ACTIVE
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Switchover", val: "0.8 seconds" },
              { label: "New Load", val: `${liveState.current_load.toFixed(0)}%` },
              { label: "Traffic", val: "100% Rerouted" },
              { label: "Data Loss", val: "0 transactions" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#002010", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ color: "#445566", fontSize: "0.72em" }}>{m.label}</div>
                <div style={{ color: "#00ff88", fontWeight: 800, fontSize: "0.9em" }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {[
              `✅ DNS rerouted to ${servers.secondary}`,
              `✅ Load balancer rules updated`,
              `✅ Database connection pool reconnected`,
              `✅ Active user sessions preserved`,
              `✅ Zero customer-facing impact`,
              `✅ PagerDuty incident auto-created`,
              `✅ IT team notified via Slack + SMS`,
              `✅ BankPulse AI monitoring ${servers.secondary}`,
              `✅ ${servers.primary} sent for diagnostics`,
              `✅ RBI incident report auto-drafted`,
            ].map((item, i) => (
              <div key={i} style={{ color: "#00ff88", fontSize: "0.78em", padding: "2px 0" }}>{item}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
