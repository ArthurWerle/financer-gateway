import { NestFactory } from '@nestjs/core';
import { ProxyModule } from './proxy/proxy.module';
import { Logger } from '@nestjs/common';

async function startGateway() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(ProxyModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

startGateway();
