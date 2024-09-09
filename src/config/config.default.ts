import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1710232279097_8350',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
} as MidwayConfig;
