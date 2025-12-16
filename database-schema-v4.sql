-- raymAIzing film - Database Schema v4
-- Celtx-Style Production Management System
-- COMPLETE REDESIGN: Project-based, Content Storage, Comments, Proper Workflow

-- ============ CORE: PROJECTS TABLE (Enhanced) ============
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  type TEXT, -- Short Film, Feature, Web Series, etc.
  genre TEXT,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, in_progress, completed, archived
  current_phase TEXT DEFAULT 'ideation', -- ideation, story, preproduction, production, post, distribution
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ PRODUCTION BIBLE (Per Project) ============
CREATE TABLE IF NOT EXISTS production_bibles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core Story Data
  title TEXT,
  logline TEXT,
  synopsis TEXT,
  genre TEXT,
  project_type TEXT,
  visual_style TEXT,
  mood TEXT,
  setting TEXT,
  themes TEXT,
  target_audience TEXT,
  episode_count INTEGER DEFAULT 1,
  episode_length TEXT,
  
  -- AI-Generated Summaries
  tagline TEXT,
  poster_concept TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ CHARACTERS (Per Project) ============
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  role TEXT, -- Protagonist, Antagonist, Supporting, etc.
  
  -- Physical Description (for AI image generation)
  age TEXT,
  gender TEXT,
  physical_description TEXT,
  costume_description TEXT,
  
  -- Character Details
  personality TEXT,
  backstory TEXT,
  motivation TEXT,
  arc_start TEXT,
  arc_end TEXT,
  relationships TEXT,
  
  -- Visual Reference
  reference_image_url TEXT,
  generated_image_url TEXT,
  
  -- Voice (for audio generation)
  voice_type TEXT,
  accent TEXT,
  speaking_style TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ LOCATIONS (Per Project) ============
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  location_type TEXT, -- INT/EXT, Urban, Nature, etc.
  
  -- Visual Description
  description TEXT,
  time_of_day TEXT,
  weather TEXT,
  lighting TEXT,
  mood TEXT,
  
  -- Visual Reference
  reference_image_url TEXT,
  generated_image_url TEXT,
  
  -- Props & Details
  key_props TEXT,
  atmosphere TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ EPISODES (Per Project) ============
CREATE TABLE IF NOT EXISTS episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  episode_number INTEGER NOT NULL,
  title TEXT,
  synopsis TEXT,
  duration TEXT,
  
  -- Story Structure
  cold_open TEXT,
  act_1 TEXT,
  act_2 TEXT,
  act_3 TEXT,
  cliffhanger TEXT,
  
  -- Focus
  focus_character_id UUID REFERENCES characters(id),
  main_conflict TEXT,
  
  -- Status
  status TEXT DEFAULT 'planned', -- planned, writing, production, completed
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ SCENES (Per Episode) ============
CREATE TABLE IF NOT EXISTS scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Scene Info
  scene_number INTEGER NOT NULL,
  heading TEXT, -- INT. LOCATION - TIME
  location_id UUID REFERENCES locations(id),
  time_of_day TEXT,
  
  -- Content
  description TEXT,
  action TEXT,
  dialogue TEXT,
  
  -- Visual Planning
  visual_description TEXT,
  shot_type TEXT,
  camera_movement TEXT,
  lighting TEXT,
  mood TEXT,
  
  -- Audio Planning
  music_mood TEXT,
  sfx_notes TEXT,
  
  -- Duration
  estimated_duration TEXT,
  
  -- Status
  status TEXT DEFAULT 'planned', -- planned, storyboarded, shot_listed, in_production, completed
  
  -- Order
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ SCENE_CHARACTERS (Many-to-Many) ============
CREATE TABLE IF NOT EXISTS scene_characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Character in scene details
  action TEXT,
  dialogue TEXT,
  emotion TEXT,
  
  UNIQUE(scene_id, character_id)
);

-- ============ STORYBOARD FRAMES (Per Scene) ============
CREATE TABLE IF NOT EXISTS storyboard_frames (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  frame_number INTEGER NOT NULL,
  
  -- Visual
  description TEXT,
  shot_type TEXT, -- CU, MS, WS, etc.
  camera_angle TEXT,
  camera_movement TEXT,
  
  -- Generated Content
  sketch_url TEXT,
  generated_image_url TEXT,
  prompt_used TEXT,
  
  -- Audio Notes
  dialogue TEXT,
  sfx TEXT,
  music TEXT,
  
  -- Duration
  duration TEXT,
  
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ GENERATED ASSETS (All AI-Generated Content) ============
CREATE TABLE IF NOT EXISTS generated_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Reference (what this asset is for)
  asset_type TEXT NOT NULL, -- image, video, audio_dialogue, audio_music, audio_sfx, prompt
  reference_type TEXT, -- scene, character, location, episode, storyboard_frame
  reference_id UUID, -- ID of the referenced item
  
  -- Content
  title TEXT,
  description TEXT,
  prompt_used TEXT,
  
  -- File Info
  file_url TEXT,
  thumbnail_url TEXT,
  file_type TEXT, -- image/png, video/mp4, audio/mp3, etc.
  file_size INTEGER,
  duration TEXT, -- for video/audio
  resolution TEXT, -- for image/video
  
  -- Generation Info
  tool_used TEXT, -- Which tool generated this (05, 08, audio-01, etc.)
  opal_flow_used TEXT,
  generation_params JSONB, -- Store all parameters used
  
  -- Status
  status TEXT DEFAULT 'generated', -- generated, approved, rejected, archived
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ WORKFLOW PROGRESS (Per Project, Per Phase) ============
CREATE TABLE IF NOT EXISTS workflow_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Phase Info
  phase_id TEXT NOT NULL, -- ideation, synopsis, breakdown, preproduction, etc.
  tool_id TEXT NOT NULL, -- idea-01, story-01, 01, 02, etc.
  
  -- Completion Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- User Input (what they filled in)
  form_data JSONB, -- Store all form inputs
  generated_prompt TEXT,
  
  -- Generated Output (what AI returned)
  output_data JSONB,
  output_text TEXT,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, tool_id)
);

-- ============ COMMENTS (Celtx-Style Collaboration) ============
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- What is being commented on
  reference_type TEXT NOT NULL, -- scene, character, location, episode, storyboard_frame, asset
  reference_id UUID NOT NULL,
  
  -- Comment Content
  content TEXT NOT NULL,
  
  -- Thread (for replies)
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Status
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ PROMPT HISTORY (Save Generated Prompts) ============
CREATE TABLE IF NOT EXISTS prompt_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tool Info
  tool_id TEXT NOT NULL,
  tool_name TEXT,
  
  -- Prompt Data
  form_inputs JSONB,
  generated_prompt TEXT NOT NULL,
  
  -- Result (if saved)
  result_text TEXT,
  result_assets JSONB, -- Array of asset IDs
  
  -- Tags for organization
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ VIRAL CLIPS (Identified Viral Moments) ============
CREATE TABLE IF NOT EXISTS viral_clips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  scene_id UUID REFERENCES scenes(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT,
  description TEXT,
  
  -- Timing
  start_time TEXT,
  end_time TEXT,
  duration TEXT,
  
  -- AI Analysis
  viral_score INTEGER CHECK (viral_score >= 1 AND viral_score <= 10),
  viral_reason TEXT,
  suggested_caption TEXT,
  suggested_hashtags TEXT[],
  
  -- Export
  thumbnail_url TEXT,
  exported_url TEXT,
  export_format TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ USER PREFERENCES ============
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- UI Preferences
  language TEXT DEFAULT 'id',
  theme TEXT DEFAULT 'dark',
  output_count INTEGER DEFAULT 1,
  
  -- Default Values
  default_style TEXT,
  default_mood TEXT,
  default_aspect_ratio TEXT,
  
  -- Opal Links (Personal overrides)
  personal_opal_links JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ GLOBAL OPAL LINKS (Admin-managed) ============
CREATE TABLE IF NOT EXISTS global_opal_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ USER ROLES ============
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT DEFAULT 'user', -- user, admin
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============ ROW LEVEL SECURITY ============
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_bibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboard_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_opal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Users can CRUD own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- Production Bibles Policies
CREATE POLICY "Users can CRUD own bibles" ON production_bibles FOR ALL USING (auth.uid() = user_id);

-- Characters Policies
CREATE POLICY "Users can CRUD own characters" ON characters FOR ALL USING (auth.uid() = user_id);

-- Locations Policies
CREATE POLICY "Users can CRUD own locations" ON locations FOR ALL USING (auth.uid() = user_id);

-- Episodes Policies
CREATE POLICY "Users can CRUD own episodes" ON episodes FOR ALL USING (auth.uid() = user_id);

-- Scenes Policies
CREATE POLICY "Users can CRUD own scenes" ON scenes FOR ALL USING (auth.uid() = user_id);

-- Scene Characters Policies (via scene ownership)
CREATE POLICY "Users can CRUD scene_characters via scene" ON scene_characters FOR ALL 
  USING (EXISTS (SELECT 1 FROM scenes WHERE scenes.id = scene_characters.scene_id AND scenes.user_id = auth.uid()));

-- Storyboard Frames Policies
CREATE POLICY "Users can CRUD own storyboard frames" ON storyboard_frames FOR ALL USING (auth.uid() = user_id);

-- Generated Assets Policies
CREATE POLICY "Users can CRUD own assets" ON generated_assets FOR ALL USING (auth.uid() = user_id);

-- Workflow Progress Policies
CREATE POLICY "Users can CRUD own workflow progress" ON workflow_progress FOR ALL USING (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Users can CRUD own comments" ON comments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view comments on their projects" ON comments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = comments.project_id AND projects.user_id = auth.uid()));

-- Prompt History Policies
CREATE POLICY "Users can CRUD own prompt history" ON prompt_history FOR ALL USING (auth.uid() = user_id);

-- Viral Clips Policies
CREATE POLICY "Users can CRUD own viral clips" ON viral_clips FOR ALL USING (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "Users can CRUD own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Global Opal Links Policies (read for all, write for admin)
CREATE POLICY "Anyone can read global opal links" ON global_opal_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage global opal links" ON global_opal_links FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- User Roles Policies
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON user_roles FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- ============ INDEXES FOR PERFORMANCE ============
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_production_bibles_project ON production_bibles(project_id);
CREATE INDEX IF NOT EXISTS idx_characters_project ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_locations_project ON locations(project_id);
CREATE INDEX IF NOT EXISTS idx_episodes_project ON episodes(project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_episode ON scenes(episode_id);
CREATE INDEX IF NOT EXISTS idx_scenes_project ON scenes(project_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_frames_scene ON storyboard_frames(scene_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_project ON generated_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_reference ON generated_assets(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_workflow_progress_project ON workflow_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_workflow_progress_tool ON workflow_progress(project_id, tool_id);
CREATE INDEX IF NOT EXISTS idx_comments_reference ON comments(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_project ON prompt_history(project_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_tool ON prompt_history(tool_id);
CREATE INDEX IF NOT EXISTS idx_viral_clips_project ON viral_clips(project_id);

-- ============ TRIGGERS FOR UPDATED_AT ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_bibles_updated_at BEFORE UPDATE ON production_bibles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_progress_updated_at BEFORE UPDATE ON workflow_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ HELPER FUNCTIONS ============

-- Get project completion percentage
CREATE OR REPLACE FUNCTION get_project_completion(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_tools INTEGER := 32; -- Total number of tools
  completed_tools INTEGER;
BEGIN
  SELECT COUNT(*) INTO completed_tools
  FROM workflow_progress
  WHERE project_id = p_project_id AND is_completed = TRUE;
  
  RETURN ROUND((completed_tools::DECIMAL / total_tools) * 100);
END;
$$ LANGUAGE plpgsql;

-- Get phase completion status
CREATE OR REPLACE FUNCTION get_phase_completion(p_project_id UUID, p_phase_id TEXT)
RETURNS TABLE(total INTEGER, completed INTEGER, percentage INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total,
    COUNT(*) FILTER (WHERE is_completed = TRUE)::INTEGER as completed,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE is_completed = TRUE)::DECIMAL / COUNT(*)) * 100)::INTEGER
    END as percentage
  FROM workflow_progress
  WHERE project_id = p_project_id AND phase_id = p_phase_id;
END;
$$ LANGUAGE plpgsql;

-- ============ VIEWS FOR EASY QUERYING ============

-- Project Overview View
CREATE OR REPLACE VIEW project_overview AS
SELECT 
  p.id,
  p.user_id,
  p.name,
  p.type,
  p.genre,
  p.status,
  p.current_phase,
  p.created_at,
  p.updated_at,
  pb.title as bible_title,
  pb.logline,
  (SELECT COUNT(*) FROM characters c WHERE c.project_id = p.id) as character_count,
  (SELECT COUNT(*) FROM locations l WHERE l.project_id = p.id) as location_count,
  (SELECT COUNT(*) FROM episodes e WHERE e.project_id = p.id) as episode_count,
  (SELECT COUNT(*) FROM scenes s WHERE s.project_id = p.id) as scene_count,
  (SELECT COUNT(*) FROM generated_assets ga WHERE ga.project_id = p.id) as asset_count,
  (SELECT COUNT(*) FROM workflow_progress wp WHERE wp.project_id = p.id AND wp.is_completed = TRUE) as completed_steps
FROM projects p
LEFT JOIN production_bibles pb ON pb.project_id = p.id;

-- Scene Detail View
CREATE OR REPLACE VIEW scene_details AS
SELECT 
  s.*,
  e.title as episode_title,
  e.episode_number,
  l.name as location_name,
  l.description as location_description,
  (SELECT COUNT(*) FROM storyboard_frames sf WHERE sf.scene_id = s.id) as frame_count,
  (SELECT COUNT(*) FROM generated_assets ga WHERE ga.reference_type = 'scene' AND ga.reference_id = s.id) as asset_count,
  (SELECT COUNT(*) FROM comments c WHERE c.reference_type = 'scene' AND c.reference_id = s.id) as comment_count
FROM scenes s
LEFT JOIN episodes e ON e.id = s.episode_id
LEFT JOIN locations l ON l.id = s.location_id;
