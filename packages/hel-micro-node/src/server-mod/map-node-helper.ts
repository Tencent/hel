import { resolveNodeModPath } from '../base/path-helper';
import type { HelModName, IMapModOptions, INodeModMapper, IStdNodeModMapper } from '../base/types';
import { strItems2Dict } from '../base/util';
import { extractFnAndDictProps } from '../server-mod/util';
import { isRunInJest } from '../test-util/jest-env';
import { getModByPath } from './mod-ins';
import { extractNameData } from './mod-name';

export interface ICheckData {
  modVerDict: Record<HelModName, string>;
  modApiUrlDict: Record<HelModName, string>;
}

export function getModShape(nodeModName: string, options: IMapModOptions) {
  let fnProps: Record<string, boolean> = {};
  let dictProps: Record<string, boolean> = {};
  let isShapeReady = false;
  const { modShape, fallback = {} } = options;
  const inferModShape = (shapeOffer: any) => {
    if (shapeOffer) {
      const result = extractFnAndDictProps(shapeOffer);
      fnProps = result.fnProps;
      dictProps = result.dictProps;
      isShapeReady = true;
    }
  };

  if (modShape) {
    const { fnKeys = [], dictKeys = [] } = modShape;
    fnProps = strItems2Dict(fnKeys, true);
    dictProps = strItems2Dict(dictKeys, true);
    isShapeReady = true;
  } else if (isRunInJest()) {
    // 未人工设定模块形状，但处于 jest 环境运行时，因 jest 接管了 require
    // 这里可安全的提前 require 模块拿到模块形状，以便获得 fnProps dictProps 数据
    const modPath = resolveNodeModPath(nodeModName, true);
    const mod = getModByPath(modPath, { allowNull: true });
    inferModShape(mod);
  } else if (fallback.mod || fallback.path) {
    const fallbackMod = fallback.mod || getModByPath(fallback.path, { allowNull: true });
    inferModShape(fallbackMod);
  }
  // 用户设定了没有模块形状，也要正常预加载映射的模块
  if (!isShapeReady && options.dangerouslyNoModShape) {
    isShapeReady = true;
  }

  return { fnProps, dictProps, isShapeReady };
}

/**
 * 格式化 modMapper 为内部使用的标准对象，并做一些数据检查
 */
export function formatAndCheckModMapper(modMapper: INodeModMapper, checkData: ICheckData) {
  const stdMapper: IStdNodeModMapper = {};
  // checkData 内部数据可改写，为后续检查做参考
  const { modVerDict, modApiUrlDict } = checkData;

  Object.keys(modMapper).forEach((nodeModName) => {
    let val = modMapper[nodeModName] as IMapModOptions;
    if (!val) {
      return;
    }
    // 为了类型推导，此处不抽变量 const valType = typeof val;
    if (typeof val === 'string') {
      val = { helModName: val };
    } else if (typeof val === 'boolean') {
      // 自己映射自己
      val = { helModName: nodeModName };
    }

    const { ver, helpackApiUrl } = val;

    const { helModName } = extractNameData(val.helModName || nodeModName);
    if (ver) {
      if (modVerDict[helModName]) {
        throw new Error(`specified different ver for hel module ${helModName}`);
      } else {
        modVerDict[helModName] = ver;
      }
    }

    if (helpackApiUrl) {
      if (modApiUrlDict[helModName]) {
        throw new Error(`specified different helpackApiUrl for hel module ${helModName}`);
      } else {
        modApiUrlDict[helModName] = helpackApiUrl;
      }
    }

    stdMapper[nodeModName] = val;
  });

  return stdMapper;
}
