# Rapchai Backend API

A production-ready backend API for Rapchai Café built with Fastify, TypeScript, Prisma, and Redis.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Menu Management**: Full CRUD operations for categories and menu items
- **Order Management**: Complete order lifecycle with status tracking
- **Admin Dashboard**: Analytics, event management, and system settings
- **Caching**: Redis-based caching for improved performance
- **Rate Limiting**: Built-in rate limiting for API protection
- **File Uploads**: Support for image uploads with MinIO/S3
- **Health Checks**: Comprehensive health monitoring endpoints
- **API Documentation**: Auto-generated Swagger documentation

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify 5.x
- **Language**: TypeScript
- **Database**: SQLite (with Prisma ORM)
- **Cache**: Redis
- **Authentication**: JWT with Argon2 password hashing
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `POST /logout` - User logout
- `POST /change-password` - Change password
- `GET /me` - Get current user profile
- `POST /admin/users` - Create user (admin only)
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/users/:id` - Get user by ID (admin only)
- `PUT /admin/users/:id` - Update user (admin only)

### Menu (`/api/menu`)
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (admin only)
- `PUT /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)
- `GET /items` - Get all menu items
- `GET /items/:id` - Get menu item by ID
- `POST /items` - Create menu item (admin only)
- `PUT /items/:id` - Update menu item (admin only)
- `DELETE /items/:id` - Delete menu item (admin only)
- `PATCH /items/:id/toggle-availability` - Toggle item availability (admin only)
- `GET /categories/:id/items` - Get items by category
- `GET /search` - Search menu items

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /` - Get all orders (admin only)
- `GET /:id` - Get order by ID
- `GET /customer/:phone` - Get orders by customer phone
- `PATCH /:id/status` - Update order status (admin only)
- `PATCH /:id/payment-status` - Update payment status (admin only)
- `PATCH /:id/cancel` - Cancel order
- `GET /analytics/summary` - Get order analytics (admin only)
- `GET /status/:status` - Get orders by status (admin only)
- `GET /today` - Get today's orders (admin only)

### Admin (`/api/admin`)
- `GET /dashboard` - Get dashboard analytics (admin only)
- `GET /events` - Get all events (admin only)
- `GET /events/:id` - Get event by ID (admin only)
- `POST /events` - Create event (admin only)
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)
- `GET /bookings` - Get all bookings (admin only)
- `GET /bookings/:id` - Get booking by ID (admin only)
- `PATCH /bookings/:id/status` - Update booking status (admin only)
- `GET /media` - Get all media (admin only)
- `POST /media/upload` - Upload media (admin only)
- `DELETE /media/:id` - Delete media (admin only)
- `GET /settings` - Get system settings (admin only)
- `PUT /settings` - Update system settings (admin only)
- `GET /reports/sales` - Get sales report (admin only)
- `GET /reports/customers` - Get customer analytics (admin only)

### Health (`/api/health`)
- `GET /` - Basic health check
- `GET /detailed` - Detailed health check with service status
- `GET /ready` - Readiness check for Kubernetes
- `GET /live` - Liveness check for Kubernetes
- `GET /metrics` - Prometheus metrics endpoint

## Setup Instructions

### Prerequisites

- Node.js 20+ 
- npm 10+
- Redis server
- SQLite (included with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chinnuk0521/Rapchai.git
   cd Rapchai/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3001
   HOST=0.0.0.0
   DATABASE_URL="file:./dev.db"
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
   ```

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start Redis server**
   ```bash
   redis-server
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`
API documentation will be available at `http://localhost:3001/docs`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:migrate:deploy` - Deploy migrations to production
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio
- `npm run type-check` - Run TypeScript type checking

## Database Schema

The application uses Prisma ORM with SQLite database. Key models include:

- **User**: User accounts with authentication
- **Category**: Menu categories
- **MenuItem**: Individual menu items
- **Order**: Customer orders
- **OrderItem**: Items within orders
- **Event**: Restaurant events
- **Booking**: Event bookings
- **Media**: File uploads

## Authentication

The API uses JWT-based authentication with:

- **Access Tokens**: Short-lived (15 minutes) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Password Hashing**: Argon2id for secure password storage
- **Role-based Access**: ADMIN and CUSTOMER roles

## Caching

Redis is used for:

- User session caching
- Menu item caching
- Order status caching
- API response caching

## Rate Limiting

Built-in rate limiting protects against abuse:

- Default: 100 requests per minute per IP
- Configurable via environment variables
- Different limits for different endpoints

## Error Handling

Comprehensive error handling with:

- Custom error classes
- Structured error responses
- Request validation with Zod
- Database error mapping
- JWT error handling

## Monitoring

Health check endpoints for monitoring:

- Basic health check
- Detailed service status
- Kubernetes readiness/liveness probes
- Prometheus metrics

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection (Prisma)
- XSS protection
- CSRF protection

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production database (PostgreSQL recommended)
3. Configure proper JWT secrets
4. Set up Redis cluster
5. Configure file storage (MinIO/S3)
6. Set up monitoring and logging
7. Use a reverse proxy (nginx)
8. Enable HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.