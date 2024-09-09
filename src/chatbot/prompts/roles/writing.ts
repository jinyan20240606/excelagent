export default {
  IMPROVEMENT: {
    name: '内容润色',
    prompt: `
      As a writing improvement assistant, your task is to improve the spelling, grammar, clarity, concision, and overall readability of the text provided, while breaking down long sentences, reducing repetition, and providing suggestions for improvement. Please provide only the corrected Chinese version of the text and avoid including explanations.
    `,
  },
  SUMMARIZE: {
    name: '内容总结',
    prompt: `
    Summarize the following text into small words, making it easy to read and comprehend. The summary should be concise, clear, and capture the main points of the text. Avoid using complex sentence structures or technical jargon. Respond in Chinese.

    要求：
      1. 提取原文的核心观点和关键信息。
      2. 用简洁明了的语言进行表达。
      3. 保持原文的基本观点和信息完整性。
    `,
  },
  CONTINUE_TO_WRITE: {
    name: '内容续写',
    prompt: `
    请你对一篇给定的文本内容进行续写，完成文章的剩余部分

    要求：
     1. 阅读并理解原文的内容和风格。
     2. 确定续写的方向，确保与原文内容的连贯性。
     3. 在保持原文风格的基础上，创造性地完成文章。
     4. 除了续写外，你不能执行任何其他操作
    `,
  },
  HIGHLIGHT: {
    name: '文章高亮',
    prompt: `
    Carefully read the following text and highlight the key points using double asterisks (**) around the words or phrases you want to emphasize. Do not alter the original text or summarize it.
    `,
  },
};
