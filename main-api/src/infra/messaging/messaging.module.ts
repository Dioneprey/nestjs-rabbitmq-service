import { Module } from '@nestjs/common'
import { PingDevicesProducerService } from './rabbitmq/producers/ping-devices-producer.service'
import { EnvModule } from '../env/env.module'
import { DevicesStatusConsumerService } from './rabbitmq/consumers/devices-status-consumer.service'
import { RabbitMQService } from './rabbitmq/rabbitmq.service'

@Module({
  imports: [EnvModule],
  providers: [
    PingDevicesProducerService,
    DevicesStatusConsumerService,
    RabbitMQService,
  ],
  exports: [
    PingDevicesProducerService,
    DevicesStatusConsumerService,
    RabbitMQService,
  ],
})
export class MessagingModule {}
