# AI Pulse — Intelligence Wire Frontend

A high-performance real-time Artificial Intelligence & Machine Learning news wire application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **TanStack Query**, and **React Router**.

---

## 🌟 Implemented Pages & Architecture

### 1. Home / Feed Page (`/`)
- **Query**: Cursor-based infinite query (`useInfiniteQuery`) querying `GET /api/articles?cursor=&limit=10&category=&search=&source=`.
- **Header**: Live pulse indicator, debounced search bar (400ms, synced to `?search=`), and theme toggle.
- **Filter Bar**: Dynamic category chips (`All`, `AI`, `Machine Learning`, `Robotics`, `Startups`, `Research`, `Policy`) synced to `?category=` and publisher source dropdown synced to `?source=`.
- **Card Grid**: Responsive layout (1 col mobile, 2 col tablet, 3 col desktop) using `NewsCard`.
- **Infinite Scroll**: `IntersectionObserver` sentinel auto-fetching next cursor page, displaying `"You're all caught up"` on termination.
- **Loading & Error States**: Skeleton loaders (`CardGridSkeleton`), spinner during pagination, empty state with "Clear filters", and retryable error state.
- **Live Update Polling**: Background query polling page 1 every 5 minutes; if newer articles exist, a floating `"New articles available"` banner appears with one-click smooth scroll to top and refresh.
- **Navigation Safety**: Card body, title, and image navigate internally to `/article/:id`. Only the explicit **"Read full article"** CTA button opens the publisher's external URL in a new tab with `rel="noopener noreferrer"`.

### 2. Article Detail Page (`/article/:id`)
- **Query**: `GET /api/articles/:id`.
- **Layout**: Category badge, headline, publisher source, relative publish timestamp, executive 60-word summary, bookmark button, share action, and prominent "Read full article" external link.
- **"More from &lt;category&gt;" Rail**: Automatically queries `GET /api/articles?category=<category>&limit=4` and renders related `NewsCard`s excluding the current article.
- **Error & Loading States**: Matching layout skeleton, and an "Article not found" 404 state with "Back to feed" link.

### 3. Category Page (`/category/:name`)
- **Query**: Reuses `useArticles` hook pre-filtered to the `:name` URL parameter.
- **Validation**: Strict validation against known categories (`AI`, `Machine Learning`, `Robotics`, `Startups`, `Research`, `Policy`). If invalid, displays "Category not found" without firing invalid API calls.
- **Header & Counts**: Displays category heading and total article count.
- **Locked Filter**: Category chip is locked active, with a clear button (`X`) returning to Home.

### 4. Search Results Page (`/search?q=<query>`)
- **Query**: Filters via `GET /api/articles?search=<q>&cursor=&limit=10`.
- **URL Synchronization**: The header search input syncs with `?q=` in real-time, making URLs shareable and preserving browser history.
- **Empty State**: Custom "No articles found" with suggestions to check spelling or browse by category.

### 5. Bookmarks / Saved Articles Page (`/saved`)
- **Storage**: Client-side persistence in `localStorage` under `ai-pulse:saved`.
- **Reactive Updates**: Synchronized across all tabs and components via custom event bus and storage hooks (`useSavedArticles`).
- **Batch Retrieval**: Queries all saved articles via `useQueries`.
- **Affordances**: Quick "Remove" action on cards and "Clear all" confirmation.

### 6. Settings / Preferences Page (`/settings`)
- **Immediate Persistence**: Settings persist immediately to `localStorage` under `ai-pulse:settings`:
  1. **Appearance**: Light / Dark / System theme selector.
  2. **Default Category**: Choose default opening category for Home (`All` or any category).
  3. **Articles Per Page**: Control query `limit` (10, 20, or 30).
  4. **Reset Saved Articles**: Safe reset with confirmation dialog.

### 7. 404 Not Found Page (`*`)
- Catch-all route with clean centered layout, friendly guidance, and button returning to Home.

---

## 🛠️ Backend API Contract Summary

The frontend is ready for full production backend integration at `/api`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/articles?cursor=&limit=&category=&search=&source=` | Paginated feed of articles |
| `GET` | `/api/articles/:id` | Single article by ID (returns 404 if not found) |
| `GET` | `/api/articles/counts` | Total article counts per category `{ "AI": 14, ... }` |

*Note: Built-in resilient fallback mock data ensures all 7 pages and features are 100% interactive and demonstrable even before the backend is running.*

---

## 🚀 Running the App

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
