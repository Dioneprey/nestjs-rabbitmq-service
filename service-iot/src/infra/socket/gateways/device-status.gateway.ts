import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Logger } from '@nestjs/common'
import { DevicesStatusProducerService } from 'src/infra/messaging/rabbitmq/producers/devices-status-producer.service'

@WebSocketGateway({
  cors: '*',
})
export class DeviceStatusGateway {
  @WebSocketServer() server: Server

  private readonly logger = new Logger(DeviceStatusGateway.name)

  constructor(
    private devicesStatusProducerService: DevicesStatusProducerService,
  ) {}

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
