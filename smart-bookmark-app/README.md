# 🚀 Smart Bookmark - AI-Powered Bookmark Manager

A production-ready, intelligent bookmark management application built with Next.js, Supabase, and Google Gemini AI. Features real-time synchronization, automatic categorization, smart summaries, and semantic duplicate detection.

![Smart Bookmark Banner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple?style=for-the-badge&logo=google)

## ✨ Features

### 🤖 AI-Powered Intelligence
- **Auto-Title Generation**: AI generates descriptive titles when you don't provide one
- **Smart Summaries**: Get concise 2-3 sentence summaries of your bookmarked content
- **Auto-Categorization**: Automatically sorts bookmarks into relevant categories (Work, Personal, Research, etc.)
- **Tag Suggestions**: AI suggests 3-5 relevant tags based on content analysis
- **Duplicate Detection**: Uses semantic similarity to prevent saving duplicate bookmarks

### ⚡ Real-Time Features
- **Cross-Tab Sync**: Bookmarks sync instantly across all open browser tabs
- **Optimistic Updates**: Immediate UI updates with background synchronization
- **Live Notifications**: Toast notifications for all bookmark operations and sync events

### 🎨 Modern UI/UX
- **Responsive Design**: Beautiful interface that works on desktop, tablet, and mobile
- **Dark Mode Ready**: Full dark mode support with system preference detection
- **Smooth Animations**: Polished transitions and micro-interactions
- **Search & Filter**: Powerful search with category and tag filtering
- **Empty States**: Thoughtful empty and loading states throughout

### 🔒 Security & Privacy
- **Row Level Security**: Supabase RLS ensures users can only access their own bookmarks
- **Google OAuth**: Secure authentication with Google
- **Input Sanitization**: XSS prevention and URL validation
- **Private by Default**: All bookmarks are private to the user who created them

## 🏗️ Architecture

### Tech Stack

**Frontend Framework**
- Next.js 16 (App Router)
- React 19
- TypeScript 5

**Styling**
- TailwindCSS 4 (dark mode support)
- Custom animations and transitions

**Backend & Database**
- Supabase (PostgreSQL)
- Supabase Realtime
- Supabase Auth (Google OAuth)
- Row Level Security (RLS)

**AI Integration**
- Google Gemini 1.5 Flash
- Server-side API routes for security

**Additional Libraries**
- @supabase/ssr - Server-side rendering support
- Zod - Runtime type validation
- DOMPurify - XSS prevention

### Project Structure

```
smart-bookmark-app/
├── app/
│   ├── api/
│   │   └── bookmarks/
│   │       └── route.ts          # Bookmark API with AI processing
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── AddBookmarkModal.tsx      # Modal for adding bookmarks
│   ├── BookmarkItem.tsx          # Bookmark card component
│   └── Toast.tsx                 # Toast notifications
├── hooks/
│   ├── useBookmarks.ts           # Bookmark CRUD operations
│   ├── useRealtime.ts            # Realtime sync logic
│   └── useToast.ts               # Toast notification system
├── lib/
│   ├── ai/
│   │   └── gemini.ts             # Gemini AI service
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Middleware client
│   ├── utils.ts                  # Utility functions
│   └── validations.ts            # Zod schemas
├── types/
│   └── index.ts                  # TypeScript definitions
├── middleware.ts                 # Route protection
├── supabase-schema.sql           # Database schema
└── .env.local.example            # Environment template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Cloud project for OAuth
- A Google AI Studio API key ([aistudio.google.com](https://aistudio.google.com))

### 1. Clone and Install

```bash
# Navigate to project directory
cd smart-bookmark-app

# Install dependencies
npm install
```

### 2. Set Up Supabase

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

#### Run Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create tables, indexes, RLS policies, and enable realtime

#### Configure Google OAuth

1. In Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find Supabase keys:**
- Go to Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (⚠️ Keep secret!)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/smart-bookmark-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel:
   - Add all variables from `.env.local`
   - Make sure to use production Supabase URL if different

### 3. Update OAuth Redirect

After deployment, update your Google OAuth credentials:
- Add `https://your-app.vercel.app` to authorized origins
- Update Supabase Google provider with production redirect URL

### 4. Update Supabase Realtime

If using a custom domain, ensure Supabase Realtime is configured for your production URL.

## 🎯 How It Works

### Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. OAuth flow redirects to Google consent screen
3. Google redirects back to `/auth/callback` with code
4. Supabase exchanges code for session
5. Middleware protects `/dashboard` routes
6. Session persists via cookies

### Bookmark Creation Flow

1. User enters URL (and optionally title) in modal
2. Client validates URL format
3. Request sent to `/api/bookmarks` API route
4. Server authenticates user
5. Server fetches existing bookmarks for duplicate check
6. **AI Processing** (parallel execution):
   - Generate title (if not provided)
   - Generate summary
   - Categorize content
   - Suggest tags
   - Check for semantic duplicates
7. If duplicate detected (>75% confidence), return error
8. If unique, insert bookmark into database
9. Supabase Realtime broadcasts INSERT event
10. All open tabs receive update and show toast
11. UI updates optimistically

### Real-Time Synchronization

```typescript
// Subscribe to user-specific bookmark changes
supabase
  .channel(`bookmarks:user_id=eq.${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${userId}`
  }, handleInsert)
  .on('postgres_changes', {
    event: 'DELETE',
    // ...
  }, handleDelete)
  .subscribe();
```

- Uses Supabase Realtime with user-specific filters
- Optimistic updates for instant feedback
- Cleanup on component unmount
- Cross-tab synchronization

### AI Features Explained

#### 1. Auto-Title Generation
```typescript
// If user doesn't provide title
const title = await generateTitle(url);
// Fallback: domain name
```

#### 2. Smart Summaries
```typescript
// AI creates 2-3 sentence summary
const summary = await generateSummary(url, title);
```

#### 3. Auto-Categorization
```typescript
// Classifies into predefined categories
const category = await categorizeBookmark(url, title);
// Categories: Work, Personal, Research, Shopping, etc.
```

#### 4. Tag Suggestions
```typescript
// Suggests 3-5 relevant tags
const tags = await suggestTags(url, title, summary);
```

#### 5. Duplicate Detection
```typescript
// Uses semantic similarity
const duplicate = await detectDuplicate(url, title, existingBookmarks);
// Returns: { isDuplicate, matchId, confidence }
// Threshold: 75% confidence
```

## 🔐 Security Measures

### Row Level Security (RLS)

All database policies ensure users can only access their own bookmarks:

```sql
-- Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);
```

### API Protection

All API routes verify authentication:

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

### Input Validation

- URL validation with protocol check
- Zod schemas for runtime validation
- DOMPurify for XSS prevention
- Server-side sanitization

### Environment Security

- `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only
- Never exposed to client bundle
- Validated at build time

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Google OAuth login works
- [ ] Session persists across refreshes
- [ ] Logout clears session
- [ ] Protected routes redirect when not authenticated

**Bookmarks:**
- [ ] Can add bookmark with URL only (AI generates title)
- [ ] Can add bookmark with custom title
- [ ] Can delete bookmark
- [ ] Duplicate detection prevents re-adding same URL
- [ ] AI categorization is accurate

**Realtime:**
- [ ] Open app in 2 tabs
- [ ] Adding bookmark in Tab 1 appears in Tab 2
- [ ] Deleting bookmark in Tab 2 removes from Tab 1
- [ ] Toast notifications show for synced actions

**Search & Filters:**
- [ ] Search finds bookmarks by title/URL/summary
- [ ] Category filter works
- [ ] Tag filter works
- [ ] Filters can be combined

**UI/UX:**
- [ ] Responsive on mobile, tablet, desktop
- [ ] Dark mode works (if implemented)
- [ ] Loading states show appropriately
- [ ] Empty states display correctly
- [ ] Toast notifications are readable

## 📚 Database Schema

### Bookmarks Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users, CASCADE delete |
| url | TEXT | Bookmark URL (required) |
| title | TEXT | Bookmark title (required) |
| summary | TEXT | AI-generated summary (nullable) |
| category | TEXT | AI-categorized topic (nullable) |
| tags | TEXT[] | AI-suggested tags array (nullable) |
| favicon_url | TEXT | Favicon URL (nullable) |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- `idx_bookmarks_user_id` - Fast user queries
- `idx_bookmarks_created_at` - Sorting by date
- `idx_bookmarks_category` - Category filtering
- `idx_bookmarks_tags` (GIN) - Tag array searches

## 🐛 Troubleshooting

### OAuth Not Working

**Problem:** Google OAuth redirect fails

**Solutions:**
- Verify redirect URI in Google Cloud Console matches Supabase callback URL
- Check that Google provider is enabled in Supabase
- Ensure Client ID and Secret are correct
- Clear browser cookies and try again

### Realtime Not Syncing

**Problem:** Changes don't appear in other tabs

**Solutions:**
- Verify `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;` was run
- Check Supabase Realtime is enabled for your project
- Verify user_id filter matches authenticated user
- Check browser console for realtime connection errors

### AI Features Failing

**Problem:** AI processing returns generic fallbacks

**Solutions:**
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has not exceeded quota
- Review API route logs for specific errors
- Ensure Gemini API is enabled in Google Cloud

### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
- Verify all environment variables are set
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors with `npm run type-check`
- Clear `.next` folder and rebuild

## 🎓 Learning Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Google Gemini API](https://ai.google.dev/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🔮 Future Improvements

### Planned Features
- [ ] Browser extension for one-click bookmarking
- [ ] Bookmark collections/folders
- [ ] Public/shared bookmark collections
- [ ] Export bookmarks (JSON, CSV, HTML)
- [ ] Import from browser bookmarks
- [ ] Full-text search with vector embeddings
- [ ] Bookmark analytics dashboard
- [ ] Chrome extension integration
- [ ] Mobile app (React Native)
- [ ] Collaborative bookmarks (teams)

### Technical Improvements
- [ ] Redis caching for AI responses
- [ ] Rate limiting for API routes
- [ ] Webhook for bookmark changes
- [ ] GraphQL API option
- [ ] Comprehensive test suite (Jest, Playwright)
- [ ] CI/CD pipeline
- [ ] Performance monitoring (Sentry, Analytics)
- [ ] SEO optimization
- [ ] PWA support
- [ ] Offline mode with service workers

## 📝 License

MIT License - feel free to use this project for learning or as a portfolio piece.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) by Vercel
- [Supabase](https://supabase.com) - Open source Firebase alternative
- [Google Gemini](https://ai.google.dev) - AI capabilities
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS

---

**Made with ❤️ for developers who care about their bookmarks**

For questions or feedback, please open an issue on GitHub.
