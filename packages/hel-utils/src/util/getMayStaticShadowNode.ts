import { getCustomData, IGetVerOptions, getGlobalThis } from 'hel-micro-core';

interface IGetMayStaticShadowNodeOptions extends IGetVerOptions {
  /**
   * 兜底节点，默认 document.body
   */
  fallbackNode?: HTMLElement;
}

/**
 * 当组件是被 hel-micro-react 等库使用 shadow-dom 渲染时，可用此函数返回对应的处于body下 shadow-dom 节点
 * 通常用于为ui库弹层型组件设置挂载节点，它们默认是挂到body下，使用此函数配合组件的 getContainer attach 能修改挂载点属性
 * 将组件渲染到 shadow-dom 里，以便样式不丢失
 * @param name 
 * @param options 
 * @returns 
 */
export function getMayStaticShadowNode(name: string, options?: IGetMayStaticShadowNodeOptions): HTMLElement {
  const staticShadowNode = getCustomData(name, { customKey: 'ShadowBody', ...(options || {}) });
  const bodyNode = getGlobalThis().document.body;
  return staticShadowNode || options?.fallbackNode || bodyNode;
}
