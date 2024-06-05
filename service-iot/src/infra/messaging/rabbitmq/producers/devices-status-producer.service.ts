import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { Channel } from 'amqplib'
import { RabbitMQService } from '../rabbitmq.service'

@Injectable()
export class DevicesStatusProducerService {
  private channelWrapper: ChannelWrapper
  private connection: AmqpConnectionManager

  private readonly logger = new Logger(DevicesStatusProducerService.name)

  constructor(private rabbitMQService: RabbitMQService) {
    this.connection = this.rabbitMQService.getConnection()

    this.channelWrapper = this.connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('devices-status-queue', { durable: true })
      },
    })
  }

  async queue() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000))

      await this.channelWrapper.sendToQueue(
        'devices-status-queue',
        Buffer.from(JSON.stringify({ status: 'alive' })),
        {
          persistent: true,
        },
      )
      this.logger.log('service-iot - Sent To Queue - devices-status-queue')
    } catch (error) {
      throw new HttpException(
        'service-iot - Error adding to queue - devices-status-queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
