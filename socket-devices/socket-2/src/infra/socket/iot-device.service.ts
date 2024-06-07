import { Injectable, OnModuleInit } from '@nestjs/common'
import { Socket, io } from 'socket.io-client'
import { EnvService } from '../env/env.service'

@Injectable()
export class IotDeviceService implements OnModuleInit {
  private socket: Socket

  constructor(private envService: EnvService) {}

  onModuleInit(): void {
    this.socket = io(this.envService.get('SOCKET_SERVER_URL')) // substitua com o URL do seu servidor

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor IoT')
    })

    this.socket.on('ping', async () => {
      console.log('Ping recebido do servidor')

      const possibleStatus = ['alive', 'dead', 'busy']

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const randomStatus =
        possibleStatus[Math.floor(Math.random() * possibleStatus.length)]

      this.socket.emit('device-status', {
        deviceId: this.socket.id,
        status: randomStatus,
      })
    })

    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor IoT')
    })
  }
}
