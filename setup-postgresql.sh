#!/bin/bash

# PostgreSQL Setup Script for Rapchai
echo "🚀 Setting up PostgreSQL for Rapchai..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "📖 Installation guide:"
    echo "   - Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   - macOS: brew install postgresql"
    echo "   - Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL service is not running. Starting it..."
    # Try to start PostgreSQL service
    if command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql
    elif command -v brew &> /dev/null; then
        brew services start postgresql
    else
        echo "❌ Please start PostgreSQL service manually"
        exit 1
    fi
fi

# Create database and user
echo "📊 Creating database and user..."

# Create database
createdb rapchai_db 2>/dev/null || echo "Database 'rapchai_db' already exists"

# Create user (if it doesn't exist)
psql -d postgres -c "CREATE USER rapchai_user WITH PASSWORD 'rapchai_password';" 2>/dev/null || echo "User 'rapchai_user' already exists"

# Grant privileges
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE rapchai_db TO rapchai_user;" 2>/dev/null || echo "Privileges already granted"

echo "✅ PostgreSQL setup completed!"
echo ""
echo "📝 Database connection details:"
echo "   Database: rapchai_db"
echo "   User: rapchai_user"
echo "   Password: rapchai_password"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "🔧 Update your .env file with:"
echo "   DATABASE_URL=\"postgresql://rapchai_user:rapchai_password@localhost:5432/rapchai_db?schema=public\""
echo ""
echo "🚀 Next steps:"
echo "   1. Update backend/.env with the DATABASE_URL above"
echo "   2. Run: cd backend && npm run prisma:migrate"
echo "   3. Run: cd backend && npm run prisma:seed"
echo "   4. Start the backend: cd backend && npm run dev"
echo "   5. Start the frontend: npm run dev"
