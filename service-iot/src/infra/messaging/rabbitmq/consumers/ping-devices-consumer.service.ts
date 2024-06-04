import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'
import { RabbitMQService } from '../rabbitmq.service'
import { DevicesStatusProducerService } from '../producers/devices-status-producer.service'

@Injectable()
export class PingDevicesConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper
  private connection: AmqpConnectionManager

  private readonly logger = new Logger(PingDevicesConsumerService.name)

  constructor(
    private rabbitMQService: RabbitMQService,
    private devicesStatusProducerService: DevicesStatusProducerService,
  ) {
    this.connection = this.rabbitMQService.getConnection()

    this.channelWrapper = this.connection.createChannel()
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('ping-devices-queue', { durable: true })
        await channel.consume('ping-devices-queue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString())
            this.logger.log(
              'service-iot - ping-devices-queue - Received message:',
              content,
            )
            channel.ack(message)

            await this.devicesStatusProducerService.queue()
          }
        })
      })
    } catch (err) {
      this.logger.error(
        'service-iot - Error starting the consumer - ping-devices-queue:',
        err,
      )
    }
  }
}
