# UGC Ads Generator

AI-powered platform that generates professional UGC (User Generated Content) lifestyle images and videos for product marketing. Upload product and model photos, and the AI creates stunning commercial-ready content.

## Features

- **JWT Authentication** — Register, login, and protected routes
- **AI Image Generation** — Generates lifestyle product photos using Pollinations.ai (free, no API key)
- **Credits System** — 1000 credits on signup, 5 per image, 10 per video
- **Project Management** — Create, view, delete, publish/unpublish projects
- **Community Gallery** — Browse published projects from all users
- **Responsive UI** — Built with React, Tailwind CSS, and Framer Motion

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite, Framer Motion |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| AI | Pollinations.ai (free image generation) |
| Auth | JWT + bcryptjs |

## Project Structure

```
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # Auth context
│   │   ├── configs/       # Axios setup
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                # Express backend
│   ├── configs/           # Prisma, Multer
│   ├── controllers/       # Route handlers
│   ├── middlewares/        # Auth middleware
│   ├── prisma/            # Schema & migrations
│   ├── routes/            # API routes
│   ├── services/          # AI generation service
│   └── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Installation

```bash
# Clone the repo
git clone https://github.com/shreyaspareek01/UGC-Ads-Generator.git
cd UGC-Ads-Generator

# Install server dependencies
cd server
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run migrations
npx prisma migrate dev

# Start server
npm run server
```

```bash
# In a new terminal, install client dependencies
cd client
npm install

# Start client
npm run dev
```

### Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/ugc-project
JWT_SECRET=your-secret-key
BASE_URL=http://localhost:5000
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/project/create` | Create project + generate image |
| POST | `/api/project/generate-video/:id` | Generate video |
| GET | `/api/project/status/:id` | Check generation status |
| GET | `/api/project/published` | Get published projects |
| DELETE | `/api/project/:id` | Delete project |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/credits` | Get credit balance |
| GET | `/api/user/projects` | Get user's projects |
| GET | `/api/user/projects/:id` | Get project by ID |
| GET | `/api/user/publish/:id` | Toggle publish status |

## Credits

| Action | Cost |
|--------|------|
| Image Generation | 5 credits |
| Video Generation | 10 credits |
| New Account | 1000 credits |
