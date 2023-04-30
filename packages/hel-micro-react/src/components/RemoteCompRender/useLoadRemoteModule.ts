import { appStyleSrv, core, logicSrv } from 'hel-micro';
import React from 'react';
import * as baseShareHooks from '../../hooks/share';
import type { IInnerUseRemoteCompOptions, IRemoteCompRenderConfig } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import * as share from '../share';

const { merge2List } = core.commonUtil;

function getStyleList(name: string, options: IInnerUseRemoteCompOptions) {
  let result = appStyleSrv.getAppCssList(name, options);
  let list = result.appCssList;
  const { shadow, extraCssList, cssListToStr } = options;
  if (!shadow) {
    return list;
  }
  if (!cssListToStr && extraCssList) {
    list = merge2List(list, extraCssList);
  }
  return list;
}

function getRemoteModule(appName: string, options: IInnerUseRemoteCompOptions, passCtx: { [key: string]: any }) {
  const { isLib, compName } = options;
  const emitApp = logicSrv.getLibOrApp(appName, options);

  // 获取的是 libReady 弹射出去的组件
  if (isLib) {
    if (!emitApp) {
      return null;
    }
    const libRoot: Record<string, any> = emitApp.appProperties || {};
    // 不传子组件名称， 表示返回的是 libReady 弹出的根模块
    if (!compName) {
      return libRoot;
    }
    const libComp = libRoot[compName];
    if (!libComp) {
      passCtx.setState({ errMsg: `comp [${compName}] not exist` });
    }
    return libComp;
  }

  return emitApp?.Comp;
}

export default function useLoadRemoteModule(config: IRemoteCompRenderConfig) {
  const { controlOptions, name } = config;
  const { Component, Skeleton } = controlOptions;
  const [state, setState] = baseShareHooks.useObject({ errMsg: '', shadowStyleStr: '', isShadowStyleStrFetched: false });
  const isLoadAppDataExecutingRef = React.useRef(false);
  const isLoadAppStyleExecutingRef = React.useRef(false);
  const { errMsg, shadowStyleStr, isShadowStyleStrFetched } = state;

  const SkeletonView = Skeleton || BuildInSkeleton;
  const passCtx = { isLoadAppDataExecutingRef, isLoadAppStyleExecutingRef, setState, SkeletonView };

  // 拉取模块过程中产生错误
  if (errMsg) {
    return share.getErrResult(config.controlOptions.Error, errMsg);
  }

  // 模块还未缓存，是首次获取
  let RemoteModule = getRemoteModule(name, controlOptions, passCtx);
  if (!RemoteModule) {
    return share.fetchRemoteModule(config, passCtx);
  }

  // 组件已获取完毕，需获取样式字符串，则继续执行 fetchRemoteAppStyle
  if (!isShadowStyleStrFetched) {
    return share.fetchRemoteModuleStyle(config, passCtx);
  }

  // 提取可注入到 shadowdom 的样式列表
  const styleUrlList = getStyleList(name, controlOptions);
  // 如用户透传了具体组件，表示复用 name 对应的预设应用样式，使用用户透传的组件渲染
  RemoteModule = Component || RemoteModule;
  return { errMsg, RemoteModule, styleStr: shadowStyleStr, styleUrlList, moduleReady: true };
}
