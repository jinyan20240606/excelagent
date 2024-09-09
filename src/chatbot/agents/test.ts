import { getChatLLM } from '@/chatbot/model';
import getTools from '@/chatbot/tools';
import AgentExcelAnalysis from '@/chatbot/agents/ExcelAnalysisAgent';

// 2、建立向量数据库
// const vectorStore = await HNSWLib.fromTexts(
//   ['建站的高级表单不支持手机号输入'],
//   [{ id: 1 }],
//   new OpenAIEmbeddings(),
// );
// const retriever = vectorStore.asRetriever();

// 创建agent执行器
const analyser = new AgentExcelAnalysis({
  llm: getChatLLM({
    temperature: 0,
  }),
  tools: getTools({
    filename: './assets/2023年8月-9月销售记录.xlsx',
  }),
  // main_prompt_file: 'main.templ',
  // final_prompt_file: 'final.templ',
  // max_thought_steps: 20,
  // memery_retriever: new Chroma(
  //   [new Document({ page_content: '' })],
  //   new OpenAIEmbeddings({ model: 'text-embedding-ada-002' }),
  // ),
});

const run = async ({ input = '你好' } = {}) => {
  const res = await analyser.executor.invoke(
    {
      input,
    },
    {
      callbacks: [
        {
          handleAgentAction(action) {
            console.log('\nhandleAgentAction', action);
          },
          handleAgentEnd(action) {
            console.log('\nhandleAgentEnd', action);
          },
          handleToolEnd(output) {
            console.log('\nhandleToolEnd', output);
          },
        },
      ],
    }
  );
  return res;
};

export default run;
