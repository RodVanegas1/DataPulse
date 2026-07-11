import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  APP_NAME: z.string().default('Territorial Intelligence Platform API'),
  APP_VERSION: z.string().default('0.1.0'),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  LOG_LEVEL: z.string().default('info'),
  AI_PROVIDER: z.enum(['mock', 'openai', 'gemini', 'local']).default('mock'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const config = parsed.data;
export type AppConfig = typeof config;
