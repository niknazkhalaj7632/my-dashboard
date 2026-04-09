// ─── State ────────────────────────────────────────────────────────────────────

let currentUser = { name: 'Alex Johnson', email: 'alex@example.com' };

// ─── Token Management ─────────────────────────────────────────────────────────

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function saveToken(email, name) {
  localStorage.setItem('ibToken', JSON.stringify({
    email, name, expiry: Date.now() + SESSION_DURATION
  }));
}

function loadToken() {
  try {
    const raw = localStorage.getItem('ibToken');
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (Date.now() > token.expiry) { localStorage.removeItem('ibToken'); return null; }
    return token;
  } catch { return null; }
}

function clearToken() { localStorage.removeItem('ibToken'); }

// ─── Theme ────────────────────────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'light' ? '🌙' : '☀️';
}

function toggleTheme() {
  const next = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('ibTheme', next);
}

// ─── Screen Routing ───────────────────────────────────────────────────────────

function showScreen(screen) {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('signupScreen').classList.add('hidden');
  document.getElementById('dashboard').style.display = 'none';

  if (screen === 'login') {
    document.getElementById('loginScreen').classList.remove('hidden');
  } else if (screen === 'signup') {
    document.getElementById('signupScreen').classList.remove('hidden');
  } else if (screen === 'dashboard') {
    document.getElementById('dashboard').style.display = 'flex';
    navigate('dashboard', document.querySelector('[data-page="dashboard"]'));
  }
}

// ─── Page Navigation ──────────────────────────────────────────────────────────

const PAGE_TITLES = {
  dashboard: 'IB Dashboard', clients: 'My Clients', trading: 'Trading Activity',
  commission: 'Commission Report', rebate: 'Rebate Calculator', statements: 'Statements',
  referral: 'Referral Links', network: 'Partner Network', marketing: 'Marketing Tools',
  settings: 'Settings', support: 'Support', profile: 'My Profile'
};

function navigate(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.remove('hidden');
  document.getElementById('pageTitle').textContent = PAGE_TITLES[page] || 'IB Dashboard';
}

// ─── Email Sanitiser ──────────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ─── Login ────────────────────────────────────────────────────────────────────

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const err   = document.getElementById('loginError');

  if (!email || !pass) {
    err.textContent = 'Please enter your email and password.';
    err.style.display = 'block'; return;
  }
  if (!isValidEmail(email)) {
    err.textContent = 'Please enter a valid email address (e.g. you@example.com).';
    err.style.display = 'block'; return;
  }

  err.style.display = 'none';
  const storedName = sessionStorage.getItem('ibName');
  currentUser.email = email;
  currentUser.name  = storedName
    ? storedName
    : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  saveToken(currentUser.email, currentUser.name);
  applyUserToUI();
  showScreen('dashboard');
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

function handleSignup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPassword').value;
  const err   = document.getElementById('signupError');
  const ok    = document.getElementById('signupSuccess');

  err.style.display = 'none';
  ok.style.display  = 'none';

  if (!name || !email || !pass) {
    err.textContent = 'Please fill in all fields.';
    err.style.display = 'block'; return;
  }
  if (!isValidEmail(email)) {
    err.textContent = 'Please enter a valid email address (e.g. you@example.com).';
    err.style.display = 'block'; return;
  }
  if (pass.length < 8) {
    err.textContent = 'Password must be at least 8 characters.';
    err.style.display = 'block'; return;
  }

  sessionStorage.setItem('ibName', name);
  ok.style.display = 'block';
  setTimeout(() => {
    document.getElementById('loginEmail').value = email;
    showScreen('login');
    ok.style.display = 'none';
  }, 1800);
}

// ─── Logout ───────────────────────────────────────────────────────────────────

function handleLogout() {
  clearToken();
  sessionStorage.removeItem('ibName');
  document.getElementById('loginEmail').value    = '';
  document.getElementById('loginPassword').value = '';
  showScreen('login');
}

// ─── Apply User to UI ─────────────────────────────────────────────────────────

function applyUserToUI() {
  const initials = currentUser.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('headerName').textContent    = currentUser.name;
  document.getElementById('headerAvatar').textContent  = initials;
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent   = currentUser.name;
  document.getElementById('profileEmail').textContent  = currentUser.email;
  document.getElementById('settingsName').value        = currentUser.name;
  document.getElementById('settingsEmail').value       = currentUser.email;
}

function setHeaderDate() {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('headerDate').textContent = new Date().toLocaleDateString('en-US', opts);
}

// ─── Period Tabs ──────────────────────────────────────────────────────────────

function setPeriod(el) {
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ─── Referral Copy ────────────────────────────────────────────────────────────

function copyRef(btn, url) {
  navigator.clipboard.writeText(url || 'https://fxbridge.com/ref/IB-AJ-28471').catch(() => {});
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  btn.style.color = 'var(--green)';
  btn.style.borderColor = 'var(--green)';
  setTimeout(() => { btn.textContent = orig; btn.style.color = ''; btn.style.borderColor = ''; }, 2000);
}

// ─── Rebate Calculator ────────────────────────────────────────────────────────

function selectInstrument() {
  const sel = document.getElementById('calcInstrument');
  document.getElementById('calcRate').value = sel.value;
  calcRebate();
}

function calcRebate() {
  const lots = parseFloat(document.getElementById('calcLots').value) || 0;
  const rate = parseFloat(document.getElementById('calcRate').value) || 0;
  document.getElementById('calcResult').textContent =
    '$' + (lots * rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ─── Client Search & Filter ───────────────────────────────────────────────────

function searchClients() {
  const q = document.getElementById('clientSearch').value.toLowerCase();
  document.querySelectorAll('#clientsTable tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function filterStatus(el, status) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#clientsTable tbody tr').forEach(row => {
    if (status === 'all') { row.style.display = ''; return; }
    const pill = row.querySelector('.status-pill');
    row.style.display = pill && pill.classList.contains(status) ? '' : 'none';
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function saveSettings() {
  const name  = document.getElementById('settingsName').value.trim();
  const email = document.getElementById('settingsEmail').value.trim();
  const msg   = document.getElementById('settingsSaved');
  if (!name || !email || !isValidEmail(email)) {
    alert('Please enter a valid name and email address.'); return;
  }
  currentUser.name  = name;
  currentUser.email = email;
  sessionStorage.setItem('ibName', name);
  saveToken(email, name);
  applyUserToUI();
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 2500);
}

// ─── Support ──────────────────────────────────────────────────────────────────

function submitSupport() {
  const msg = document.getElementById('supportMsg').value.trim();
  const ok  = document.getElementById('supportSent');
  if (!msg) return;
  document.getElementById('supportMsg').value = '';
  ok.style.display = 'block';
  setTimeout(() => { ok.style.display = 'none'; }, 3000);
}

function toggleFaq(el) {
  el.closest('.faq-item').classList.toggle('open');
}

// ─── Enter Key Support ────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (!document.getElementById('loginScreen').classList.contains('hidden'))  handleLogin();
  if (!document.getElementById('signupScreen').classList.contains('hidden')) handleSignup();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

setHeaderDate();
applyTheme(localStorage.getItem('ibTheme') || 'dark');

const token = loadToken();
if (token) {
  currentUser.email = token.email;
  currentUser.name  = token.name;
  applyUserToUI();
  showScreen('dashboard');
} else {
  showScreen('login');
}
