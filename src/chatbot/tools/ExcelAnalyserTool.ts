import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';
import { getChatLLM } from '@/chatbot/model';
import { compileModuleResolve } from '@/utils/js-runtime';
import ExcelAnalyserPrompt from '@/chatbot/prompts/excel-analysis-prompts/excel-analyser';
import { getFirstNRows, getColumnNames } from './funcs/excelInspectionFunc';
import * as exceljs from 'exceljs';

const ExcelAnalyserSchema = z.object({
  query: z
    .string()
    .describe('用户需要对当前excel表进行的操作,不要编造与用户输入不相关的词'),
});

/**
 * excel分析自定义工具
 */
class ExcelAnalyserTool {
  prompt: PromptTemplate;
  filename: Record<string, any>;

  constructor(filename) {
    this.filename = filename;
    this.prompt = PromptTemplate.fromTemplate(ExcelAnalyserPrompt);
  }

  /**
   * 分析一个结构化文件（如excel文件后期可扩展）的内容，返回可执行代码
   * @param args
   */
  analyse = async (args: z.infer<typeof ExcelAnalyserSchema>) => {
    const { query } = args;
    const filename = this.filename;
    console.log(args, '14------');
    const columns = await getColumnNames(filename);
    const inspections = await getFirstNRows({ filename, n: 3 });
    // 1、调用大模型得到结构化参数
    const chain = this.prompt.pipe(
      getChatLLM({
        temperature: 0,
      })
    );
    const response = await chain.invoke({
      query,
      filename,
      columns,
      inspections,
    });

    // console.log(response.content, '模型响应内容');

    // 2、生成可执行代码字符串
    const codeStr = this.extractJSCodeStr(response.content as string);

    if (codeStr) {
      // 3、沙箱环境执行
      const res = (await compileModuleResolve(codeStr, {
        exceljs,
      })) as any;
      const endResult = res?.exports?.default;
      return endResult ? endResult : 'ERROR: AI 响应的可执行代码无法正确执行';
    } else {
      return 'ERROR: 没有找到可执行的TS代码';
    }
  };

  /**
   * # 使用正则表达式找到所有的JS代码块
   * @param llmResponse
   * @returns string
   */
  extractJSCodeStr(llmResponse: string) {
    const codeBlockPattern = /```js([\s\S]*?)```/g;
    const match = codeBlockPattern.exec(llmResponse);
    let codeStr = '';
    if (match) {
      const codeContent = match[1];
      codeStr = codeContent;
    }
    return codeStr;
  }

  asTool() {
    return new DynamicStructuredTool({
      func: this.analyse,
      name: 'excel-analyser-tool',
      schema: ExcelAnalyserSchema,
      description:
        '通过程序脚本分析一个结构化文件（例如excel文件）的内容，并执行脚本得到分析结果。输人中必须包含文件的完整路径和具体分析方式和分析依据，阈值常量等。如果输入信息不完整，你可以拒绝回答',
    });
  }
}
// new ExcelAnalyserTool().analyse({
//   query: '计算8月份总销售额',
//   filename: './assets/2023年8月-9月销售记录.xlsx',
// });
export default ExcelAnalyserTool;
