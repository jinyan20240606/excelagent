import { type DynamicStructuredToolInput } from '@langchain/core/tools';
import { Workbook } from 'exceljs';

/**
 * 获取 Excel 文件的列名
 * @param filename
 * @returns string 以一行制表符输出
 */
export const getColumnNames = async filename => {
  console.log(filename, '10----');
  // 创建一个 workbook 对象来读取 Excel 文件
  const workbook = new Workbook();

  // 异步读取 Excel 文件
  await workbook.xlsx.readFile(filename);

  // 获取第一个工作表
  const worksheet = workbook.getWorksheet(1);
  const headerRow = [];
  for (let i = 0; i < 1 && i < worksheet.rowCount; i++) {
    headerRow.push(await worksheet.getRow(i + 1).values);
  }

  // 将列名以制表符分隔的方式组合起来
  const tabSeparatedNames = headerRow[0].join('\t');
  console.log(
    `这是 '${filename}' 文件的列名：
  ${tabSeparatedNames}`
  );
  // 返回结果
  return `这是 '${filename}' 文件的列名：
 ${tabSeparatedNames}`;
};

/**
 * 获取 Excel 文件的前 n 行
 * @param args
 * @returns string
 */
export const getFirstNRows: DynamicStructuredToolInput['func'] = async args => {
  console.log(args, '22');
  const { filename, n } = args;
  // 创建一个 workbook 对象来读取 Excel 文件
  const workbook = new Workbook();

  // 异步读取 Excel 文件
  await workbook.xlsx.readFile(filename);

  // 获取第一个工作表
  const worksheet = workbook.getWorksheet(1);
  // console.log(sheet, '-----43----', worksheet);
  if (!worksheet) return '<ERROR>没有获取到工作表内容<ERROR>';

  // 获取前 n 行数据（包含列名）
  const rows = [];
  for (let i = 0; i < n && i < worksheet.rowCount; i++) {
    rows.push(await worksheet.getRow(i + 1).values);
  }

  // 将数据转换为字符串格式，每行之间以换行符分隔
  const nLines = rows.map(row => row.join('\t')).join('\n');
  console.log(`这是 '${filename}' 文件的前 ${n} 行样例：\n\n${nLines}`);

  // 返回结果
  return `这是 '${filename}' 文件的前 ${n} 行样例：\n\n${nLines}`;
};

// 测试代码
// getFirstNRows({ filename: './assets/2023年8月-9月销售记录.xlsx', n: 3 });
