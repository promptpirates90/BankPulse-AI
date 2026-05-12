// BankPulse AI - System Status Bar
import { useEffect, useState } from 'react';
import type { LiveState } from '../store/liveState';

interface SystemStatusProps {
  liveState: LiveState;
  connected: boolean;
  selectedBank: string;
  bankName: string;
}

export default function SystemStatus({ liveState, connected, bankName }: SystemStatusProps) {
  const [uptime] = useState("99.97%");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!connected) {
    return (
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 14,
        padding: "10px 16px",
        background: "#0d1421",
        border: "1px solid #1a2332",
        borderRadius: 10,
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <span style={{ color: "#445566", fontSize: "0.78em" }}>⚫ CBS: NOT CONNECTED</span>
        <span style={{ color: "#1a2332" }}>|</span>
        <span style={{ color: "#445566", fontSize: "0.78em" }}>🏦 Select bank and connect to begin monitoring</span>
        <span style={{ marginLeft: "auto", color: "#445566", fontSize: "0.75em" }}>{time}</span>
      </div>
    );
  }

  const statusItems = [
    {
      label: "CBS",
      value: "CONNECTED",
      color: "#00ff88",
      icon: "🟢"
    },
    {
      label: "BANK",
      value: bankName,
      color: "#00d4ff",
      icon: "🏦"
    },
    {
      label: "PRIMARY",
      value: liveState.failover_active ? "DOWN" : `${liveState.primary_load.toFixed(0)}% LOAD`,
      color: liveState.failover_active ? "#ff4444" : liveState.primary_load >= 80 ? "#ff4444" : liveState.primary_load >= 65 ? "#ffcc00" : "#00ff88",
      icon: liveState.failover_active ? "🔴" : liveState.primary_load >= 80 ? "🟠" : "🟢"
    },
    {
      label: "TX/MIN",
      value: liveState.current_tx.toLocaleString(),
      color: liveState.current_tx >= 20000 ? "#ff4444" : liveState.current_tx >= 5000 ? "#ffcc00" : "#00d4ff",
      icon: "⚡"
    },
    {
      label: "RISK",
      value: `${liveState.risk_score}/100`,
      color: liveState.risk_score >= 70 ? "#ff4444" : liveState.risk_score >= 40 ? "#ffcc00" : "#00ff88",
      icon: liveState.risk_score >= 70 ? "🔴" : liveState.risk_score >= 40 ? "🟡" : "🟢"
    },
    {
      label: "REVENUE RISK",
      value: `₹${liveState.revenue_per_min.toFixed(2)} Cr/min`,
      color: liveState.revenue_per_min >= 5 ? "#ff4444" : liveState.revenue_per_min >= 1 ? "#ffcc00" : "#00ff88",
      icon: "💰"
    },
    {
      label: "UPTIME",
      value: uptime,
      color: "#00ff88",
      icon: "📊"
    },
    {
      label: "FAILOVER",
      value: liveState.failover_active ? "ACTIVE" : "STANDBY",
      color: liveState.failover_active ? "#ff8800" : "#445566",
      icon: liveState.failover_active ? "⚡" : "⏸️"
    }
  ];

  return (
    <div style={{
      display: "flex",
      gap: 0,
      marginBottom: 14,
      background: "#0d1421",
      border: "1px solid #1a3f5f",
      borderRadius: 10,
      overflow: "hidden"
    }}>
      {statusItems.map((item, i) => (
        <div key={i} style={{
          padding: "8px 14px",
          borderRight: "1px solid #1a2332",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 80,
          flex: "0 0 auto"
        }}>
          <div style={{ color: "#445566", fontSize: "0.6em", fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
          <div style={{ color: item.color, fontSize: "0.72em", fontWeight: 800, whiteSpace: "nowrap" }}>
            {item.icon} {item.value}
          </div>
        </div>
      ))}
      <div style={{ marginLeft: "auto", padding: "8px 16px", display: "flex", alignItems: "center" }}>
        <span style={{ color: "#445566", fontSize: "0.72em" }}>{time}</span>
      </div>
    </div>
  );
}
