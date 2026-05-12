// BankPulse AI - Landing Page
// Team #119 Prompt Pirates | Aavishkar Pravah 2.0

import { useState, useEffect } from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const WHY_CRASH_CARDS = [
  { icon: "🟢", title: "Normal Day", tx: "500–3K tx/min", load: "Load: 15–55%", color: "#00ff88" },
  { icon: "🔴", title: "Salary Day", tx: "20K–50K tx/min", load: "Load: 78–98%", color: "#ff4444" },
  { icon: "📊", title: "Year End", tx: "25K–60K tx/min", load: "Load: 85–100%", color: "#ff0044" },
  { icon: "🎆", title: "Festival Season", tx: "15K–45K tx/min", load: "Load: 72–96%", color: "#ff8800" },
  { icon: "🟡", title: "GST Filing Day", tx: "10K–35K tx/min", load: "Load: 65–88%", color: "#ffcc00" },
  { icon: "🛒", title: "Flash Sale Day", tx: "12K–38K tx/min", load: "Load: 68–92%", color: "#ff6600" },
];

const CAPABILITIES = [
  { icon: "📡", title: "Real-Time Monitoring", desc: "Metrics across SBI-PROD-01/02/03 with live CBS feed" },
  { icon: "🧠", title: "AI Crash Prediction", desc: "ML + Gemini AI forecasting 30 minutes before crash" },
  { icon: "⚡", title: "Auto Prevention", desc: "Failover / autoscale / queue management" },
  { icon: "🤖", title: "GenAI Copilot", desc: "Incident plans + customer communications" },
  { icon: "📊", title: "Historical Analytics", desc: "Crash prevention insights & trend analysis" },
  { icon: "🔗", title: "Bank Connect API", desc: "Secure CBS integration - RBI compliant" },
];

const STEPS = [
  { step: "01", icon: "📡", title: "MONITOR", desc: "Real-time server health, transaction velocity, latency, error rates." },
  { step: "02", icon: "🧠", title: "PREDICT", desc: "ML risk scoring + Gemini AI forecasts 30 minutes before crash." },
  { step: "03", icon: "⚡", title: "PREVENT", desc: "Autoscale, failover, rate-limit, queue, circuit breaker." },
];

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    const g = setInterval(() => setGlowPulse(p => !p), 2000);
    return () => { clearInterval(t); clearInterval(g); };
  }, []);

  return (
    <div style={{ background: "linear-gradient(160deg, #030a1a 0%, #0a0f2e 40%, #050d1a 100%)", minHeight: "100vh", color: "white", fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>

      {/* TOP NAV */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", borderBottom: "1px solid #1a2a4a", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.8em" }}>🏦</span>
          <span style={{ fontSize: "1.3em", fontWeight: 800, color: "#00d4ff" }}>BankPulse</span>
          <span style={{ fontSize: "1.3em", fontWeight: 800, color: "white" }}>AI</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: "0.85em" }}>{time}</span>
          <span style={{ background: "#00ff8822", border: "1px solid #00ff88", color: "#00ff88", padding: "4px 12px", borderRadius: 20, fontSize: "0.8em", fontWeight: 700 }}>● LIVE DEMO</span>
          <button onClick={onLaunch} style={{ background: "linear-gradient(135deg, #00d4ff, #0088ff)", border: "none", color: "white", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.9em" }}>
            🚀 Launch Dashboard
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={{ textAlign: "center", padding: "80px 40px 60px", position: "relative" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ fontSize: "4em", marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>🏦</div>

        <h1 style={{ fontSize: "clamp(2.5em, 6vw, 4.5em)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.1 }}>
          <span style={{ color: "#00d4ff" }}>Bank</span>
          <span style={{ color: "white" }}>Pulse</span>
          <span style={{ background: "linear-gradient(135deg, #7b2fff, #ff44ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> AI</span>
        </h1>

        <p style={{ fontSize: "clamp(1.1em, 2.5vw, 1.6em)", color: "#aaccff", marginBottom: 12, fontStyle: "italic", fontWeight: 300 }}>
          "Predict the Rush. Prevent the Crash."
        </p>

        <p style={{ color: "#7090b0", fontSize: "1em", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
          AI-powered Banking Infrastructure Observability and Downtime Prevention Platform.<br />
          Built for the 24-hour GenAI Hackathon — Aavishkar Pravah 2.0.
        </p>

        {/* CTA BUTTONS */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 50 }}>
          <button onClick={onLaunch} style={{
            background: "linear-gradient(135deg, #00d4ff22, #0088ff22)",
            border: "2px solid #00d4ff",
            color: "#00d4ff",
            padding: "16px 40px",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: "1.1em",
            cursor: "pointer",
            boxShadow: glowPulse ? "0 0 30px rgba(0,212,255,0.5)" : "0 0 15px rgba(0,212,255,0.2)",
            transition: "all 0.5s ease"
          }}>
            🚀 Launch Dashboard
          </button>
          <button style={{
            background: "rgba(123,47,255,0.15)",
            border: "2px solid #7b2fff",
            color: "#bb88ff",
            padding: "16px 36px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "1em",
            cursor: "pointer"
          }}>
            🧠 AI Prediction
          </button>
          <button style={{
            background: "rgba(255,255,255,0.05)",
            border: "2px solid #2a3f5f",
            color: "#7090b0",
            padding: "16px 36px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "1em",
            cursor: "pointer"
          }}>
            🏗️ Architecture
          </button>
        </div>

        {/* HACKATHON TAGS */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {[
            { label: "🏆 Aavishkar Pravah 2.0", color: "#ffd700" },
            { label: "🏫 HKBK College of Engineering, Bangalore", color: "#00d4ff" },
            { label: "👥 Team #119 Prompt Pirates", color: "#7b2fff" },
            { label: "💰 Domain: Finance", color: "#00ff88" },
            { label: "⏱️ 24-Hour GenAI Hackathon", color: "#ff8800" },
          ].map((tag, i) => (
            <span key={i} style={{
              background: `${tag.color}15`,
              border: `1px solid ${tag.color}44`,
              color: tag.color,
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: "0.82em",
              fontWeight: 600
            }}>{tag.label}</span>
          ))}
        </div>
      </div>

      {/* PROBLEM STATEMENT STRIP */}
      <div style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,68,68,0.4)", margin: "0 40px 50px", borderRadius: 12, padding: "20px 30px", textAlign: "center" }}>
        <span style={{ color: "#ff4444", fontWeight: 800, fontSize: "1em" }}>🚨 PROBLEM STATEMENT: </span>
        <span style={{ color: "#ffaaaa", fontSize: "1em" }}>"Banking systems experience downtime during peak demand"</span>
        <br />
        <span style={{ color: "#886666", fontSize: "0.85em" }}>— Aavishkar Pravah 2.0 | Domain: Finance</span>
      </div>

      {/* WHY BANKS CRASH */}
      <div style={{ padding: "0 40px 60px" }}>
        <h2 style={{ textAlign: "center", color: "#00d4ff", fontSize: "1.8em", fontWeight: 800, marginBottom: 8 }}>Why Banks Crash at Peak</h2>
        <p style={{ textAlign: "center", color: "#7090b0", marginBottom: 40 }}>Real Indian banking context — hardcoded into simulation engine</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {WHY_CRASH_CARDS.map((card, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(13,27,42,0.9), rgba(10,15,30,0.95))",
              border: `1px solid ${card.color}33`,
              borderRadius: 16,
              padding: "24px 20px",
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "default"
            }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${card.color}22`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              <div style={{ fontSize: "2em", marginBottom: 10 }}>{card.icon}</div>
              <div style={{ color: card.color, fontWeight: 800, fontSize: "1.05em", marginBottom: 8 }}>{card.title}</div>
              <div style={{ color: "#aaccff", fontSize: "0.9em", marginBottom: 4 }}>{card.tx}</div>
              <div style={{ color: "#7090b0", fontSize: "0.85em" }}>{card.load}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CAPACITY STRIP */}
      <div style={{ background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.3)", margin: "0 40px 60px", borderRadius: 12, padding: "20px 30px", textAlign: "center" }}>
        <div style={{ color: "#ffcc00", fontWeight: 800, fontSize: "1.05em", marginBottom: 8 }}>⚠️ Critical System Capacity</div>
        <div style={{ color: "#ccaa66", fontSize: "0.9em", lineHeight: 2 }}>
          15,000 tx/min per server (single point of failure) &nbsp;|&nbsp; Each tx = 5 DB operations
          <br />
          Revenue Formula: <span style={{ color: "#00ff88" }}>(tx × ₹2,500) ÷ 10,000,000 = Crores at risk</span>
        </div>
      </div>

      {/* LIVE METRICS SUMMARY */}
      <div style={{ padding: "0 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {[
            { val: "₹15 Cr", label: "Revenue at risk/min", sub: "Year End peak", color: "#ff4444" },
            { val: "99.97%", label: "Simulated uptime", sub: "With BankPulse AI", color: "#00ff88" },
            { val: "0.8s", label: "Failover time", sub: "Switchover speed", color: "#00d4ff" },
            { val: "₹56 Cr+", label: "Revenue saved", sub: "Estimated 2024", color: "#7b2fff" },
          ].map((m, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(13,27,42,0.95), rgba(5,13,26,0.98))",
              border: `1px solid ${m.color}44`,
              borderRadius: 16,
              padding: "28px 20px",
              textAlign: "center",
              boxShadow: `0 0 20px ${m.color}15`
            }}>
              <div style={{ fontSize: "2.2em", fontWeight: 900, color: m.color, marginBottom: 6 }}>{m.val}</div>
              <div style={{ color: "#aaccff", fontWeight: 600, fontSize: "0.9em", marginBottom: 4 }}>{m.label}</div>
              <div style={{ color: "#556", fontSize: "0.8em" }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CAPABILITIES */}
      <div style={{ padding: "0 40px 60px" }}>
        <h2 style={{ textAlign: "center", color: "#00d4ff", fontSize: "1.8em", fontWeight: 800, marginBottom: 8 }}>Platform Capabilities</h2>
        <p style={{ textAlign: "center", color: "#7090b0", marginBottom: 40 }}>Monitor → Predict → Prevent</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {CAPABILITIES.map((cap, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(13,27,42,0.9), rgba(10,15,30,0.95))",
              border: "1px solid #1a3a5c",
              borderRadius: 14,
              padding: "24px 22px",
              transition: "all 0.3s ease",
              cursor: "default"
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.borderColor = "#00d4ff44"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "#1a3a5c"; }}>
              <div style={{ fontSize: "1.8em", marginBottom: 10 }}>{cap.icon}</div>
              <div style={{ color: "#00d4ff", fontWeight: 700, fontSize: "1em", marginBottom: 6 }}>{cap.title}</div>
              <div style={{ color: "#7090b0", fontSize: "0.88em", lineHeight: 1.5 }}>{cap.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-STEP FLOW */}
      <div style={{ padding: "0 40px 60px" }}>
        <h2 style={{ textAlign: "center", color: "#00d4ff", fontSize: "1.8em", fontWeight: 800, marginBottom: 40 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.05), rgba(13,27,42,0.9))",
              border: "2px solid rgba(0,212,255,0.3)",
              borderRadius: 20,
              padding: "36px 28px",
              textAlign: "center",
              boxShadow: "0 0 30px rgba(0,212,255,0.08)"
            }}>
              <div style={{ color: "#00d4ff44", fontSize: "3em", fontWeight: 900, marginBottom: 8 }}>STEP {step.step}</div>
              <div style={{ fontSize: "2.5em", marginBottom: 12 }}>{step.icon}</div>
              <div style={{ color: "#00d4ff", fontWeight: 800, fontSize: "1.3em", marginBottom: 12 }}>{step.title}</div>
              <div style={{ color: "#7090b0", fontSize: "0.9em", lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ margin: "0 40px 60px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(123,47,255,0.08))",
          border: "2px solid rgba(0,212,255,0.3)",
          borderRadius: 24,
          padding: "50px 40px",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(0,212,255,0.08)"
        }}>
          <div style={{ fontSize: "2.5em", marginBottom: 16 }}>🏆</div>
          <h2 style={{ color: "#00d4ff", fontSize: "1.8em", fontWeight: 800, marginBottom: 16 }}>Ready to Explore?</h2>
          <p style={{ color: "#7090b0", marginBottom: 12 }}>Launch the dashboard and switch to these scenarios to experience AI prediction:</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {["🔴 Salary Day", "📊 Year End", "🟡 GST Filing Day"].map((s, i) => (
              <span key={i} style={{ background: "rgba(255,68,68,0.15)", border: "1px solid rgba(255,68,68,0.4)", color: "#ff8888", padding: "6px 18px", borderRadius: 20, fontSize: "0.9em", fontWeight: 600 }}>{s}</span>
            ))}
          </div>
          <button onClick={onLaunch} style={{
            background: "linear-gradient(135deg, #00d4ff, #0088ff)",
            border: "none",
            color: "white",
            padding: "18px 56px",
            borderRadius: 14,
            fontWeight: 800,
            fontSize: "1.15em",
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(0,212,255,0.35)",
            transition: "all 0.3s ease"
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
          >
            🚀 Launch BankPulse AI
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #1a2a4a", padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "1.8em", marginBottom: 8 }}>🏦</div>
        <div style={{ color: "#00d4ff", fontWeight: 800, fontSize: "1.2em", marginBottom: 4 }}>BankPulse AI</div>
        <div style={{ color: "#7090b0", fontSize: "0.9em", fontStyle: "italic", marginBottom: 16 }}>"Predict the Rush. Prevent the Crash."</div>
        <div style={{ color: "#556", fontSize: "0.82em", lineHeight: 2 }}>
          Built for: Aavishkar Pravah 2.0 | HKBK College of Engineering, Bangalore<br />
          Team #119 Prompt Pirates | Domain Finance | 24-Hour GenAI Hackathon<br />
          <span style={{ color: "#443322" }}>⚠️ Prototype simulation — no real banking data used.</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
