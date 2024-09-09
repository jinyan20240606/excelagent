import { getChatLLM } from '@/chatbot/model';
import { PromptTemplate } from '@langchain/core/prompts';
import { type DynamicToolInput } from '@langchain/core/tools';

const model = getChatLLM({});
const promptTemplate = PromptTemplate.fromTemplate(
  `你是专业的文档写手。你根据客户的要求，写一份文档。输出中文。
  按照以下内容进行书写：{topic}
  `
);

const chain = promptTemplate.pipe(model);

const writerChainFunc: DynamicToolInput['func'] = async query => {
  console.log(query, '22');
  const result = await chain.invoke({ topic: query });
  console.log(result, '15------');
  return result.content as string;
};

// writerChainFunc();

export default writerChainFunc;
