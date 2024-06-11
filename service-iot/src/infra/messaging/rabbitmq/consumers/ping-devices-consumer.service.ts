import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'
import { RabbitMQService } from '../rabbitmq.service'
import { PingGateway } from 'src/infra/socket/gateways/ping.gateway'

@Injectable()
export class PingDevicesConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper
  private connection: AmqpConnectionManager

  private readonly logger = new Logger(PingDevicesConsumerService.name)

  constructor(
    private rabbitMQService: RabbitMQService,
    private pingGateway: PingGateway,
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
            this.logger.log({
              log: 'service-iot - ping-devices-queue - Received message:',
              content,
            })
            channel.ack(message)

            this.pingGateway.pingConnectedDevices()
          }
        })
      })
    } catch (err) {
      this.logger.error({
        log: 'service-iot - Error starting the consumer - ping-devices-queue:',
        err,
      })
    }
  }
}
