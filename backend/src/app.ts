import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { env } from '@/config/env.js';
import { connectDatabase, connectRedis } from '@/config/index.js';
import logger from '@/utils/logger.js';

// Import plugins
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// Import routes
import authRoutes from '@/routes/auth.routes.js';
import menuRoutes from '@/routes/menu.routes.js';
import orderRoutes from '@/routes/order.routes.js';
import adminRoutes from '@/routes/admin.routes.js';
import healthRoutes from '@/routes/health.routes.js';

// Import middleware
import { errorHandler } from '@/middleware/error.middleware.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';

export async function createApp(options: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: logger.child({ service: 'rapchai-api' }),
    ...options,
  });

  // Register error handler
  app.setErrorHandler(errorHandler);

  // Register security plugins
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  await app.register(cors, {
    origin: env.NODE_ENV === 'production' 
      ? ['https://rapchai.com', 'https://www.rapchai.com']
      : true,
    credentials: true,
  });

  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW,
    errorResponseBuilder: (request, context) => ({
      error: 'Rate limit exceeded',
      statusCode: 429,
      message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
      retryAfter: Math.round(context.ttl / 1000),
    }),
  });

  // Register multipart for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: env.MAX_FILE_SIZE,
    },
  });

  // Register Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Rapchai Café API',
        description: 'Production-ready backend API for Rapchai Café',
        version: '1.0.0',
        contact: {
          name: 'Rapchai Team',
          email: 'contact@rapchai.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: env.NODE_ENV === 'production' 
            ? 'https://api.rapchai.com' 
            : `http://localhost:${env.PORT}`,
          description: env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  // Register routes
  await app.register(healthRoutes, { prefix: '/api/health' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(menuRoutes, { prefix: '/api/menu' });
  await app.register(orderRoutes, { prefix: '/api/orders' });
  await app.register(adminRoutes, { prefix: '/api/admin' });

  // Root route
  app.get('/', async (request, reply) => {
    return {
      message: 'Welcome to Rapchai Café API',
      version: '1.0.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      docs: '/docs',
    };
  });

  // 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
    });
  });

  return app;
}

export async function startServer(): Promise<void> {
  try {
    // Connect to external services
    await connectDatabase();
    await connectRedis();

    // Create and start the server
    const app = await createApp();
    
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
    logger.info(`📚 API Documentation available at http://${env.HOST}:${env.PORT}/docs`);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
