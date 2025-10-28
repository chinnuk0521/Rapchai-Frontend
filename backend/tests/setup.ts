import { FastifyInstance } from 'fastify';
import { createApp } from '@/app.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createApp();
  await app.ready();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});

export { app };
