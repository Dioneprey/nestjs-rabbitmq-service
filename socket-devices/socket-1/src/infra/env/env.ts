import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).optional().default('dev'),
  PORT: z.coerce.number().optional().default(3335),
})

export type Env = z.infer<typeof envSchema>
