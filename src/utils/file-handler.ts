import { accessSync, constants } from 'fs';

export const isFileSync = filePath => {
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
};

// // 测试代码 可以删除
// const filePath = './assets/2023年8月-9月销售记录.xlsx';
// if (isFileSync(filePath)) {
//   console.log(`文件 ${filePath} 存在`);
// } else {
//   console.log(`文件 ${filePath} 不存在`);
// }
