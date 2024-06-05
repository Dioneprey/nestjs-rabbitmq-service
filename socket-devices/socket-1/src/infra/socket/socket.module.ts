import { Module } from '@nestjs/common'
import { IotDeviceService } from './iot-device.service'

@Module({
  providers: [IotDeviceService],
})
export class SocketModule {}
