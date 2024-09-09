// import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api';
import { SearchApi } from '@langchain/community/tools/searchapi';
import { DynamicTool } from '@langchain/core/tools';
// import { z } from 'zod';

import documentQAFunc from './funcs/documentQAFunc';
// import writerChainFunc from './funcs/writerChainFunc';
// import sendEmailFunc from './funcs/sendEmailFunc';
// import { getFirstNRows } from './funcs/excelInspectionFunc';
import ExcelAnalyserTool from './ExcelAnalyserTool';

// const searchTool = new DynamicTool({
//   name: 'web-search-tool',
//   description: 'Tool for getting the latest information from the web',
//   func: async (searchQuery: string, runManager) => {
//     console.log(searchQuery, '18--1------');
//     try {
//       const retriever = new TavilySearchAPIRetriever();
//       const docs = await retriever.invoke(searchQuery, runManager?.getChild());
//       console.log(docs, '18---2');
//       return docs.map(doc => doc.pageContent).join('\n-----\n');
//     } catch (e) {
//       console.log(e.message, 'ERROR: 搜索引擎发生错误');
//       throw e.message;
//     }
//   },
// });
const searchTool = new SearchApi(process.env.SEARCHAPI_API_KEY, {
  engine: 'google',
});

const documentQATool = new DynamicTool({
  name: 'document-qa-tool',
  description:
    '根据一个Word或PDF文档的内容，回答一个问题。考虑上下文信息，确保问题对相关概念的定义表述完整, 若与当前上下文无关，可尝试调用其他Tool。',
  func: documentQAFunc,
});

// const writerChainRun: any = () => {};
// const documentGenerationTool = new DynamicTool({
//   func: writerChainFunc,
//   name: 'document-generation-tool',
//   description: '根据需求描述生成一篇正式文档',
// });

// const EmailToolSchema = z.object({
//   to: z.string().describe('电子邮箱地址，格式为xxx@xxx.xxx'),
//   subject: z.string().describe('邮件主题'),
//   body: z.string().describe('邮件正文内容'),
// });

// const emailTool = new DynamicStructuredTool({
//   func: sendEmailFunc,
//   name: 'send-email-tool',
//   schema: EmailToolSchema,
//   description:
//     '给指定的邮箱发送邮件。确保邮箱地址是xxx@xxx.xxx的格式。多个邮箱地址以 ; 分割。',
// });

// const ExcelInspectionToolSchema = z.object({
//   filename: z.string().describe('一个 Office Excel 文件的地址'),
//   n: z.string().describe('Excel 表格的前几行'),
// });

// const excelInspectionTool = new DynamicStructuredTool({
//   func: getFirstNRows,
//   name: 'excel-inspection-tool',
//   schema: ExcelInspectionToolSchema,
//   description: '探查表格文件的内容和结构，获取它的列名和前n行，n默认为3',
// });

// (async () => {
//   const toolResult = await searchTool.invoke('今天天气怎么样?');
//   console.log(toolResult, '26------');
// })();
interface IOptions {
  /** [表格分析工具]: 结构化分析的指定文件名 */
  filename: string;
}
/**
 * 1、搜索引擎与知识库问答不适合同时用，容易对大模型造成困扰，
 */
export default (options: IOptions) => {
  const { filename } = options;
  return [documentQATool, searchTool, new ExcelAnalyserTool(filename).asTool()];
};
