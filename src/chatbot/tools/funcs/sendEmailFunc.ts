import { type DynamicStructuredToolInput } from '@langchain/core/tools';

const sendEmailFunc: DynamicStructuredToolInput['func'] = async args => {
  console.log(args, '22');
  const { to, subject } = args;
  // const result = await chain.invoke({ topic: query });
  // console.log(result, '15------');
  return `已发送邮件给 ${to}, 标题: ${subject}`;
};

// writerChainFunc();

export default sendEmailFunc;
