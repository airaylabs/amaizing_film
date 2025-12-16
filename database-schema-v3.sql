-- raymAIzing film - Database Schema v3
-- Synopsis-Driven Production System (Celtx-Style Integration)

-- ============ PRODUCTION BIBLE TABLE ============
-- Stores the master synopsis and all derived data
CREATE TABLE IF NOT EXISTS production_bibles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
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
  
  -- Parsed/Structured Data (JSON)
  characters JSONB DEFAULT '[]',
  locations JSONB DEFAULT '[]',
  episodes JSONB DEFAULT '[]',
  scenes JSONB DEFAULT '[]',
  
  -- AI-Generated Content
  tagline TEXT,
  poster_concept TEXT,
  viral_moments JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, project_id)
);

-- ============ EPISODES TABLE ============
CREATE TABLE IF NOT EXISTS episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bible_id UUID REFERENCES production_bibles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  episode_number INTEGER NOT NULL,
  title TEXT,
  synopsis TEXT,
  duration TEXT,
  focus_character TEXT,
  main_conflict TEXT,
  end_hook TEXT,
  
  -- Structured Data
  scenes JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ SCENES TABLE ============
CREATE TABLE IF NOT EXISTS scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  bible_id UUID REFERENCES production_bibles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  scene_number INTEGER NOT NULL,
  heading TEXT, -- INT. LOCATION - TIME
  location TEXT,
  time_of_day TEXT,
  
  -- Content
  description TEXT,
  action TEXT,
  dialogue TEXT,
  characters JSONB DEFAULT '[]',
  
  -- Visual Planning
  visual_description TEXT,
  shot_suggestions JSONB DEFAULT '[]',
  lighting TEXT,
  mood TEXT,
  
  -- Audio Planning
  sfx_notes TEXT,
  music_mood TEXT,
  
  -- Production Status
  status TEXT DEFAULT 'planned', -- planned, in_progress, completed
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ GENERATED ASSETS TABLE (Enhanced) ============
-- Track all AI-generated content linked to scenes
CREATE TABLE IF NOT EXISTS scene_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  asset_type TEXT NOT NULL, -- image, video, audio_dialogue, audio_music, audio_sfx
  prompt_used TEXT,
  opal_link TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  
  -- Metadata
  duration TEXT,
  resolution TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ VIRAL CLIPS TABLE ============
-- Store identified viral moments
CREATE TABLE IF NOT EXISTS viral_clips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bible_id UUID REFERENCES production_bibles(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT,
  description TEXT,
  start_time TEXT,
  end_time TEXT,
  
  -- AI Analysis
  viral_score INTEGER, -- 1-10
  viral_reason TEXT,
  suggested_caption TEXT,
  suggested_hashtags JSONB DEFAULT '[]',
  thumbnail_frame TEXT,
  
  -- Export Status
  exported BOOLEAN DEFAULT FALSE,
  export_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ RLS POLICIES ============
ALTER TABLE production_bibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_clips ENABLE ROW LEVEL SECURITY;

-- Production Bibles
CREATE POLICY "Users can view own production bibles" ON production_bibles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own production bibles" ON production_bibles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own production bibles" ON production_bibles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own production bibles" ON production_bibles
  FOR DELETE USING (auth.uid() = user_id);

-- Episodes
CREATE POLICY "Users can view own episodes" ON episodes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own episodes" ON episodes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own episodes" ON episodes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own episodes" ON episodes
  FOR DELETE USING (auth.uid() = user_id);

-- Scenes
CREATE POLICY "Users can view own scenes" ON scenes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own scenes" ON scenes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scenes" ON scenes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scenes" ON scenes
  FOR DELETE USING (auth.uid() = user_id);

-- Scene Assets
CREATE POLICY "Users can view own scene assets" ON scene_assets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own scene assets" ON scene_assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scene assets" ON scene_assets
  FOR DELETE USING (auth.uid() = user_id);

-- Viral Clips
CREATE POLICY "Users can view own viral clips" ON viral_clips
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own viral clips" ON viral_clips
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own viral clips" ON viral_clips
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own viral clips" ON viral_clips
  FOR DELETE USING (auth.uid() = user_id);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_production_bibles_user ON production_bibles(user_id);
CREATE INDEX IF NOT EXISTS idx_production_bibles_project ON production_bibles(project_id);
CREATE INDEX IF NOT EXISTS idx_episodes_bible ON episodes(bible_id);
CREATE INDEX IF NOT EXISTS idx_scenes_episode ON scenes(episode_id);
CREATE INDEX IF NOT EXISTS idx_scenes_bible ON scenes(bible_id);
CREATE INDEX IF NOT EXISTS idx_scene_assets_scene ON scene_assets(scene_id);
CREATE INDEX IF NOT EXISTS idx_viral_clips_bible ON viral_clips(bible_id);

-- ============ TRIGGERS ============
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_production_bibles_updated_at
  BEFORE UPDATE ON production_bibles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
