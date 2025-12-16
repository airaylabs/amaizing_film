// AI Filmmaking Studio - Main Application with Supabase Auth

// ============ STATE ============
let state = {
  user: null,
  userRole: 'user', // 'admin' or 'user'
  currentPage: 'dashboard',
  currentApp: null,
  currentProject: null,
  projects: [],
  characters: [],
  locations: [],
  history: [],
  opalLinks: {},        // User's personal links
  globalOpalLinks: {},  // Admin-managed global links (visible to all)
  generatedAssets: [],
  outputCount: 1        // Default output count (1/2/3/4)
};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

async function initAuth() {
  showLoading(true);
  const session = await Auth.getSession();
  
  if (session) {
    state.user = session.user;
    await loadUserData();
    showApp();
  } else {
    showAuthScreen();
  }
  
  Auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      state.user = session.user;
      await loadUserData();
      showApp();
    } else if (event === 'SIGNED_OUT') {
      state.user = null;
      showAuthScreen();
    }
  });
}

// ============ AUTH UI ============
function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('loading-screen').classList.add('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('loading-screen').classList.add('hidden');
  updateUserInfo();
  renderSidebar();
  renderPage();
  updateHistoryCount();
}

function showLoading(show) {
  document.getElementById('loading-screen').classList.toggle('hidden', !show);
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showAuthTab(tab) {
  const loginTab = document.getElementById('tab-login');
  const signupTab = document.getElementById('tab-signup');
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  
  if (tab === 'login') {
    loginTab.classList.add('bg-cyan-500/20', 'text-cyan-400');
    loginTab.classList.remove('text-slate-400');
    signupTab.classList.remove('bg-cyan-500/20', 'text-cyan-400');
    signupTab.classList.add('text-slate-400');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    signupTab.classList.add('bg-cyan-500/20', 'text-cyan-400');
    signupTab.classList.remove('text-slate-400');
    loginTab.classList.remove('bg-cyan-500/20', 'text-cyan-400');
    loginTab.classList.add('text-slate-400');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
  hideAuthMessages();
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  document.getElementById('auth-success').classList.add('hidden');
}

function showAuthSuccess(msg) {
  const el = document.getElementById('auth-success');
  el.textContent = msg;
  el.classList.remove('hidden');
  document.getElementById('auth-error').classList.add('hidden');
}

function hideAuthMessages() {
  document.getElementById('auth-error').classList.add('hidden');
  document.getElementById('auth-success').classList.add('hidden');
}

// ============ AUTH HANDLERS ============
async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showAuthError('Please fill in all fields'); return; }
  try {
    showLoading(true);
    await Auth.signInEmail(email, password);
  } catch (error) {
    showAuthScreen();
    showAuthError(error.message);
  }
}

async function handleSignup() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  if (!name || !email || !password) { showAuthError('Please fill in all fields'); return; }
  if (password.length < 6) { showAuthError('Password must be at least 6 characters'); return; }
  try {
    showLoading(true);
    await Auth.signUpEmail(email, password, name);
    showAuthScreen();
    showAuthSuccess('Account created! Check your email to confirm, then login.');
    showAuthTab('login');
  } catch (error) {
    showAuthScreen();
    showAuthError(error.message);
  }
}

async function handleGoogleLogin() {
  try { await Auth.signInGoogle(); } catch (error) { showAuthError(error.message); }
}

async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    showLoading(true);
    await Auth.signOut();
  }
}

function updateUserInfo() {
  if (!state.user) return;
  const name = state.user.user_metadata?.full_name || state.user.email?.split('@')[0] || 'User';
  const email = state.user.email || '';
  const nameEl = document.getElementById('user-name');
  nameEl.innerHTML = name + (isAdmin() ? ' <span class="text-yellow-400 text-xs">👑</span>' : '');
  document.getElementById('user-email').textContent = email;
  document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
}

// ============ DATA LOADING ============
async function loadUserData() {
  if (!state.user) return;
  try {
    const [projects, characters, locations, history, opalLinks, globalOpalLinks, userRole, generatedAssets] = await Promise.all([
      DB.getProjects(state.user.id),
      DB.getCharacters(state.user.id),
      DB.getLocations(state.user.id),
      DB.getHistory(state.user.id),
      DB.getOpalLinks(state.user.id),
      DB.getGlobalOpalLinks(),
      DB.getUserRole(state.user.id),
      DB.getGeneratedAssets(state.user.id)
    ]);
    state.projects = projects;
    state.characters = characters;
    state.locations = locations;
    state.history = history;
    state.userRole = userRole;
    state.generatedAssets = generatedAssets;
    
    // Personal opal links
    state.opalLinks = {};
    opalLinks.forEach(link => { state.opalLinks[link.app_id] = link.url; });
    
    // Global opal links (admin-managed)
    state.globalOpalLinks = {};
    globalOpalLinks.forEach(link => { state.globalOpalLinks[link.app_id] = link.url; });
    
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject && state.projects.find(p => p.id === savedProject)) {
      state.currentProject = savedProject;
    }
    
    // Load saved output count preference
    const savedOutputCount = localStorage.getItem('outputCount');
    if (savedOutputCount) state.outputCount = parseInt(savedOutputCount);
    
    updateProjectSelector();
  } catch (error) { console.error('Error loading data:', error); }
}

// Helper: Get effective Opal link (personal > global)
function getEffectiveOpalLink(appId) {
  return state.opalLinks[appId] || state.globalOpalLinks[appId] || null;
}

// Helper: Check if user is admin
function isAdmin() {
  return state.userRole === 'admin';
}

// ============ NAVIGATION ============
function navigateTo(page, appId = null) {
  state.currentPage = page;
  state.currentApp = appId;
  renderSidebar();
  renderPage();
  updateBreadcrumb();
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  let text = '';
  if (state.currentPage === 'dashboard') text = '🏠 Dashboard';
  else if (state.currentPage === 'app' && state.currentApp) {
    const app = findApp(state.currentApp);
    const phase = findPhase(state.currentApp);
    text = `${phase.icon} ${phase.name} / ${app.name}`;
  }
  else if (state.currentPage === 'characters') text = '👤 Characters';
  else if (state.currentPage === 'locations') text = '🎭 Locations';
  else if (state.currentPage === 'workflow') text = '📋 Workflow';
  else if (state.currentPage === 'opal-links') text = '🔗 Opal Links';
  else if (state.currentPage === 'admin-opal-links') text = '👑 Admin / Manage Global Links';
  else if (state.currentPage === 'admin-users') text = '👑 Admin / User Management';
  bc.textContent = text;
}

function findApp(appId) {
  for (const phase of PHASES) {
    const app = phase.apps.find(a => a.id === appId);
    if (app) return app;
  }
  return null;
}

function findPhase(appId) {
  for (const phase of PHASES) {
    if (phase.apps.find(a => a.id === appId)) return phase;
  }
  return null;
}


// ============ SIDEBAR ============
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  
  let html = `
    <div class="sidebar-item ${state.currentPage === 'dashboard' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('dashboard')">
      <span class="mr-2">🏠</span> Dashboard
    </div>
    <div class="mt-4 mb-2 px-3 text-xs text-slate-500 uppercase tracking-wider">Production Phases</div>
  `;
  
  PHASES.forEach(phase => {
    const isExpanded = phase.apps.some(a => a.id === state.currentApp);
    html += `
      <div class="mb-1">
        <div class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-white/5" onclick="togglePhase('${phase.id}')">
          <span><span class="mr-2">${phase.icon}</span>${phase.name}</span>
          <span class="text-xs text-slate-500">${phase.apps.length}</span>
        </div>
        <div id="phase-${phase.id}" class="${isExpanded ? '' : 'hidden'} ml-4 border-l border-white/10 pl-2">
          ${phase.apps.map(app => `
            <div class="sidebar-item ${state.currentApp === app.id ? 'active' : ''} rounded-lg p-2 cursor-pointer text-sm" onclick="navigateTo('app', '${app.id}')">
              <span class="mr-2">${app.icon}</span>${app.name}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += `
    <div class="mt-4 mb-2 px-3 text-xs text-slate-500 uppercase tracking-wider">Management</div>
    <div class="sidebar-item ${state.currentPage === 'characters' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('characters')">
      <span class="mr-2">👤</span> Characters <span class="ml-auto text-xs text-slate-500">${chars.length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'locations' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('locations')">
      <span class="mr-2">🎭</span> Locations <span class="ml-auto text-xs text-slate-500">${locs.length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'workflow' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('workflow')">
      <span class="mr-2">📋</span> Workflow
    </div>
    <div class="sidebar-item ${state.currentPage === 'opal-links' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('opal-links')">
      <span class="mr-2">🔗</span> Opal Links
    </div>
  `;
  
  // Admin section (only visible to admins)
  if (isAdmin()) {
    html += `
      <div class="mt-4 mb-2 px-3 text-xs text-red-400 uppercase tracking-wider flex items-center gap-2">
        <span>👑</span> Admin Panel
      </div>
      <div class="sidebar-item ${state.currentPage === 'admin-opal-links' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('admin-opal-links')">
        <span class="mr-2">⚙️</span> Manage Global Links
      </div>
      <div class="sidebar-item ${state.currentPage === 'admin-users' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1" onclick="navigateTo('admin-users')">
        <span class="mr-2">👥</span> User Management
      </div>
    `;
  }
  
  nav.innerHTML = html;
}

function togglePhase(phaseId) {
  document.getElementById('phase-' + phaseId).classList.toggle('hidden');
}

// ============ PROJECT MANAGEMENT ============
function updateProjectSelector() {
  const sel = document.getElementById('project-selector');
  sel.innerHTML = '<option value="">All Projects</option>' + 
    state.projects.map(p => `<option value="${p.id}" ${p.id === state.currentProject ? 'selected' : ''}>${p.name}</option>`).join('');
}

function switchProject(projectId) {
  state.currentProject = projectId || null;
  localStorage.setItem('currentProject', state.currentProject || '');
  renderSidebar();
  renderPage();
}

function showNewProjectModal() {
  showModal('New Project', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Project Name</label>
        <input type="text" id="new-project-name" class="w-full rounded-lg px-3 py-2" placeholder="My Film Project">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Type</label>
        <select id="new-project-type" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.projectType.map(t => `<option>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Genre</label>
        <select id="new-project-genre" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.genre.map(g => `<option>${g}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="new-project-desc" class="w-full rounded-lg px-3 py-2 h-20" placeholder="Brief description..."></textarea>
      </div>
    </div>
  `, async () => {
    const project = {
      user_id: state.user.id,
      name: document.getElementById('new-project-name').value || 'Untitled Project',
      type: document.getElementById('new-project-type').value,
      genre: document.getElementById('new-project-genre').value,
      description: document.getElementById('new-project-desc').value
    };
    try {
      const newProject = await DB.createProject(project);
      state.projects.unshift(newProject);
      state.currentProject = newProject.id;
      localStorage.setItem('currentProject', newProject.id);
      updateProjectSelector();
      hideModal();
      renderPage();
    } catch (error) { alert('Error: ' + error.message); }
  });
}

// ============ PAGE RENDERING ============
function renderPage() {
  const content = document.getElementById('page-content');
  let html = '';
  switch(state.currentPage) {
    case 'dashboard': html = renderDashboard(); break;
    case 'app': html = renderAppPage(); break;
    case 'characters': html = renderCharactersPage(); break;
    case 'locations': html = renderLocationsPage(); break;
    case 'workflow': html = renderWorkflowPage(); break;
    case 'opal-links': html = renderOpalLinksPage(); break;
    case 'admin-opal-links': html = isAdmin() ? renderAdminOpalLinksPage() : renderDashboard(); break;
    case 'admin-users': html = isAdmin() ? renderAdminUsersPage() : renderDashboard(); break;
    default: html = renderDashboard();
  }
  content.innerHTML = `<div class="fade-in">${html}</div>`;
  updateBreadcrumb();
}

function renderDashboard() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  
  return `
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2" style="font-family: 'Space Grotesk', sans-serif;">
          <span class="text-white">raym</span><span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI</span><span class="text-slate-400">zing film</span>
        </h1>
        <p class="text-slate-400">Complete production platform • Unlimited VEO 3 + Gemini via Google Opal</p>
      </div>
      
      ${project ? `
        <div class="glass rounded-2xl p-6 mb-8 gradient-card pulse-glow">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="tag">${project.type}</span>
                <span class="tag">${project.genre}</span>
              </div>
              <h2 class="text-2xl font-bold">${project.name}</h2>
              <p class="text-slate-400 text-sm mt-2">${project.description || 'No description'}</p>
              <div class="flex gap-4 mt-4 text-sm">
                <span class="text-slate-500">👤 ${chars.length} Characters</span>
                <span class="text-slate-500">🎭 ${locs.length} Locations</span>
                <span class="text-slate-500">📜 ${state.history.filter(h => h.project_id === project.id).length} Generations</span>
              </div>
            </div>
            <button onclick="deleteProject('${project.id}')" class="btn-secondary px-4 py-2 rounded-lg text-sm">Delete</button>
          </div>
        </div>
      ` : `
        <div class="glass rounded-2xl p-8 mb-8 text-center gradient-card">
          <div class="text-5xl mb-4">🎬</div>
          <h3 class="text-xl font-semibold mb-2">Start Your Film Project</h3>
          <p class="text-slate-400 mb-6">Create a project to organize characters, locations, and track your production.</p>
          <button onclick="showNewProjectModal()" class="btn-primary px-8 py-3 rounded-xl font-semibold">+ Create New Project</button>
        </div>
      `}
      
      <div class="glass rounded-2xl p-6 mb-8">
        <h3 class="font-semibold mb-4">🚀 Quick Start Workflow</h3>
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <div class="bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 text-cyan-300">1️⃣ Create Characters</div>
          <span class="text-cyan-500">→</span>
          <div class="bg-sky-500/10 px-4 py-2 rounded-full border border-sky-500/20 text-sky-300">2️⃣ Design Locations</div>
          <span class="text-sky-500">→</span>
          <div class="bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 text-blue-300">3️⃣ Generate Prompts</div>
          <span class="text-blue-500">→</span>
          <div class="bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 text-indigo-300">4️⃣ Copy to Opal</div>
        </div>
      </div>
      
      <!-- Quick Access Opal Links -->
      ${Object.keys(state.globalOpalLinks).length > 0 || Object.keys(state.opalLinks).length > 0 ? `
        <div class="glass rounded-2xl p-6 mb-8 gradient-card">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            <span>🔗</span> Quick Access Opal Tools
            <span class="text-xs text-slate-500">(Click to open)</span>
          </h3>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            ${PHASES.flatMap(phase => phase.apps.filter(app => getEffectiveOpalLink(app.id)).slice(0, 2).map(app => `
              <a href="${getEffectiveOpalLink(app.id)}" target="_blank" 
                class="glass glass-hover rounded-xl p-3 text-center cursor-pointer block">
                <span class="text-2xl block mb-1">${app.icon}</span>
                <span class="text-xs">${app.name.split(' ')[0]}</span>
              </a>
            `)).join('')}
            <div onclick="navigateTo('opal-links')" class="glass glass-hover rounded-xl p-3 text-center cursor-pointer">
              <span class="text-2xl block mb-1">➕</span>
              <span class="text-xs">More</span>
            </div>
          </div>
        </div>
      ` : ''}
      
      <h3 class="text-lg font-semibold mb-4">📋 Production Phases</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        ${PHASES.map((phase, idx) => `
          <div class="glass glass-hover rounded-2xl p-5 cursor-pointer" onclick="togglePhase('${phase.id}')">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-xl">${phase.icon}</div>
              <div>
                <div class="text-xs text-slate-500">Phase ${idx + 1}</div>
                <h4 class="font-semibold">${phase.name}</h4>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${phase.apps.slice(0,4).map(app => `
                <span class="text-xs bg-white/5 px-2 py-1 rounded-lg cursor-pointer" onclick="event.stopPropagation(); navigateTo('app', '${app.id}')">
                  ${app.icon} ${app.name.split(' ')[0]}
                </span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="navigateTo('characters')">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">👤</span>
            <span class="text-2xl font-bold text-cyan-400">${chars.length}</span>
          </div>
          <h4 class="font-semibold">Characters</h4>
        </div>
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="navigateTo('locations')">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🎭</span>
            <span class="text-2xl font-bold text-blue-400">${locs.length}</span>
          </div>
          <h4 class="font-semibold">Locations</h4>
        </div>
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="showHistoryPanel()">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">📜</span>
            <span class="text-2xl font-bold text-pink-400">${state.history.length}</span>
          </div>
          <h4 class="font-semibold">History</h4>
        </div>
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="navigateTo('opal-links')">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🔗</span>
            <span class="text-2xl font-bold text-green-400">${Object.keys(state.opalLinks).filter(k => state.opalLinks[k]).length}</span>
          </div>
          <h4 class="font-semibold">Opal Links</h4>
        </div>
      </div>
    </div>
  `;
}

async function deleteProject(id) {
  if (!confirm('Delete this project and all its data?')) return;
  try {
    await DB.deleteProject(id);
    state.projects = state.projects.filter(p => p.id !== id);
    if (state.currentProject === id) state.currentProject = null;
    updateProjectSelector();
    renderPage();
  } catch (error) { alert('Error: ' + error.message); }
}


// ============ APP PAGE ============
function renderAppPage() {
  const appConfig = APP_FORMS[state.currentApp];
  const app = findApp(state.currentApp);
  const phase = findPhase(state.currentApp);
  if (!appConfig || !app) return '<p>App not found</p>';
  
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  const effectiveLink = getEffectiveOpalLink(state.currentApp);
  const isGlobalLink = !state.opalLinks[state.currentApp] && state.globalOpalLinks[state.currentApp];
  
  return `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-3xl">${app.icon}</div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="tag">${phase.name}</span>
            ${isGlobalLink ? '<span class="tag bg-green-500/20 border-green-500/30 text-green-400">✓ Ready</span>' : ''}
          </div>
          <h2 class="text-2xl font-bold">${app.name}</h2>
          <p class="text-slate-400 text-sm">${app.desc}</p>
        </div>
        ${effectiveLink ? `
          <a href="${effectiveLink}" target="_blank" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            🚀 Open in Opal
            ${isGlobalLink ? '<span class="text-xs opacity-70">(Global)</span>' : ''}
          </a>
        ` : `
          <button onclick="navigateTo('opal-links')" class="btn-secondary px-4 py-2 rounded-xl text-sm">🔗 Setup Opal Link</button>
        `}
      </div>
      
      <!-- Output Count Selector -->
      <div class="glass rounded-xl p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-sm text-slate-400">Output Count:</span>
            <div class="flex gap-2">
              ${[1, 2, 3, 4].map(n => `
                <button onclick="setOutputCount(${n})" class="w-10 h-10 rounded-lg ${state.outputCount === n ? 'btn-primary' : 'btn-secondary'} text-sm font-bold">
                  ${n}
                </button>
              `).join('')}
            </div>
            <span class="text-xs text-slate-500 ml-2">Generate ${state.outputCount} variation${state.outputCount > 1 ? 's' : ''}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Character Mode:</span>
            <select id="character-mode" class="rounded-lg px-3 py-1.5 text-sm" onchange="updateCharacterMode(this.value)">
              <option value="single">Single Character</option>
              <option value="multi-2">2 Characters</option>
              <option value="multi-3">3 Characters</option>
              <option value="multi-4">4+ Characters</option>
            </select>
          </div>
        </div>
      </div>
      
      ${(chars.length > 0 || locs.length > 0) ? `
        <div class="glass rounded-xl p-4 mb-6">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-sm text-slate-400">Quick Insert:</span>
            ${chars.slice(0, 3).map(c => `
              <button onclick="quickInsertCharacter('${c.id}')" class="text-xs bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">👤 ${c.name}</button>
            `).join('')}
            ${locs.slice(0, 3).map(l => `
              <button onclick="quickInsertLocation('${l.id}')" class="text-xs bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">🎭 ${l.name}</button>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 glass rounded-2xl p-6">
          <h3 class="font-semibold mb-4">📝 Input Options</h3>
          <div class="space-y-4" id="app-form">${renderAppForm(appConfig)}</div>
          <div class="flex gap-3 mt-6">
            <button onclick="generatePrompt()" class="flex-1 btn-primary py-3 rounded-xl font-semibold">✨ Generate Prompt</button>
            <button onclick="clearForm()" class="btn-secondary px-4 py-3 rounded-xl">🗑️</button>
          </div>
        </div>
        
        <div class="lg:col-span-2 space-y-4">
          <div class="glass rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-sm">📋 Generated Prompt</h3>
              <button onclick="copyPrompt()" id="copy-btn" class="btn-primary px-4 py-1.5 rounded-lg text-xs">📋 Copy</button>
            </div>
            <div id="prompt-output" class="prompt-output rounded-xl p-4 min-h-[180px] max-h-[300px] overflow-y-auto font-mono text-xs whitespace-pre-wrap">
              <span class="text-slate-500 italic">Fill in the options above...</span>
            </div>
          </div>
          
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-sm mb-3">⚡ Quick Actions</h3>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="saveToHistory()" class="btn-secondary py-2.5 rounded-lg text-xs">💾 Save to History</button>
              <button onclick="copyAndOpenOpal()" class="btn-secondary py-2.5 rounded-lg text-xs">🚀 Copy & Open Opal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAppForm(config) {
  return config.inputs.map(input => {
    if (input.type === 'textarea') {
      return `<div><label class="block text-sm text-slate-400 mb-1">${input.label}</label>
        <textarea id="input-${input.id}" class="w-full rounded-lg px-3 py-2" rows="${input.rows || 3}" placeholder="${input.placeholder || ''}"></textarea></div>`;
    } else if (input.type === 'select') {
      const options = OPTIONS[input.options] || [];
      return `<div><label class="block text-sm text-slate-400 mb-1">${input.label}</label>
        <select id="input-${input.id}" class="w-full rounded-lg px-3 py-2">
          <option value="">Select...</option>
          ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select></div>`;
    } else {
      return `<div><label class="block text-sm text-slate-400 mb-1">${input.label}</label>
        <input type="text" id="input-${input.id}" class="w-full rounded-lg px-3 py-2" placeholder="${input.placeholder || ''}"></div>`;
    }
  }).join('');
}

function generatePrompt() {
  const appConfig = APP_FORMS[state.currentApp];
  if (!appConfig) return;
  
  const values = {};
  appConfig.inputs.forEach(input => {
    const el = document.getElementById('input-' + input.id);
    if (el) values[input.id] = el.value;
  });
  
  let prompt = appConfig.promptTemplate || appConfig.template;
  Object.keys(values).forEach(key => {
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), values[key] || `[${key}]`);
  });
  
  // Add output count instruction if supported
  if (appConfig.supportsOutputCount && state.outputCount > 1) {
    prompt += `\n\n[Generate ${state.outputCount} variations]`;
  }
  
  // Add character mode info if supported
  const charMode = localStorage.getItem('characterMode') || 'single';
  if (appConfig.supportsMultiCharacter && charMode !== 'single') {
    const charCount = charMode.replace('multi-', '');
    prompt += `\n\n[Scene with ${charCount} characters]`;
  }
  
  document.getElementById('prompt-output').textContent = prompt;
}

function clearForm() {
  const appConfig = APP_FORMS[state.currentApp];
  if (!appConfig) return;
  appConfig.inputs.forEach(input => {
    const el = document.getElementById('input-' + input.id);
    if (el) el.value = '';
  });
  document.getElementById('prompt-output').innerHTML = '<span class="text-slate-500 italic">Fill in the options above...</span>';
}

function copyPrompt() {
  const text = document.getElementById('prompt-output').textContent;
  navigator.clipboard.writeText(text);
  const btn = document.getElementById('copy-btn');
  btn.textContent = '✅ Copied!';
  setTimeout(() => btn.textContent = '📋 Copy', 2000);
}

async function saveToHistory() {
  const prompt = document.getElementById('prompt-output').textContent;
  if (!prompt || prompt.includes('Fill in')) { alert('Generate a prompt first!'); return; }
  
  const historyItem = {
    user_id: state.user.id,
    project_id: state.currentProject || null,
    app_id: state.currentApp,
    prompt: prompt,
    form_data: {}
  };
  
  try {
    const saved = await DB.createHistory(historyItem);
    state.history.unshift(saved);
    updateHistoryCount();
    alert('Saved to history!');
  } catch (error) { alert('Error: ' + error.message); }
}

function copyAndOpenOpal() {
  copyPrompt();
  const opalUrl = getEffectiveOpalLink(state.currentApp) || 'https://opal.google';
  window.open(opalUrl, '_blank');
}

function setOutputCount(count) {
  state.outputCount = count;
  localStorage.setItem('outputCount', count);
  renderPage();
}

function updateCharacterMode(mode) {
  // Store character mode for prompt generation
  localStorage.setItem('characterMode', mode);
}

function quickInsertCharacter(id) {
  const char = state.characters.find(c => c.id === id);
  if (!char) return;
  const desc = `${char.name}, ${char.age}, ${char.gender}, ${char.physical}, wearing ${char.costume}`;
  const el = document.querySelector('#app-form textarea');
  if (el) el.value = (el.value ? el.value + '\n' : '') + desc;
}

function quickInsertLocation(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  const desc = `${loc.name}: ${loc.description}, ${loc.mood} mood, ${loc.time_of_day}`;
  const el = document.querySelector('#app-form textarea');
  if (el) el.value = (el.value ? el.value + '\n' : '') + desc;
}


// ============ CHARACTERS PAGE ============
function renderCharactersPage() {
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold">👤 Characters</h2>
          <p class="text-slate-400 text-sm">Manage your film characters</p>
        </div>
        <button onclick="showCharacterModal()" class="btn-primary px-4 py-2 rounded-xl">+ New Character</button>
      </div>
      
      ${chars.length === 0 ? `
        <div class="glass rounded-2xl p-8 text-center">
          <p class="text-slate-400 mb-4">No characters yet.</p>
          <button onclick="showCharacterModal()" class="btn-primary px-6 py-2 rounded-xl">+ Create Character</button>
        </div>
      ` : `
        <div class="grid gap-4">
          ${chars.map(char => `
            <div class="glass rounded-2xl p-5">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">👤</span>
                    <div>
                      <h3 class="font-semibold text-lg">${char.name}</h3>
                      <p class="text-sm text-slate-400">${char.age || ''} • ${char.gender || ''} • ${char.role || ''}</p>
                    </div>
                  </div>
                  <p class="text-sm text-slate-300 mb-2">${char.physical || ''}</p>
                  <p class="text-sm text-slate-500">Costume: ${char.costume || 'N/A'}</p>
                </div>
                <div class="flex gap-2">
                  <button onclick="copyCharacterPrompt('${char.id}')" class="bg-blue-500/20 px-3 py-1.5 rounded-lg text-sm">Copy Prompt</button>
                  <button onclick="deleteCharacter('${char.id}')" class="bg-red-500/20 px-3 py-1.5 rounded-lg text-sm">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function showCharacterModal() {
  showModal('New Character', `
    <div class="space-y-4">
      <div><label class="block text-sm text-slate-400 mb-1">Name</label>
        <input type="text" id="char-name" class="w-full rounded-lg px-3 py-2" placeholder="Character name"></div>
      <div class="grid grid-cols-3 gap-3">
        <div><label class="block text-sm text-slate-400 mb-1">Age</label>
          <input type="text" id="char-age" class="w-full rounded-lg px-3 py-2" placeholder="25"></div>
        <div><label class="block text-sm text-slate-400 mb-1">Gender</label>
          <select id="char-gender" class="w-full rounded-lg px-3 py-2">
            <option>Male</option><option>Female</option><option>Non-binary</option>
          </select></div>
        <div><label class="block text-sm text-slate-400 mb-1">Role</label>
          <select id="char-role" class="w-full rounded-lg px-3 py-2">
            ${OPTIONS.characterRole.map(r => `<option>${r}</option>`).join('')}
          </select></div>
      </div>
      <div><label class="block text-sm text-slate-400 mb-1">Physical Description</label>
        <textarea id="char-physical" class="w-full rounded-lg px-3 py-2 h-20" placeholder="Height, build, hair, eyes..."></textarea></div>
      <div><label class="block text-sm text-slate-400 mb-1">Costume</label>
        <input type="text" id="char-costume" class="w-full rounded-lg px-3 py-2" placeholder="What they wear"></div>
    </div>
  `, async () => {
    const character = {
      user_id: state.user.id,
      project_id: state.currentProject || null,
      name: document.getElementById('char-name').value || 'Unnamed',
      age: document.getElementById('char-age').value,
      gender: document.getElementById('char-gender').value,
      role: document.getElementById('char-role').value,
      physical: document.getElementById('char-physical').value,
      costume: document.getElementById('char-costume').value
    };
    try {
      const saved = await DB.createCharacter(character);
      state.characters.unshift(saved);
      hideModal();
      renderSidebar();
      renderPage();
    } catch (error) { alert('Error: ' + error.message); }
  });
}

async function deleteCharacter(id) {
  if (!confirm('Delete this character?')) return;
  try {
    await DB.deleteCharacter(id);
    state.characters = state.characters.filter(c => c.id !== id);
    renderSidebar();
    renderPage();
  } catch (error) { alert('Error: ' + error.message); }
}

function copyCharacterPrompt(id) {
  const char = state.characters.find(c => c.id === id);
  if (!char) return;
  const prompt = `Character: ${char.name}, ${char.age} years old ${char.gender}, ${char.role}. Physical: ${char.physical}. Wearing: ${char.costume}.`;
  navigator.clipboard.writeText(prompt);
  alert('Character prompt copied!');
}

// ============ LOCATIONS PAGE ============
function renderLocationsPage() {
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold">🎭 Locations</h2>
          <p class="text-slate-400 text-sm">Manage your film locations</p>
        </div>
        <button onclick="showLocationModal()" class="btn-primary px-4 py-2 rounded-xl">+ New Location</button>
      </div>
      
      ${locs.length === 0 ? `
        <div class="glass rounded-2xl p-8 text-center">
          <p class="text-slate-400 mb-4">No locations yet.</p>
          <button onclick="showLocationModal()" class="btn-primary px-6 py-2 rounded-xl">+ Create Location</button>
        </div>
      ` : `
        <div class="grid gap-4">
          ${locs.map(loc => `
            <div class="glass rounded-2xl p-5">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">🎭</span>
                    <div>
                      <h3 class="font-semibold text-lg">${loc.name}</h3>
                      <p class="text-sm text-slate-400">${loc.type || ''} • ${loc.mood || ''} • ${loc.time_of_day || ''}</p>
                    </div>
                  </div>
                  <p class="text-sm text-slate-300">${loc.description || ''}</p>
                </div>
                <div class="flex gap-2">
                  <button onclick="copyLocationPrompt('${loc.id}')" class="bg-blue-500/20 px-3 py-1.5 rounded-lg text-sm">Copy Prompt</button>
                  <button onclick="deleteLocation('${loc.id}')" class="bg-red-500/20 px-3 py-1.5 rounded-lg text-sm">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function showLocationModal() {
  showModal('New Location', `
    <div class="space-y-4">
      <div><label class="block text-sm text-slate-400 mb-1">Name</label>
        <input type="text" id="loc-name" class="w-full rounded-lg px-3 py-2" placeholder="Location name"></div>
      <div class="grid grid-cols-3 gap-3">
        <div><label class="block text-sm text-slate-400 mb-1">Type</label>
          <select id="loc-type" class="w-full rounded-lg px-3 py-2">
            ${OPTIONS.locationType.map(t => `<option>${t}</option>`).join('')}
          </select></div>
        <div><label class="block text-sm text-slate-400 mb-1">Mood</label>
          <select id="loc-mood" class="w-full rounded-lg px-3 py-2">
            ${OPTIONS.mood.map(m => `<option>${m}</option>`).join('')}
          </select></div>
        <div><label class="block text-sm text-slate-400 mb-1">Time of Day</label>
          <select id="loc-time" class="w-full rounded-lg px-3 py-2">
            ${OPTIONS.timeOfDay.map(t => `<option>${t}</option>`).join('')}
          </select></div>
      </div>
      <div><label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="loc-desc" class="w-full rounded-lg px-3 py-2 h-20" placeholder="Describe the location..."></textarea></div>
    </div>
  `, async () => {
    const location = {
      user_id: state.user.id,
      project_id: state.currentProject || null,
      name: document.getElementById('loc-name').value || 'Unnamed',
      type: document.getElementById('loc-type').value,
      mood: document.getElementById('loc-mood').value,
      time_of_day: document.getElementById('loc-time').value,
      description: document.getElementById('loc-desc').value
    };
    try {
      const saved = await DB.createLocation(location);
      state.locations.unshift(saved);
      hideModal();
      renderSidebar();
      renderPage();
    } catch (error) { alert('Error: ' + error.message); }
  });
}

async function deleteLocation(id) {
  if (!confirm('Delete this location?')) return;
  try {
    await DB.deleteLocation(id);
    state.locations = state.locations.filter(l => l.id !== id);
    renderSidebar();
    renderPage();
  } catch (error) { alert('Error: ' + error.message); }
}

function copyLocationPrompt(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  const prompt = `Location: ${loc.name}, ${loc.type}. ${loc.description}. Mood: ${loc.mood}. Time: ${loc.time_of_day}.`;
  navigator.clipboard.writeText(prompt);
  alert('Location prompt copied!');
}


// ============ WORKFLOW PAGE ============
function renderWorkflowPage() {
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">📋 Production Workflow</h2>
        <p class="text-slate-400 text-sm">Track your progress through all production phases</p>
      </div>
      
      <div class="space-y-6">
        ${PHASES.map((phase, idx) => `
          <div class="glass rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">${phase.icon}</span>
              <div>
                <h3 class="font-semibold">Phase ${idx + 1}: ${phase.name}</h3>
                <p class="text-xs text-slate-500">${phase.apps.length} tools available</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${phase.apps.map(app => `
                <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer" onclick="navigateTo('app', '${app.id}')">
                  <span>${app.icon}</span>
                  <div class="flex-1">
                    <p class="text-sm font-medium">${app.name}</p>
                    <p class="text-xs text-slate-500">${app.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============ OPAL LINKS PAGE ============
function renderOpalLinksPage() {
  const globalLinksCount = Object.keys(state.globalOpalLinks).filter(k => state.globalOpalLinks[k]).length;
  const personalLinksCount = Object.keys(state.opalLinks).filter(k => state.opalLinks[k]).length;
  
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">🔗 Opal Links</h2>
        <p class="text-slate-400 text-sm">Quick access to Google Opal tools</p>
      </div>
      
      <!-- Status Cards -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="glass rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">🌐</span>
            <div>
              <h4 class="font-semibold">Global Links</h4>
              <p class="text-xs text-slate-500">Pre-configured by admin</p>
            </div>
          </div>
          <p class="text-3xl font-bold text-green-400">${globalLinksCount}</p>
          <p class="text-xs text-slate-500 mt-1">Ready to use</p>
        </div>
        <div class="glass rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">👤</span>
            <div>
              <h4 class="font-semibold">Personal Links</h4>
              <p class="text-xs text-slate-500">Your custom overrides</p>
            </div>
          </div>
          <p class="text-3xl font-bold text-cyan-400">${personalLinksCount}</p>
          <p class="text-xs text-slate-500 mt-1">Custom links</p>
        </div>
      </div>
      
      <!-- Quick Access Section -->
      ${globalLinksCount > 0 ? `
        <div class="glass rounded-2xl p-6 mb-6 gradient-card">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            <span>🚀</span> Quick Access (Click to Open)
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            ${PHASES.flatMap(phase => phase.apps.filter(app => getEffectiveOpalLink(app.id)).map(app => `
              <a href="${getEffectiveOpalLink(app.id)}" target="_blank" 
                class="glass glass-hover rounded-xl p-3 text-center cursor-pointer block">
                <span class="text-2xl block mb-1">${app.icon}</span>
                <span class="text-xs">${app.name}</span>
                ${state.globalOpalLinks[app.id] && !state.opalLinks[app.id] ? '<span class="block text-[10px] text-green-400 mt-1">✓ Global</span>' : ''}
              </a>
            `)).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Personal Links Override Section -->
      <div class="glass rounded-2xl p-6 mb-6">
        <h3 class="font-semibold mb-4">📝 Personal Link Overrides (Optional)</h3>
        <p class="text-sm text-slate-400 mb-4">Add your own links to override global settings, or leave empty to use global links.</p>
        <ol class="text-sm text-slate-500 space-y-1 mb-4">
          <li>1. Go to <a href="https://opal.google" target="_blank" class="text-cyan-400 hover:underline">opal.google</a></li>
          <li>2. Open the specific tool you want</li>
          <li>3. Copy the URL and paste below</li>
        </ol>
      </div>
      
      <div class="space-y-4">
        ${PHASES.map(phase => `
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold mb-4">${phase.icon} ${phase.name}</h3>
            <div class="space-y-3">
              ${phase.apps.map(app => {
                const hasGlobal = !!state.globalOpalLinks[app.id];
                const hasPersonal = !!state.opalLinks[app.id];
                return `
                <div class="flex items-center gap-3">
                  <span class="w-8">${app.icon}</span>
                  <span class="w-40 text-sm">${app.name}</span>
                  ${hasGlobal ? '<span class="text-xs text-green-400 w-16">✓ Global</span>' : '<span class="w-16"></span>'}
                  <input type="text" id="opal-${app.id}" value="${state.opalLinks[app.id] || ''}" 
                    class="flex-1 rounded-lg px-3 py-2 text-sm" placeholder="${hasGlobal ? 'Using global link (optional override)' : 'https://opal.google/...'}">
                  <button onclick="saveOpalLink('${app.id}')" class="btn-secondary px-3 py-2 rounded-lg text-sm">Save</button>
                </div>
              `}).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function saveOpalLink(appId) {
  const url = document.getElementById('opal-' + appId).value;
  try {
    await DB.upsertOpalLink(state.user.id, appId, url);
    state.opalLinks[appId] = url;
    alert('Saved!');
  } catch (error) { alert('Error: ' + error.message); }
}

// ============ HISTORY PANEL ============
function showHistoryPanel() {
  document.getElementById('history-panel').classList.remove('hidden');
  renderHistoryList();
}

function hideHistoryPanel() {
  document.getElementById('history-panel').classList.add('hidden');
}

function renderHistoryList() {
  const list = document.getElementById('history-list');
  const filtered = state.history.filter(h => !state.currentProject || h.project_id === state.currentProject);
  
  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-slate-500 text-center p-4">No history yet</p>';
    return;
  }
  
  list.innerHTML = filtered.map(h => {
    const app = findApp(h.app_id);
    return `
      <div class="glass rounded-xl p-4 mb-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-cyan-400">${app ? app.name : h.app_id}</span>
          <span class="text-xs text-slate-500">${new Date(h.created_at).toLocaleString()}</span>
        </div>
        <p class="text-xs text-slate-300 line-clamp-3 mb-2">${h.prompt.substring(0, 150)}...</p>
        <div class="flex gap-2">
          <button onclick="copyHistoryPrompt('${h.id}')" class="text-xs text-slate-400 hover:text-white">📋 Copy</button>
          <button onclick="deleteHistoryItem('${h.id}')" class="text-xs text-red-400 hover:text-red-300">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function copyHistoryPrompt(id) {
  const item = state.history.find(h => h.id === id);
  if (item) {
    navigator.clipboard.writeText(item.prompt);
    alert('Copied!');
  }
}

async function deleteHistoryItem(id) {
  if (!confirm('Delete this history item?')) return;
  try {
    await DB.deleteHistory(id);
    state.history = state.history.filter(h => h.id !== id);
    updateHistoryCount();
    renderHistoryList();
  } catch (error) { alert('Error: ' + error.message); }
}

function updateHistoryCount() {
  const count = state.history.filter(h => !state.currentProject || h.project_id === state.currentProject).length;
  document.getElementById('history-count').textContent = count;
}

// ============ MODAL ============
function showModal(title, content, onSave) {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onclick="hideModal()">
      <div class="glass rounded-2xl p-6 w-full max-w-lg fade-in" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">${title}</h3>
          <button onclick="hideModal()" class="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>
        <div class="mb-6">${content}</div>
        <div class="flex gap-3 justify-end">
          <button onclick="hideModal()" class="btn-secondary px-4 py-2 rounded-lg">Cancel</button>
          <button onclick="window.modalSave()" class="btn-primary px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  `;
  window.modalSave = onSave;
}

function hideModal() {
  document.getElementById('modal-container').innerHTML = '';
  window.modalSave = null;
}

function showSettingsModal() {
  showModal('Settings', `
    <div class="space-y-4">
      <p class="text-slate-400">Logged in as: <span class="text-white">${state.user?.email}</span></p>
      <p class="text-slate-400">Role: <span class="text-white ${isAdmin() ? 'text-yellow-400' : ''}">${isAdmin() ? '👑 Admin' : '👤 User'}</span></p>
      <button onclick="handleLogout()" class="btn-secondary w-full py-2 rounded-lg text-red-400">Logout</button>
    </div>
  `, hideModal);
}

// ============ ADMIN: GLOBAL OPAL LINKS PAGE ============
function renderAdminOpalLinksPage() {
  if (!isAdmin()) return '<p>Access denied</p>';
  
  const totalApps = PHASES.reduce((sum, p) => sum + p.apps.length, 0);
  const configuredCount = Object.keys(state.globalOpalLinks).filter(k => state.globalOpalLinks[k]).length;
  
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">👑</span>
          <div>
            <h2 class="text-2xl font-bold">Manage Global Opal Links</h2>
            <p class="text-slate-400 text-sm">Configure links that ALL users can access</p>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="glass rounded-2xl p-5 mb-6 gradient-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-400">Global Links Configured</p>
            <p class="text-3xl font-bold text-green-400">${configuredCount} / ${totalApps}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-400">Coverage</p>
            <p class="text-3xl font-bold text-cyan-400">${Math.round(configuredCount/totalApps*100)}%</p>
          </div>
        </div>
        <div class="mt-4 bg-dark-800 rounded-full h-2 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-green-500 h-full" style="width: ${configuredCount/totalApps*100}%"></div>
        </div>
      </div>
      
      <!-- Instructions -->
      <div class="glass rounded-2xl p-6 mb-6">
        <h3 class="font-semibold mb-3 text-yellow-400">⚠️ Admin Instructions</h3>
        <ol class="text-sm text-slate-400 space-y-2">
          <li>1. Go to <a href="https://opal.google" target="_blank" class="text-cyan-400 hover:underline">opal.google</a> and open each tool</li>
          <li>2. Copy the URL with the flow parameter (e.g., <code class="text-xs bg-dark-800 px-2 py-1 rounded">https://opal.google/?flow=drive:/...</code>)</li>
          <li>3. Paste below and click Save - this link will be available to ALL users</li>
          <li>4. Users can still override with their own personal links if needed</li>
        </ol>
      </div>
      
      <!-- Links Configuration -->
      <div class="space-y-4">
        ${PHASES.map(phase => `
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              ${phase.icon} ${phase.name}
              <span class="text-xs text-slate-500">(${phase.apps.filter(a => state.globalOpalLinks[a.id]).length}/${phase.apps.length} configured)</span>
            </h3>
            <div class="space-y-3">
              ${phase.apps.map(app => {
                const hasLink = !!state.globalOpalLinks[app.id];
                return `
                <div class="flex items-center gap-3 ${hasLink ? 'bg-green-500/5 -mx-2 px-2 py-1 rounded-lg' : ''}">
                  <span class="w-8">${app.icon}</span>
                  <span class="w-40 text-sm font-medium">${app.name}</span>
                  ${hasLink ? '<span class="text-xs text-green-400 w-12">✓ Live</span>' : '<span class="text-xs text-slate-500 w-12">Empty</span>'}
                  <input type="text" id="global-opal-${app.id}" value="${state.globalOpalLinks[app.id] || ''}" 
                    class="flex-1 rounded-lg px-3 py-2 text-sm" placeholder="https://opal.google/?flow=drive:/...">
                  <button onclick="saveGlobalOpalLink('${app.id}')" class="btn-primary px-3 py-2 rounded-lg text-sm">Save</button>
                  ${hasLink ? `<button onclick="deleteGlobalOpalLink('${app.id}')" class="bg-red-500/20 px-3 py-2 rounded-lg text-sm text-red-400">×</button>` : ''}
                </div>
              `}).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function saveGlobalOpalLink(appId) {
  if (!isAdmin()) { alert('Admin access required'); return; }
  const url = document.getElementById('global-opal-' + appId).value;
  if (!url) { alert('Please enter a URL'); return; }
  try {
    await DB.upsertGlobalOpalLink(appId, url, state.user.id);
    state.globalOpalLinks[appId] = url;
    alert('Global link saved! All users can now access this.');
    renderPage();
  } catch (error) { alert('Error: ' + error.message); }
}

async function deleteGlobalOpalLink(appId) {
  if (!isAdmin()) { alert('Admin access required'); return; }
  if (!confirm('Remove this global link? Users will need to set their own.')) return;
  try {
    await DB.deleteGlobalOpalLink(appId);
    delete state.globalOpalLinks[appId];
    renderPage();
  } catch (error) { alert('Error: ' + error.message); }
}

// ============ ADMIN: USER MANAGEMENT PAGE ============
function renderAdminUsersPage() {
  if (!isAdmin()) return '<p>Access denied</p>';
  
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">👥</span>
          <div>
            <h2 class="text-2xl font-bold">User Management</h2>
            <p class="text-slate-400 text-sm">Manage user roles and permissions</p>
          </div>
        </div>
      </div>
      
      <div class="glass rounded-2xl p-6 mb-6">
        <h3 class="font-semibold mb-4">Make User Admin</h3>
        <p class="text-sm text-slate-400 mb-4">Enter the user's email to grant admin access. They must have already signed up.</p>
        <div class="flex gap-3">
          <input type="email" id="admin-email-input" class="flex-1 rounded-lg px-4 py-2" placeholder="user@email.com">
          <button onclick="makeUserAdmin()" class="btn-primary px-6 py-2 rounded-lg">Grant Admin</button>
        </div>
      </div>
      
      <div class="glass rounded-2xl p-6">
        <h3 class="font-semibold mb-4">Current Admin</h3>
        <div class="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-xl">
          <span class="text-2xl">👑</span>
          <div>
            <p class="font-medium">${state.user?.email}</p>
            <p class="text-xs text-yellow-400">You (Admin)</p>
          </div>
        </div>
        <p class="text-xs text-slate-500 mt-4">Note: To manage other admins, use Supabase dashboard directly.</p>
      </div>
    </div>
  `;
}

async function makeUserAdmin() {
  if (!isAdmin()) { alert('Admin access required'); return; }
  const email = document.getElementById('admin-email-input').value;
  if (!email) { alert('Please enter an email'); return; }
  alert('To add admin users, please use Supabase dashboard:\n\n1. Go to your Supabase project\n2. Open Table Editor > user_roles\n3. Find the user by their user_id\n4. Set role to "admin"\n\nThis ensures proper security.');
}

console.log('✅ App initialized');
