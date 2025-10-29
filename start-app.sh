#!/bin/bash

# Rapchai Full-Stack Application Startup Script
# This script starts the database, backend, and frontend in the correct order

echo "🚀 Starting Rapchai Full-Stack Application..."
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed or not running. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is available${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js is available${NC}"

# Check if ports are available
ports=(3000 3001 5432 6379)
for port in "${ports[@]}"; do
    if port_in_use $port; then
        echo -e "${YELLOW}⚠️  Port $port is already in use. Please stop the service using this port.${NC}"
    fi
done

echo -e "\n${BLUE}📦 Installing dependencies...${NC}"

# Install root dependencies
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Root dependencies already installed${NC}"
else
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install root dependencies${NC}"
        exit 1
    fi
fi

# Install backend dependencies
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
else
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
    cd ..
fi

echo -e "\n${BLUE}🗄️  Starting database services...${NC}"

# Start database services with Docker Compose
cd backend
echo -e "${YELLOW}Starting PostgreSQL, Redis, and MinIO...${NC}"
docker-compose -f docker/docker-compose.local.yml up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start database services${NC}"
    exit 1
fi

# Wait for services to be ready
echo -e "${YELLOW}Waiting for database services to be ready...${NC}"
sleep 10

# Check if services are running
if docker ps --filter "name=rapchai-postgres" --format "table {{.Names}}" | grep -q "rapchai-postgres" && \
   docker ps --filter "name=rapchai-redis" --format "table {{.Names}}" | grep -q "rapchai-redis"; then
    echo -e "${GREEN}✅ Database services are running${NC}"
else
    echo -e "${RED}❌ Database services failed to start${NC}"
    exit 1
fi

cd ..

echo -e "\n${BLUE}🔧 Setting up database...${NC}"

# Generate Prisma client and run migrations
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate

echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
fi

echo -e "\n${BLUE}🌱 Seeding database...${NC}"
npx prisma db seed

echo -e "\n${BLUE}🚀 Starting application services...${NC}"

# Create environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating backend environment file...${NC}"
    cp backend/env.example backend/.env
fi

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating frontend environment file...${NC}"
    cp src/env.example .env.local
fi

echo -e "\n${CYAN}🎯 Starting Backend API (Port 3001)...${NC}"
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo -e "${CYAN}🎨 Starting Frontend (Port 3000)...${NC}"
cd .. && npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}🎉 Rapchai Application Started Successfully!${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "${WHITE}📱 Frontend: http://localhost:3000${NC}"
echo -e "${WHITE}🔧 Backend API: http://localhost:3001${NC}"
echo -e "${WHITE}🗄️  Database: PostgreSQL on port 5432${NC}"
echo -e "${WHITE}⚡ Redis: Port 6379${NC}"
echo -e "${WHITE}📁 MinIO: http://localhost:9001 (admin/minioadmin123)${NC}"
echo -e "\n${YELLOW}💡 To stop the application:${NC}"
echo -e "${WHITE}   - Press Ctrl+C to stop this script${NC}"
echo -e "${WHITE}   - Run: docker-compose -f backend/docker/docker-compose.local.yml down${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping application...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Application stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait

