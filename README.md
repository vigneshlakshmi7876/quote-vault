# QuoteVault 📱

QuoteVault is a modern, immersive mobile application for discovering, collecting, and sharing inspirational quotes.  
It is built using **React Native (Expo)** and **Supabase**, featuring a **Reels-style vertical feed**, a **server-driven Quote of the Day system**, and a **native Android home screen widget**.

This project was developed as part of a Mobile Application Developer assignment, with a strong focus on **clean architecture**, **thoughtful AI usage**, and **real-world scalability**.

---

## ✨ Features

### 📖 Quote Discovery
- Reels/TikTok-style vertical infinite scrolling feed
- 100+ seeded quotes across multiple categories
- Smooth pagination with loading and empty states

### 🌟 Quote of the Day
- A unique daily quote that stays **locked for 24 hours**
- Guaranteed **no repetition** using server-side logic
- Persists across app restarts and devices

### ❤️ Favorites & Collections
- Favorite quotes and sync them to the cloud
- Create custom collections (e.g., *Morning Motivation*, *Life Lessons*)
- Add or remove quotes from collections

### 🎨 Personalization
- Full Dark / Light mode support
- Clean, consistent design language

### 🔐 Authentication
- Secure email/password authentication
- Session persistence using Supabase Auth

### 📱 Native Android Widget
- Home screen widget displaying the current Quote of the Day
- Widget stays in sync with the app’s backend logic

---

## 🛠 Tech Stack

- **Framework:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **Backend & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **State Management:** React Context API
- **Native Modules:**
  - `react-native-android-widget`
  - `expo-linear-gradient`
- **Animations:** Lottie React Native

---

## 🏗 Architecture Highlights

### Quote of the Day Algorithm
- Uses a **lazy-generation, server-driven approach**
- When the app opens, it checks if a daily quote already exists
- If not, a **custom Postgres RPC function** selects a quote the user has never seen before
- The selected quote is then locked for the day

This approach avoids cron jobs, prevents duplication, and scales cleanly.

### Separation of Concerns
- **Screens** → UI only  
- **Services** → Supabase queries & business logic  
- **Context Providers** → Auth, Theme, Quote interactions  
- **Reusable Components** → Buttons, cards, loaders  

---

## 🗄 Database Schema Overview

### 1. `quotes`
Stores all quote content.

- `id` (uuid, primary key)
- `text`
- `author`
- `category`
- `created_at`

### 2. `user_daily_quotes`
Tracks daily quote history per user to prevent repetition.

- `id` (uuid, primary key)
- `user_id` (FK → auth.users)
- `quote_id` (FK → quotes)
- `date`
- `created_at`

**Constraints:**
- One quote per user per day
- No repeated quotes for the same user

### 3. `favorites`
Stores user-favorited quotes.

- `id` (uuid, primary key)
- `user_id`
- `quote_id`
- `created_at`

### 4. `collections`
User-created quote collections.

- `id` (uuid, primary key)
- `user_id`
- `name`
- `created_at`

### 5. `collection_quotes`
Many-to-many relationship between collections and quotes.

- `id` (uuid, primary key)
- `collection_id`
- `quote_id`

---

## 🚀 Getting Started

## 🍎 iOS Testing Note

This application was developed and tested on **Android devices only**.

Due to working on a **Windows-based development environment**, iOS-specific testing (including iOS widgets and notifications) could not be performed. However, the architecture and implementation are platform-agnostic and should work on iOS with minimal adjustments when tested on macOS with Xcode.

### Prerequisites
- Node.js v18+
- npm or yarn
- Android Studio or a physical Android device

### Installation

```bash
git clone https://github.com/vigneshlakshmi7876/quote-vault.git
cd quote-vault
npm install
```

---

## 🧰 Supabase Setup

This project relies on Supabase for authentication, database storage, and server-side business logic.

### 1. Create a Supabase Project
- Visit https://supabase.com and create a new project
- Note down your **Project URL** and **Anon (publishable) key**

### 2. Enable Authentication
- Go to **Authentication → Providers**
- Enable **Email / Password** authentication

### 3. Create Database Tables & Policies
Open the **SQL Editor** in the Supabase dashboard and run the following scripts.

```sql
-- Quotes Table
create table public.quotes (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  author text not null,
  category text,
  created_at timestamp with time zone default now()
);

-- User Daily Quotes Table
create table public.user_daily_quotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quote_id uuid references public.quotes(id) on delete cascade not null,
  date date default current_date not null,
  created_at timestamp with time zone default now(),
  constraint one_quote_per_day_per_user unique (user_id, date),
  constraint no_repeat_quotes_for_user unique (user_id, quote_id)
);

-- Favorites Table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Collections Tables
create table public.collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

create table public.collection_quotes (
  id uuid default gen_random_uuid() primary key,
  collection_id uuid references public.collections(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete cascade
);
```

### 4. Enable Row Level Security and Policy (RLS)

```sql
create policy "Users can manage their favorites"
on favorites for all
using (auth.uid() = user_id);

create policy "Users can manage their collections"
on collections for all
using (auth.uid() = user_id);

alter table favorites enable row level security;
alter table collections enable row level security;
alter table collection_quotes enable row level security;
alter table public.user_daily_quotes enable row level security;

create policy "Users can view their own daily quotes"
on public.user_daily_quotes
for select
using (auth.uid() = user_id);

create policy "Users can insert their own daily quotes"
on public.user_daily_quotes
for insert
with check (auth.uid() = user_id);

-- Create the "Magic" RPC Function for Unique Daily Quotes
create or replace function get_random_unique_quote(user_uuid uuid)
returns setof quotes
language sql
as $$
  select *
  from quotes
  where id not in (
    select quote_id
    from user_daily_quotes
    where user_id = user_uuid
  )
  order by random()
  limit 1;
$$;

```

### 5. Seed Quotes Data
Populate the `quotes` table with sample data (recommended: 100+ quotes across categories).

---

## 🔐 Environment Variables

This project uses environment variables for Supabase configuration.

An example file is already provided in the repository.

1. Create a local environment file:
```bash
cp .env.example .env
```

2. Ensure the following values are present in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_anon_publishable_key
```

ℹ️ Supabase **anon (publishable) keys** are safe to use in client applications.  
The `.env` file is ignored by version control and should not be committed.

---

## 🧩 Expo Prebuild & Native Features (Important)

> ⚠️ **Please read before running**

This app uses **native Android features** such as widgets and local persistence.

- `npx expo start` → Works for UI testing only
- **Widgets and native storage will NOT work in Expo Go**

To fully test the app:

```bash
npx expo prebuild
npx expo run:android
```

---

## 📱 Android Widget Notes

- Displays the current Quote of the Day
- Syncs with the same backend logic as the app
- Requires a native Android build (not available in Expo Go)

---

## 🤖 AI-Assisted Development Workflow

AI tools were used extensively to accelerate development, but **never blindly accepted**.

### Tools Used
- ChatGPT — architecture decisions, Supabase schema design, edge-case handling
- Cursor / Copilot — inline code completion and refactoring
- AI UI tools — initial design inspiration

### Where Human Judgment Was Critical
- Clean folder structure and separation of concerns
- Preventing unnecessary re-renders and excessive API calls
- Evaluating performance, memory safety, and scalability

AI acted as a **productivity multiplier**, while architectural ownership remained manual.

---

## ⚠️ Known Limitations

- Offline-first caching can be further improved
- Unit and integration tests are minimal due to time constraints

---

## 🔮 Future Improvements

- Smarter quote recommendations
- Enhanced offline-first support
- Automated testing for critical flows

---

## 📄 License

This project is for evaluation and learning purposes.
