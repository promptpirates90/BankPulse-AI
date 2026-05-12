// BankPulse AI - Alert Banner Component

interface AlertBannerProps {
  load: number;
  primaryServer: string;
  secondaryServer: string;
  connected: boolean;
}

export default function AlertBanner({ load, primaryServer, secondaryServer, connected }: AlertBannerProps) {
  if (!connected) {
    return (
      <div style={{
        background: "rgba(0,100,200,0.1)",
        border: "1px solid rgba(0,150,255,0.4)",
        borderRadius: 10,
        padding: "14px 20px",
        marginBottom: 16,
        color: "#4488ff",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: "0.9em"
      }}>
        <span>🔌</span>
        <span>Connect to Core Banking System to begin live infrastructure monitoring. Metrics are paused until connection is established.</span>
      </div>
    );
  }

  if (load >= 90) {
    return (
      <div style={{
        background: "#200000",
        border: "2px solid #ff0000",
        borderRadius: 10,
        padding: "16px 24px",
        marginBottom: 16,
        animation: "pulse 1.5s infinite"
      }}>
        <div style={{ color: "#ff4444", fontWeight: 900, fontSize: "1em", marginBottom: 4 }}>
          🚨 CRITICAL: PRIMARY SERVER DOWN! EMERGENCY FAILOVER ACTIVATED!
        </div>
        <div style={{ color: "#ff8888", fontSize: "0.88em" }}>
          {primaryServer} → OFFLINE &nbsp;|&nbsp; Switching to {secondaryServer}...
        </div>
      </div>
    );
  }
  if (load >= 80) {
    return (
      <div style={{
        background: "rgba(255,68,0,0.1)",
        border: "2px solid #ff4400",
        borderRadius: 10,
        padding: "16px 24px",
        marginBottom: 16,
        animation: "pulse 1.5s infinite"
      }}>
        <div style={{ color: "#ff6633", fontWeight: 800, fontSize: "1em", marginBottom: 4 }}>
          ⚠️ OVERLOAD DETECTED — Auto-switching servers!
        </div>
        <div style={{ color: "#cc8855", fontSize: "0.88em" }}>
          {primaryServer} load at {load.toFixed(0)}% — Activating {secondaryServer} now...
        </div>
      </div>
    );
  }
  if (load >= 65) {
    return (
      <div style={{
        background: "rgba(255,204,0,0.08)",
        border: "1px solid rgba(255,204,0,0.5)",
        borderRadius: 10,
        padding: "14px 20px",
        marginBottom: 16,
        color: "#ffcc00",
        fontSize: "0.9em"
      }}>
        🟡 CAUTION: Load at {load.toFixed(0)}% — {secondaryServer} warming up... Monitoring closely.
      </div>
    );
  }
  return (
    <div style={{
      background: "rgba(0,255,136,0.06)",
      border: "1px solid rgba(0,255,136,0.35)",
      borderRadius: 10,
      padding: "14px 20px",
      marginBottom: 16,
      color: "#00ff88",
      fontSize: "0.9em"
    }}>
      ✅ ALL SYSTEMS STABLE — Load: {load.toFixed(0)}% — {primaryServer} operating normally. No action required.
    </div>
  );
}
