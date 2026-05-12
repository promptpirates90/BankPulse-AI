// BankPulse AI - Banking Data Configuration
// Team #119 Prompt Pirates | Aavishkar Pravah 2.0

export const BANK_CONFIGS: Record<string, BankConfig> = {
  "SBI": {
    name: "State Bank of India",
    emoji: "🏛️",
    base_url: "http://localhost:8000",
    api_key: "NBI-PROD-2024-XXXXXXXXXXX",
    bank_code: "SBI",
    swift_code: "SBININBB",
    headquarters: "Mumbai",
    founded: "1955",
    branches: "22,542",
    atms: "58,555",
    employees: "2,45,000+",
    daily_transactions: "40 Million+",
    daily_volume: "₹2.5 Lakh Crores",
    servers: {
      primary: "SBI-PROD-01",
      secondary: "SBI-PROD-02",
      tertiary: "SBI-PROD-03",
      load_balancer: "SBI-LB-01",
      database: "SBI-DB-CLUSTER-01"
    },
    color: "#1a4f9e",
    accent: "#00aaff"
  },
  "HDFC": {
    name: "HDFC Bank",
    emoji: "🏦",
    base_url: "http://localhost:8000",
    api_key: "BANKPULSE-DEMO-KEY-2024",
    bank_code: "HDFC",
    swift_code: "HDFCINBB",
    headquarters: "Mumbai",
    founded: "1994",
    branches: "7,821",
    atms: "20,000+",
    employees: "1,77,000+",
    daily_transactions: "15 Million+",
    daily_volume: "₹1.2 Lakh Crores",
    servers: {
      primary: "HDFC-PROD-01",
      secondary: "HDFC-PROD-02",
      tertiary: "HDFC-PROD-03",
      load_balancer: "HDFC-LB-01",
      database: "HDFC-DB-CLUSTER-01"
    },
    color: "#004c8f",
    accent: "#0066cc"
  },
  "ICICI": {
    name: "ICICI Bank",
    emoji: "🏧",
    base_url: "http://localhost:8000",
    api_key: "BANKPULSE-DEMO-KEY-2024",
    bank_code: "ICICI",
    swift_code: "ICICINBB",
    headquarters: "Mumbai",
    founded: "1994",
    branches: "6,523",
    atms: "16,650+",
    employees: "1,30,000+",
    daily_transactions: "12 Million+",
    daily_volume: "₹0.9 Lakh Crores",
    servers: {
      primary: "ICICI-PROD-01",
      secondary: "ICICI-PROD-02",
      tertiary: "ICICI-PROD-03",
      load_balancer: "ICICI-LB-01",
      database: "ICICI-DB-CLUSTER-01"
    },
    color: "#f58220",
    accent: "#ff9900"
  },
  "AXIS": {
    name: "Axis Bank",
    emoji: "🏢",
    base_url: "http://localhost:8000",
    api_key: "BANKPULSE-DEMO-KEY-2024",
    bank_code: "AXIS",
    swift_code: "UTIBINBB",
    headquarters: "Mumbai",
    founded: "1993",
    branches: "4,903",
    atms: "15,953+",
    employees: "85,000+",
    daily_transactions: "8 Million+",
    daily_volume: "₹0.6 Lakh Crores",
    servers: {
      primary: "AXIS-PROD-01",
      secondary: "AXIS-PROD-02",
      tertiary: "AXIS-PROD-03",
      load_balancer: "AXIS-LB-01",
      database: "AXIS-DB-CLUSTER-01"
    },
    color: "#97144d",
    accent: "#c41e6b"
  },
  "PNB": {
    name: "Punjab National Bank",
    emoji: "🏗️",
    base_url: "http://localhost:8000",
    api_key: "BANKPULSE-DEMO-KEY-2024",
    bank_code: "PNB",
    swift_code: "PUNBINBB",
    headquarters: "New Delhi",
    founded: "1894",
    branches: "10,098",
    atms: "13,000+",
    employees: "1,00,000+",
    daily_transactions: "10 Million+",
    daily_volume: "₹0.8 Lakh Crores",
    servers: {
      primary: "PNB-PROD-01",
      secondary: "PNB-PROD-02",
      tertiary: "PNB-PROD-03",
      load_balancer: "PNB-LB-01",
      database: "PNB-DB-CLUSTER-01"
    },
    color: "#e31837",
    accent: "#ff1a40"
  }
};

export interface BankConfig {
  name: string;
  emoji: string;
  base_url: string;
  api_key: string;
  bank_code: string;
  swift_code: string;
  headquarters: string;
  founded: string;
  branches: string;
  atms: string;
  employees: string;
  daily_transactions: string;
  daily_volume: string;
  servers: {
    primary: string;
    secondary: string;
    tertiary: string;
    load_balancer: string;
    database: string;
  };
  color: string;
  accent: string;
}

export interface ScenarioConfig {
  txRange: [number, number];
  loadRange: [number, number];
  usersRange: [number, number];
  responseRange: [number, number];
  event: string;
  risk: string;
  color: string;
  desc: string;
}

export const SCENARIOS: Record<string, ScenarioConfig> = {
  "🟢 Normal Day": {
    txRange: [500, 3000],
    loadRange: [15, 55],
    usersRange: [2000, 15000],
    responseRange: [80, 200],
    event: "Normal",
    risk: "LOW",
    color: "#00ff88",
    desc: "Regular banking day - All systems stable"
  },
  "🔵 Mid-Month Day": {
    txRange: [1000, 5000],
    loadRange: [25, 65],
    usersRange: [5000, 25000],
    responseRange: [100, 300],
    event: "Normal",
    risk: "LOW-MEDIUM",
    color: "#00aaff",
    desc: "Mid-month moderate traffic"
  },
  "🟡 GST Filing Day": {
    txRange: [10000, 35000],
    loadRange: [65, 88],
    usersRange: [50000, 150000],
    responseRange: [400, 800],
    event: "GST Filing",
    risk: "HIGH",
    color: "#ffcc00",
    desc: "Tax filing deadline - High business traffic"
  },
  "🔴 Salary Day (1st)": {
    txRange: [20000, 50000],
    loadRange: [78, 98],
    usersRange: [100000, 300000],
    responseRange: [600, 2000],
    event: "Salary Day",
    risk: "CRITICAL",
    color: "#ff4444",
    desc: "Month-end salary credits - EXTREME LOAD"
  },
  "🎆 Festival Season": {
    txRange: [15000, 45000],
    loadRange: [72, 96],
    usersRange: [80000, 250000],
    responseRange: [500, 1800],
    event: "Festival",
    risk: "CRITICAL",
    color: "#ff8800",
    desc: "Festival shopping surge - High payment volume"
  },
  "🛒 Flash Sale Day": {
    txRange: [12000, 38000],
    loadRange: [68, 92],
    usersRange: [60000, 200000],
    responseRange: [350, 1200],
    event: "Flash Sale",
    risk: "HIGH",
    color: "#ff6600",
    desc: "E-commerce sale - Payment gateway stress"
  },
  "📊 Year End (Mar 31)": {
    txRange: [25000, 60000],
    loadRange: [85, 100],
    usersRange: [150000, 400000],
    responseRange: [800, 3000],
    event: "Year End",
    risk: "EXTREME",
    color: "#ff0044",
    desc: "Financial year close - MAXIMUM LOAD EVENT"
  }
};

export const BRANCHES = [
  { id: "MUM001", name: "Fort Branch", city: "Mumbai", state: "Maharashtra", load: 82, status: "Busy", counters: 12, waiting: 45, atm: "Operational" },
  { id: "DEL001", name: "Connaught Place", city: "Delhi", state: "Delhi", load: 67, status: "Busy", counters: 10, waiting: 32, atm: "Operational" },
  { id: "BLR001", name: "MG Road", city: "Bangalore", state: "Karnataka", load: 55, status: "Normal", counters: 8, waiting: 18, atm: "Operational" },
  { id: "CHN001", name: "Anna Salai", city: "Chennai", state: "Tamil Nadu", load: 71, status: "Busy", counters: 9, waiting: 28, atm: "Maintenance" },
  { id: "HYD001", name: "Banjara Hills", city: "Hyderabad", state: "Telangana", load: 48, status: "Normal", counters: 7, waiting: 12, atm: "Operational" },
  { id: "KOL001", name: "Park Street", city: "Kolkata", state: "West Bengal", load: 91, status: "Overloaded", counters: 11, waiting: 67, atm: "Operational" },
  { id: "PUN001", name: "FC Road", city: "Pune", state: "Maharashtra", load: 43, status: "Normal", counters: 6, waiting: 8, atm: "Operational" },
  { id: "AHM001", name: "CG Road", city: "Ahmedabad", state: "Gujarat", load: 63, status: "Normal", counters: 8, waiting: 22, atm: "Operational" }
];

export const HISTORICAL_CRASHES = [
  { date: "01-Jan-2024", event: "New Year Rush", load: 99, duration: "47 min", impact: "₹4.2 Cr", status: "✅ Prevented" },
  { date: "01-Mar-2024", event: "Salary Day", load: 97, duration: "1.2 hrs", impact: "₹8.1 Cr", status: "✅ Prevented" },
  { date: "31-Mar-2024", event: "Year End", load: 100, duration: "2.1 hrs", impact: "₹15.3 Cr", status: "✅ Prevented" },
  { date: "15-Aug-2024", event: "Independence Day Sale", load: 94, duration: "38 min", impact: "₹3.1 Cr", status: "✅ Prevented" },
  { date: "01-Oct-2024", event: "Salary Day", load: 98, duration: "55 min", impact: "₹6.8 Cr", status: "✅ Prevented" },
  { date: "24-Oct-2024", event: "Diwali Eve", load: 96, duration: "1.4 hrs", impact: "₹9.4 Cr", status: "✅ Prevented" }
];

export const MONTHLY_CRASHES = [
  { month: "Jan", crashes: 2 },
  { month: "Feb", crashes: 1 },
  { month: "Mar", crashes: 5 },
  { month: "Apr", crashes: 1 },
  { month: "May", crashes: 2 },
  { month: "Jun", crashes: 1 },
  { month: "Jul", crashes: 2 },
  { month: "Aug", crashes: 3 },
  { month: "Sep", crashes: 1 },
  { month: "Oct", crashes: 4 },
  { month: "Nov", crashes: 2 },
  { month: "Dec", crashes: 3 }
];

export const ALERT_HISTORY = [
  { id: "ALT-001234", severity: "CRITICAL", message: "Primary DB connection pool at 89% capacity", time: "2 min ago", resolved: false, team: "IT-Ops, NOC, DevOps", resolution: null },
  { id: "ALT-001235", severity: "CRITICAL", message: "UPI transaction timeout rate spike: 12%", time: "8 min ago", resolved: false, team: "IT-Ops, NOC", resolution: null },
  { id: "ALT-001236", severity: "HIGH", message: "Load balancer SBI-LB-01 health degraded", time: "15 min ago", resolved: true, team: "IT-Ops", resolution: 12 },
  { id: "ALT-001237", severity: "HIGH", message: "Salary batch job delayed by 23 minutes", time: "22 min ago", resolved: true, team: "NOC, DevOps", resolution: 18 },
  { id: "ALT-001238", severity: "MEDIUM", message: "Cache hit ratio dropped to 71%", time: "35 min ago", resolved: true, team: "DevOps", resolution: 8 },
  { id: "ALT-001239", severity: "MEDIUM", message: "Network latency spike in Mumbai-DC-2", time: "48 min ago", resolved: true, team: "IT-Ops", resolution: 5 },
  { id: "ALT-001240", severity: "LOW", message: "Scheduled maintenance reminder: Sunday 2AM", time: "1 hr ago", resolved: true, team: "IT-Ops", resolution: 2 },
  { id: "ALT-001241", severity: "LOW", message: "Certificate renewal due in 30 days", time: "2 hrs ago", resolved: true, team: "IT-Ops", resolution: 3 }
];

export function getLoadColor(load: number): string {
  if (load >= 90) return "#8b0000";
  if (load >= 80) return "#ff4444";
  if (load >= 65) return "#ffcc00";
  return "#00ff88";
}

export function getStatusText(load: number): { text: string; cls: string } {
  if (load >= 90) return { text: "🔴 CRASHED", cls: "critical" };
  if (load >= 80) return { text: "🟠 CRITICAL", cls: "critical" };
  if (load >= 65) return { text: "🟡 WARNING", cls: "warning" };
  return { text: "🟢 STABLE", cls: "stable" };
}

export function getServerDistribution(load: number) {
  if (load >= 90) {
    return {
      primary: load * 0.45,
      secondary: load * 0.35,
      tertiary: load * 0.20,
      secActive: true,
      terActive: true
    };
  } else if (load >= 80) {
    return {
      primary: load * 0.55,
      secondary: load * 0.45,
      tertiary: 0,
      secActive: true,
      terActive: false
    };
  } else if (load >= 65) {
    return {
      primary: load * 0.65,
      secondary: load * 0.35,
      tertiary: 0,
      secActive: true,
      terActive: false
    };
  }
  return {
    primary: load,
    secondary: 5,
    tertiary: 0,
    secActive: false,
    terActive: false
  };
}

export function getTimeMultiplier(hour: number): number {
  if (hour >= 9 && hour <= 11) return 1.4;
  if (hour >= 18 && hour <= 20) return 1.2;
  if (hour < 8) return 0.4;
  return 1.0;
}

export function generateTransactionSeries(
  scenarioName: string,
  currentHour: number,
  failoverActive: boolean = false
): number[] {
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  const scenario = SCENARIOS[scenarioName];
  if (!scenario) return hours.map(() => Math.floor(Math.random() * 2000) + 500);

  const [minTx, maxTx] = scenario.txRange;
  const eventType = scenario.event;

  return hours.map(h => {
    let base = minTx + (maxTx - minTx) * 0.3;
    let mult = 1.0;

    if (h >= 9 && h <= 11) mult = 1.4;
    else if (h >= 18 && h <= 20) mult = 1.2;
    else if (h < 8) mult = 0.4;

    if (eventType === "Salary Day") {
      if (h >= 9 && h <= 11) base = maxTx * 0.95;
      else if (h >= 12 && h <= 14) base = maxTx * 0.75;
      else base = minTx + (maxTx - minTx) * 0.4;
    } else if (eventType === "Year End") {
      base = minTx + (maxTx - minTx) * 0.85;
      mult = h >= 9 && h <= 17 ? 1.2 : 1.0;
    } else if (eventType === "Festival") {
      if (h >= 18 && h <= 21) base = maxTx * 0.9;
      else if (h >= 10 && h <= 13) base = maxTx * 0.7;
      else base = minTx + (maxTx - minTx) * 0.4;
    } else if (eventType === "GST Filing") {
      if (h >= 9 && h <= 13) base = maxTx * 0.85;
      else if (h >= 17 && h <= 20) base = maxTx * 0.75;
      else base = minTx + (maxTx - minTx) * 0.3;
    } else if (eventType === "Flash Sale") {
      if (h === 10 || h === 14 || h === 20) base = maxTx * 0.9;
      else if (h >= 9 && h <= 22) base = minTx + (maxTx - minTx) * 0.6;
      else base = minTx;
    } else {
      base = minTx + (maxTx - minTx) * (0.2 + Math.sin((h - 6) * 0.5) * 0.3);
    }

    const jitter = 0.85 + Math.random() * 0.3;
    let val = Math.floor(base * mult * jitter);

    if (failoverActive && h === currentHour) {
      val = Math.floor(val * 0.65);
    }

    return Math.max(0, val);
  });
}

export function generateLoadSeries(scenarioName: string, _currentHour: number, failoverActive: boolean = false): number[] {
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  const scenario = SCENARIOS[scenarioName];
  if (!scenario) return hours.map(() => 30);

  const [minLoad, maxLoad] = scenario.loadRange;
  const eventType = scenario.event;

  return hours.map(h => {
    let base = minLoad + (maxLoad - minLoad) * 0.3;

    if (eventType === "Salary Day") {
      if (h >= 9 && h <= 11) base = maxLoad * 0.97;
      else if (h >= 12 && h <= 15) base = maxLoad * 0.82;
      else base = minLoad + (maxLoad - minLoad) * 0.5;
    } else if (eventType === "Year End") {
      base = minLoad + (maxLoad - minLoad) * 0.9;
    } else if (eventType === "Festival") {
      if (h >= 18 && h <= 21) base = maxLoad * 0.94;
      else if (h >= 10 && h <= 13) base = maxLoad * 0.75;
      else base = minLoad + (maxLoad - minLoad) * 0.35;
    } else if (eventType === "GST Filing") {
      if (h >= 9 && h <= 13) base = maxLoad * 0.88;
      else if (h >= 17 && h <= 20) base = maxLoad * 0.80;
      else base = minLoad + (maxLoad - minLoad) * 0.3;
    } else if (eventType === "Flash Sale") {
      if (h === 10 || h === 14 || h === 20) base = maxLoad * 0.92;
      else if (h >= 9 && h <= 22) base = minLoad + (maxLoad - minLoad) * 0.6;
      else base = minLoad;
    } else if (eventType === "Normal") {
      base = minLoad + (maxLoad - minLoad) * (0.2 + Math.sin((h - 6) * 0.5) * 0.4);
    }

    const jitter = 0.9 + Math.random() * 0.2;
    let val = Math.min(100, Math.floor(base * jitter));

    if (failoverActive) val = Math.floor(val * 0.6);

    return Math.max(0, val);
  });
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
