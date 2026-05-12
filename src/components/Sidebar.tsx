// BankPulse AI - Sidebar Component
import { BANK_CONFIGS, SCENARIOS } from '../data/bankData';

interface SidebarProps {
  selectedBank: string;
  onBankChange: (bank: string) => void;
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  simHour: number;
  onHourChange: (hour: number) => void;
  manualLoad: number;
  onLoadChange: (load: number) => void;
  liveMode: boolean;
  onLiveModeChange: (v: boolean) => void;
  geminiKey: string;
  onGeminiKeyChange: (k: string) => void;
  totalRecords: number;
  crashEvents: number;
}

function getLoadColorSidebar(load: number) {
  if (load >= 80) return "#ff4444";
  if (load >= 65) return "#ffcc00";
  return "#00ff88";
}

export default function Sidebar({
  selectedBank, onBankChange,
  selectedScenario, onScenarioChange,
  simHour, onHourChange,
  manualLoad, onLoadChange,
  liveMode, onLiveModeChange,
  geminiKey, onGeminiKeyChange,
  totalRecords, crashEvents
}: SidebarProps) {
  const loadColor = getLoadColorSidebar(manualLoad);

  return (
    <div style={{
      width: 260,
      minWidth: 220,
      background: "linear-gradient(180deg, #0a0f1e 0%, #0d1b2a 100%)",
      borderRight: "1px solid #1a2a4a",
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      overflowY: "auto",
      height: "100vh",
      position: "sticky",
      top: 0
    }}>
      {/* BRAND */}
      <div style={{
        background: "linear-gradient(135deg, #1a1f3a, #0d1b2a)",
        borderLeft: "4px solid #00d4ff",
        borderRadius: 10,
        padding: "14px 12px"
      }}>
        <div style={{ fontSize: "1.8em", textAlign: "center", marginBottom: 4 }}>🏦</div>
        <div style={{ color: "#00d4ff", fontWeight: 900, fontSize: "1.05em", textAlign: "center" }}>BankPulse AI</div>
        <div style={{ color: "#445566", fontSize: "0.72em", textAlign: "center" }}>Banking Infrastructure Monitor</div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <span style={{ background: "#00ff8815", border: "1px solid #00ff8844", color: "#00ff88", padding: "2px 10px", borderRadius: 20, fontSize: "0.7em", fontWeight: 700 }}>
            ● LIVE SYSTEM
          </span>
        </div>
      </div>

      {/* GEMINI API KEY */}
      <div>
        <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 6 }}>🔑 Gemini API Key (Optional)</div>
        <input
          type="password"
          value={geminiKey}
          onChange={e => onGeminiKeyChange(e.target.value)}
          placeholder="AIzaSy... (optional)"
          style={{
            width: "100%",
            background: "#0d1421",
            border: "1px solid #1a3f5f",
            borderRadius: 8,
            padding: "7px 10px",
            color: "#aaccff",
            fontSize: "0.78em",
            boxSizing: "border-box"
          }}
        />
        <div style={{ color: "#445566", fontSize: "0.68em", marginTop: 4 }}>Get free key: aistudio.google.com</div>
      </div>

      <div style={{ borderTop: "1px solid #1a2a4a" }} />

      {/* BANK SELECTION */}
      <div>
        <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 8 }}>🏛️ Select Bank</div>
        {Object.entries(BANK_CONFIGS).map(([code, config]) => (
          <button
            key={code}
            onClick={() => onBankChange(code)}
            style={{
              width: "100%",
              background: selectedBank === code ? `${config.accent}15` : "transparent",
              border: selectedBank === code ? `1px solid ${config.accent}` : "1px solid transparent",
              color: selectedBank === code ? config.accent : "#7090b0",
              padding: "7px 10px",
              borderRadius: 8,
              textAlign: "left",
              fontSize: "0.82em",
              cursor: "pointer",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: config.accent, display: "inline-block", flexShrink: 0 }} />
            {config.emoji} {config.name}
          </button>
        ))}
      </div>

      {/* SCENARIO SELECTION */}
      <div>
        <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 8 }}>📊 Scenario</div>
        {Object.entries(SCENARIOS).map(([name, cfg]) => (
          <button
            key={name}
            onClick={() => onScenarioChange(name)}
            style={{
              width: "100%",
              background: selectedScenario === name ? `${cfg.color}15` : "transparent",
              border: selectedScenario === name ? `1px solid ${cfg.color}` : "1px solid transparent",
              color: selectedScenario === name ? cfg.color : "#7090b0",
              padding: "6px 10px",
              borderRadius: 8,
              textAlign: "left",
              fontSize: "0.78em",
              cursor: "pointer",
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color, display: "inline-block", flexShrink: 0 }} />
            {name}
          </button>
        ))}
      </div>

      {/* HOUR SLIDER */}
      <div>
        <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 6 }}>
          ⏰ Simulation Hour: <span style={{ color: "#00d4ff", fontWeight: 700 }}>{String(simHour).padStart(2, '0')}:00</span>
        </div>
        <input
          type="range"
          min={6}
          max={23}
          value={simHour}
          onChange={e => onHourChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#00d4ff" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: "#445566", fontSize: "0.68em" }}>
          <span>6:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* LOAD SLIDER */}
      <div>
        <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 6 }}>
          💻 Server Load: <span style={{ color: loadColor, fontWeight: 700 }}>{manualLoad}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={manualLoad}
          onChange={e => onLoadChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: loadColor }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: "#445566", fontSize: "0.68em" }}>
          <span>10%</span>
          <span style={{ color: "#ff4444" }}>100%</span>
        </div>
      </div>

      {/* LIVE MODE */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#7090b0", fontSize: "0.78em" }}>⚡ Live Simulation</div>
        <div
          onClick={() => onLiveModeChange(!liveMode)}
          style={{
            width: 40,
            height: 22,
            background: liveMode ? "#00ff8844" : "#1a2332",
            borderRadius: 11,
            cursor: "pointer",
            position: "relative",
            border: liveMode ? "1px solid #00ff88" : "1px solid #2a3f5f",
            transition: "all 0.3s"
          }}>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: liveMode ? "#00ff88" : "#445566",
            position: "absolute",
            top: 2,
            left: liveMode ? 20 : 2,
            transition: "all 0.3s"
          }} />
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1a2a4a" }} />

      {/* DATASET STATS */}
      <div>
        <div style={{ color: "#7090b0", fontSize: "0.78em", marginBottom: 8 }}>📂 Dataset Stats</div>
        {[
          { label: "Total Records", val: totalRecords.toLocaleString(), color: "#00d4ff" },
          { label: "Crash Events", val: crashEvents.toLocaleString(), color: "#ff4444" },
          { label: "Date Range", val: "2024 Full Year", color: "#aaccff" },
          { label: "Revenue Threshold", val: "₹11.25 Cr", color: "#00ff88" },
        ].map((stat, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1a2332", fontSize: "0.78em" }}>
            <span style={{ color: "#556" }}>{stat.label}</span>
            <span style={{ color: stat.color, fontWeight: 700 }}>{stat.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
