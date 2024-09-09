import { RunnableSequence } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { BufferMemory } from 'langchain/memory';

import { getChatLLM } from '@/chatbot/model';
import getPrompt from '@/chatbot/prompts/roles';

const model = getChatLLM({});

const outputParser = new StringOutputParser();

const prompt = ({ instruction }) => {
  const result = ChatPromptTemplate.fromMessages([
    ['system', getPrompt(instruction)],
    new MessagesPlaceholder('history'),
    ['human', '{input}'],
  ]);
  return result;
};

// 缓冲区内存记忆
const memory = new BufferMemory({
  returnMessages: true,
  inputKey: 'input',
  outputKey: 'output',
  memoryKey: 'history',
});

// (async () => {
//   console.log(await memory.loadMemoryVariables({}));
// })();

const chain = option =>
  RunnableSequence.from([
    {
      input: initialInput => initialInput.input,
      memory: () => memory.loadMemoryVariables({}),
    },
    {
      input: previousOutput => previousOutput.input,
      history: previousOutput => previousOutput.memory.history,
    },
    prompt(option),
    model,
    outputParser,
  ]);

interface RunTypes {
  /** 用户输入内容 */
  input: string;
  /** 快捷指令 */
  instruction: string;
}
const run = async (_inputs: RunTypes) => {
  const { input, instruction } = _inputs;
  const inputs = { input };
  const result = await chain({ instruction }).invoke(inputs);

  await memory.saveContext(inputs, {
    output: result,
  });
  return result;
};

export default run;
