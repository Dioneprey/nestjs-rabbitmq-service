import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketService } from '../socket.service'
import { Logger } from '@nestjs/common'

@WebSocketGateway({
  cors: '*',
})
export class PingGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(PingGateway.name)

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket)
  }

  pingDevice() {
    const deviceIot = this.socketService.getClients()
    deviceIot.forEach((device) => {
      this.logger.log({
        log: `Serviço IOT pingou dispositivo: ${device.id}`,
      })
      device.emit('ping')
    })
  }
}
