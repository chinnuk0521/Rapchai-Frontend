import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/services/auth.service.js';
import { asyncHandler } from '@/middleware/error.middleware.js';
import { authMiddleware, adminMiddleware } from '@/middleware/auth.middleware.js';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenSchema, 
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
  paginationSchema 
} from '@/schemas/index.js';
import logger from '@/utils/logger.js';

export async function authRoutes(fastify: FastifyInstance) {
  // Register user
  fastify.post('/register', {
    schema: {
      description: 'Register a new user',
      tags: ['Authentication'],
      body: registerSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await AuthService.register(request.body as any);
    return reply.status(201).send(result);
  }));

  // Login user
  fastify.post('/login', {
    schema: {
      description: 'Login user',
      tags: ['Authentication'],
      body: loginSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await AuthService.login(request.body as any);
    return reply.send(result);
  }));

  // Refresh token
  fastify.post('/refresh', {
    schema: {
      description: 'Refresh access token',
      tags: ['Authentication'],
      body: refreshTokenSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await AuthService.refreshToken(request.body as any);
    return reply.send(result);
  }));

  // Logout user
  fastify.post('/logout', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Logout user',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const result = await AuthService.logout(user.id);
    return reply.send(result);
  }));

  // Change password
  fastify.post('/change-password', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Change user password',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      body: changePasswordSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const result = await AuthService.changePassword(user.id, request.body as any);
    return reply.send(result);
  }));

  // Get current user profile
  fastify.get('/me', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get current user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            user: { type: 'object' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const result = await AuthService.getUserById(user.id);
    return reply.send({ user: result });
  }));

  // Admin routes
  // Create user (admin only)
  fastify.post('/admin/users', {
    preHandler: [adminMiddleware],
    schema: {
      description: 'Create a new user (admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      body: createUserSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            user: { type: 'object' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await AuthService.createUser(request.body as any);
    return reply.status(201).send({ user: result });
  }));

  // Get all users (admin only)
  fastify.get('/admin/users', {
    preHandler: [adminMiddleware],
    schema: {
      description: 'Get all users (admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      querystring: paginationSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            users: { type: 'array' },
            pagination: { type: 'object' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = request.query as any;
    const result = await AuthService.getAllUsers(page, limit);
    return reply.send(result);
  }));

  // Get user by ID (admin only)
  fastify.get('/admin/users/:id', {
    preHandler: [adminMiddleware],
    schema: {
      description: 'Get user by ID (admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: { type: 'object' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const result = await AuthService.getUserById(id);
    return reply.send({ user: result });
  }));

  // Update user (admin only)
  fastify.put('/admin/users/:id', {
    preHandler: [adminMiddleware],
    schema: {
      description: 'Update user (admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: updateUserSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: { type: 'object' },
          },
        },
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const result = await AuthService.updateUser(id, request.body as any);
    return reply.send({ user: result });
  }));
}
