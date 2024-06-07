import { Module, forwardRef } from '@nestjs/common'
import { PingGateway } from './gateways/ping.gateway'
import { SocketService } from './socket.service'
import { DeviceStatusGateway } from './gateways/device-status.gateway'
import { MessagingModule } from '../messaging/messaging.module'
import { ConnectionGateway } from './gateways/connection.gateway'

@Module({
  imports: [forwardRef(() => MessagingModule)],
  providers: [
    ConnectionGateway,
    PingGateway,
    DeviceStatusGateway,
    SocketService,
  ],
  exports: [PingGateway],
})
export class SocketModule {}
