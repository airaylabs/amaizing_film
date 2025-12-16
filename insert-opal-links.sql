-- ============================================================
-- INSERT ALL 32 GLOBAL OPAL LINKS
-- Run this in Supabase SQL Editor to complete the Opal links
-- ============================================================

-- Clear existing and insert all 32 links
DELETE FROM global_opal_links;

INSERT INTO global_opal_links (app_id, url, is_active) VALUES
-- ============ IDEATION (3 tools) ============
('idea-01', 'https://opal.google/?flow=drive:/1ypRFcIjmwkAkPUn6c0pcxYEd3dvxbl_e&shared&mode=app', true),
('idea-02', 'https://opal.google/?flow=drive:/1C139Z9wKnW0DIpeWq1Ic9Vo-KZ-9zKCX&shared&mode=app', true),
('idea-03', 'https://opal.google/?flow=drive:/1_GJz_eqFT9Q7gPIqSv_ntSl42_IYad_o&shared&mode=app', true),

-- ============ STORY DEVELOPMENT (4 tools) ============
('story-01', 'https://opal.google/?flow=drive:/1H-dzGcJmusSBjpU6tBZMDbqnB7Nx9Zkc&shared&mode=app', true),
('story-02', 'https://opal.google/?flow=drive:/1mQofq2bcDNuR6CEjDjPeKwJtZ6RElOiO&shared&mode=app', true),
('story-03', 'https://opal.google/?flow=drive:/1ZaQUa6x1cLz2YwrIWMS4s9djw_iFsGyj&shared&mode=app', true),
('story-04', 'https://opal.google/?flow=drive:/17fWsrQkwpy7C1xz0WQVtO7zaDESURgwf&shared&mode=app', true),

-- ============ PRE-PRODUCTION (4 tools) ============
('01', 'https://opal.google/?flow=drive:/1caOGG8vp2TVISN_p0Dody6KXdcP1Z72x&shared&mode=app', true),
('02', 'https://opal.google/?flow=drive:/1diFY1SWTlrW3wHVFdfVwxyCCFOuggDjx&shared&mode=app', true),
('03', 'https://opal.google/?flow=drive:/179DbUhsxaUkuBWGXZdK_wnL3DrmraFKY&shared&mode=app', true),
('04', 'https://opal.google/?flow=drive:/1QkYNFnLFOgCPHgz7VqgcpehgRCYI3zo3&shared&mode=app', true),

-- ============ PRODUCTION - IMAGE (3 tools) ============
('05', 'https://opal.google/?flow=drive:/19CRO7mg8qtG1vm4v4ucWA-wj0q2K1a1R&shared&mode=app', true),
('06', 'https://opal.google/?flow=drive:/1V25vpVgTIeDrETg5uJofp6IRTI6jGNaa&shared&mode=app', true),
('07', 'https://opal.google/?flow=drive:/1SVnB6fWc5dhSbgQKy0wnqTZR3JyzuGIP&shared&mode=app', true),

-- ============ PRODUCTION - VIDEO (4 tools) ============
('08', 'https://opal.google/?flow=drive:/1HY70cooJOAZ0i_cUH8skmG1YnDHHXndQ&shared&mode=app', true),
('09', 'https://opal.google/?flow=drive:/1old8n9i3ffOGKjjdfiJUMsUUCQQ0VK6E&shared&mode=app', true),
('10', 'https://opal.google/?flow=drive:/1ydc01Pl2mw_x10ccuNlAty1fY2kPnSUj&shared&mode=app', true),
('11', 'https://opal.google/?flow=drive:/1pUK94WVmgVwI3tj-lbzrWl646Zmfxd0e&shared&mode=app', true),

-- ============ PRODUCTION - AUDIO (4 tools) ============
('audio-01', 'https://opal.google/?flow=drive:/1lY9YnPvYw_NIHhR6n-umdmf3FKM7qibp&shared&mode=app', true),
('audio-02', 'https://opal.google/?flow=drive:/1lKIoHzdFq64SGpkc9QuuFijEilXvCEh-&shared&mode=app', true),
('audio-03', 'https://opal.google/?flow=drive:/1cd3TRvwNBcZE4nac4gf8qJUMOFtx3OwL&shared&mode=app', true),
('audio-04', 'https://opal.google/?flow=drive:/1eR-U5vKzOGHBVeWOUOMrjH_YZWBpWkjg&shared&mode=app', true),

-- ============ POST-PRODUCTION (6 tools) ============
('post-01', 'https://opal.google/?flow=drive:/1ZFF8efHntb0lrmLjWkjzYRhP_OVDs7Zw&shared&mode=app', true),
('post-02', 'https://opal.google/?flow=drive:/1OenPJRFgsFe9OgryYTKkP8gOg4jTI9Uv&shared&mode=app', true),
('post-03', 'https://opal.google/?flow=drive:/15-y85A94YJdZCq3F6o9ztGww1LzMcKY8&shared&mode=app', true),
('post-04', 'https://opal.google/?flow=drive:/1m5N1z8dk2fvgdVg3yYN6sxll6n5AaYYg&shared&mode=app', true),
('post-05', 'https://opal.google/?flow=drive:/1JT2IKHs2fSLh_05qf4h7gtiEDbPue1XF&shared&mode=app', true),
('post-06', 'https://opal.google/?flow=drive:/1tOXs62NkiPl8vaQZZN6qCYP3nrOWBVW6&shared&mode=app', true),

-- ============ DISTRIBUTION (4 tools) ============
('dist-01', 'https://opal.google/?flow=drive:/1IWqFICWLwv4q1zzkFsJmce2IfFP6zSA4&shared&mode=app', true),
('dist-02', 'https://opal.google/?flow=drive:/1PpDulaHTdhDO7WZ_GbVJ5kDRCrSfr0aa&shared&mode=app', true),
('dist-03', 'https://opal.google/?flow=drive:/1lKI91oFEoxEWujXVVKO2k0JtKM2Jhxiw&shared&mode=app', true),
('dist-04', 'https://opal.google/?flow=drive:/1r3r7z4IMZV-ibay7kXevdThvhG-D78bI&shared&mode=app', true);

-- Verify count
SELECT COUNT(*) as total_links FROM global_opal_links;
-- Should return: 32
