import { print } from '../base/logger';
import { resolveNodeModPath } from '../base/path-helper';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { isRunInJest } from './jest-env';

const modSetted: Record<string, boolean> = {};

/**
 * 在 jest 单测里使用了 hel-micro-node 时，先尝试映射为实际模块，失败再映射为虚拟模块
 */
function doJestMock(nodeModName: string, mod: any) {
  try {
    // when using jest.doMock(), the module you are trying to mock must actually exist in your project.
    jest.doMock(nodeModName, () => mod);
  } catch (err: any) {
    if (!err.message.includes('Cannot find module')) {
      throw err;
    }
    // To mock a module that does not physically exist in your file system,
    // you must use the virtual: true option in the third argument of jest.doMock()
    jest.doMock(nodeModName, () => mod, { virtual: true });
  }
}

/**
 * jest 接管了 require，对接一下 doMock，同时会调用 getProxyFile 尝试生成一份代理文件，
 * 还原真实的 sdk 运行行为，
 */
export function maySetToJestMock(platform: string, helModNameOrPath: string, mod: any) {
  const key = `${platform}+helModNameOrPath`;
  if (!isRunInJest() || modSetted[key]) {
    return;
  }

  try {
    // jest 接管了 require，此处对接一下 doMock，同时调用 getProxyFile 尝试生成一份代理文件，
    // 还原真实的 sdk 运行行为，
    const nodeModName = mapNodeModsManager.getNodeModName(helModNameOrPath, platform);

    // 未映射，不做任何处理
    if (!nodeModName) {
      return;
    }

    const oriFilePath = resolveNodeModPath(nodeModName, true);
    if (oriFilePath) {
      mapNodeModsManager.getProxyFile(nodeModName, helModNameOrPath, oriFilePath);
    }
    doJestMock(nodeModName, mod);
    modSetted[key] = true;
  } catch (err: any) {
    print(err.message);
  }
}
