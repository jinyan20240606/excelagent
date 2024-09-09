/**
 * 创建数据分析代理
 */
import { RunnableSequence } from '@langchain/core/runnables';
import { AgentExecutor, type AgentStep } from 'langchain/agents';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import {
  responseOpenAIFunction,
  formatAgentSteps,
  structuredOutputParser,
} from './common';
import {
  ChatPromptTemplate,
  PromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import ExcelAnalysisAgentPromptsStr from '@/chatbot/prompts/excel-analysis-prompts';

export default class AgentExcelAnalysis {
  llm: any;
  tools: any[];
  prompt: ChatPromptTemplate<any, any>;
  executor: AgentExecutor;

  constructor(options) {
    const { llm, tools } = options;
    this.llm = llm;
    this.tools = tools;
    this.init();
  }

  async init() {
    await this.genTemplate();
    this.create();
  }

  async genTemplate() {
    console.log('generating prompts...');
    const promptTemplate = PromptTemplate.fromTemplate(
      ExcelAnalysisAgentPromptsStr
    );
    const systemPrompts = await promptTemplate.format({
      aiName: '小李',
      aiRole: '强大的AI助手，可以使用工具与指令自动化解决问题',
    });
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompts],
      ['user', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);
    this.prompt = prompt;
  }

  /**
   * 创建执行器对象，通过其invoke调用（异步方法）
   * @returns void
   */
  create = () => {
    console.log('creating agent...');
    const llmWithTools = this.llm.bind({
      functions: [
        ...this.tools.map(tool => convertToOpenAIFunction(tool)),
        responseOpenAIFunction,
      ],
    });

    /** Create the runnable */
    const runnableAgent = RunnableSequence.from<{
      input: string;
      steps: Array<AgentStep>;
    }>([
      {
        input: i => i.input,
        agent_scratchpad: i => formatAgentSteps(i.steps),
      },
      this.prompt,
      llmWithTools,
      structuredOutputParser,
    ]);

    const executor = AgentExecutor.fromAgentAndTools({
      agent: runnableAgent,
      tools: this.tools,
    });

    this.executor = executor;
  };
}
