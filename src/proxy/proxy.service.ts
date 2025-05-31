import { Injectable, Logger } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request } from 'express';
import { IncomingMessage } from 'http';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  private readonly transactionServiceProxy = createProxyMiddleware({
    target: 'http://transaction-service:8080/api',
    changeOrigin: true,
    pathRewrite: {
      '^/api/transactions': '',
    },
    onProxyReq: (proxyReq: IncomingMessage, req: Request) => {
      this.logger.debug(`Proxying to transaction service: ${req.method} ${req.url}`);
    },
    onError: (err: Error, req: Request) => {
      this.logger.error(`Transaction service proxy error: ${err.message}`, err.stack);
    },
  } as Options);

  private readonly categoryServiceProxy = createProxyMiddleware({
    target: 'http://category-service:8080/api',
    changeOrigin: true,
    pathRewrite: {
      '^/api/categories': '',
    },
    onProxyReq: (proxyReq: IncomingMessage, req: Request) => {
      this.logger.debug(`Proxying to category service: ${req.method} ${req.url}`);
    },
    onError: (err: Error, req: Request) => {
      this.logger.error(`Category service proxy error: ${err.message}`, err.stack);
    },
  } as Options);

  getTransactionServiceProxy() {
    return this.transactionServiceProxy;
  }

  getCategoryServiceProxy() {
    return this.categoryServiceProxy;
  }
} 