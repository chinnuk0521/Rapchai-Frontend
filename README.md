# Rapchai Cafe - Restaurant Management System

A complete restaurant management system with separate customer and admin applications, built with Next.js, TypeScript, and a Fastify backend.

## 🏗️ Architecture

This project consists of three main components:

1. **Customer App** (`/`) - Customer-facing website for browsing menu, placing orders, and viewing events
2. **Admin App** (`/admin`) - Staff dashboard for managing orders, menu, and analytics  
3. **Backend API** (`/backend`) - Fastify-based REST API with PostgreSQL database

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd rapchai
npm install
cd admin && npm install
cd ../backend && npm install
```

2. **Set up the database:**
```bash
# Copy environment file
cp backend/env.example backend/.env

# Update DATABASE_URL in backend/.env with your PostgreSQL connection string
# Example: DATABASE_URL="postgresql://username:password@localhost:5432/rapchai_db?schema=public"

# Run migrations and seed data
cd backend
npx prisma migrate dev
npx prisma db seed
```

3. **Start all services:**
```bash
# From the root directory
npm run dev:all
```

This will start:
- Customer app on `http://localhost:3000`
- Admin app on `http://localhost:3002` 
- Backend API on `http://localhost:3001`

## 📱 Applications

### Customer App (Port 3000)
- **Menu browsing** with categories and filters
- **Order placement** with cart functionality
- **Event listings** and booking
- **Responsive design** for mobile and desktop

### Admin App (Port 3002)
- **Order management** - view and update order statuses
- **Menu management** - add/edit/delete items and categories
- **Bulk upload** - CSV import for menu items
- **Image management** - upload and manage item images
- **Analytics** - daily sales and reports

**Admin Credentials:**
- Username: `admin`
- Password: `rapchai123`

### Backend API (Port 3001)
- **RESTful API** with Fastify framework
- **PostgreSQL** database with Prisma ORM
- **JWT authentication** for secure endpoints
- **Comprehensive error handling** and validation

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start customer app only
- `npm run dev:admin` - Start admin app only  
- `npm run dev:all` - Start both apps concurrently
- `npm run build` - Build customer app
- `npm run build:admin` - Build admin app
- `npm run build:all` - Build both apps

### Backend
- `npm run dev` - Start API server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with sample data

## 🗄️ Database Schema

The system uses PostgreSQL with the following main entities:

- **Users** - Customer and admin accounts
- **Categories** - Menu item categories
- **MenuItems** - Individual menu items with pricing
- **Orders** - Customer orders with items
- **Events** - Restaurant events and bookings
- **Bookings** - Event reservations

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/rapchai_db?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
ADMIN_PASSWORD="admin123"
```

**Frontend** (both apps):
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## 🚀 Deployment

### Customer App
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

### Admin App  
1. Build: `npm run build:admin`
2. Deploy separately for enhanced security

### Backend API
1. Build: `npm run build`
2. Deploy to Railway, Heroku, or your preferred platform
3. Set up PostgreSQL database
4. Run migrations: `npx prisma migrate deploy`

## 🎨 Features

### Customer Features
- ✅ Responsive menu browsing
- ✅ Shopping cart functionality
- ✅ Order placement with multiple payment options
- ✅ Event listings and booking
- ✅ Real-time order tracking
- ✅ Mobile-optimized interface

### Admin Features
- ✅ Order management dashboard
- ✅ Menu item CRUD operations
- ✅ Category management
- ✅ Bulk CSV upload
- ✅ Image upload and management
- ✅ Sales analytics and reports
- ✅ User management

### Technical Features
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Prisma ORM for database operations
- ✅ JWT authentication
- ✅ RESTful API design
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions, please open an issue in the GitHub repository.