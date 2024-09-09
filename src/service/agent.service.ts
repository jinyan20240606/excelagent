import { Provide } from '@midwayjs/core';
import { IAgentOptions } from '../interface';
import agentRun from '@/chatbot/agents/test';

@Provide()
export class AgentService {
  constructor() {}

  async run(options: IAgentOptions) {
    const res = await agentRun(options);
    console.log(res, '7----');
    return res.output;
  }
}
