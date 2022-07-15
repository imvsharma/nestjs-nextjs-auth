import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [
          /* Add the Rabbit MQ URL*/
        ],
        queue: /*Add the message queue. e.g. user-queue */ '',
        queueOptions: {
          durable: false,
        },
      },
    });
    await app.startAllMicroservices();
    app.setGlobalPrefix('/api');
    await app.listen(3000);
    console.log(`User microservice is running on 3000 port`);
  } catch (err) {
    console.error(`Error in bootstarping user microservice : ${err}`);
  }
}
bootstrap();
