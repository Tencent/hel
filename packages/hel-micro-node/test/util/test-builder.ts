import { getNodeModDesc, importNodeModByMeta, mapNodeMods, mockUtil, requireNodeMod } from '../../src';
import '../mock';
import { HEL_HELLO_HELPACK } from '../util/consts';
import { buildModMeta, getDataModRootDir, updateModTo } from './mod';

/**
 * 构建测试 importNodeMod 的测试函数，上层会传递不同目录层级的模块目录来复用此逻辑
 */
export function buildImportNodeModTest(options: { modVer1: string; modVer2: string; indexFileRelPath: string }) {
  // 生成测试函数 builder
  return (testLabel: string) =>
    test(testLabel, async () => {
      mapNodeMods({ [HEL_HELLO_HELPACK]: true });
      const { modVer1: v1, modVer2: v2, indexFileRelPath } = options;
      const modV1DirPath = getDataModRootDir(v1);
      const helMeta = buildModMeta(v1, indexFileRelPath);
      // 预加载模块
      await importNodeModByMeta(HEL_HELLO_HELPACK, helMeta, {
        prepareFiles(params) {
          mockUtil.cpSync(modV1DirPath, params.modDirPath);
        },
      });
      // 模块描述对象应该对应上当前版本号
      const modDesc = getNodeModDesc(HEL_HELLO_HELPACK);
      const curVer = helMeta.version.sub_app_version;
      expect(modDesc.storedVers.includes(curVer)).toBeTruthy();
      expect(modDesc.modVer).toBe(curVer);

      const mod = requireNodeMod(HEL_HELLO_HELPACK);
      expect(mod.hello()).toBe('hello v1');

      // 更新为新版本模块
      updateModTo(HEL_HELLO_HELPACK, v2);

      // 模块描述对象应该对应上最新的版本号
      const modDesc2 = getNodeModDesc(HEL_HELLO_HELPACK);

      console.log('modDesc2.storedVers', modDesc2.storedVers);

      expect(modDesc2.storedVers.includes(v2)).toBeTruthy();
      expect(modDesc2.storedVers).toMatchObject([v1, v2]);
      expect(modDesc2.modVer).toBe(v2);

      // 调用方法，应是最新版本返回的结果
      const modV2 = requireNodeMod(HEL_HELLO_HELPACK);
      expect(modV2.hello()).toBe('hello v2');
    });
}
