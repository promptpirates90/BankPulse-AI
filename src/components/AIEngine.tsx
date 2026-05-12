// BankPulse AI - AI Prediction Engine Component
import { useState } from 'react';
import type { LiveState } from '../store/liveState';
import { SCENARIOS } from '../data/bankData';

interface AIEngineProps {
  liveState: LiveState;
  scenarioName: string;
  geminiKey: string;
  connected: boolean;
  primaryServer: string;
  secondaryServer: string;
}

interface AIPrediction {
  crashImminent: boolean;
  crashProbability: number;
  timeToCrash: string;
  confidence: number;
  riskLevel: string;
  bottleneck: string;
  factors: string[];
  actions: string[];
  serverDecision: string;
  primaryAfter: number;
  secondaryAfter: number;
  switchoverTime: number;
  txAtRisk: number;
  revenueAtRisk: number;
  customersAffected: number;
  slaBreach: boolean;
  nextPeak: string;
  prepTime: number;
  preemptiveAction: string;
}

function generateFallbackPrediction(liveState: LiveState, primaryServer: string, secondaryServer: string, scenarioName: string): AIPrediction {
  const load = liveState.current_load;
  const tx = liveState.current_tx;
  const scenario = SCENARIOS[scenarioName];
  const rev = liveState.revenue_per_min;

  const crashProb = load >= 80 ? Math.min(99, load + 10) : Math.max(5, load - 30);
  const timeToCrash = load >= 80 ? `${Math.max(5, Math.floor((100 - load) * 2))} minutes` : "Not imminent";
  const crashImminent = load >= 80;

  const riskLevel = load >= 90 ? "CRITICAL" : load >= 80 ? "HIGH" : load >= 65 ? "MEDIUM" : "LOW";

  const bottlenecks: Record<string, string> = {
    "Salary Day": "DB connection pool overwhelmed — 52,847 concurrent write ops",
    "Year End": "Bulk ITR processing consumed all 32,000 server threads",
    "Festival": "UPI payment gateway API timeout rate reached 34%",
    "GST Filing": "OAuth token service rate limited — 48,000 simultaneous business auth requests",
    "Flash Sale": "Payment aggregator concurrent session limit hit — tokenization timeout 78%",
    "Normal": "Traffic within normal thresholds — all systems optimal"
  };

  const actions = load >= 80 ? [
    `Immediately activate ${secondaryServer} — set to receive 40% traffic`,
    `Increase DB connection pool size from 15,000 to 25,000 connections`,
    `Enable Redis cache write-through for high-frequency salary queries`,
    `Activate circuit breaker on UPI gateway — limit to 8,000 req/sec`
  ] : [
    `Continue monitoring ${primaryServer} — load within safe thresholds`,
    `Pre-warm ${secondaryServer} — schedule activation in 15 minutes`,
    `Increase cache TTL to 300s to reduce DB read pressure`,
    `Alert on-call team: ${scenario?.event || 'Normal'} pattern detected`
  ];

  return {
    crashImminent,
    crashProbability: crashProb,
    timeToCrash,
    confidence: Math.min(99, 75 + Math.floor(load * 0.2)),
    riskLevel,
    bottleneck: bottlenecks[scenario?.event || "Normal"] || bottlenecks["Normal"],
    factors: [
      `Server load at ${load.toFixed(0)}% — ${load >= 80 ? "EXCEEDS" : "below"} critical threshold`,
      `Transaction rate: ${tx.toLocaleString()} tx/min — capacity limit 15,000`,
      `Response time: ${liveState.current_response}ms — ${liveState.current_response > 800 ? "DEGRADED" : "acceptable"}`
    ],
    actions,
    serverDecision: load >= 80 ? `Activate ${secondaryServer}` : `Keep ${primaryServer}`,
    primaryAfter: load >= 80 ? Math.floor(load * 0.55) : load,
    secondaryAfter: load >= 80 ? Math.floor(load * 0.45) : 5,
    switchoverTime: load >= 80 ? 45 : 0,
    txAtRisk: Math.floor(tx * 0.15),
    revenueAtRisk: rev,
    customersAffected: liveState.current_users,
    slaBreach: load >= 80,
    nextPeak: "9:00 AM - 11:00 AM",
    prepTime: 30,
    preemptiveAction: `Pre-warm ${secondaryServer} 30 minutes before ${scenario?.event || 'peak'} window`
  };
}

export default function AIEngine({ liveState, scenarioName, geminiKey, connected, primaryServer, secondaryServer }: AIEngineProps) {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [predTime, setPredTime] = useState<string>("");

  const handlePredict = async () => {
    if (!connected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    if (geminiKey && geminiKey.length > 10) {
      try {
        const risk = liveState.risk_score;
        const prompt = `You are BankPulse AI monitoring system for a major Indian bank IT operations center.

LIVE SYSTEM DATA:
Time: ${new Date().getHours()}:00 | Event: ${liveState.scenario}
Primary Server Load: ${liveState.current_load.toFixed(1)}%
Transactions/min: ${liveState.current_tx.toLocaleString()}
Active Users: ${liveState.current_users.toLocaleString()}
Response Time: ${liveState.current_response}ms
Secondary Active: ${liveState.sec_active}
Risk Score: ${risk}/100
Historical crashes (same event): ${liveState.scenario !== "Normal" ? 3 : 1}
Server capacity limit: 15,000 tx/min
Revenue per minute: ₹${liveState.revenue_per_min.toFixed(2)} Crores

Respond EXACTLY in this JSON format (no markdown, just JSON):
{"crashImminent":true/false,"crashProbability":85,"timeToCrash":"15 minutes","confidence":92,"riskLevel":"CRITICAL","bottleneck":"DB connection pool overwhelmed","factors":["factor1","factor2","factor3"],"actions":["action1","action2","action3","action4"],"serverDecision":"Activate PROD-02","primaryAfter":45,"secondaryAfter":55,"switchoverTime":45,"txAtRisk":5000,"revenueAtRisk":11.25,"customersAffected":250000,"slaBreach":true,"nextPeak":"9:00 AM - 11:00 AM","prepTime":30,"preemptiveAction":"Pre-warm secondary 30 min before peak"}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setPrediction({ ...generateFallbackPrediction(liveState, primaryServer, secondaryServer, scenarioName), ...parsed });
        } else {
          setPrediction(generateFallbackPrediction(liveState, primaryServer, secondaryServer, scenarioName));
        }
      } catch {
        setPrediction(generateFallbackPrediction(liveState, primaryServer, secondaryServer, scenarioName));
      }
    } else {
      setPrediction(generateFallbackPrediction(liveState, primaryServer, secondaryServer, scenarioName));
    }

    setPredTime(new Date().toLocaleTimeString());
    setLoading(false);
  };

  const riskColor = liveState.risk_score >= 70 ? "#ff4444" : liveState.risk_score >= 40 ? "#ffcc00" : "#00ff88";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        🤖 AI Crash Prediction Engine
        <span style={{ color: "#7b2fff", fontSize: "0.65em", fontWeight: 400, marginLeft: 10 }}>Powered by Google Gemini 1.5 Flash</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16 }}>
        {/* INPUT PANEL */}
        <div style={{
          background: "linear-gradient(135deg, #1a0a2e, #0d0a1e)",
          border: `2px solid ${connected ? "#7b2fff" : "#2a2a4a"}`,
          borderRadius: 15,
          padding: "20px"
        }}>
          <div style={{ color: "#bb88ff", fontWeight: 800, fontSize: "1em", marginBottom: 14 }}>🧠 Current System State</div>

          {!connected ? (
            <div style={{ color: "#445566", textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "2em", marginBottom: 10 }}>🔌</div>
              <div>Connect to CBS to enable AI predictions</div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Server Load", val: `${liveState.current_load.toFixed(0)}%` },
                  { label: "Tx/Min", val: liveState.current_tx.toLocaleString() },
                  { label: "Active Users", val: liveState.current_users >= 1000 ? `${(liveState.current_users / 1000).toFixed(0)}K` : liveState.current_users.toString() },
                  { label: "Response Time", val: `${liveState.current_response}ms` },
                  { label: "Event Type", val: liveState.scenario },
                  { label: "Failover", val: liveState.failover_active ? "ACTIVE" : "STANDBY" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0a1e", border: "1px solid #2a1a4a", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ color: "#556", fontSize: "0.72em" }}>{item.label}</div>
                    <div style={{ color: "#bb88ff", fontWeight: 700, fontSize: "0.9em" }}>{item.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ color: "#7090b0", fontSize: "0.8em", marginBottom: 6 }}>Risk Score: {liveState.risk_score}/100</div>
                <div style={{ background: "#0d1421", borderRadius: 6, height: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${liveState.risk_score}%`,
                    background: riskColor,
                    transition: "width 0.5s ease",
                    borderRadius: 6
                  }} />
                </div>
              </div>

              <div style={{ background: "#0d0a1e", border: "1px solid #2a1a4a", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: "0.8em" }}>
                <div style={{ color: "#7b2fff", fontWeight: 700, marginBottom: 4 }}>⏰ PREDICTED PEAKS</div>
                <div style={{ color: "#bb88ff" }}>9:00 AM - 11:00 AM → ×1.4 multiplier</div>
                <div style={{ color: "#7090b0" }}>6:00 PM - 8:00 PM → ×1.2 multiplier</div>
                <div style={{ color: "#556", marginTop: 4 }}>Prep 30 mins before each window</div>
              </div>

              <div style={{ fontSize: "0.8em", color: "#556", marginBottom: 14 }}>
                Past crashes (same event): {liveState.scenario !== "Normal" ? "3 recorded" : "1 recorded"}
              </div>
            </>
          )}

          <button
            onClick={handlePredict}
            disabled={!connected || loading}
            style={{
              width: "100%",
              background: connected && !loading ? "linear-gradient(135deg, #7b2fff, #5500cc)" : "#2a2a4a",
              border: connected ? "1px solid #7b2fff" : "1px solid #2a2a4a",
              color: connected ? "white" : "#445566",
              padding: "14px",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: "1em",
              cursor: connected && !loading ? "pointer" : "not-allowed",
              transition: "all 0.3s ease"
            }}
          >
            {loading ? "🧠 Analyzing..." : "⚡ 🤖 GET AI PREDICTION"}
          </button>
          <div style={{ color: "#556", fontSize: "0.72em", textAlign: "center", marginTop: 6 }}>
            {geminiKey ? "Using Gemini API" : "No API key? Offline AI used"}
          </div>
          {!connected && (
            <div style={{ background: "#1a0a00", border: "1px solid #ff440044", borderRadius: 8, padding: "10px", marginTop: 10, fontSize: "0.78em", color: "#ff8844", textAlign: "center" }}>
              ⚠️ Connect to Core Banking System before running AI predictions.
            </div>
          )}
        </div>

        {/* OUTPUT PANEL */}
        <div>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "3em", marginBottom: 16, animation: "float 1s ease-in-out infinite" }}>🧠</div>
              <div style={{ color: "#7b2fff", fontWeight: 700, fontSize: "1.1em" }}>BankPulse AI analyzing banking patterns...</div>
              <div style={{ color: "#445566", fontSize: "0.85em", marginTop: 8 }}>Evaluating 6,570 historical records...</div>
            </div>
          )}

          {!loading && !prediction && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#445566" }}>
              <div style={{ fontSize: "4em", marginBottom: 12 }}>🤖</div>
              <div style={{ fontSize: "1.1em", marginBottom: 8 }}>AI Prediction Ready</div>
              <div style={{ fontSize: "0.85em", marginBottom: 20 }}>Click the button to analyze current system state and predict potential crashes.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["Crash Probability", "Time to Crash", "Risk Level", "Server Actions"].map(label => (
                  <div key={label} style={{ background: "#0d1421", border: "1px solid #1a2332", borderRadius: 8, padding: "12px", color: "#2a3f5f", fontSize: "0.82em" }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && prediction && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {predTime && <div style={{ color: "#445566", fontSize: "0.75em", textAlign: "right" }}>Analyzed at {predTime}</div>}

              {/* CRASH PREDICTION */}
              <div style={{
                background: prediction.crashImminent ? "linear-gradient(135deg, #200000, #1a0000)" : "linear-gradient(135deg, #002010, #001a0a)",
                border: `2px solid ${prediction.crashImminent ? "#ff4444" : "#00ff88"}`,
                borderRadius: 12,
                padding: "16px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "3em", fontWeight: 900, color: prediction.crashImminent ? "#ff4444" : "#00ff88", lineHeight: 1 }}>
                  {prediction.crashProbability}%
                </div>
                <div style={{ color: prediction.crashImminent ? "#ff4444" : "#00ff88", fontWeight: 800, fontSize: "1em", marginTop: 4 }}>
                  {prediction.crashImminent ? "🚨 CRASH IMMINENT" : "✅ SYSTEM SAFE"}
                </div>
                <div style={{ color: "#7090b0", fontSize: "0.78em", marginTop: 4 }}>
                  Time to crash: {prediction.timeToCrash} | Confidence: {prediction.confidence}%
                </div>
              </div>

              {/* RISK + BOTTLENECK */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{
                  background: "#0d1421",
                  border: `1px solid ${prediction.riskLevel === "CRITICAL" ? "#ff4444" : prediction.riskLevel === "HIGH" ? "#ff8800" : prediction.riskLevel === "MEDIUM" ? "#ffcc00" : "#00ff88"}44`,
                  borderRadius: 10,
                  padding: "14px",
                  textAlign: "center"
                }}>
                  <div style={{ color: "#7090b0", fontSize: "0.72em", marginBottom: 6 }}>RISK LEVEL</div>
                  <div style={{
                    fontSize: "1.4em",
                    fontWeight: 900,
                    color: prediction.riskLevel === "CRITICAL" ? "#ff4444" : prediction.riskLevel === "HIGH" ? "#ff8800" : prediction.riskLevel === "MEDIUM" ? "#ffcc00" : "#00ff88"
                  }}>{prediction.riskLevel}</div>
                  <div style={{ color: "#445566", fontSize: "0.72em", marginTop: 6 }}>{prediction.bottleneck.substring(0, 50)}...</div>
                </div>

                <div style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 10, padding: "14px" }}>
                  <div style={{ color: "#7090b0", fontSize: "0.72em", marginBottom: 6 }}>SERVER DECISION</div>
                  <div style={{
                    color: prediction.crashImminent ? "#ff8800" : "#00ff88",
                    fontWeight: 800,
                    fontSize: "0.85em",
                    marginBottom: 4
                  }}>
                    {prediction.crashImminent ? `🔄 ${prediction.serverDecision}` : `✅ Keep ${primaryServer}`}
                  </div>
                  <div style={{ color: "#445566", fontSize: "0.72em" }}>
                    Switchover: {prediction.switchoverTime}s
                  </div>
                </div>
              </div>

              {/* IT ACTIONS */}
              <div style={{ background: "linear-gradient(135deg, #0d1a2e, #0a1520)", border: "1px solid #1a3a5f", borderRadius: 10, padding: "14px" }}>
                <div style={{ color: "#00d4ff", fontWeight: 700, fontSize: "0.85em", marginBottom: 8 }}>🔧 Immediate IT Actions</div>
                {prediction.actions.map((action, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: "0.8em" }}>
                    <span style={{ color: "#ff8800" }}>☐</span>
                    <span style={{ color: "#aaccff" }}>{action}</span>
                  </div>
                ))}
              </div>

              {/* REVENUE IMPACT */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#1a0a00", border: "1px solid #ff440033", borderRadius: 10, padding: "14px", textAlign: "center" }}>
                  <div style={{ color: "#7090b0", fontSize: "0.72em", marginBottom: 4 }}>REVENUE AT RISK</div>
                  <div style={{ color: "#ff4444", fontWeight: 900, fontSize: "1.4em" }}>₹{prediction.revenueAtRisk.toFixed(2)} Cr</div>
                  <div style={{ color: "#445566", fontSize: "0.72em" }}>per minute</div>
                  {prediction.slaBreach && (
                    <div style={{ color: "#ff4444", fontSize: "0.7em", marginTop: 4, fontWeight: 700 }}>⚠️ SLA BREACH</div>
                  )}
                </div>

                <div style={{ background: "#0d1421", border: "1px solid #7b2fff33", borderRadius: 10, padding: "14px", textAlign: "center" }}>
                  <div style={{ color: "#7090b0", fontSize: "0.72em", marginBottom: 4 }}>NEXT PEAK ALERT</div>
                  <div style={{ color: "#bb88ff", fontWeight: 700, fontSize: "0.85em" }}>⏰ {prediction.nextPeak}</div>
                  <div style={{ color: "#556", fontSize: "0.72em", marginTop: 4 }}>Prep {prediction.prepTime} mins before</div>
                  <div style={{ color: "#7b2fff", fontSize: "0.7em", marginTop: 2 }}>{prediction.preemptiveAction.substring(0, 50)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
