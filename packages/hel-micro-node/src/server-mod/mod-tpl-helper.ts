import { KW_NODE_MOD_NAME, MAP_NODE_MOD_DIR_NAME, MOD_MGR_DIR_NAME } from '../base/mod-consts';

/**
 * 替换代理文件模板主体内容
 */
export function replaceTpl(content: string, nodeModName: string) {
  let newContent = content;
  // 模板文件是在 server-mod 下，依据模板文件生成的代理文件将写入到 server-mod/proxy-mod 目录下
  // 故需要将导入 mod-manager 和 map-node-mods 模块的路径由 ./ 改写为 ../
  newContent = newContent.replace(`./${MOD_MGR_DIR_NAME}`, `../${MOD_MGR_DIR_NAME}`);
  newContent = newContent.replace(`./${MAP_NODE_MOD_DIR_NAME}`, `../${MAP_NODE_MOD_DIR_NAME}`);
  // 标识 requireNodeMod 调用传入的模块名
  newContent = newContent.replace(KW_NODE_MOD_NAME, nodeModName);
  return newContent;
}
