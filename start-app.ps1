# Rapchai Full-Stack Application Startup Script
# This script starts the database, backend, and frontend in the correct order

Write-Host "Starting Rapchai Full-Stack Application..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Check if Docker is running
try {
    docker --version | Out-Null
    Write-Host "Docker is available" -ForegroundColor Green
} catch {
    Write-Host "Docker is not running or not installed. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    node --version | Out-Null
    Write-Host "✅ Node.js is available" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if ports are available
$ports = @(3000, 3001, 5432, 6379)
foreach ($port in $ports) {
    if (Test-Port $port) {
        Write-Host "Port $port is already in use. Please stop the service using this port." -ForegroundColor Yellow
    }
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Blue

# Install root dependencies
if (Test-Path "node_modules") {
    Write-Host "Root dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing root dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install root dependencies" -ForegroundColor Red
        exit 1
    }
}

# Install backend dependencies
if (Test-Path "backend/node_modules") {
    Write-Host "Backend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Set-Location ..
}

Write-Host "`nStarting database services..." -ForegroundColor Blue

# Start database services with Docker Compose (simplified version)
Set-Location backend
Write-Host "Starting PostgreSQL and Redis..." -ForegroundColor Yellow
docker-compose -f docker/docker-compose.simple.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start database services" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "Waiting for database services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if services are running
$postgresRunning = docker ps --filter "name=rapchai-postgres" --format "table {{.Names}}" | Select-String "rapchai-postgres"
$redisRunning = docker ps --filter "name=rapchai-redis" --format "table {{.Names}}" | Select-String "rapchai-redis"

if ($postgresRunning -and $redisRunning) {
    Write-Host "Database services are running" -ForegroundColor Green
} else {
    Write-Host "Some database services failed to start, but continuing..." -ForegroundColor Yellow
    Write-Host "You can use Supabase instead by running: .\start-app-supabase.ps1" -ForegroundColor Yellow
}

Set-Location ..

Write-Host "`nSetting up database..." -ForegroundColor Blue

# Generate Prisma client and run migrations
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

if ($LASTEXITCODE -ne 0) {
    Write-Host "Database migration failed" -ForegroundColor Red
    exit 1
}

Write-Host "`nSeeding database..." -ForegroundColor Blue
npx prisma db seed

Write-Host "`nStarting application services..." -ForegroundColor Blue

# Create environment files if they don't exist
if (-not (Test-Path "backend/.env")) {
    Write-Host "Creating backend environment file..." -ForegroundColor Yellow
    Copy-Item "backend/env.example" "backend/.env"
}

if (-not (Test-Path ".env.local")) {
    Write-Host "Creating frontend environment file..." -ForegroundColor Yellow
    Copy-Item "src/env.example" ".env.local"
}

Write-Host "`nStarting Backend API (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "Starting Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`nRapchai Application Started Successfully!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "Database: PostgreSQL on port 5432" -ForegroundColor White
Write-Host "Redis: Port 6379" -ForegroundColor White
Write-Host "MinIO: http://localhost:9001 (admin/minioadmin123)" -ForegroundColor White
Write-Host "`nTo stop the application:" -ForegroundColor Yellow
Write-Host "   - Close the terminal windows" -ForegroundColor White
Write-Host "   - Run: docker-compose -f backend/docker/docker-compose.local.yml down" -ForegroundColor White
Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
