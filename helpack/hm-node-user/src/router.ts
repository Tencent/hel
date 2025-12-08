import { getRouter, restful } from './at/core/routerFactory';
import * as realMod from './controllers/realMod';
import * as virtualMod from './controllers/virtualMod';

restful('/api/hello', realMod.helloHandler);

restful('/api/getModDesc', realMod.getModDesc);

restful('/api/getModPathInfo', realMod.getModPathInfo);

restful('/api/getModVer', realMod.getModVer);

restful('/api/changeVer/:ver', realMod.changeVer);

restful('/api/resolveMod', realMod.resolveMod);

restful('/api/showVirtualNodeModule', virtualMod.showVirtualNodeModule);

restful('/api/changeVirtualVer/:ver', virtualMod.changeVirtualVer);

restful('/api/showMyMod', virtualMod.showMyMod);

restful('/api/changeVirtualLocalModToV2', virtualMod.changeVirtualLocalModToV2);

/**
 * 暴露配置好的router对象
 */
export const APP_ROUTER = getRouter();
