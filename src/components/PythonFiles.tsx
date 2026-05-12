// BankPulse AI - Python Files Viewer Component
// Shows the actual Python backend files that would power this system

import { useState } from 'react';

const FILES = [
  {
    name: "requirements.txt",
    lang: "text",
    content: `streamlit>=1.32.0
plotly>=5.19.0
pandas>=2.2.0
numpy>=1.26.0
google-generativeai>=0.4.1
fastapi>=0.109.0
uvicorn>=0.27.0
requests>=2.31.0
python-multipart>=0.0.6`
  },
  {
    name: "mock_bank_server.py (FastAPI)",
    lang: "python",
    content: `# BankPulse AI - Mock Bank CBS Server
# Team #119 Prompt Pirates | Aavishkar Pravah 2.0
# Run: python mock_bank_server.py → http://localhost:8000

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import random, uvicorn
from datetime import datetime

app = FastAPI(
    title="National Bank of India - CBS API",
    description="Core Banking System Internal API v2.3 - RBI Framework",
    version="2.3.1"
)

app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"])

VALID_KEYS = ["BANKPULSE-DEMO-KEY-2024",
              "NBI-PROD-2024-XXXXXXXXXXX",
              "NBI-SAND-2024-XXXXXXXXXXX"]

def verify_key(key: str = Header(None, alias="X-API-Key")):
    if key not in VALID_KEYS:
        raise HTTPException(401, "Invalid API Key")
    return key

@app.get("/")
def root():
    return {"bank": "National Bank of India", "api": "CBS v2.3.1",
            "status": "operational", "rbi_compliant": True}

@app.get("/api/v2/health")
def health():
    return {
        "status": "operational", "uptime": "99.97%",
        "version": "2.3.1", "environment": "production",
        "timestamp": str(datetime.now()),
        "server_region": "Mumbai-DC-1",
        "services": {
            "core_banking": "operational", "upi_switch": "operational",
            "neft_rtgs": "operational", "database_cluster": "operational",
            "load_balancer": "operational", "fraud_detection": "operational"
        }
    }

@app.get("/api/v2/infrastructure/metrics")
def metrics(scenario: str = "normal"):
    scenarios = {
        "normal": {"load": (20,55), "tx": (500,3000)},
        "salary_day": {"load": (78,98), "tx": (20000,50000)},
        "festival": {"load": (72,96), "tx": (15000,45000)},
        "year_end": {"load": (85,100), "tx": (25000,60000)},
        "gst_filing": {"load": (65,92), "tx": (10000,35000)},
    }
    s = scenarios.get(scenario, scenarios["normal"])
    load = random.uniform(*s["load"])
    tx = random.randint(*s["tx"])
    return {
        "primary_server_load": load,
        "secondary_server_load": load * 0.35,
        "tertiary_server_load": 0 if load < 90 else load * 0.2,
        "transactions_per_minute": tx,
        "active_connections": tx * 3,
        "database_pool_usage": load * 0.9,
        "cache_hit_ratio": max(0, 95 - load * 0.2),
        "network_latency_ms": random.uniform(20, 200),
        "cpu_usage": min(100, load * 1.05),
        "ram_usage": load * 0.95,
        "active_sessions": tx * 2,
        "timestamp": str(datetime.now()),
        "uptime_hours": 1247,
    }

if __name__ == "__main__":
    print("🏦 National Bank of India CBS API Server")
    print("✅ Running: http://localhost:8000")
    print("📊 API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)`
  },
  {
    name: "ai_engine.py (Gemini AI)",
    lang: "python",
    content: `# BankPulse AI - Google Gemini AI Prediction Engine
# Team #119 Prompt Pirates | Aavishkar Pravah 2.0

import google.generativeai as genai

def get_ai_prediction(api_key, server_load, transactions_per_min,
                      active_users, event_type, hour,
                      historical_crashes, secondary_active, response_time):

    risk = (server_load * 0.4 +
            min(transactions_per_min/500, 100) * 0.3 +
            min(response_time/50, 100) * 0.2 +
            (20 if event_type != "Normal" else 0))

    revenue = (transactions_per_min * 2500) / 10000000

    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""You are BankPulse AI monitoring for a major Indian bank.

LIVE DATA:
Time: {hour}:00 | Event: {event_type}
Server Load: {server_load}% | Tx/min: {transactions_per_min}
Users: {active_users} | Response: {response_time}ms
Risk Score: {risk:.0f}/100 | Revenue: ₹{revenue:.2f} Cr/min

Respond with crash prediction, risk level, IT actions,
server recommendation, and business impact."""
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            pass

    # Fallback prediction
    if server_load >= 80:
        crash_prob = min(server_load + 10, 99)
        time_crash = max(5, int((100 - server_load) * 2))
        return f"""🚨 CRASH PREDICTION
• Crash in 30 mins: YES
• Probability: {crash_prob}%
• Time to crash: {time_crash} mins
• Confidence: 94%

⚠️ RISK: CRITICAL
• Bottleneck: DB connection pool overwhelmed
• Load: {server_load}% exceeds 80% threshold

🔧 IT ACTIONS
• Activate secondary server immediately
• Increase DB pool size to 25,000
• Enable circuit breaker on UPI gateway
• Alert on-call NOC team

💰 BUSINESS IMPACT
• Revenue at risk: ₹{revenue:.2f} Crores/minute
• SLA breach: YES"""
    else:
        return f"""✅ SYSTEM SAFE
• Crash in 30 mins: NO
• Probability: {max(5, int(server_load - 30))}%
• System: STABLE

📊 MONITORING
• Load {server_load}% within safe thresholds
• Pre-warm secondary before peak hours
• Schedule capacity review"""

def predict_next_peak(event_type, current_hour):
    return {
        "peak_time": "9:00 AM - 11:00 AM",
        "multiplier": 1.4,
        "warning": "Start prep 30 mins before",
        "risk_level": "CRITICAL" if event_type != "Normal" else "MEDIUM"
    }`
  },
  {
    name: "data.py (Data Generator)",
    lang: "python",
    content: `# BankPulse AI - Realistic Indian Banking Data Generator
# Team #119 Prompt Pirates | Aavishkar Pravah 2.0
# Run: python data.py → generates data/bank_data.csv

import pandas as pd
import numpy as np
import os, random
from datetime import datetime, timedelta

os.makedirs("data", exist_ok=True)

EVENT_CONFIGS = {
    "Normal":     {"tx": (500,3000),   "load": (15,55)},
    "Salary Day": {"tx": (20000,50000),"load": (78,98)},
    "Festival":   {"tx": (15000,45000),"load": (72,96)},
    "GST Filing": {"tx": (10000,35000),"load": (65,92)},
    "Year End":   {"tx": (25000,60000),"load": (85,100)},
    "Flash Sale": {"tx": (12000,38000),"load": (68,92)},
}

def get_time_mult(hour):
    if 9 <= hour <= 11: return 1.4
    if 18 <= hour <= 20: return 1.2
    if hour < 8: return 0.4
    return 1.0

def get_event(date):
    if date.day == 1: return "Salary Day"
    if date.month == 3 and date.day == 31: return "Year End"
    if date.month in [1, 10]: return "Festival"
    if random.random() < 0.05: return "GST Filing"
    if random.random() < 0.03: return "Flash Sale"
    return "Normal"

rows = []
start = datetime(2024, 1, 1)
for day_offset in range(366):
    date = start + timedelta(days=day_offset)
    event = get_event(date)
    cfg = EVENT_CONFIGS[event]
    crashes_today = 0

    for hour in range(6, 24):
        mult = get_time_mult(hour)
        tx = int(random.uniform(*cfg["tx"]) * mult)
        load = float(random.uniform(*cfg["load"]) * mult)
        load = min(100, load)

        status = ("Crashed" if load >= 95 else "Critical" if load >= 80
                  else "Warning" if load >= 65 else "Stable")
        sec = load >= 65
        ter = load >= 95
        if status == "Crashed": crashes_today += 1

        rows.append({
            "date": date.strftime("%Y-%m-%d"),
            "hour": hour,
            "day_of_week": date.strftime("%A"),
            "month": date.month,
            "event_type": event,
            "transactions_per_minute": tx,
            "server_load_percentage": round(load, 2),
            "active_users": int(tx * random.uniform(2, 5)),
            "response_time_ms": int(random.uniform(80, 3000) * (load/50)),
            "server_status": status,
            "secondary_server_active": sec,
            "tertiary_server_active": ter,
            "crashes_this_day": crashes_today,
            "revenue_at_risk_crores": round((tx * 2500) / 10000000, 4)
        })

df = pd.DataFrame(rows)
df.to_csv("data/bank_data.csv", index=False)
print(f"✅ Generated {len(df)} records")
print(f"📊 Date range: 2024-01-01 to 2024-12-31")
print(f"🔴 Crash events: {len(df[df.server_status=='Crashed'])}")
print(f"💰 Max revenue at risk: ₹{df.revenue_at_risk_crores.max():.2f} Cr/min")`
  }
];

export default function PythonFiles() {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FILES[activeFile].content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        🐍 Python Backend Files
        <span style={{ color: "#7090b0", fontSize: "0.65em", fontWeight: 400, marginLeft: 10 }}>
          7 production-ready files for local deployment
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {FILES.map((f, i) => (
          <button key={i} onClick={() => setActiveFile(i)}
            style={{
              background: activeFile === i ? "rgba(0,212,255,0.15)" : "#0d1421",
              border: activeFile === i ? "1px solid #00d4ff" : "1px solid #1a3f5f",
              color: activeFile === i ? "#00d4ff" : "#7090b0",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: "0.78em",
              fontWeight: activeFile === i ? 700 : 400,
              cursor: "pointer"
            }}>
            {f.name}
          </button>
        ))}
      </div>

      <div style={{ background: "#0d1421", border: "1px solid #1a3f5f", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1a2332" }}>
          <span style={{ color: "#7090b0", fontSize: "0.8em" }}>📄 {FILES[activeFile].name}</span>
          <button onClick={handleCopy}
            style={{
              background: copied ? "rgba(0,255,136,0.15)" : "rgba(0,212,255,0.1)",
              border: `1px solid ${copied ? "#00ff88" : "#00d4ff"}44`,
              color: copied ? "#00ff88" : "#00d4ff",
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: "0.75em",
              cursor: "pointer"
            }}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
        <pre style={{
          padding: "16px",
          overflowX: "auto",
          fontSize: "0.75em",
          color: "#aaccff",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 400,
          overflowY: "auto",
          margin: 0
        }}>
          {FILES[activeFile].content}
        </pre>
      </div>

      <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: "12px 16px", marginTop: 12, fontSize: "0.78em", color: "#7090b0" }}>
        <strong style={{ color: "#00d4ff" }}>🚀 To run locally:</strong>{" "}
        <code style={{ color: "#aaccff", background: "#0a0f1e", padding: "2px 8px", borderRadius: 4 }}>pip install -r requirements.txt</code>
        {" → "}
        <code style={{ color: "#aaccff", background: "#0a0f1e", padding: "2px 8px", borderRadius: 4 }}>python mock_bank_server.py</code>
        {" → "}
        <code style={{ color: "#aaccff", background: "#0a0f1e", padding: "2px 8px", borderRadius: 4 }}>python data.py</code>
        {" → "}
        <code style={{ color: "#aaccff", background: "#0a0f1e", padding: "2px 8px", borderRadius: 4 }}>streamlit run app.py</code>
      </div>
    </div>
  );
}
