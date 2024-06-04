import { Processor, Process, OnQueueCompleted, InjectQueue } from '@nestjs/bull'
import { Logger, type OnModuleInit } from '@nestjs/common'
import { Job, type Queue } from 'bull'
import { PingDevicesProducerService } from 'src/infra/messaging/rabbitmq/producers/ping-devices-producer.service'

export const PING_DEVICES_QUEUE = 'invalidate-codes-processor'
@Processor(PING_DEVICES_QUEUE)
export class PingDevicesProcessor implements OnModuleInit {
  private readonly logger = new Logger(PingDevicesProcessor.name)

  constructor(
    @InjectQueue(PING_DEVICES_QUEUE) private pingDevicesQueue: Queue,
    private pingDevicesProducerService: PingDevicesProducerService,
  ) {}

  async onModuleInit() {
    this.pingDevicesQueue
      .add(
        'ping-all-devices',
        {},
        // { repeat: { cron: '0 18 * * *' } },
        { repeat: { every: 1 * 60 * 1000 } },
      )
      .then(() => console.log('ping-all-devices add to queue'))
      .catch((err) => console.log('error on connect to redis', err))
  }

  @Process('ping-all-devices')
  async pingAll() {
    console.log(`Fila iniciada - ping-all-devices`)

    await this.pingDevicesProducerService.queue()
  }

  @OnQueueCompleted({
    name: 'ping-all-devices',
  })
  onCompleted(job: Job<unknown>) {
    this.logger.log(`Job ${job.id} has been finished`)
  }
}
