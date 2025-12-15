-- =============================================
-- AI FILMMAKING STUDIO - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  genre VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CHARACTERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age VARCHAR(50),
  gender VARCHAR(50),
  role VARCHAR(100),
  physical TEXT,
  costume TEXT,
  personality TEXT,
  backstory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LOCATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  mood VARCHAR(100),
  time_of_day VARCHAR(50),
  description TEXT,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SCRIPTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  scene_number INTEGER,
  content TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STORYBOARDS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS storyboards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  scene_number INTEGER NOT NULL,
  shot_type VARCHAR(100),
  camera_angle VARCHAR(100),
  camera_movement VARCHAR(100),
  description TEXT,
  dialogue TEXT,
  duration VARCHAR(50),
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- HISTORY TABLE (Generation History)
-- =============================================
CREATE TABLE IF NOT EXISTS history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  app_id VARCHAR(100) NOT NULL,
  prompt TEXT NOT NULL,
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- OPAL LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS opal_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_id VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- =============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE opal_links ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Characters policies
CREATE POLICY "Users can view own characters" ON characters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own characters" ON characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own characters" ON characters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own characters" ON characters FOR DELETE USING (auth.uid() = user_id);

-- Locations policies
CREATE POLICY "Users can view own locations" ON locations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own locations" ON locations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own locations" ON locations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own locations" ON locations FOR DELETE USING (auth.uid() = user_id);

-- Scripts policies
CREATE POLICY "Users can view own scripts" ON scripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own scripts" ON scripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scripts" ON scripts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scripts" ON scripts FOR DELETE USING (auth.uid() = user_id);

-- Storyboards policies
CREATE POLICY "Users can view own storyboards" ON storyboards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own storyboards" ON storyboards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own storyboards" ON storyboards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own storyboards" ON storyboards FOR DELETE USING (auth.uid() = user_id);

-- History policies
CREATE POLICY "Users can view own history" ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own history" ON history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON history FOR DELETE USING (auth.uid() = user_id);

-- Opal links policies
CREATE POLICY "Users can view own opal_links" ON opal_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own opal_links" ON opal_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own opal_links" ON opal_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opal_links" ON opal_links FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_project_id ON locations(project_id);
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_project_id ON scripts(project_id);
CREATE INDEX IF NOT EXISTS idx_storyboards_user_id ON storyboards(user_id);
CREATE INDEX IF NOT EXISTS idx_storyboards_project_id ON storyboards(project_id);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_project_id ON history(project_id);
CREATE INDEX IF NOT EXISTS idx_opal_links_user_id ON opal_links(user_id);

-- =============================================
-- DONE! Your database is ready.
-- =============================================
