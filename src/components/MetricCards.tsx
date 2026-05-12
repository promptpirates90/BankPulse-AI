// BankPulse AI - Real-Time Metric Cards

import type { LiveState } from '../store/liveState';

interface MetricCardsProps {
  liveState: LiveState;
  primaryServer: string;
  connected: boolean;
}

export default function MetricCards({ liveState, primaryServer, connected }: MetricCardsProps) {
  const { current_tx, current_load, current_users, current_response, revenue_per_min } = liveState;

  const txColor = !connected ? "#556" : current_tx >= 20000 ? "#ff4444" : current_tx >= 5000 ? "#ff8800" : "#00d4ff";
  const txBadge = !connected ? "DISCONNECTED" : current_tx >= 20000 ? "CRITICAL" : current_tx >= 5000 ? "SURGE" : "NORMAL";

  const loadColor = !connected ? "#556" : current_load >= 80 ? "#ff4444" : current_load >= 65 ? "#ffcc00" : "#00ff88";
  const loadBadge = !connected ? "OFFLINE" : current_load >= 80 ? "CRITICAL" : current_load >= 65 ? "WARNING" : "STABLE";

  const userColor = !connected ? "#556" : "#bb88ff";
  const userBadge = !connected ? "DISCONNECTED" : current_users >= 100000 ? "PEAK LOAD" : current_users >= 30000 ? "HIGH" : "NORMAL";

  const respColor = !connected ? "#556" : current_response >= 800 ? "#ff4444" : current_response >= 300 ? "#ffcc00" : "#00ff88";
  const respBadge = !connected ? "OFFLINE" : current_response >= 800 ? "CRITICAL" : current_response >= 300 ? "SLOW" : "FAST";

  const revColor = !connected ? "#556" : revenue_per_min >= 5 ? "#ff4444" : revenue_per_min >= 1 ? "#ffcc00" : "#00ff88";
  const revBadge = !connected ? "DISCONNECTED" : revenue_per_min >= 5 ? "HIGH RISK" : revenue_per_min >= 1 ? "MEDIUM" : "LOW";

  const cards = [
    {
      icon: "⚡",
      label: "Transactions/Min",
      value: !connected ? "—" : current_tx.toLocaleString(),
      sub: "tx/minute",
      color: txColor,
      badge: txBadge,
      badgeColor: txColor,
    },
    {
      icon: "💻",
      label: "Primary Server Load",
      value: !connected ? "—" : `${current_load.toFixed(1)}%`,
      sub: primaryServer,
      color: loadColor,
      badge: loadBadge,
      badgeColor: loadColor,
    },
    {
      icon: "👥",
      label: "Active Users",
      value: !connected ? "—" : current_users >= 1000 ? `${(current_users / 1000).toFixed(1)}K` : current_users.toString(),
      sub: "concurrent users",
      color: userColor,
      badge: userBadge,
      badgeColor: userColor,
    },
    {
      icon: "⏱️",
      label: "Response Time",
      value: !connected ? "—" : `${current_response.toLocaleString()}ms`,
      sub: "API response",
      color: respColor,
      badge: respBadge,
      badgeColor: respColor,
    },
    {
      icon: "💰",
      label: "Revenue at Risk/Min",
      value: !connected ? "—" : `₹${revenue_per_min.toFixed(2)} Cr`,
      sub: "per minute exposure",
      color: revColor,
      badge: revBadge,
      badgeColor: revColor,
    },
  ];

  return (
    <div>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        📊 Real-Time System Metrics
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: connected && card.color !== "#556" 
              ? `linear-gradient(135deg, ${card.color}08, #0d1b2a)` 
              : "linear-gradient(135deg, #1a2332, #0d1b2a)",
            border: `1px solid ${connected ? card.color + "44" : "#1a2332"}`,
            borderRadius: 12,
            padding: "18px 14px",
            textAlign: "center",
            transition: "all 0.4s ease",
            height: 140,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: connected && card.color !== "#556" ? `0 4px 15px ${card.color}15` : "none"
          }}>
            <div style={{ fontSize: "1.3em", marginBottom: 4 }}>{card.icon}</div>
            <div style={{ color: "#7090b0", fontSize: "0.72em", marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: "1.8em", fontWeight: 900, color: card.color, margin: "4px 0", lineHeight: 1.1 }}>{card.value}</div>
            <div style={{ marginTop: 4 }}>
              <span style={{
                background: `${card.badgeColor}15`,
                border: `1px solid ${card.badgeColor}44`,
                color: card.badgeColor,
                padding: "2px 8px",
                borderRadius: 20,
                fontSize: "0.68em",
                fontWeight: 700
              }}>{card.badge}</span>
            </div>
            <div style={{ color: "#445566", fontSize: "0.68em", marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
