import { Module } from '@nestjs/common'
import { IotDeviceService } from './iot-device.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [IotDeviceService],
})
export class SocketModule {}
