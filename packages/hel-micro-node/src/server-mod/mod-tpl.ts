/* @typescript-eslint/no-require-imports */
/**
 * 此目录仅服务于 jest 测试，
 * 一旦 src 源码被编译为 js 文件后，用的是模块内容常量作代理文件模板内容输入源，
 * 并根据实际配置情况做相关关键字替换
 */
import { requireNodeMod } from '../mod-node';

const proxyMod = requireNodeMod('{{NODE_MOD_NAME}}');

/**
 * 特别注意，此处没有写为 export default proxyMod 是因为：
 * export default proxyMod 会被编译为 exports.default = proxyMod;
 * 不能满足上层引用可能存在的以下多种引用情况:
 * ```
 * 编译前
 * // es6 支持的多种导出语法
 * import mod, { default as xxMod, a, b } from 'mod';
 * mod.a();
 * mod.b();
 * xxMod.a();
 * a();
 * b();
 *
 * 编译后: 类似 __importStar（不同编译工具生成的名字可能名称不一样） 是一个负责注入 default 的函数
 *
 * const mod_1 = __importStar(require("mod"));
 * mod_1.default.a();
 * mod_1.default.b();
 * mod_1.default.a();
 * (0, mod_1.a)();
 * (0, mod_1.b)();
 * ```
 *
 * 写为 module.exports = proxyMod 在此文件编译后，会依然保留了此写法，
 * 这样能让以上所有es导入语句写法在编译后也能正常运行，
 * 同时 mod-tpl.ts 自身在工程里并没有任何地方需要导入使用它的具体某个模块，
 * 仅在入口文件处做了静默导入动作 import './mod-tpl'，该导入仅为了触发此文件参与编译，
 * 并在随后的运行中提供编译后的内容给 map-node-mods 模块作为代理文件模板输入源之用
 */
module.exports = proxyMod;
