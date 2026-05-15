# HeadlineHub 📰

A real-time news aggregator dashboard built with Next.js, Express, PostgreSQL, and Socket.IO.

![CI Pipeline](https://github.com/usmandilmeer/HeadlineHub/actions/workflows/ci.yml/badge.svg)

## Features

- 📡 Live news feed from NewsAPI.org by category
- 🗄️ PostgreSQL caching to minimize API calls
- 🔐 JWT authentication via httpOnly cookies
- 🔖 Save favourite articles (authenticated users only)
- ⚡ Real-time notifications via Socket.IO every 5 minutes
- 🐳 Fully Dockerized with docker-compose

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 16 |
| Real-Time | Socket.IO |
| Auth | JWT (httpOnly cookies) |
| 3rd Party API | NewsAPI.org |
| Deployment | Docker + docker-compose |

## Project Structure

```
HeadlineHub/
├── backend/          # Express.js API
├── frontend/         # Next.js app
├── .env.example      # Environment variable reference
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml    # GitHub Actions CI pipeline
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [NewsAPI.org](https://newsapi.org/register) free API key

### 1. Clone the repository

```bash
git clone https://github.com/usmandilmeer/HeadlineHub.git
cd HeadlineHub
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your real values:

```env
JWT_SECRET=your_strong_secret_here
NEWS_API_KEY=your_newsapi_key_here
```

### 3. Run with Docker

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3008 |
| Backend API | http://localhost:5001 |
| PostgreSQL | localhost:5434 |

### 4. Run locally (without Docker)

**Backend:**
```bash
cd backend
cp .env.example .env   # fill in DB_HOST=localhost, DB_PORT=5432
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/logout` | ❌ | Logout user |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/news?category=technology` | ❌ | Get news by category |
| GET | `/api/news/search?q=keyword` | ❌ | Search articles |
| GET | `/api/favourites` | ✅ | Get saved articles |
| POST | `/api/favourites` | ✅ | Save an article |
| DELETE | `/api/favourites/:article_id` | ✅ | Remove saved article |
| GET | `/api/favourites/check/:article_id` | ✅ | Check if article is saved |

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable | Description |
|---|---|
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | PostgreSQL database name |
| `DB_HOST` | Database host (`postgres` for Docker, `localhost` for local) |
| `DB_PORT` | Database port (`5432` for Docker, `5434` for local) |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`) |
| `NEWS_API_KEY` | Your [NewsAPI.org](https://newsapi.org) API key |
| `CLIENT_URL` | Frontend URL for CORS |
| `NEXT_PUBLIC_API_URL` | Backend API URL for frontend |
| `NEXT_PUBLIC_SOCKET_URL` | Backend Socket.IO URL for frontend |

## CI/CD

This project uses GitHub Actions for CI. On every push to `main`:

- ✅ Backend syntax check
- ✅ Frontend lint
- ✅ Frontend build

## License

MIT