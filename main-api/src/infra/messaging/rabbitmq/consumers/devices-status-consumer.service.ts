import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'
import { RabbitMQService } from '../rabbitmq.service'

@Injectable()
export class DevicesStatusConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper
  private connection: AmqpConnectionManager

  private readonly logger = new Logger(DevicesStatusConsumerService.name)

  constructor(private rabbitMQService: RabbitMQService) {
    this.connection = this.rabbitMQService.getConnection()

    this.channelWrapper = this.connection.createChannel()
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('devices-status-queue', { durable: true })
        await channel.consume('devices-status-queue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString())
            this.logger.log({
              log: 'main-api - devices-status-queue - Received message:',
              content,
            })
            channel.ack(message)
          }
        })
      })
    } catch (err) {
      this.logger.error({
        log: 'main-api - Error starting the consumer - devices-status-queue:',
        err,
      })
    }
  }
}
