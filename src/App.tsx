// BankPulse AI - Main Application
// Team #119 Prompt Pirates | Aavishkar Pravah 2.0
// Aavishkar Pravah 2.0 | HKBK College of Engineering, Bangalore

import { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';
import LiveTicker from './components/LiveTicker';
import BankConnection from './components/BankConnection';
import MetricCards from './components/MetricCards';
import ServerHealth from './components/ServerHealth';
import AnalyticsCharts from './components/AnalyticsCharts';
import AIEngine from './components/AIEngine';
import FailoverSimulation from './components/FailoverSimulation';
import HistoricalAnalysis from './components/HistoricalAnalysis';
import PythonFiles from './components/PythonFiles';
import SystemStatus from './components/SystemStatus';
import { BANK_CONFIGS, SCENARIOS } from './data/bankData';
import { defaultLiveState, recalculateLiveMetrics } from './store/liveState';
import type { LiveState } from './store/liveState';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedBank, setSelectedBank] = useState("SBI");
  const [selectedScenario, setSelectedScenario] = useState("🟢 Normal Day");
  const [simHour, setSimHour] = useState(10);
  const [manualLoad, setManualLoad] = useState(35);
  const [liveMode, setLiveMode] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [bankConnected, setBankConnected] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>(defaultLiveState);
  const [liveMetrics, setLiveMetrics] = useState<Record<string, number> | null>(null);
  const [tick, setTick] = useState(0);

  const bankConfig = BANK_CONFIGS[selectedBank];
  const scenarioConfig = SCENARIOS[selectedScenario];

  const servers = bankConfig?.servers || {
    primary: "BANK-PROD-01",
    secondary: "BANK-PROD-02",
    tertiary: "BANK-PROD-03",
    load_balancer: "BANK-LB-01",
    database: "BANK-DB-01"
  };

  const recalculate = useCallback((
    failoverActive: boolean = liveState.failover_active,
    crashActive: boolean = liveState.crash_active,
    apiData: Record<string, number> | null = liveMetrics
  ) => {
    if (!bankConnected) {
      setLiveState(defaultLiveState);
      return;
    }
    const newState = recalculateLiveMetrics(
      selectedScenario,
      simHour,
      manualLoad,
      failoverActive,
      crashActive,
      servers.primary,
      servers.secondary,
      servers.tertiary,
      apiData
    );
    setLiveState(newState);
  }, [bankConnected, selectedScenario, simHour, manualLoad, liveState.failover_active, liveState.crash_active, liveMetrics, servers]);

  // Recalculate when key inputs change
  useEffect(() => {
    if (bankConnected) {
      recalculate(liveState.failover_active, liveState.crash_active, liveMetrics);
    } else {
      setLiveState(defaultLiveState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenario, simHour, manualLoad, selectedBank, bankConnected, tick]);

  // Live mode auto-refresh
  useEffect(() => {
    if (!liveMode || !bankConnected) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [liveMode, bankConnected]);

  // Auto-set load slider when scenario changes
  useEffect(() => {
    const scenario = SCENARIOS[selectedScenario];
    if (scenario) {
      const mid = Math.floor((scenario.loadRange[0] + scenario.loadRange[1]) / 2);
      setManualLoad(mid);
    }
  }, [selectedScenario]);

  const handleConnect = useCallback(() => {
    setBankConnected(true);
    // Initial recalc after connection
    const newState = recalculateLiveMetrics(
      selectedScenario,
      simHour,
      manualLoad,
      false,
      false,
      servers.primary,
      servers.secondary,
      servers.tertiary,
      null
    );
    setLiveState(newState);
  }, [selectedScenario, simHour, manualLoad, servers]);

  const handleDisconnect = useCallback(() => {
    setBankConnected(false);
    setLiveState(defaultLiveState);
    setLiveMetrics(null);
  }, []);

  const handleCrash = useCallback(() => {
    if (!bankConnected) return;
    const newState = recalculateLiveMetrics(
      selectedScenario,
      simHour,
      manualLoad,
      false,
      true,
      servers.primary,
      servers.secondary,
      servers.tertiary,
      null
    );
    setLiveState(newState);
  }, [bankConnected, selectedScenario, simHour, manualLoad, servers]);

  const handleFailover = useCallback(() => {
    if (!bankConnected) return;
    const newState = recalculateLiveMetrics(
      selectedScenario,
      simHour,
      manualLoad,
      true,
      false,
      servers.primary,
      servers.secondary,
      servers.tertiary,
      null
    );
    setLiveState(newState);
  }, [bankConnected, selectedScenario, simHour, manualLoad, servers]);

  const handleRestore = useCallback(() => {
    if (!bankConnected) return;
    const newState = recalculateLiveMetrics(
      selectedScenario,
      simHour,
      manualLoad,
      false,
      false,
      servers.primary,
      servers.secondary,
      servers.tertiary,
      null
    );
    setLiveState(newState);
  }, [bankConnected, selectedScenario, simHour, manualLoad, servers]);

  const handleBankChange = (bank: string) => {
    setSelectedBank(bank);
    if (bankConnected) {
      setBankConnected(false);
      setLiveState(defaultLiveState);
    }
  };

  if (!showDashboard) {
    return <LandingPage onLaunch={() => setShowDashboard(true)} />;
  }

  const totalRecords = 6570;
  const crashEvents = 247;

  return (
    <div style={{
      background: "#0a0f1e",
      color: "white",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1a3a5f; border-radius: 3px; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(255, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        input[type=range] { cursor: pointer; }
        button { transition: all 0.2s ease; }
        button:hover:not(:disabled) { filter: brightness(1.1); }
        select { cursor: pointer; }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar
        selectedBank={selectedBank}
        onBankChange={handleBankChange}
        selectedScenario={selectedScenario}
        onScenarioChange={setSelectedScenario}
        simHour={simHour}
        onHourChange={setSimHour}
        manualLoad={manualLoad}
        onLoadChange={setManualLoad}
        liveMode={liveMode}
        onLiveModeChange={setLiveMode}
        geminiKey={geminiKey}
        onGeminiKeyChange={setGeminiKey}
        totalRecords={totalRecords}
        crashEvents={crashEvents}
      />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", maxHeight: "100vh" }}>

        {/* SECTION 1: HEADER */}
        <Header
          scenarioName={selectedScenario}
          simHour={simHour}
          selectedBank={bankConfig?.emoji || "🏦"}
          bankCode={selectedBank}
          liveState={liveState}
          connected={bankConnected}
        />

        {/* SYSTEM STATUS BAR */}
        <SystemStatus
          liveState={liveState}
          connected={bankConnected}
          selectedBank={selectedBank}
          bankName={bankConfig?.name || selectedBank}
        />

        {/* LIVE TICKER */}
        <LiveTicker
          connected={bankConnected}
          currentTx={liveState.current_tx}
          currentLoad={liveState.current_load}
          scenario={liveState.scenario}
          revenue={liveState.revenue_per_min}
        />

        {/* SECTION 2: ALERT BANNER */}
        <AlertBanner
          load={bankConnected ? liveState.current_load : 0}
          primaryServer={servers.primary}
          secondaryServer={servers.secondary}
          connected={bankConnected}
        />

        {/* SECTION 3: BANK API CONNECTION */}
        <BankConnection
          bankConfig={bankConfig}
          connected={bankConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          liveMetrics={liveMetrics}
        />

        {/* SECTION 4: REAL-TIME METRICS */}
        <MetricCards
          liveState={bankConnected ? liveState : defaultLiveState}
          primaryServer={servers.primary}
          connected={bankConnected}
        />

        {/* SECTION 5: SERVER HEALTH MONITOR */}
        <ServerHealth
          liveState={bankConnected ? liveState : defaultLiveState}
          servers={servers}
          connected={bankConnected}
        />

        {/* SECTION 6: ANALYTICS & TRENDS */}
        <AnalyticsCharts
          liveState={bankConnected ? liveState : defaultLiveState}
          scenarioName={selectedScenario}
          simHour={simHour}
          servers={servers}
          connected={bankConnected}
        />

        {/* SECTION 7: AI PREDICTION ENGINE */}
        <AIEngine
          liveState={bankConnected ? liveState : defaultLiveState}
          scenarioName={selectedScenario}
          geminiKey={geminiKey}
          connected={bankConnected}
          primaryServer={servers.primary}
          secondaryServer={servers.secondary}
        />

        {/* SECTION 8: FAILOVER SIMULATION */}
        <FailoverSimulation
          liveState={bankConnected ? liveState : defaultLiveState}
          scenarioName={selectedScenario}
          servers={servers}
          connected={bankConnected}
          onCrash={handleCrash}
          onFailover={handleFailover}
          onRestore={handleRestore}
        />

        {/* SECTION 9: HISTORICAL ANALYSIS */}
        <HistoricalAnalysis />

        {/* SECTION 10: PYTHON FILES */}
        <PythonFiles />

        {/* SECTION 10: FOOTER */}
        <div style={{
          background: "linear-gradient(135deg, #1a1f3a, #0d1b2a)",
          border: "1px solid #1a3a5c",
          borderRadius: 15,
          padding: "30px",
          textAlign: "center",
          marginTop: 20
        }}>
          <div style={{ fontSize: "1.8em", marginBottom: 8 }}>🏦</div>
          <div style={{ color: "#00d4ff", fontWeight: 900, fontSize: "1.3em", marginBottom: 4 }}>BankPulse AI</div>
          <div style={{ color: "#7090b0", fontStyle: "italic", marginBottom: 16 }}>"Predict the Rush. Prevent the Crash."</div>
          <div style={{ borderTop: "1px solid #1a2a4a", paddingTop: 16, color: "#445566", fontSize: "0.82em", lineHeight: 2.2 }}>
            <div>Built for <strong style={{ color: "#00d4ff" }}>Aavishkar Pravah 2.0</strong></div>
            <div>HKBK College of Engineering, Bangalore</div>
            <div style={{ color: "#7b2fff" }}>Team #119 Prompt Pirates | Domain Finance</div>
            <div>24-Hour Generative AI Hackathon | Theme: Innovation Meets Intelligence</div>
            <div style={{ color: "#2a3f5f", fontSize: "0.85em", marginTop: 8 }}>⚠️ Prototype simulation — no real banking data used.</div>
          </div>
        </div>

        {/* LIVE MODE INDICATOR */}
        {liveMode && bankConnected && (
          <div style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "rgba(0,255,136,0.15)",
            border: "2px solid #00ff88",
            borderRadius: 20,
            padding: "8px 18px",
            color: "#00ff88",
            fontWeight: 700,
            fontSize: "0.85em",
            zIndex: 1000,
            boxShadow: "0 0 20px rgba(0,255,136,0.3)"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", display: "inline-block", marginRight: 8, animation: "blink 1.5s infinite" }} />
            LIVE MODE • Auto-refreshing every 3s
          </div>
        )}

        {/* SCENARIO INFO BANNER */}
        {bankConnected && scenarioConfig && (
          <div style={{
            position: "fixed",
            bottom: 20,
            left: 280,
            background: `${scenarioConfig.color}15`,
            border: `1px solid ${scenarioConfig.color}44`,
            borderRadius: 20,
            padding: "6px 16px",
            color: scenarioConfig.color,
            fontSize: "0.78em",
            fontWeight: 600,
            zIndex: 1000
          }}>
            {selectedScenario} | {scenarioConfig.desc}
          </div>
        )}
      </div>
    </div>
  );
}
