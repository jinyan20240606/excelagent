import {
  ChatOpenAI,
  OpenAIEmbeddings as _OpenAIEmbeddings,
} from '@langchain/openai';
// // 测试用 后面会删掉
// import * as dotenv from 'dotenv';
// dotenv.config({
//   path: '.env.local',
// });
export const getChatLLM = params =>
  new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    // This will enable logging of all Chain *and* LLM events to the console.
    // verbose: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbacks: [
      {
        handleLLMEnd(output) {
          console.log(JSON.stringify(output.llmOutput, null, 2));
        },
      },
    ],
    ...params,
  });

export const OpenAIEmbeddings = _OpenAIEmbeddings;
