import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).optional().default('dev'),
  SOCKET_SERVER_URL: z.coerce
    .string()
    .optional()
    .default('http://localhost:3334'),
  PORT: z.coerce.number().optional().default(3335),
})

export type Env = z.infer<typeof envSchema>
