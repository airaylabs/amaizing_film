// raymAIzing film - Database Operations
// Celtx-Style Project Management with Content Storage

// Get supabase client - returns client or null
function getSupabaseClient() {
  return window.supabaseClient || null;
}

// Create supabase proxy that handles missing client gracefully
const supabase = {
  from: function(table) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn('Supabase not ready, operation will use localStorage fallback');
      // Return a mock that resolves with empty data
      const mockChain = {
        select: () => mockChain,
        insert: () => mockChain,
        update: () => mockChain,
        delete: () => mockChain,
        upsert: () => mockChain,
        eq: () => mockChain,
        order: () => mockChain,
        limit: () => mockChain,
        single: () => Promise.resolve({ data: null, error: { message: 'DB not connected', code: 'NO_CLIENT' } }),
        then: (resolve) => resolve({ data: null, error: { message: 'DB not connected', code: 'NO_CLIENT' } })
      };
      return mockChain;
    }
    return client.from(table);
  }
};

// ============ DATABASE OPERATIONS ============
const DB = {
  // Helper to check if DB is ready
  isReady() {
    return !!getSupabaseClient();
  },

  // ============ PROJECTS ============
  async getProjects(userId) {
    if (!this.isReady()) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      return projects.filter(p => p.user_id === userId);
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error && error.code !== 'NO_CLIENT') throw error;
    return data || [];
  },

  async getProject(projectId) {
    if (!this.isReady()) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      return projects.find(p => p.id === projectId);
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    if (error && error.code !== 'NO_CLIENT') throw error;
    return data;
  },

  async createProject(project) {
    if (!this.isReady()) {
      // Fallback to localStorage
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const newProject = {
        ...project,
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      projects.unshift(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));
      return newProject;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(projectId, updates) {
    if (!this.isReady()) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const idx = projects.findIndex(p => p.id === projectId);
      if (idx >= 0) {
        projects[idx] = { ...projects[idx], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem('projects', JSON.stringify(projects));
        return projects[idx];
      }
      return null;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(projectId) {
    if (!this.isReady()) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const filtered = projects.filter(p => p.id !== projectId);
      localStorage.setItem('projects', JSON.stringify(filtered));
      return true;
    }
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
    return true;
  },

  // ============ PRODUCTION BIBLE ============
  async getBible(projectId) {
    const { data, error } = await supabase
      .from('production_bibles')
      .select('*')
      .eq('project_id', projectId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async saveBible(projectId, userId, bibleData) {
    const { data: existing } = await supabase
      .from('production_bibles')
      .select('id')
      .eq('project_id', projectId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('production_bibles')
        .update(bibleData)
        .eq('project_id', projectId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('production_bibles')
        .insert({ ...bibleData, project_id: projectId, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // ============ CHARACTERS ============
  async getCharacters(userId, projectId = null) {
    let query = supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
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
      .insert(character)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCharacter(characterId, updates) {
    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', characterId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCharacter(characterId) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId);
    if (error) throw error;
    return true;
  },

  // ============ LOCATIONS ============
  async getLocations(userId, projectId = null) {
    let query = supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
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
      .insert(location)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateLocation(locationId, updates) {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', locationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteLocation(locationId) {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', locationId);
    if (error) throw error;
    return true;
  },

  // ============ EPISODES ============
  async getEpisodes(projectId) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('project_id', projectId)
      .order('episode_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createEpisode(episode) {
    const { data, error } = await supabase
      .from('episodes')
      .insert(episode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateEpisode(episodeId, updates) {
    const { data, error } = await supabase
      .from('episodes')
      .update(updates)
      .eq('id', episodeId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteEpisode(episodeId) {
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', episodeId);
    if (error) throw error;
    return true;
  },

  // ============ SCENES ============
  async getScenes(projectId, episodeId = null) {
    let query = supabase
      .from('scenes')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
    
    if (episodeId) {
      query = query.eq('episode_id', episodeId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createScene(scene) {
    const { data, error } = await supabase
      .from('scenes')
      .insert(scene)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateScene(sceneId, updates) {
    const { data, error } = await supabase
      .from('scenes')
      .update(updates)
      .eq('id', sceneId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteScene(sceneId) {
    const { error } = await supabase
      .from('scenes')
      .delete()
      .eq('id', sceneId);
    if (error) throw error;
    return true;
  },

  // ============ STORYBOARD FRAMES ============
  async getStoryboardFrames(sceneId) {
    const { data, error } = await supabase
      .from('storyboard_frames')
      .select('*')
      .eq('scene_id', sceneId)
      .order('frame_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createStoryboardFrame(frame) {
    const { data, error } = await supabase
      .from('storyboard_frames')
      .insert(frame)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStoryboardFrame(frameId, updates) {
    const { data, error } = await supabase
      .from('storyboard_frames')
      .update(updates)
      .eq('id', frameId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStoryboardFrame(frameId) {
    const { error } = await supabase
      .from('storyboard_frames')
      .delete()
      .eq('id', frameId);
    if (error) throw error;
    return true;
  },

  // ============ GENERATED ASSETS ============
  async getGeneratedAssets(userId, projectId = null, filters = {}) {
    let query = supabase
      .from('generated_assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (filters.assetType) {
      query = query.eq('asset_type', filters.assetType);
    }
    if (filters.toolUsed) {
      query = query.eq('tool_used', filters.toolUsed);
    }
    if (filters.isFavorite) {
      query = query.eq('is_favorite', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createAsset(asset) {
    const { data, error } = await supabase
      .from('generated_assets')
      .insert(asset)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateAsset(assetId, updates) {
    const { data, error } = await supabase
      .from('generated_assets')
      .update(updates)
      .eq('id', assetId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAsset(assetId) {
    const { error } = await supabase
      .from('generated_assets')
      .delete()
      .eq('id', assetId);
    if (error) throw error;
    return true;
  },

  async toggleAssetFavorite(assetId, isFavorite) {
    return this.updateAsset(assetId, { is_favorite: isFavorite });
  },

  // ============ WORKFLOW PROGRESS ============
  async getWorkflowProgress(projectId) {
    const { data, error } = await supabase
      .from('workflow_progress')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data || [];
  },

  async getToolProgress(projectId, toolId) {
    const { data, error } = await supabase
      .from('workflow_progress')
      .select('*')
      .eq('project_id', projectId)
      .eq('tool_id', toolId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async saveToolProgress(projectId, userId, toolId, phaseId, progressData) {
    const { data: existing } = await supabase
      .from('workflow_progress')
      .select('id')
      .eq('project_id', projectId)
      .eq('tool_id', toolId)
      .single();

    const payload = {
      project_id: projectId,
      user_id: userId,
      tool_id: toolId,
      phase_id: phaseId,
      ...progressData
    };

    if (existing) {
      const { data, error } = await supabase
        .from('workflow_progress')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('workflow_progress')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async markToolCompleted(projectId, userId, toolId, phaseId) {
    return this.saveToolProgress(projectId, userId, toolId, phaseId, {
      is_completed: true,
      completed_at: new Date().toISOString()
    });
  },

  async markToolIncomplete(projectId, toolId) {
    const { data, error } = await supabase
      .from('workflow_progress')
      .update({ is_completed: false, completed_at: null })
      .eq('project_id', projectId)
      .eq('tool_id', toolId)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // ============ PROMPT HISTORY ============
  async getHistory(userId, projectId = null, toolId = null) {
    let query = supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (toolId) {
      query = query.eq('tool_id', toolId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async saveToHistory(historyEntry) {
    const { data, error } = await supabase
      .from('prompt_history')
      .insert(historyEntry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteHistory(historyId) {
    const { error } = await supabase
      .from('prompt_history')
      .delete()
      .eq('id', historyId);
    if (error) throw error;
    return true;
  },

  async toggleHistoryFavorite(historyId, isFavorite) {
    const { data, error } = await supabase
      .from('prompt_history')
      .update({ is_favorite: isFavorite })
      .eq('id', historyId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ============ OPAL LINKS ============
  async getOpalLinks(userId) {
    const { data, error } = await supabase
      .from('opal_links')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async saveOpalLink(userId, appId, url) {
    const { data: existing } = await supabase
      .from('opal_links')
      .select('id')
      .eq('user_id', userId)
      .eq('app_id', appId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('opal_links')
        .update({ url })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('opal_links')
        .insert({ user_id: userId, app_id: appId, url })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async deleteOpalLink(userId, appId) {
    const { error } = await supabase
      .from('opal_links')
      .delete()
      .eq('user_id', userId)
      .eq('app_id', appId);
    if (error) throw error;
    return true;
  },

  // ============ GLOBAL OPAL LINKS (Admin) ============
  async getGlobalOpalLinks() {
    const { data, error } = await supabase
      .from('global_opal_links')
      .select('*')
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  },

  async setGlobalOpalLink(appId, url) {
    const { data: existing } = await supabase
      .from('global_opal_links')
      .select('id')
      .eq('app_id', appId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('global_opal_links')
        .update({ url, is_active: true })
        .eq('app_id', appId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('global_opal_links')
        .insert({ app_id: appId, url })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // ============ USER ROLES ============
  async getUserRole(userId) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.role || 'user';
  },

  async setUserRole(userId, role) {
    const { data: existing } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // ============ USER PREFERENCES ============
  async getUserPreferences(userId) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async saveUserPreferences(userId, preferences) {
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({ user_id: userId, ...preferences })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // ============ SCENE CHARACTERS ============
  async getSceneCharacters(sceneId) {
    const { data, error } = await supabase
      .from('scene_characters')
      .select('*, character:characters(*)')
      .eq('scene_id', sceneId);
    if (error) throw error;
    return data || [];
  },

  async addCharacterToScene(sceneId, characterId) {
    const { data, error } = await supabase
      .from('scene_characters')
      .insert({ scene_id: sceneId, character_id: characterId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeCharacterFromScene(sceneId, characterId) {
    const { error } = await supabase
      .from('scene_characters')
      .delete()
      .eq('scene_id', sceneId)
      .eq('character_id', characterId);
    if (error) throw error;
    return true;
  },

  // ============ COMMENTS ============
  async getComments(referenceType, referenceId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('reference_type', referenceType)
      .eq('reference_id', referenceId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createComment(comment) {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (error) throw error;
    return true;
  },

  async resolveComment(commentId, userId) {
    const { data, error } = await supabase
      .from('comments')
      .update({ 
        is_resolved: true, 
        resolved_at: new Date().toISOString(),
        resolved_by: userId 
      })
      .eq('id', commentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ============ VIRAL CLIPS ============
  async getViralClips(projectId) {
    const { data, error } = await supabase
      .from('viral_clips')
      .select('*')
      .eq('project_id', projectId)
      .order('viral_score', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createViralClip(clip) {
    const { data, error } = await supabase
      .from('viral_clips')
      .insert(clip)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateViralClip(clipId, updates) {
    const { data, error } = await supabase
      .from('viral_clips')
      .update(updates)
      .eq('id', clipId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteViralClip(clipId) {
    const { error } = await supabase
      .from('viral_clips')
      .delete()
      .eq('id', clipId);
    if (error) throw error;
    return true;
  },

  // ============ AGGREGATE QUERIES ============
  async getProjectOverview(projectId) {
    const [
      project,
      bible,
      characters,
      locations,
      episodes,
      scenes,
      assets,
      progress
    ] = await Promise.all([
      this.getProject(projectId),
      this.getBible(projectId),
      supabase.from('characters').select('*').eq('project_id', projectId).then(r => r.data || []),
      supabase.from('locations').select('*').eq('project_id', projectId).then(r => r.data || []),
      this.getEpisodes(projectId),
      this.getScenes(projectId),
      supabase.from('generated_assets').select('*').eq('project_id', projectId).then(r => r.data || []),
      this.getWorkflowProgress(projectId)
    ]);

    return {
      project,
      bible,
      characters,
      locations,
      episodes,
      scenes,
      assets,
      progress,
      stats: {
        characterCount: characters.length,
        locationCount: locations.length,
        episodeCount: episodes.length,
        sceneCount: scenes.length,
        assetCount: assets.length,
        completedSteps: progress.filter(p => p.is_completed).length,
        totalSteps: 32
      }
    };
  },

  // ============ HISTORY ============
  async getHistory(userId, projectId = null) {
    try {
      let query = supabase.from('prompt_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('History table may not exist:', error);
      return [];
    }
  },

  async saveToHistory(entry) {
    try {
      const { data, error } = await supabase.from('prompt_history')
        .insert(entry)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Could not save to history:', error);
      throw error;
    }
  },

  async deleteHistory(historyId) {
    try {
      const { error } = await supabase.from('prompt_history')
        .delete()
        .eq('id', historyId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.warn('Could not delete history:', error);
      throw error;
    }
  },

  // ============ TOOL PROGRESS ============
  async markToolCompleted(projectId, userId, toolId, phaseId) {
    try {
      const { data, error } = await supabase.from('workflow_progress')
        .upsert({
          project_id: projectId,
          user_id: userId,
          tool_id: toolId,
          phase_id: phaseId,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, { onConflict: 'project_id,tool_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Could not mark tool completed:', error);
      throw error;
    }
  },

  // ============ SAVE TOOL PROGRESS ============
  async saveToolProgress(projectId, userId, toolId, phaseId, data) {
    try {
      const { data: result, error } = await supabase.from('workflow_progress')
        .upsert({
          project_id: projectId,
          user_id: userId,
          tool_id: toolId,
          phase_id: phaseId,
          ...data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'project_id,tool_id' })
        .select()
        .single();
      if (error) throw error;
      return result;
    } catch (error) {
      console.warn('Could not save tool progress:', error);
      throw error;
    }
  },

  // ============ GLOBAL OPAL LINKS ============
  async getGlobalOpalLinks() {
    try {
      const { data, error } = await supabase.from('global_opal_links')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Could not get global opal links:', error);
      return [];
    }
  },

  async setGlobalOpalLink(appId, url) {
    try {
      const { data, error } = await supabase.from('global_opal_links')
        .upsert({
          app_id: appId,
          url: url,
          updated_at: new Date().toISOString()
        }, { onConflict: 'app_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Could not set global opal link:', error);
      throw error;
    }
  }
};
