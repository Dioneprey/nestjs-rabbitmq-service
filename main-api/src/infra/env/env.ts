import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).optional().default('dev'),
  RABBITMQ_URL: z.string().optional().default('amqp://localhost'),
  REDIS_HOST: z.string().optional().default('localhost'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
