import React, { useState, useMemo, useRef } from "react";
import {
  LayoutDashboard, Building2, Boxes, ArrowLeftRight, CalendarClock,
  Wrench, ClipboardCheck, BarChart3, Bell, LogOut, Plus, Search,
  X, Check, ChevronRight, AlertTriangle, Tag, UserCog, Clock,
  MapPin, Package, ShieldCheck, FileWarning, CircleDot, ChevronDown,
  Filter, Trash2, Edit3, QrCode, Users, Building,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   Graphite control panel + manifest paper. Asset tags as the
   signature motif — every status/id renders as a die-cut hang-tag.
   Display: Oswald (stencil/industrial). Body: IBM Plex Sans.
   Data/mono: IBM Plex Mono.
   ============================================================ */
const C = {
  ink: "#14171A",
  graphite: "#1C1F22",
  graphite2: "#262B2F",
  paper: "#E9EBE6",
  paperCard: "#F7F6F2",
  line: "#D8D4C8",
  amber: "#E8A33D",
  amberDeep: "#C6822A",
  teal: "#2E7D6B",
  slate: "#3E5C76",
  rust: "#B5432B",
  violet: "#6C5B9E",
  muted: "#7C8079",
};

const STATUS_COLOR = {
  Available: C.teal,
  Allocated: C.slate,
  Reserved: C.amberDeep,
  "Under Maintenance": C.rust,
  Lost: "#8A1F0F",
  Retired: C.muted,
  Disposed: "#4a4c48",
};

const ROLES = ["Admin", "Asset Manager", "Department Head", "Employee"];

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .af-display { font-family: 'Oswald', sans-serif; letter-spacing: 0.02em; }
    .af-body { font-family: 'IBM Plex Sans', sans-serif; }
    .af-mono { font-family: 'IBM Plex Mono', monospace; }
    .af-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .af-scroll::-webkit-scrollbar-thumb { background: #C7C2B4; border-radius: 4px; }
    .af-tag {
      clip-path: polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%);
      position: relative;
    }
    .af-tag-hole {
      position: absolute; left: 7px; top: 50%; transform: translateY(-50%);
      width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.55);
    }
    @keyframes af-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .af-fade { animation: af-fade 0.25s ease-out; }
    .af-focus:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 2px; }
  `}</style>
);

/* ============================================================
   TAG / BADGE COMPONENTS
   ============================================================ */
function StatusTag({ status, size = "sm" }) {
  const color = STATUS_COLOR[status] || C.muted;
  const pad = size === "sm" ? "3px 10px 3px 16px" : "5px 14px 5px 20px";
  const fs = size === "sm" ? 11 : 12;
  return (
    <span
      className="af-tag af-mono af-focus"
      style={{
        background: color,
        color: "#fff",
        padding: pad,
        fontSize: fs,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
      <span className="af-tag-hole" />
      {status}
    </span>
  );
}

function AssetTagChip({ code }) {
  return (
    <span
      className="af-tag af-mono"
      style={{
        background: C.graphite,
        color: C.amber,
        padding: "3px 10px 3px 16px",
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <span className="af-tag-hole" style={{ background: "rgba(232,163,61,0.4)" }} />
      {code}
    </span>
  );
}

function RolePill({ role }) {
  const colors = {
    Admin: C.rust,
    "Asset Manager": C.slate,
    "Department Head": C.violet,
    Employee: C.teal,
  };
  return (
    <span
      className="af-body"
      style={{
        background: `${colors[role]}22`,
        color: colors[role],
        border: `1px solid ${colors[role]}55`,
        padding: "2px 9px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {role}
    </span>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={`af-fade ${className}`}
      style={{
        background: C.paperCard,
        border: `1px solid ${C.line}`,
        borderRadius: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon: Icon, disabled, style }) {
  const variants = {
    primary: { background: C.graphite, color: "#fff", border: `1px solid ${C.graphite}` },
    amber: { background: C.amber, color: C.ink, border: `1px solid ${C.amberDeep}` },
    outline: { background: "transparent", color: C.ink, border: `1px solid ${C.line}` },
    danger: { background: "transparent", color: C.rust, border: `1px solid ${C.rust}55` },
    ghost: { background: "transparent", color: C.muted, border: "1px solid transparent" },
  };
  const pad = size === "sm" ? "5px 10px" : "8px 16px";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="af-body af-focus"
      style={{
        ...variants[variant],
        padding: pad,
        borderRadius: 5,
        fontSize: size === "sm" ? 12.5 : 13.5,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="af-body" style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: `1px solid ${C.line}`,
  borderRadius: 5,
  fontSize: 13.5,
  background: "#fff",
  color: C.ink,
  fontFamily: "'IBM Plex Sans', sans-serif",
};

function Input(props) { return <input {...props} className="af-focus" style={{ ...inputStyle, ...(props.style || {}) }} />; }
function Select({ children, ...props }) { return <select {...props} className="af-focus" style={{ ...inputStyle, ...(props.style || {}) }}>{children}</select>; }
function TextArea(props) { return <textarea {...props} className="af-focus" style={{ ...inputStyle, resize: "vertical", minHeight: 70, ...(props.style || {}) }} />; }

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,23,26,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={onClose}>
      <div
        className="af-fade af-scroll"
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.paperCard, borderRadius: 8, width: wide ? 640 : 460, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", border: `1px solid ${C.line}` }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
          <h3 className="af-display" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: C.ink }}>{title}</h3>
          <button onClick={onClose} className="af-focus" style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function Empty({ icon: Icon, text, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted }}>
      <Icon size={30} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
      <div className="af-body" style={{ fontWeight: 600, fontSize: 14 }}>{text}</div>
      {sub && <div className="af-body" style={{ fontSize: 12.5, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ============================================================
   SEED DATA
   ============================================================ */
function seed() {
  const departments = [
    { id: "d1", name: "Engineering", headId: "e2", parentId: null, status: "Active" },
    { id: "d2", name: "Operations", headId: "e5", parentId: null, status: "Active" },
    { id: "d3", name: "Facilities", headId: null, parentId: "d2", status: "Active" },
  ];
  const categories = [
    { id: "c1", name: "Electronics", fields: ["Warranty Period"] },
    { id: "c2", name: "Furniture", fields: [] },
    { id: "c3", name: "Vehicles", fields: ["Registration No."] },
    { id: "c4", name: "Meeting Rooms", fields: ["Capacity"] },
  ];
  const employees = [
    { id: "e1", name: "Aayush Shah", email: "aayush@assetflow.io", deptId: "d1", role: "Admin", status: "Active" },
    { id: "e2", name: "Priya Menon", email: "priya@assetflow.io", deptId: "d1", role: "Department Head", status: "Active" },
    { id: "e3", name: "Raj Kapoor", email: "raj@assetflow.io", deptId: "d1", role: "Employee", status: "Active" },
    { id: "e4", name: "Sana Iyer", email: "sana@assetflow.io", deptId: "d2", role: "Asset Manager", status: "Active" },
    { id: "e5", name: "Dev Patel", email: "dev@assetflow.io", deptId: "d2", role: "Department Head", status: "Active" },
    { id: "e6", name: "Meera Nair", email: "meera@assetflow.io", deptId: "d3", role: "Employee", status: "Active" },
  ];
  const assets = [
    { id: "a1", tag: "AF-0001", name: "MacBook Pro 16\"", categoryId: "c1", serial: "MBP16-2291", acquisitionDate: "2024-02-10", cost: 210000, condition: "Good", location: "Engineering Wing", bookable: false, status: "Allocated", holderType: "employee", holderId: "e3", expectedReturn: "2026-08-01", history: [{ date: "2024-02-12", event: "Allocated to Raj Kapoor" }] },
    { id: "a2", tag: "AF-0002", name: "Dell UltraSharp Monitor", categoryId: "c1", serial: "DUS-4471", acquisitionDate: "2024-03-01", cost: 32000, condition: "Good", location: "Engineering Wing", bookable: false, status: "Available", holderType: null, holderId: null, expectedReturn: null, history: [] },
    { id: "a3", tag: "AF-0003", name: "Conference Room B2", categoryId: "c4", serial: "ROOM-B2", acquisitionDate: "2023-06-01", cost: 0, condition: "Good", location: "3rd Floor", bookable: true, status: "Available", holderType: null, holderId: null, expectedReturn: null, history: [] },
    { id: "a4", tag: "AF-0004", name: "Toyota Innova", categoryId: "c3", serial: "GJ07-AB-4521", acquisitionDate: "2022-11-15", cost: 1450000, condition: "Fair", location: "Motor Pool", bookable: true, status: "Under Maintenance", holderType: null, holderId: null, expectedReturn: null, history: [{ date: "2026-07-08", event: "Sent for Under Maintenance" }] },
    { id: "a5", tag: "AF-0005", name: "Ergonomic Chair", categoryId: "c2", serial: "ERG-1190", acquisitionDate: "2023-09-20", cost: 18500, condition: "Good", location: "Facilities Store", bookable: false, status: "Available", holderType: null, holderId: null, expectedReturn: null, history: [] },
    { id: "a6", tag: "AF-0006", name: "Projector EPX-200", categoryId: "c1", serial: "EPX-200-091", acquisitionDate: "2023-01-05", cost: 45000, condition: "Good", location: "3rd Floor", bookable: true, status: "Reserved", holderType: null, holderId: null, expectedReturn: null, history: [] },
    { id: "a7", tag: "AF-0007", name: "Standing Desk", categoryId: "c2", serial: "SD-3320", acquisitionDate: "2024-01-11", cost: 22000, condition: "Good", location: "Operations Floor", bookable: false, status: "Allocated", holderType: "department", holderId: "d2", expectedReturn: null, history: [] },
  ];
  const bookings = [
    { id: "b1", assetId: "a3", bookedBy: "e2", start: "2026-07-13T09:00", end: "2026-07-13T10:00", status: "Upcoming" },
    { id: "b2", assetId: "a6", bookedBy: "e5", start: "2026-07-14T14:00", end: "2026-07-14T15:30", status: "Upcoming" },
  ];
  const maintenance = [
    { id: "m1", assetId: "a4", raisedBy: "e5", issue: "Engine noise and delayed AC cooling", priority: "High", status: "In Progress", technician: "Ops Vendor - AutoCare", history: [{ date: "2026-07-08", event: "Raised by Dev Patel" }, { date: "2026-07-08", event: "Approved by Sana Iyer" }, { date: "2026-07-09", event: "Technician assigned" }] },
  ];
  const audits = [
    { id: "au1", scope: "Engineering Wing", dateRange: "2026-07-01 to 2026-07-15", auditorIds: ["e4"], status: "Open", items: [{ assetId: "a1", result: null }, { assetId: "a2", result: null }] },
  ];
  const notifications = [
    { id: "n1", type: "Maintenance Approved", message: "Toyota Innova (AF-0004) approved for maintenance", date: "2026-07-08", read: false },
    { id: "n2", type: "Booking Confirmed", message: "Conference Room B2 booked 09:00\u201310:00, Jul 13", date: "2026-07-11", read: false },
    { id: "n3", type: "Overdue Return Alert", message: "Laptop AF-0114 style check \u2014 no overdue items currently", date: "2026-07-10", read: true },
  ];
  const logs = [
    { id: "l1", actor: "Priya Menon", action: "Booked Conference Room B2 for Jul 13, 09:00\u201310:00", date: "2026-07-11 09:12" },
    { id: "l2", actor: "Sana Iyer", action: "Approved maintenance request for AF-0004", date: "2026-07-08 11:03" },
    { id: "l3", actor: "Aayush Shah", action: "Promoted Sana Iyer to Asset Manager", date: "2026-06-30 16:40" },
  ];
  return { departments, categories, employees, assets, bookings, maintenance, audits, notifications, logs, nextAssetNum: 8, nextIds: {} };
}

const idc = (() => { let n = 100; return (p) => `${p}${n++}`; })();

/* ============================================================
   LOGIN SCREEN
   ============================================================ */
function LoginScreen({ employees, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [deptId, setDeptId] = useState("");
  const [error, setError] = useState("");
  const departmentsDemo = [{ id: "d1", name: "Engineering" }, { id: "d2", name: "Operations" }, { id: "d3", name: "Facilities" }];

  const handleLogin = () => {
    const found = employees.find((e) => e.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) { setError("No account matches that email. Try one of the demo accounts below, or sign up."); return; }
    if (found.status !== "Active") { setError("This account is inactive. Contact your Admin."); return; }
    onLogin(found);
  };

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !deptId) { setError("Fill in your name, email, and department to continue."); return; }
    if (employees.some((e) => e.email.toLowerCase() === email.toLowerCase().trim())) { setError("An account with this email already exists."); return; }
    onSignup({ name: name.trim(), email: email.trim(), deptId });
  };

  return (
    <div className="af-body" style={{ minHeight: "100vh", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <FontStyles />
      <div style={{ width: 420, maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div className="af-tag" style={{ background: C.amber, width: 30, height: 26, position: "relative" }}><span className="af-tag-hole" style={{ background: "rgba(20,23,26,0.4)" }} /></div>
            <span className="af-display" style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>ASSETFLOW</span>
          </div>
          <div style={{ color: "#9AA0A6", fontSize: 12.5, letterSpacing: "0.04em" }}>ENTERPRISE ASSET & RESOURCE MANAGEMENT</div>
        </div>

        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 18, background: C.paper, padding: 4, borderRadius: 6 }}>
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} className="af-focus"
                style={{ flex: 1, padding: "8px 0", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "capitalize", background: mode === m ? C.graphite : "transparent", color: mode === m ? "#fff" : C.muted }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <>
              <Field label="Work Email">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@assetflow.io" />
              </Field>
              <Field label="Password">
                <Input type="password" placeholder="••••••••" />
              </Field>
              {error && <div style={{ color: C.rust, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
              <Btn variant="amber" onClick={handleLogin} style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>Log In</Btn>
              <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginBottom: 16, cursor: "pointer" }}>Forgot password?</div>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Demo Accounts — one click sign-in</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {employees.slice(0, 4).map((e) => (
                  <button key={e.id} onClick={() => onLogin(e)} className="af-focus" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 5, padding: "8px 10px", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{e.name}</span>
                    <RolePill role={e.role} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, background: C.paper, padding: "8px 10px", borderRadius: 5 }}>
                Signup creates an <b>Employee</b> account only. Admins promote to Department Head or Asset Manager from the Employee Directory.
              </div>
              <Field label="Full Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
              <Field label="Work Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@assetflow.io" /></Field>
              <Field label="Department">
                <Select value={deptId} onChange={(e) => setDeptId(e.target.value)}>
                  <option value="">Select department</option>
                  {departmentsDemo.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              </Field>
              <Field label="Password"><Input type="password" placeholder="Create a password" /></Field>
              {error && <div style={{ color: C.rust, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
              <Btn variant="amber" onClick={handleSignup} style={{ width: "100%", justifyContent: "center" }}>Create Employee Account</Btn>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ROLES },
  { key: "org", label: "Organization Setup", icon: Building2, roles: ["Admin"] },
  { key: "assets", label: "Asset Directory", icon: Boxes, roles: ROLES },
  { key: "allocation", label: "Allocation & Transfer", icon: ArrowLeftRight, roles: ROLES },
  { key: "booking", label: "Resource Booking", icon: CalendarClock, roles: ROLES },
  { key: "maintenance", label: "Maintenance", icon: Wrench, roles: ROLES },
  { key: "audit", label: "Asset Audit", icon: ClipboardCheck, roles: ROLES },
  { key: "reports", label: "Reports & Analytics", icon: BarChart3, roles: ["Admin", "Asset Manager", "Department Head"] },
  { key: "logs", label: "Logs & Notifications", icon: Bell, roles: ROLES },
];

function Sidebar({ screen, setScreen, user, onLogout }) {
  return (
    <div style={{ width: 232, background: C.graphite, color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "20px 18px", borderBottom: "1px solid #2E3336" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="af-tag" style={{ background: C.amber, width: 24, height: 20 }}><span className="af-tag-hole" style={{ background: "rgba(20,23,26,0.4)", width: 4, height: 4 }} /></div>
          <span className="af-display" style={{ fontSize: 19, fontWeight: 700 }}>ASSETFLOW</span>
        </div>
      </div>
      <div className="af-scroll" style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {NAV.filter((n) => n.roles.includes(user.role)).map((n) => {
          const Icon = n.icon;
          const active = screen === n.key;
          return (
            <button key={n.key} onClick={() => setScreen(n.key)} className="af-body af-focus"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 3, borderRadius: 5, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 500, background: active ? C.amber : "transparent", color: active ? C.ink : "#C6CACD" }}>
              <Icon size={16} />{n.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: 14, borderTop: "1px solid #2E3336" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.amber, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
            {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <RolePill role={user.role} />
          </div>
        </div>
        <Btn variant="ghost" icon={LogOut} size="sm" onClick={onLogout} style={{ width: "100%", justifyContent: "center", color: "#C6CACD", border: "1px solid #34393C" }}>Log Out</Btn>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ data, user, setScreen, openQuick }) {
  const { assets, bookings, maintenance, employees, departments } = data;
  const today = "2026-07-12";
  const kpis = [
    { label: "Assets Available", value: assets.filter((a) => a.status === "Available").length, color: C.teal },
    { label: "Assets Allocated", value: assets.filter((a) => a.status === "Allocated").length, color: C.slate },
    { label: "Maintenance Today", value: maintenance.filter((m) => !["Resolved", "Rejected"].includes(m.status)).length, color: C.rust },
    { label: "Active Bookings", value: bookings.filter((b) => b.status === "Upcoming" || b.status === "Ongoing").length, color: C.amberDeep },
    { label: "Pending Transfers", value: (data.transfers || []).filter((t) => t.status === "Requested").length, color: C.violet },
    { label: "Upcoming Returns", value: assets.filter((a) => a.expectedReturn && a.expectedReturn >= today).length, color: C.muted },
  ];
  const overdue = assets.filter((a) => a.expectedReturn && a.expectedReturn < today);
  const upcoming = assets.filter((a) => a.expectedReturn && a.expectedReturn >= today);
  const empName = (id) => employees.find((e) => e.id === id)?.name || "\u2014";

  return (
    <div className="af-fade">
      <ScreenHeader title="Dashboard" sub={`Welcome back, ${user.name.split(" ")[0]}. Here's today's operational snapshot.`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ padding: "16px 16px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: k.color, marginBottom: 10 }} />
            <div className="af-display" style={{ fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{k.value}</div>
            <div className="af-body" style={{ fontSize: 12, color: C.muted, marginTop: 6, fontWeight: 500 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 22 }}>
        <Card style={{ padding: 18 }}>
          <SectionTitle icon={AlertTriangle} color={C.rust} title="Overdue Returns" />
          {overdue.length === 0 ? <Empty icon={ShieldCheck} text="Nothing overdue" sub="All allocated assets are within their expected return window." /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {overdue.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", background: "#FBEEE9", borderRadius: 5, border: `1px solid ${C.rust}33` }}>
                  <div><AssetTagChip code={a.tag} /> <span style={{ fontSize: 12.5, marginLeft: 8, fontWeight: 600 }}>{a.name}</span></div>
                  <div style={{ fontSize: 11.5, color: C.rust, fontWeight: 600 }}>Due {a.expectedReturn} · {empName(a.holderId)}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <SectionTitle icon={Clock} color={C.amberDeep} title="Upcoming Returns" />
            {upcoming.length === 0 ? <Empty icon={Clock} text="No returns scheduled" /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {upcoming.map((a) => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", background: C.paper, borderRadius: 5 }}>
                    <div><AssetTagChip code={a.tag} /> <span style={{ fontSize: 12.5, marginLeft: 8, fontWeight: 600 }}>{a.name}</span></div>
                    <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Due {a.expectedReturn} · {empName(a.holderId)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <SectionTitle icon={Plus} color={C.ink} title="Quick Actions" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <Btn variant="amber" icon={Package} onClick={() => openQuick("register")} style={{ justifyContent: "flex-start" }}>Register Asset</Btn>
            <Btn variant="outline" icon={CalendarClock} onClick={() => openQuick("book")} style={{ justifyContent: "flex-start" }}>Book Resource</Btn>
            <Btn variant="outline" icon={Wrench} onClick={() => openQuick("maint")} style={{ justifyContent: "flex-start" }}>Raise Maintenance Request</Btn>
          </div>
          <div style={{ marginTop: 20 }}>
            <SectionTitle icon={Building} color={C.ink} title="Departments" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
              {departments.map((d) => {
                const count = assets.filter((a) => (a.holderType === "department" && a.holderId === d.id) || (a.holderType === "employee" && employees.find((e) => e.id === a.holderId)?.deptId === d.id)).length;
                return (
                  <div key={d.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 2px", borderBottom: `1px solid ${C.line}` }}>
                    <span style={{ fontWeight: 600 }}>{d.name}</span>
                    <span className="af-mono" style={{ color: C.muted }}>{count} assets</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ScreenHeader({ title, sub, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
      <div>
        <h1 className="af-display" style={{ fontSize: 26, fontWeight: 600, color: C.ink, margin: 0 }}>{title}</h1>
        {sub && <p className="af-body" style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, color = C.ink }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <Icon size={15} color={color} />
      <span className="af-display" style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, letterSpacing: "0.01em" }}>{title}</span>
    </div>
  );
}

/* ============================================================
   ORGANIZATION SETUP (Admin)
   ============================================================ */
function OrgSetup({ data, actions }) {
  const [tab, setTab] = useState("dept");
  const { departments, categories, employees } = data;
  const [deptModal, setDeptModal] = useState(null);
  const [catModal, setCatModal] = useState(null);
  const [promoteEmp, setPromoteEmp] = useState(null);

  return (
    <div className="af-fade">
      <ScreenHeader title="Organization Setup" sub="Master data everything else depends on. Admin only." />
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[["dept", "Departments"], ["cat", "Asset Categories"], ["emp", "Employee Directory"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="af-body af-focus"
            style={{ padding: "8px 16px", borderRadius: 5, border: `1px solid ${tab === k ? C.graphite : C.line}`, background: tab === k ? C.graphite : "#fff", color: tab === k ? "#fff" : C.ink, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "dept" && (
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <Btn variant="amber" icon={Plus} size="sm" onClick={() => setDeptModal({})}>New Department</Btn>
          </div>
          <Table headers={["Department", "Head", "Parent", "Status", ""]}>
            {departments.map((d) => (
              <tr key={d.id}>
                <Td><b>{d.name}</b></Td>
                <Td>{employees.find((e) => e.id === d.headId)?.name || <span style={{ color: C.muted }}>Unassigned</span>}</Td>
                <Td>{departments.find((p) => p.id === d.parentId)?.name || "\u2014"}</Td>
                <Td><StatusPill ok={d.status === "Active"} label={d.status} /></Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <IconBtn icon={Edit3} onClick={() => setDeptModal(d)} />
                    <IconBtn icon={d.status === "Active" ? Trash2 : Check} onClick={() => actions.toggleDept(d.id)} />
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === "cat" && (
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <Btn variant="amber" icon={Plus} size="sm" onClick={() => setCatModal({})}>New Category</Btn>
          </div>
          <Table headers={["Category", "Custom Fields", ""]}>
            {categories.map((c) => (
              <tr key={c.id}>
                <Td><b>{c.name}</b></Td>
                <Td>{c.fields.length ? c.fields.join(", ") : <span style={{ color: C.muted }}>None</span>}</Td>
                <Td><IconBtn icon={Edit3} onClick={() => setCatModal(c)} /></Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === "emp" && (
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, background: C.paper, padding: "8px 10px", borderRadius: 5 }}>
            This is the only screen where roles are assigned. Promote employees to Department Head or Asset Manager here.
          </div>
          <Table headers={["Name", "Email", "Department", "Role", "Status", ""]}>
            {employees.map((e) => (
              <tr key={e.id}>
                <Td><b>{e.name}</b></Td>
                <Td className="af-mono" style={{ fontSize: 12 }}>{e.email}</Td>
                <Td>{departments.find((d) => d.id === e.deptId)?.name || "\u2014"}</Td>
                <Td><RolePill role={e.role} /></Td>
                <Td><StatusPill ok={e.status === "Active"} label={e.status} /></Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="outline" onClick={() => setPromoteEmp(e)}>Promote</Btn>
                    <IconBtn icon={e.status === "Active" ? Trash2 : Check} onClick={() => actions.toggleEmp(e.id)} />
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {deptModal && (
        <Modal title={deptModal.id ? "Edit Department" : "New Department"} onClose={() => setDeptModal(null)}>
          <DeptForm dept={deptModal} employees={employees} departments={departments}
            onSave={(v) => { actions.saveDept(deptModal.id, v); setDeptModal(null); }} />
        </Modal>
      )}
      {catModal && (
        <Modal title={catModal.id ? "Edit Category" : "New Category"} onClose={() => setCatModal(null)}>
          <CatForm cat={catModal} onSave={(v) => { actions.saveCat(catModal.id, v); setCatModal(null); }} />
        </Modal>
      )}
      {promoteEmp && (
        <Modal title={`Promote ${promoteEmp.name}`} onClose={() => setPromoteEmp(null)}>
          <p className="af-body" style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Assign a new role. This is the only place roles change hands.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Employee", "Department Head", "Asset Manager"].map((r) => (
              <button key={r} onClick={() => { actions.promote(promoteEmp.id, r); setPromoteEmp(null); }} className="af-focus"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 5, border: `1px solid ${promoteEmp.role === r ? C.amberDeep : C.line}`, background: promoteEmp.role === r ? "#FBF2E2" : "#fff", cursor: "pointer" }}>
                <RolePill role={r} />
                {promoteEmp.role === r && <span style={{ fontSize: 11, color: C.amberDeep, fontWeight: 600 }}>Current</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function DeptForm({ dept, employees, departments, onSave }) {
  const [name, setName] = useState(dept.name || "");
  const [headId, setHeadId] = useState(dept.headId || "");
  const [parentId, setParentId] = useState(dept.parentId || "");
  const [status, setStatus] = useState(dept.status || "Active");
  return (
    <div>
      <Field label="Department Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Engineering" /></Field>
      <Field label="Department Head">
        <Select value={headId} onChange={(e) => setHeadId(e.target.value)}>
          <option value="">Unassigned</option>
          {employees.filter((e) => e.role === "Department Head" || e.role === "Admin").map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </Select>
      </Field>
      <Field label="Parent Department (optional)">
        <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">None</option>
          {departments.filter((d) => d.id !== dept.id).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
      </Field>
      <Field label="Status">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Active</option><option>Inactive</option>
        </Select>
      </Field>
      <Btn variant="amber" onClick={() => name.trim() && onSave({ name: name.trim(), headId: headId || null, parentId: parentId || null, status })} style={{ width: "100%", justifyContent: "center" }}>Save Department</Btn>
    </div>
  );
}

function CatForm({ cat, onSave }) {
  const [name, setName] = useState(cat.name || "");
  const [fields, setFields] = useState((cat.fields || []).join(", "));
  return (
    <div>
      <Field label="Category Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics" /></Field>
      <Field label="Custom Fields (comma separated)"><Input value={fields} onChange={(e) => setFields(e.target.value)} placeholder="e.g. Warranty Period, Voltage" /></Field>
      <Btn variant="amber" onClick={() => name.trim() && onSave({ name: name.trim(), fields: fields.split(",").map((f) => f.trim()).filter(Boolean) })} style={{ width: "100%", justifyContent: "center" }}>Save Category</Btn>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="af-scroll" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.line}` }}>
            {headers.map((h, i) => <th key={i} className="af-body" style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: C.muted, fontWeight: 600 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Td({ children, className, style }) { return <td className={`af-body ${className || ""}`} style={{ padding: "10px 10px", fontSize: 13, borderBottom: `1px solid ${C.line}`, color: C.ink, ...style }}>{children}</td>; }
function IconBtn({ icon: Icon, onClick, color }) {
  return <button onClick={onClick} className="af-focus" style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 4, padding: 6, cursor: "pointer", color: color || C.ink, display: "flex" }}><Icon size={13} /></button>;
}
function StatusPill({ ok, label }) {
  return <span style={{ fontSize: 11, fontWeight: 600, color: ok ? C.teal : C.rust, background: ok ? "#E6F2EE" : "#FBEEE9", padding: "3px 9px", borderRadius: 10 }}>{label}</span>;
}

/* ============================================================
   ASSET DIRECTORY
   ============================================================ */
function AssetDirectory({ data, actions, initialModalOpen, onModalHandled }) {
  const { assets, categories } = data;
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [showNew, setShowNew] = useState(!!initialModalOpen);
  const [detail, setDetail] = useState(null);

  const filtered = assets.filter((a) => {
    const matchQ = !q || a.tag.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase()) || a.serial.toLowerCase().includes(q.toLowerCase()) || a.location.toLowerCase().includes(q.toLowerCase());
    const matchS = statusFilter === "All" || a.status === statusFilter;
    const matchC = catFilter === "All" || a.categoryId === catFilter;
    return matchQ && matchS && matchC;
  });

  return (
    <div className="af-fade">
      <ScreenHeader title="Asset Directory" sub="Register assets and search / track them centrally."
        right={<Btn variant="amber" icon={Plus} onClick={() => setShowNew(true)}>Register Asset</Btn>} />

      <Card style={{ padding: 14, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.muted }} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tag, serial, name, location\u2026" style={{ paddingLeft: 30 }} />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
          <option>All</option>
          {Object.keys(STATUS_COLOR).map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ width: 170 }}>
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 12 }}>
        {filtered.map((a) => (
          <Card key={a.id} style={{ padding: 16, cursor: "pointer" }}>
            <div onClick={() => setDetail(a)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <AssetTagChip code={a.tag} />
                <StatusTag status={a.status} />
              </div>
              <div className="af-display" style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 4 }}>{a.name}</div>
              <div className="af-mono" style={{ fontSize: 11.5, color: C.muted, marginBottom: 8 }}>SN: {a.serial}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.muted }}>
                <MapPin size={12} />{a.location}
              </div>
              {a.bookable && <div style={{ marginTop: 8 }}><span style={{ fontSize: 10.5, fontWeight: 600, color: C.amberDeep, background: "#FBF2E2", padding: "2px 8px", borderRadius: 8 }}>SHARED / BOOKABLE</span></div>}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1" }}><Empty icon={Search} text="No assets match your filters" /></div>}
      </div>

      {showNew && <Modal title="Register Asset" onClose={() => { setShowNew(false); onModalHandled && onModalHandled(); }}>
        <AssetForm categories={categories} onSave={(v) => { actions.registerAsset(v); setShowNew(false); onModalHandled && onModalHandled(); }} />
      </Modal>}

      {detail && <Modal title={detail.name} onClose={() => setDetail(null)} wide>
        <AssetDetail asset={detail} data={data} />
      </Modal>}
    </div>
  );
}

function AssetForm({ categories, onSave }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [serial, setSerial] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("2026-07-12");
  const [cost, setCost] = useState("");
  const [condition, setCondition] = useState("Good");
  const [location, setLocation] = useState("");
  const [bookable, setBookable] = useState(false);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Asset Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HP LaserJet Printer" /></Field>
        <Field label="Category">
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
        <Field label="Serial Number"><Input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Manufacturer serial no." /></Field>
        <Field label="Acquisition Date"><Input type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} /></Field>
        <Field label="Acquisition Cost (\u20b9)"><Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="For reporting only" /></Field>
        <Field label="Condition">
          <Select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option>Good</option><option>Fair</option><option>Poor</option>
          </Select>
        </Field>
        <Field label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Engineering Wing" /></Field>
        <Field label="Shared / Bookable">
          <Select value={bookable ? "yes" : "no"} onChange={(e) => setBookable(e.target.value === "yes")}>
            <option value="no">No — assigned to individuals</option>
            <option value="yes">Yes — shared resource</option>
          </Select>
        </Field>
      </div>
      <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 14 }}>Asset Tag will be auto-generated (e.g. AF-0008) on save.</div>
      <Btn variant="amber" disabled={!name.trim() || !serial.trim() || !location.trim()} onClick={() => onSave({ name: name.trim(), categoryId, serial: serial.trim(), acquisitionDate, cost: Number(cost) || 0, condition, location: location.trim(), bookable })} style={{ width: "100%", justifyContent: "center" }}>Register Asset</Btn>
    </div>
  );
}

function AssetDetail({ asset, data }) {
  const cat = data.categories.find((c) => c.id === asset.categoryId);
  const holderLabel = asset.holderType === "employee" ? data.employees.find((e) => e.id === asset.holderId)?.name : asset.holderType === "department" ? data.departments.find((d) => d.id === asset.holderId)?.name : "\u2014";
  const maint = data.maintenance.filter((m) => m.assetId === asset.id);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <AssetTagChip code={asset.tag} />
        <StatusTag status={asset.status} />
        {asset.bookable && <span style={{ fontSize: 10.5, fontWeight: 600, color: C.amberDeep, background: "#FBF2E2", padding: "3px 9px", borderRadius: 8 }}>BOOKABLE</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18, fontSize: 13 }}>
        <DetailRow label="Category" value={cat?.name} />
        <DetailRow label="Serial Number" value={asset.serial} mono />
        <DetailRow label="Location" value={asset.location} />
        <DetailRow label="Condition" value={asset.condition} />
        <DetailRow label="Acquisition Date" value={asset.acquisitionDate} />
        <DetailRow label="Acquisition Cost" value={asset.cost ? `\u20b9${asset.cost.toLocaleString("en-IN")}` : "\u2014"} />
        <DetailRow label="Current Holder" value={holderLabel} />
        <DetailRow label="Expected Return" value={asset.expectedReturn || "\u2014"} />
      </div>
      <SectionTitle icon={Clock} title="Allocation History" />
      <div style={{ margin: "10px 0 18px" }}>
        {asset.history.length === 0 ? <div style={{ fontSize: 12.5, color: C.muted }}>No history yet.</div> :
          asset.history.map((h, i) => <TimelineRow key={i} date={h.date} event={h.event} />)}
      </div>
      <SectionTitle icon={Wrench} title="Maintenance History" />
      <div style={{ marginTop: 10 }}>
        {maint.length === 0 ? <div style={{ fontSize: 12.5, color: C.muted }}>No maintenance activity.</div> :
          maint.map((m) => (
            <div key={m.id} style={{ marginBottom: 8, padding: 10, background: C.paper, borderRadius: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 12.5 }}>{m.issue}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.rust }}>{m.status}</span>
              </div>
              {m.history.map((h, i) => <TimelineRow key={i} date={h.date} event={h.event} small />)}
            </div>
          ))}
      </div>
    </div>
  );
}
function DetailRow({ label, value, mono }) {
  return <div><div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>{label}</div><div className={mono ? "af-mono" : ""} style={{ fontWeight: 600 }}>{value || "\u2014"}</div></div>;
}
function TimelineRow({ date, event, small }) {
  return (
    <div style={{ display: "flex", gap: 8, fontSize: small ? 11.5 : 12.5, marginBottom: 6, alignItems: "flex-start" }}>
      <CircleDot size={11} style={{ marginTop: 2, color: C.amberDeep, flexShrink: 0 }} />
      <div><span className="af-mono" style={{ color: C.muted }}>{date}</span> — {event}</div>
    </div>
  );
}

/* ============================================================
   ALLOCATION & TRANSFER
   ============================================================ */
function Allocation({ data, actions, user }) {
  const { assets, employees, departments, transfers = [] } = data;
  const [allocModal, setAllocModal] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [returnModal, setReturnModal] = useState(null);
  const today = "2026-07-12";

  const holderLabel = (a) => a.holderType === "employee" ? employees.find((e) => e.id === a.holderId)?.name : a.holderType === "department" ? departments.find((d) => d.id === a.holderId)?.name : "\u2014";

  return (
    <div className="af-fade">
      <ScreenHeader title="Asset Allocation & Transfer" sub="Manage who holds what, with explicit conflict rules." />

      {transfers.filter((t) => t.status === "Requested").length > 0 && (
        <Card style={{ padding: 14, marginBottom: 16, border: `1px solid ${C.amberDeep}55`, background: "#FBF2E2" }}>
          <SectionTitle icon={ArrowLeftRight} color={C.amberDeep} title="Pending Transfer Requests" />
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {transfers.filter((t) => t.status === "Requested").map((t) => {
              const asset = assets.find((a) => a.id === t.assetId);
              return (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "9px 12px", borderRadius: 5 }}>
                  <div style={{ fontSize: 12.5 }}>
                    <AssetTagChip code={asset?.tag} /> <b style={{ marginLeft: 6 }}>{asset?.name}</b> \u2192 {employees.find((e) => e.id === t.toId)?.name}
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Requested by {employees.find((e) => e.id === t.requestedBy)?.name}</div>
                  </div>
                  {(user.role === "Admin" || user.role === "Asset Manager" || user.role === "Department Head") && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="amber" icon={Check} onClick={() => actions.approveTransfer(t.id)}>Approve</Btn>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Table headers={["Asset", "Status", "Holder", "Expected Return", ""]}>
        {assets.map((a) => (
          <tr key={a.id}>
            <Td><AssetTagChip code={a.tag} /> <span style={{ marginLeft: 8, fontWeight: 600 }}>{a.name}</span></Td>
            <Td><StatusTag status={a.status} /></Td>
            <Td>{holderLabel(a)}</Td>
            <Td className={a.expectedReturn && a.expectedReturn < today ? "" : undefined} style={a.expectedReturn && a.expectedReturn < today ? { color: C.rust, fontWeight: 600 } : {}}>{a.expectedReturn || "\u2014"}</Td>
            <Td>
              <div style={{ display: "flex", gap: 6 }}>
                {a.status === "Available" && <Btn size="sm" variant="outline" onClick={() => setAllocModal(a)}>Allocate</Btn>}
                {a.status === "Allocated" && <>
                  <Btn size="sm" variant="outline" onClick={() => setReturnModal(a)}>Return</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setAllocModal(a)}>Transfer</Btn>
                </>}
              </div>
            </Td>
          </tr>
        ))}
      </Table>

      {allocModal && (
        <Modal title={allocModal.status === "Allocated" ? "Request Transfer" : "Allocate Asset"} onClose={() => { setAllocModal(null); setConflict(null); }}>
          <AllocForm asset={allocModal} employees={employees} departments={departments} conflict={conflict}
            onAllocate={(v) => {
              if (allocModal.status === "Allocated") {
                actions.requestTransfer(allocModal.id, v.holderId, user.id);
                setAllocModal(null);
              } else {
                actions.allocateAsset(allocModal.id, v.holderType, v.holderId, v.expectedReturn);
                setAllocModal(null);
              }
            }} />
        </Modal>
      )}

      {returnModal && (
        <Modal title={`Return ${returnModal.name}`} onClose={() => setReturnModal(null)}>
          <ReturnForm onSave={(notes) => { actions.returnAsset(returnModal.id, notes); setReturnModal(null); }} />
        </Modal>
      )}
    </div>
  );
}

function AllocForm({ asset, employees, departments, onAllocate }) {
  const [holderType, setHolderType] = useState("employee");
  const [holderId, setHolderId] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const isTransfer = asset.status === "Allocated";
  const currentHolderName = asset.holderType === "employee" ? employees.find((e) => e.id === asset.holderId)?.name : departments.find((d) => d.id === asset.holderId)?.name;

  return (
    <div>
      {isTransfer && (
        <div style={{ background: "#FBEEE9", border: `1px solid ${C.rust}44`, borderRadius: 5, padding: 10, marginBottom: 14, fontSize: 12.5 }}>
          <FileWarning size={13} style={{ marginRight: 5, color: C.rust }} />
          <b>{asset.name}</b> is currently held by <b>{currentHolderName}</b>. This action will raise a <b>Transfer Request</b> instead of a direct allocation.
        </div>
      )}
      {!isTransfer && (
        <Field label="Allocate To">
          <Select value={holderType} onChange={(e) => { setHolderType(e.target.value); setHolderId(""); }}>
            <option value="employee">Employee</option>
            <option value="department">Department</option>
          </Select>
        </Field>
      )}
      <Field label={holderType === "employee" ? "Employee" : "Department"}>
        <Select value={holderId} onChange={(e) => setHolderId(e.target.value)}>
          <option value="">Select\u2026</option>
          {(holderType === "employee" ? employees : departments).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </Select>
      </Field>
      {!isTransfer && <Field label="Expected Return Date (optional)"><Input type="date" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} /></Field>}
      <Btn variant="amber" disabled={!holderId} onClick={() => onAllocate({ holderType, holderId, expectedReturn: expectedReturn || null })} style={{ width: "100%", justifyContent: "center" }}>
        {isTransfer ? "Send Transfer Request" : "Allocate Asset"}
      </Btn>
    </div>
  );
}

function ReturnForm({ onSave }) {
  const [notes, setNotes] = useState("");
  const [condition, setCondition] = useState("Good");
  return (
    <div>
      <Field label="Condition Check-in"><Select value={condition} onChange={(e) => setCondition(e.target.value)}><option>Good</option><option>Fair</option><option>Poor</option></Select></Field>
      <Field label="Notes"><TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any observations on return\u2026" /></Field>
      <Btn variant="amber" onClick={() => onSave(`${condition} — ${notes || "No additional notes"}`)} style={{ width: "100%", justifyContent: "center" }}>Confirm Return</Btn>
    </div>
  );
}

/* ============================================================
   RESOURCE BOOKING
   ============================================================ */
function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function ResourceBooking({ data, actions, user, initialModalOpen, onModalHandled }) {
  const { assets, bookings, employees } = data;
  const bookable = assets.filter((a) => a.bookable);
  const [selectedId, setSelectedId] = useState(bookable[0]?.id || "");
  const [showNew, setShowNew] = useState(!!initialModalOpen);
  const selected = assets.find((a) => a.id === selectedId);
  const relatedBookings = bookings.filter((b) => b.assetId === selectedId && b.status !== "Cancelled").sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="af-fade">
      <ScreenHeader title="Resource Booking" sub="Time-slot booking of shared resources with no overlaps."
        right={<Btn variant="amber" icon={Plus} onClick={() => setShowNew(true)}>New Booking</Btn>} />

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        <Card style={{ padding: 10 }}>
          {bookable.map((a) => (
            <button key={a.id} onClick={() => setSelectedId(a.id)} className="af-focus"
              style={{ width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 5, border: "none", cursor: "pointer", marginBottom: 4, background: selectedId === a.id ? C.graphite : "transparent", color: selectedId === a.id ? "#fff" : C.ink }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{a.location}</div>
            </button>
          ))}
        </Card>

        <Card style={{ padding: 18 }}>
          {selected && <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div><AssetTagChip code={selected.tag} /> <span style={{ marginLeft: 8, fontWeight: 700, fontSize: 15 }}>{selected.name}</span></div>
              <StatusTag status={selected.status} />
            </div>
            <SectionTitle icon={CalendarClock} title="Bookings" />
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {relatedBookings.length === 0 ? <Empty icon={CalendarClock} text="No bookings yet" sub="This resource is wide open." /> :
                relatedBookings.map((b) => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.paper, padding: "10px 12px", borderRadius: 5 }}>
                    <div>
                      <div className="af-mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{b.start.replace("T", " ")} \u2192 {b.end.split("T")[1]}</div>
                      <div style={{ fontSize: 11.5, color: C.muted }}>Booked by {employees.find((e) => e.id === b.bookedBy)?.name}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <BookingStatusPill status={b.status} />
                      {b.status === "Upcoming" && <IconBtn icon={X} onClick={() => actions.cancelBooking(b.id)} color={C.rust} />}
                    </div>
                  </div>
                ))}
            </div>
          </>}
        </Card>
      </div>

      {showNew && (
        <Modal title="Book a Resource" onClose={() => { setShowNew(false); onModalHandled && onModalHandled(); }}>
          <BookingForm bookable={bookable} defaultAssetId={selectedId} bookings={bookings}
            onSave={(v, err) => {
              if (err) return;
              actions.bookResource(v.assetId, v.start, v.end, user.id);
              setShowNew(false); onModalHandled && onModalHandled();
            }} />
        </Modal>
      )}
    </div>
  );
}

function BookingStatusPill({ status }) {
  const colors = { Upcoming: C.slate, Ongoing: C.teal, Completed: C.muted, Cancelled: C.rust };
  return <span style={{ fontSize: 11, fontWeight: 600, color: colors[status], background: `${colors[status]}1a`, padding: "3px 9px", borderRadius: 8 }}>{status}</span>;
}

function BookingForm({ bookable, defaultAssetId, bookings, onSave }) {
  const [assetId, setAssetId] = useState(defaultAssetId || bookable[0]?.id || "");
  const [date, setDate] = useState("2026-07-13");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");

  const check = () => {
    const start = `${date}T${startTime}`;
    const end = `${date}T${endTime}`;
    if (endTime <= startTime) { setError("End time must be after start time."); return null; }
    const clash = bookings.find((b) => b.assetId === assetId && b.status !== "Cancelled" && overlaps(start, end, b.start, b.end));
    if (clash) { setError(`Overlaps an existing booking (${clash.start.replace("T", " ")} \u2013 ${clash.end.split("T")[1]}). Choose a different slot.`); return null; }
    setError("");
    return { assetId, start, end };
  };

  return (
    <div>
      <Field label="Resource">
        <Select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {bookable.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Start"><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></Field>
        <Field label="End"><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></Field>
      </div>
      {error && <div style={{ color: C.rust, fontSize: 12.5, marginBottom: 12, background: "#FBEEE9", padding: "8px 10px", borderRadius: 5 }}>{error}</div>}
      <Btn variant="amber" onClick={() => { const v = check(); if (v) onSave(v); }} style={{ width: "100%", justifyContent: "center" }}>Confirm Booking</Btn>
    </div>
  );
}

/* ============================================================
   MAINTENANCE
   ============================================================ */
const MAINT_STAGES = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];

function Maintenance({ data, actions, user, initialModalOpen, onModalHandled }) {
  const { maintenance, assets, employees } = data;
  const [showNew, setShowNew] = useState(!!initialModalOpen);
  const [techModal, setTechModal] = useState(null);
  const canApprove = ["Admin", "Asset Manager"].includes(user.role);

  return (
    <div className="af-fade">
      <ScreenHeader title="Maintenance Management" sub="Route repairs through approval before work starts."
        right={<Btn variant="amber" icon={Plus} onClick={() => setShowNew(true)}>Raise Request</Btn>} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {maintenance.length === 0 && <Empty icon={Wrench} text="No maintenance requests" />}
        {maintenance.map((m) => {
          const asset = assets.find((a) => a.id === m.assetId);
          return (
            <Card key={m.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <AssetTagChip code={asset?.tag} />
                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{asset?.name}</span>
                    <PriorityPill p={m.priority} />
                  </div>
                  <div style={{ fontSize: 13, color: C.ink, marginBottom: 4 }}>{m.issue}</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>Raised by {employees.find((e) => e.id === m.raisedBy)?.name}{m.technician ? ` · Technician: ${m.technician}` : ""}</div>
                </div>
                <MaintStagePill status={m.status} />
              </div>

              <div style={{ display: "flex", gap: 4, marginTop: 14, marginBottom: 10 }}>
                {MAINT_STAGES.map((s, i) => {
                  const curIdx = m.status === "Rejected" ? -1 : MAINT_STAGES.indexOf(m.status);
                  const done = curIdx >= i;
                  return <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: done ? C.teal : C.line }} title={s} />;
                })}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {m.status === "Pending" && canApprove && <>
                  <Btn size="sm" variant="amber" icon={Check} onClick={() => actions.approveMaintenance(m.id)}>Approve</Btn>
                  <Btn size="sm" variant="danger" icon={X} onClick={() => actions.rejectMaintenance(m.id)}>Reject</Btn>
                </>}
                {m.status === "Approved" && canApprove && <Btn size="sm" variant="outline" onClick={() => setTechModal(m)}>Assign Technician</Btn>}
                {m.status === "Technician Assigned" && canApprove && <Btn size="sm" variant="outline" onClick={() => actions.setMaintStatus(m.id, "In Progress")}>Start Work</Btn>}
                {m.status === "In Progress" && canApprove && <Btn size="sm" variant="amber" icon={Check} onClick={() => actions.resolveMaintenance(m.id)}>Mark Resolved</Btn>}
              </div>
            </Card>
          );
        })}
      </div>

      {showNew && (
        <Modal title="Raise Maintenance Request" onClose={() => { setShowNew(false); onModalHandled && onModalHandled(); }}>
          <MaintForm assets={assets} onSave={(v) => { actions.raiseMaintenance(v.assetId, v.issue, v.priority, user.id); setShowNew(false); onModalHandled && onModalHandled(); }} />
        </Modal>
      )}
      {techModal && (
        <Modal title="Assign Technician" onClose={() => setTechModal(null)}>
          <TechForm onSave={(name) => { actions.assignTechnician(techModal.id, name); setTechModal(null); }} />
        </Modal>
      )}
    </div>
  );
}
function PriorityPill({ p }) {
  const colors = { High: C.rust, Medium: C.amberDeep, Low: C.teal };
  return <span style={{ fontSize: 10.5, fontWeight: 700, color: colors[p], border: `1px solid ${colors[p]}`, padding: "2px 8px", borderRadius: 8 }}>{p?.toUpperCase()}</span>;
}
function MaintStagePill({ status }) {
  const color = status === "Rejected" ? C.rust : status === "Resolved" ? C.teal : C.amberDeep;
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}1a`, padding: "4px 10px", borderRadius: 8 }}>{status}</span>;
}
function MaintForm({ assets, onSave }) {
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  return (
    <div>
      <Field label="Asset">
        <Select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.tag} — {a.name}</option>)}
        </Select>
      </Field>
      <Field label="Describe the Issue"><TextArea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="What's wrong with this asset?" /></Field>
      <Field label="Priority"><Select value={priority} onChange={(e) => setPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></Select></Field>
      <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 14 }}>Photo attachment supported in the mobile app.</div>
      <Btn variant="amber" disabled={!issue.trim()} onClick={() => onSave({ assetId, issue: issue.trim(), priority })} style={{ width: "100%", justifyContent: "center" }}>Submit Request</Btn>
    </div>
  );
}
function TechForm({ onSave }) {
  const [name, setName] = useState("");
  return (
    <div>
      <Field label="Technician / Vendor Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AutoCare Services" /></Field>
      <Btn variant="amber" disabled={!name.trim()} onClick={() => onSave(name.trim())} style={{ width: "100%", justifyContent: "center" }}>Assign</Btn>
    </div>
  );
}

/* ============================================================
   ASSET AUDIT
   ============================================================ */
function AssetAudit({ data, actions, user }) {
  const { audits, assets, employees } = data;
  const [showNew, setShowNew] = useState(false);
  const [openAudit, setOpenAudit] = useState(null);

  return (
    <div className="af-fade">
      <ScreenHeader title="Asset Audit" sub="Structured verification cycles instead of a single form."
        right={<Btn variant="amber" icon={Plus} onClick={() => setShowNew(true)}>New Audit Cycle</Btn>} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {audits.length === 0 && <Empty icon={ClipboardCheck} text="No audit cycles yet" />}
        {audits.map((au) => {
          const verified = au.items.filter((i) => i.result === "Verified").length;
          const flagged = au.items.filter((i) => i.result === "Missing" || i.result === "Damaged").length;
          const pending = au.items.filter((i) => !i.result).length;
          return (
            <Card key={au.id} style={{ padding: 16, cursor: "pointer" }} >
              <div onClick={() => setOpenAudit(au)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{au.scope}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{au.dateRange} · Auditors: {au.auditorIds.map((id) => employees.find((e) => e.id === id)?.name).join(", ")}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.teal }}>{verified} verified</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.rust }}>{flagged} flagged</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{pending} pending</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: au.status === "Closed" ? C.muted : C.amberDeep, background: au.status === "Closed" ? "#eee" : "#FBF2E2", padding: "3px 9px", borderRadius: 8 }}>{au.status}</span>
                  <ChevronRight size={16} color={C.muted} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showNew && <Modal title="New Audit Cycle" wide onClose={() => setShowNew(false)}>
        <AuditForm assets={assets} employees={employees} onSave={(v) => { actions.createAudit(v); setShowNew(false); }} />
      </Modal>}

      {openAudit && <Modal title={`Audit — ${openAudit.scope}`} wide onClose={() => setOpenAudit(null)}>
        <AuditDetail audit={data.audits.find((a) => a.id === openAudit.id) || openAudit} assets={assets} employees={employees} actions={actions} user={user} />
      </Modal>}
    </div>
  );
}

function AuditForm({ assets, employees, onSave }) {
  const [scope, setScope] = useState("");
  const [start, setStart] = useState("2026-07-15");
  const [end, setEnd] = useState("2026-07-30");
  const [auditorIds, setAuditorIds] = useState([]);
  const [assetIds, setAssetIds] = useState([]);
  const toggle = (arr, setArr, id) => setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  return (
    <div>
      <Field label="Scope (Department / Location)"><Input value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g. Engineering Wing" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Start Date"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="End Date"><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      <Field label="Assign Auditors">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {employees.map((e) => (
            <button key={e.id} onClick={() => toggle(auditorIds, setAuditorIds, e.id)} className="af-focus"
              style={{ padding: "5px 11px", borderRadius: 14, border: `1px solid ${auditorIds.includes(e.id) ? C.amberDeep : C.line}`, background: auditorIds.includes(e.id) ? "#FBF2E2" : "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
              {e.name}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Assets in Scope">
        <div className="af-scroll" style={{ maxHeight: 160, overflowY: "auto", border: `1px solid ${C.line}`, borderRadius: 5, padding: 8 }}>
          {assets.map((a) => (
            <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 4px", fontSize: 12.5, cursor: "pointer" }}>
              <input type="checkbox" checked={assetIds.includes(a.id)} onChange={() => toggle(assetIds, setAssetIds, a.id)} />
              <AssetTagChip code={a.tag} /> {a.name}
            </label>
          ))}
        </div>
      </Field>
      <Btn variant="amber" disabled={!scope.trim() || assetIds.length === 0 || auditorIds.length === 0}
        onClick={() => onSave({ scope: scope.trim(), dateRange: `${start} to ${end}`, auditorIds, assetIds })}
        style={{ width: "100%", justifyContent: "center" }}>Create Audit Cycle</Btn>
    </div>
  );
}

function AuditDetail({ audit, assets, employees, actions, user }) {
  const canAudit = ["Admin", "Asset Manager"].includes(user.role) || audit.auditorIds.includes(user.id);
  const allMarked = audit.items.every((i) => i.result);
  return (
    <div>
      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14 }}>{audit.dateRange} · Auditors: {audit.auditorIds.map((id) => employees.find((e) => e.id === id)?.name).join(", ")}</div>
      <Table headers={["Asset", "Result", ""]}>
        {audit.items.map((it) => {
          const asset = assets.find((a) => a.id === it.assetId);
          return (
            <tr key={it.assetId}>
              <Td><AssetTagChip code={asset?.tag} /> <span style={{ marginLeft: 8 }}>{asset?.name}</span></Td>
              <Td>{it.result ? <AuditResultPill result={it.result} /> : <span style={{ color: C.muted, fontSize: 12 }}>Pending</span>}</Td>
              <Td>
                {audit.status === "Open" && canAudit && (
                  <div style={{ display: "flex", gap: 5 }}>
                    {["Verified", "Missing", "Damaged"].map((r) => (
                      <Btn key={r} size="sm" variant={it.result === r ? "amber" : "outline"} onClick={() => actions.markAuditItem(audit.id, it.assetId, r)}>{r}</Btn>
                    ))}
                  </div>
                )}
              </Td>
            </tr>
          );
        })}
      </Table>
      {audit.status === "Open" ? (
        <div style={{ marginTop: 16 }}>
          <Btn variant="amber" disabled={!allMarked} onClick={() => actions.closeAudit(audit.id)}>Close Audit Cycle</Btn>
          {!allMarked && <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 10 }}>Mark all assets before closing.</span>}
        </div>
      ) : (
        <div style={{ marginTop: 16, fontSize: 12.5, fontWeight: 600, color: C.teal }}>This audit cycle is closed. Confirmed-missing items were marked Lost.</div>
      )}
    </div>
  );
}
function AuditResultPill({ result }) {
  const colors = { Verified: C.teal, Missing: C.rust, Damaged: C.amberDeep };
  return <span style={{ fontSize: 11, fontWeight: 700, color: colors[result], background: `${colors[result]}1a`, padding: "3px 9px", borderRadius: 8 }}>{result}</span>;
}

/* ============================================================
   REPORTS & ANALYTICS
   ============================================================ */
function Reports({ data }) {
  const { assets, categories, departments, employees, maintenance, bookings } = data;
  const statusData = Object.keys(STATUS_COLOR).map((s) => ({ name: s, value: assets.filter((a) => a.status === s).length })).filter((d) => d.value > 0);
  const catData = categories.map((c) => ({ name: c.name, count: assets.filter((a) => a.categoryId === c.id).length }));
  const deptAlloc = departments.map((d) => ({
    name: d.name,
    count: assets.filter((a) => (a.holderType === "department" && a.holderId === d.id) || (a.holderType === "employee" && employees.find((e) => e.id === a.holderId)?.deptId === d.id)).length,
  }));
  const maintByCat = categories.map((c) => ({
    name: c.name,
    count: maintenance.filter((m) => assets.find((a) => a.id === m.assetId)?.categoryId === c.id).length,
  }));
  const pieColors = [C.teal, C.slate, C.amberDeep, C.rust, "#8A1F0F", C.muted, "#4a4c48"];

  return (
    <div className="af-fade">
      <ScreenHeader title="Reports & Analytics" sub="Actionable operational insight across the fleet."
        right={<Btn variant="outline">Export Report</Btn>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 18 }}>
          <SectionTitle icon={Boxes} title="Assets by Lifecycle Status" />
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => e.name}>
                {statusData.map((d, i) => <Cell key={i} fill={STATUS_COLOR[d.name]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 18 }}>
          <SectionTitle icon={Building} title="Department-wise Allocation Summary" />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={deptAlloc}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={C.slate} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 18 }}>
          <SectionTitle icon={Tag} title="Assets by Category" />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={catData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={C.amberDeep} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 18 }}>
          <SectionTitle icon={Wrench} title="Maintenance Frequency by Category" />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={maintByCat}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={C.rust} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ padding: 18 }}>
        <SectionTitle icon={AlertTriangle} color={C.amberDeep} title="Assets Nearing Retirement (3+ years old)" />
        <Table headers={["Asset", "Category", "Acquired", "Condition"]}>
          {assets.filter((a) => new Date(a.acquisitionDate) < new Date("2023-07-12")).map((a) => (
            <tr key={a.id}>
              <Td><AssetTagChip code={a.tag} /> <span style={{ marginLeft: 8 }}>{a.name}</span></Td>
              <Td>{categories.find((c) => c.id === a.categoryId)?.name}</Td>
              <Td>{a.acquisitionDate}</Td>
              <Td>{a.condition}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

/* ============================================================
   LOGS & NOTIFICATIONS
   ============================================================ */
function LogsAndNotifications({ data, actions }) {
  const [tab, setTab] = useState("notif");
  const { notifications, logs } = data;
  return (
    <div className="af-fade">
      <ScreenHeader title="Activity Logs & Notifications" sub="Keep every role informed without digging for updates." />
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[["notif", "Notifications"], ["logs", "Activity Log"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="af-body af-focus"
            style={{ padding: "8px 16px", borderRadius: 5, border: `1px solid ${tab === k ? C.graphite : C.line}`, background: tab === k ? C.graphite : "#fff", color: tab === k ? "#fff" : C.ink, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>
      {tab === "notif" ? (
        <Card style={{ padding: 8 }}>
          {notifications.length === 0 ? <Empty icon={Bell} text="No notifications" /> : notifications.map((n) => (
            <div key={n.id} onClick={() => actions.readNotif(n.id)} style={{ display: "flex", gap: 12, padding: "12px 12px", borderBottom: `1px solid ${C.line}`, cursor: "pointer", background: n.read ? "transparent" : "#FBF2E2" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? C.line : C.amberDeep, marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>{n.type}</div>
                <div style={{ fontSize: 12.5, color: C.ink, margin: "2px 0" }}>{n.message}</div>
                <div className="af-mono" style={{ fontSize: 10.5, color: C.muted }}>{n.date}</div>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card style={{ padding: 8 }}>
          {logs.length === 0 ? <Empty icon={ClipboardCheck} text="No activity yet" /> : logs.map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", padding: "11px 12px", borderBottom: `1px solid ${C.line}`, fontSize: 12.5 }}>
              <div><b>{l.actor}</b> {l.action}</div>
              <div className="af-mono" style={{ color: C.muted, fontSize: 11, flexShrink: 0, marginLeft: 10 }}>{l.date}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const [data, setData] = useState(seed);
  const [quickModal, setQuickModal] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const log = (actor, action) => ({ id: idc("l"), actor, action, date: "2026-07-12 " + new Date().toTimeString().slice(0, 5) });
  const notif = (type, message) => ({ id: idc("n"), type, message, date: "2026-07-12", read: false });

  const push = (updater) => setData((d) => updater({ ...d }));

  const actions = {
    // Org setup
    saveDept: (id, v) => push((d) => {
      if (id) d.departments = d.departments.map((x) => x.id === id ? { ...x, ...v } : x);
      else d.departments = [...d.departments, { id: idc("d"), ...v }];
      d.logs = [log(user.name, `${id ? "updated" : "created"} department "${v.name}"`), ...d.logs];
      return d;
    }),
    toggleDept: (id) => push((d) => {
      d.departments = d.departments.map((x) => x.id === id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x);
      return d;
    }),
    saveCat: (id, v) => push((d) => {
      if (id) d.categories = d.categories.map((x) => x.id === id ? { ...x, ...v } : x);
      else d.categories = [...d.categories, { id: idc("c"), ...v }];
      d.logs = [log(user.name, `${id ? "updated" : "created"} category "${v.name}"`), ...d.logs];
      return d;
    }),
    toggleEmp: (id) => push((d) => {
      d.employees = d.employees.map((x) => x.id === id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x);
      return d;
    }),
    promote: (id, role) => push((d) => {
      const emp = d.employees.find((e) => e.id === id);
      d.employees = d.employees.map((x) => x.id === id ? { ...x, role } : x);
      d.logs = [log(user.name, `promoted ${emp.name} to ${role}`), ...d.logs];
      d.notifications = [notif("Role Updated", `${emp.name} is now ${role}`), ...d.notifications];
      return d;
    }),
    // Assets
    registerAsset: (v) => push((d) => {
      const num = String(d.nextAssetNum).padStart(4, "0");
      const asset = { id: idc("a"), tag: `AF-${num}`, ...v, status: "Available", holderType: null, holderId: null, expectedReturn: null, history: [{ date: "2026-07-12", event: "Registered and entered system as Available" }] };
      d.assets = [...d.assets, asset];
      d.nextAssetNum = d.nextAssetNum + 1;
      d.logs = [log(user.name, `registered asset ${asset.tag} — ${asset.name}`), ...d.logs];
      return d;
    }),
    // Allocation
    allocateAsset: (assetId, holderType, holderId, expectedReturn) => push((d) => {
      const holderName = holderType === "employee" ? d.employees.find((e) => e.id === holderId)?.name : d.departments.find((x) => x.id === holderId)?.name;
      d.assets = d.assets.map((a) => a.id === assetId ? {
        ...a, status: "Allocated", holderType, holderId, expectedReturn,
        history: [...a.history, { date: "2026-07-12", event: `Allocated to ${holderName}` }],
      } : a);
      d.logs = [log(user.name, `allocated ${d.assets.find((a) => a.id === assetId)?.tag} to ${holderName}`), ...d.logs];
      d.notifications = [notif("Asset Assigned", `${d.assets.find((a) => a.id === assetId)?.name} assigned to ${holderName}`), ...d.notifications];
      return d;
    }),
    requestTransfer: (assetId, toId, requestedBy) => push((d) => {
      const transfer = { id: idc("t"), assetId, toId, requestedBy, status: "Requested" };
      d.transfers = [...(d.transfers || []), transfer];
      const toName = d.employees.find((e) => e.id === toId)?.name;
      d.logs = [log(user.name, `requested transfer of ${d.assets.find((a) => a.id === assetId)?.tag} to ${toName}`), ...d.logs];
      d.notifications = [notif("Transfer Requested", `Transfer requested for ${d.assets.find((a) => a.id === assetId)?.name} to ${toName}`), ...d.notifications];
      return d;
    }),
    approveTransfer: (transferId) => push((d) => {
      const t = d.transfers.find((x) => x.id === transferId);
      const toName = d.employees.find((e) => e.id === t.toId)?.name;
      d.transfers = d.transfers.map((x) => x.id === transferId ? { ...x, status: "Approved" } : x);
      d.assets = d.assets.map((a) => a.id === t.assetId ? {
        ...a, holderType: "employee", holderId: t.toId,
        history: [...a.history, { date: "2026-07-12", event: `Transferred and re-allocated to ${toName}` }],
      } : a);
      d.logs = [log(user.name, `approved transfer of ${d.assets.find((a) => a.id === t.assetId)?.tag} to ${toName}`), ...d.logs];
      d.notifications = [notif("Transfer Approved", `${d.assets.find((a) => a.id === t.assetId)?.name} transferred to ${toName}`), ...d.notifications];
      return d;
    }),
    returnAsset: (assetId, notes) => push((d) => {
      d.assets = d.assets.map((a) => a.id === assetId ? {
        ...a, status: "Available", holderType: null, holderId: null, expectedReturn: null,
        history: [...a.history, { date: "2026-07-12", event: `Returned — condition check-in: ${notes}` }],
      } : a);
      d.logs = [log(user.name, `returned ${d.assets.find((a) => a.id === assetId)?.tag}`), ...d.logs];
      return d;
    }),
    // Booking
    bookResource: (assetId, start, end, bookedBy) => push((d) => {
      const booking = { id: idc("b"), assetId, start, end, status: "Upcoming", bookedBy };
      d.bookings = [...d.bookings, booking];
      const asset = d.assets.find((a) => a.id === assetId);
      d.logs = [log(user.name, `booked ${asset?.name} for ${start.replace("T", " ")}\u2013${end.split("T")[1]}`), ...d.logs];
      d.notifications = [notif("Booking Confirmed", `${asset?.name} booked ${start.replace("T", " ")} \u2013 ${end.split("T")[1]}`), ...d.notifications];
      return d;
    }),
    cancelBooking: (bookingId) => push((d) => {
      d.bookings = d.bookings.map((b) => b.id === bookingId ? { ...b, status: "Cancelled" } : b);
      d.notifications = [notif("Booking Cancelled", `A booking was cancelled`), ...d.notifications];
      return d;
    }),
    // Maintenance
    raiseMaintenance: (assetId, issue, priority, raisedBy) => push((d) => {
      const m = { id: idc("m"), assetId, issue, priority, status: "Pending", technician: null, raisedBy, history: [{ date: "2026-07-12", event: `Raised by ${d.employees.find((e) => e.id === raisedBy)?.name}` }] };
      d.maintenance = [m, ...d.maintenance];
      d.logs = [log(user.name, `raised maintenance request for ${d.assets.find((a) => a.id === assetId)?.tag}`), ...d.logs];
      return d;
    }),
    approveMaintenance: (id) => push((d) => {
      const m = d.maintenance.find((x) => x.id === id);
      d.maintenance = d.maintenance.map((x) => x.id === id ? { ...x, status: "Approved", history: [...x.history, { date: "2026-07-12", event: `Approved by ${user.name}` }] } : x);
      d.assets = d.assets.map((a) => a.id === m.assetId ? { ...a, status: "Under Maintenance", history: [...a.history, { date: "2026-07-12", event: "Sent for Under Maintenance" }] } : a);
      d.notifications = [notif("Maintenance Approved", `${d.assets.find((a) => a.id === m.assetId)?.name} approved for maintenance`), ...d.notifications];
      d.logs = [log(user.name, `approved maintenance for ${d.assets.find((a) => a.id === m.assetId)?.tag}`), ...d.logs];
      return d;
    }),
    rejectMaintenance: (id) => push((d) => {
      d.maintenance = d.maintenance.map((x) => x.id === id ? { ...x, status: "Rejected", history: [...x.history, { date: "2026-07-12", event: `Rejected by ${user.name}` }] } : x);
      d.notifications = [notif("Maintenance Rejected", `A maintenance request was rejected`), ...d.notifications];
      return d;
    }),
    assignTechnician: (id, techName) => push((d) => {
      d.maintenance = d.maintenance.map((x) => x.id === id ? { ...x, status: "Technician Assigned", technician: techName, history: [...x.history, { date: "2026-07-12", event: `Technician assigned: ${techName}` }] } : x);
      return d;
    }),
    setMaintStatus: (id, status) => push((d) => {
      d.maintenance = d.maintenance.map((x) => x.id === id ? { ...x, status, history: [...x.history, { date: "2026-07-12", event: status }] } : x);
      return d;
    }),
    resolveMaintenance: (id) => push((d) => {
      const m = d.maintenance.find((x) => x.id === id);
      d.maintenance = d.maintenance.map((x) => x.id === id ? { ...x, status: "Resolved", history: [...x.history, { date: "2026-07-12", event: "Resolved" }] } : x);
      d.assets = d.assets.map((a) => a.id === m.assetId ? { ...a, status: "Available", history: [...a.history, { date: "2026-07-12", event: "Maintenance resolved — back to Available" }] } : a);
      d.notifications = [notif("Maintenance Resolved", `${d.assets.find((a) => a.id === m.assetId)?.name} is back and Available`), ...d.notifications];
      return d;
    }),
    // Audit
    createAudit: (v) => push((d) => {
      const audit = { id: idc("au"), scope: v.scope, dateRange: v.dateRange, auditorIds: v.auditorIds, status: "Open", items: v.assetIds.map((id) => ({ assetId: id, result: null })) };
      d.audits = [audit, ...d.audits];
      d.logs = [log(user.name, `created audit cycle "${v.scope}"`), ...d.logs];
      return d;
    }),
    markAuditItem: (auditId, assetId, result) => push((d) => {
      d.audits = d.audits.map((au) => au.id === auditId ? { ...au, items: au.items.map((it) => it.assetId === assetId ? { ...it, result } : it) } : au);
      return d;
    }),
    closeAudit: (auditId) => push((d) => {
      const au = d.audits.find((x) => x.id === auditId);
      d.audits = d.audits.map((x) => x.id === auditId ? { ...x, status: "Closed" } : x);
      d.assets = d.assets.map((a) => {
        const item = au.items.find((i) => i.assetId === a.id);
        if (item?.result === "Missing") return { ...a, status: "Lost", history: [...a.history, { date: "2026-07-12", event: "Marked Lost following audit discrepancy" }] };
        return a;
      });
      const flagged = au.items.filter((i) => i.result === "Missing" || i.result === "Damaged").length;
      d.notifications = [notif("Audit Discrepancy Flagged", `${au.scope} closed with ${flagged} discrepancy item(s)`), ...d.notifications];
      d.logs = [log(user.name, `closed audit cycle "${au.scope}"`), ...d.logs];
      return d;
    }),
    // Notifications
    readNotif: (id) => push((d) => { d.notifications = d.notifications.map((n) => n.id === id ? { ...n, read: true } : n); return d; }),
  };

  const handleLogin = (emp) => { setUser(emp); setScreen("dashboard"); };
  const handleSignup = (v) => {
    const newEmp = { id: idc("e"), name: v.name, email: v.email, deptId: v.deptId, role: "Employee", status: "Active" };
    push((d) => { d.employees = [...d.employees, newEmp]; d.logs = [log(newEmp.name, "created an Employee account via signup"), ...d.logs]; return d; });
    setUser(newEmp); setScreen("dashboard");
  };

  if (!user) return <LoginScreen employees={data.employees} onLogin={handleLogin} onSignup={handleSignup} />;

  const unread = data.notifications.filter((n) => !n.read).length;

  return (
    <div className="af-body" style={{ display: "flex", minHeight: "100vh", background: C.paper }}>
      <FontStyles />
      <Sidebar screen={screen} setScreen={setScreen} user={user} onLogout={() => setUser(null)} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "12px 28px", borderBottom: `1px solid ${C.line}`, background: C.paperCard }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setNotifOpen((o) => !o)} className="af-focus" style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 6 }}>
              <Bell size={19} color={C.ink} />
              {unread > 0 && <span style={{ position: "absolute", top: 2, right: 2, background: C.rust, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
            </button>
            {notifOpen && (
              <div className="af-fade af-scroll" style={{ position: "absolute", right: 0, top: 36, width: 320, maxHeight: 360, overflowY: "auto", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50 }}>
                {data.notifications.slice(0, 8).map((n) => (
                  <div key={n.id} onClick={() => actions.readNotif(n.id)} style={{ padding: "10px 12px", borderBottom: `1px solid ${C.line}`, cursor: "pointer", background: n.read ? "transparent" : "#FBF2E2" }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{n.type}</div>
                    <div style={{ fontSize: 11.5, color: C.muted }}>{n.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="af-scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 32px" }}>
          {screen === "dashboard" && <Dashboard data={data} user={user} setScreen={setScreen} openQuick={(m) => { setQuickModal(m); setScreen(m === "register" ? "assets" : m === "book" ? "booking" : "maintenance"); }} />}
          {screen === "org" && user.role === "Admin" && <OrgSetup data={data} actions={actions} />}
          {screen === "assets" && <AssetDirectory data={data} actions={actions} initialModalOpen={quickModal === "register"} onModalHandled={() => setQuickModal(null)} />}
          {screen === "allocation" && <Allocation data={data} actions={actions} user={user} />}
          {screen === "booking" && <ResourceBooking data={data} actions={actions} user={user} initialModalOpen={quickModal === "book"} onModalHandled={() => setQuickModal(null)} />}
          {screen === "maintenance" && <Maintenance data={data} actions={actions} user={user} initialModalOpen={quickModal === "maint"} onModalHandled={() => setQuickModal(null)} />}
          {screen === "audit" && <AssetAudit data={data} actions={actions} user={user} />}
          {screen === "reports" && <Reports data={data} />}
          {screen === "logs" && <LogsAndNotifications data={data} actions={actions} />}
        </div>
      </div>
    </div>
  );
}
