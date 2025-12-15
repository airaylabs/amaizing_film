-- =============================================
-- AI FILMMAKING STUDIO - DATABASE SCHEMA V2
-- ADMIN SYSTEM + GLOBAL OPAL LINKS
-- Run this in Supabase SQL Editor (after v1)
-- =============================================

-- =============================================
-- USER ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user' NOT NULL, -- 'admin' or 'user'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- GLOBAL OPAL LINKS TABLE (Admin-managed)
-- These links are visible to ALL users
-- =============================================
CREATE TABLE IF NOT EXISTS global_opal_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  app_id VARCHAR(100) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- GENERATED ASSETS TABLE
-- Store references to generated images/videos
-- =============================================
CREATE TABLE IF NOT EXISTS generated_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  app_id VARCHAR(100) NOT NULL,
  asset_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'character', 'scene'
  prompt TEXT,
  external_url TEXT, -- URL from Opal/external service
  thumbnail_url TEXT,
  metadata JSONB, -- Store additional info like dimensions, duration, etc.
  output_count INTEGER DEFAULT 1, -- How many outputs were generated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CHARACTER VARIANTS TABLE
-- For multiple character outputs (1/2/3/4 variations)
-- =============================================
CREATE TABLE IF NOT EXISTS character_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
  variant_number INTEGER NOT NULL,
  image_url TEXT,
  description TEXT,
  is_selected BOOLEAN DEFAULT false, -- Which variant is the "main" one
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ENABLE RLS
-- =============================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_opal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_variants ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES POLICIES
-- =============================================
-- Everyone can read their own role
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
-- Only admins can manage roles (we'll check this in app logic)
CREATE POLICY "Users can insert own role" ON user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- GLOBAL OPAL LINKS POLICIES
-- Everyone can READ global links, only admins can WRITE
-- =============================================
CREATE POLICY "Everyone can view global opal links" ON global_opal_links FOR SELECT USING (true);
CREATE POLICY "Admins can insert global opal links" ON global_opal_links FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update global opal links" ON global_opal_links FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete global opal links" ON global_opal_links FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- =============================================
-- GENERATED ASSETS POLICIES
-- =============================================
CREATE POLICY "Users can view own assets" ON generated_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assets" ON generated_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assets" ON generated_assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assets" ON generated_assets FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- CHARACTER VARIANTS POLICIES
-- =============================================
CREATE POLICY "Users can view own character variants" ON character_variants FOR SELECT USING (
  EXISTS (SELECT 1 FROM characters WHERE characters.id = character_variants.character_id AND characters.user_id = auth.uid())
);
CREATE POLICY "Users can create own character variants" ON character_variants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM characters WHERE characters.id = character_variants.character_id AND characters.user_id = auth.uid())
);
CREATE POLICY "Users can update own character variants" ON character_variants FOR UPDATE USING (
  EXISTS (SELECT 1 FROM characters WHERE characters.id = character_variants.character_id AND characters.user_id = auth.uid())
);
CREATE POLICY "Users can delete own character variants" ON character_variants FOR DELETE USING (
  EXISTS (SELECT 1 FROM characters WHERE characters.id = character_variants.character_id AND characters.user_id = auth.uid())
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_global_opal_links_app_id ON global_opal_links(app_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_user_id ON generated_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_project_id ON generated_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_character_variants_character_id ON character_variants(character_id);

-- =============================================
-- HELPER FUNCTION: Check if user is admin
-- =============================================
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INSERT DEFAULT ADMIN (change this email!)
-- Run this AFTER a user signs up with this email
-- =============================================
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'your-admin@email.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =============================================
-- DONE! V2 Schema ready.
-- =============================================
