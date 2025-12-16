// raymAIzing film - Main Application
// Celtx-Style Production Management with Proper Workflow Logic
// FIXED: Checklist = User Completion, NOT Opal Upload Status

// ============ WORKFLOW PHASES DEFINITION ============
// Matches PHASES in data.js for consistency
const WORKFLOW_PHASES = [
  { id: 'ideation', step: 1, icon: '💡', tools: ['idea-01', 'idea-02', 'idea-03'], required: false },
  { id: 'story-development', step: 2, icon: '📖', tools: ['story-01', 'story-02', 'story-03', 'story-04'], required: true, isCore: true },
  { id: 'pre-production', step: 3, icon: '📝', tools: ['01', '02', '03', '04'], required: true },
  { id: 'production-image', step: 4, icon: '🎨', tools: ['05', '06', '07'], required: true },
  { id: 'production-video', step: 5, icon: '🎬', tools: ['08', '09', '10', '11'], required: true },
  { id: 'production-audio', step: 6, icon: '🔊', tools: ['audio-01', 'audio-02', 'audio-03', 'audio-04'], required: true },
  { id: 'post-production', step: 7, icon: '🎞️', tools: ['post-01', 'post-02', 'post-03', 'post-04', 'post-05', 'post-06'], required: true },
  { id: 'distribution', step: 8, icon: '📢', tools: ['dist-01', 'dist-02', 'dist-03', 'dist-04'], required: false }
];

// ============ APP STATE ============
let state = {
  user: null,
  userRole: 'user',
  currentPage: 'dashboard',
  currentApp: null,
  currentProject: null,
  
  // Data
  projects: [],
  characters: [],
  locations: [],
  episodes: [],
  scenes: [],
  history: [],
  opalLinks: {},
  globalOpalLinks: {},
  generatedAssets: [],
  workflowProgress: [],
  
  // Production Bible
  productionBible: {
    title: '', logline: '', synopsis: '', genre: '', projectType: '',
    style: '', mood: '', setting: '', themes: '',
    episodes: [], characters: [], locations: [], scenes: []
  },
  
  // UI State
  outputCount: 1,
  expandedPhases: [],
  
  // Selection Context
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
  
  // Listen for tab visibility changes to restore state
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.user) {
      // Tab became visible again - restore state if on tool page
      if (state.currentPage === 'app' && state.currentApp) {
        applyRestoredState(state.currentApp);
      }
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
  
  // Load local progress (fallback when DB unavailable)
  loadLocalProgress();
  
  // Load local history
  loadLocalHistory();
  
  // Restore navigation state from sessionStorage (for tab switching)
  restoreNavigationState();
  
  renderSidebar();
  renderPage();
  updateHistoryCount();
}

// Load local history from localStorage
function loadLocalHistory() {
  const localHistory = JSON.parse(localStorage.getItem('localHistory') || '[]');
  // Merge with state history (local first, then DB)
  state.history = [...localHistory, ...state.history.filter(h => h.user_id)];
}

function showLoading(show) {
  document.getElementById('loading-screen').classList.toggle('hidden', !show);
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.add('hidden');
}

function renderApp() {
  renderSidebar();
  renderPage();
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
  document.getElementById('user-name').innerHTML = name + (isAdmin() ? ' <span class="text-yellow-400 text-xs">👑</span>' : '');
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
    
    // Global opal links
    state.globalOpalLinks = {};
    globalOpalLinks.forEach(link => { state.globalOpalLinks[link.app_id] = link.url; });
    
    // Load saved project
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject && state.projects.find(p => p.id === savedProject)) {
      state.currentProject = savedProject;
      await loadProjectData(savedProject);
    }
    
    // Load preferences
    const savedOutputCount = localStorage.getItem('outputCount');
    if (savedOutputCount) state.outputCount = parseInt(savedOutputCount);
    
    loadProductionBible();
    updateProjectSelector();
  } catch (error) { console.error('Error loading data:', error); }
}

async function loadProjectData(projectId) {
  if (!projectId) return;
  try {
    const overview = await DB.getProjectOverview(projectId);
    state.productionBible = overview.bible || state.productionBible;
    state.characters = overview.characters;
    state.locations = overview.locations;
    state.episodes = overview.episodes;
    state.scenes = overview.scenes;
    state.generatedAssets = overview.assets;
    state.workflowProgress = overview.progress;
  } catch (error) {
    console.error('Error loading project data:', error);
  }
}

function loadProductionBible() {
  const saved = localStorage.getItem('productionBible');
  if (saved) {
    try { state.productionBible = JSON.parse(saved); } catch (e) {}
  }
}

function saveProductionBible() {
  localStorage.setItem('productionBible', JSON.stringify(state.productionBible));
}

// ============ HELPER FUNCTIONS ============
function getEffectiveOpalLink(appId) {
  return state.opalLinks[appId] || state.globalOpalLinks[appId] || DEFAULT_OPAL_LINKS[appId] || null;
}

function isAdmin() {
  return state.userRole === 'admin';
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

function getWorkflowPhaseName(phaseId) {
  const names = {
    'ideation': { id: 'Cari Ide', en: 'Find Ideas' },
    'story-development': { id: 'Story Development', en: 'Story Development' },
    'pre-production': { id: 'Pre-Production', en: 'Pre-Production' },
    'production-image': { id: 'Produksi Gambar', en: 'Image Production' },
    'production-video': { id: 'Produksi Video', en: 'Video Production' },
    'production-audio': { id: 'Produksi Audio', en: 'Audio Production' },
    'post-production': { id: 'Post-Production', en: 'Post-Production' },
    'distribution': { id: 'Distribution', en: 'Distribution' }
  };
  return names[phaseId]?.[getLang()] || phaseId;
}


// ============ WORKFLOW LOGIC (FIXED!) ============
// Checklist = User has COMPLETED the step, NOT just uploaded Opal link

function isPhaseCompleted(phaseId) {
  const phase = WORKFLOW_PHASES.find(p => p.id === phaseId);
  if (!phase) return false;
  return phase.tools.every(toolId => isToolCompleted(toolId));
}

function isToolCompleted(toolId) {
  const progress = state.workflowProgress.find(p => p.tool_id === toolId);
  return progress && progress.is_completed;
}

function getPhaseCompletionPercent(phaseId) {
  const phase = WORKFLOW_PHASES.find(p => p.id === phaseId);
  if (!phase) return 0;
  const completed = phase.tools.filter(t => isToolCompleted(t)).length;
  return Math.round((completed / phase.tools.length) * 100);
}

function getCurrentWorkflowStep() {
  if (!state.currentProject) return 1;
  for (const phase of WORKFLOW_PHASES) {
    if (!isPhaseCompleted(phase.id)) return phase.step;
  }
  return 8;
}

function isPhaseLocked(phaseId) {
  const phase = WORKFLOW_PHASES.find(p => p.id === phaseId);
  if (!phase || phase.step === 1) return false;
  for (const prevPhase of WORKFLOW_PHASES) {
    if (prevPhase.step >= phase.step) break;
    if (prevPhase.required && !isPhaseCompleted(prevPhase.id)) return true;
  }
  return false;
}

function getOverallCompletionPercent() {
  const totalTools = WORKFLOW_PHASES.reduce((sum, p) => sum + p.tools.length, 0);
  const completedTools = state.workflowProgress.filter(p => p.is_completed).length;
  return Math.round((completedTools / totalTools) * 100);
}

async function markToolAsCompleted(toolId, formData = null, generatedPrompt = null) {
  if (!state.currentProject || !state.user) {
    // Save locally if no project selected
    saveToolProgressLocally(toolId, formData, generatedPrompt);
    return;
  }
  
  const phase = WORKFLOW_PHASES.find(p => p.tools.includes(toolId));
  if (!phase) return;
  
  try {
    await DB.saveToolProgress(state.currentProject, state.user.id, toolId, phase.id, {
      is_completed: true,
      completed_at: new Date().toISOString(),
      form_data: formData,
      generated_prompt: generatedPrompt
    });
    
    state.workflowProgress = await DB.getWorkflowProgress(state.currentProject);
    showToast(t('stepCompleted'), 'success');
    renderSidebar();
    renderPage();
  } catch (error) {
    console.error('Error marking tool completed:', error);
    // Fallback to local storage
    saveToolProgressLocally(toolId, formData, generatedPrompt);
  }
}

// Save tool progress locally when database is unavailable
function saveToolProgressLocally(toolId, formData, generatedPrompt) {
  const localProgress = JSON.parse(localStorage.getItem('localWorkflowProgress') || '{}');
  localProgress[toolId] = {
    tool_id: toolId,
    is_completed: true,
    completed_at: new Date().toISOString(),
    form_data: formData,
    generated_prompt: generatedPrompt
  };
  localStorage.setItem('localWorkflowProgress', JSON.stringify(localProgress));
  
  // Update state with local progress
  const existingIdx = state.workflowProgress.findIndex(p => p.tool_id === toolId);
  if (existingIdx >= 0) {
    state.workflowProgress[existingIdx] = localProgress[toolId];
  } else {
    state.workflowProgress.push(localProgress[toolId]);
  }
  
  showToast(t('stepCompleted') + ' (local)', 'success');
  renderSidebar();
}

// Load local progress on init
function loadLocalProgress() {
  const localProgress = JSON.parse(localStorage.getItem('localWorkflowProgress') || '{}');
  Object.values(localProgress).forEach(progress => {
    if (!state.workflowProgress.find(p => p.tool_id === progress.tool_id)) {
      state.workflowProgress.push(progress);
    }
  });
}

// ============ NAVIGATION ============
function navigateTo(page, appId = null) {
  state.currentPage = page;
  state.currentApp = appId;
  
  // Save navigation state to sessionStorage
  sessionStorage.setItem('currentPage', page);
  if (appId) {
    sessionStorage.setItem('currentApp', appId);
  } else {
    sessionStorage.removeItem('currentApp');
  }
  
  renderSidebar();
  renderPage();
  updateBreadcrumb();
}

// Restore navigation state from sessionStorage
function restoreNavigationState() {
  const savedPage = sessionStorage.getItem('currentPage');
  const savedApp = sessionStorage.getItem('currentApp');
  
  if (savedPage) {
    state.currentPage = savedPage;
  }
  if (savedApp) {
    state.currentApp = savedApp;
  }
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  let text = '';
  if (state.currentPage === 'dashboard') text = '🏠 Dashboard';
  else if (state.currentPage === 'app' && state.currentApp) {
    const app = findApp(state.currentApp);
    const phase = findPhase(state.currentApp);
    text = `${phase?.icon || ''} ${phase?.name || ''} / ${app?.name || ''}`;
  }
  else if (state.currentPage === 'characters') text = '👤 ' + t('characters');
  else if (state.currentPage === 'locations') text = '🎭 ' + t('locations');
  else if (state.currentPage === 'scenes') text = '🎬 Scenes';
  else if (state.currentPage === 'assets') text = '🖼️ ' + t('generatedAssets');
  else if (state.currentPage === 'admin-opal-links') text = '👑 Global Links';
  bc.textContent = text;
}

// ============ PROJECT MANAGEMENT ============
function updateProjectSelector() {
  const sel = document.getElementById('project-selector');
  sel.innerHTML = `<option value="">📁 ${t('selectProject')}</option>` + 
    state.projects.map(p => `<option value="${p.id}" ${p.id === state.currentProject ? 'selected' : ''}>${p.name}</option>`).join('');
}

async function switchProject(projectId) {
  state.currentProject = projectId || null;
  localStorage.setItem('currentProject', state.currentProject || '');
  
  if (projectId) {
    await loadProjectData(projectId);
  } else {
    state.workflowProgress = [];
    state.episodes = [];
    state.scenes = [];
  }
  
  renderSidebar();
  renderPage();
}

function showNewProjectModal() {
  showModal(t('newProject'), `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">${t('projectName')}</label>
        <input type="text" id="new-project-name" class="w-full rounded-lg px-3 py-2" placeholder="My Film Project">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">${t('projectType')}</label>
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
        <textarea id="new-project-desc" class="w-full rounded-lg px-3 py-2 h-20" placeholder="${t('projectDesc')}"></textarea>
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
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) { 
      showToast(error.message, 'error'); 
    }
  });
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
  
  // Project Status
  if (state.currentProject) {
    const project = state.projects.find(p => p.id === state.currentProject);
    const completionPercent = getOverallCompletionPercent();
    html += `
      <div class="mx-2 my-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium truncate">${project?.name || 'Project'}</span>
          <span class="text-[10px] text-cyan-400">${completionPercent}%</span>
        </div>
        <div class="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div class="h-full bg-cyan-500 transition-all" style="width: ${completionPercent}%"></div>
        </div>
      </div>
    `;
  }
  
  // Workflow Phases
  html += `<div class="mt-3 mb-1 px-2 text-[10px] text-slate-500 uppercase tracking-wider">${t('phases')}</div>`;
  
  WORKFLOW_PHASES.forEach(phase => {
    const isCompleted = isPhaseCompleted(phase.id);
    const isLocked = isPhaseLocked(phase.id);
    const completionPercent = getPhaseCompletionPercent(phase.id);
    const isExpanded = state.expandedPhases.includes(phase.id) || phase.tools.includes(state.currentApp);
    
    html += `
      <div class="mb-0.5">
        <div class="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-white/5 text-sm ${isLocked ? 'opacity-50' : ''}" 
             onclick="${isLocked ? '' : `togglePhase('${phase.id}')`}">
          <span class="flex items-center gap-1.5">
            <span class="text-sm">${phase.icon}</span>
            <span class="text-xs">${getWorkflowPhaseName(phase.id)}</span>
            ${isCompleted ? '<span class="text-green-400 text-[10px]">✓</span>' : ''}
            ${isLocked ? '<span class="text-slate-500 text-[10px]">🔒</span>' : ''}
          </span>
          <span class="text-[10px] ${isCompleted ? 'text-green-400' : 'text-slate-500'}">${completionPercent}%</span>
        </div>
        <div id="phase-${phase.id}" class="${isExpanded ? '' : 'hidden'} ml-3 border-l border-cyan-500/15 pl-1.5">
          ${phase.tools.map(toolId => {
            const tool = findApp(toolId);
            if (!tool) return '';
            const isToolDone = isToolCompleted(toolId);
            const hasLink = getEffectiveOpalLink(toolId);
            return `
              <div class="sidebar-item ${state.currentApp === toolId ? 'active' : ''} rounded p-1.5 cursor-pointer text-xs flex items-center justify-between group" 
                   onclick="navigateTo('app', '${toolId}')">
                <span class="flex items-center gap-1.5 truncate">
                  <span>${tool.icon}</span>
                  <span class="truncate">${tool.name}</span>
                  ${isToolDone ? '<span class="text-green-400 text-[8px]">✓</span>' : ''}
                </span>
                ${hasLink ? `<a href="${hasLink}" target="_blank" onclick="event.stopPropagation()" class="opacity-0 group-hover:opacity-100 text-cyan-400 text-[10px]">↗</a>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });
  
  // Assets Section
  html += `
    <div class="mt-3 mb-1 px-2 text-[10px] text-slate-500 uppercase tracking-wider">${t('assets')}</div>
    <div class="sidebar-item ${state.currentPage === 'characters' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-sm flex items-center justify-between" onclick="navigateTo('characters')">
      <span class="flex items-center gap-1.5"><span>👤</span><span class="text-xs">${t('characters')}</span></span>
      <span class="text-[10px] text-slate-500">${chars.length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'locations' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-sm flex items-center justify-between" onclick="navigateTo('locations')">
      <span class="flex items-center gap-1.5"><span>🎭</span><span class="text-xs">${t('locations')}</span></span>
      <span class="text-[10px] text-slate-500">${locs.length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'scenes' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-sm flex items-center justify-between" onclick="navigateTo('scenes')">
      <span class="flex items-center gap-1.5"><span>🎬</span><span class="text-xs">Scenes</span></span>
      <span class="text-[10px] text-slate-500">${state.scenes.length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'assets' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-sm flex items-center justify-between" onclick="navigateTo('assets')">
      <span class="flex items-center gap-1.5"><span>🖼️</span><span class="text-xs">${t('generatedAssets')}</span></span>
      <span class="text-[10px] text-slate-500">${state.generatedAssets.length}</span>
    </div>
  `;
  
  // Admin Section
  if (isAdmin()) {
    html += `
      <div class="mt-3 mb-1 px-2 text-[10px] text-amber-400 uppercase tracking-wider">Admin</div>
      <div class="sidebar-item ${state.currentPage === 'admin-opal-links' ? 'active' : ''} rounded-lg p-2 cursor-pointer mb-0.5 text-xs" onclick="navigateTo('admin-opal-links')">
        <span class="flex items-center gap-1.5"><span>⚙️</span> Global Opal Links</span>
      </div>
    `;
  }
  
  nav.innerHTML = html;
}

function togglePhase(phaseId) {
  const idx = state.expandedPhases.indexOf(phaseId);
  if (idx >= 0) {
    state.expandedPhases.splice(idx, 1);
  } else {
    state.expandedPhases.push(phaseId);
  }
  renderSidebar();
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
    case 'scenes': html = renderScenesPage(); break;
    case 'assets': html = renderAssetsPage(); break;
    case 'admin-opal-links': html = isAdmin() ? renderAdminOpalLinksPage() : renderDashboard(); break;
    default: html = renderDashboard();
  }
  content.innerHTML = `<div class="fade-in">${html}</div>`;
  updateBreadcrumb();
  
  // Restore tool state if on app page (after DOM is updated)
  if (state.currentPage === 'app' && state.currentApp) {
    setTimeout(() => applyRestoredState(state.currentApp), 50);
  }
}

// ============ DASHBOARD ============
function renderDashboard() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const currentStep = getCurrentWorkflowStep();
  const completionPercent = getOverallCompletionPercent();
  
  return `
    <div class="w-full">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-1" style="font-family: 'Space Grotesk', sans-serif;">
          <span class="text-white">raym</span><span class="brand-ai">AI</span><span class="brand-film">zing film</span>
        </h1>
        <p class="text-slate-500 text-sm">${t('tagline')}</p>
      </div>
      
      <!-- Project Card -->
      ${project ? renderProjectCard(project) : renderNoProject()}
      
      <!-- Workflow Progress -->
      <div class="glass rounded-2xl p-6 mb-6 border-2 border-cyan-500/30">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 class="text-lg font-bold flex items-center gap-2 flex-wrap">
              ${t('workflowTitle')}
              <span class="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">${t('stepOf').replace('{current}', currentStep).replace('{total}', '8')}</span>
              <span class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">${completionPercent}%</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">${t('workflowSubtitle')}</p>
          </div>
          <button onclick="showWorkflowHelp()" class="btn-secondary px-3 py-1.5 rounded-lg text-xs">❓ ${t('helpTitle')}</button>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500" style="width: ${completionPercent}%"></div>
          </div>
        </div>
        
        <!-- Workflow Steps -->
        <div class="space-y-3">
          ${WORKFLOW_PHASES.map(phase => renderWorkflowStep(phase, currentStep)).join('')}
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        ${renderQuickStat('👤', state.characters.length, t('characters'), 'characters')}
        ${renderQuickStat('🎭', state.locations.length, t('locations'), 'locations')}
        ${renderQuickStat('🎬', state.scenes.length, 'Scenes', 'scenes')}
        ${renderQuickStat('🖼️', state.generatedAssets.length, t('generatedAssets'), 'assets')}
      </div>
    </div>
  `;
}

function renderProjectCard(project) {
  return `
    <div class="glass rounded-xl p-4 mb-6 gradient-card card-hover">
      <div class="flex items-start justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">🎬</div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="tag text-xs">${project.type || 'Project'}</span>
              <span class="tag text-xs">${project.genre || ''}</span>
            </div>
            <h2 class="text-lg font-bold">${project.name}</h2>
            <p class="text-slate-500 text-xs mt-1">${project.description || ''}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="showEditProjectModal('${project.id}')" class="btn-secondary px-3 py-1.5 rounded-lg text-xs">✏️ ${t('edit')}</button>
        </div>
      </div>
    </div>
  `;
}

function renderNoProject() {
  return `
    <div class="glass rounded-xl p-6 mb-6 text-center gradient-card">
      <div class="text-3xl mb-2">🎬</div>
      <h3 class="text-base font-semibold mb-1">${t('bibleStart')}</h3>
      <p class="text-slate-500 text-xs mb-4">${t('bibleStartDesc')}</p>
      <button onclick="showNewProjectModal()" class="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">+ ${t('newProject')}</button>
    </div>
  `;
}

function renderWorkflowStep(phase, currentStep) {
  const isCompleted = isPhaseCompleted(phase.id);
  const isCurrent = phase.step === currentStep;
  const isLocked = isPhaseLocked(phase.id);
  const completionPercent = getPhaseCompletionPercent(phase.id);
  const completedToolCount = phase.tools.filter(t => isToolCompleted(t)).length;
  
  const stepNames = {
    'ideation': { name: t('step1Name'), desc: t('step1Desc'), tip: t('step1Tip') },
    'story-development': { name: t('step2Name'), desc: t('step2Desc'), tip: t('step2Tip') },
    'pre-production': { name: t('step3Name'), desc: t('step3Desc'), tip: t('step3Tip') },
    'production-image': { name: t('step4Name'), desc: t('step4Desc'), tip: t('step4Tip') },
    'production-video': { name: t('step5Name'), desc: t('step5Desc'), tip: t('step5Tip') },
    'production-audio': { name: t('step6Name'), desc: t('step6Desc'), tip: t('step6Tip') },
    'post-production': { name: t('step7Name'), desc: t('step7Desc'), tip: t('step7Tip') },
    'distribution': { name: t('step8Name'), desc: t('step8Desc'), tip: t('step8Tip') }
  };
  
  const info = stepNames[phase.id] || { name: phase.id, desc: '', tip: '' };
  
  return `
    <div class="workflow-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} 
                rounded-xl p-4 border ${isCurrent ? 'border-cyan-500 bg-cyan-500/10' : isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-800/50'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-cyan-500/50'}"
         onclick="${isLocked ? '' : `navigateTo('app', '${phase.tools[0]}')`}">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                    ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'}">
          ${isCompleted ? '✓' : phase.step}
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xl">${phase.icon}</span>
            <h3 class="font-semibold ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-white'}">${info.name}</h3>
            ${phase.required ? `<span class="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">${t('required')}</span>` : `<span class="text-[10px] bg-slate-600 text-slate-400 px-1.5 py-0.5 rounded">${t('optional')}</span>`}
            ${phase.isCore ? `<span class="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">⭐ Core</span>` : ''}
            ${isLocked ? `<span class="text-[10px] bg-slate-600 text-slate-400 px-1.5 py-0.5 rounded">🔒 ${t('locked')}</span>` : ''}
          </div>
          <p class="text-sm text-slate-400 mb-2">${info.desc}</p>
          
          <div class="flex items-center gap-2 mb-2">
            <div class="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full ${isCompleted ? 'bg-green-500' : 'bg-cyan-500'} transition-all" style="width: ${completionPercent}%"></div>
            </div>
            <span class="text-[10px] ${isCompleted ? 'text-green-400' : 'text-slate-500'}">${completedToolCount}/${phase.tools.length} tools</span>
          </div>
          
          <p class="text-xs text-slate-500 italic">💡 ${info.tip}</p>
        </div>
        
        <div class="flex-shrink-0">
          ${isCurrent ? `
            <button onclick="event.stopPropagation(); navigateTo('app', '${phase.tools[0]}')" 
                    class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
              ${t('start')} →
            </button>
          ` : isCompleted ? `
            <button onclick="event.stopPropagation(); navigateTo('app', '${phase.tools[0]}')" 
                    class="btn-secondary px-3 py-1.5 rounded-lg text-xs">
              ${t('edit')}
            </button>
          ` : isLocked ? `
            <span class="text-slate-500 text-xs">🔒</span>
          ` : `
            <button onclick="event.stopPropagation(); navigateTo('app', '${phase.tools[0]}')" 
                    class="btn-secondary px-3 py-1.5 rounded-lg text-xs">
              ${t('next')}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderQuickStat(icon, count, label, page) {
  return `
    <div class="glass rounded-xl p-4 card-hover cursor-pointer" onclick="navigateTo('${page}')">
      <div class="flex items-center gap-3">
        <div class="text-2xl">${icon}</div>
        <div>
          <div class="text-xl font-bold">${count}</div>
          <div class="text-xs text-slate-500">${label}</div>
        </div>
      </div>
    </div>
  `;
}


// ============ APP PAGE (Tool Page) ============
function renderAppPage() {
  const app = findApp(state.currentApp);
  if (!app) return '<p class="text-slate-400">Tool not found</p>';
  
  const phase = findPhase(state.currentApp);
  const opalLink = getEffectiveOpalLink(state.currentApp);
  const isCompleted = isToolCompleted(state.currentApp);
  
  return `
    <div class="max-w-4xl mx-auto">
      <!-- Tool Header -->
      <div class="glass rounded-xl p-5 mb-5">
        <div class="flex items-start justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">${app.icon}</div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="tag">${phase?.name || ''}</span>
                ${isCompleted ? '<span class="tag bg-green-500/20 border-green-500/30 text-green-400">✓ Completed</span>' : ''}
              </div>
              <h1 class="text-xl font-bold">${app.name}</h1>
              <p class="text-slate-400 text-sm mt-1">${app.description || ''}</p>
            </div>
          </div>
          ${opalLink ? `
            <a href="${opalLink}" target="_blank" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              🔗 ${t('openOpal')}
            </a>
          ` : ''}
        </div>
      </div>
      
      <!-- Tool Form -->
      <div class="glass rounded-xl p-5 mb-5">
        <h3 class="font-semibold mb-4 flex items-center gap-2">📝 Input Form</h3>
        <div class="space-y-4" id="tool-form">
          ${renderToolForm(app)}
        </div>
      </div>
      
      <!-- Generate Button -->
      <div class="flex gap-3 mb-5">
        <button onclick="generatePrompt('${app.id}')" class="btn-primary px-6 py-3 rounded-xl font-semibold flex-1">
          ✨ ${t('generatePrompt')}
        </button>
        <div class="flex items-center gap-2 glass rounded-xl px-4">
          <span class="text-xs text-slate-400">Output:</span>
          <select id="output-count" class="bg-transparent border-none text-sm" onchange="state.outputCount = parseInt(this.value); localStorage.setItem('outputCount', this.value)">
            ${[1,2,3,4,5].map(n => `<option value="${n}" ${state.outputCount === n ? 'selected' : ''}>${n}x</option>`).join('')}
          </select>
        </div>
      </div>
      
      <!-- Output Area -->
      <div id="prompt-output" class="hidden glass rounded-xl p-5 mb-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold flex items-center gap-2">📋 Generated Prompt</h3>
          <div class="flex gap-2">
            <button onclick="copyPrompt()" class="btn-secondary px-3 py-1.5 rounded-lg text-xs">📋 ${t('copyPrompt')}</button>
            ${opalLink ? `<a href="${opalLink}" target="_blank" class="btn-secondary px-3 py-1.5 rounded-lg text-xs">🔗 ${t('openOpal')}</a>` : ''}
          </div>
        </div>
        <div id="prompt-text" class="prompt-output rounded-lg p-4 text-sm whitespace-pre-wrap font-mono"></div>
        
        <!-- Save Actions -->
        <div class="flex gap-3 mt-4">
          <button onclick="saveAndMarkComplete('${app.id}')" class="btn-primary px-4 py-2 rounded-lg text-sm flex-1">
            ✅ ${t('saveComplete')}
          </button>
          <button onclick="saveToHistory('${app.id}')" class="btn-secondary px-4 py-2 rounded-lg text-sm">
            📜 ${t('saveHistory')}
          </button>
        </div>
      </div>
      
      <!-- Checklist Info -->
      <div class="glass rounded-xl p-4 bg-blue-500/5 border border-blue-500/20">
        <p class="text-xs text-blue-400">💡 ${t('checklistInfo')}</p>
      </div>
    </div>
  `;
}

function renderToolForm(app) {
  // Get form definition from APP_FORMS in data.js
  const formDef = typeof APP_FORMS !== 'undefined' ? APP_FORMS[app.id] : null;
  const fields = formDef?.inputs || app.fields || [];
  
  if (!fields || fields.length === 0) {
    return '<p class="text-slate-500 text-sm">No form fields defined for this tool.</p>';
  }
  
  return fields.map(field => {
    const fieldId = `field-${field.id}`;
    const label = field.label || field.name || field.id;
    const placeholder = field.placeholder || '';
    const rows = field.rows || 4;
    
    if (field.type === 'textarea') {
      return `
        <div>
          <label class="block text-sm text-slate-400 mb-1">${label}</label>
          <textarea id="${fieldId}" class="w-full rounded-lg px-3 py-2" style="min-height: ${rows * 24}px" placeholder="${placeholder}"></textarea>
        </div>
      `;
    } else if (field.type === 'select') {
      // Get options from OPTIONS object in data.js
      const optionsList = typeof OPTIONS !== 'undefined' && field.options ? OPTIONS[field.options] || [] : [];
      return `
        <div>
          <label class="block text-sm text-slate-400 mb-1">${label}</label>
          <select id="${fieldId}" class="w-full rounded-lg px-3 py-2">
            ${optionsList.map(opt => `<option>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    } else {
      return `
        <div>
          <label class="block text-sm text-slate-400 mb-1">${label}</label>
          <input type="text" id="${fieldId}" class="w-full rounded-lg px-3 py-2" placeholder="${placeholder}">
        </div>
      `;
    }
  }).join('');
}

function generatePrompt(appId) {
  const app = findApp(appId);
  if (!app) return;
  
  // Get form definition from APP_FORMS
  const formDef = typeof APP_FORMS !== 'undefined' ? APP_FORMS[appId] : null;
  const fields = formDef?.inputs || app.fields || [];
  
  // Collect form data
  const formData = {};
  fields.forEach(field => {
    const fieldId = `field-${field.id}`;
    const el = document.getElementById(fieldId);
    if (el) formData[field.id] = el.value;
  });
  
  // Get prompt template
  let prompt = formDef?.promptTemplate || app.promptTemplate || '';
  
  // Replace placeholders with form data
  Object.keys(formData).forEach(key => {
    const placeholder = new RegExp(`\\{${key}\\}`, 'gi');
    prompt = prompt.replace(placeholder, formData[key] || '');
  });
  
  // Add production bible data if available
  if (state.productionBible.synopsis) {
    prompt = prompt.replace(/\{synopsis\}/gi, state.productionBible.synopsis);
    prompt = prompt.replace(/\{title\}/gi, state.productionBible.title || '');
    prompt = prompt.replace(/\{genre\}/gi, state.productionBible.genre || '');
    prompt = prompt.replace(/\{style\}/gi, state.productionBible.style || '');
    prompt = prompt.replace(/\{mood\}/gi, state.productionBible.mood || '');
    prompt = prompt.replace(/\{setting\}/gi, state.productionBible.setting || '');
  }
  
  // Clean up empty placeholders
  prompt = prompt.replace(/\{[^}]+\}/g, '');
  
  // Generate multiple outputs if needed
  let finalPrompt = prompt.trim();
  if (state.outputCount > 1) {
    finalPrompt = `Generate ${state.outputCount} variations:\n\n${finalPrompt}`;
  }
  
  // Show output
  document.getElementById('prompt-output').classList.remove('hidden');
  document.getElementById('prompt-text').textContent = finalPrompt;
  
  // Store for later use
  state.lastGeneratedPrompt = finalPrompt;
  state.lastFormData = formData;
  
  // Save to sessionStorage so it persists when switching tabs
  saveToolState(appId, formData, finalPrompt);
}

// ============ SESSION STATE PERSISTENCE ============
// Save form data and generated prompt to sessionStorage
function saveToolState(toolId, formData, generatedPrompt) {
  const toolState = {
    toolId,
    formData,
    generatedPrompt,
    timestamp: Date.now()
  };
  sessionStorage.setItem(`tool_state_${toolId}`, JSON.stringify(toolState));
  
  // Also save current tool ID
  sessionStorage.setItem('currentToolId', toolId);
}

// Restore form data and prompt when returning to a tool
function restoreToolState(toolId) {
  const saved = sessionStorage.getItem(`tool_state_${toolId}`);
  if (!saved) return null;
  
  try {
    const toolState = JSON.parse(saved);
    // Only restore if less than 1 hour old
    if (Date.now() - toolState.timestamp < 3600000) {
      return toolState;
    }
  } catch (e) {
    console.error('Error restoring tool state:', e);
  }
  return null;
}

// Apply restored state to form
function applyRestoredState(toolId) {
  const savedState = restoreToolState(toolId);
  if (!savedState) return;
  
  // Restore form values
  if (savedState.formData) {
    Object.keys(savedState.formData).forEach(fieldId => {
      const el = document.getElementById(`field-${fieldId}`);
      if (el) {
        el.value = savedState.formData[fieldId];
      }
    });
  }
  
  // Restore generated prompt
  if (savedState.generatedPrompt) {
    const outputEl = document.getElementById('prompt-output');
    const textEl = document.getElementById('prompt-text');
    if (outputEl && textEl) {
      outputEl.classList.remove('hidden');
      textEl.textContent = savedState.generatedPrompt;
      state.lastGeneratedPrompt = savedState.generatedPrompt;
      state.lastFormData = savedState.formData;
    }
  }
}

function copyPrompt() {
  const promptText = document.getElementById('prompt-text').textContent;
  navigator.clipboard.writeText(promptText).then(() => {
    showToast(t('copiedToClipboard'), 'success');
  });
}

async function saveAndMarkComplete(appId) {
  if (!state.currentProject) {
    showToast(t('selectProjectFirst'), 'warning');
    return;
  }
  
  try {
    await markToolAsCompleted(appId, state.lastFormData, state.lastGeneratedPrompt);
    await saveToHistory(appId);
  } catch (error) {
    console.error('Error in saveAndMarkComplete:', error);
    // Still show success if at least the prompt was generated
    if (state.lastGeneratedPrompt) {
      showToast(t('savedSuccessfully') + ' (local)', 'success');
    }
  }
}

async function saveToHistory(appId) {
  if (!state.user) {
    // Save to local storage if not logged in
    saveToLocalHistory(appId);
    return;
  }
  
  const app = findApp(appId);
  const promptText = document.getElementById('prompt-text')?.textContent;
  
  if (!promptText) {
    showToast('Generate a prompt first', 'warning');
    return;
  }
  
  try {
    const historyEntry = {
      user_id: state.user.id,
      project_id: state.currentProject,
      tool_id: appId,
      tool_name: app?.name || appId,
      prompt: promptText,
      form_data: state.lastFormData
    };
    
    await DB.saveToHistory(historyEntry);
    state.history = await DB.getHistory(state.user.id);
    updateHistoryCount();
    showToast(t('savedSuccessfully'), 'success');
  } catch (error) {
    console.error('Error saving to history:', error);
    // Fallback to local storage
    saveToLocalHistory(appId);
    showToast(t('savedSuccessfully') + ' (local)', 'success');
  }
}

// Fallback: Save to localStorage if database fails
function saveToLocalHistory(appId) {
  const app = findApp(appId);
  const promptText = document.getElementById('prompt-text')?.textContent;
  if (!promptText) return;
  
  const localHistory = JSON.parse(localStorage.getItem('localHistory') || '[]');
  localHistory.unshift({
    id: Date.now().toString(),
    tool_id: appId,
    tool_name: app?.name || appId,
    prompt: promptText,
    form_data: state.lastFormData,
    created_at: new Date().toISOString()
  });
  
  // Keep only last 50 entries
  if (localHistory.length > 50) localHistory.pop();
  localStorage.setItem('localHistory', JSON.stringify(localHistory));
  
  // Update state
  state.history = [...localHistory, ...state.history.filter(h => h.user_id)];
  updateHistoryCount();
}

// ============ CHARACTERS PAGE ============
function renderCharactersPage() {
  const chars = state.characters.filter(c => !state.currentProject || c.project_id === state.currentProject);
  
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold">👤 ${t('characters')}</h1>
        <button onclick="showNewCharacterModal()" class="btn-primary px-4 py-2 rounded-lg text-sm">+ ${t('add')}</button>
      </div>
      
      ${chars.length === 0 ? `
        <div class="glass rounded-xl p-8 text-center">
          <div class="text-4xl mb-3">👤</div>
          <p class="text-slate-400">No characters yet. Create your first character!</p>
        </div>
      ` : `
        <div class="grid gap-4 md:grid-cols-2">
          ${chars.map(char => `
            <div class="glass rounded-xl p-4 card-hover">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xl font-bold">
                  ${char.name?.charAt(0) || '?'}
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold">${char.name}</h3>
                  <p class="text-xs text-slate-500">${char.role || 'Character'}</p>
                  <p class="text-sm text-slate-400 mt-2 line-clamp-2">${char.description || ''}</p>
                </div>
                <div class="flex gap-1">
                  <button onclick="showEditCharacterModal('${char.id}')" class="btn-secondary p-2 rounded-lg text-xs">✏️</button>
                  <button onclick="deleteCharacter('${char.id}')" class="btn-secondary p-2 rounded-lg text-xs text-red-400">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function showNewCharacterModal() {
  showModal(t('add') + ' ' + t('characters'), `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Name</label>
        <input type="text" id="char-name" class="w-full rounded-lg px-3 py-2" placeholder="Character name">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Role</label>
        <select id="char-role" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.characterRole.map(r => `<option>${r}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="char-desc" class="w-full rounded-lg px-3 py-2 h-24" placeholder="Character description..."></textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Visual Description</label>
        <textarea id="char-visual" class="w-full rounded-lg px-3 py-2 h-20" placeholder="Physical appearance for AI generation..."></textarea>
      </div>
    </div>
  `, async () => {
    const character = {
      user_id: state.user.id,
      project_id: state.currentProject,
      name: document.getElementById('char-name').value,
      role: document.getElementById('char-role').value,
      description: document.getElementById('char-desc').value,
      visual_description: document.getElementById('char-visual').value
    };
    try {
      const newChar = await DB.createCharacter(character);
      state.characters.push(newChar);
      hideModal();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

async function deleteCharacter(charId) {
  if (!confirm('Delete this character?')) return;
  try {
    await DB.deleteCharacter(charId);
    state.characters = state.characters.filter(c => c.id !== charId);
    renderPage();
    showToast(t('deletedSuccessfully'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ============ LOCATIONS PAGE ============
function renderLocationsPage() {
  const locs = state.locations.filter(l => !state.currentProject || l.project_id === state.currentProject);
  
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold">🎭 ${t('locations')}</h1>
        <button onclick="showNewLocationModal()" class="btn-primary px-4 py-2 rounded-lg text-sm">+ ${t('add')}</button>
      </div>
      
      ${locs.length === 0 ? `
        <div class="glass rounded-xl p-8 text-center">
          <div class="text-4xl mb-3">🎭</div>
          <p class="text-slate-400">No locations yet. Create your first location!</p>
        </div>
      ` : `
        <div class="grid gap-4 md:grid-cols-2">
          ${locs.map(loc => `
            <div class="glass rounded-xl p-4 card-hover">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  🏠
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold">${loc.name}</h3>
                  <p class="text-xs text-slate-500">${loc.type || 'Location'}</p>
                  <p class="text-sm text-slate-400 mt-2 line-clamp-2">${loc.description || ''}</p>
                </div>
                <div class="flex gap-1">
                  <button onclick="showEditLocationModal('${loc.id}')" class="btn-secondary p-2 rounded-lg text-xs">✏️</button>
                  <button onclick="deleteLocation('${loc.id}')" class="btn-secondary p-2 rounded-lg text-xs text-red-400">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function showNewLocationModal() {
  showModal(t('add') + ' ' + t('locations'), `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Name</label>
        <input type="text" id="loc-name" class="w-full rounded-lg px-3 py-2" placeholder="Location name">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Type</label>
        <select id="loc-type" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.locationType.map(t => `<option>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="loc-desc" class="w-full rounded-lg px-3 py-2 h-24" placeholder="Location description..."></textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Visual Description</label>
        <textarea id="loc-visual" class="w-full rounded-lg px-3 py-2 h-20" placeholder="Visual details for AI generation..."></textarea>
      </div>
    </div>
  `, async () => {
    const location = {
      user_id: state.user.id,
      project_id: state.currentProject,
      name: document.getElementById('loc-name').value,
      type: document.getElementById('loc-type').value,
      description: document.getElementById('loc-desc').value,
      visual_description: document.getElementById('loc-visual').value
    };
    try {
      const newLoc = await DB.createLocation(location);
      state.locations.push(newLoc);
      hideModal();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

async function deleteLocation(locId) {
  if (!confirm('Delete this location?')) return;
  try {
    await DB.deleteLocation(locId);
    state.locations = state.locations.filter(l => l.id !== locId);
    renderPage();
    showToast(t('deletedSuccessfully'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}


// ============ SCENES PAGE ============
function renderScenesPage() {
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold">🎬 Scenes</h1>
        <button onclick="showNewSceneModal()" class="btn-primary px-4 py-2 rounded-lg text-sm">+ ${t('add')}</button>
      </div>
      
      ${state.scenes.length === 0 ? `
        <div class="glass rounded-xl p-8 text-center">
          <div class="text-4xl mb-3">🎬</div>
          <p class="text-slate-400">No scenes yet. Create your first scene!</p>
        </div>
      ` : `
        <div class="space-y-3">
          ${state.scenes.map((scene, idx) => `
            <div class="glass rounded-xl p-4 card-hover">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400">
                  ${idx + 1}
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold">${scene.title || 'Scene ' + (idx + 1)}</h3>
                  <p class="text-xs text-slate-500">${scene.location_name || ''} • ${scene.time_of_day || ''}</p>
                  <p class="text-sm text-slate-400 mt-2 line-clamp-2">${scene.description || ''}</p>
                </div>
                <div class="flex gap-1">
                  <button onclick="showEditSceneModal('${scene.id}')" class="btn-secondary p-2 rounded-lg text-xs">✏️</button>
                  <button onclick="deleteScene('${scene.id}')" class="btn-secondary p-2 rounded-lg text-xs text-red-400">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function showNewSceneModal() {
  if (!state.currentProject) {
    showToast(t('selectProjectFirst'), 'warning');
    return;
  }
  
  showModal('Add Scene', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Scene Title</label>
        <input type="text" id="scene-title" class="w-full rounded-lg px-3 py-2" placeholder="Scene title">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-slate-400 mb-1">Location</label>
          <select id="scene-location" class="w-full rounded-lg px-3 py-2">
            <option value="">Select location</option>
            ${state.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Time of Day</label>
          <select id="scene-time" class="w-full rounded-lg px-3 py-2">
            <option>Day</option>
            <option>Night</option>
            <option>Dawn</option>
            <option>Dusk</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="scene-desc" class="w-full rounded-lg px-3 py-2 h-24" placeholder="What happens in this scene..."></textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Dialogue/Script</label>
        <textarea id="scene-script" class="w-full rounded-lg px-3 py-2 h-32" placeholder="Scene dialogue and action..."></textarea>
      </div>
    </div>
  `, async () => {
    const scene = {
      project_id: state.currentProject,
      user_id: state.user.id,
      title: document.getElementById('scene-title').value,
      location_id: document.getElementById('scene-location').value || null,
      time_of_day: document.getElementById('scene-time').value,
      description: document.getElementById('scene-desc').value,
      script: document.getElementById('scene-script').value,
      sort_order: state.scenes.length
    };
    try {
      const newScene = await DB.createScene(scene);
      state.scenes.push(newScene);
      hideModal();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

async function deleteScene(sceneId) {
  if (!confirm('Delete this scene?')) return;
  try {
    await DB.deleteScene(sceneId);
    state.scenes = state.scenes.filter(s => s.id !== sceneId);
    renderPage();
    showToast(t('deletedSuccessfully'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ============ ASSETS PAGE ============
function renderAssetsPage() {
  const assets = state.generatedAssets.filter(a => !state.currentProject || a.project_id === state.currentProject);
  
  return `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold">🖼️ ${t('generatedAssets')}</h1>
        <div class="flex gap-2">
          <select id="asset-filter" class="rounded-lg px-3 py-2 text-sm" onchange="filterAssets(this.value)">
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>
      
      ${assets.length === 0 ? `
        <div class="glass rounded-xl p-8 text-center">
          <div class="text-4xl mb-3">🖼️</div>
          <p class="text-slate-400">No generated assets yet. Use the tools to generate content!</p>
        </div>
      ` : `
        <div class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          ${assets.map(asset => `
            <div class="glass rounded-xl overflow-hidden card-hover">
              <div class="aspect-video bg-slate-800 flex items-center justify-center">
                ${asset.asset_type === 'image' ? `
                  <img src="${asset.url || ''}" alt="${asset.name}" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🖼️</text></svg>'">
                ` : asset.asset_type === 'video' ? `
                  <span class="text-4xl">🎬</span>
                ` : `
                  <span class="text-4xl">🎵</span>
                `}
              </div>
              <div class="p-3">
                <h4 class="text-sm font-medium truncate">${asset.name || 'Untitled'}</h4>
                <p class="text-xs text-slate-500">${asset.tool_used || ''}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="tag text-[10px]">${asset.asset_type}</span>
                  <button onclick="deleteAsset('${asset.id}')" class="text-red-400 text-xs hover:text-red-300">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

async function deleteAsset(assetId) {
  if (!confirm('Delete this asset?')) return;
  try {
    await DB.deleteAsset(assetId);
    state.generatedAssets = state.generatedAssets.filter(a => a.id !== assetId);
    renderPage();
    showToast(t('deletedSuccessfully'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ============ ADMIN OPAL LINKS PAGE ============
function renderAdminOpalLinksPage() {
  const allTools = [];
  PHASES.forEach(phase => {
    phase.apps.forEach(app => {
      allTools.push({
        ...app,
        phaseName: phase.name,
        phaseIcon: phase.icon,
        globalLink: state.globalOpalLinks[app.id] || '',
        defaultLink: DEFAULT_OPAL_LINKS[app.id] || ''
      });
    });
  });
  
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-5">
        <h1 class="text-xl font-bold">⚙️ Global Opal Links</h1>
        <p class="text-slate-400 text-sm mt-1">Manage default Opal links for all users</p>
      </div>
      
      <div class="space-y-3">
        ${allTools.map(tool => `
          <div class="glass rounded-xl p-4">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xl">${tool.icon}</span>
              <div class="flex-1">
                <h3 class="font-medium">${tool.name}</h3>
                <p class="text-xs text-slate-500">${tool.phaseIcon} ${tool.phaseName}</p>
              </div>
              ${tool.globalLink ? '<span class="tag bg-green-500/20 border-green-500/30 text-green-400 text-[10px]">Active</span>' : ''}
            </div>
            <div class="flex gap-2">
              <input type="text" id="global-link-${tool.id}" class="flex-1 rounded-lg px-3 py-2 text-sm" 
                     placeholder="https://opal.google.com/..." value="${tool.globalLink || tool.defaultLink}">
              <button onclick="saveGlobalOpalLink('${tool.id}')" class="btn-primary px-4 py-2 rounded-lg text-sm">${t('save')}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function saveGlobalOpalLink(appId) {
  const url = document.getElementById(`global-link-${appId}`).value;
  try {
    await DB.setGlobalOpalLink(appId, url);
    state.globalOpalLinks[appId] = url;
    showToast(t('savedSuccessfully'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ============ HISTORY PANEL ============
function showHistoryPanel() {
  const panel = document.getElementById('history-panel');
  panel.classList.remove('hidden');
  renderHistoryList();
}

function hideHistoryPanel() {
  document.getElementById('history-panel').classList.add('hidden');
}

function renderHistoryList() {
  const list = document.getElementById('history-list');
  const projectHistory = state.history.filter(h => !state.currentProject || h.project_id === state.currentProject);
  
  if (projectHistory.length === 0) {
    list.innerHTML = '<p class="text-slate-500 text-sm text-center py-8">No history yet</p>';
    return;
  }
  
  list.innerHTML = projectHistory.map(h => `
    <div class="glass rounded-lg p-3 mb-2 card-hover">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h4 class="text-sm font-medium">${h.tool_name || h.tool_id}</h4>
          <p class="text-xs text-slate-500">${new Date(h.created_at).toLocaleString()}</p>
        </div>
        <button onclick="deleteHistoryItem('${h.id}')" class="text-red-400 text-xs">🗑️</button>
      </div>
      <p class="text-xs text-slate-400 line-clamp-3">${h.prompt || ''}</p>
      <button onclick="copyHistoryPrompt('${h.id}')" class="btn-secondary px-2 py-1 rounded text-[10px] mt-2">📋 Copy</button>
    </div>
  `).join('');
}

function updateHistoryCount() {
  const count = state.history.filter(h => !state.currentProject || h.project_id === state.currentProject).length;
  document.getElementById('history-count').textContent = count;
}

async function deleteHistoryItem(historyId) {
  try {
    await DB.deleteHistory(historyId);
    state.history = state.history.filter(h => h.id !== historyId);
    renderHistoryList();
    updateHistoryCount();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function copyHistoryPrompt(historyId) {
  const item = state.history.find(h => h.id === historyId);
  if (item?.prompt) {
    navigator.clipboard.writeText(item.prompt).then(() => {
      showToast(t('copiedToClipboard'), 'success');
    });
  }
}

// ============ MODALS ============
function showModal(title, content, onConfirm) {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onclick="hideModal()">
      <div class="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in" onclick="event.stopPropagation()">
        <div class="p-5 border-b border-cyan-500/10 flex items-center justify-between">
          <h2 class="text-lg font-bold">${title}</h2>
          <button onclick="hideModal()" class="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>
        <div class="p-5">${content}</div>
        <div class="p-5 border-t border-cyan-500/10 flex justify-end gap-3">
          <button onclick="hideModal()" class="btn-secondary px-4 py-2 rounded-lg">${t('cancel')}</button>
          <button onclick="window.modalConfirm()" class="btn-primary px-4 py-2 rounded-lg">${t('confirm')}</button>
        </div>
      </div>
    </div>
  `;
  window.modalConfirm = onConfirm;
}

function hideModal() {
  document.getElementById('modal-container').innerHTML = '';
  window.modalConfirm = null;
}

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const colors = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    info: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
  };
  
  const toast = document.createElement('div');
  toast.className = `glass rounded-xl px-4 py-3 border ${colors[type]} toast`;
  toast.innerHTML = `<p class="text-sm">${message}</p>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============ SETTINGS MODAL ============
function showSettingsModal() {
  showModal(t('settings'), `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-2">Language</label>
        <div class="flex gap-2">
          <button onclick="switchLang('id'); hideModal();" class="flex-1 btn-secondary px-4 py-3 rounded-lg ${getLang() === 'id' ? 'ring-2 ring-cyan-500' : ''}">
            🇮🇩 Bahasa Indonesia
          </button>
          <button onclick="switchLang('en'); hideModal();" class="flex-1 btn-secondary px-4 py-3 rounded-lg ${getLang() === 'en' ? 'ring-2 ring-cyan-500' : ''}">
            🇺🇸 English
          </button>
        </div>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-2">Default Output Count</label>
        <select id="settings-output" class="w-full rounded-lg px-3 py-2">
          ${[1,2,3,4,5].map(n => `<option value="${n}" ${state.outputCount === n ? 'selected' : ''}>${n}x</option>`).join('')}
        </select>
      </div>
    </div>
  `, () => {
    state.outputCount = parseInt(document.getElementById('settings-output').value);
    localStorage.setItem('outputCount', state.outputCount);
    hideModal();
    showToast(t('savedSuccessfully'), 'success');
  });
}

// ============ WORKFLOW HELP ============
function showWorkflowHelp() {
  showModal(t('helpTitle'), `
    <div class="space-y-4">
      <div class="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <h4 class="font-semibold text-cyan-400 mb-2">📋 ${t('checklistInfo')}</h4>
        <p class="text-sm text-slate-400">${t('completionMeaning')}</p>
      </div>
      
      <div class="space-y-3">
        ${WORKFLOW_PHASES.map(phase => `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">${phase.step}</div>
            <div>
              <h4 class="font-medium">${phase.icon} ${getWorkflowPhaseName(phase.id)}</h4>
              <p class="text-xs text-slate-500">${phase.tools.length} tools • ${phase.required ? t('required') : t('optional')}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p class="text-xs text-blue-400">💡 ${t('opalLinkInfo')}</p>
      </div>
    </div>
  `, hideModal);
}

// ============ EDIT MODALS ============
function showEditProjectModal(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  showModal(t('edit') + ' Project', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">${t('projectName')}</label>
        <input type="text" id="edit-project-name" class="w-full rounded-lg px-3 py-2" value="${project.name || ''}">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">${t('projectType')}</label>
        <select id="edit-project-type" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.projectType.map(t => `<option ${project.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Genre</label>
        <select id="edit-project-genre" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.genre.map(g => `<option ${project.genre === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="edit-project-desc" class="w-full rounded-lg px-3 py-2 h-20">${project.description || ''}</textarea>
      </div>
    </div>
  `, async () => {
    const updates = {
      name: document.getElementById('edit-project-name').value,
      type: document.getElementById('edit-project-type').value,
      genre: document.getElementById('edit-project-genre').value,
      description: document.getElementById('edit-project-desc').value
    };
    try {
      await DB.updateProject(projectId, updates);
      const idx = state.projects.findIndex(p => p.id === projectId);
      if (idx >= 0) state.projects[idx] = { ...state.projects[idx], ...updates };
      hideModal();
      updateProjectSelector();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function showEditCharacterModal(charId) {
  const char = state.characters.find(c => c.id === charId);
  if (!char) return;
  
  showModal(t('edit') + ' Character', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Name</label>
        <input type="text" id="edit-char-name" class="w-full rounded-lg px-3 py-2" value="${char.name || ''}">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Role</label>
        <select id="edit-char-role" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.characterRole.map(r => `<option ${char.role === r ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="edit-char-desc" class="w-full rounded-lg px-3 py-2 h-24">${char.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Visual Description</label>
        <textarea id="edit-char-visual" class="w-full rounded-lg px-3 py-2 h-20">${char.visual_description || ''}</textarea>
      </div>
    </div>
  `, async () => {
    const updates = {
      name: document.getElementById('edit-char-name').value,
      role: document.getElementById('edit-char-role').value,
      description: document.getElementById('edit-char-desc').value,
      visual_description: document.getElementById('edit-char-visual').value
    };
    try {
      await DB.updateCharacter(charId, updates);
      const idx = state.characters.findIndex(c => c.id === charId);
      if (idx >= 0) state.characters[idx] = { ...state.characters[idx], ...updates };
      hideModal();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function showEditLocationModal(locId) {
  const loc = state.locations.find(l => l.id === locId);
  if (!loc) return;
  
  showModal(t('edit') + ' Location', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Name</label>
        <input type="text" id="edit-loc-name" class="w-full rounded-lg px-3 py-2" value="${loc.name || ''}">
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Type</label>
        <select id="edit-loc-type" class="w-full rounded-lg px-3 py-2">
          ${OPTIONS.locationType.map(t => `<option ${loc.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="edit-loc-desc" class="w-full rounded-lg px-3 py-2 h-24">${loc.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Visual Description</label>
        <textarea id="edit-loc-visual" class="w-full rounded-lg px-3 py-2 h-20">${loc.visual_description || ''}</textarea>
      </div>
    </div>
  `, async () => {
    const updates = {
      name: document.getElementById('edit-loc-name').value,
      type: document.getElementById('edit-loc-type').value,
      description: document.getElementById('edit-loc-desc').value,
      visual_description: document.getElementById('edit-loc-visual').value
    };
    try {
      await DB.updateLocation(locId, updates);
      const idx = state.locations.findIndex(l => l.id === locId);
      if (idx >= 0) state.locations[idx] = { ...state.locations[idx], ...updates };
      hideModal();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function showEditSceneModal(sceneId) {
  const scene = state.scenes.find(s => s.id === sceneId);
  if (!scene) return;
  
  showModal('Edit Scene', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1">Scene Title</label>
        <input type="text" id="edit-scene-title" class="w-full rounded-lg px-3 py-2" value="${scene.title || ''}">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-slate-400 mb-1">Location</label>
          <select id="edit-scene-location" class="w-full rounded-lg px-3 py-2">
            <option value="">Select location</option>
            ${state.locations.map(l => `<option value="${l.id}" ${scene.location_id === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Time of Day</label>
          <select id="edit-scene-time" class="w-full rounded-lg px-3 py-2">
            ${['Day', 'Night', 'Dawn', 'Dusk'].map(t => `<option ${scene.time_of_day === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Description</label>
        <textarea id="edit-scene-desc" class="w-full rounded-lg px-3 py-2 h-24">${scene.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-1">Dialogue/Script</label>
        <textarea id="edit-scene-script" class="w-full rounded-lg px-3 py-2 h-32">${scene.script || ''}</textarea>
      </div>
    </div>
  `, async () => {
    const updates = {
      title: document.getElementById('edit-scene-title').value,
      location_id: document.getElementById('edit-scene-location').value || null,
      time_of_day: document.getElementById('edit-scene-time').value,
      description: document.getElementById('edit-scene-desc').value,
      script: document.getElementById('edit-scene-script').value
    };
    try {
      await DB.updateScene(sceneId, updates);
      const idx = state.scenes.findIndex(s => s.id === sceneId);
      if (idx >= 0) state.scenes[idx] = { ...state.scenes[idx], ...updates };
      hideModal();
      renderPage();
      showToast(t('savedSuccessfully'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
