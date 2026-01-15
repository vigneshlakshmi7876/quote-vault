
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

## 🧠 Supabase RPC: Unique Daily Quote

```sql
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

## 🔐 Environment Variables

This project uses environment variables for Supabase configuration.

An example file is already provided in the repository.

1. Create a local environment file:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Supabase project details in the `.env` file:
   
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  

    ℹ️ Note: Supabase a non (publishable) keys are safe to use in client applications.
    The .env file is excluded from version control and should not be committed.
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
