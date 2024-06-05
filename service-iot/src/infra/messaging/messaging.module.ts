import { Module, forwardRef } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { DevicesStatusProducerService } from './rabbitmq/producers/devices-status-producer.service'
import { PingDevicesConsumerService } from './rabbitmq/consumers/ping-devices-consumer.service'
import { RabbitMQService } from './rabbitmq/rabbitmq.service'
import { SocketModule } from '../socket/socket.module'

@Module({
  imports: [EnvModule, forwardRef(() => SocketModule)],
  providers: [
    DevicesStatusProducerService,
    PingDevicesConsumerService,
    RabbitMQService,
  ],
  exports: [
    DevicesStatusProducerService,
    PingDevicesConsumerService,
    RabbitMQService,
  ],
})
export class MessagingModule {}
