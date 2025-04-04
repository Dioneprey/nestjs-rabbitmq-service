import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { BullConfigModule } from './schedules/bull/bull.module'
import { MessagingModule } from './messaging/messaging.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    BullConfigModule,
    MessagingModule,
  ],
})
export class AppModule {}
