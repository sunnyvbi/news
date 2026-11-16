# Quick News — Complete News Aggregation Platform & Studio

> **Tagline:** *Stay informed. Stay ahead.*  
> **Studio Integration:** *Interfaces for a world shared with machines*

Quick News is a high-performance, automated news aggregation and intelligence platform seamlessly integrated into the Lior Voss interaction design studio website. It autonomously ingests news from **14+ trusted wire sources** every 5 minutes, normalizes metadata, deduplicates articles at the database level, generates **exact 60-word executive summaries** with verified financial/ticker tags via **Google Gemini 3.8 Flash**, persists all records in **PostgreSQL 18** via **Prisma ORM**, and serves content to a **React 18 + Vite** frontend with infinite scrolling, debounced search, and local bookmarking.

---

## 📑 Table of Contents

1. [Project Overview & Key Architecture Principles](#1-project-overview--key-architecture-principles)
2. [Technology Stack](#2-technology-stack)
3. [Database Architecture & Schema (pgAdmin 4)](#3-database-architecture--schema-pgadmin-4)
4. [API Specification (All Endpoints & How They Work)](#4-api-specification-all-endpoints--how-they-work)
5. [End-to-End System & API Flows](#5-end-to-end-system--api-flows)
6. [Data Ingestion: How Data Is Fetched, Processed & Stored](#6-data-ingestion-how-data-is-fetched-processed--stored)
7. [Frontend Architecture & Key Functions](#7-frontend-architecture--key-functions)
8. [Backend Architecture & Key Functions](#8-backend-architecture--key-functions)
9. [Setup, Installation & Running Locally](#9-setup-installation--running-locally)
10. [Automated Testing & Verification](#10-automated-testing--verification)

---

## 1. Project Overview & Key Architecture Principles

1. **Preserve Existing Website**: The original studio website (Three.js 3D Torus Knot hero canvas, Work, Practices, About, Writing essays, typography, and color tokens) remains intact. Quick News is added as a dedicated feature section without altering existing design systems.
2. **Zero Gemini Calls on User Reads**: When users open or browse Quick News, the application reads **strictly from indexed PostgreSQL database tables**. The Gemini API is called **only in the background during scheduled ingestion cycles for newly discovered articles**.
3. **Exact 60-Word Guarantee**: Every summary is constrained and validated to contain **strictly 60 words**. If external API quotas or network timeouts occur, a deterministic extractive 60-word fallback guarantees zero downtime.
4. **Smart Deduplication**: Articles are checked by both `canonicalUrl` (unique index) and `(normalizedTitle + publisherId)`. No story is ingested or processed twice.
5. **Verified Financial & Trading Metadata**: When processing financial and market news, stock ticker symbols (`$TICKER`), exchanges, and company entities are extracted and verified into dedicated badge tags.

---

## 2. Technology Stack

### Frontend
- **React 18 & TypeScript**: Component-driven UI architecture with strict typing.
- **Vite 5**: Fast build tool and development server with Hot Module Replacement (HMR).
- **Tailwind CSS**: Custom tokens (`paper: #F1EEE7`, `ink: #15141A`, `indigo: #4B3F72`, `pulse: #D5FF4F`, `bone: #CFCAC0`).
- **TanStack Query (v5)**: Data fetching, caching, cursor-based pagination, and 5-minute background polling.
- **Three.js**: Interactive 3D wireframe Torus Knot with responsive mouse-tracking tilt.
- **React Router v6** (with v7 future flags enabled): Client-side routing with clean URL parameter synchronization.
- **Lucide React**: Modern iconography.

### Backend & Ingestion
- **Node.js (v20+) & Express.js**: REST API server with modular routing.
- **tsx**: High-speed TypeScript execution and watch daemon.
- **node-cron**: Scheduled 5-minute background ingestion worker with concurrency locking.
- **rss-parser**: XML feed parsing across 14 wire feeds with custom user-agents.
- **Zod**: Runtime schema validation for query params, environment variables, and Gemini JSON responses.
- **Pino & Pino-Pretty**: Structured JSON logging.
- **Helmet & CORS**: HTTP security headers and cross-origin access control.

### AI Engine
- **Google Gemini API (`gemini-3.8-flash`)**: High-speed structured JSON summarizer producing verified 60-word executive briefs, categories, keywords, and topics.
- **Deterministic Extractive Fallback**: Algorithmic 60-word fallback ensuring zero failure during API rate limits.

### Database & Persistence
- **PostgreSQL 18**: Relational database storage in database named `news` (managed via pgAdmin 4).
- **Prisma ORM (v6)**: Declarative schema modeling, automated migrations (`prisma db push`), and type-safe database queries.

### Testing & DevOps
- **Vitest**: Unit and integration test suite with 100% test pass rate.
- **Docker & Docker Compose**: PostgreSQL 16 containerization configuration.

---

## 3. Database Architecture & Schema (pgAdmin 4)

The database is named **`news`** in PostgreSQL 18. Below is the complete Prisma schema representation:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Article {
  id              String      @id @default(cuid())
  title           String
  normalizedTitle String
  originalUrl     String
  canonicalUrl    String      @unique
  publisherId     String
  publisher       Publisher   @relation(fields: [publisherId], references: [id], onDelete: Cascade)
  categoryId      String
  category        Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  content         String      @db.Text
  summary         String?     @db.Text
  summaryStatus   String      @default("pending") // ready, insufficient_content, failed
  geminiStatus    String      @default("pending") // completed, skipped, failed
  imageUrl        String?
  keywords        String[]    @default([])
  mainTopic       String?
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([publishedAt])
  @@index([categoryId])
  @@index([publisherId])
  @@index([normalizedTitle])
}

model Publisher {
  id        String    @id @default(cuid())
  name      String    @unique
  website   String?
  rssUrl    String?
  articles  Article[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  articles  Article[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model IngestionLog {
  id              String    @id @default(cuid())
  source          String
  status          String    // success, failed, running
  articlesFound   Int       @default(0)
  articlesCreated Int       @default(0)
  articlesSkipped Int       @default(0)
  errorMessage    String?
  startedAt       DateTime  @default(now())
  completedAt     DateTime?

  @@index([startedAt])
}
```

### Table Relationships & Indexes
- **`Article` &rarr; `Publisher`**: Foreign key `publisherId` referencing `Publisher.id` with `onDelete: Cascade`.
- **`Article` &rarr; `Category`**: Foreign key `categoryId` referencing `Category.id` with `onDelete: Cascade`.
- **Unique Indexes**: `Article.canonicalUrl`, `Publisher.name`, `Category.slug`, `Category.name`.
- **B-Tree Indexes**: `Article.publishedAt` (for fast chronological ordering), `Article.categoryId` (for instant category filtering), and `Article.normalizedTitle` (for deduplication lookup).

---

## 4. API Specification (All Endpoints & How They Work)

The backend provides **6 REST API endpoints** operating on port `3001` (proxied automatically via `/api` on frontend port `5174`):

### 1. `GET /api/articles`
Retrieves a paginated list of articles using cursor-based pagination with optional filtering and search.

- **Query Parameters**:
  - `cursor` (optional, string): The `id` of the last article from the previous page.
  - `limit` (optional, number, default: `10`, max: `50`): Number of articles to return.
  - `category` (optional, string): Category name to filter (e.g. `Technology`, `Trading`, `AI & Innovation`). Pass `All` to clear.
  - `source` (optional, string): Publisher name to filter (e.g. `BBC News - World`, `TechCrunch`).
  - `search` (optional, string): Search term matching against `title`, `summary`, and `content`.
- **Response Format (`200 OK`)**:
  ```json
  {
    "articles": [
      {
        "id": "cmwj2dt2k000afg4dmz0noktq",
        "title": "Delaware hit by rare November tornado",
        "publisher": "The Guardian - World",
        "originalUrl": "https://www.theguardian.com/environment/2026/nov/16/delaware-hit-by-rare-november-tornado",
        "canonicalUrl": "https://www.theguardian.com/environment/2026/nov/16/delaware-hit-by-rare-november-tornado",
        "publishedAt": "2026-11-16T09:27:06.000Z",
        "category": "World News",
        "summary": "Meanwhile, severe thunderstorms bring hailstones the size of baseballs in Argentina The National Weather Service in the US has confirmed that an EF1 tornado touched down south-east of Newark in the Salem Woods neighbourhood, Delaware, on Thursday. The tornado reached 160 metres wide, had a path length of 4.4 miles (7.1km) and reached estimated peak winds of up to 100mph.",
        "summaryStatus": "ready",
        "imageUrl": null,
        "keywords": ["tornado", "hailstones", "Delaware", "November", "large"],
        "mainTopic": "Delaware hit by rare November tornado"
      }
    ],
    "nextCursor": "cmwj2dt2k000afg4dmz0noktq",
    "hasMore": true,
    "totalCount": 144
  }
  ```

---

### 2. `GET /api/articles/:id`
Retrieves the full details of a single article by its unique ID.

- **URL Parameter**: `id` (string, e.g. `cmwj2dt2k000afg4dmz0noktq`).
- **Response Format (`200 OK`)**:
  ```json
  {
    "id": "cmwj2dt2k000afg4dmz0noktq",
    "title": "Delaware hit by rare November tornado",
    "publisher": "The Guardian - World",
    "originalUrl": "https://www.theguardian.com/environment/2026/nov/16/delaware-hit-by-rare-november-tornado",
    "canonicalUrl": "https://www.theguardian.com/environment/2026/nov/16/delaware-hit-by-rare-november-tornado",
    "publishedAt": "2026-11-16T09:27:06.000Z",
    "category": "World News",
    "summary": "...",
    "summaryStatus": "ready",
    "imageUrl": null,
    "keywords": ["tornado", "hailstones", "Delaware"],
    "mainTopic": "Delaware hit by rare November tornado",
    "content": "Raw article source content..."
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  { "error": "Article not found", "id": "invalid-id" }
  ```

---

### 3. `GET /api/categories`
Returns a list of all active categories along with the real-time article count for each.

- **Response Format (`200 OK`)**:
  ```json
  {
    "categories": [
      { "id": "cmwj1nsbz0001fgl0lm4zthtv", "name": "World News", "slug": "world-news", "articleCount": 31 },
      { "id": "cmwj1nv0f000wfgl0kasif4ma", "name": "Technology", "slug": "technology", "articleCount": 21 },
      { "id": "cmwj1rqgv002mfgl06596yy78", "name": "Business", "slug": "business", "articleCount": 19 },
      { "id": "cmwj1ugx80046fgl09rncj9xe", "name": "Stock Market", "slug": "stock-market", "articleCount": 10 },
      { "id": "cmwj1uhej0051fgl0igspzdo3", "name": "Trading", "slug": "trading", "articleCount": 10 }
    ]
  }
  ```

---

### 4. `GET /api/publishers`
Returns all registered wire publishers along with their article counts.

- **Response Format (`200 OK`)**:
  ```json
  {
    "publishers": [
      { "id": "pub-1", "name": "The Guardian - World", "website": "https://www.theguardian.com", "articleCount": 11 },
      { "id": "pub-2", "name": "BBC News - World", "website": "https://www.bbc.com/news", "articleCount": 10 },
      { "id": "pub-3", "name": "Economic Times - Markets", "website": "https://economictimes.indiatimes.com", "articleCount": 10 }
    ]
  }
  ```

---

### 5. `GET /api/health`
Health check and diagnostics endpoint for monitoring and uptime probes.

- **Response Format (`200 OK`)**:
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "uptimeSeconds": 1420,
    "timestamp": "2026-11-16T15:50:00.000Z",
    "memoryUsage": { "rss": 42100000, "heapTotal": 31000000, "heapUsed": 28000000 }
  }
  ```

---

### 6. `POST /api/ingestion/trigger`
Admin endpoint to trigger an immediate ingestion cycle on-demand.

- **Headers**: `Authorization: Bearer <ADMIN_SECRET>`
- **Response Format (`200 OK`)**:
  ```json
  {
    "status": "completed",
    "results": { "articlesFound": 140, "articlesCreated": 12, "articlesSkipped": 128 }
  }
  ```

---

## 5. End-to-End System & API Flows

### Flow A: 5-Minute Ingestion & AI Processing Cycle
```
[node-cron Scheduler (Every 5 min)]
               │
               ▼
   [Check Concurrency Lock]
        (let isRunning)
               │
               ▼
[Fetch 14+ RSS Feeds via rss-parser]
  • BBC, Reuters, CNBC, Bloomberg,
    FT, Guardian, Moneycontrol, ET, TechCrunch
               │
               ▼
    [Normalize Canonical URL & Title]
    (Strip UTM tags, tracking params)
               │
               ▼
    [Check PostgreSQL Database]
  (Does canonicalUrl or title+pub exist?)
        ├── YES ──► [Skip Item (0 Gemini Calls)]
        │
        └── NO (Brand New Story Discovered!)
               │
               ▼
     [Send to Google Gemini 3.8 Flash]
     • Prompt: Strict 60-word constraint
     • Category classification
     • Extract verified $TICKERs & topics
     • If quota/timeout ──► [Deterministic 60-Word Extractor]
               │
               ▼
     [Verify 60 Words in Backend]
               │
               ▼
  [Prisma Transaction: INSERT Article, Category, Publisher]
               │
               ▼
    [Log Metrics into IngestionLog Table]
```

### Flow B: User Reading & Browsing Flow
```
[User Browser: http://localhost:5174/news]
               │
               ▼
[TanStack Query: GET /api/articles?cursor=&limit=10&category=]
               │
               ▼
    [Vite Proxy (vite.config.ts)]
               │
               ▼
   [Express API Server (Port 3001)]
               │
               ▼
  [PostgreSQL 18 Database: 'news']
  (Fast indexed SELECT query with cursor)
  * ZERO Gemini API latency *
               │
               ▼
[Returns Cached JSON: 60-Word Summaries + Verified Badges]
               │
               ▼
[Frontend Renders Responsive NewsCard Grid & Infinite Scroll]
```

---

## 6. Data Ingestion: How Data Is Fetched, Processed & Stored

The ingestion pipeline is implemented in [backend/src/ingestion/worker.ts](file:///Users/vbi/Desktop/news%20/backend/src/ingestion/worker.ts) and follows a rigorous 10-step process:

1. **Scheduled Trigger**: `node-cron` fires every 5 minutes (`*/5 * * * *`).
2. **Lock Acquisition**: Checks `isRunning` flag. If a previous cycle is still executing, it skips cleanly to prevent race conditions.
3. **Feed Iteration**: Iterates through each configured feed in [backend/src/ingestion/feeds.ts](file:///Users/vbi/Desktop/news%20/backend/src/ingestion/feeds.ts).
4. **Publisher Upsert**: Upserts the `Publisher` record by unique name so the source is always current.
5. **URL & Title Normalization**:
   - `normalizeCanonicalUrl(url)`: Strips tracking parameters (`utm_source`, `utm_medium`, `oc=5`, `fbclid`, etc.).
   - `normalizeTitle(title)`: Trims whitespace, removes publisher suffixes (e.g. ` - Reuters`, ` | BBC News`).
6. **Database Duplicate Check**:
   Queries PostgreSQL using Prisma:
   ```ts
   const existing = await prisma.article.findFirst({
     where: {
       OR: [
         { canonicalUrl },
         { AND: [{ normalizedTitle }, { publisherId: publisher.id }] }
       ]
     }
   });
   ```
   If found, the item is counted as `skipped` and discarded.
7. **Content Cleaning**: Extracts HTML snippets, strips tags, and computes word counts.
8. **Gemini AI Summarization**:
   - Sends title and text to `gemini-3.8-flash`.
   - Generates exact 60 words, category, keywords, and main topic.
   - If Gemini is rate-limited (HTTP 429), it automatically triggers `extractDeterministicSummary()` to guarantee an exact 60-word brief without failing.
9. **Category Upsert**: Upserts the category in the `Category` table by slug (e.g. `world-news`, `stock-market`, `technology`).
10. **Article Creation**:
    Inserts the new article with its exact 60-word summary, verified keywords, and timestamps:
    ```ts
    await prisma.article.create({
      data: {
        title,
        normalizedTitle,
        originalUrl: rawUrl,
        canonicalUrl,
        publisherId: publisher.id,
        categoryId: category.id,
        content: rawContent,
        summary: geminiResult.summary,
        summaryStatus: geminiResult.summaryStatus,
        geminiStatus: geminiResult.geminiStatus,
        keywords: geminiResult.keywords,
        mainTopic: geminiResult.mainTopic,
        imageUrl,
        publishedAt
      }
    });
    ```
11. **Ingestion Logging**: Records `articlesFound`, `articlesCreated`, `articlesSkipped`, `startedAt`, and `completedAt` in `IngestionLog`.

---

## 7. Frontend Architecture & Key Functions

Located under [frontend/src/](file:///Users/vbi/Desktop/news%20/frontend/src):

### Components
- **`Hero.tsx` & `HeroScene.tsx`**:
  - Arranges the studio hero on the left: Kicker (`"Not a studio — just one person"`), Display Heading (`"Interfaces for a world\nshared with machines"`), Subtitle description, and Action buttons (`[Selected Work]`, `[Quick News]`, `[Writing & Essays]`).
  - Anchors the Three.js 3D Torus Knot exclusively on the right half with interactive cursor-tracking tilt.
- **`NewsFeed.tsx`**:
  - Connects to `useArticles` hook.
  - Renders the responsive 3-column `NewsCard` grid.
  - Implements an `IntersectionObserver` sentinel element for infinite scrolling.
  - Includes a 5-minute background polling banner (`useNewArticlesPoll`) that prompts the user when new stories land in PostgreSQL.
- **`NewsCard.tsx`**:
  - Displays article headline, thumbnail image (lazy-loaded), category pill, publisher name, relative published time.
  - Displays the verified **60-word executive summary**.
  - Renders verified financial stock tickers (e.g. `$AAPL`, `$NVDA`, exchange tags) with custom emerald styling.
  - Explicit `"Read full article"` external link with `target="_blank" rel="noopener noreferrer"`.
  - Bookmark toggle button.
- **`NewsSearch.tsx`**:
  - 400ms debounced input field.
  - Uses `useRef` and value equality checks to prevent React update depth loops.
  - Synchronizes with `?search=` URL query parameters.
- **`NewsFilters.tsx`**:
  - Horizontal chip filter for categories (`All`, `Top Stories`, `World News`, `Business`, `Stock Market`, `Trading`, `Cryptocurrency`, `Technology`, `AI & Innovation`, `Science`, `Startups`, `Research`, `Robotics`, `Policy`).
- **`BookmarkButton.tsx`**:
  - Saves article IDs to `localStorage` under key `quick-news:saved`.
- **`ArticleDetail.tsx`**:
  - Dedicated route at `/article/:id`.
  - Renders the complete 60-word summary card, verified topics list, and a 3-card "More from this category" rail.

### Custom React Hooks
- **`useArticles(params)`**: Wraps `useInfiniteQuery` to paginate through `GET /api/articles`.
- **`useArticle(id)`**: Fetches a single article from `GET /api/articles/:id`.
- **`useRelatedArticles(category, currentId, limit)`**: Fetches related stories from the same category.
- **`useNewArticlesPoll(topId, filters)`**: Polls the top article ID every 5 minutes to detect newly ingested articles.
- **`useSavedArticles()`**: Synchronizes bookmarks with `localStorage`.
- **`useDebounce(value, delay)`**: Debounces user search input by 400ms.

---

## 8. Backend Architecture & Key Functions

Located under [backend/src/](file:///Users/vbi/Desktop/news%20/backend/src):

### Modules & Services
- **`index.ts`**: Server entry point. Checks database connection, initializes the Express listener on port 3001, and starts the 5-minute scheduler. Handles `SIGTERM` and `SIGINT` for graceful shutdown.
- **`app.ts`**: Configures Express, Helmet security headers, CORS origin whitelisting, and mounts API routers.
- **`config.ts`**: Validates environment variables at startup using a strict Zod schema.
- **`db.ts`**: Exports the singleton `PrismaClient` instance and provides `checkDatabaseConnection()`.
- **`services/gemini.ts`**:
  - `processArticleWithGemini()`: Calls `gemini-3.8-flash` in JSON mode.
  - `enforceExact60Words()`: Algorithmic word counter enforcing strict 60 words.
  - `extractBasicKeywords()`: Extracts verified stock tickers and high-frequency terms.
  - `normalizeCategory()`: Maps incoming categories to valid taxonomy.
- **`services/summarizer.ts`**:
  - `extractDeterministicSummary()`: Extractive 60-word algorithm used as fallback during API rate limits.
  - `countWords()`: Standardized whitespace tokenizer.
- **`ingestion/scheduler.ts`**:
  - `startScheduler()`: Starts the `node-cron` scheduled task (`*/5 * * * *`).
  - `stopScheduler()`: Safely terminates cron jobs on shutdown.
- **`ingestion/worker.ts`**:
  - `runIngestion()`: Manages the full ingestion lifecycle with concurrency locking and `IngestionLog` auditing.
  - `processSingleFeed()`: Fetches XML, normalizes URLs, deduplicates against PostgreSQL, calls Gemini, and saves articles.
- **`ingestion/normalizer.ts`**:
  - `normalizeCanonicalUrl()`: Strips marketing query parameters (`utm_*`, `oc=5`).
  - `normalizeTitle()`: Removes noise and publisher suffixes.
  - `extractImageUrl()`: Extracts enclosures or media content from RSS items.

---

## 9. Setup, Installation & Running Locally

### 1. Prerequisites
- **Node.js**: v20 or higher
- **PostgreSQL 18**: Running on `localhost:5432` with a database named `news` (or running via Docker Compose).
- **pgAdmin 4**: For visual database inspection.

### 2. Configure Backend Environment
Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:1234@localhost:5432/news?schema=public"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
GEMINI_MODEL="gemini-3.8-flash"
NEWS_INGESTION_INTERVAL_MINUTES=5
NEWS_INGESTION_ENABLED=true
ADMIN_SECRET="quicknews-admin-secret-2026"
CORS_ORIGIN="http://localhost:5173,http://localhost:5174,http://localhost:3000"
```

### 3. Synchronize Database Schema with PostgreSQL
```bash
cd backend
npm install
./node_modules/.bin/prisma db push
```
*This command pushes the schema to the `news` database in pgAdmin 4 without dropping data.*

### 4. Populate Articles (On-Demand Run)
```bash
cd backend
npm run ingest
```

### 5. Launch the Application

**Terminal 1 — Backend API Server (Port 3001):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend Application (Port 5174 / 5173):**
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **[http://localhost:5174/](http://localhost:5174/)** or directly to Quick News at **[http://localhost:5174/news](http://localhost:5174/news)**.

---

## 10. Automated Testing & Verification

The project includes unit and integration tests covering the normalizer, summarizer, and REST APIs.

Run tests in `backend/`:
```bash
cd backend
npm run test
```

### Verified Test Suite Results:
- `src/__tests__/normalizer.test.ts` (2 tests passed)
  - Canonical URL stripping of UTM parameters.
  - Title normalization and suffix cleanup.
- `src/__tests__/summarizer.test.ts` (3 tests passed)
  - Strict 60-word truncation and punctuation enforcement.
  - Deterministic extractive fallback execution.
  - Insufficient content detection for brief texts (< 25 words).
- `src/__tests__/api.test.ts` (2 tests passed)
  - Health check endpoint verification (`/api/health`).
  - Cursor-based article pagination and category filtering (`/api/articles`).

**Test Status**: `3 passed (3), 7 tests passed (7), Duration: ~500ms`.
