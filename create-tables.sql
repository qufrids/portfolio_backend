-- ==========================================
-- Portfolio Backend - Database Tables
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. USERS TABLE (Admin login)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'ADMIN',
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 2. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  published_at TIMESTAMP(3),
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);

-- 3. MESSAGES TABLE (Contact form)
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'UNREAD',
  replied BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS messages_status_idx ON messages(status);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- 4. PAGE VIEWS TABLE (Analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  path TEXT NOT NULL,
  title TEXT,
  referrer TEXT,
  visitor_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  device TEXT,
  browser TEXT,
  duration INTEGER,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(path);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at);

-- 5. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INSERT DEFAULT DATA
-- ==========================================

-- Create admin user (password: admin123456)
-- bcrypt hash of 'admin123456'
INSERT INTO users (id, name, email, password, role)
VALUES (
  'admin-user-001',
  'Umar Zeb',
  'contact@umarzeb.com',
  '$2b$10$vtYSLeQuK.yS38BFiROPbu/JetNwOI9.hspUX/VONdjAg5VyD7XC6',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Create default site settings
INSERT INTO settings (key, value)
VALUES (
  'site',
  '{"title": "Umar Zeb - AI Engineer", "description": "Building AGI Systems", "url": "https://umarzeb.com"}'::jsonb
) ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value)
VALUES (
  'social',
  '{"github": "qufrids", "twitter": "", "linkedin": "", "email": "contact@umarzeb.com"}'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- DONE! Your database is ready.
-- ==========================================
