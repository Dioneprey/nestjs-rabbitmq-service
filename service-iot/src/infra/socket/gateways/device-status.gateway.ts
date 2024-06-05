import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketService } from '../socket.service'
import { Logger } from '@nestjs/common'
import { DevicesStatusProducerService } from 'src/infra/messaging/rabbitmq/producers/devices-status-producer.service'

@WebSocketGateway({
  cors: '*',
})
export class DeviceStatusGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server

  private readonly logger = new Logger(DeviceStatusGateway.name)

  constructor(
    private readonly socketService: SocketService,
    private devicesStatusProducerService: DevicesStatusProducerService,
  ) {}

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket)
  }

  @SubscribeMessage('device-status')
  receiveStatus(
    @MessageBody() { deviceId, status }: { deviceId: string; status: string },
  ): void {
    this.logger.log({
      log: `Recebido status do dispositivo: ${deviceId}, status: ${status}`,
    })

    this.devicesStatusProducerService.queue({
      deviceId,
      status,
    })
  }
}
