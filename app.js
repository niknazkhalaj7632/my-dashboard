// ─── State ────────────────────────────────────────────────────────────────────

let currentUser = { name: 'Alex Johnson', email: 'alex@example.com' };

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
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const err   = document.getElementById('loginError');

  if (!email || !pass) {
    err.textContent = 'Please enter your email and password.';
    err.style.display = 'block';
    return;
  }

  err.style.display = 'none';

  const storedName = sessionStorage.getItem('ibName');
  currentUser.email = email;
  currentUser.name = storedName
    ? storedName
    : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  applyUserToHeader();
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
    err.style.display = 'block';
    return;
  }

  if (pass.length < 8) {
    err.textContent = 'Password must be at least 8 characters.';
    err.style.display = 'block';
    return;
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
  sessionStorage.removeItem('ibName');
  document.getElementById('loginEmail').value    = '';
  document.getElementById('loginPassword').value = '';
  showScreen('login');
}

// ─── Header ───────────────────────────────────────────────────────────────────

function applyUserToHeader() {
  const initials = currentUser.name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  document.getElementById('headerName').textContent   = currentUser.name;
  document.getElementById('headerAvatar').textContent = initials;
}

function setHeaderDate() {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('headerDate').textContent =
    new Date().toLocaleDateString('en-US', opts);
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

// ─── Period Tabs ──────────────────────────────────────────────────────────────

function setPeriod(el) {
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ─── Referral Copy ────────────────────────────────────────────────────────────

function copyRef(btn) {
  navigator.clipboard.writeText('https://fxbridge.com/ref/IB-AJ-28471').catch(() => {});
  btn.textContent          = 'Copied!';
  btn.style.color          = 'var(--green)';
  btn.style.borderColor    = 'var(--green)';

  setTimeout(() => {
    btn.textContent       = 'Copy';
    btn.style.color       = '';
    btn.style.borderColor = '';
  }, 2000);
}

// ─── Enter Key Support ────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (!document.getElementById('loginScreen').classList.contains('hidden'))  handleLogin();
  if (!document.getElementById('signupScreen').classList.contains('hidden')) handleSignup();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

setHeaderDate();
showScreen('login');
