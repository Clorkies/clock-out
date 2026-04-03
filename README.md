<h1 align="center">ClockOut</h1>

<p align="center">
  Track OJT hours smarter. Hit your required <strong>300 hours</strong> faster.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8-512BD4?style=for-the-badge&logo=dotnet" alt=".NET 8 Badge" />
  <img src="https://img.shields.io/badge/ASP.NET_Core-Web_API-5C2D91?style=for-the-badge&logo=dotnet" alt="ASP.NET Core Badge" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=000" alt="React Badge" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL Badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Auth-JWT-0F172A?style=for-the-badge&logo=jsonwebtokens" alt="JWT Badge" />
  <img src="https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway" alt="Railway Badge" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel Badge" />
</p>

> A full-stack web app for Filipino OJT students to log daily rendered hours, monitor progress, and stay on track toward graduation requirements.
<!-- 
**Live Demo:** [clockout.vercel.app](https://your-app.vercel.app) &nbsp;·&nbsp; **API:** [clockout-api.railway.app/swagger](https://your-api.railway.app/swagger) -->

---

## Overview

**ClockOut** helps students avoid manual hour tracking by centralizing daily logs, summaries, and progress analytics in one clean dashboard.

---

## Features

- 🔐 Secure account registration and login with JWT authentication
- 📝 Daily OJT log entries with task description, date, and supervisor name
- 📊 Dashboard with total rendered hours, remaining hours, and completion percentage
- 🗂️ Full log history with edit and delete capabilities
- 🎯 Progress gauge toward the 300-hour requirement

---

## Tech Stack

### Backend
- C# / ASP.NET Core 10 Web API
- Entity Framework Core 8
- PostgreSQL
- JWT Bearer Authentication

### Frontend
- React + Vite
- Tailwind CSS

### Deployment
- Railway (API + PostgreSQL)
- Vercel (React frontend)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create a new account |
| POST | `/api/auth/login` | — | Return a JWT token |
| GET | `/api/logs` | ✅ | Get all logs for current user |
| POST | `/api/logs` | ✅ | Create a new log entry |
| PUT | `/api/logs/{id}` | ✅ | Update a log entry |
| DELETE | `/api/logs/{id}` | ✅ | Delete a log entry |
| GET | `/api/logs/summary` | ✅ | Get totals, remaining hours, and completion percent |

---

## Project Structure

## 📂 Project Structure

```text
ClockOut/
├── ClockOut.API/          # ASP.NET Core 10 Web API
│   ├── Controllers/       # REST Endpoints
│   ├── Data/              # DbContext & EF Migrations
│   ├── DTOs/              # Data Transfer Objects for API Contracts
│   ├── Models/            # Database Entities (User, LogEntry)
│   ├── Services/          # Business Logic & Repository Layer
│   └── Program.cs         # Dependency Injection & Middleware Pipeline
├── ClockOut.Web/          # React + Vite Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI (NavBar, LogCard)
│   │   ├── context/       # AuthState (JWT Management)
│   │   ├── lib/           # Axios Instance & Interceptors
│   │   └── pages/         # Dashboard, Login, Logs
│   └── package.json
└── ClockOut.slnx          # Visual Studio 2022 Solution
```

<!-- ---

## Local Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Node.js 18+](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/download)

### 1) Backend Setup

```bash
cd ClockOut.API
```

Create `appsettings.Development.json` (gitignored):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=clockout;Username=postgres;Password=yourpassword"
  },
  "Jwt": {
    "Key": "your-super-secret-key-at-least-32-characters",
    "Issuer": "clockout-api",
    "Audience": "clockout-client"
  }
}
```

Run database migrations and start the API:

```bash
dotnet ef database update
dotnet run
```

Swagger UI: `https://localhost:5001/swagger`

### 2) Frontend Setup

```bash
cd client
npm install
```

Create `.env` in `client/`:

```env
VITE_API_URL=https://localhost:5001
```

Run the frontend:

```bash
npm run dev
``` -->

<!-- 
## Deployment

### Backend — Railway

1. Push to GitHub
2. New Project → Deploy from GitHub repo → select `clock-out`
3. Set root directory to `ClockOut.API`
4. Add PostgreSQL plugin
5. Set environment variables:

```
ConnectionStrings__DefaultConnection   =  (use Railway's PostgreSQL URL)
Jwt__Key                               =  your-production-secret-key
Jwt__Issuer                            =  clockout-api
Jwt__Audience                          =  clockout-client
```

### Frontend — Vercel

1. New Project → Import from GitHub → select `clock-out`
2. Set root directory to `client`
3. Set environment variable: -->

```
VITE_API_URL  =  https://your-api.railway.app
```