// BankPulse AI - Live State Management
// Team #119 Prompt Pirates | Aavishkar Pravah 2.0

import { getServerDistribution, getTimeMultiplier, SCENARIOS, randomBetween, generateTransactionSeries, generateLoadSeries } from '../data/bankData';

export interface LiveState {
  current_tx: number;
  current_load: number;
  current_users: number;
  current_response: number;
  revenue_per_min: number;
  primary_load: number;
  secondary_load: number;
  tertiary_load: number;
  server_status: Record<string, string>;
  traffic_distribution: Record<string, number>;
  risk_score: number;
  crash_probability: number;
  scenario: string;
  failover_active: boolean;
  crash_active: boolean;
  active_primary: string;
  last_updated: string;
  transaction_series: number[];
  load_series: number[];
  response_series: number[];
  sec_active: boolean;
  ter_active: boolean;
}

export const defaultLiveState: LiveState = {
  current_tx: 0,
  current_load: 0,
  current_users: 0,
  current_response: 0,
  revenue_per_min: 0,
  primary_load: 0,
  secondary_load: 0,
  tertiary_load: 0,
  server_status: {},
  traffic_distribution: {},
  risk_score: 0,
  crash_probability: 0,
  scenario: "Normal",
  failover_active: false,
  crash_active: false,
  active_primary: "",
  last_updated: "",
  transaction_series: Array(18).fill(0),
  load_series: Array(18).fill(0),
  response_series: Array(18).fill(0),
  sec_active: false,
  ter_active: false
};

export function recalculateLiveMetrics(
  scenarioName: string,
  simHour: number,
  manualLoad: number,
  failoverActive: boolean,
  crashActive: boolean,
  primaryServer: string,
  secondaryServer: string,
  tertiaryServer: string,
  apiData?: Record<string, number> | null
): LiveState {
  const scenario = SCENARIOS[scenarioName];
  if (!scenario) return { ...defaultLiveState };

  const timeMult = getTimeMultiplier(simHour);

  let currentTx: number;
  let currentLoad: number;
  let currentUsers: number;
  let currentResponse: number;

  if (apiData) {
    currentTx = apiData.transactions_per_minute || randomBetween(scenario.txRange[0], scenario.txRange[1]);
    currentLoad = manualLoad;
    currentUsers = apiData.active_sessions || randomBetween(scenario.usersRange[0], scenario.usersRange[1]);
    currentResponse = apiData.network_latency_ms || randomBetween(scenario.responseRange[0], scenario.responseRange[1]);
  } else {
    currentTx = Math.floor(randomBetween(scenario.txRange[0], scenario.txRange[1]) * timeMult);
    currentLoad = manualLoad;
    currentUsers = Math.floor(randomBetween(scenario.usersRange[0], scenario.usersRange[1]) * timeMult);
    currentResponse = Math.floor(randomBetween(scenario.responseRange[0], scenario.responseRange[1]) * timeMult);
  }

  if (crashActive) {
    currentTx = 0;
    currentLoad = manualLoad;
    currentUsers = 0;
    currentResponse = 9999;
  }

  if (failoverActive) {
    currentLoad = Math.floor(manualLoad * 0.58);
    currentTx = Math.floor(currentTx * 0.85);
    currentResponse = Math.floor(currentResponse * 0.35);
    currentUsers = Math.floor(currentUsers * 0.9);
  }

  const revPerMin = (currentTx * 2500) / 10000000;

  const dist = getServerDistribution(currentLoad);
  let primaryLoad = dist.primary;
  let secondaryLoad = dist.secondary;
  let tertiaryLoad = dist.tertiary;
  let secActive = dist.secActive;
  let terActive = dist.terActive;

  const trafficDist: Record<string, number> = {};
  const serverStatus: Record<string, string> = {};

  if (failoverActive) {
    primaryLoad = 0;
    secondaryLoad = Math.floor(currentLoad * 0.65);
    tertiaryLoad = Math.floor(currentLoad * 0.1);
    secActive = true;
    terActive = true;
    trafficDist[primaryServer] = 0;
    trafficDist[secondaryServer] = 95;
    trafficDist[tertiaryServer] = 5;
    serverStatus[primaryServer] = "DOWN";
    serverStatus[secondaryServer] = "ACTIVE PRIMARY";
    serverStatus[tertiaryServer] = "STANDBY";
  } else if (crashActive) {
    trafficDist[primaryServer] = 0;
    trafficDist[secondaryServer] = 0;
    trafficDist[tertiaryServer] = 0;
    serverStatus[primaryServer] = "CRASHED";
    serverStatus[secondaryServer] = secActive ? "ACTIVATING" : "STANDBY";
    serverStatus[tertiaryServer] = terActive ? "ACTIVATING" : "COLD";
  } else {
    trafficDist[primaryServer] = secActive ? 65 : 100;
    trafficDist[secondaryServer] = secActive ? (terActive ? 25 : 35) : 0;
    trafficDist[tertiaryServer] = terActive ? 10 : 0;
    serverStatus[primaryServer] = currentLoad >= 80 ? "CRITICAL" : currentLoad >= 65 ? "WARNING" : "ACTIVE";
    serverStatus[secondaryServer] = secActive ? "ACTIVE" : "STANDBY";
    serverStatus[tertiaryServer] = terActive ? "ACTIVE" : "COLD";
  }

  const riskScore = Math.min(100, Math.floor(
    (currentLoad * 0.4) +
    (Math.min(currentTx / 500, 100) * 0.3) +
    (Math.min(currentResponse / 50, 100) * 0.2) +
    (scenario.event !== "Normal" ? 20 : 0)
  ));

  const crashProb = failoverActive ? Math.floor(riskScore * 0.3) : Math.min(99, Math.floor(riskScore * 0.9 + (currentLoad > 80 ? 15 : 0)));

  const txSeries = generateTransactionSeries(scenarioName, simHour, failoverActive);
  const loadSeries = generateLoadSeries(scenarioName, simHour, failoverActive);

  return {
    current_tx: currentTx,
    current_load: currentLoad,
    current_users: currentUsers,
    current_response: currentResponse,
    revenue_per_min: revPerMin,
    primary_load: primaryLoad,
    secondary_load: secondaryLoad,
    tertiary_load: tertiaryLoad,
    server_status: serverStatus,
    traffic_distribution: trafficDist,
    risk_score: riskScore,
    crash_probability: crashProb,
    scenario: scenario.event,
    failover_active: failoverActive,
    crash_active: crashActive,
    active_primary: failoverActive ? secondaryServer : primaryServer,
    last_updated: new Date().toLocaleTimeString(),
    transaction_series: txSeries,
    load_series: loadSeries,
    response_series: Array(18).fill(0).map(() => Math.floor(randomBetween(scenario.responseRange[0], scenario.responseRange[1]))),
    sec_active: secActive,
    ter_active: terActive
  };
}
