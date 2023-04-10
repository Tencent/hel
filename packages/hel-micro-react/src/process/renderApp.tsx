import { core, emitApp } from 'hel-micro';
import React from 'react';
import ReactDom from 'react-dom';
import type { IRenderAppOptions } from '../types';

function getHostNode(hostNodeId?: string) {
  const { document } = core.getGlobalThis();
  const id = hostNodeId ?? 'root';
  let node = document.getElementById(id);
  if (!node) {
    node = document.createElement('div');
    node.id = id;
    document.body.appendChild(node);
  }
  return node;
}

/**
 * 该函数由子应用调用，用于替换原来的 ReactDom.render 渲染入口
 * @param options
 * @returns
 */
export default function renderApp(options: IRenderAppOptions) {
  const { App, renderSelf, appGroupName, lifecycle, hostNodeId, renderSelfFn, createRoot } = options;
  const platform = options.platform || core.helConsts.DEFAULT_PLAT;
  // 如用户未自定义自渲染值 renderSelf， 则走非子应用(即是主应用)时才执行自渲染的逻辑
  let finalRenderSelf = renderSelf;
  if (finalRenderSelf === undefined) {
    // 建议切换到 hel-iso，此处保留为了兼容历史逻辑
    finalRenderSelf = !core.isSubApp();
  }
  const hostNode = getHostNode(hostNodeId);

  // 走自渲染逻辑
  if (finalRenderSelf === true) {
    if (renderSelfFn) {
      // 适配用户自定义渲染函数，例如 react-18 不再只是 ReactDom.render 方式了
      renderSelfFn(App, hostNode);
    } else if (createRoot) {
      // 也支持用户透传 createRoot 句柄来适配 react-18 渲染
      const root = createRoot(hostNode);
      root.render(<App />);
    } else {
      // @ts-ignore 因18版本react类型有问题，此处暂时让第三方引用编译到此处不报类型错误
      ReactDom.render(<App />, hostNode);
    }
    return;
  }

  // 弹射给引用方
  emitApp({ Comp: App, appGroupName, lifecycle, platform });
}
