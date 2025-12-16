// raymAIzing film - Multi-language Support
// Supports: Indonesian (id) & English (en)

const LANG = {
  // ============ INDONESIAN ============
  id: {
    // General
    appName: 'raymAIzing film',
    tagline: 'Platform Produksi Film AI Terintegrasi',
    dashboard: 'Dashboard',
    settings: 'Pengaturan',
    logout: 'Keluar',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    copy: 'Salin',
    copied: 'Tersalin!',
    loading: 'Memuat...',
    
    // Auth
    login: 'Masuk',
    signup: 'Daftar',
    email: 'Email',
    password: 'Kata Sandi',
    name: 'Nama',
    loginWithGoogle: 'Masuk dengan Google',
    forgotPassword: 'Lupa kata sandi?',
    noAccount: 'Belum punya akun?',
    hasAccount: 'Sudah punya akun?',
    
    // Workflow
    workflowTitle: '🎯 Panduan Langkah Produksi',
    workflowSubtitle: 'Ikuti langkah-langkah ini untuk membuat film',
    stepOf: 'Langkah {current} dari {total}',
    progress: 'Progress',
    complete: 'Selesai',
    start: 'Mulai',
    next: 'Lanjut',
    previous: 'Kembali',
    skip: 'Lewati',
    required: 'Wajib',
    optional: 'Opsional',
    locked: 'Terkunci',
    markDone: 'Tandai Selesai',
    
    // Steps
    step1Name: 'Cari Ide',
    step1Desc: 'Temukan ide cerita dari trend viral atau generate ide baru',
    step2Name: 'Tulis Synopsis',
    step2Desc: 'Tulis cerita lengkap - data akan mengisi semua tools otomatis',
    step3Name: 'Breakdown',
    step3Desc: 'Pecah cerita jadi episode dan scene',
    step4Name: 'Pre-Production',
    step4Desc: 'Design karakter, lokasi, dan storyboard',
    step5Name: 'Produksi Visual',
    step5Desc: 'Generate gambar dan video untuk setiap scene',
    step6Name: 'Produksi Audio',
    step6Desc: 'Generate dialog, musik, dan sound effect',
    step7Name: 'Post-Production',
    step7Desc: 'Edit dan pilih momen viral',
    step8Name: 'Publish',
    step8Desc: 'Buat thumbnail, poster, dan trailer',
    
    // Production Bible
    bibleTitle: 'Production Bible',
    bibleActive: 'Bible Aktif',
    bibleEmpty: 'Belum ada Production Bible',
    bibleStart: 'Mulai dengan menulis Synopsis',
    bibleStartDesc: 'Synopsis akan mengisi otomatis semua tools produksi',
    createBible: 'Buat Production Bible',
    editBible: 'Edit Synopsis',
    clearBible: 'Reset Bible',
    
    // Form
    generatePrompt: 'Generate Prompt',
    clearForm: 'Hapus Form',
    autoFill: 'Isi Otomatis',
    selectEpisode: 'Pilih Episode',
    selectScene: 'Pilih Scene',
    selectCharacter: 'Pilih Karakter',
    selectLocation: 'Pilih Lokasi',
    
    // Actions
    openInOpal: 'Buka di Opal',
    copyPrompt: 'Salin Prompt',
    saveHistory: 'Simpan ke History',
    copyAndOpen: 'Salin & Buka Opal',
    
    // Messages
    promptGenerated: 'Prompt berhasil di-generate!',
    savedToHistory: 'Tersimpan ke history!',
    bibleSaved: 'Production Bible tersimpan!',
    bibleCleared: 'Production Bible dihapus',
    stepCompleted: 'Langkah selesai!',
    
    // Help
    helpTitle: 'Bantuan',
    helpWorkflow: 'Cara Menggunakan',
    helpTip: 'Tips',
    
    // Project
    newProject: 'Project Baru',
    projectName: 'Nama Project',
    projectType: 'Tipe',
    projectGenre: 'Genre',
    projectDesc: 'Deskripsi',
    allProjects: 'Semua Project',
    
    // Assets
    assets: 'Aset',
    characters: 'Karakter',
    locations: 'Lokasi',
    history: 'History',
    phases: 'Fase Produksi',
    
    // Output
    outputCount: 'Jumlah Output',
    variations: 'variasi',
    
    // Quick Actions
    quickActions: 'Aksi Cepat',
    ready: 'siap',
    showMore: 'Tampilkan lebih',
    showLess: 'Tampilkan sedikit',
    
    // Status
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    configured: 'Terkonfigurasi',
    notConfigured: 'Belum Dikonfigurasi'
  },
  
  // ============ ENGLISH ============
  en: {
    // General
    appName: 'raymAIzing film',
    tagline: 'Integrated AI Film Production Platform',
    dashboard: 'Dashboard',
    settings: 'Settings',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    copy: 'Copy',
    copied: 'Copied!',
    loading: 'Loading...',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    loginWithGoogle: 'Login with Google',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    
    // Workflow
    workflowTitle: '🎯 Production Guide',
    workflowSubtitle: 'Follow these steps to create your film',
    stepOf: 'Step {current} of {total}',
    progress: 'Progress',
    complete: 'Complete',
    start: 'Start',
    next: 'Next',
    previous: 'Back',
    skip: 'Skip',
    required: 'Required',
    optional: 'Optional',
    locked: 'Locked',
    markDone: 'Mark as Done',
    
    // Steps
    step1Name: 'Find Ideas',
    step1Desc: 'Discover story ideas from viral trends or generate new ones',
    step2Name: 'Write Synopsis',
    step2Desc: 'Write your full story - data will auto-fill all tools',
    step3Name: 'Breakdown',
    step3Desc: 'Split story into episodes and scenes',
    step4Name: 'Pre-Production',
    step4Desc: 'Design characters, locations, and storyboards',
    step5Name: 'Visual Production',
    step5Desc: 'Generate images and videos for each scene',
    step6Name: 'Audio Production',
    step6Desc: 'Generate dialogue, music, and sound effects',
    step7Name: 'Post-Production',
    step7Desc: 'Edit and pick viral moments',
    step8Name: 'Publish',
    step8Desc: 'Create thumbnails, posters, and trailers',
    
    // Production Bible
    bibleTitle: 'Production Bible',
    bibleActive: 'Bible Active',
    bibleEmpty: 'No Production Bible yet',
    bibleStart: 'Start by writing your Synopsis',
    bibleStartDesc: 'Synopsis will auto-fill all production tools',
    createBible: 'Create Production Bible',
    editBible: 'Edit Synopsis',
    clearBible: 'Reset Bible',
    
    // Form
    generatePrompt: 'Generate Prompt',
    clearForm: 'Clear Form',
    autoFill: 'Auto-Fill',
    selectEpisode: 'Select Episode',
    selectScene: 'Select Scene',
    selectCharacter: 'Select Character',
    selectLocation: 'Select Location',
    
    // Actions
    openInOpal: 'Open in Opal',
    copyPrompt: 'Copy Prompt',
    saveHistory: 'Save to History',
    copyAndOpen: 'Copy & Open Opal',
    
    // Messages
    promptGenerated: 'Prompt generated successfully!',
    savedToHistory: 'Saved to history!',
    bibleSaved: 'Production Bible saved!',
    bibleCleared: 'Production Bible cleared',
    stepCompleted: 'Step completed!',
    
    // Help
    helpTitle: 'Help',
    helpWorkflow: 'How to Use',
    helpTip: 'Tip',
    
    // Project
    newProject: 'New Project',
    projectName: 'Project Name',
    projectType: 'Type',
    projectGenre: 'Genre',
    projectDesc: 'Description',
    allProjects: 'All Projects',
    
    // Assets
    assets: 'Assets',
    characters: 'Characters',
    locations: 'Locations',
    history: 'History',
    phases: 'Production Phases',
    
    // Output
    outputCount: 'Output Count',
    variations: 'variations',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    ready: 'ready',
    showMore: 'Show more',
    showLess: 'Show less',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    configured: 'Configured',
    notConfigured: 'Not Configured'
  }
};

// Current language (default: Indonesian)
let currentLang = localStorage.getItem('lang') || 'id';

// Get translation
function t(key) {
  return LANG[currentLang][key] || LANG['en'][key] || key;
}

// Switch language
function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  // Re-render UI
  if (typeof renderPage === 'function') {
    renderSidebar();
    renderPage();
  }
}

// Get current language
function getLang() {
  return currentLang;
}
