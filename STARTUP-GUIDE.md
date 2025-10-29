# Rapchai Full-Stack Application Startup Scripts

These scripts will start your complete Rapchai application stack with a single command.

## What the scripts do:

1. **Check Prerequisites** - Verify Docker and Node.js are installed
2. **Install Dependencies** - Install npm packages for frontend and backend
3. **Start Database Services** - Launch PostgreSQL, Redis, and MinIO using Docker
4. **Setup Database** - Run Prisma migrations and seed the database
5. **Start Services** - Launch backend API and frontend application

## Usage:

### Windows (PowerShell):
```powershell
.\start-app.ps1
```

### Linux/macOS (Bash):
```bash
./start-app.sh
```

## Services Started:

- **Frontend**: http://localhost:3000 (Next.js)
- **Backend API**: http://localhost:3001 (Fastify)
- **Database**: PostgreSQL on port 5432
- **Redis**: Port 6379
- **MinIO**: http://localhost:9001 (admin/minioadmin123)

## Prerequisites:

- Docker Desktop running
- Node.js (v20+) installed
- npm installed

## Stopping the Application:

- **Windows**: Close the terminal windows or press Ctrl+C
- **Linux/macOS**: Press Ctrl+C in the terminal
- **Database**: Run `docker-compose -f backend/docker/docker-compose.local.yml down`

## Troubleshooting:

1. **Port conflicts**: Make sure ports 3000, 3001, 5432, and 6379 are not in use
2. **Docker not running**: Start Docker Desktop before running the script
3. **Permission errors**: On Linux/macOS, make sure the script is executable: `chmod +x start-app.sh`

## Environment Files:

The scripts will automatically create `.env` files from the examples if they don't exist:
- `backend/.env` (from `backend/env.example`)
- `.env.local` (from `src/env.example`)

