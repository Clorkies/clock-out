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
- Supabase (PostgreSQL)
- Railway (API)
- Vercel (React frontend)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create a new account |
| POST | `/api/auth/login` | — | Return a JWT token |
| GET | `/api/me` | ✅ | Get current authenticated user |
| PUT | `/api/me` | ✅ | Update profile and required hours |
| GET | `/api/logs` | ✅ | Get all logs for current user |
| POST | `/api/logs` | ✅ | Create a new log entry |
| PUT | `/api/logs/{id}` | ✅ | Update a log entry |
| DELETE | `/api/logs/{id}` | ✅ | Delete a log entry |
| GET | `/api/logs/summary` | ✅ | Get totals, remaining hours, and completion percent |

---

## Project Structure

```text
ClockOut/
├── ClockOut.API/          # ASP.NET Core 10 Web API
│   ├── Controllers/       # REST Endpoints
│   ├── Data/              # DbContext & EF Migrations
│   ├── DTOs/              # Data Transfer Objects for API Contracts
│   ├── Models/            # Database Entities (User, LogEntry)
│   ├── Services/          # JWT + Password Services
│   └── Program.cs         # Dependency Injection & Middleware Pipeline
├── ClockOut.Web/          # React + Vite Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI
│   │   ├── hooks/         # Theme hooks
│   │   ├── lib/           # API + Auth utilities
│   │   ├── pages/         # Landing, Login, Signup, Dashboard
│   │   └── types/         # API contract types
│   └── package.json
└── ClockOut.slnx          # Visual Studio 2022 Solution
```