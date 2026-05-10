-- Studio Vân Anh - Initial Schema
-- Created: 2026-05-10

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- IDEAS (Idea Bank)
-- ============================================
CREATE TABLE ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  pillar TEXT NOT NULL CHECK (pillar IN ('khach-quay-lai', 'leadership', 'van-hanh', 'ca-nhan')),
  post_type TEXT,
  maturity TEXT DEFAULT 'raw' CHECK (maturity IN ('raw', 'developing', 'ready')),
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TAGS
-- ============================================
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('pillar', 'post_type', 'custom')),
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction: ideas <-> tags
CREATE TABLE idea_tags (
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (idea_id, tag_id)
);

-- ============================================
-- DRAFTS
-- ============================================
CREATE TABLE drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT,
  content TEXT DEFAULT '',
  ai_generated BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewing', 'approved')),
  style_check JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRAFT VERSIONS (history)
-- ============================================
CREATE TABLE draft_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draft_id UUID REFERENCES drafts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- POSTS (completed content)
-- ============================================
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  platform TEXT DEFAULT 'facebook' CHECK (platform IN ('facebook', 'fanpage')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- IMAGES (quote cards, AI-generated)
-- ============================================
CREATE TABLE images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'quote_card' CHECK (type IN ('quote_card', 'ai_generated', 'portrait', 'uploaded')),
  template_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CALENDAR SLOTS
-- ============================================
CREATE TABLE calendar_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  slot_date DATE NOT NULL,
  slot_time TIME,
  platform TEXT DEFAULT 'facebook',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PUBLISH LOGS
-- ============================================
CREATE TABLE publish_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_id TEXT,
  external_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PERFORMANCE METRICS
-- ============================================
CREATE TABLE performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOICE STYLE RULES (AI memory)
-- ============================================
CREATE TABLE voice_style_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT DEFAULT 'Vân Anh Voice',
  rules JSONB NOT NULL DEFAULT '{
    "structure": "3 hồi (hook → câu chuyện → insight chốt)",
    "emoji_set": ["🫧", "🔥", "➖", "✧", "👉", "📣"],
    "formatting": {
      "bold_unicode": true,
      "divider": "——————",
      "quote_style": "italic + 💬"
    },
    "closing_templates": [
      "Scenario tương lai",
      "Insight chốt + ký VA"
    ],
    "tone": "Chân thật, không sến, anti-FOMO, nói thẳng"
  }'::jsonb,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEMPLATES (Design Lab)
-- ============================================
CREATE TABLE templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  canvas_width INTEGER DEFAULT 1080,
  canvas_height INTEGER DEFAULT 1350,
  background_color TEXT DEFAULT '#ffffff',
  text_style JSONB DEFAULT '{}'::jsonb,
  preview_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_style_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update only own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Ideas: CRUD only own
CREATE POLICY "Users can CRUD own ideas" ON ideas FOR ALL USING (auth.uid() = user_id);

-- Tags: view all, admin can modify
CREATE POLICY "Tags viewable by all" ON tags FOR SELECT USING (true);
CREATE POLICY "Only admin can modify tags" ON tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Idea tags: tied to ideas
CREATE POLICY "Users can CRUD own idea tags" ON idea_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM ideas WHERE id = idea_tags.idea_id AND user_id = auth.uid())
);

-- Drafts: CRUD only own
CREATE POLICY "Users can CRUD own drafts" ON drafts FOR ALL USING (auth.uid() = user_id);

-- Draft versions: tied to drafts
CREATE POLICY "Users can CRUD own draft versions" ON draft_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM drafts WHERE id = draft_versions.draft_id AND user_id = auth.uid())
);

-- Posts: CRUD only own
CREATE POLICY "Users can CRUD own posts" ON posts FOR ALL USING (auth.uid() = user_id);

-- Images: CRUD only own
CREATE POLICY "Users can CRUD own images" ON images FOR ALL USING (auth.uid() = user_id);

-- Calendar slots: CRUD only own
CREATE POLICY "Users can CRUD own calendar slots" ON calendar_slots FOR ALL USING (auth.uid() = user_id);

-- Publish logs: view own
CREATE POLICY "Users can view own publish logs" ON publish_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE id = publish_logs.post_id AND user_id = auth.uid())
);

-- Performance metrics: view own
CREATE POLICY "Users can view own metrics" ON performance_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE id = performance_metrics.post_id AND user_id = auth.uid())
);

-- Voice style rules: CRUD only own
CREATE POLICY "Users can CRUD own voice rules" ON voice_style_rules FOR ALL USING (auth.uid() = user_id);

-- Templates: view all active, admin can modify
CREATE POLICY "Users can view active templates" ON templates FOR SELECT USING (is_active = true);
CREATE POLICY "Users can CRUD own templates" ON templates FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_pillar ON ideas(pillar);
CREATE INDEX idx_ideas_maturity ON ideas(maturity);
CREATE INDEX idx_drafts_idea_id ON drafts(idea_id);
CREATE INDEX idx_drafts_status ON drafts(status);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at);
CREATE INDEX idx_calendar_slot_date ON calendar_slots(slot_date);
CREATE INDEX idx_images_post_id ON images(post_id);
CREATE INDEX idx_performance_post_id ON performance_metrics(post_id);

-- Full-text search on ideas
CREATE INDEX idx_ideas_search ON ideas USING gin(to_tsvector('vietnamese', title || ' ' || COALESCE(content, '')));

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO tags (name, category, color) VALUES
  ('Khách quay lại', 'pillar', '#3b82f6'),
  ('Leadership', 'pillar', '#22c55e'),
  ('Vận hành', 'pillar', '#a855f7'),
  ('Cá nhân', 'pillar', '#f97316'),
  ('Soi gương nỗi đau', 'post_type', '#ef4444'),
  ('Mini-Confession', 'post_type', '#ec4899'),
  ('Framework Drop', 'post_type', '#14b8a6'),
  ('Contrarian Opinion', 'post_type', '#f59e0b'),
  ('Case Study', 'post_type', '#6366f1'),
  ('Behind the Scenes', 'post_type', '#8b5cf6');
