import { core, logicSrv } from 'hel-micro';
import React from 'react';
import * as baseShareHooks from '../../hooks/share';
import type { IInnerRemoteModuleProps } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import * as share from '../share';

const { merge2List } = core.commonUtil;

function getStyleList(props: IInnerRemoteModuleProps) {
  let list: string[] = [];
  const { shadow, extraCssList, cssListToStr, extraShadowCssList, extraShadowCssListToStr } = props;
  if (!shadow) {
    return list;
  }
  if (!cssListToStr && extraCssList) {
    list = merge2List(list, extraCssList);
  }
  if (!extraShadowCssListToStr && extraShadowCssList) {
    list = merge2List(list, extraShadowCssList);
  }
  return list;
}

function getRemoteModule(appName: string, props: IInnerRemoteModuleProps, passCtx: { [key: string]: any }) {
  const { isLib, compName } = props;
  const emitApp = logicSrv.getLibOrApp(appName, props);

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

export default function useLoadRemoteModule(props: IInnerRemoteModuleProps) {
  const { name: appName, extraShadowStyleStr = '' } = props;
  const forceUpdate = baseShareHooks.useForceUpdate();
  const [state, setState] = baseShareHooks.useObject({ errMsg: '', shadowStyleStr: '', isShadowStyleStrFetched: false });
  const isLoadAppDataExecutingRef = React.useRef(false);
  const isLoadAppStyleExecutingRef = React.useRef(false);
  const { errMsg, shadowStyleStr, isShadowStyleStrFetched } = state;

  return {
    getModule: () => {
      const SkeletonView = props.Skeleton || BuildInSkeleton;
      const passCtx = { isLoadAppDataExecutingRef, isLoadAppStyleExecutingRef, setState, SkeletonView, forceUpdate };

      // 拉取模块过程中产生错误
      if (errMsg) {
        return share.getErrResult(props, errMsg);
      }

      // 模块还未缓存，是首次获取
      let RemoteModule = getRemoteModule(appName, props, passCtx);
      if (!RemoteModule) {
        return share.fetchRemoteModule(props, passCtx);
      }

      // 组件已获取完毕，需获取样式字符串，则继续执行 fetchRemoteAppStyle
      if (props.shadow && !isShadowStyleStrFetched && (props.cssListToStr || props.extraShadowCssListToStr)) {
        return share.fetchRemoteModuleStyle(props, passCtx);
      }

      // 提取可注入到shadow 的样式列表
      const styleUrlList = getStyleList(props);
      // 拼接上用户额外透传的样式字符串
      const styleStr = `${shadowStyleStr}${extraShadowStyleStr}`;
      // 如用户透传了具体组件，表示复用 name 对应的预设应用样式，使用用户透传的组件渲染
      RemoteModule = props.Component || RemoteModule;
      return { RemoteModule, styleStr, styleUrlList, moduleReady: true };
    },
    errMsg,
  };
}
