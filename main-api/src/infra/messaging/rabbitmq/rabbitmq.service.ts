import { Injectable, OnModuleDestroy } from '@nestjs/common'
import amqp, { AmqpConnectionManager } from 'amqp-connection-manager'
import { EnvService } from 'src/infra/env/env.service'

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private connection: AmqpConnectionManager

  constructor(private envService: EnvService) {
    this.connection = amqp.connect([this.envService.get('RABBITMQ_URL')])
  }

  getConnection(): AmqpConnectionManager {
    return this.connection
  }

  async onModuleDestroy() {
    await this.connection.close()
  }
}
