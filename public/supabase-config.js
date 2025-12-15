// Supabase Configuration
const SUPABASE_URL = 'https://gqinziavjwglevgdntlw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaW56aWF2andnbGV2Z2RudGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODE2OTAsImV4cCI6MjA4MTM1NzY5MH0.CnDHukxlPrBX64GdRcSJ1WyXIj-EpPsgcQZD_P765wQ';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ AUTH FUNCTIONS ============
const Auth = {
  // Get current user
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Sign up with email
  async signUpEmail(email, password, fullName) {
    // Get the correct redirect URL for email confirmation
    const redirectUrl = window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://amaizingfilm.netlify.app';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign in with email
  async signInEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign in with Google
  async signInGoogle() {
    // Get the correct redirect URL (production or local)
    const redirectUrl = window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://amaizingfilm.netlify.app';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// ============ DATABASE FUNCTIONS ============
const DB = {
  // ---- PROJECTS ----
  async getProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- CHARACTERS ----
  async getCharacters(userId, projectId = null) {
    let query = supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createCharacter(character) {
    const { data, error } = await supabase
      .from('characters')
      .insert([character])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCharacter(id, updates) {
    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCharacter(id) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- LOCATIONS ----
  async getLocations(userId, projectId = null) {
    let query = supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createLocation(location) {
    const { data, error } = await supabase
      .from('locations')
      .insert([location])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateLocation(id, updates) {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteLocation(id) {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- HISTORY ----
  async getHistory(userId, projectId = null, appId = null) {
    let query = supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) query = query.eq('project_id', projectId);
    if (appId) query = query.eq('app_id', appId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createHistory(historyItem) {
    const { data, error } = await supabase
      .from('history')
      .insert([historyItem])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteHistory(id) {
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- SCRIPTS ----
  async getScripts(userId, projectId = null) {
    let query = supabase
      .from('scripts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) query = query.eq('project_id', projectId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createScript(script) {
    const { data, error } = await supabase
      .from('scripts')
      .insert([script])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateScript(id, updates) {
    const { data, error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteScript(id) {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- STORYBOARDS ----
  async getStoryboards(userId, projectId = null) {
    let query = supabase
      .from('storyboards')
      .select('*')
      .eq('user_id', userId)
      .order('scene_number', { ascending: true });
    
    if (projectId) query = query.eq('project_id', projectId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createStoryboard(storyboard) {
    const { data, error } = await supabase
      .from('storyboards')
      .insert([storyboard])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStoryboard(id, updates) {
    const { data, error } = await supabase
      .from('storyboards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStoryboard(id) {
    const { error } = await supabase
      .from('storyboards')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- OPAL LINKS (User's personal links) ----
  async getOpalLinks(userId) {
    const { data, error } = await supabase
      .from('opal_links')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async upsertOpalLink(userId, appId, url) {
    const { data, error } = await supabase
      .from('opal_links')
      .upsert([{ user_id: userId, app_id: appId, url }], { onConflict: 'user_id,app_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ---- GLOBAL OPAL LINKS (Admin-managed, visible to all) ----
  async getGlobalOpalLinks() {
    const { data, error } = await supabase
      .from('global_opal_links')
      .select('*')
      .eq('is_active', true);
    if (error) {
      console.warn('Global opal links table may not exist yet:', error.message);
      return [];
    }
    return data || [];
  },

  async upsertGlobalOpalLink(appId, url, userId) {
    const { data, error } = await supabase
      .from('global_opal_links')
      .upsert([{ app_id: appId, url, is_active: true, created_by: userId }], { onConflict: 'app_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteGlobalOpalLink(appId) {
    const { error } = await supabase
      .from('global_opal_links')
      .delete()
      .eq('app_id', appId);
    if (error) throw error;
  },

  // ---- USER ROLES ----
  async getUserRole(userId) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    if (error) {
      // If no role found, user is regular user
      if (error.code === 'PGRST116') return 'user';
      console.warn('User roles table may not exist yet:', error.message);
      return 'user';
    }
    return data?.role || 'user';
  },

  async setUserRole(userId, role) {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert([{ user_id: userId, role }], { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ---- GENERATED ASSETS ----
  async getGeneratedAssets(userId, projectId = null) {
    let query = supabase
      .from('generated_assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) query = query.eq('project_id', projectId);
    
    const { data, error } = await query;
    if (error) {
      console.warn('Generated assets table may not exist yet:', error.message);
      return [];
    }
    return data || [];
  },

  async createGeneratedAsset(asset) {
    const { data, error } = await supabase
      .from('generated_assets')
      .insert([asset])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteGeneratedAsset(id) {
    const { error } = await supabase
      .from('generated_assets')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---- CHARACTER VARIANTS ----
  async getCharacterVariants(characterId) {
    const { data, error } = await supabase
      .from('character_variants')
      .select('*')
      .eq('character_id', characterId)
      .order('variant_number', { ascending: true });
    if (error) {
      console.warn('Character variants table may not exist yet:', error.message);
      return [];
    }
    return data || [];
  },

  async createCharacterVariant(variant) {
    const { data, error } = await supabase
      .from('character_variants')
      .insert([variant])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async selectCharacterVariant(characterId, variantId) {
    // First, unselect all variants for this character
    await supabase
      .from('character_variants')
      .update({ is_selected: false })
      .eq('character_id', characterId);
    
    // Then select the chosen one
    const { data, error } = await supabase
      .from('character_variants')
      .update({ is_selected: true })
      .eq('id', variantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

console.log('✅ Supabase initialized');
