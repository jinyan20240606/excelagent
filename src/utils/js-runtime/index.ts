interface ESMoudleType {
  exports: {
    __esModule: boolean;
    default: any;
    [key: string]: any;
  };
}

/**
 * 解析cjs模块
 * @param {string} code sucraseTransformCode 编译后的结果：commonjs模块代码字符串
 * ```js
 * // 大概是整个样子
 * "use strict";
 * Object.defineProperty(exports, "__esModule", {value: true}); const a = async () => {return 31};
 * exports.a = a
 * ```
 * @param dependencies 手动指定依赖对象列表
 * @returns
 */
export const compileModuleResolve = async (
  code: string,
  dependencies: Record<string, any> = {}
) => {
  // 实现module函数，用来套动态执行的函数结果
  let defaultD = {};
  const newModule: ESMoudleType = {
    exports: {
      __esModule: false,
      default: defaultD,
    },
  };

  return new Promise((res, rej) => {
    Object.defineProperty(newModule.exports, 'default', {
      set(v) {
        defaultD = v + '';
        res(newModule);
      },
      get() {
        return defaultD;
      },
    });

    // 实现一个require方法，用于模块执行时挂载依赖
    const require = (packageName: string) => {
      if (dependencies[packageName]) {
        return dependencies[packageName];
      }
      throw new Error(`${packageName} is not found.`);
    };
    try {
      // 动态执行
      Function('require, exports, module', code)(
        require,
        newModule.exports,
        newModule
      );
    } catch (e) {
      console.log(e.message, '执行compileModuleResolve失败');
      rej('执行代码块失败');
    }
  });
};
