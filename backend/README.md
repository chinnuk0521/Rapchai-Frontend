# Rapchai Café Backend API

A production-ready backend API for Rapchai Café built with Fastify, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Fastify Framework**: High-performance Node.js web framework
- **TypeScript**: Full type safety and modern JavaScript features
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Redis Integration**: Caching, pub/sub, and session management
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Admin, Staff, and Customer roles
- **WebSocket Support**: Real-time communication with Redis adapter
- **Background Jobs**: BullMQ for async task processing
- **File Upload**: MinIO/S3-compatible storage
- **API Documentation**: OpenAPI/Swagger documentation
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Docker Support**: Containerized deployment
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Security**: Helmet, rate limiting, CORS, and input validation
- **Monitoring**: Structured logging with Pino and Sentry integration
- **Health Checks**: Kubernetes-ready health and readiness endpoints

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (for local development)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rapchai-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start services with Docker**
   ```bash
   npm run docker:run
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001` with documentation at `http://localhost:3001/docs`.

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Run database migrations**
   ```bash
   npm run prisma:migrate:deploy
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 🏗️ Architecture

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── schemas/         # Validation schemas
│   ├── utils/           # Utility functions
│   ├── jobs/            # Background jobs
│   ├── types/           # TypeScript types
│   └── plugins/         # Fastify plugins
├── prisma/              # Database schema and migrations
├── tests/               # Test files
├── docker/              # Docker configuration
└── docs/                # Documentation
```

### Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and user management
- **Categories**: Menu categories
- **MenuItems**: Food and beverage items
- **Orders**: Customer orders
- **OrderItems**: Individual items in orders
- **Events**: Special events and bookings
- **Bookings**: Event reservations
- **Media**: File uploads and storage

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user profile

#### Menu Management
- `GET /api/menu/categories` - Get all categories
- `POST /api/menu/categories` - Create category (admin)
- `PUT /api/menu/categories/:id` - Update category (admin)
- `DELETE /api/menu/categories/:id` - Delete category (admin)
- `GET /api/menu/items` - Get menu items
- `POST /api/menu/items` - Create menu item (admin)
- `PUT /api/menu/items/:id` - Update menu item (admin)
- `DELETE /api/menu/items/:id` - Delete menu item (admin)

#### Order Management
- `GET /api/orders` - Get orders (admin/staff)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin/staff)
- `PUT /api/orders/:id/payment` - Update payment status (admin/staff)

#### Admin Functions
- `GET /api/admin/users` - Get all users (admin)
- `POST /api/admin/users` - Create user (admin)
- `PUT /api/admin/users/:id` - Update user (admin)
- `GET /api/admin/stats` - Get system statistics (admin)

#### Health & Monitoring
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check
- `GET /api/health/metrics` - Prometheus metrics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `HOST` | Server host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |
| `MINIO_ENDPOINT` | MinIO server endpoint | `localhost` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `SENTRY_DSN` | Sentry error tracking DSN | Optional |

### Database Configuration

The application uses Prisma ORM with PostgreSQL. Database configuration is handled through the `DATABASE_URL` environment variable.

### Redis Configuration

Redis is used for:
- Session storage
- Caching
- Pub/sub messaging
- Background job queues

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows

## 🐳 Docker

### Local Development

```bash
# Start all services
npm run docker:run

# Stop all services
npm run docker:down

# Build Docker image
npm run docker:build
```

### Production Deployment

The application includes a production-ready Dockerfile optimized for:
- Multi-stage builds
- Non-root user execution
- Health checks
- Security best practices

## 🚀 Deployment

### Kubernetes

The application is designed to be deployed on Kubernetes with:
- Health checks (`/api/health/ready`, `/api/health/live`)
- Prometheus metrics (`/api/health/metrics`)
- Graceful shutdown handling
- Horizontal scaling support

### Cloud Platforms

The application can be deployed on:
- **Render**: Use the provided Dockerfile
- **Vercel**: Serverless deployment
- **Heroku**: Container deployment
- **AWS ECS/EKS**: Container orchestration
- **Google Cloud Run**: Serverless containers

## 📊 Monitoring

### Logging

The application uses structured JSON logging with Pino:
- Request/response logging
- Error tracking
- Performance metrics
- Security events

### Error Tracking

Sentry integration for:
- Error monitoring
- Performance tracking
- Release management
- User feedback

### Metrics

Prometheus-compatible metrics endpoint:
- HTTP request metrics
- Database connection metrics
- Memory usage
- CPU usage
- Custom business metrics

## 🔒 Security

### Authentication & Authorization

- JWT-based authentication
- Refresh token rotation
- Role-based access control
- Password hashing with Argon2

### Security Headers

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- SQL injection prevention (Prisma)

### Data Protection

- Environment variable validation
- Secure password hashing
- Token expiration
- Session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete API implementation
- Authentication system
- Order management
- Admin dashboard
- Docker support
- CI/CD pipeline