// BankPulse AI - Live Ticker Component
import { useEffect, useState } from 'react';

interface LiveTickerProps {
  connected: boolean;
  currentTx: number;
  currentLoad: number;
  scenario: string;
  revenue: number;
}

function generateTickerItems(connected: boolean, tx: number, load: number, scenario: string, revenue: number): string[] {
  if (!connected) {
    return [
      "🔌 BankPulse AI ready — Connect to CBS to begin live monitoring",
      "🏦 Select a bank and click ESTABLISH SECURE CONNECTION",
      "🤖 Gemini AI integration available — Add API key in sidebar",
      "📊 7 banking scenarios simulated with real Indian banking data",
      "⚡ 0.8 second failover time achievable with BankPulse AI"
    ];
  }
  const items = [
    `⚡ Live: ${tx.toLocaleString()} transactions/minute on primary server`,
    `💻 Primary server load: ${load.toFixed(1)}% ${load >= 80 ? "⚠️ CRITICAL" : load >= 65 ? "🟡 WARNING" : "✅ STABLE"}`,
    `💰 Revenue at risk: ₹${revenue.toFixed(2)} Crores/minute`,
    `📊 Event: ${scenario} — BankPulse AI monitoring active`,
    `🔐 TLS 1.3 encrypted CBS connection active`,
    `🎯 AI crash prediction engine ready — Click GET AI PREDICTION`,
    `🌐 8 branches monitored across India — All systems ${load < 65 ? "normal" : "elevated"}`,
    `📡 Real-time sync from Core Banking System API v2.3.1`,
  ];
  if (load >= 80) {
    items.unshift(`🚨 ALERT: Server load at ${load.toFixed(0)}% — Failover recommended!`);
    items.unshift(`💸 ₹${revenue.toFixed(2)} Cr/min at risk — Run AI prediction NOW`);
  }
  return items;
}

export default function LiveTicker({ connected, currentTx, currentLoad, scenario, revenue }: LiveTickerProps) {
  const [items] = useState(() => generateTickerItems(connected, currentTx, currentLoad, scenario, revenue));
  const [displayItems] = useState(generateTickerItems(connected, currentTx, currentLoad, scenario, revenue));
  const [offset, setOffset] = useState(0);

  void items;

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(o => (o + 1) % displayItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayItems.length]);

  const tickerColor = !connected ? "#445566" : currentLoad >= 80 ? "#ff4444" : currentLoad >= 65 ? "#ffcc00" : "#00d4ff";

  return (
    <div style={{
      background: "#0d1421",
      borderTop: `1px solid ${tickerColor}44`,
      borderBottom: `1px solid ${tickerColor}44`,
      padding: "6px 16px",
      marginBottom: 14,
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{
          background: connected ? `${tickerColor}22` : "#1a2332",
          border: `1px solid ${tickerColor}44`,
          color: tickerColor,
          padding: "2px 10px",
          borderRadius: 4,
          fontSize: "0.7em",
          fontWeight: 800,
          flexShrink: 0,
          whiteSpace: "nowrap"
        }}>
          {connected ? "● LIVE FEED" : "○ OFFLINE"}
        </span>
        <div key={offset} style={{
          color: tickerColor,
          fontSize: "0.78em",
          fontWeight: connected && currentLoad >= 80 ? 700 : 400,
          animation: "slideIn 0.4s ease"
        }}>
          {displayItems[offset]}
        </div>
      </div>
    </div>
  );
}
