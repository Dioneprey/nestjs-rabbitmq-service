import { Module } from '@nestjs/common'
import { PingGateway } from './gateways/ping.gateway'
import { SocketService } from './socket.service'

@Module({
  providers: [PingGateway, SocketService],
  exports: [PingGateway],
})
export class SocketModule {}
