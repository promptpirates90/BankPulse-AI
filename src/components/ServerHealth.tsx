// BankPulse AI - Server Health Monitor

import type { LiveState } from '../store/liveState';

interface ServerHealthProps {
  liveState: LiveState;
  servers: { primary: string; secondary: string; tertiary: string };
  connected: boolean;
}

interface ServerCardProps {
  name: string;
  load: number;
  role: string;
  active: boolean;
  status: string;
  isFailoverActive: boolean;
  isPrimary: boolean;
  isSecondary: boolean;
  isTertiary: boolean;
  secActive: boolean;
  terActive: boolean;
  connected: boolean;
}

function ServerCard({ name, load, role, active, status, isFailoverActive, isPrimary, isSecondary, isTertiary, secActive, terActive, connected }: ServerCardProps) {
  const displayLoad = !connected ? 0 : load;
  const displayStatus = !connected ? "OFFLINE" : status;

  let borderColor = "#2a3f5f";
  let shadowColor = "transparent";
  let glowAnim = "";

  if (!connected) {
    borderColor = "#1a2332";
  } else if (isFailoverActive && isPrimary) {
    borderColor = "#ff4444";
    shadowColor = "#ff444444";
    glowAnim = "pulse 1.5s infinite";
  } else if (active && displayLoad >= 80) {
    borderColor = "#ff4444";
    shadowColor = "#ff444433";
    glowAnim = "pulse 1.5s infinite";
  } else if (active && displayLoad >= 65) {
    borderColor = "#ffcc00";
    shadowColor = "#ffcc0022";
  } else if (active) {
    borderColor = "#00ff88";
    shadowColor = "#00ff8822";
  }

  const loadColor = !connected ? "#556" : displayLoad >= 80 ? "#ff4444" : displayLoad >= 65 ? "#ffcc00" : "#00ff88";

  let activationInfo = "";
  let activationDesc = "";
  if (isPrimary) {
    activationInfo = connected ? "Always Active | Main Production Server" : "Waiting for CBS connection...";
    activationDesc = connected ? "Uptime: 99.97% | Region: Mumbai-DC-1" : "";
  } else if (isSecondary) {
    if (!connected) {
      activationInfo = "Offline - awaiting connection";
    } else if (isFailoverActive) {
      activationInfo = "⚡ ACTIVE PRIMARY | Handling overflow traffic";
      activationDesc = `Auto-activated at failover threshold`;
    } else if (secActive) {
      activationInfo = `⚡ ACTIVE | Handling overflow traffic`;
      activationDesc = `Auto-activated at ${displayLoad.toFixed(0)}% threshold`;
    } else {
      activationInfo = "⏸️ Standby | Activates at 80% load";
      activationDesc = "Warm-up time: ~30 seconds";
    }
  } else if (isTertiary) {
    if (!connected) {
      activationInfo = "Offline - awaiting connection";
    } else if (isFailoverActive) {
      activationInfo = "⚡ EMERGENCY ASSIST";
      activationDesc = "Critical failsafe partially engaged";
    } else if (terActive) {
      activationInfo = "🚨 EMERGENCY ACTIVE";
      activationDesc = "Critical failsafe engaged";
    } else {
      activationInfo = "⚫ Cold Standby | Emergency only";
      activationDesc = "Activates at 90% threshold";
    }
  }

  const roleIcon = isPrimary ? "🟢" : isSecondary ? (secActive || isFailoverActive) ? "⚡" : "🟡" : terActive || isFailoverActive ? "🚨" : "⚫";

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a2332, #0d1b2a)",
      border: `2px solid ${borderColor}`,
      borderRadius: 15,
      padding: "22px",
      boxShadow: shadowColor !== "transparent" ? `0 0 20px ${shadowColor}` : "none",
      animation: glowAnim,
      transition: "all 0.4s ease"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: "1em", color: "#aaccff" }}>{roleIcon} {name}</div>
        <span style={{
          background: !connected ? "#22222244" : displayLoad >= 80 ? "#ff444422" : displayLoad >= 65 ? "#ffcc0022" : "#00ff8822",
          border: `1px solid ${!connected ? "#333" : loadColor}`,
          color: !connected ? "#556" : loadColor,
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: "0.72em",
          fontWeight: 700
        }}>
          {isFailoverActive && isPrimary ? "🔴 DOWN" : displayStatus}
        </span>
      </div>

      {/* Load Display */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: "3.2em", fontWeight: 900, color: loadColor, lineHeight: 1 }}>
          {isFailoverActive && isPrimary ? "0%" : `${displayLoad.toFixed(0)}%`}
        </div>
        <div style={{ color: "#556", fontSize: "0.8em", marginTop: 4 }}>Server Load</div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: "#0d1421", borderRadius: 6, height: 8, marginBottom: 16, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${isFailoverActive && isPrimary ? 0 : Math.min(100, displayLoad)}%`,
          background: `linear-gradient(90deg, ${loadColor}, ${loadColor}88)`,
          borderRadius: 6,
          transition: "width 0.5s ease"
        }} />
      </div>

      {/* Specs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14, fontSize: "0.78em" }}>
        <div style={{ color: "#556" }}>ROLE</div>
        <div style={{ color: "#aaccff" }}>{role}</div>
        <div style={{ color: "#556" }}>CPU CORES</div>
        <div style={{ color: "#aaccff" }}>32</div>
        <div style={{ color: "#556" }}>RAM</div>
        <div style={{ color: "#aaccff" }}>128GB</div>
        <div style={{ color: "#556" }}>REGION</div>
        <div style={{ color: "#aaccff" }}>Mumbai-DC-1</div>
      </div>

      {/* Activation Info */}
      <div style={{
        background: "#0d1421",
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: "0.78em"
      }}>
        <div style={{ color: connected ? loadColor : "#445566", fontWeight: 600, marginBottom: 2 }}>{activationInfo}</div>
        {activationDesc && <div style={{ color: "#445566" }}>{activationDesc}</div>}
      </div>
    </div>
  );
}

export default function ServerHealth({ liveState, servers, connected }: ServerHealthProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#00d4ff", fontSize: "1.1em", fontWeight: 800, borderBottom: "2px solid #00d4ff22", paddingBottom: 8, marginBottom: 16 }}>
        🖥️ Server Infrastructure Health
      </div>
      {!connected && (
        <div style={{ textAlign: "center", color: "#445566", padding: "20px 0", marginBottom: 12, background: "#0d1421", borderRadius: 10, fontSize: "0.9em" }}>
          🖥️ Waiting for secure CBS connection...
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <ServerCard
          name={servers.primary}
          load={connected ? liveState.primary_load : 0}
          role="PRIMARY"
          active={true}
          status={liveState.server_status[servers.primary] || "ACTIVE"}
          isFailoverActive={liveState.failover_active}
          isPrimary={true}
          isSecondary={false}
          isTertiary={false}
          secActive={liveState.sec_active}
          terActive={liveState.ter_active}
          connected={connected}
        />
        <ServerCard
          name={servers.secondary}
          load={connected ? liveState.secondary_load : 0}
          role="SECONDARY"
          active={liveState.sec_active || liveState.failover_active}
          status={liveState.server_status[servers.secondary] || "STANDBY"}
          isFailoverActive={liveState.failover_active}
          isPrimary={false}
          isSecondary={true}
          isTertiary={false}
          secActive={liveState.sec_active}
          terActive={liveState.ter_active}
          connected={connected}
        />
        <ServerCard
          name={servers.tertiary}
          load={connected ? liveState.tertiary_load : 0}
          role="TERTIARY"
          active={liveState.ter_active || liveState.failover_active}
          status={liveState.server_status[servers.tertiary] || "COLD"}
          isFailoverActive={liveState.failover_active}
          isPrimary={false}
          isSecondary={false}
          isTertiary={true}
          secActive={liveState.sec_active}
          terActive={liveState.ter_active}
          connected={connected}
        />
      </div>
    </div>
  );
}
