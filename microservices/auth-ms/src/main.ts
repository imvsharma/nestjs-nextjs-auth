import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger: Logger = new Logger(config.get('microservice') as string);
  try {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [config.get('messageQueueUrl') as string],
        queue: config.get('messageQueueName') as string,
        queueOptions: {
          durable: false,
        },
      },
    });
    await app.startAllMicroservices();
    app.setGlobalPrefix('/api');
    await app.listen(config.get('port') as number);
    logger.log(`Auth microservice is running on ${config.get('port')} port`);
  } catch (err) {
    logger.error(`Error in bootstarping auth microservice : ${err}`);
  }
}
bootstrap();
