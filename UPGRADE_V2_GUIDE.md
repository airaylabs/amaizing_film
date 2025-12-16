# raymAIzing film v2 - Upgrade Guide

## 🎯 Perubahan Utama

### ❌ Masalah di Versi Lama:
- **Checklist Logic SALAH**: Checklist tercentang ketika Opal link di-upload, bukan ketika user menyelesaikan pekerjaan
- **Tidak ada penyimpanan hasil**: User tidak bisa menyimpan hasil generate AI
- **Tidak project-based**: Data tidak terorganisir per project
- **Tidak ada comments**: Tidak bisa kolaborasi

### ✅ Perbaikan di v2:

#### 1. **Checklist Logic yang BENAR**
```
SEBELUM (SALAH):
✅ = Opal link sudah di-upload

SESUDAH (BENAR):
✅ = User sudah menyelesaikan langkah ini (mengisi form + generate prompt + save)
```

#### 2. **Project-Based Storage (Seperti Celtx)**
- Semua data tersimpan per project
- CRUD lengkap untuk: Projects, Characters, Locations, Episodes, Scenes
- Storyboard frames per scene
- Generated assets tersimpan

#### 3. **Workflow Progress Tracking**
- Progress tersimpan per project, per tool
- Bisa melihat form data yang sudah diisi sebelumnya
- Bisa edit kapan saja
- Bisa mark incomplete jika perlu revisi

#### 4. **Comments System (Celtx-Style)**
- Bisa comment di scene, character, location, dll
- Thread replies
- Resolve comments

#### 5. **Generated Assets Storage**
- Simpan hasil generate AI (image, video, audio)
- Organize by type, scene, character
- Favorite system
- Link ke scene/character terkait

## 📁 File Baru

```
ai-filmmaking-studio/
├── public/
│   ├── index-v2.html      # HTML baru dengan v2
│   ├── app-v2.js          # Logic aplikasi v2
│   ├── db-v2.js           # Database operations v2
│   └── translations-v2.js # Translations lengkap
├── database-schema-v4.sql # Schema database baru
└── UPGRADE_V2_GUIDE.md    # File ini
```

## 🚀 Cara Menggunakan v2

### Option 1: Langsung akses index-v2.html
```
https://your-domain.com/index-v2.html
```

### Option 2: Set sebagai default
Rename file:
```bash
mv public/index.html public/index-old.html
mv public/index-v2.html public/index.html
```

### Option 3: Toggle via localStorage
```javascript
localStorage.setItem('useAppV2', 'true');
location.reload();
```

## 🗄️ Database Migration

### 1. Backup data lama
```sql
-- Export data dari tabel lama jika perlu
```

### 2. Jalankan schema baru
```sql
-- Jalankan database-schema-v4.sql di Supabase SQL Editor
```

### 3. Migrate data (opsional)
```sql
-- Migrate projects
INSERT INTO projects (user_id, name, type, genre, description)
SELECT user_id, name, type, genre, description FROM old_projects;

-- Migrate characters
INSERT INTO characters (project_id, user_id, name, role, ...)
SELECT project_id, user_id, name, role, ... FROM old_characters;
```

## 🎬 Alur Kerja Baru

### Step 1: Buat Project
- Klik "New Project"
- Isi nama, type, genre
- Project otomatis terpilih

### Step 2: Ikuti Workflow
1. **Ideation** (Optional) - Cari ide dari trend
2. **Synopsis** ⭐ WAJIB - Tulis cerita lengkap
3. **Breakdown** - Pecah jadi episode & scene
4. **Pre-Production** - Treatment, storyboard, design
5. **Visual Production** - Generate gambar & video
6. **Audio Production** - Generate dialog, musik, SFX
7. **Post-Production** - Edit, pilih momen viral
8. **Distribution** - Thumbnail, poster, trailer

### Step 3: Di Setiap Tool
1. Pilih context (episode/scene/character) untuk auto-fill
2. Isi form atau klik "Auto-Fill"
3. Klik "Generate Prompt"
4. Copy prompt, buka Opal, generate
5. **PENTING**: Klik "Save & Mark Complete" untuk menandai selesai

### Step 4: Simpan Hasil
- Paste hasil AI ke output field (optional)
- Simpan generated assets (image/video/audio URLs)
- Semua tersimpan per project

## 📊 Perbedaan UI

### Sidebar
- Progress bar per project
- Completion % per phase
- ✅ = Tool completed (bukan Opal uploaded)

### Dashboard
- Workflow steps dengan progress bar
- Quick stats (characters, locations, scenes, assets)
- Project card dengan status

### Tool Page
- Context selector untuk auto-populate
- Saved form data dari session sebelumnya
- "Save & Mark Complete" button
- Workflow navigation

## 🔧 Konfigurasi

### Opal Links
Opal links TERPISAH dari completion status:
- Global links: Admin set untuk semua user
- Personal links: User bisa override
- Default links: Fallback dari code

### User Preferences
- Language (id/en)
- Output count
- Default style/mood

## ❓ FAQ

### Q: Kenapa checklist tidak tercentang padahal sudah upload Opal?
A: Di v2, checklist tercentang ketika Anda klik "Save & Mark Complete", bukan ketika Opal link di-upload. Ini lebih akurat karena menandakan Anda sudah benar-benar menyelesaikan langkah tersebut.

### Q: Bagaimana cara melihat progress saya?
A: Lihat sidebar - setiap phase menunjukkan completion %. Di dashboard juga ada progress bar keseluruhan.

### Q: Data lama saya hilang?
A: Tidak, data lama masih ada di tabel lama. Anda perlu migrate manual jika ingin pindah ke v2.

### Q: Bisa kembali ke versi lama?
A: Ya, akses index.html (bukan index-v2.html) untuk versi lama.

## 🐛 Known Issues

1. Migration dari v1 ke v2 perlu manual
2. Comments belum fully implemented di UI
3. Storyboard frame generation belum terintegrasi dengan Opal

## 📞 Support

Jika ada masalah, buka issue di repository atau hubungi developer.
