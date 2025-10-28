# Supabase Setup Guide for Rapchai Restaurant Management System

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `rapchai-restaurant`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your location
6. Click "Create new project"

## Step 2: Get Database Connection Details

Once your project is created:

1. Go to **Settings** → **Database**
2. Copy the **Connection string** (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Step 3: Update Environment Variables

### Root Directory (.env)
Create/update `.env` in the root directory:
```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration (optional - for future features)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### Backend Directory (backend/.env)
Create/update `backend/.env`:
```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
NODE_ENV="development"
PORT=3001

# Redis (optional - can be disabled for development)
REDIS_URL="redis://localhost:6379"
REDIS_ENABLED="false"
```

## Step 4: Install PostgreSQL Client (if needed)

If you don't have PostgreSQL client installed:
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

## Step 5: Run Prisma Commands

### Generate Prisma Client
```bash
# From root directory
npx prisma generate

# From backend directory
cd backend
npx prisma generate
```

### Run Database Migrations
```bash
# From root directory
npx prisma migrate dev --name init

# From backend directory
cd backend
npx prisma migrate dev --name init
```

## Step 6: Seed the Database

### Option 1: Using Prisma Studio
```bash
npx prisma studio
```
Then manually add data through the web interface.

### Option 2: Using Seed Script
```bash
# Run the seed script
npm run prisma:seed
```

## Step 7: Test the Connection

### Test Backend Connection
```bash
cd backend
npm run dev
```

### Test Frontend Connection
```bash
npm run dev
```

## Benefits of Using Supabase

1. **PostgreSQL Database**: Robust, scalable database
2. **Real-time Subscriptions**: Get live updates (useful for order tracking)
3. **Built-in Authentication**: Can replace custom JWT auth
4. **Row Level Security**: Database-level security
5. **Automatic Backups**: Built-in backup system
6. **Scalability**: Handles traffic spikes automatically
7. **Free Tier**: Generous free tier for development

## Next Steps (Optional)

1. **Enable Row Level Security**: Add database policies
2. **Set up Real-time**: Enable real-time subscriptions for orders
3. **Use Supabase Auth**: Replace custom JWT with Supabase Auth
4. **Add Storage**: Use Supabase Storage for images
5. **Add Edge Functions**: Serverless functions for complex operations

## Troubleshooting

### Connection Issues
- Check if your IP is whitelisted in Supabase dashboard
- Verify the connection string format
- Ensure the database password is correct

### Migration Issues
- Make sure Prisma client is generated: `npx prisma generate`
- Check if all required environment variables are set
- Verify the database URL format

### Authentication Issues
- Ensure JWT_SECRET is set in backend/.env
- Check if the token is not expired
- Verify the user exists in the database
