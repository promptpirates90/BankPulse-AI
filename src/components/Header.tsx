// BankPulse AI - Header Component
import { useEffect, useState } from 'react';
import { SCENARIOS } from '../data/bankData';
import type { LiveState } from '../store/liveState';

interface HeaderProps {
  scenarioName: string;
  simHour: number;
  selectedBank: string;
  bankCode: string;
  liveState: LiveState;
  connected: boolean;
}

export default function Header({ scenarioName, simHour, selectedBank, bankCode, liveState, connected }: HeaderProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const scenario = SCENARIOS[scenarioName];
  const riskColor = scenario?.risk === "EXTREME" || scenario?.risk === "CRITICAL" ? "#ff4444"
    : scenario?.risk === "HIGH" ? "#ff8800"
    : scenario?.risk === "LOW-MEDIUM" ? "#00aaff" : "#00ff88";

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1f3a, #0d1b2a)",
      borderLeft: "5px solid #00d4ff",
      borderRadius: 15,
      padding: "20px 28px",
      marginBottom: 16,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16
    }}>
      {/* LEFT */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: "2em" }}>🏦</span>
          <span style={{ fontSize: "2.2em", fontWeight: 900, color: "#00d4ff", lineHeight: 1 }}>BankPulse AI</span>
        </div>
        <div style={{ color: "#7090b0", fontSize: "0.9em" }}>Banking Infrastructure Monitor</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "blink 1.5s infinite" }} />
          <span style={{ color: "#00ff88", fontSize: "0.82em", fontWeight: 700 }}>LIVE</span>
        </div>
      </div>

      {/* CENTER */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#7090b0", fontSize: "0.82em", marginBottom: 4 }}>SCENARIO</div>
        <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "1em", marginBottom: 8 }}>{scenarioName}</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#7090b0", fontSize: "0.72em" }}>SIM TIME</div>
            <div style={{ color: "#00d4ff", fontWeight: 800, fontSize: "1.1em" }}>{String(simHour).padStart(2, '0')}:00</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#7090b0", fontSize: "0.72em" }}>REAL TIME</div>
            <div style={{ color: "#aaccff", fontWeight: 700, fontSize: "1.1em" }}>{time}</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ textAlign: "right" }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#7090b0", fontSize: "0.78em" }}>EVENT TYPE: </span>
          <span style={{ background: `${scenario?.color || '#00ff88'}22`, border: `1px solid ${scenario?.color || '#00ff88'}66`, color: scenario?.color || '#00ff88', padding: "3px 12px", borderRadius: 20, fontSize: "0.82em", fontWeight: 700 }}>
            {scenario?.event || "Normal"}
          </span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#7090b0", fontSize: "0.78em" }}>RISK: </span>
          <span style={{ background: `${riskColor}22`, border: `1px solid ${riskColor}66`, color: riskColor, padding: "3px 12px", borderRadius: 20, fontSize: "0.82em", fontWeight: 700 }}>
            {scenario?.risk || "LOW"}
          </span>
        </div>
        <div>
          <span style={{ color: "#7090b0", fontSize: "0.78em" }}>BANK: </span>
          <span style={{ color: "#aaccff", fontWeight: 700, fontSize: "0.9em" }}>{selectedBank} {bankCode}</span>
        </div>
        {connected && (
          <div style={{ marginTop: 6 }}>
            <span style={{ background: "#00ff8815", border: "1px solid #00ff8844", color: "#00ff88", padding: "2px 10px", borderRadius: 20, fontSize: "0.75em" }}>
              ● CBS CONNECTED
            </span>
          </div>
        )}
        {liveState.failover_active && (
          <div style={{ marginTop: 4 }}>
            <span style={{ background: "#ff440015", border: "1px solid #ff444466", color: "#ff4444", padding: "2px 10px", borderRadius: 20, fontSize: "0.75em", animation: "pulse 1.5s infinite" }}>
              ⚡ FAILOVER ACTIVE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
