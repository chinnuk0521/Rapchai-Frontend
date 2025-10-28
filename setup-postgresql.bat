@echo off
echo 🚀 Setting up PostgreSQL for Rapchai...

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed or not in PATH.
    echo 📖 Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo 📖 Make sure to add PostgreSQL to your PATH during installation.
    pause
    exit /b 1
)

REM Check if PostgreSQL service is running
pg_isready -q >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL service is not running.
    echo 📖 Please start PostgreSQL service manually:
    echo    - Open Services.msc
    echo    - Find "postgresql" service
    echo    - Start the service
    echo    - Or run: net start postgresql
    pause
    exit /b 1
)

echo 📊 Creating database and user...

REM Create database
createdb rapchai_db 2>nul || echo Database 'rapchai_db' already exists

REM Create user and grant privileges
psql -d postgres -c "CREATE USER rapchai_user WITH PASSWORD 'rapchai_password';" 2>nul || echo User 'rapchai_user' already exists
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE rapchai_db TO rapchai_user;" 2>nul || echo Privileges already granted

echo ✅ PostgreSQL setup completed!
echo.
echo 📝 Database connection details:
echo    Database: rapchai_db
echo    User: rapchai_user
echo    Password: rapchai_password
echo    Host: localhost
echo    Port: 5432
echo.
echo 🔧 Update your backend\.env file with:
echo    DATABASE_URL="postgresql://rapchai_user:rapchai_password@localhost:5432/rapchai_db?schema=public"
echo.
echo 🚀 Next steps:
echo    1. Update backend\.env with the DATABASE_URL above
echo    2. Run: cd backend ^&^& npm run prisma:migrate
echo    3. Run: cd backend ^&^& npm run prisma:seed
echo    4. Start the backend: cd backend ^&^& npm run dev
echo    5. Start the frontend: npm run dev
echo.
pause
