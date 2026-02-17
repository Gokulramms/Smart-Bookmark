# 🔖 Smart Bookmark - AI-Powered Bookmark Manager

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple?style=for-the-badge&logo=google)

## 💡 The Problem

Managing bookmarks is a mess. We save URLs with vague titles, create duplicates without realizing it, and struggle to find what we bookmarked weeks ago. Traditional bookmark managers are just glorified lists - they don't help organize, categorize, or make sense of our saved content.

## ✨ The Solution

Smart Bookmark leverages AI to transform how you manage bookmarks:
- **AI automatically generates titles and summaries** so you never have to
- **Smart categorization** organizes bookmarks into Work, Personal, Research, etc.
- **Semantic duplicate detection** prevents saving the same content twice
- **Real-time sync across tabs** keeps everything up-to-date instantly
- **Intelligent tag suggestions** make searching effortless

Instead of manually organizing hundreds of bookmarks, let AI do the heavy lifting while you focus on what matters.

## 🚀 About This Project

An intelligent bookmark management application that combines Next.js, Supabase, and Google Gemini AI to deliver a seamless, automated bookmark experience with real-time synchronization.

**Tech Stack:**
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **AI:** Google Gemini 1.5 Flash
- **Styling:** TailwindCSS 4
- **Security:** Row Level Security (RLS) + Google OAuth

## ⚡ Key Features

### 🤖 AI-Powered Intelligence
- **Auto-Title Generation** - AI creates descriptive titles from URLs
- **Smart Summaries** - Get 2-3 sentence summaries of bookmarked content
- **Auto-Categorization** - Automatically sorts into relevant categories
- **Tag Suggestions** - AI suggests 3-5 relevant tags per bookmark
- **Duplicate Detection** - Semantic similarity prevents duplicate saves (75% confidence threshold)

### 🔄 Real-Time Synchronization
- **Cross-Tab Sync** - Changes appear instantly across all open tabs
- **Optimistic Updates** - Immediate UI feedback with background sync
- **Live Notifications** - Toast alerts for all operations and sync events

### 🎨 Modern UI/UX
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Matrix Theme** - Cyberpunk-inspired design with green/black aesthetics
- **Smooth Animations** - Polished transitions and micro-interactions
- **Advanced Search** - Filter by category, tags, and full-text search

### 🔒 Security & Privacy
- **Row Level Security (RLS)** - Users only access their own bookmarks
- **Google OAuth** - Secure authentication
- **Input Sanitization** - XSS prevention and URL validation
- **Private by Default** - All data is user-private

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Google Cloud OAuth credentials
- Google AI Studio API key

### Setup

1. **Install dependencies:**
```bash
cd smart-bookmark-app
npm install
```

2. **Configure environment variables** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

3. **Run database schema** in Supabase SQL Editor:
```bash
# Copy and run supabase-schema.sql
```

4. **Start development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

Deploy to Vercel in minutes:
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

Update OAuth redirect URLs after deployment.

**Made with ❤️ using Next.js, Supabase, and Google Gemini AI**
