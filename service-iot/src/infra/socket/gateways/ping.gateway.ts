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

  pingConnectedDevices() {
    const devicesIotConnected = this.socketService.getClients()
    devicesIotConnected.forEach((device) => {
      this.logger.log({
        log: `Serviço IOT pingou dispositivo: ${device.handshake.query.clientId}`,
      })
      device.emit('ping')
    })
  }

  pingDevicesById(devicesId: string[]) {
    const devicesIotConnected = this.socketService.getClients()
    devicesId.forEach((id) => {
      const device = devicesIotConnected.get(id)
      if (device) {
        this.logger.log({
          log: `Serviço IOT pingou dispositivo: ${id}`,
        })
        device.emit('ping')
      } else {
        this.logger.log({
          log: `Dispositivo ${id} não está conectado.`,
        })
      }
    })
  }
}
