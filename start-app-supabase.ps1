# Rapchai Full-Stack Application Startup Script (Supabase Version)
# This script starts the backend and frontend with Supabase database

Write-Host "Starting Rapchai Full-Stack Application..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    node --version | Out-Null
    Write-Host "Node.js is available" -ForegroundColor Green
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
$ports = @(3000, 3001)
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

Write-Host "`nSetting up database..." -ForegroundColor Blue

# Create environment files if they don't exist
if (-not (Test-Path "backend/.env")) {
    Write-Host "Creating backend environment file..." -ForegroundColor Yellow
    Copy-Item "backend/env.example" "backend/.env"
    Write-Host "Please update backend/.env with your Supabase database URL and credentials" -ForegroundColor Yellow
}

if (-not (Test-Path ".env.local")) {
    Write-Host "Creating frontend environment file..." -ForegroundColor Yellow
    Copy-Item "src/env.example" ".env.local"
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Check if database is accessible
Write-Host "Checking database connection..." -ForegroundColor Yellow
try {
    npx prisma db pull --print
    Write-Host "Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "Database connection failed. Please check your Supabase credentials in backend/.env" -ForegroundColor Red
    Write-Host "Make sure your DATABASE_URL is correct and Supabase is running" -ForegroundColor Yellow
}

Write-Host "`nStarting application services..." -ForegroundColor Blue

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
Write-Host "Database: Supabase (configured in backend/.env)" -ForegroundColor White
Write-Host "`nTo stop the application:" -ForegroundColor Yellow
Write-Host "   - Close the terminal windows" -ForegroundColor White
Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
