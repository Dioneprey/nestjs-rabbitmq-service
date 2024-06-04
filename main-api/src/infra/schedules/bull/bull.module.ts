import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EnvModule } from 'src/infra/env/env.module'
import { EnvService } from 'src/infra/env/env.service'
import {
  PING_DEVICES_QUEUE,
  PingDevicesProcessor,
} from './processor/ping-devices-processor'
import { BullBoardModule } from '@bull-board/nestjs'
import { FastifyAdapter } from '@bull-board/fastify'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { MessagingModule } from 'src/infra/messaging/messaging.module'

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        redis: {
          host: envService.get('REDIS_HOST'),
          port: envService.get('REDIS_PORT'),
        },
      }),
    }),
    MessagingModule,

    // Queues
    BullModule.registerQueue({
      name: PING_DEVICES_QUEUE,
    }),

    // Bull board
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: FastifyAdapter,
    }),
    BullBoardModule.forFeature({
      name: PING_DEVICES_QUEUE,
      adapter: BullAdapter,
    }),
  ],
  providers: [PingDevicesProcessor],
  exports: [BullModule],
})
export class BullConfigModule {}
