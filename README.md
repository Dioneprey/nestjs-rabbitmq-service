Testando integração entre uma API principal, um serviço e um dispositivo IoT. A API principal envia uma mensagem para o serviço usando RabbitMQ. O serviço então pinga todos os dispositivos IoT conectados via socket e retorna o status para a API principal.

## Fluxo da aplicação

1. A API principal tem um cron ( como teste, rodando a cada 1 minuto ), que ao ser executado envia uma mensagem para o serviço através do RabbitMQ.
2. O serviço recebe a mensagem e pinga todos os dispositivos IoT conectados via socket.
3. Cada dispositivo IoT retorna seu status para o serviço.
4. O serviço retorna para a API principal o status de cada dispositivo.

## Como usar

1.
Criar arquivo .env em ./main-api, pode usar os mesmos dados do .env.example, não precisa criar .env nas outras aplicações pois tem valores default
```
docker compose up -d
```
2. 
```
cd main-api
npm install
npm run start:dev
```
---
```
cd service-iot
npm install
npm run start:dev
```
---
```
cd socket-devices/socket-1
npm install
npm run start:dev
```
---
```
cd socket-devices/socket-2
npm install
npm run start:dev
```

3. Aguarde o cron ser executado, ou acesse o bull-board e adiante a queue: /api/queue