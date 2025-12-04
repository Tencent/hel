import * as Module from 'module';
import { getGlobalConfig } from '../context/global-config';
import { mapNodeModsManager } from './map-node-mods';

// wrap Module to MOD_REF, for compile post handle process
const MOD_REF = { Module };
// @ts-ignore
const oriResolveFilename = MOD_REF.Module._resolveFilename;

// @ts-ignore
MOD_REF.Module._resolveFilename = function (pkgName: string, parentModule: any, isMain: boolean, options: any) {
  const helModOrPath = mapNodeModsManager.getMappedPath(pkgName);
  const getOriFilename = () => {
    const result = oriResolveFilename.call(this, pkgName, parentModule, isMain, options);
    return result;
  };
  let sourceFilename = '';

  if (helModOrPath) {
    try {
      // 不存在则抛出错误: Error: Cannot find module 'xxx'
      sourceFilename = getOriFilename();
    } catch (err: any) {
      const { strict } = getGlobalConfig();
      const willKnowModShape = mapNodeModsManager.isFallbackModExist(pkgName) || mapNodeModsManager.isModShapeExist(pkgName);

      // strict 模式下，node 模块必须存在，非 strict 模式下，如果内部无法感知模块形状，则 node 模块必须存在
      if (strict || !willKnowModShape) {
        throw err;
      }
    }
    const proxyFile = mapNodeModsManager.getProxyFile(pkgName, helModOrPath, sourceFilename);
    return proxyFile;
  }
  sourceFilename = getOriFilename();

  return sourceFilename;
};
