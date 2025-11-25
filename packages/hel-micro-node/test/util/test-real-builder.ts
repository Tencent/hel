/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * 此文件的测试走的是真实的 axios 调用，故独立于 test-builder 文件在此独立维护，
 * 需确保网络可用
 */
import { IBaseConfig, importNodeMod, IPlatformConfig, mapNodeMods, registerPlatform, setGlobalConfig, setPlatformConfig } from '../../src';
import '../mock/mock-with-real-axios';
import {
  HEL_API_URL,
  HEL_DEMO_LIB1,
  HEL_DEMO_LIB1_VER1,
  HEL_DEMO_LIB1_VER2,
  HEL_HELLO_HELPACK,
  HEL_HELLO_NO_SERVER_FILES_VER,
  HEL_MODULES_DIR,
  HEL_PROXY_MODULES_DIR,
  MOD_NPM_NAME,
} from '../util/consts';

const baseConfig: IBaseConfig = {
  helModulesDir: HEL_MODULES_DIR,
  helProxyFilesDir: HEL_PROXY_MODULES_DIR,
};

/**
 * 构建从 helpack 下载并通过 importNodeMod 导出模块的用例工厂
 */
export function buildImportHelpackModTest(config?: IPlatformConfig) {
  return (testLabel: string) =>
    test(testLabel, async () => {
      setGlobalConfig({
        strict: true,
      });
      const platform = 'hel';
      const api = registerPlatform({
        platform,
        registrationSource: 'tnode',
        helpackApiUrl: HEL_API_URL,
        ...(config || {}),
      });
      // 本地单测时获取真实的hel元数据需要走https
      // setConfig({ helpackApiUrl: HEL_API_URL, ...(config || {}), platform });

      try {
        mapNodeMods({
          [HEL_HELLO_HELPACK]: true,
        });
        // 这一个版本不包含任何服务端模块产物
        await importNodeMod(HEL_HELLO_HELPACK, { ver: HEL_HELLO_NO_SERVER_FILES_VER, platform });

        // await api.mapAndPreload({
        //   [HEL_HELLO_HELPACK]: { ver: HEL_HELLO_SUB_PATH, platform },
        // });
      } catch (err: any) {
        console.log(err);
        expect(err.message.includes('no server mod files')).toBeTruthy();
      }

      // const wrongPath = `${HEL_HELLO_HELPACK}/@tencent/hel-hello`;
      // const rightPath = `${HEL_HELLO_HELPACK}/srv/hel-hello`;
      // try {
      //   // 这是一个不正确的带路径的导入，应该报错
      //   await importNodeMod(wrongPath, { platform });
      // } catch (err: any) {
      //   expect(err.message.includes(`no server mod entry file for ${wrongPath}`)).toBeTruthy();
      // }

      // const mod = await importNodeMod(rightPath, { ver: HEL_HELLO_VER, platform });
      // expect(mod.hello('hello hel')).toBeTruthy();

      // const modHello = requireNodeMod(rightPath, { platform });
      // expect(modHello.hello('hello hel')).toBeTruthy();

      // expect(mod === modHello).toBeTruthy();
    });
}

/**
 * 创建从 helpack 下载并通过 require 导出模块的用例工厂
 */
export function buildNativeRequireTest(config?: IPlatformConfig) {
  return (testLabel: string) =>
    test(testLabel, async () => {
      setGlobalConfig(baseConfig);
      setPlatformConfig(config || {});
      mapNodeMods({ [MOD_NPM_NAME]: HEL_DEMO_LIB1 });
      // 激活后调用
      await importNodeMod(MOD_NPM_NAME, { ver: HEL_DEMO_LIB1_VER1 });
      const helHelloMod = require(MOD_NPM_NAME);
      expect(helHelloMod.hello()).toBe('hel hello v1.0.1');
      // 激活后基于新的根引用去调用
      await importNodeMod(MOD_NPM_NAME, { ver: HEL_DEMO_LIB1_VER2 });
      const helHelloModV2 = require(MOD_NPM_NAME);
      expect(helHelloModV2.hello()).toBe('hel hello v1.0.2');
    });
}

/**
 * 区别于 buildNativeRequireTest ，此用例里会对导出的模块做解构，使用稳定的模块方法引用去做相关测试
 */
export function buildNativeStableRequireTest(config?: IPlatformConfig) {
  return (testLabel: string) =>
    test(testLabel, async () => {
      setPlatformConfig({ ...baseConfig, ...(config || {}) });

      mapNodeMods({ [MOD_NPM_NAME]: HEL_DEMO_LIB1 });
      // 预加载后调用 require 获得 hello 句柄
      await importNodeMod(MOD_NPM_NAME, { ver: HEL_DEMO_LIB1_VER1 });
      const { hello } = require(MOD_NPM_NAME);
      expect(hello()).toBe('hel hello v1.0.1');

      // 激活另一个版本，用相同的 hello 调用
      const mod = await importNodeMod(MOD_NPM_NAME, { ver: HEL_DEMO_LIB1_VER2 });
      expect(hello()).toBe('hel hello v1.0.2');
      // expect(mod.hello()).toBe('hel hello v1.0.2');
    });
}
