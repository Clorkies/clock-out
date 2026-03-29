# ClockOut

> A full-stack web app for Filipino OJT students to log daily hours, track progress toward their required 300 hours, and never lose count of how close they are to finally being done.

**Live Demo:** [clockout.vercel.app](https://your-app.vercel.app) &nbsp;·&nbsp; **API:** [clockout-api.railway.app/swagger](https://your-api.railway.app/swagger)

---

## Tech Stack

**Backend**
- C# / ASP.NET Core 8 Web API
- Entity Framework Core 8
- PostgreSQL
- JWT Bearer Authentication

**Frontend**
- React.js + Vite
- Tailwind CSS
- Axios

**Deployment**
- Railway — API + PostgreSQL
- Vercel — React frontend

---

## Features

- Register and log in securely with JWT authentication
- Log daily OJT hours with task description, date, and supervisor name
- Dashboard showing total hours rendered, remaining hours, and percentage complete
- Full log history with edit and delete
- Progress gauge counting down to 300 hours

---

## Project Structure

```
clock-out/
├── ClockOut.API/          # ASP.NET Core 8 Web API
│   ├── Controllers/       # Auth and Logs endpoints
│   ├── Models/            # User, LogEntry
│   ├── DTOs/              # Request and response records
│   ├── Data/              # AppDbContext
│   ├── Services/          # Business logic
│   └── Program.cs         # App setup and middleware
└── client/                # React + Vite frontend
    └── src/
        ├── lib/           # Axios instance
        ├── pages/         # Login, Register, Dashboard, Logs
        └── components/    # NavBar, LogCard, HoursGauge
```

---

## Local Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Node.js 18+](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/download) (or use the Railway instance)

---

### Backend

```bash
cd ClockOut.API
```

Create `appsettings.Development.json` in the project root (this file is gitignored):

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

Run migrations and start the server:

```bash
dotnet ef database update
dotnet run
```

Swagger UI is available at `https://localhost:5001/swagger`.

---

### Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=https://localhost:5001
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create a new account |
| POST | `/api/auth/login` | — | Returns JWT token |
| GET | `/api/logs` | ✅ | Get all logs for current user |
| POST | `/api/logs` | ✅ | Create a new log entry |
| PUT | `/api/logs/{id}` | ✅ | Update a log entry |
| DELETE | `/api/logs/{id}` | ✅ | Delete a log entry |
| GET | `/api/logs/summary` | ✅ | Get total hours, remaining, and percentage |

---

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
3. Set environment variable:

```
VITE_API_URL  =  https://your-api.railway.app
```

---

## Author

**Clorkies** — [@Clorkies](https://github.com/Clorkies)

Built as part of a 300-hour OJT application for [Full Scale](https://fullscale.io).