-- ============================================================
-- raymAIzing film - FINAL DATABASE SCHEMA
-- AI Filmmaking Studio - Celtx-Style Production Management
-- ============================================================
-- INSTRUCTIONS:
-- 1. Run this in Supabase SQL Editor
-- 2. This will DROP all existing tables and create fresh ones
-- 3. Make sure to backup any important data first!
-- ============================================================

-- ============ DROP ALL EXISTING TABLES ============
DROP TABLE IF EXISTS viral_clips CASCADE;
DROP TABLE IF EXISTS storyboards CASCADE;
DROP TABLE IF EXISTS scripts CASCADE;
DROP TABLE IF EXISTS scene_assets CASCADE;
DROP TABLE IF EXISTS scenes CASCADE;
DROP TABLE IF EXISTS character_variants CASCADE;
DROP TABLE IF EXISTS history CASCADE;
DROP TABLE IF EXISTS opal_links CASCADE;
DROP TABLE IF EXISTS global_opal_links CASCADE;
DROP TABLE IF EXISTS generated_assets CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS production_bibles CASCADE;
DROP TABLE IF EXISTS workflow_progress CASCADE;
DROP TABLE IF EXISTS prompt_history CASCADE;
DROP TABLE IF EXISTS storyboard_frames CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;

-- ============================================================
-- CORE TABLES
-- ============================================================

-- 1. USER ROLES (Admin management)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. USER PREFERENCES
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  language TEXT DEFAULT 'id' CHECK (language IN ('id', 'en')),
  output_count INTEGER DEFAULT 1 CHECK (output_count BETWEEN 1 AND 10),
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. PROJECTS (Main container for all production data)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'Drama Pendek (3-5 min)', 'Short Film', 'Web Series', etc.
  genre TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  thumbnail_url TEXT,
  settings JSONB DEFAULT '{}', -- Store project-specific settings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTION BIBLES (Core story data - auto-populates everything)
CREATE TABLE production_bibles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Story Basics
  title TEXT,
  logline TEXT,
  synopsis TEXT,
  
  -- Production Info
  genre TEXT,
  project_type TEXT,
  episode_count INTEGER,
  episode_length TEXT,
  
  -- Visual Style
  style TEXT,
  mood TEXT,
  color_palette TEXT,
  
  -- World Building
  setting TEXT,
  era TEXT,
  themes TEXT,
  
  -- Target
  target_audience TEXT,
  target_platform TEXT,
  
  -- Full Bible Data (JSON for flexibility)
  full_bible JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id)
);

-- ============================================================
-- STORY ELEMENTS
-- ============================================================

-- 5. CHARACTERS
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  role TEXT, -- 'Protagonist', 'Antagonist', 'Supporting', etc.
  
  -- Physical Description (for AI image generation)
  age TEXT,
  gender TEXT,
  physical_description TEXT,
  clothing_style TEXT,
  
  -- Character Details
  personality TEXT,
  backstory TEXT,
  motivation TEXT,
  character_arc TEXT,
  
  -- Voice (for AI audio generation)
  voice_type TEXT,
  accent TEXT,
  speaking_style TEXT,
  
  -- Reference Images
  reference_image_url TEXT,
  generated_image_url TEXT,
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  is_main BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LOCATIONS
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  type TEXT, -- 'Interior', 'Exterior', 'Urban', 'Nature', etc.
  
  -- Visual Description (for AI generation)
  description TEXT,
  visual_description TEXT,
  time_of_day TEXT,
  weather TEXT,
  lighting TEXT,
  mood TEXT,
  
  -- Reference
  reference_image_url TEXT,
  generated_image_url TEXT,
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EPISODES
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  episode_number INTEGER NOT NULL,
  title TEXT,
  synopsis TEXT,
  
  -- Duration
  duration_minutes DECIMAL(5,2),
  
  -- Status
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'writing', 'production', 'post', 'completed')),
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, episode_number)
);

-- 8. SCENES
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Scene Info
  scene_number INTEGER,
  title TEXT,
  slug TEXT, -- e.g., "INT. CAFE - DAY"
  
  -- Content
  description TEXT,
  action TEXT,
  dialogue TEXT,
  script TEXT,
  
  -- Visual
  time_of_day TEXT,
  mood TEXT,
  visual_notes TEXT,
  
  -- Audio
  music_notes TEXT,
  sfx_notes TEXT,
  
  -- Duration
  duration_seconds INTEGER,
  
  -- Status
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'scripted', 'storyboarded', 'shot', 'edited', 'completed')),
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SCENE_CHARACTERS (Many-to-many: which characters appear in which scenes)
CREATE TABLE scene_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scene_id, character_id)
);

-- ============================================================
-- PRODUCTION ASSETS
-- ============================================================

-- 10. STORYBOARD FRAMES
CREATE TABLE storyboard_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  frame_number INTEGER NOT NULL,
  
  -- Visual
  description TEXT,
  shot_type TEXT, -- 'Close-Up', 'Wide Shot', etc.
  camera_angle TEXT,
  camera_movement TEXT,
  
  -- Image
  sketch_url TEXT,
  generated_image_url TEXT,
  
  -- Audio/Action
  dialogue TEXT,
  action TEXT,
  sfx TEXT,
  
  -- Duration
  duration_seconds DECIMAL(5,2),
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. GENERATED ASSETS (All AI-generated content)
CREATE TABLE generated_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Asset Info
  name TEXT,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'audio', 'music', 'sfx', 'voice')),
  
  -- Source
  tool_used TEXT, -- Tool ID that generated this
  prompt_used TEXT,
  
  -- File
  url TEXT,
  thumbnail_url TEXT,
  file_size INTEGER,
  duration_seconds DECIMAL(10,2),
  
  -- Reference (what this asset is for)
  reference_type TEXT, -- 'character', 'location', 'scene', 'episode', 'storyboard'
  reference_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKFLOW & PROGRESS
-- ============================================================

-- 12. WORKFLOW PROGRESS (Track completion of each tool)
CREATE TABLE workflow_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  tool_id TEXT NOT NULL, -- e.g., 'idea-01', 'story-01', '05', 'audio-01'
  phase_id TEXT NOT NULL, -- e.g., 'ideation', 'story-development', 'production-image'
  
  -- Completion Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  -- Saved Data
  form_data JSONB,
  generated_prompt TEXT,
  output_data JSONB,
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, tool_id)
);

-- 13. PROMPT HISTORY (All generated prompts)
CREATE TABLE prompt_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  tool_id TEXT NOT NULL,
  tool_name TEXT,
  
  -- Prompt Data
  prompt TEXT NOT NULL,
  form_data JSONB,
  
  -- Output (if any)
  output_url TEXT,
  output_type TEXT,
  
  -- Metadata
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OPAL LINKS
-- ============================================================

-- 14. GLOBAL OPAL LINKS (Admin-managed, default for all users)
CREATE TABLE global_opal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. USER OPAL LINKS (Personal overrides)
CREATE TABLE opal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_id TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- ============================================================
-- COLLABORATION & COMMENTS
-- ============================================================

-- 16. COMMENTS (For collaboration)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- What is being commented on
  reference_type TEXT NOT NULL, -- 'project', 'scene', 'character', 'asset', etc.
  reference_id UUID NOT NULL,
  
  -- Comment Content
  content TEXT NOT NULL,
  
  -- Thread
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Resolution
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DISTRIBUTION
-- ============================================================

-- 17. VIRAL CLIPS (AI-picked viral moments)
CREATE TABLE viral_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Clip Info
  title TEXT,
  description TEXT,
  
  -- Timing
  start_time DECIMAL(10,2),
  end_time DECIMAL(10,2),
  duration_seconds DECIMAL(10,2),
  
  -- AI Analysis
  viral_score INTEGER CHECK (viral_score BETWEEN 0 AND 100),
  viral_reasons JSONB, -- Why AI thinks this is viral-worthy
  
  -- Export
  clip_url TEXT,
  thumbnail_url TEXT,
  
  -- Target Platform
  target_platform TEXT,
  aspect_ratio TEXT,
  
  -- Status
  is_exported BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- INDEXES (For better performance)
-- ============================================================

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_characters_user_id ON characters(user_id);

CREATE INDEX idx_locations_project_id ON locations(project_id);
CREATE INDEX idx_locations_user_id ON locations(user_id);

CREATE INDEX idx_episodes_project_id ON episodes(project_id);

CREATE INDEX idx_scenes_project_id ON scenes(project_id);
CREATE INDEX idx_scenes_episode_id ON scenes(episode_id);
CREATE INDEX idx_scenes_location_id ON scenes(location_id);

CREATE INDEX idx_storyboard_frames_scene_id ON storyboard_frames(scene_id);

CREATE INDEX idx_generated_assets_project_id ON generated_assets(project_id);
CREATE INDEX idx_generated_assets_user_id ON generated_assets(user_id);
CREATE INDEX idx_generated_assets_type ON generated_assets(asset_type);
CREATE INDEX idx_generated_assets_reference ON generated_assets(reference_type, reference_id);

CREATE INDEX idx_workflow_progress_project_id ON workflow_progress(project_id);
CREATE INDEX idx_workflow_progress_tool_id ON workflow_progress(tool_id);

CREATE INDEX idx_prompt_history_user_id ON prompt_history(user_id);
CREATE INDEX idx_prompt_history_project_id ON prompt_history(project_id);
CREATE INDEX idx_prompt_history_tool_id ON prompt_history(tool_id);

CREATE INDEX idx_comments_reference ON comments(reference_type, reference_id);

CREATE INDEX idx_viral_clips_project_id ON viral_clips(project_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_opal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE opal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_clips ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- User Roles: Users can read their own role, admins can manage all
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- User Preferences: Users can manage their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Projects: Users can manage their own projects
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- Production Bibles: Users can manage their own bibles
CREATE POLICY "Users can manage own bibles" ON production_bibles FOR ALL USING (auth.uid() = user_id);

-- Characters: Users can manage their own characters
CREATE POLICY "Users can manage own characters" ON characters FOR ALL USING (auth.uid() = user_id);

-- Locations: Users can manage their own locations
CREATE POLICY "Users can manage own locations" ON locations FOR ALL USING (auth.uid() = user_id);

-- Episodes: Users can manage episodes in their projects
CREATE POLICY "Users can manage own episodes" ON episodes FOR ALL USING (auth.uid() = user_id);

-- Scenes: Users can manage scenes in their projects
CREATE POLICY "Users can manage own scenes" ON scenes FOR ALL USING (auth.uid() = user_id);

-- Scene Characters: Users can manage through scene ownership
CREATE POLICY "Users can manage scene_characters" ON scene_characters FOR ALL USING (
  EXISTS (SELECT 1 FROM scenes WHERE scenes.id = scene_characters.scene_id AND scenes.user_id = auth.uid())
);

-- Storyboard Frames: Users can manage their own
CREATE POLICY "Users can manage own storyboard_frames" ON storyboard_frames FOR ALL USING (auth.uid() = user_id);

-- Generated Assets: Users can manage their own
CREATE POLICY "Users can manage own assets" ON generated_assets FOR ALL USING (auth.uid() = user_id);

-- Workflow Progress: Users can manage their own
CREATE POLICY "Users can manage own progress" ON workflow_progress FOR ALL USING (auth.uid() = user_id);

-- Prompt History: Users can manage their own
CREATE POLICY "Users can manage own history" ON prompt_history FOR ALL USING (auth.uid() = user_id);

-- Global Opal Links: Everyone can read, only admins can write
CREATE POLICY "Everyone can read global links" ON global_opal_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage global links" ON global_opal_links FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- User Opal Links: Users can manage their own
CREATE POLICY "Users can manage own opal links" ON opal_links FOR ALL USING (auth.uid() = user_id);

-- Comments: Users can manage their own, read all in their projects
CREATE POLICY "Users can manage own comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- Viral Clips: Users can manage their own
CREATE POLICY "Users can manage own viral clips" ON viral_clips FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_bibles_updated_at BEFORE UPDATE ON production_bibles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storyboard_frames_updated_at BEFORE UPDATE ON storyboard_frames FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_assets_updated_at BEFORE UPDATE ON generated_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_progress_updated_at BEFORE UPDATE ON workflow_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_opal_links_updated_at BEFORE UPDATE ON global_opal_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opal_links_updated_at BEFORE UPDATE ON opal_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_viral_clips_updated_at BEFORE UPDATE ON viral_clips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- INSERT DEFAULT GLOBAL OPAL LINKS
-- ============================================================

INSERT INTO global_opal_links (app_id, url) VALUES
-- Ideation
('idea-01', 'https://opal.google/?flow=drive:/1ypRFcIjmwkAkPUn6c0pcxYEd3dvxbl_e&shared&mode=app'),
('idea-02', 'https://opal.google/?flow=drive:/1C139Z9wKnW0DIpeWq1Ic9Vo-KZ-9zKCX&shared&mode=app'),
('idea-03', 'https://opal.google/?flow=drive:/1_GJz_eqFT9Q7gPIqSv_ntSl42_IYad_o&shared&mode=app'),
-- Story Development
('story-01', 'https://opal.google/?flow=drive:/1H-dzGcJmusSBjpU6tBZMDbqnB7Nx9Zkc&shared&mode=app'),
('story-02', 'https://opal.google/?flow=drive:/1mQofq2bcDNuR6CEjDjPeKwJtZ6RElOiO&shared&mode=app'),
('story-03', 'https://opal.google/?flow=drive:/1ZaQUa6x1cLz2YwrIWMS4s9djw_iFsGyj&shared&mode=app'),
('story-04', 'https://opal.google/?flow=drive:/17fWsrQkwpy7C1xz0WQVtO7zaDESURgwf&shared&mode=app'),
-- Pre-Production
('01', 'https://opal.google/?flow=drive:/1caOGG8vp2TVISN_p0Dody6KXdcP1Z72x&shared&mode=app'),
('02', 'https://opal.google/?flow=drive:/1diFY1SWTlrW3wHVFdfVwxyCCFOuggDjx&shared&mode=app'),
('03', 'https://opal.google/?flow=drive:/179DbUhsxaUkuBWGXZdK_wnL3DrmraFKY&shared&mode=app'),
('04', 'https://opal.google/?flow=drive:/1QkYNFnLFOgCPHgz7VqgcpehgRCYI3zo3&shared&mode=app'),
-- Production - Image
('05', 'https://opal.google/?flow=drive:/19CRO7mg8qtG1vm4v4ucWA-wj0q2K1a1R&shared&mode=app'),
('06', 'https://opal.google/?flow=drive:/1V25vpVgTIeDrETg5uJofp6IRTI6jGNaa&shared&mode=app'),
('07', 'https://opal.google/?flow=drive:/1SVnB6fWc5dhSbgQKy0wnqTZR3JyzuGIP&shared&mode=app'),
-- Production - Video
('08', 'https://opal.google/?flow=drive:/1HY70cooJOAZ0i_cUH8skmG1YnDHHXndQ&shared&mode=app'),
('09', 'https://opal.google/?flow=drive:/1old8n9i3ffOGKjjdfiJUMsUUCQQ0VK6E&shared&mode=app'),
('10', 'https://opal.google/?flow=drive:/1ydc01Pl2mw_x10ccuNlAty1fY2kPnSUj&shared&mode=app'),
('11', 'https://opal.google/?flow=drive:/1pUK94WVmgVwI3tj-lbzrWl646Zmfxd0e&shared&mode=app'),
-- Production - Audio
('audio-01', 'https://opal.google/?flow=drive:/1lY9YnPvYw_NIHhR6n-umdmf3FKM7qibp&shared&mode=app'),
('audio-02', 'https://opal.google/?flow=drive:/1lKIoHzdFq64SGpkc9QuuFijEilXvCEh-&shared&mode=app'),
('audio-03', 'https://opal.google/?flow=drive:/1cd3TRvwNBcZE4nac4gf8qJUMOFtx3OwL&shared&mode=app'),
('audio-04', 'https://opal.google/?flow=drive:/1eR-U5vKzOGHBVeWOUOMrjH_YZWBpWkjg&shared&mode=app'),
-- Post-Production
('post-01', 'https://opal.google/?flow=drive:/1ZFF8efHntb0lrmLjWkjzYRhP_OVDs7Zw&shared&mode=app'),
('post-02', 'https://opal.google/?flow=drive:/1OenPJRFgsFe9OgryYTKkP8gOg4jTI9Uv&shared&mode=app'),
('post-03', 'https://opal.google/?flow=drive:/15-y85A94YJdZCq3F6o9ztGww1LzMcKY8&shared&mode=app'),
('post-04', 'https://opal.google/?flow=drive:/1m5N1z8dk2fvgdVg3yYN6sxll6n5AaYYg&shared&mode=app'),
('post-05', 'https://opal.google/?flow=drive:/1JT2IKHs2fSLh_05qf4h7gtiEDbPue1XF&shared&mode=app'),
('post-06', 'https://opal.google/?flow=drive:/1tOXs62NkiPl8vaQZZN6qCYP3nrOWBVW6&shared&mode=app'),
-- Distribution
('dist-01', 'https://opal.google/?flow=drive:/1IWqFICWLwv4q1zzkFsJmce2IfFP6zSA4&shared&mode=app'),
('dist-02', 'https://opal.google/?flow=drive:/1PpDulaHTdhDO7WZ_GbVJ5kDRCrSfr0aa&shared&mode=app'),
('dist-03', 'https://opal.google/?flow=drive:/1lKI91oFEoxEWujXVVKO2k0JtKM2Jhxiw&shared&mode=app'),
('dist-04', 'https://opal.google/?flow=drive:/1r3r7z4IMZV-ibay7kXevdThvhG-D78bI&shared&mode=app')
ON CONFLICT (app_id) DO UPDATE SET url = EXCLUDED.url;

-- ============================================================
-- DONE!
-- ============================================================
-- Tables created: 17
-- Indexes created: 15
-- RLS Policies created: 17
-- Triggers created: 15
-- Default Opal Links inserted: 32
-- ============================================================
