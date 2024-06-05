import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketService } from '../socket.service'

@WebSocketGateway({
  cors: '*',
})
export class PingGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket)
  }

  @SubscribeMessage('ping')
  handleJoin(
    @MessageBody() payload: { userId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(payload.userId)
    console.log('Serviço IOT pingou dispositivo')
  }
}
