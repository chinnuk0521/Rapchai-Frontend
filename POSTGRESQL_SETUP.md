# 🚀 PostgreSQL Setup Guide for Rapchai

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed
- Backend and frontend dependencies installed

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. Add PostgreSQL to your PATH

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Setup Database

### Option A: Use the setup script
**Windows:**
```bash
setup-postgresql.bat
```

**Linux/macOS:**
```bash
chmod +x setup-postgresql.sh
./setup-postgresql.sh
```

### Option B: Manual setup
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE rapchai_db;

-- Create user
CREATE USER rapchai_user WITH PASSWORD 'rapchai_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rapchai_db TO rapchai_user;

-- Exit
\q
```

## Step 3: Configure Backend

1. **Copy environment file:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Update `.env` file with PostgreSQL connection:**
   ```env
   DATABASE_URL="postgresql://rapchai_user:rapchai_password@localhost:5432/rapchai_db?schema=public"
   ```

3. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

4. **Seed the database with real data:**
   ```bash
   npm run prisma:seed
   ```

## Step 4: Start the Application

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

## Step 5: Verify Setup

1. **Backend should be running on:** http://localhost:3001
2. **Frontend should be running on:** http://localhost:3000
3. **API endpoints available:**
   - Health check: http://localhost:3001/api/health
   - Menu items: http://localhost:3001/api/menu/items
   - Categories: http://localhost:3001/api/menu/categories
   - Events: http://localhost:3001/api/admin/events

## Database Schema

The database includes:
- **Users** - Admin and customer accounts
- **Categories** - Menu categories (Chai/Coffee, Burgers, etc.)
- **MenuItems** - All menu items with prices, descriptions, images
- **Orders** - Customer orders with items and status
- **Events** - Rapchai events and workshops
- **Bookings** - Event bookings and reservations

## Troubleshooting

### PostgreSQL Connection Issues
- Ensure PostgreSQL service is running
- Check if the port 5432 is available
- Verify username/password in DATABASE_URL

### Migration Issues
- Make sure DATABASE_URL is correct
- Run `npm run prisma:generate` before migration
- Check if database exists and user has permissions

### Seed Issues
- Ensure migrations ran successfully
- Check if categories and menu items are created
- Verify admin user was created (admin@rapchai.com / admin123)

## Production Deployment

For production:
1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Update DATABASE_URL with production credentials
3. Run `npm run prisma:migrate:deploy` for production migrations
4. Set up proper environment variables
5. Configure Redis for caching (optional)

## Data Management

- **View data:** `npm run prisma:studio`
- **Reset database:** Drop and recreate database, then run migrations and seed
- **Add new data:** Update `prisma/seed.ts` and re-run seed script

---

🎉 **You're all set!** The frontend now fetches real data from PostgreSQL instead of using static dummy data.
