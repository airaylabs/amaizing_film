// raymAIzing film - Integrated Production Platform (Celtx-Style)
// Synopsis-Driven Production System with Guided Workflow

// ============ WORKFLOW STEPS DEFINITION ============
// Base workflow steps - will be translated dynamically
const WORKFLOW_STEPS_BASE = [
  { step: 1, id: 'ideation', icon: '💡', tools: ['idea-01', 'idea-02', 'idea-03'], required: false },
  { step: 2, id: 'synopsis', icon: '📖', tools: ['story-01'], required: true },
  { step: 3, id: 'breakdown', icon: '📑', tools: ['story-02', 'story-03', 'story-04'], required: true },
  { step: 4, id: 'preproduction', icon: '📝', tools: ['01', '02', '03', '04'], required: true },
  { step: 5, id: 'production-visual', icon: '🎬', tools: ['05', '06', '07', '08', '09', '10', '11'], required: true },
  { step: 6, id: 'production-audio', icon: '🔊', tools: ['audio-01', 'audio-02', 'audio-03', 'audio-04'], required: true },
  { step: 7, id: 'postproduction', icon: '🎞️', tools: ['12', '13', '14', 'post-01', 'post-02', 'post-03'], required: true },
  { step: 8, id: 'distribution', icon: '📢', tools: ['15', '16', 'dist-01', 'dist-02'], required: false }
];

// Get translated workflow steps
function getWorkflowSteps() {
  const isId = typeof getLang === 'function' && getLang() === 'id';
  const translations = {
    id: [
      { name: 'Cari Ide', description: 'Temukan ide cerita dari trend viral atau generate ide baru', tip: 'Optional: Gunakan jika belum punya ide cerita' },
      { name: 'Tulis Synopsis', description: 'Tulis synopsis lengkap - INI YANG PALING PENTING!', tip: 'Wajib: Synopsis akan mengisi otomatis semua tools lainnya' },
      { name: 'Breakdown Cerita', description: 'Pecah synopsis jadi episode dan scene', tip: 'Data dari synopsis akan otomatis terisi' },
      { name: 'Pre-Production', description: 'Buat treatment, storyboard, design karakter & lokasi', tip: 'Pilih scene/karakter untuk auto-fill' },
      { name: 'Produksi Visual', description: 'Generate gambar dan video untuk setiap scene', tip: 'Gunakan Opal untuk generate dengan AI' },
      { name: 'Produksi Audio', description: 'Generate dialog, musik, dan sound effect', tip: 'Dialog otomatis dari scene script' },
      { name: 'Post-Production', description: 'Edit, gabungkan scene, pilih momen viral', tip: 'Viral Picker akan pilih momen terbaik' },
      { name: 'Distribution', description: 'Buat thumbnail, poster, trailer untuk publish', tip: 'Siap publish ke platform!' }
    ],
    en: [
      { name: 'Find Ideas', description: 'Discover story ideas from viral trends or generate new ones', tip: 'Optional: Use if you don\'t have a story idea yet' },
      { name: 'Write Synopsis', description: 'Write your full synopsis - THIS IS THE MOST IMPORTANT!', tip: 'Required: Synopsis will auto-fill all other tools' },
      { name: 'Story Breakdown', description: 'Break down synopsis into episodes and scenes', tip: 'Data from synopsis will auto-fill' },
      { name: 'Pre-Production', description: 'Create treatment, storyboard, character & location design', tip: 'Select scene/character for auto-fill' },
      { name: 'Visual Production', description: 'Generate images and videos for each scene', tip: 'Use Opal to generate with AI' },
      { name: 'Audio Production', description: 'Generate dialogue, music, and sound effects', tip: 'Dialogue auto-generated from scene script' },
      { name: 'Post-Production', description: 'Edit, combine scenes, pick viral moments', tip: 'Viral Picker will select the best moments' },
      { name: 'Distribution', description: 'Create thumbnails, posters, trailers for publishing', tip: 'Ready to publish to platforms!' }
    ]
  };
  
  const lang = isId ? 'id' : 'en';
  return WORKFLOW_STEPS_BASE.map((step, idx) => ({
    ...step,
    ...translations[lang][idx]
  }));
}

// For backward compatibility
const WORKFLOW_STEPS = WORKFLOW_STEPS_BASE.map((step, idx) => ({
  ...step,
  name: ['Cari Ide', 'Tulis Synopsis', 'Breakdown Cerita', 'Pre-Production', 'Produksi Visual', 'Produksi Audio', 'Post-Production', 'Distribution'][idx],
  description: ['Temukan ide cerita dari trend viral atau generate ide baru', 'Tulis synopsis lengkap - INI YANG PALING PENTING!', 'Pecah synopsis jadi episode dan scene', 'Buat treatment, storyboard, design karakter & lokasi', 'Generate gambar dan video untuk setiap scene', 'Generate dialog, musik, dan sound effect', 'Edit, gabungkan scene, pilih momen viral', 'Buat thumbnail, poster, trailer untuk publish'][idx],
  tip: ['Optional: Gunakan jika belum punya ide cerita', 'Wajib: Synopsis akan mengisi otomatis semua tools lainnya', 'Data dari synopsis akan otomatis terisi', 'Pilih scene/karakter untuk auto-fill', 'Gunakan Opal untuk generate dengan AI', 'Dialog otomatis dari scene script', 'Viral Picker akan pilih momen terbaik', 'Siap publish ke platform!'][idx]
}));

// ============ STATE ============
let state = {
  user: null,
  userRole: 'user',
  currentPage: 'dashboard',
  currentApp: null,
  currentProject: null,
  currentWorkflowStep: 1,
  projects: [],
  characters: [],
  locations: [],
  episodes: [],
  scenes: [],
  history: [],
  opalLinks: {},
  globalOpalLinks: {},
  generatedAssets: [],
  outputCount: 1,
  
  // ============ PRODUCTION BIBLE (Core Data) ============
  productionBible: {
    title: '',
    logline: '',
    synopsis: '',
    genre: '',
    projectType: '',
    style: '',
    mood: '',
    setting: '',
    themes: '',
    episodes: [],
    characters: [],
    locations: [],
    scenes: []
  },
  
  // Workflow Progress
  workflowProgress: {
    ideation: false,
    synopsis: false,
    breakdown: false,
    preproduction: false,
    'production-visual': false,
    'production-audio': false,
    postproduction: false,
    distribution: false
  },
  
  // Current selection for auto-populate
  selectedEpisode: null,
  selectedScene: null,
  selectedCharacter: null,
  selectedLocation: null
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
    
    // Load Production Bible from localStorage
    loadProductionBible();
    
    // Load Workflow Progress
    loadWorkflowProgress();
    
    updateProjectSelector();
  } catch (error) { console.error('Error loading data:', error); }
}

// Helper: Get effective Opal link (personal > global > default)
function getEffectiveOpalLink(appId) {
  return state.opalLinks[appId] || state.globalOpalLinks[appId] || DEFAULT_OPAL_LINKS[appId] || null;
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
  else if (state.currentPage === 'admin-opal-links') text = '👑 Global Links';
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
  const hasBible = state.productionBible.synopsis && state.productionBible.synopsis.length > 0;
  
  let html = `
    <div class="sidebar-item ${state.currentPage === 'dashboard' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-1 text-sm" onclick="navigateTo('dashboard')">
      <span class="mr-2">🏠</span> Dashboard
    </div>
  `;
  
  // Production Bible Status
  if (hasBible) {
    html += `
      <div class="mx-2 my-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
        <div class="flex items-center gap-2">
          <span class="text-green-400 text-xs">📖</span>
          <span class="text-[10px] text-green-400 font-medium truncate">${state.productionBible.title || 'Bible Active'}</span>
        </div>
      </div>
    `;
  }
  
  // Group phases by category
  const phaseGroups = [
    { label: 'Development', phases: ['ideation', 'story-development'] },
    { label: 'Production', phases: ['pre-production', 'production-image', 'production-video', 'production-audio'] },
    { label: 'Finishing', phases: ['post-production', 'distribution'] }
  ];
  
  phaseGroups.forEach(group => {
    html += `<div class="mt-3 mb-1 px-2 text-[10px] text-slate-500 uppercase tracking-wider">${group.label}</div>`;
    
    PHASES.filter(p => group.phases.includes(p.id)).forEach(phase => {
      const isExpanded = phase.apps.some(a => a.id === state.currentApp);
      const hasOpalLinks = phase.apps.filter(a => getEffectiveOpalLink(a.id)).length;
      const autoPopulateApps = phase.apps.filter(a => a.autoPopulate).length;
      
      html += `
        <div class="mb-0.5">
          <div class="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-white/5 text-sm" onclick="togglePhase('${phase.id}')">
            <span class="flex items-center gap-1.5">
              <span class="text-sm">${phase.icon}</span>
              <span class="text-xs">${phase.name}</span>
            </span>
            <span class="flex items-center gap-1">
              ${hasBible && autoPopulateApps > 0 ? `<span class="text-[8px] text-green-400">🔗</span>` : ''}
              ${hasOpalLinks > 0 ? `<span class="text-[10px] text-cyan-400">${hasOpalLinks}</span>` : ''}
            </span>
          </div>
          <div id="phase-${phase.id}" class="${isExpanded ? '' : 'hidden'} ml-3 border-l border-cyan-500/15 pl-1.5">
            ${phase.apps.map(app => {
              const hasLink = getEffectiveOpalLink(app.id);
              const isCore = app.isCore;
              const canAutoPopulate = app.autoPopulate && hasBible;
              return `
              <div class="sidebar-item ${state.currentApp === app.id ? 'active' : ''} rounded p-1.5 cursor-pointer text-xs flex items-center justify-between group" onclick="navigateTo('app', '${app.id}')">
                <span class="flex items-center gap-1.5 truncate">
                  <span>${app.icon}</span>
                  <span class="truncate">${app.name}</span>
                  ${isCore ? '<span class="text-yellow-400 text-[8px]">⭐</span>' : ''}
                  ${canAutoPopulate ? '<span class="text-green-400 text-[8px]">🔗</span>' : ''}
                </span>
                ${hasLink ? `<a href="${hasLink}" target="_blank" onclick="event.stopPropagation()" class="opacity-0 group-hover:opacity-100 text-cyan-400 text-[10px]">↗</a>` : ''}
              </div>
            `}).join('')}
          </div>
        </div>
      `;
    });
  });
  
  html += `
    <div class="mt-3 mb-1 px-2 text-[10px] text-slate-500 uppercase tracking-wider">${t('assets') || 'Assets'}</div>
    <div class="sidebar-item ${state.currentPage === 'characters' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-sm flex items-center justify-between" onclick="navigateTo('characters')">
      <span class="flex items-center gap-1.5"><span>👤</span><span class="text-xs">${t('characters')}</span></span>
      <span class="text-[10px] text-slate-500">${chars.length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'locations' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-sm flex items-center justify-between" onclick="navigateTo('locations')">
      <span class="flex items-center gap-1.5"><span>🎭</span><span class="text-xs">${t('locations')}</span></span>
      <span class="text-[10px] text-slate-500">${locs.length}</span>
    </div>
  `;
  
  // Admin section
  if (isAdmin()) {
    html += `
      <div class="mt-3 mb-1 px-2 text-[10px] text-amber-400 uppercase tracking-wider">Admin</div>
      <div class="sidebar-item ${state.currentPage === 'admin-opal-links' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-xs" onclick="navigateTo('admin-opal-links')">
        <span class="flex items-center gap-1.5"><span>⚙️</span> Global Links</span>
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
    case 'admin-opal-links': html = isAdmin() ? renderAdminOpalLinksPage() : renderDashboard(); break;
    default: html = renderDashboard();
  }
  content.innerHTML = `<div class="fade-in">${html}</div>`;
  updateBreadcrumb();
}

function renderDashboard() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  const bible = state.productionBible;
  const hasBible = bible.synopsis && bible.synopsis.length > 0;
  const currentStep = getCurrentWorkflowStep();
  
  return `
    <div class="w-full">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-1" style="font-family: 'Space Grotesk', sans-serif;">
          <span class="text-white">raym</span><span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI</span><span class="text-slate-400 font-normal">zing film</span>
        </h1>
        <p class="text-slate-500 text-sm">${t('tagline')}</p>
      </div>
      
      <!-- ============ GUIDED WORKFLOW - MAIN FEATURE ============ -->
      <div class="glass rounded-2xl p-6 mb-6 border-2 border-cyan-500/30">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 class="text-lg font-bold flex items-center gap-2 flex-wrap">
              ${t('workflowTitle')}
              <span class="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">${t('stepOf').replace('{current}', currentStep).replace('{total}', '8')}</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">${t('workflowSubtitle')}</p>
          </div>
          <button onclick="showWorkflowHelp()" class="btn-secondary px-3 py-1.5 rounded-lg text-xs">❓ ${t('helpTitle')}</button>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-xs text-slate-500 mb-2">
            <span>Progress</span>
            <span>${Math.round((currentStep - 1) / 8 * 100)}% Complete</span>
          </div>
          <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500" style="width: ${(currentStep - 1) / 8 * 100}%"></div>
          </div>
        </div>
        
        <!-- Workflow Steps -->
        <div class="space-y-3">
          ${getWorkflowSteps().map((step, idx) => {
            const isCompleted = isStepCompleted(step.id);
            const isCurrent = step.step === currentStep;
            const isLocked = step.step > currentStep && step.required && !isStepCompleted(WORKFLOW_STEPS[idx-1]?.id);
            const stepTools = step.tools.map(t => findApp(t)).filter(Boolean);
            
            return `
              <div class="workflow-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} 
                          rounded-xl p-4 border ${isCurrent ? 'border-cyan-500 bg-cyan-500/10' : isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-800/50'}
                          ${isLocked ? 'opacity-50' : 'cursor-pointer hover:border-cyan-500/50'}"
                   onclick="${isLocked ? '' : `startWorkflowStep(${step.step})`}">
                <div class="flex items-start gap-4">
                  <!-- Step Number -->
                  <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                              ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'}">
                    ${isCompleted ? '✓' : step.step}
                  </div>
                  
                  <!-- Step Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xl">${step.icon}</span>
                      <h3 class="font-semibold ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-white'}">${step.name}</h3>
                      ${step.required ? `<span class="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">${t('required')}</span>` : `<span class="text-[10px] bg-slate-600 text-slate-400 px-1.5 py-0.5 rounded">${t('optional')}</span>`}
                      ${isLocked ? `<span class="text-[10px] bg-slate-600 text-slate-400 px-1.5 py-0.5 rounded">🔒 ${t('locked')}</span>` : ''}
                    </div>
                    <p class="text-sm text-slate-400 mb-2">${step.description}</p>
                    
                    <!-- Tools in this step -->
                    <div class="flex flex-wrap gap-2 mb-2">
                      ${stepTools.map(tool => {
                        const hasOpal = getEffectiveOpalLink(tool.id);
                        return `
                          <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg 
                                       ${hasOpal ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-400'}">
                            ${tool.icon} ${tool.name}
                            ${hasOpal ? '<span class="text-green-400">✓</span>' : ''}
                          </span>
                        `;
                      }).join('')}
                    </div>
                    
                    <!-- Tip -->
                    <p class="text-xs text-slate-500 italic">💡 ${step.tip}</p>
                  </div>
                  
                  <!-- Action Button -->
                  <div class="flex-shrink-0">
                    ${isCurrent ? `
                      <button onclick="event.stopPropagation(); navigateTo('app', '${step.tools[0]}')" 
                              class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold animate-pulse">
                        ${t('start')} →
                      </button>
                    ` : isCompleted ? `
                      <button onclick="event.stopPropagation(); navigateTo('app', '${step.tools[0]}')" 
                              class="btn-secondary px-3 py-1.5 rounded-lg text-xs">
                        ${t('edit')}
                      </button>
                    ` : isLocked ? `
                      <span class="text-slate-500 text-xs">🔒</span>
                    ` : `
                      <button onclick="event.stopPropagation(); navigateTo('app', '${step.tools[0]}')" 
                              class="btn-secondary px-3 py-1.5 rounded-lg text-xs">
                        ${t('next')}
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Production Bible Status (if exists) -->
      ${hasBible ? `
        <div class="glass rounded-xl p-4 mb-6 border border-green-500/30 bg-green-500/5 card-hover">
          <div class="flex items-start justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">📖</div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-green-400">${bible.title || t('bibleEmpty')}</h3>
                  <span class="tag bg-green-500/20 border-green-500/30 text-green-400 text-xs">${t('bibleActive')}</span>
                </div>
                <p class="text-xs text-slate-400 mt-1">${bible.genre || ''} • ${bible.projectType || ''}</p>
                <div class="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                  <span>👥 ${bible.characters?.length || 0} ${t('characters')}</span>
                  <span>🎭 ${bible.locations?.length || 0} ${t('locations')}</span>
                  <span>📑 ${bible.episodes?.length || 0} Episode</span>
                  <span>🎬 ${bible.scenes?.length || 0} Scene</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button onclick="navigateTo('app', 'story-01')" class="btn-secondary px-3 py-1.5 rounded-lg text-xs">✏️ ${t('editBible')}</button>
              <button onclick="clearProductionBible()" class="btn-secondary px-3 py-1.5 rounded-lg text-xs text-red-400">🗑️ ${t('clearBible')}</button>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${project ? `
        <div class="glass rounded-xl p-4 mb-6 gradient-card card-hover">
          <div class="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="tag text-xs">${project.type}</span>
                <span class="tag text-xs">${project.genre}</span>
              </div>
              <h2 class="text-lg font-bold">${project.name}</h2>
              <p class="text-slate-500 text-xs mt-1">${project.description || t('projectDesc')}</p>
            </div>
            <button onclick="deleteProject('${project.id}')" class="btn-secondary px-2 py-1 rounded text-xs">${t('delete')}</button>
          </div>
        </div>
      ` : `
        <div class="glass rounded-xl p-6 mb-6 text-center gradient-card">
          <div class="text-3xl mb-2">🎬</div>
          <h3 class="text-base font-semibold mb-1">${t('bibleStart')}</h3>
          <p class="text-slate-500 text-xs mb-4">${t('bibleStartDesc')}</p>
          <button onclick="showNewProjectModal()" class="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">+ ${t('newProject')}</button>
        </div>
      `}
      
      <!-- Quick Stats Row - Responsive -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="glass rounded-xl p-3 cursor-pointer glass-hover" onclick="navigateTo('characters')">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xl">👤</span>
            <span class="text-xl font-bold text-cyan-400">${chars.length}</span>
          </div>
          <p class="text-xs text-slate-400">${t('characters')}</p>
        </div>
        <div class="glass rounded-xl p-3 cursor-pointer glass-hover card-hover" onclick="navigateTo('locations')">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xl">🎭</span>
            <span class="text-xl font-bold text-blue-400">${locs.length}</span>
          </div>
          <p class="text-xs text-slate-400">${t('locations')}</p>
        </div>
        <div class="glass rounded-xl p-3 cursor-pointer glass-hover card-hover" onclick="showHistoryPanel()">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xl">📜</span>
            <span class="text-xl font-bold text-sky-400">${state.history.length}</span>
          </div>
          <p class="text-xs text-slate-400">${t('history')}</p>
        </div>
        <div class="glass rounded-xl p-3 cursor-pointer glass-hover card-hover" onclick="navigateTo('workflow')">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xl">📋</span>
            <span class="text-xl font-bold text-indigo-400">${PHASES.length}</span>
          </div>
          <p class="text-xs text-slate-400">${t('phases')}</p>
        </div>
      </div>

      <!-- Production Pipeline - Modern Horizontal Flow -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-slate-300">${t('phases')}</h3>
          <button onclick="navigateTo('workflow')" class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            ${t('helpWorkflow')} <span>→</span>
          </button>
        </div>
        
        <!-- Pipeline Progress Bar -->
        <div class="glass rounded-2xl p-4 mb-4">
          <div class="flex items-center gap-1 overflow-x-auto pb-2">
            ${PHASES.map((phase, idx) => {
              const configuredApps = phase.apps.filter(a => getEffectiveOpalLink(a.id));
              const progress = Math.round((configuredApps.length / phase.apps.length) * 100);
              const isComplete = progress === 100;
              const isActive = progress > 0 && progress < 100;
              return `
                <div class="flex items-center ${idx < PHASES.length - 1 ? 'flex-1' : ''}">
                  <div onclick="togglePhaseExpand(${idx})" 
                       class="flex-shrink-0 cursor-pointer group relative">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all
                                ${isComplete ? 'bg-green-500/20 border-2 border-green-500' : 
                                  isActive ? 'bg-cyan-500/20 border-2 border-cyan-500 animate-pulse' : 
                                  'bg-slate-800 border border-slate-700 hover:border-cyan-500/50'}">
                      ${phase.icon}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center
                                ${isComplete ? 'bg-green-500 text-white' : 
                                  isActive ? 'bg-cyan-500 text-dark-950' : 
                                  'bg-slate-700 text-slate-400'}">
                      ${isComplete ? '✓' : configuredApps.length}
                    </div>
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-500 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                      ${phase.name}
                    </div>
                  </div>
                  ${idx < PHASES.length - 1 ? `
                    <div class="flex-1 h-0.5 mx-1 ${isComplete ? 'bg-green-500' : 'bg-slate-700'}"></div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Expandable Phase Cards -->
        <div id="phase-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${PHASES.slice(0, 3).map((phase, idx) => renderPhaseCard(phase, idx)).join('')}
        </div>
        <button onclick="toggleAllPhases()" id="show-more-phases" class="w-full mt-3 py-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          ${t('next')} ${PHASES.length - 3} ${t('phases').toLowerCase()} ▼
        </button>
      </div>
      
      <!-- Quick Actions -->
      <div class="glass rounded-xl p-4">
        <h3 class="text-sm font-semibold text-slate-300 mb-3">⚡ ${t('quickActions')}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onclick="navigateTo('app', 'story-01')" class="btn-secondary p-3 rounded-xl text-center hover:border-cyan-500/50 transition-all">
            <span class="text-xl block mb-1">📖</span>
            <span class="text-xs">${t('editBible')}</span>
          </button>
          <button onclick="navigateTo('characters')" class="btn-secondary p-3 rounded-xl text-center hover:border-cyan-500/50 transition-all">
            <span class="text-xl block mb-1">👤</span>
            <span class="text-xs">${t('characters')}</span>
          </button>
          <button onclick="navigateTo('locations')" class="btn-secondary p-3 rounded-xl text-center hover:border-cyan-500/50 transition-all">
            <span class="text-xl block mb-1">🎭</span>
            <span class="text-xs">${t('locations')}</span>
          </button>
          <button onclick="showHistoryPanel()" class="btn-secondary p-3 rounded-xl text-center hover:border-cyan-500/50 transition-all">
            <span class="text-xl block mb-1">📜</span>
            <span class="text-xs">${t('history')}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Helper function to render phase card
function renderPhaseCard(phase, idx) {
  const configuredApps = phase.apps.filter(a => getEffectiveOpalLink(a.id));
  const progress = Math.round((configuredApps.length / phase.apps.length) * 100);
  
  return `
    <div class="glass rounded-xl p-3 hover:border-cyan-500/30 transition-all cursor-pointer" onclick="navigateTo('app', '${phase.apps[0]?.id}')">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-lg">${phase.icon}</div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold truncate">${phase.name}</h4>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full ${progress === 100 ? 'bg-green-500' : 'bg-cyan-500'} transition-all" style="width: ${progress}%"></div>
            </div>
            <span class="text-[10px] ${progress === 100 ? 'text-green-400' : 'text-slate-500'}">${configuredApps.length}/${phase.apps.length}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-1">
        ${phase.apps.slice(0, 4).map(app => {
          const hasLink = getEffectiveOpalLink(app.id);
          return `<span class="text-xs px-2 py-0.5 rounded ${hasLink ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}">${app.icon}</span>`;
        }).join('')}
        ${phase.apps.length > 4 ? `<span class="text-xs text-slate-500">+${phase.apps.length - 4}</span>` : ''}
      </div>
    </div>
  `;
}

// Toggle phase expansion
let showAllPhases = false;
function toggleAllPhases() {
  showAllPhases = !showAllPhases;
  const container = document.getElementById('phase-cards');
  const btn = document.getElementById('show-more-phases');
  if (container) {
    container.innerHTML = showAllPhases 
      ? PHASES.map((phase, idx) => renderPhaseCard(phase, idx)).join('')
      : PHASES.slice(0, 3).map((phase, idx) => renderPhaseCard(phase, idx)).join('');
  }
  if (btn) {
    btn.innerHTML = showAllPhases 
      ? `${t('previous')} ▲`
      : `${t('next')} ${PHASES.length - 3} ${t('phases').toLowerCase()} ▼`;
  }
}

function togglePhaseExpand(idx) {
  const phase = PHASES[idx];
  if (phase && phase.apps.length > 0) {
    navigateTo('app', phase.apps[0].id);
  }
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


// ============ APP PAGE (Celtx-Style Integrated) ============
function renderAppPage() {
  const appConfig = APP_FORMS[state.currentApp];
  const app = findApp(state.currentApp);
  const phase = findPhase(state.currentApp);
  if (!appConfig || !app) return '<p>App not found</p>';
  
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  const effectiveLink = getEffectiveOpalLink(state.currentApp);
  const isGlobalLink = !state.opalLinks[state.currentApp] && state.globalOpalLinks[state.currentApp];
  const hasAutoPopulate = appConfig.autoPopulateFrom || app.autoPopulate;
  const isCoreTool = appConfig.isCore;
  
  return `
    <div class="w-full">
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
      
      <!-- Core Tool Banner -->
      ${isCoreTool ? `
        <div class="glass rounded-xl p-4 mb-6 border border-yellow-500/30 bg-yellow-500/5">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⭐</span>
            <div>
              <h4 class="font-semibold text-yellow-400">Core Tool - Synopsis Writer</h4>
              <p class="text-xs text-slate-400">This is the master tool. Data entered here will auto-populate ALL other production phases.</p>
            </div>
          </div>
        </div>
      ` : ''}
      
      <!-- Context Selector (Auto-Populate) -->
      ${hasAutoPopulate ? `
        <div class="glass rounded-xl p-4 mb-6 border border-cyan-500/20">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-cyan-400">🔗</span>
            <span class="text-sm font-semibold text-cyan-400">Auto-Populate from Production Bible</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs text-slate-500 mb-1">Episode</label>
              <select id="context-episode" class="w-full rounded-lg px-3 py-2 text-sm" onchange="onContextChange()">
                <option value="">Select Episode...</option>
                ${state.productionBible.episodes.map((ep, i) => `
                  <option value="${i}" ${state.selectedEpisode === i ? 'selected' : ''}>Ep ${i+1}: ${ep.title || 'Untitled'}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Scene</label>
              <select id="context-scene" class="w-full rounded-lg px-3 py-2 text-sm" onchange="onContextChange()">
                <option value="">Select Scene...</option>
                ${getAvailableScenes().map((sc, i) => `
                  <option value="${i}" ${state.selectedScene === i ? 'selected' : ''}>Scene ${sc.number}: ${sc.location || 'Unknown'}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Character</label>
              <select id="context-character" class="w-full rounded-lg px-3 py-2 text-sm" onchange="onContextChange()">
                <option value="">Select Character...</option>
                ${state.productionBible.characters.map((ch, i) => `
                  <option value="${i}" ${state.selectedCharacter === i ? 'selected' : ''}>${ch.name || 'Character ' + (i+1)}</option>
                `).join('')}
                ${chars.map(c => `<option value="db-${c.id}">📁 ${c.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Location</label>
              <select id="context-location" class="w-full rounded-lg px-3 py-2 text-sm" onchange="onContextChange()">
                <option value="">Select Location...</option>
                ${state.productionBible.locations.map((loc, i) => `
                  <option value="${i}" ${state.selectedLocation === i ? 'selected' : ''}>${loc.name || 'Location ' + (i+1)}</option>
                `).join('')}
                ${locs.map(l => `<option value="db-${l.id}">📁 ${l.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <button onclick="autoPopulateForm()" class="mt-3 btn-primary px-4 py-2 rounded-lg text-xs w-full">
            ⚡ Auto-Fill Form from Selection
          </button>
        </div>
      ` : ''}
      
      <!-- Output Count & Mode Selector -->
      <div class="glass rounded-xl p-4 mb-6">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <span class="text-sm text-slate-400">Output:</span>
            <div class="flex gap-1">
              ${[1, 2, 3, 4].map(n => `
                <button onclick="setOutputCount(${n})" class="w-8 h-8 rounded-lg ${state.outputCount === n ? 'btn-primary' : 'btn-secondary'} text-xs font-bold">
                  ${n}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Mode:</span>
            <select id="character-mode" class="rounded-lg px-2 py-1 text-xs" onchange="updateCharacterMode(this.value)">
              <option value="single">Single</option>
              <option value="multi-2">2 Chars</option>
              <option value="multi-3">3 Chars</option>
              <option value="multi-4">4+ Chars</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Quick Insert (from saved assets) -->
      ${(chars.length > 0 || locs.length > 0) ? `
        <div class="glass rounded-xl p-3 mb-6">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-xs text-slate-500">Quick Insert:</span>
            ${chars.slice(0, 4).map(c => `
              <button onclick="quickInsertCharacter('${c.id}')" class="text-xs bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">👤 ${c.name}</button>
            `).join('')}
            ${locs.slice(0, 4).map(l => `
              <button onclick="quickInsertLocation('${l.id}')" class="text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">🎭 ${l.name}</button>
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
            ${isCoreTool ? `
              <button onclick="saveToProductionBible()" class="mt-3 w-full btn-primary py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400/30">
                ⭐ Save to Production Bible
              </button>
              <p class="text-xs text-slate-500 mt-2 text-center">This will enable auto-populate for all other tools</p>
            ` : ''}
          </div>
          
          ${hasAutoPopulate && state.productionBible.synopsis ? `
            <div class="glass rounded-2xl p-5 border border-green-500/20">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-green-400">✓</span>
                <h3 class="font-semibold text-sm text-green-400">Production Bible Active</h3>
              </div>
              <p class="text-xs text-slate-400 mb-2">"${state.productionBible.title || 'Untitled Project'}"</p>
              <p class="text-xs text-slate-500">${state.productionBible.characters?.length || 0} characters, ${state.productionBible.locations?.length || 0} locations, ${state.productionBible.episodes?.length || 0} episodes</p>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Workflow Navigation -->
      ${renderWorkflowNavigation(state.currentApp)}
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

// ============ AUTO-POPULATE FUNCTIONS (Celtx-Style Integration) ============
function getAvailableScenes() {
  if (state.selectedEpisode !== null && state.productionBible.episodes[state.selectedEpisode]) {
    return state.productionBible.episodes[state.selectedEpisode].scenes || [];
  }
  return state.productionBible.scenes || [];
}

function onContextChange() {
  const epSelect = document.getElementById('context-episode');
  const scSelect = document.getElementById('context-scene');
  const charSelect = document.getElementById('context-character');
  const locSelect = document.getElementById('context-location');
  
  if (epSelect) state.selectedEpisode = epSelect.value !== '' ? parseInt(epSelect.value) : null;
  if (scSelect) state.selectedScene = scSelect.value !== '' ? parseInt(scSelect.value) : null;
  if (charSelect) state.selectedCharacter = charSelect.value !== '' ? charSelect.value : null;
  if (locSelect) state.selectedLocation = locSelect.value !== '' ? locSelect.value : null;
  
  // Update scene dropdown based on episode selection
  if (epSelect && scSelect) {
    const scenes = getAvailableScenes();
    scSelect.innerHTML = '<option value="">Select Scene...</option>' + 
      scenes.map((sc, i) => `<option value="${i}">Scene ${sc.number || i+1}: ${sc.location || 'Unknown'}</option>`).join('');
  }
}

function autoPopulateForm() {
  const appConfig = APP_FORMS[state.currentApp];
  if (!appConfig) return;
  
  const bible = state.productionBible;
  
  // Get selected context data
  const episode = state.selectedEpisode !== null ? bible.episodes[state.selectedEpisode] : null;
  const scene = state.selectedScene !== null ? getAvailableScenes()[state.selectedScene] : null;
  let character = null;
  let location = null;
  
  // Handle character selection (from bible or database)
  if (state.selectedCharacter !== null) {
    if (typeof state.selectedCharacter === 'string' && state.selectedCharacter.startsWith('db-')) {
      const dbId = state.selectedCharacter.replace('db-', '');
      character = state.characters.find(c => c.id === dbId);
    } else {
      character = bible.characters[parseInt(state.selectedCharacter)];
    }
  }
  
  // Handle location selection (from bible or database)
  if (state.selectedLocation !== null) {
    if (typeof state.selectedLocation === 'string' && state.selectedLocation.startsWith('db-')) {
      const dbId = state.selectedLocation.replace('db-', '');
      location = state.locations.find(l => l.id === dbId);
    } else {
      location = bible.locations[parseInt(state.selectedLocation)];
    }
  }
  
  // Auto-fill form fields based on autoFill config
  appConfig.inputs.forEach(input => {
    const el = document.getElementById('input-' + input.id);
    if (!el || !input.autoFill) return;
    
    let value = '';
    const path = input.autoFill.split('.');
    
    // Map autoFill paths to actual data
    switch(path[0]) {
      case 'synopsis':
        value = bible.synopsis || '';
        break;
      case 'title':
        value = bible.title || '';
        break;
      case 'logline':
        value = bible.logline || '';
        break;
      case 'genre':
        value = bible.genre || '';
        break;
      case 'projectType':
        value = bible.projectType || '';
        break;
      case 'style':
        value = bible.style || '';
        break;
      case 'mood':
        value = bible.mood || '';
        break;
      case 'setting':
        value = bible.setting || '';
        break;
      case 'character':
        if (character) {
          if (path[1] === 'name') value = character.name || '';
          else if (path[1] === 'physical') value = character.physical || character.description || '';
          else if (path[1] === 'costume') value = character.costume || '';
          else if (path[1] === 'personality') value = character.personality || '';
          else if (path[1] === 'role') value = character.role || '';
          else if (path[1] === 'age') value = character.age || '';
          else if (path[1] === 'gender') value = character.gender || '';
          else value = character.name || '';
        }
        break;
      case 'location':
        if (location) {
          if (path[1] === 'name') value = location.name || '';
          else if (path[1] === 'type') value = location.type || location.locationType || '';
          else if (path[1] === 'description') value = location.description || '';
          else value = location.name || '';
        }
        break;
      case 'episode':
        if (episode) {
          if (path[1] === 'number') value = state.selectedEpisode + 1;
          else if (path[1] === 'title') value = episode.title || '';
          else if (path[1] === 'synopsis') value = episode.synopsis || '';
          else if (path[1] === 'scenes') value = (episode.scenes || []).map(s => `Scene ${s.number}: ${s.location}`).join('\n');
          else if (path[1] === 'duration') value = episode.duration || '';
          else value = episode.synopsis || '';
        }
        break;
      case 'scene':
        if (scene) {
          if (path[1] === 'number') value = scene.number || '';
          else if (path[1] === 'heading') value = scene.heading || scene.location || '';
          else if (path[1] === 'location') value = scene.location || '';
          else if (path[1] === 'description') value = scene.description || '';
          else if (path[1] === 'action') value = scene.action || '';
          else if (path[1] === 'dialogue') value = scene.dialogue || '';
          else if (path[1] === 'characters') value = (scene.characters || []).join(', ');
          else if (path[1] === 'time') value = scene.timeOfDay || '';
          else if (path[1] === 'visual') value = scene.visualDescription || scene.description || '';
          else if (path[1] === 'context') value = scene.context || scene.description || '';
          else if (path[1] === 'type') value = scene.type || '';
          else if (path[1] === 'sfx') value = scene.sfx || '';
          else if (path[1] === 'current') value = scene.description || '';
          else if (path[1] === 'next') value = getNextSceneDescription();
          else value = scene.description || '';
        }
        break;
      case 'viral':
        // For viral picker results
        if (path[1] === 'moments') value = bible.viralMoments || '';
        else if (path[1] === 'thumbnail') value = bible.thumbnailConcept || '';
        break;
      case 'poster':
        if (path[1] === 'concept') value = bible.posterConcept || generatePosterConcept();
        break;
      case 'tagline':
        value = bible.tagline || generateTagline();
        break;
    }
    
    if (value && el) {
      el.value = value;
    }
  });
  
  // Show success message
  showToast(getLang() === 'id' ? 'Form terisi otomatis dari Production Bible' : 'Form auto-filled from Production Bible', 'success');
}

function getNextSceneDescription() {
  const scenes = getAvailableScenes();
  if (state.selectedScene !== null && scenes[state.selectedScene + 1]) {
    return scenes[state.selectedScene + 1].description || '';
  }
  return '';
}

function generatePosterConcept() {
  const bible = state.productionBible;
  if (!bible.synopsis) return '';
  return `Movie poster for "${bible.title || 'Untitled'}". ${bible.genre || ''} ${bible.mood || ''} atmosphere. Key visual from the story.`;
}

function generateTagline() {
  const bible = state.productionBible;
  if (!bible.logline) return '';
  // Simple tagline generation from logline
  return bible.logline.split('.')[0] + '...';
}

function showToast(message, type = 'success') {
  const colors = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-pink-500'
  };
  const icons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌'
  };
  
  const toast = document.createElement('div');
  toast.className = `fixed bottom-20 right-4 ${colors[type]} text-white px-4 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 max-w-sm`;
  toast.innerHTML = `
    <span class="text-lg">${icons[type]}</span>
    <span class="text-sm font-medium">${message}</span>
  `;
  document.body.appendChild(toast);
  
  // Auto remove with fade out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Save Synopsis to Production Bible (called from Synopsis Writer)
function saveToProductionBible() {
  const appConfig = APP_FORMS[state.currentApp];
  if (!appConfig || state.currentApp !== 'story-01') return;
  
  // Collect all form values
  appConfig.inputs.forEach(input => {
    const el = document.getElementById('input-' + input.id);
    if (el && el.value) {
      state.productionBible[input.id] = el.value;
    }
  });
  
  // Save to localStorage for persistence
  localStorage.setItem('productionBible', JSON.stringify(state.productionBible));
  showToast(t('bibleSaved'), 'success');
}

// Load Production Bible from localStorage
function loadProductionBible() {
  const saved = localStorage.getItem('productionBible');
  if (saved) {
    try {
      state.productionBible = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading production bible:', e);
    }
  }
}

// Clear Production Bible
function clearProductionBible() {
  if (!confirm('Hapus Production Bible? Semua data auto-populate akan direset.')) return;
  state.productionBible = {
    title: '',
    logline: '',
    synopsis: '',
    genre: '',
    projectType: '',
    style: '',
    mood: '',
    setting: '',
    themes: '',
    episodes: [],
    characters: [],
    locations: [],
    scenes: []
  };
  state.workflowProgress = {
    ideation: false,
    synopsis: false,
    breakdown: false,
    preproduction: false,
    'production-visual': false,
    'production-audio': false,
    postproduction: false,
    distribution: false
  };
  localStorage.removeItem('productionBible');
  localStorage.removeItem('workflowProgress');
  showToast(t('bibleCleared'), 'info');
  renderPage();
}

// ============ WORKFLOW HELPER FUNCTIONS ============
function getCurrentWorkflowStep() {
  const bible = state.productionBible;
  
  // Check each step completion
  if (!bible.synopsis) return 1; // Need to start with ideation or synopsis
  if (!bible.episodes || bible.episodes.length === 0) return 3; // Need breakdown
  if (!state.workflowProgress.preproduction) return 4;
  if (!state.workflowProgress['production-visual']) return 5;
  if (!state.workflowProgress['production-audio']) return 6;
  if (!state.workflowProgress.postproduction) return 7;
  if (!state.workflowProgress.distribution) return 8;
  
  return 8; // All done
}

function isStepCompleted(stepId) {
  if (!stepId) return false;
  
  const bible = state.productionBible;
  
  switch(stepId) {
    case 'ideation':
      return state.workflowProgress.ideation || bible.synopsis;
    case 'synopsis':
      return bible.synopsis && bible.synopsis.length > 50;
    case 'breakdown':
      return bible.episodes && bible.episodes.length > 0;
    case 'preproduction':
      return state.workflowProgress.preproduction;
    case 'production-visual':
      return state.workflowProgress['production-visual'];
    case 'production-audio':
      return state.workflowProgress['production-audio'];
    case 'postproduction':
      return state.workflowProgress.postproduction;
    case 'distribution':
      return state.workflowProgress.distribution;
    default:
      return false;
  }
}

function startWorkflowStep(stepNumber) {
  const step = WORKFLOW_STEPS.find(s => s.step === stepNumber);
  if (!step) return;
  
  // Navigate to first tool in this step
  if (step.tools && step.tools.length > 0) {
    navigateTo('app', step.tools[0]);
  }
}

function markStepCompleted(stepId) {
  state.workflowProgress[stepId] = true;
  localStorage.setItem('workflowProgress', JSON.stringify(state.workflowProgress));
  showToast(t('stepCompleted'), 'success');
}

function loadWorkflowProgress() {
  const saved = localStorage.getItem('workflowProgress');
  if (saved) {
    try {
      state.workflowProgress = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading workflow progress:', e);
    }
  }
}

function renderWorkflowNavigation(currentAppId) {
  // Find which step this app belongs to
  const currentStepData = WORKFLOW_STEPS.find(step => step.tools.includes(currentAppId));
  if (!currentStepData) return '';
  
  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.id === currentStepData.id);
  const prevStep = currentStepIndex > 0 ? WORKFLOW_STEPS[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < WORKFLOW_STEPS.length - 1 ? WORKFLOW_STEPS[currentStepIndex + 1] : null;
  
  // Find other tools in same step
  const otherToolsInStep = currentStepData.tools.filter(t => t !== currentAppId).map(t => findApp(t)).filter(Boolean);
  
  return `
    <div class="glass rounded-xl p-4 mt-6 border border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-lg">${currentStepData.icon}</span>
          <div>
            <p class="text-xs text-slate-500">Step ${currentStepData.step} of 8</p>
            <p class="font-semibold text-sm">${currentStepData.name}</p>
          </div>
        </div>
        <button onclick="markCurrentStepDone()" class="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
          ✓ Tandai Selesai
        </button>
      </div>
      
      ${otherToolsInStep.length > 0 ? `
        <div class="mb-4">
          <p class="text-xs text-slate-500 mb-2">Tools lain di step ini:</p>
          <div class="flex flex-wrap gap-2">
            ${otherToolsInStep.map(tool => `
              <button onclick="navigateTo('app', '${tool.id}')" class="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
                ${tool.icon} ${tool.name}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="flex items-center justify-between pt-3 border-t border-slate-700">
        ${prevStep ? `
          <button onclick="navigateTo('app', '${prevStep.tools[0]}')" class="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            ← ${prevStep.icon} ${prevStep.name}
          </button>
        ` : '<div></div>'}
        
        <button onclick="navigateTo('dashboard')" class="text-xs text-slate-500 hover:text-white">
          🏠 Dashboard
        </button>
        
        ${nextStep ? `
          <button onclick="navigateTo('app', '${nextStep.tools[0]}')" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            ${nextStep.icon} ${nextStep.name} →
          </button>
        ` : `
          <button onclick="navigateTo('dashboard')" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            🎉 Selesai!
          </button>
        `}
      </div>
    </div>
  `;
}

function markCurrentStepDone() {
  const currentStepData = WORKFLOW_STEPS.find(step => step.tools.includes(state.currentApp));
  if (currentStepData) {
    markStepCompleted(currentStepData.id);
    renderPage();
  }
}

function showWorkflowHelp() {
  showModal('🎯 Panduan Workflow Produksi Film', `
    <div class="space-y-4 text-sm">
      <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
        <h4 class="font-bold text-yellow-400 mb-2">⭐ Langkah Paling Penting</h4>
        <p class="text-slate-300">Mulai dengan <strong>Synopsis Writer</strong> (Step 2). Tulis cerita lengkap di sana, dan semua tools lain akan otomatis terisi!</p>
      </div>
      
      <div class="space-y-3">
        <h4 class="font-semibold text-cyan-400">Cara Menggunakan:</h4>
        
        <div class="flex gap-3 items-start">
          <span class="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center flex-shrink-0">1</span>
          <div>
            <p class="font-medium">Ideation (Optional)</p>
            <p class="text-slate-400 text-xs">Cari ide dari trend viral atau generate ide baru jika belum punya cerita</p>
          </div>
        </div>
        
        <div class="flex gap-3 items-start">
          <span class="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center flex-shrink-0">2</span>
          <div>
            <p class="font-medium text-yellow-400">Synopsis Writer ⭐ WAJIB</p>
            <p class="text-slate-400 text-xs">Tulis synopsis lengkap. AI akan generate karakter, lokasi, episode, dan scene otomatis!</p>
          </div>
        </div>
        
        <div class="flex gap-3 items-start">
          <span class="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center flex-shrink-0">3</span>
          <div>
            <p class="font-medium">Breakdown Cerita</p>
            <p class="text-slate-400 text-xs">Pecah synopsis jadi episode dan scene. Data dari synopsis otomatis terisi.</p>
          </div>
        </div>
        
        <div class="flex gap-3 items-start">
          <span class="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center flex-shrink-0">4-6</span>
          <div>
            <p class="font-medium">Pre-Production & Production</p>
            <p class="text-slate-400 text-xs">Pilih scene/karakter, form otomatis terisi. Generate gambar, video, audio dengan Opal.</p>
          </div>
        </div>
        
        <div class="flex gap-3 items-start">
          <span class="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center flex-shrink-0">7-8</span>
          <div>
            <p class="font-medium">Post-Production & Distribution</p>
            <p class="text-slate-400 text-xs">Edit, pilih momen viral, buat thumbnail & trailer, siap publish!</p>
          </div>
        </div>
      </div>
      
      <div class="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <h4 class="font-bold text-cyan-400 mb-2">💡 Tips</h4>
        <ul class="text-slate-300 text-xs space-y-1">
          <li>• Setiap tool yang ada tanda 🔗 bisa auto-fill dari Production Bible</li>
          <li>• Klik "Auto-Fill Form" untuk mengisi form otomatis</li>
          <li>• Gunakan tombol "Open in Opal" untuk generate dengan AI</li>
          <li>• Save hasil ke History untuk referensi nanti</li>
        </ul>
      </div>
    </div>
  `, null, 'Mengerti!');
}

// Parse AI-generated production bible response
function parseProductionBibleResponse(response) {
  // This would parse the AI response and extract structured data
  // For now, we'll store the raw response and let users manually organize
  const bible = state.productionBible;
  
  // Try to extract characters
  const charMatch = response.match(/## 2\. CHARACTERS([\s\S]*?)## 3\./);
  if (charMatch) {
    // Parse character data
    const charSection = charMatch[1];
    const charBlocks = charSection.split(/\n(?=- Name:|Character \d)/);
    bible.characters = charBlocks.filter(b => b.trim()).map(block => {
      const nameMatch = block.match(/Name[:\s]+([^\n]+)/i);
      const ageMatch = block.match(/Age[:\s]+([^\n]+)/i);
      const physicalMatch = block.match(/Physical[:\s]+([^\n]+)/i);
      const costumeMatch = block.match(/Costume[:\s]+([^\n]+)/i);
      return {
        name: nameMatch ? nameMatch[1].trim() : '',
        age: ageMatch ? ageMatch[1].trim() : '',
        physical: physicalMatch ? physicalMatch[1].trim() : '',
        costume: costumeMatch ? costumeMatch[1].trim() : ''
      };
    });
  }
  
  // Try to extract locations
  const locMatch = response.match(/## 3\. LOCATIONS([\s\S]*?)## 4\./);
  if (locMatch) {
    const locSection = locMatch[1];
    const locBlocks = locSection.split(/\n(?=- Name:|Location \d)/);
    bible.locations = locBlocks.filter(b => b.trim()).map(block => {
      const nameMatch = block.match(/Name[:\s]+([^\n]+)/i);
      const typeMatch = block.match(/Type[:\s]+([^\n]+)/i);
      const descMatch = block.match(/Description[:\s]+([^\n]+)/i);
      return {
        name: nameMatch ? nameMatch[1].trim() : '',
        type: typeMatch ? typeMatch[1].trim() : '',
        description: descMatch ? descMatch[1].trim() : ''
      };
    });
  }
  
  // Try to extract episodes
  const epMatch = response.match(/## 4\. EPISODE BREAKDOWN([\s\S]*?)## 5\./);
  if (epMatch) {
    const epSection = epMatch[1];
    const epBlocks = epSection.split(/\n(?=Episode \d|Ep \d)/i);
    bible.episodes = epBlocks.filter(b => b.trim()).map(block => {
      const titleMatch = block.match(/(?:Episode \d+[:\s]+|Title[:\s]+)([^\n]+)/i);
      const synMatch = block.match(/Synopsis[:\s]+([^\n]+)/i);
      return {
        title: titleMatch ? titleMatch[1].trim() : '',
        synopsis: synMatch ? synMatch[1].trim() : '',
        scenes: []
      };
    });
  }
  
  // Save parsed data
  localStorage.setItem('productionBible', JSON.stringify(bible));
  showToast(t('bibleSaved'), 'success');
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
    <div class="w-full">
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
    <div class="w-full">
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
    <div class="w-full">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">${t('workflowTitle')}</h2>
        <p class="text-slate-400 text-sm">${t('workflowSubtitle')}</p>
      </div>
      
      <div class="space-y-4">
        ${PHASES.map((phase, idx) => {
          const configuredApps = phase.apps.filter(a => getEffectiveOpalLink(a.id));
          const progress = Math.round((configuredApps.length / phase.apps.length) * 100);
          return `
          <div class="glass rounded-2xl p-5 card-hover">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl ${progress === 100 ? 'bg-green-500/20' : 'bg-cyan-500/20'} flex items-center justify-center text-2xl">
                  ${phase.icon}
                </div>
                <div>
                  <h3 class="font-semibold">${getLang() === 'id' ? 'Fase' : 'Phase'} ${idx + 1}: ${phase.name}</h3>
                  <p class="text-xs text-slate-500">${phase.apps.length} tools • ${configuredApps.length} ${t('ready')}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold ${progress === 100 ? 'text-green-400' : 'text-cyan-400'}">${progress}%</span>
                <p class="text-xs text-slate-500">${t('complete')}</p>
              </div>
            </div>
            
            <!-- Progress bar -->
            <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-4">
              <div class="h-full ${progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} transition-all" style="width: ${progress}%"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              ${phase.apps.map(app => {
                const hasLink = getEffectiveOpalLink(app.id);
                return `
                <div class="flex items-center gap-3 p-3 rounded-xl ${hasLink ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5'} hover:bg-white/10 cursor-pointer transition-all" onclick="navigateTo('app', '${app.id}')">
                  <span class="text-lg">${app.icon}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">${app.name}</p>
                    <p class="text-[10px] text-slate-500 truncate">${app.desc}</p>
                  </div>
                  ${hasLink ? '<span class="text-green-400 text-xs">✓</span>' : '<span class="text-slate-600 text-xs">○</span>'}
                </div>
              `}).join('')}
            </div>
          </div>
        `}).join('')}
      </div>
    </div>
  `;
}

// ============ OPAL LINKS PAGE ============
function renderOpalLinksPage() {
  const globalLinksCount = Object.keys(state.globalOpalLinks).filter(k => state.globalOpalLinks[k]).length;
  const personalLinksCount = Object.keys(state.opalLinks).filter(k => state.opalLinks[k]).length;
  
  return `
    <div class="w-full">
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
function showModal(title, content, onSave, saveButtonText = 'Save') {
  const container = document.getElementById('modal-container');
  const hasCallback = typeof onSave === 'function';
  
  container.innerHTML = `
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onclick="hideModal()">
      <div class="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">${title}</h3>
          <button onclick="hideModal()" class="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>
        <div class="mb-6">${content}</div>
        <div class="flex gap-3 justify-end">
          ${hasCallback ? `
            <button onclick="hideModal()" class="btn-secondary px-4 py-2 rounded-lg">Cancel</button>
            <button onclick="window.modalSave()" class="btn-primary px-4 py-2 rounded-lg">${saveButtonText}</button>
          ` : `
            <button onclick="hideModal()" class="btn-primary px-6 py-2 rounded-lg">${saveButtonText}</button>
          `}
        </div>
      </div>
    </div>
  `;
  window.modalSave = onSave || hideModal;
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
    <div class="w-full">
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
    <div class="w-full">
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
