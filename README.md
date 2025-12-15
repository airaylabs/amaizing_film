# 🎬 AI Filmmaking Studio

Complete AI Filmmaking Platform - Control Center untuk produksi film/series dengan Google Opal.

## ✨ Features

### 🎯 Core Features
- **16 Production Tools** - Semua fase produksi dari Pre-Production sampai Distribution
- **Prompt Generator** - Generate prompts dengan dropdown, minimal typing
- **Project Management** - Organize multiple film/series projects
- **Character Manager** - Simpan & reuse karakter dengan konsistensi
- **Location Manager** - Simpan & reuse lokasi
- **History Tracking** - Semua prompt tersimpan untuk referensi
- **Opal Links** - Quick access ke semua Opal apps

### 📋 Production Phases

**Phase 1: Pre-Production**
- Script to Treatment
- Storyboard Creator
- Character Designer
- World Builder

**Phase 2: Production - Image**
- Text to Image Pro
- Character Transform (Whisk-style)
- Scene Generator

**Phase 3: Production - Video (VEO 3)**
- Text to Video Pro
- Image to Video Pro
- Dialogue Animator
- Action Sequence

**Phase 4: Post-Production**
- Video Extender
- Transition Maker
- Color Mood Matcher

**Phase 5: Distribution**
- Thumbnail Generator
- Poster & Promo

## 🚀 Deploy ke Railway

### Option 1: GitHub Deploy
```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/ai-filmmaking-studio.git
git push -u origin main

# 2. Di Railway
# - railway.app → New Project → Deploy from GitHub
# - Pilih repo → Auto deploy
```

### Option 2: Railway CLI
```bash
npm install -g @railway/cli
railway login
railway up
```

## 💻 Local Development

```bash
cd ai-filmmaking-studio
npm install
npm start
# Open http://localhost:3001
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | Mulai dalam 10 menit |
| [COMPLETE_USER_GUIDE.md](COMPLETE_USER_GUIDE.md) | Panduan lengkap step-by-step |
| [VIDEO_TUTORIAL_SCRIPT.md](VIDEO_TUTORIAL_SCRIPT.md) | Script untuk video tutorial |

## 🚀 Quick Start

### 1. Setup Opal Apps (Sekali)
```
1. Buka: https://opal.google
2. Login Gmail
3. Untuk setiap file di Google_Opal_Prompts/:
   Create New → Paste prompt → Generate → Share Public → Copy link
4. Simpan semua 16 links di "Opal Links" tab
```

### 2. Workflow Produksi
```
1. Create Project → Isi nama, type, genre
2. Create Characters → Isi DETAIL lengkap (PENTING!)
3. Create Locations → Isi detail
4. Pilih Tool → Isi dropdown → Quick Insert karakter/lokasi
5. Generate Prompt → Copy → Paste di Opal → Generate → Download
6. Save to History
```

### 3. Tips Konsistensi Karakter
```
✅ SELALU gunakan Quick Insert untuk karakter
✅ Jangan ubah deskripsi setelah generate pertama
✅ Save prompt yang berhasil ke History
✅ Maintain style keywords yang sama
```

## 🔧 Tech Stack

- Node.js + Express
- Vanilla JavaScript
- TailwindCSS (CDN)
- LocalStorage (data persistence)

## 📝 Notes

- Data disimpan di browser localStorage
- Google Opal tidak punya API, generation tetap manual di Opal
- Platform ini sebagai "Control Center" untuk organize workflow

---

*AI Filmmaking Studio v2.0*
*Unlimited VEO 3 + Gemini via Google Opal*
