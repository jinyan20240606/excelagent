import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import chatRun from '@/chatbot/chain';
import { AgentService } from '../service/agent.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  agentService: AgentService;

  @Get('/chat')
  async getMessage(
    @Query('q') input,
    @Query('ins') instruction,
    @Query('agent') autoAgent
  ) {
    let data = '';
    if (autoAgent) {
      data = await this.agentService.run({
        input,
      });
    } else {
      data = await chatRun({ input, instruction });
    }

    return { success: true, message: 'OK', data };
  }
}
