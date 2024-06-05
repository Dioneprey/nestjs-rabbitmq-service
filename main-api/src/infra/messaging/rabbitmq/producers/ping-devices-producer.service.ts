import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { Channel } from 'amqplib'
import { RabbitMQService } from '../rabbitmq.service'

@Injectable()
export class PingDevicesProducerService {
  private channelWrapper: ChannelWrapper
  private connection: AmqpConnectionManager

  private readonly logger = new Logger(PingDevicesProducerService.name)

  constructor(private rabbitMQService: RabbitMQService) {
    this.connection = this.rabbitMQService.getConnection()

    this.channelWrapper = this.connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('ping-devices-queue', { durable: true })
      },
    })
  }

  async queue() {
    try {
      await this.channelWrapper.sendToQueue(
        'ping-devices-queue',
        Buffer.from(
          JSON.stringify({
            message: 'main-api solicitando ping em dispositivos',
          }),
        ),
        {
          persistent: true,
        },
      )
      this.logger.log({
        log: 'main-api Sent To Queue - ping-devices-queue',
      })
    } catch (error) {
      throw new HttpException(
        'main-api - Error adding to queue - ping-devices-queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
