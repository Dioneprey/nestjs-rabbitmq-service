import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { SocketService } from '../socket.service'
import { Logger } from '@nestjs/common'

@WebSocketGateway({
  cors: '*',
})
export class PingGateway {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(PingGateway.name)

  constructor(private readonly socketService: SocketService) {}

  pingDevice() {
    const devicesIotConnected = this.socketService.getClients()
    devicesIotConnected.forEach((device) => {
      this.logger.log({
        log: `Serviço IOT pingou dispositivo: ${device.id}`,
      })
      device.emit('ping')
    })
  }
}
