import { Module, forwardRef } from '@nestjs/common'
import { PingGateway } from './gateways/ping.gateway'
import { SocketService } from './socket.service'
import { DeviceStatusGateway } from './gateways/device-status.gateway'
import { MessagingModule } from '../messaging/messaging.module'

@Module({
  imports: [forwardRef(() => MessagingModule)],
  providers: [PingGateway, DeviceStatusGateway, SocketService],
  exports: [PingGateway],
})
export class SocketModule {}
