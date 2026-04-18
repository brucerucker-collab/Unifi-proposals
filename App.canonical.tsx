import React, { useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

type Role = 'admin' | 'sales';
type Stock = 'in-stock' | 'low-stock' | 'backorder';
type ProposalStatus = 'draft' | 'sent' | 'approved';

type ClientRecord = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  propertyType: string;
  address: string;
  notes: string;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  displayUnit: number;
  stock: Stock;
  leadTimeDays: number;
  description: string;
  link: string;
};

type ProposalLine = {
  id: string;
  name: string;
  qty: number;
  category: string;
  lineSubtotal: number;
};

type ProposalOption = {
  id: string;
  title: string;
  summary: string;
  grandTotal: number;
  totalHours: number;
  leadTimeDays: number;
  risk: string;
  lines: ProposalLine[];
};

type ProposalRecord = {
  id: string;
  title: string;
  clientId: string;
  status: ProposalStatus;
  selectedOptionId: string;
  approvedOptionId: string | null;
  shareSlug: string;
  aiPrompt: string;
  signatureName: string;
  options: ProposalOption[];
};

const starterClients: ClientRecord[] = [
  {
    id: 'client-1',
    name: 'Oak Terrace Apartments',
    contact: 'Jordan Smith',
    email: 'jordan@example.com',
    phone: '(555) 019-2222',
    propertyType: 'Apartment Complex',
    address: '101 Oak Terrace Dr, Chicago, IL',
    notes: 'Looking for outdoor coverage, entry visibility, and flexible options.'
  },
  {
    id: 'client-2',
    name: 'Maple Ridge Lofts',
    contact: 'Dana Reed',
    email: 'dana@example.com',
    phone: '(555) 019-3131',
    propertyType: 'Mixed Use',
    address: '455 Maple Ridge Ave, Elgin, IL',
    notes: 'Wants premium presentation with phased options.'
  }
];

const starterInventory: InventoryItem[] = [
  { id: '1', name: 'UNVR Instant', category: 'Recorder', displayUnit: 296, stock: 'in-stock', leadTimeDays: 3, description: 'Compact recorder for flexible small-to-mid Protect deployments.', link: 'https://store.ui.com/us/en' },
  { id: '2', name: 'G6 PTZ', category: 'Camera', displayUnit: 499, stock: 'low-stock', leadTimeDays: 7, description: 'Premium-leaning PTZ option with better optics.', link: 'https://store.ui.com/us/en' },
  { id: '3', name: 'AI PTZ Precision', category: 'Camera', displayUnit: 799, stock: 'backorder', leadTimeDays: 21, description: 'High-end AI PTZ for premium proposals and marquee zones.', link: 'https://store.ui.com/us/en' }
];

const starterOptions: ProposalOption[] = [
  {
    id: 'balanced',
    title: 'Balanced PTZ Build',
    summary: 'Better optics and stronger presentation without jumping to top-end cost.',
    grandTotal: 7420,
    totalHours: 16.4,
    leadTimeDays: 7,
    risk: 'low stock',
    lines: [
      { id: '1', name: 'UNVR Instant', qty: 1, category: 'Recorder', lineSubtotal: 296 },
      { id: '2', name: '8TB Surveillance Drive', qty: 1, category: 'Storage', lineSubtotal: 148 },
      { id: '3', name: 'G6 PTZ', qty: 4, category: 'Camera', lineSubtotal: 1996 },
      { id: '4', name: 'Doorbell Pro PoE Kit', qty: 1, category: 'Access / Entry', lineSubtotal: 299 }
    ]
  },
  {
    id: 'premium',
    title: 'Premium AI PTZ Build',
    summary: 'Premium package for upscale positioning and critical zones.',
    grandTotal: 9880,
    totalHours: 17.6,
    leadTimeDays: 21,
    risk: 'backorder risk',
    lines: [
      { id: '5', name: 'UNVR Instant', qty: 1, category: 'Recorder', lineSubtotal: 296 },
      { id: '6', name: '8TB Surveillance Drive', qty: 1, category: 'Storage', lineSubtotal: 148 },
      { id: '7', name: 'AI PTZ Precision', qty: 4, category: 'Camera', lineSubtotal: 3196 },
      { id: '8', name: 'Doorbell Pro PoE Kit', qty: 1, category: 'Access / Entry', lineSubtotal: 299 }
    ]
  }
];

function money(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
}

function statusBadgeClass(value: string) {
  if (value === 'in-stock' || value === 'healthy') return 'badge green';
  if (value === 'low-stock' || value === 'low stock') return 'badge amber';
  return 'badge red';
}

function LoginPage({ onLogin, role, setRole, email, setEmail, password, setPassword }: {
  onLogin: () => void;
  role: Role;
  setRole: (v: Role) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}) {
  return (
    <div className="app-shell">
      <div className="login-wrap card">
        <div className="label">LOGIN</div>
        <h1 className="hero-title">Enter workspace</h1>
        <p className="hero-sub">This is the real app entry candidate. Replace this with Firebase Auth later.</p>
        <div className="grid" style={{ marginTop: 20 }}>
          <label className="field"><span className="label">Email</span><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field"><span className="label">Password</span><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <label className="field"><span className="label">Role</span><select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}><option value="admin">Admin</option><option value="sales">Sales</option></select></label>
          <button className="btn" onClick={onLogin}>Enter workspace</button>
        </div>
      </div>
    </div>
  );
}

function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const nav = [
    ['/dashboard', 'Dashboard'],
    ['/clients', 'Clients'],
    ['/proposals/proposal-1', 'Proposal Builder'],
    ['/inventory', 'Inventory'],
    ['/delivery', 'Share Preview'],
    ['/settings', 'Settings']
  ];
  return (
    <div className="app-shell">
      <div className="layout">
        <aside className="sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h1>Proposal OS</h1>
              <p>Canonical app shell</p>
            </div>
            <span className="badge">{role}</span>
          </div>
          <nav className="nav-list">
            {nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>)}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

function DashboardPage({ stats, onOpenBuilder }: { stats: { clients: number; proposals: number; averageDeal: string; stockRisks: number }; onOpenBuilder: () => void }) {
  return (
    <div className="grid">
      <div className="topbar card">
        <div>
          <h1 className="hero-title">Dashboard</h1>
          <p className="hero-sub">The main sales/control surface for the MVP.</p>
        </div>
        <button className="btn" onClick={onOpenBuilder}>Open proposal builder</button>
      </div>
      <div className="grid grid-4">
        <div className="card"><div className="label">Active Clients</div><div className="kpi">{stats.clients}</div></div>
        <div className="card"><div className="label">Open Proposals</div><div className="kpi">{stats.proposals}</div></div>
        <div className="card"><div className="label">Avg Option Value</div><div className="kpi">{stats.averageDeal}</div></div>
        <div className="card"><div className="label">Stock Risks</div><div className="kpi">{stats.stockRisks}</div></div>
      </div>
    </div>
  );
}

function ClientsPage({ clients, activeClientId, onSelectClient, onAddClient, onUpdateClient, createState }: {
  clients: ClientRecord[];
  activeClientId: string;
  onSelectClient: (id: string) => void;
  onAddClient: () => void;
  onUpdateClient: (field: keyof ClientRecord, value: string) => void;
  createState: { status: string; message: string };
}) {
  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0];
  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="topbar">
          <div>
            <h2 style={{ margin: 0 }}>Clients</h2>
            <p className="hero-sub">Select and edit customer records.</p>
          </div>
          <button className="btn" onClick={onAddClient}>New client</button>
        </div>
        <div className="notice info"><strong>Client create state:</strong> {createState.status} — {createState.message}</div>
        <div className="stack" style={{ marginTop: 12 }}>
          {clients.map((client) => (
            <button key={client.id} className="item-row" style={{ background: client.id === activeClientId ? '#0f172a' : 'white', color: client.id === activeClientId ? 'white' : '#0f172a' }} onClick={() => onSelectClient(client.id)}>
              <div>
                <div style={{ fontWeight: 600 }}>{client.name}</div>
                <div className="label" style={{ color: client.id === activeClientId ? '#cbd5e1' : undefined }}>{client.contact} · {client.propertyType}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Client detail editor</h2>
        <div className="grid grid-2">
          {[
            ['name', 'Client name', activeClient.name],
            ['contact', 'Contact', activeClient.contact],
            ['email', 'Email', activeClient.email],
            ['phone', 'Phone', activeClient.phone],
            ['address', 'Address', activeClient.address],
            ['propertyType', 'Property type', activeClient.propertyType]
          ].map(([field, label, value]) => (
            <label className="field" key={field} style={field === 'address' ? { gridColumn: '1 / -1' } : undefined}><span className="label">{label}</span><input className="input" value={value} onChange={(e) => onUpdateClient(field as keyof ClientRecord, e.target.value)} /></label>
          ))}
          <label className="field" style={{ gridColumn: '1 / -1' }}><span className="label">Notes</span><textarea className="textarea" value={activeClient.notes} onChange={(e) => onUpdateClient('notes', e.target.value)} /></label>
        </div>
      </div>
    </div>
  );
}

function ProposalPage({ proposal, setProposal, onSaveProposal, onDuplicateProposal, onApproveOption }: {
  proposal: ProposalRecord;
  setProposal: React.Dispatch<React.SetStateAction<ProposalRecord>>;
  onSaveProposal: () => void;
  onDuplicateProposal: () => void;
  onApproveOption: (id: string) => void;
}) {
  return (
    <div className="grid">
      <div className="grid grid-2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Commercial controls</h2>
          <div className="btn-row">
            <button className="btn secondary" onClick={onSaveProposal}>Save proposal</button>
            <button className="btn secondary" onClick={onDuplicateProposal}>Duplicate</button>
          </div>
          <label className="field" style={{ marginTop: 16 }}>
            <span className="label">AI Prompt</span>
            <textarea className="textarea" value={proposal.aiPrompt} onChange={(e) => setProposal((curr) => ({ ...curr, aiPrompt: e.target.value }))} />
          </label>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Implementation readiness</h2>
          <div className="stack">
            <div className="notice success">Route hydration can now be centralized through proposalHydration.ts.</div>
            <div className="notice warn">Real Firestore save/load should replace local-only state for production.</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Proposal options</h2>
        <div className="stack">
          {proposal.options.map((option) => (
            <div key={option.id} className="item-row" style={{ flexDirection: 'column', alignItems: 'stretch', borderColor: proposal.selectedOptionId === option.id ? '#0f172a' : '#e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong>{option.title}</strong>
                    <span className={statusBadgeClass(option.risk)}>{option.risk}</span>
                  </div>
                  <div className="label" style={{ marginTop: 6 }}>{option.summary}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="kpi" style={{ fontSize: 24 }}>{money(option.grandTotal)}</div>
                  <div className="label">{option.totalHours.toFixed(2)} hrs · {option.leadTimeDays} days</div>
                </div>
              </div>
              <div className="btn-row" style={{ marginTop: 14 }}>
                <button className="btn" onClick={() => setProposal((curr) => ({ ...curr, selectedOptionId: option.id }))}>Present this option</button>
                <button className="btn secondary" onClick={() => onApproveOption(option.id)}>Mark selected</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryPage({ items, inventoryLastChecked, inventoryPulse, inventoryJob, onRefresh, onRunJob, onPreviewShare }: {
  items: InventoryItem[];
  inventoryLastChecked: string;
  inventoryPulse: string;
  inventoryJob: { status: string; message: string; lastRun: string };
  onRefresh: () => void;
  onRunJob: () => void;
  onPreviewShare: () => void;
}) {
  return (
    <div className="grid grid-2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Inventory monitor</h2>
        <div className="notice info"><strong>Last check:</strong> {inventoryLastChecked}<br />{inventoryPulse}</div>
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button className="btn" onClick={onRefresh}>Refresh snapshot</button>
          <button className="btn secondary" onClick={onRunJob}>Run inventory job</button>
          <button className="btn secondary" onClick={onPreviewShare}>Preview share page</button>
        </div>
        <div className="notice info" style={{ marginTop: 16 }}><strong>Job status:</strong> {inventoryJob.status}<br />{inventoryJob.message}<br />Last run: {inventoryJob.lastRun}</div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Catalog status list</h2>
        <div className="stack">
          {items.map((item) => (
            <div key={item.id} className="item-row">
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong>{item.name}</strong>
                  <span className="badge">{item.category}</span>
                  <span className={statusBadgeClass(item.stock)}>{item.stock}</span>
                </div>
                <div className="label" style={{ marginTop: 6 }}>{item.description}</div>
                <div className="label" style={{ marginTop: 6 }}>Lead time estimate: {item.leadTimeDays} days</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{money(item.displayUnit)}</div>
                <a href={item.link} target="_blank" rel="noreferrer" className="label">View product</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryPage({ proposal, activeClientName, selectedOption, emailState, setProposal, onApproveOption, onQueueEmail }: {
  proposal: ProposalRecord;
  activeClientName: string;
  selectedOption: ProposalOption;
  emailState: { status: string; message: string };
  setProposal: React.Dispatch<React.SetStateAction<ProposalRecord>>;
  onApproveOption: (id: string) => void;
  onQueueEmail: () => void;
}) {
  return (
    <div className="grid grid-2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Share proposal preview</h2>
        <div className="notice success"><strong>Share URL:</strong> /p/{proposal.shareSlug}</div>
        <div className="stack" style={{ marginTop: 12 }}>
          <div className="item-row"><span>Prepared for</span><strong>{activeClientName}</strong></div>
          <div className="item-row"><span>Project total</span><strong>{money(selectedOption.grandTotal)}</strong></div>
          <div className="item-row"><span>Lead time</span><strong>{selectedOption.leadTimeDays} days</strong></div>
        </div>
        <div className="stack" style={{ marginTop: 16 }}>
          {selectedOption.lines.map((line) => <div key={line.id} className="item-row"><div><strong>{line.name}</strong><div className="label">{line.category} · Qty {line.qty}</div></div><strong>{money(line.lineSubtotal)}</strong></div>)}
        </div>
        <label className="field" style={{ marginTop: 16 }}><span className="label">Customer approval name</span><input className="input" value={proposal.signatureName} onChange={(e) => setProposal((curr) => ({ ...curr, signatureName: e.target.value }))} /></label>
        <div className="notice info" style={{ marginTop: 16 }}><strong>Approval state:</strong> {proposal.approvedOptionId ? 'approved' : 'pending'}</div>
        <div className="btn-row" style={{ marginTop: 12 }}><button className="btn secondary" onClick={() => onApproveOption(selectedOption.id)}>Approve selected option</button></div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Email workflow panel</h2>
        <div className="notice warn">Production mail path: browser → Netlify function → Gmail SMTP with app password.</div>
        <div className="notice info" style={{ marginTop: 12 }}><strong>Status:</strong> {emailState.status}<br />{emailState.message}</div>
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button className="btn" onClick={onQueueEmail}>Queue email</button>
          <button className="btn secondary">Agreement stub</button>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="grid grid-2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Deployment must-dos</h2>
        <div className="stack">
          {[
            'Use App.canonical.tsx as the real main app entry',
            'Activate the Gmail Netlify function as the live send endpoint',
            'Install nodemailer',
            'Set Netlify env vars: GMAIL_FROM_EMAIL, GMAIL_APP_PASSWORD, SITE_URL',
            'Run one real quote email test after deploy'
          ].map((item) => <div key={item} className="item-row"><span>{item}</span></div>)}
        </div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>What is next</h2>
        <div className="stack">
          {[
            'Persist client creation from a single source of truth via clientService',
            'Hydrate public share data from Firestore by share slug',
            'Validate Firestore security rules',
            'Enable App Check',
            'Deploy and run live send / share route QA'
          ].map((item) => <div key={item} className="item-row"><span>{item}</span></div>)}
        </div>
      </div>
    </div>
  );
}

function ProtectedApp({ role }: { role: Role }) {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRecord[]>(starterClients);
  const [activeClientId, setActiveClientId] = useState('client-1');
  const [proposal, setProposal] = useState<ProposalRecord>({
    id: 'proposal-1',
    title: 'Apartment Security Upgrade',
    clientId: 'client-1',
    status: 'draft',
    selectedOptionId: 'balanced',
    approvedOptionId: null,
    shareSlug: 'oak-terrace-apartment-security-upgrade',
    aiPrompt: 'Build a proposal for an apartment complex with 6 outdoor PoE cameras, one wired PoE doorbell, and balanced plus premium options.',
    signatureName: '',
    options: starterOptions
  });
  const [savedProposals, setSavedProposals] = useState([{ id: 'proposal-1', title: 'Apartment Security Upgrade', clientId: 'client-1', status: 'draft', updatedAt: '2026-04-17 09:15 AM' }]);
  const [inventoryItems] = useState<InventoryItem[]>(starterInventory);
  const [inventoryLastChecked, setInventoryLastChecked] = useState('2026-04-17 09:15 AM');
  const [inventoryPulse, setInventoryPulse] = useState('Snapshot monitoring active');
  const [inventoryJob, setInventoryJob] = useState({ status: 'idle', message: 'No refresh currently running.', lastRun: '2026-04-17 09:15 AM' });
  const [clientCreateState, setClientCreateState] = useState({ status: 'idle', message: 'Ready to create client records from a single source of truth.' });
  const [emailState, setEmailState] = useState({ status: 'idle', message: 'Ready to send proposal email.' });

  const activeClient = useMemo(() => clients.find((c) => c.id === activeClientId) || clients[0], [clients, activeClientId]);
  const selectedOption = useMemo(() => proposal.options.find((o) => o.id === proposal.selectedOptionId) || proposal.options[0], [proposal]);

  const stats = {
    clients: clients.length,
    proposals: savedProposals.length,
    averageDeal: '$7,420',
    stockRisks: inventoryItems.filter((item) => item.stock !== 'in-stock').length
  };

  const handleAddClient = () => {
    const next: ClientRecord = {
      id: `client-${Date.now()}`,
      name: 'New Client',
      contact: 'New Contact',
      email: 'client@example.com',
      phone: '(555) 000-0000',
      propertyType: 'Property',
      address: 'Address',
      notes: 'New client notes'
    };
    setClients((curr) => [next, ...curr]);
    setActiveClientId(next.id);
    setProposal((curr) => ({ ...curr, clientId: next.id }));
    setClientCreateState({ status: 'created', message: `Client ${next.name} created and selected from one consistent local source of truth.` });
  };

  const handleUpdateClient = (field: keyof ClientRecord, value: string) => {
    setClients((curr) => curr.map((client) => client.id === activeClientId ? { ...client, [field]: value } : client));
  };

  const handleSaveProposal = () => {
    setSavedProposals((curr) => {
      const record = { id: proposal.id, title: proposal.title, clientId: activeClientId, status: proposal.status, updatedAt: '2026-04-17 09:35 AM' };
      const exists = curr.some((p) => p.id === proposal.id);
      return exists ? curr.map((p) => p.id === proposal.id ? record : p) : [record, ...curr];
    });
  };

  const handleDuplicateProposal = () => {
    const nextId = `proposal-${Date.now()}`;
    setProposal((curr) => ({ ...curr, id: nextId, title: `${curr.title} Copy`, shareSlug: `${curr.shareSlug}-copy`, status: 'draft', approvedOptionId: null }));
  };

  const handleApproveOption = (id: string) => {
    setProposal((curr) => ({ ...curr, approvedOptionId: id, selectedOptionId: id, status: 'approved' }));
  };

  const handleRefreshInventory = () => {
    setInventoryLastChecked('2026-04-17 09:30 AM');
    setInventoryPulse('Snapshot refreshed from approved product pages');
  };

  const handleRunInventoryJob = () => {
    setInventoryJob({ status: 'running', message: 'Refreshing approved product pages and normalizing stock signals...', lastRun: '2026-04-17 09:30 AM' });
  };

  const handleQueueEmail = () => {
    setProposal((curr) => ({ ...curr, status: curr.status === 'draft' ? 'sent' : curr.status }));
    setEmailState({ status: 'queued', message: 'Proposal email queued for delivery. Active production path should call the Gmail SMTP Netlify function using app-password auth.' });
  };

  return (
    <AppShell role={role}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage stats={stats} onOpenBuilder={() => navigate(`/proposals/${proposal.id}`)} />} />
        <Route path="/clients" element={<ClientsPage clients={clients} activeClientId={activeClientId} onSelectClient={(id) => { setActiveClientId(id); setProposal((curr) => ({ ...curr, clientId: id })); }} onAddClient={handleAddClient} onUpdateClient={handleUpdateClient} createState={clientCreateState} />} />
        <Route path="/proposals/:proposalId" element={<ProposalPage proposal={proposal} setProposal={setProposal} onSaveProposal={handleSaveProposal} onDuplicateProposal={handleDuplicateProposal} onApproveOption={handleApproveOption} />} />
        <Route path="/inventory" element={<InventoryPage items={inventoryItems} inventoryLastChecked={inventoryLastChecked} inventoryPulse={inventoryPulse} inventoryJob={inventoryJob} onRefresh={handleRefreshInventory} onRunJob={handleRunInventoryJob} onPreviewShare={(() => navigate('/delivery'))} />} />
        <Route path="/delivery" element={<DeliveryPage proposal={proposal} activeClientName={activeClient.name} selectedOption={selectedOption} emailState={emailState} setProposal={setProposal} onApproveOption={handleApproveOption} onQueueEmail={handleQueueEmail} />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('brucerucker@gmail.com');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage role={role} setRole={setRole} email={email} setEmail={setEmail} password={password} setPassword={setPassword} onLogin={() => setLoggedIn(true)} />} />
        <Route path="/p/:shareSlug" element={<div className="app-shell"><div className="card" style={{ maxWidth: 960, margin: '0 auto' }}><h1 style={{ marginTop: 0 }}>Public Share Route</h1><p className="hero-sub">Wire this to Firestore with loadProposalByShareSlug in production.</p></div></div>} />
        <Route path="/*" element={loggedIn ? <ProtectedApp role={role} /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
