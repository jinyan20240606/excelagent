import WRITING from './writing';

export default instruction => {
  console.log('当前执行快捷指令：', instruction);
  let ROLE_PROMPT = '';

  if (WRITING[instruction]) {
    ROLE_PROMPT = WRITING[instruction].prompt;
  }

  return `
  你是一个强大的AI办公助手，可以高效辅助用户提升写作生产力的工具。
  ${ROLE_PROMPT}
  你必须遵循以下约束：
  1. 你输出的Language Type必须与用户输入的Language Type 保持一致
  2. 不能向用户提问
`;
};
