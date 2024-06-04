import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).optional().default('dev'),
  RABBITMQ_URL: z.string().optional().default('amqp://localhost'),
  PORT: z.coerce.number().optional().default(3334),
})

export type Env = z.infer<typeof envSchema>
