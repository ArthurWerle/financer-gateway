import { Controller, All, Req, Res, Inject, Get, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(private readonly proxyService: ProxyService) {}

  @Get('/hello')
  async helloWorld() {
    this.logger.log('Hello world endpoint called');
    return "Hello world"
  }

  @All('api/transactions/*')
  async proxyTransactions(@Req() req: Request, @Res() res: Response) {
    this.logger.debug(`Proxying transaction request: ${req.method} ${req.originalUrl}`);
    const proxy = this.proxyService.getTransactionServiceProxy();
    return proxy(req, res, () => {
      this.logger.error(`Transaction proxy error for: ${req.originalUrl}`);
    });
  }

  @All('api/categories/*')
  async proxyCategories(@Req() req: Request, @Res() res: Response) {
    this.logger.debug(`Proxying category request: ${req.method} ${req.originalUrl}`);
    const proxy = this.proxyService.getCategoryServiceProxy();
    return proxy(req, res, () => {
      this.logger.error(`Category proxy error for: ${req.originalUrl}`);
    });
  }
} 