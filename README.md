# Media Tracker

A full-stack web app for tracking your backlog of movies, TV series, books, and games. Search any title, add it to your list, update your progress, leave notes, and rate everything in one place.

Built as a portfolio project to learn React, Next.js, TypeScript, and Supabase.

## Features

- **4 media categories** — Movies, TV Series, Books, Games
- **Search & add** — Live search powered by TMDB, OpenLibrary, and Steam Store
- **Track progress** — Backlog / In Progress / Completed status per item
- **Rate & review** — 1–10 star rating and personal notes with auto-save
- **Detail modal** — Full API metadata (overview, release date, genres, ratings)
- **Favourites** — Pin items to a scrollable carousel on the dashboard
- **Dashboard** — Stats overview (total tracked, completed, avg rating) and recently added
- **Filter & sort** — Filter by status, sort by date, title, or rating
- **Authentication** — Email/password login with per-user data isolation (Supabase RLS)
- **Responsive** — Mobile-first layout with hamburger nav

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / Auth / DB | Supabase |
| Movie & Series data | TMDB API |
| Book data | OpenLibrary API |
| Game data | Steam Store API (via proxy route) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)

### 1. Clone the repo

```bash
git clone https://github.com/OllieMH/media-tracker.git
cd media-tracker
npm install
```

### 2. Set up Supabase

Create a new Supabase project and run the following SQL to create the table:

```sql
create table media_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('book','movie','series','game')),
  status text not null check (status in ('backlog','in_progress','completed')),
  rating integer check (rating >= 1 and rating <= 10),
  notes text,
  api_id text,
  cover_image_url text,
  metadata jsonb,
  is_favorite boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_media_user_category on media_items (user_id, category);
create index idx_media_user_status on media_items (user_id, status);

-- Row Level Security
alter table media_items enable row level security;

create policy "Users can view their own items" on media_items
  for select using (auth.uid() = user_id);

create policy "Users can insert their own items" on media_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own items" on media_items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own items" on media_items
  for delete using (auth.uid() = user_id);
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

Find your Supabase URL and anon key under **Project Settings → API** in the Supabase dashboard.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is deployed on Vercel. To deploy your own instance:

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables from `.env.local` in the Vercel dashboard
4. Deploy

## Project Structure

```
media-tracker/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Dashboard (stats, favourites, recent)
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── movies/                 # Movies page
│   ├── series/                 # Series page
│   ├── books/                  # Books page
│   ├── games/                  # Games page
│   ├── settings/               # Account settings
│   └── api/
│       └── games/search/       # Proxy route (Steam CORS workaround)
├── components/
│   ├── Navigation.tsx          # Top nav with hamburger menu
│   ├── MediaSearch.tsx         # Generic search component
│   ├── MediaList.tsx           # List with filter/sort
│   ├── MediaCard.tsx           # Item card with status, rating, notes
│   ├── MediaDetailModal.tsx    # Full detail modal
│   ├── SkeletonCards.tsx       # Loading skeletons
│   ├── ErrorBoundary.tsx       # React error boundary
│   ├── AuthProvider.tsx        # Auth context + useAuth hook
│   └── ProtectedPage.tsx       # Route guard wrapper
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── mediaService.ts         # CRUD operations
│   └── apiClients/
│       ├── tmdb.ts             # TMDB (movies + series)
│       ├── openLibrary.ts      # OpenLibrary (books)
│       └── steam.ts            # Steam Store (games)
└── types/
    └── media.ts                # Shared TypeScript types
```

## Future Plans

- Steam login + game library import via Steam Web API
- Progress tracking (pages read, episodes watched)
- Export to CSV
