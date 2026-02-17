# 🔖 Smart Bookmark — AI-Powered Bookmark Manager

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge\&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge\&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple?style=for-the-badge\&logo=google)

> An intelligent bookmark manager that uses AI to automatically organize, summarize, and deduplicate your saved links.

🌐 **Live App:** [https://smart-bookmark-six-omega.vercel.app](https://smart-bookmark-six-omega.vercel.app)
👨‍💻 **Portfolio:** [https://gokulramm.vercel.app](https://gokulramm.vercel.app)

---

## 💡 The Problem

Managing bookmarks is chaotic:

* Titles are vague or meaningless
* Duplicate links get saved unknowingly
* Hundreds of bookmarks become unsearchable
* Manual categorization is time-consuming
* Traditional bookmark managers are just static lists

After a few weeks, most users can’t even find what they saved.

---

## ✨ The Solution

**Smart Bookmark** uses AI to automatically understand, organize, and structure your bookmarks.

### Core Idea

Instead of saving a link manually, the system:

1. Fetches the page content
2. Sends it to AI
3. Generates:

   * Title
   * Summary
   * Category
   * Tags
4. Detects duplicates semantically

All in real time.

---

## 🚀 Tech Stack

**Frontend**

* Next.js 16 (App Router)
* React 19
* TypeScript 5
* TailwindCSS 4

**Backend**

* Supabase (PostgreSQL + Auth + Realtime)
* Row Level Security (RLS)

**AI**

* Google Gemini 2.5 Flash

**Auth**

* Google OAuth

---

## ⚡ Key Features

### 🤖 AI-Powered Intelligence

* Auto-generated bookmark titles
* AI summaries (2–3 sentences)
* Smart category detection
* Tag suggestions
* Semantic duplicate detection (75% threshold)

### 🔄 Real-Time Sync

* Cross-tab synchronization
* Instant updates using Supabase Realtime
* Optimistic UI for fast interactions

### 🎨 Modern UI

* Fully responsive design
* Matrix-inspired cyberpunk theme
* Smooth transitions and micro-animations
* Advanced filtering and search

### 🔒 Security

* Row Level Security (RLS)
* Google OAuth authentication
* Input sanitization
* Private, user-isolated data

---

## 🛠️ Quick Start

### Prerequisites

* Node.js 18+
* Supabase account
* Google OAuth credentials
* Gemini API key

---

### 1. Install dependencies

```bash
npm install
```

---

### 2. Configure environment variables (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

---

### 3. Run database schema

Copy and run:

```
supabase-schema.sql
```

Inside Supabase SQL Editor.

---

### 4. Start development server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 📦 Deployment (Vercel)

1. Push code to GitHub
2. Import repo into Vercel
3. Add environment variables
4. Deploy

After deployment:

* Update **Supabase Site URL**
* Update **OAuth redirect URLs**

---

## 🧠 Engineering Challenges & Solutions

This section highlights real problems faced during development.

---

### 1. OAuth Redirect Domain Mismatch

**Problem:**
After deployment, Google login redirected to the wrong Vercel domain, causing authentication failures.

**Cause:**
Supabase OAuth settings were pointing to an old deployment URL.

**Solution:**

* Set a permanent production domain in Vercel
* Updated:

  * Supabase Site URL
  * Redirect URLs
  * Environment variables

**Result:**
Stable login flow across all deployments.

---

### 2. Middleware Crashes in Production

**Problem:**
App showed `500: MIDDLEWARE_INVOCATION_FAILED` on Vercel.

**Cause:**
Type issues and cookie handling mismatches in the Supabase SSR middleware.

**Solution:**

* Rewrote middleware using proper TypeScript types
* Ensured correct cookie handling
* Simplified auth logic

**Result:**
Stable server-side authentication.

---

### 3. 404 Errors After Deployment

**Problem:**
App deployed successfully but showed `404 NOT_FOUND`.

**Cause:**
Project files were inside a subfolder, while Vercel expected them at the root.

**Solution:**

* Moved all app files to repository root
* Removed root directory setting in Vercel

**Result:**
Deployment worked correctly.

---

### 4. Duplicate Bookmark Detection

**Problem:**
Exact URL matching didn’t catch:

* Same article with tracking params
* Slightly different URLs

**Solution:**

* Used AI semantic similarity
* Set a confidence threshold (75%)

**Result:**
Smart duplicate prevention instead of simple string comparison.

---

## 📈 Possible Future Improvements

* Browser extension integration
* AI-powered search (natural language queries)
* Folder-style collections
* Offline sync support
* Public shareable bookmark collections

---

## 👨‍💻 About the Developer

**Gokulramm S**
Full-stack developer focused on AI-powered web applications.

🌐 Portfolio:
[https://gokulramm.vercel.app](https://gokulramm.vercel.app)

---

## ⭐ If You Like This Project

Give it a star on GitHub — it helps a lot!

---

