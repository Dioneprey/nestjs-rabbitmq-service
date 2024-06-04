import { Processor, Process, OnQueueCompleted, InjectQueue } from '@nestjs/bull'
import { Logger, type OnModuleInit } from '@nestjs/common'
import { Job, type Queue } from 'bull'

export const PING_DEVICES_QUEUE = 'invalidate-codes-processor'
@Processor(PING_DEVICES_QUEUE)
export class PingDevicesProcessor implements OnModuleInit {
  constructor(
    @InjectQueue(PING_DEVICES_QUEUE) private pingDevicesQueue: Queue,
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
  }

  @OnQueueCompleted({
    name: 'ping-all-devices',
  })
  onCompleted(job: Job<unknown>) {
    Logger.log(`Job ${job.id} has been finished`)
  }
}
