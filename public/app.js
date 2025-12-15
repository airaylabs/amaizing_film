// AI Filmmaking Studio - Main Application

// ============ STATE ============
let state = {
  currentPage: 'dashboard',
  currentApp: null,
  currentProject: null,
  projects: [],
  characters: [],
  locations: [],
  history: [],
  opalLinks: {}
};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderSidebar();
  renderPage();
  updateHistoryCount();
});

function loadState() {
  state.projects = JSON.parse(localStorage.getItem('projects') || '[]');
  state.characters = JSON.parse(localStorage.getItem('characters') || '[]');
  state.locations = JSON.parse(localStorage.getItem('locations') || '[]');
  state.history = JSON.parse(localStorage.getItem('history') || '[]');
  state.opalLinks = JSON.parse(localStorage.getItem('opalLinks') || '{}');
  state.currentProject = localStorage.getItem('currentProject') || null;
  updateProjectSelector();
}

function saveState() {
  localStorage.setItem('projects', JSON.stringify(state.projects));
  localStorage.setItem('characters', JSON.stringify(state.characters));
  localStorage.setItem('locations', JSON.stringify(state.locations));
  localStorage.setItem('history', JSON.stringify(state.history));
  localStorage.setItem('opalLinks', JSON.stringify(state.opalLinks));
  localStorage.setItem('currentProject', state.currentProject || '');
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
  let html = `
    <div class="sidebar-item ${state.currentPage === 'dashboard' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1 transition-all" onclick="navigateTo('dashboard')">
      <span class="mr-2">🏠</span> Dashboard
    </div>
    <div class="mt-4 mb-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Production Phases</div>
  `;
  
  PHASES.forEach(phase => {
    const isExpanded = phase.apps.some(a => a.id === state.currentApp);
    html += `
      <div class="mb-1">
        <div class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-all" onclick="togglePhase('${phase.id}')">
          <span><span class="mr-2">${phase.icon}</span>${phase.name}</span>
          <span class="text-xs text-gray-500">${phase.apps.length}</span>
        </div>
        <div id="phase-${phase.id}" class="${isExpanded ? '' : 'hidden'} ml-4 border-l border-white/10 pl-2">
          ${phase.apps.map(app => `
            <div class="sidebar-item ${state.currentApp === app.id ? 'active' : ''} rounded-lg p-2 cursor-pointer text-sm transition-all" onclick="navigateTo('app', '${app.id}')">
              <span class="mr-2">${app.icon}</span>${app.name}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += `
    <div class="mt-4 mb-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Management</div>
    <div class="sidebar-item ${state.currentPage === 'characters' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1 transition-all" onclick="navigateTo('characters')">
      <span class="mr-2">👤</span> Characters <span class="ml-auto text-xs text-gray-500">${state.characters.filter(c => !state.currentProject || c.projectId === state.currentProject).length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'locations' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1 transition-all" onclick="navigateTo('locations')">
      <span class="mr-2">🎭</span> Locations <span class="ml-auto text-xs text-gray-500">${state.locations.filter(l => !state.currentProject || l.projectId === state.currentProject).length}</span>
    </div>
    <div class="sidebar-item ${state.currentPage === 'workflow' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1 transition-all" onclick="navigateTo('workflow')">
      <span class="mr-2">📋</span> Workflow
    </div>
    <div class="sidebar-item ${state.currentPage === 'opal-links' ? 'active' : ''} rounded-lg p-3 cursor-pointer mb-1 transition-all" onclick="navigateTo('opal-links')">
      <span class="mr-2">🔗</span> Opal Links
    </div>
  `;
  
  nav.innerHTML = html;
}

function togglePhase(phaseId) {
  const el = document.getElementById('phase-' + phaseId);
  el.classList.toggle('hidden');
}

// ============ PROJECT MANAGEMENT ============
function updateProjectSelector() {
  const sel = document.getElementById('project-selector');
  sel.innerHTML = '<option value="">All Projects</option>' + 
    state.projects.map(p => `<option value="${p.id}" ${p.id === state.currentProject ? 'selected' : ''}>${p.name}</option>`).join('');
}

function switchProject(projectId) {
  state.currentProject = projectId || null;
  saveState();
  renderSidebar();
  renderPage();
}

function showNewProjectModal() {
  showModal('New Project', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Project Name</label>
        <input type="text" id="new-project-name" class="w-full border border-white/10 rounded-lg px-3 py-2" placeholder="My Film Project">
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Type</label>
        <select id="new-project-type" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.projectType.map(t => `<option>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Genre</label>
        <select id="new-project-genre" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.genre.map(g => `<option>${g}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Description</label>
        <textarea id="new-project-desc" class="w-full border border-white/10 rounded-lg px-3 py-2 h-20" placeholder="Brief description..."></textarea>
      </div>
    </div>
  `, () => {
    const project = {
      id: Date.now().toString(),
      name: document.getElementById('new-project-name').value || 'Untitled Project',
      type: document.getElementById('new-project-type').value,
      genre: document.getElementById('new-project-genre').value,
      description: document.getElementById('new-project-desc').value,
      createdAt: new Date().toISOString()
    };
    state.projects.push(project);
    state.currentProject = project.id;
    saveState();
    updateProjectSelector();
    hideModal();
    renderPage();
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
    default: html = renderDashboard();
  }
  
  content.innerHTML = `<div class="fade-in">${html}</div>`;
  updateBreadcrumb();
}

function renderDashboard() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const projectChars = state.characters.filter(c => !state.currentProject || c.projectId === state.currentProject);
  const projectLocs = state.locations.filter(l => !state.currentProject || l.projectId === state.currentProject);
  
  return `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          AI Filmmaking Studio
        </h1>
        <p class="text-gray-400">Complete production platform • Unlimited VEO 3 + Gemini via Google Opal</p>
      </div>
      
      <!-- Project Card -->
      ${project ? `
        <div class="glass rounded-2xl p-6 mb-8 gradient-card pulse-glow">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="tag">${project.type}</span>
                <span class="tag">${project.genre}</span>
              </div>
              <h2 class="text-2xl font-bold">${project.name}</h2>
              <p class="text-gray-400 text-sm mt-2">${project.description || 'No description'}</p>
              <div class="flex gap-4 mt-4 text-sm">
                <span class="text-gray-500">👤 ${projectChars.length} Characters</span>
                <span class="text-gray-500">🎭 ${projectLocs.length} Locations</span>
                <span class="text-gray-500">📜 ${state.history.filter(h => h.projectId === project.id).length} Generations</span>
              </div>
            </div>
            <button onclick="editProject('${project.id}')" class="btn-secondary px-4 py-2 rounded-lg text-sm">Edit Project</button>
          </div>
        </div>
      ` : `
        <div class="glass rounded-2xl p-8 mb-8 text-center gradient-card">
          <div class="text-5xl mb-4">🎬</div>
          <h3 class="text-xl font-semibold mb-2">Start Your Film Project</h3>
          <p class="text-gray-400 mb-6">Create a project to organize characters, locations, and track your production.</p>
          <button onclick="showNewProjectModal()" class="btn-primary px-8 py-3 rounded-xl font-semibold">+ Create New Project</button>
        </div>
      `}
      
      <!-- Quick Start Guide -->
      <div class="glass rounded-2xl p-6 mb-8">
        <h3 class="font-semibold mb-4 flex items-center gap-2">🚀 Quick Start Workflow</h3>
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <div class="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
            <span>1️⃣</span> Create Characters
          </div>
          <span class="text-purple-500">→</span>
          <div class="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
            <span>2️⃣</span> Design Locations
          </div>
          <span class="text-blue-500">→</span>
          <div class="flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20">
            <span>3️⃣</span> Generate Prompts
          </div>
          <span class="text-pink-500">→</span>
          <div class="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <span>4️⃣</span> Copy to Opal
          </div>
          <span class="text-green-500">→</span>
          <div class="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
            <span>5️⃣</span> Generate & Download
          </div>
        </div>
      </div>
      
      <!-- Production Phases -->
      <h3 class="text-lg font-semibold mb-4">📋 Production Phases</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        ${PHASES.map((phase, idx) => `
          <div class="glass glass-hover rounded-2xl p-5 cursor-pointer transition-all phase-${phase.color}" onclick="togglePhase('${phase.id}')">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-${phase.color}-500/20 to-${phase.color}-600/10 flex items-center justify-center text-xl">
                ${phase.icon}
              </div>
              <div>
                <div class="text-xs text-gray-500">Phase ${idx + 1}</div>
                <h4 class="font-semibold">${phase.name}</h4>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${phase.apps.map(app => `
                <span class="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg cursor-pointer transition-all" onclick="event.stopPropagation(); navigateTo('app', '${app.id}')">
                  ${app.icon} ${app.name.split(' ')[0]}
                </span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Quick Access Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="navigateTo('characters')">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">👤</span>
            <span class="text-2xl font-bold text-purple-400">${projectChars.length}</span>
          </div>
          <h4 class="font-semibold">Characters</h4>
          <p class="text-xs text-gray-500 mt-1">Manage film characters</p>
        </div>
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="navigateTo('locations')">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🎭</span>
            <span class="text-2xl font-bold text-blue-400">${projectLocs.length}</span>
          </div>
          <h4 class="font-semibold">Locations</h4>
          <p class="text-xs text-gray-500 mt-1">Design environments</p>
        </div>
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="showHistoryPanel()">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">📜</span>
            <span class="text-2xl font-bold text-pink-400">${state.history.length}</span>
          </div>
          <h4 class="font-semibold">History</h4>
          <p class="text-xs text-gray-500 mt-1">Past generations</p>
        </div>
        <div class="glass rounded-2xl p-5 cursor-pointer glass-hover" onclick="navigateTo('opal-links')">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🔗</span>
            <span class="text-2xl font-bold text-green-400">${Object.keys(state.opalLinks).filter(k => state.opalLinks[k]).length}</span>
          </div>
          <h4 class="font-semibold">Opal Links</h4>
          <p class="text-xs text-gray-500 mt-1">Quick app access</p>
        </div>
      </div>
    </div>
  `;
}


function renderAppPage() {
  const appConfig = APP_FORMS[state.currentApp];
  const app = findApp(state.currentApp);
  const phase = findPhase(state.currentApp);
  
  if (!appConfig || !app) return '<p>App not found</p>';
  
  // Get characters and locations for quick insert
  const chars = state.characters.filter(c => !state.currentProject || c.projectId === state.currentProject);
  const locs = state.locations.filter(l => !state.currentProject || l.projectId === state.currentProject);
  
  return `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 flex items-center justify-center text-3xl">
          ${app.icon}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="tag">${phase.name}</span>
            <span class="text-xs text-gray-500">App ${state.currentApp}</span>
          </div>
          <h2 class="text-2xl font-bold">${app.name}</h2>
          <p class="text-gray-400 text-sm">${app.desc}</p>
        </div>
        <div class="flex gap-2">
          ${state.opalLinks[state.currentApp] ? `
            <a href="${state.opalLinks[state.currentApp]}" target="_blank" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
              🚀 Open in Opal
            </a>
          ` : `
            <button onclick="navigateTo('opal-links')" class="btn-secondary px-4 py-2 rounded-xl text-sm">
              🔗 Setup Opal Link
            </button>
          `}
        </div>
      </div>
      
      <!-- Quick Insert Bar (if has characters/locations) -->
      ${(chars.length > 0 || locs.length > 0) ? `
        <div class="glass rounded-xl p-4 mb-6">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-sm text-gray-400">Quick Insert:</span>
            ${chars.slice(0, 3).map(c => `
              <button onclick="quickInsertCharacter('${c.id}')" class="text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                👤 ${c.name}
              </button>
            `).join('')}
            ${locs.slice(0, 3).map(l => `
              <button onclick="quickInsertLocation('${l.id}')" class="text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                🎭 ${l.name}
              </button>
            `).join('')}
            ${chars.length > 3 || locs.length > 3 ? `<span class="text-xs text-gray-500">+${chars.length + locs.length - 6} more</span>` : ''}
          </div>
        </div>
      ` : ''}
      
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Input Form (3 cols) -->
        <div class="lg:col-span-3 glass rounded-2xl p-6">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            <span>📝</span> Input Options
            <span class="text-xs text-gray-500 ml-auto">All fields auto-generate prompt</span>
          </h3>
          <div class="space-y-4" id="app-form">
            ${renderAppForm(appConfig)}
          </div>
          <div class="flex gap-3 mt-6">
            <button onclick="generatePrompt()" class="flex-1 btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              ✨ Generate Prompt
            </button>
            <button onclick="clearForm()" class="btn-secondary px-4 py-3 rounded-xl">
              🗑️
            </button>
          </div>
        </div>
        
        <!-- Output (2 cols) -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Generated Prompt -->
          <div class="glass rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-sm flex items-center gap-2">📋 Generated Prompt</h3>
              <button onclick="copyPrompt()" id="copy-btn" class="btn-primary px-4 py-1.5 rounded-lg text-xs font-medium transition-all">
                📋 Copy to Clipboard
              </button>
            </div>
            <div id="prompt-output" class="prompt-output rounded-xl p-4 min-h-[180px] max-h-[300px] overflow-y-auto font-mono text-xs whitespace-pre-wrap leading-relaxed">
              <span class="text-gray-500 italic">Fill in the options above. Prompt will auto-generate...</span>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-sm mb-3">⚡ Quick Actions</h3>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="saveToHistory()" class="btn-secondary py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                💾 Save to History
              </button>
              <button onclick="copyAndOpenOpal()" class="btn-secondary py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                🚀 Copy & Open Opal
              </button>
              <button onclick="useCharacter()" class="btn-secondary py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                👤 Insert Character
              </button>
              <button onclick="useLocation()" class="btn-secondary py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                🎭 Insert Location
              </button>
            </div>
          </div>
          
          <!-- Tips -->
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-sm mb-2">💡 Tips</h3>
            <ul class="text-xs text-gray-400 space-y-1">
              <li>• Use consistent characters across scenes</li>
              <li>• Copy prompt → Paste in Opal → Generate</li>
              <li>• Save successful prompts to History</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Recent Generations -->
      ${state.history.filter(h => h.appId === state.currentApp).length > 0 ? `
        <div class="mt-8">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            📜 Recent from ${app.name}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${state.history.filter(h => h.appId === state.currentApp).slice(0, 6).map(h => `
              <div class="glass rounded-xl p-4 cursor-pointer glass-hover transition-all" onclick="loadFromHistory('${h.id}')">
                <div class="text-xs text-purple-400 mb-2">${new Date(h.timestamp).toLocaleString()}</div>
                <p class="text-xs line-clamp-3 text-gray-300">${h.prompt.substring(0, 120)}...</p>
                <button onclick="event.stopPropagation(); copyHistoryPrompt('${h.id}')" class="mt-2 text-xs text-gray-500 hover:text-white">📋 Copy</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderAppForm(config) {
  return config.inputs.map(input => {
    if (input.type === 'textarea') {
      return `
        <div>
          <label class="block text-sm text-gray-400 mb-1">${input.label}</label>
          <textarea id="input-${input.id}" class="w-full border border-white/10 rounded-lg px-3 py-2" 
            rows="${input.rows || 3}" placeholder="${input.placeholder || ''}"
            onchange="autoSaveForm()"></textarea>
        </div>
      `;
    } else if (input.type === 'select') {
      const options = OPTIONS[input.options] || [];
      return `
        <div>
          <label class="block text-sm text-gray-400 mb-1">${input.label}</label>
          <select id="input-${input.id}" class="w-full border border-white/10 rounded-lg px-3 py-2" onchange="autoSaveForm()">
            <option value="">Select...</option>
            ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
        </div>
      `;
    } else {
      return `
        <div>
          <label class="block text-sm text-gray-400 mb-1">${input.label}</label>
          <input type="text" id="input-${input.id}" class="w-full border border-white/10 rounded-lg px-3 py-2" 
            placeholder="${input.placeholder || ''}" onchange="autoSaveForm()">
        </div>
      `;
    }
  }).join('');
}


function renderCharactersPage() {
  const chars = state.characters.filter(c => !state.currentProject || c.projectId === state.currentProject);
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold">👤 Characters</h2>
          <p class="text-gray-400 text-sm">Manage your film characters</p>
        </div>
        <button onclick="showCharacterModal()" class="btn-primary px-4 py-2 rounded-xl">+ New Character</button>
      </div>
      
      ${chars.length === 0 ? `
        <div class="glass rounded-2xl p-8 text-center">
          <p class="text-gray-400 mb-4">No characters yet. Create your first character!</p>
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
                      <p class="text-sm text-gray-400">${char.age} • ${char.gender} • ${char.role}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-300 mb-2">${char.physical}</p>
                  <p class="text-sm text-gray-500">Costume: ${char.costume}</p>
                </div>
                <div class="flex gap-2">
                  <button onclick="useCharacterInApp('${char.id}')" class="bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1.5 rounded-lg text-sm transition-all">Use in App</button>
                  <button onclick="generateCharPrompt('${char.id}')" class="bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition-all">Get Prompt</button>
                  <button onclick="deleteCharacter('${char.id}')" class="bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-all">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderLocationsPage() {
  const locs = state.locations.filter(l => !state.currentProject || l.projectId === state.currentProject);
  return `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold">🎭 Locations</h2>
          <p class="text-gray-400 text-sm">Manage your film locations</p>
        </div>
        <button onclick="showLocationModal()" class="btn-primary px-4 py-2 rounded-xl">+ New Location</button>
      </div>
      
      ${locs.length === 0 ? `
        <div class="glass rounded-2xl p-8 text-center">
          <p class="text-gray-400 mb-4">No locations yet. Create your first location!</p>
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
                      <p class="text-sm text-gray-400">${loc.type} • ${loc.mood} • ${loc.timeOfDay}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-300">${loc.description}</p>
                </div>
                <div class="flex gap-2">
                  <button onclick="useLocationInApp('${loc.id}')" class="bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1.5 rounded-lg text-sm transition-all">Use in App</button>
                  <button onclick="generateLocPrompt('${loc.id}')" class="bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition-all">Get Prompt</button>
                  <button onclick="deleteLocation('${loc.id}')" class="bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-all">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderWorkflowPage() {
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">📋 Production Workflow</h2>
        <p class="text-gray-400 text-sm">Track your progress through all production phases</p>
      </div>
      
      <div class="space-y-6">
        ${PHASES.map((phase, idx) => `
          <div class="glass rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">${phase.icon}</span>
              <div>
                <h3 class="font-semibold">Phase ${idx + 1}: ${phase.name}</h3>
                <p class="text-xs text-gray-500">${phase.apps.length} tools available</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${phase.apps.map(app => `
                <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all" onclick="navigateTo('app', '${app.id}')">
                  <span>${app.icon}</span>
                  <div class="flex-1">
                    <div class="text-sm font-medium">${app.id}. ${app.name}</div>
                    <div class="text-xs text-gray-500">${app.desc}</div>
                  </div>
                  ${state.opalLinks[app.id] ? '<span class="text-green-400 text-xs">✓ Ready</span>' : '<span class="text-gray-500 text-xs">Setup needed</span>'}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderOpalLinksPage() {
  return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">🔗 Opal App Links</h2>
        <p class="text-gray-400 text-sm">Save your Google Opal app links for quick access</p>
      </div>
      
      <div class="space-y-4">
        ${PHASES.map(phase => `
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold mb-4">${phase.icon} ${phase.name}</h3>
            <div class="space-y-3">
              ${phase.apps.map(app => `
                <div class="flex items-center gap-3">
                  <span class="text-xl">${app.icon}</span>
                  <div class="flex-1">
                    <div class="text-sm font-medium mb-1">${app.id}. ${app.name}</div>
                    <input type="text" value="${state.opalLinks[app.id] || ''}" 
                      onchange="saveOpalLink('${app.id}', this.value)"
                      class="w-full border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                      placeholder="Paste your Opal app link here...">
                  </div>
                  ${state.opalLinks[app.id] ? `
                    <a href="${state.opalLinks[app.id]}" target="_blank" class="btn-primary px-3 py-1.5 rounded-lg text-sm">Open</a>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


// ============ PROMPT GENERATION ============
function generatePrompt() {
  const config = APP_FORMS[state.currentApp];
  if (!config) return;
  
  let prompt = config.promptTemplate;
  
  config.inputs.forEach(input => {
    const el = document.getElementById('input-' + input.id);
    const value = el ? el.value : '';
    prompt = prompt.replace(new RegExp(`{${input.id}}`, 'g'), value || `[${input.label}]`);
  });
  
  // Clean up empty placeholders
  prompt = prompt.replace(/\n\n+/g, '\n\n').trim();
  
  document.getElementById('prompt-output').textContent = prompt;
}

function copyPrompt() {
  const prompt = document.getElementById('prompt-output').textContent;
  navigator.clipboard.writeText(prompt).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.innerHTML = '✅ Copied!';
    btn.classList.add('copy-success', 'bg-green-500/40');
    setTimeout(() => {
      btn.innerHTML = '📋 Copy';
      btn.classList.remove('copy-success', 'bg-green-500/40');
    }, 2000);
  });
}

function saveToHistory() {
  const prompt = document.getElementById('prompt-output').textContent;
  if (!prompt || prompt.includes('Fill in the options')) return;
  
  const entry = {
    id: Date.now().toString(),
    appId: state.currentApp,
    appName: findApp(state.currentApp)?.name,
    prompt: prompt,
    projectId: state.currentProject,
    timestamp: new Date().toISOString()
  };
  
  state.history.unshift(entry);
  if (state.history.length > 100) state.history.pop();
  saveState();
  
  alert('Saved to history!');
}

function loadFromHistory(historyId) {
  const entry = state.history.find(h => h.id === historyId);
  if (entry) {
    document.getElementById('prompt-output').textContent = entry.prompt;
  }
}

// ============ CHARACTER & LOCATION ============
function showCharacterModal(char = null) {
  showModal(char ? 'Edit Character' : 'New Character', `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Name</label>
          <input type="text" id="char-name" value="${char?.name || ''}" class="w-full border border-white/10 rounded-lg px-3 py-2" placeholder="Maya Chen">
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Role</label>
          <select id="char-role" class="w-full border border-white/10 rounded-lg px-3 py-2">
            ${OPTIONS.characterRole.map(r => `<option ${char?.role === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Age</label>
          <select id="char-age" class="w-full border border-white/10 rounded-lg px-3 py-2">
            ${OPTIONS.age.map(a => `<option ${char?.age === a ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Gender</label>
          <select id="char-gender" class="w-full border border-white/10 rounded-lg px-3 py-2">
            ${OPTIONS.gender.map(g => `<option ${char?.gender === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Physical Description</label>
        <textarea id="char-physical" class="w-full border border-white/10 rounded-lg px-3 py-2 h-20" placeholder="Short black hair, brown eyes...">${char?.physical || ''}</textarea>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Costume/Clothing</label>
        <textarea id="char-costume" class="w-full border border-white/10 rounded-lg px-3 py-2 h-20" placeholder="Dark leather jacket...">${char?.costume || ''}</textarea>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Personality</label>
        <input type="text" id="char-personality" value="${char?.personality || ''}" class="w-full border border-white/10 rounded-lg px-3 py-2" placeholder="Determined, analytical...">
      </div>
    </div>
  `, () => saveCharacter(char?.id));
}

function saveCharacter(existingId = null) {
  const charData = {
    id: existingId || Date.now().toString(),
    projectId: state.currentProject,
    name: document.getElementById('char-name').value,
    role: document.getElementById('char-role').value,
    age: document.getElementById('char-age').value,
    gender: document.getElementById('char-gender').value,
    physical: document.getElementById('char-physical').value,
    costume: document.getElementById('char-costume').value,
    personality: document.getElementById('char-personality').value,
    createdAt: new Date().toISOString()
  };
  
  if (existingId) {
    const idx = state.characters.findIndex(c => c.id === existingId);
    if (idx >= 0) state.characters[idx] = charData;
  } else {
    state.characters.push(charData);
  }
  
  saveState();
  hideModal();
  renderPage();
}

function deleteCharacter(id) {
  if (confirm('Delete this character?')) {
    state.characters = state.characters.filter(c => c.id !== id);
    saveState();
    renderPage();
  }
}

function generateCharPrompt(id) {
  const char = state.characters.find(c => c.id === id);
  if (!char) return;
  
  const prompt = `${char.age} ${char.gender}, ${char.physical}, wearing ${char.costume}, ${char.personality} personality, cinematic portrait, dramatic lighting, highly detailed`;
  navigator.clipboard.writeText(prompt);
  alert('Character prompt copied to clipboard!');
}

function showLocationModal(loc = null) {
  showModal(loc ? 'Edit Location' : 'New Location', `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Location Name</label>
          <input type="text" id="loc-name" value="${loc?.name || ''}" class="w-full border border-white/10 rounded-lg px-3 py-2" placeholder="Maya's Apartment">
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Type</label>
          <select id="loc-type" class="w-full border border-white/10 rounded-lg px-3 py-2">
            ${OPTIONS.locationType.map(t => `<option ${loc?.type === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Time of Day</label>
          <select id="loc-time" class="w-full border border-white/10 rounded-lg px-3 py-2">
            ${OPTIONS.timeOfDay.map(t => `<option ${loc?.timeOfDay === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Mood</label>
          <select id="loc-mood" class="w-full border border-white/10 rounded-lg px-3 py-2">
            ${OPTIONS.mood.map(m => `<option ${loc?.mood === m ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Description</label>
        <textarea id="loc-desc" class="w-full border border-white/10 rounded-lg px-3 py-2 h-24" placeholder="A cramped detective apartment...">${loc?.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Lighting</label>
        <select id="loc-lighting" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.lighting.map(l => `<option ${loc?.lighting === l ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
    </div>
  `, () => saveLocation(loc?.id));
}

function saveLocation(existingId = null) {
  const locData = {
    id: existingId || Date.now().toString(),
    projectId: state.currentProject,
    name: document.getElementById('loc-name').value,
    type: document.getElementById('loc-type').value,
    timeOfDay: document.getElementById('loc-time').value,
    mood: document.getElementById('loc-mood').value,
    description: document.getElementById('loc-desc').value,
    lighting: document.getElementById('loc-lighting').value,
    createdAt: new Date().toISOString()
  };
  
  if (existingId) {
    const idx = state.locations.findIndex(l => l.id === existingId);
    if (idx >= 0) state.locations[idx] = locData;
  } else {
    state.locations.push(locData);
  }
  
  saveState();
  hideModal();
  renderPage();
}

function deleteLocation(id) {
  if (confirm('Delete this location?')) {
    state.locations = state.locations.filter(l => l.id !== id);
    saveState();
    renderPage();
  }
}

function generateLocPrompt(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  
  const prompt = `${loc.type}: ${loc.name}, ${loc.description}, ${loc.timeOfDay}, ${loc.mood} atmosphere, ${loc.lighting} lighting, cinematic wide shot`;
  navigator.clipboard.writeText(prompt);
  alert('Location prompt copied to clipboard!');
}


// ============ OPAL LINKS ============
function saveOpalLink(appId, link) {
  state.opalLinks[appId] = link;
  saveState();
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
  const filtered = state.history.filter(h => !state.currentProject || h.projectId === state.currentProject);
  
  list.innerHTML = filtered.length === 0 ? 
    '<p class="text-gray-500 text-sm p-4">No history yet</p>' :
    filtered.map(h => `
      <div class="glass rounded-xl p-3 mb-2 cursor-pointer hover:border-purple-500/30 transition-all" onclick="copyHistoryPrompt('${h.id}')">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs">${findApp(h.appId)?.icon || '📝'}</span>
          <span class="text-xs text-gray-400">${h.appName}</span>
        </div>
        <p class="text-sm line-clamp-3">${h.prompt.substring(0, 150)}...</p>
        <div class="text-xs text-gray-500 mt-2">${new Date(h.timestamp).toLocaleString()}</div>
      </div>
    `).join('');
}

function copyHistoryPrompt(id) {
  const entry = state.history.find(h => h.id === id);
  if (entry) {
    navigator.clipboard.writeText(entry.prompt);
    alert('Prompt copied!');
  }
}

// ============ MODALS ============
function showModal(title, content, onSave) {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onclick="hideModal()">
      <div class="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto" onclick="event.stopPropagation()">
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 class="font-semibold">${title}</h3>
          <button onclick="hideModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>
        <div class="p-4">
          ${content}
        </div>
        <div class="p-4 border-t border-white/10 flex justify-end gap-2">
          <button onclick="hideModal()" class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">Cancel</button>
          <button onclick="window._modalSave()" class="btn-primary px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  `;
  window._modalSave = onSave;
}

function hideModal() {
  document.getElementById('modal-container').innerHTML = '';
}

function showSettingsModal() {
  showModal('Settings', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Default Style</label>
        <select id="setting-style" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.styles.map(s => `<option>${s}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Default Aspect Ratio</label>
        <select id="setting-aspect" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.aspectRatio.map(a => `<option>${a}</option>`).join('')}
        </select>
      </div>
      <div class="pt-4 border-t border-white/10">
        <button onclick="clearAllData()" class="text-red-400 text-sm hover:text-red-300">Clear All Data</button>
      </div>
    </div>
  `, hideModal);
}

function clearAllData() {
  if (confirm('This will delete ALL your data. Are you sure?')) {
    localStorage.clear();
    location.reload();
  }
}

// ============ UTILITY ============
function useCharacter() {
  const chars = state.characters.filter(c => !state.currentProject || c.projectId === state.currentProject);
  if (chars.length === 0) {
    alert('No characters created yet. Go to Characters to create one.');
    return;
  }
  
  showModal('Select Character', `
    <div class="space-y-2 max-h-60 overflow-auto">
      ${chars.map(c => `
        <div class="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all" onclick="insertCharacter('${c.id}')">
          <div class="font-medium">${c.name}</div>
          <div class="text-sm text-gray-400">${c.role} • ${c.age}</div>
        </div>
      `).join('')}
    </div>
  `, hideModal);
}

function insertCharacter(id) {
  const char = state.characters.find(c => c.id === id);
  if (!char) return;
  
  const desc = `${char.age} ${char.gender}, ${char.physical}, wearing ${char.costume}`;
  
  // Try to find a subject/description field
  const fields = ['input-subject', 'input-description', 'input-physical', 'input-shotDesc'];
  for (const fieldId of fields) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = desc;
      break;
    }
  }
  
  hideModal();
}

function useLocation() {
  const locs = state.locations.filter(l => !state.currentProject || l.projectId === state.currentProject);
  if (locs.length === 0) {
    alert('No locations created yet. Go to Locations to create one.');
    return;
  }
  
  showModal('Select Location', `
    <div class="space-y-2 max-h-60 overflow-auto">
      ${locs.map(l => `
        <div class="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all" onclick="insertLocation('${l.id}')">
          <div class="font-medium">${l.name}</div>
          <div class="text-sm text-gray-400">${l.type} • ${l.mood}</div>
        </div>
      `).join('')}
    </div>
  `, hideModal);
}

function insertLocation(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  
  const desc = `${loc.type}: ${loc.description}`;
  
  const fields = ['input-subject', 'input-description', 'input-location', 'input-shotDesc'];
  for (const fieldId of fields) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = desc;
      break;
    }
  }
  
  hideModal();
}

function autoSaveForm() {
  // Auto-generate prompt on any change
  generatePrompt();
}

// ============ ENHANCED FUNCTIONS ============

// Update history count in header
function updateHistoryCount() {
  const count = document.getElementById('history-count');
  if (count) count.textContent = state.history.length;
}

// Clear form
function clearForm() {
  const form = document.getElementById('app-form');
  if (form) {
    form.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
    document.getElementById('prompt-output').innerHTML = '<span class="text-gray-500 italic">Fill in the options above. Prompt will auto-generate...</span>';
  }
}

// Copy and open Opal
function copyAndOpenOpal() {
  const prompt = document.getElementById('prompt-output').textContent;
  if (prompt && !prompt.includes('Fill in the options')) {
    navigator.clipboard.writeText(prompt);
    if (state.opalLinks[state.currentApp]) {
      window.open(state.opalLinks[state.currentApp], '_blank');
    } else {
      window.open('https://opal.google', '_blank');
    }
    alert('Prompt copied! Paste it in the Opal app.');
  } else {
    alert('Please generate a prompt first.');
  }
}

// Quick insert character
function quickInsertCharacter(id) {
  const char = state.characters.find(c => c.id === id);
  if (!char) return;
  
  const desc = `${char.age} ${char.gender}, ${char.physical}, wearing ${char.costume}`;
  
  // Find the best field to insert into
  const fields = ['input-subject', 'input-description', 'input-physical', 'input-shotDesc', 'input-concept'];
  for (const fieldId of fields) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = desc;
      autoSaveForm();
      break;
    }
  }
}

// Quick insert location
function quickInsertLocation(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  
  const desc = `${loc.type}: ${loc.description}`;
  
  const fields = ['input-subject', 'input-description', 'input-location', 'input-shotDesc', 'input-concept'];
  for (const fieldId of fields) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = desc;
      autoSaveForm();
      break;
    }
  }
}

// Edit project
function editProject(id) {
  const project = state.projects.find(p => p.id === id);
  if (!project) return;
  
  showModal('Edit Project', `
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Project Name</label>
        <input type="text" id="edit-project-name" value="${project.name}" class="w-full border border-white/10 rounded-lg px-3 py-2">
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Type</label>
        <select id="edit-project-type" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.projectType.map(t => `<option ${project.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Genre</label>
        <select id="edit-project-genre" class="w-full border border-white/10 rounded-lg px-3 py-2">
          ${OPTIONS.genre.map(g => `<option ${project.genre === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Description</label>
        <textarea id="edit-project-desc" class="w-full border border-white/10 rounded-lg px-3 py-2 h-20">${project.description || ''}</textarea>
      </div>
      <div class="pt-4 border-t border-white/10">
        <button onclick="deleteProject('${id}')" class="text-red-400 text-sm hover:text-red-300">Delete Project</button>
      </div>
    </div>
  `, () => {
    project.name = document.getElementById('edit-project-name').value;
    project.type = document.getElementById('edit-project-type').value;
    project.genre = document.getElementById('edit-project-genre').value;
    project.description = document.getElementById('edit-project-desc').value;
    saveState();
    hideModal();
    renderPage();
  });
}

// Delete project
function deleteProject(id) {
  if (confirm('Delete this project and all its data?')) {
    state.projects = state.projects.filter(p => p.id !== id);
    state.characters = state.characters.filter(c => c.projectId !== id);
    state.locations = state.locations.filter(l => l.projectId !== id);
    state.history = state.history.filter(h => h.projectId !== id);
    if (state.currentProject === id) state.currentProject = null;
    saveState();
    hideModal();
    updateProjectSelector();
    renderPage();
  }
}

function useCharacterInApp(id) {
  const char = state.characters.find(c => c.id === id);
  if (!char) return;
  navigateTo('app', '03');
  setTimeout(() => {
    document.getElementById('input-name').value = char.name;
    document.getElementById('input-physical').value = char.physical;
    document.getElementById('input-costume').value = char.costume;
    document.getElementById('input-personality').value = char.personality;
  }, 100);
}

function useLocationInApp(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  navigateTo('app', '04');
  setTimeout(() => {
    document.getElementById('input-locationName').value = loc.name;
    document.getElementById('input-description').value = loc.description;
  }, 100);
}
