import { Injectable, Logger } from '@nestjs/common'
import { Socket } from 'socket.io'

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map()
  private readonly logger = new Logger(SocketService.name)

  handleConnection(socket: Socket): void {
    const clientId = socket.id
    this.connectedClients.set(clientId, socket)
    this.logger.log({
      log: 'Cliente socket conectou ao servidor',
      id: clientId,
    })

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId)
    })
  }

  getClients() {
    return this.connectedClients
  }
}
