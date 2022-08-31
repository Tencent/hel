import type { ILocalCompProps } from '../../types';
import React from 'react';
import { helLoadStatus } from 'hel-micro-core';
import * as baseShareHooks from '../../hooks/share';
import defaults from '../../consts/defaults';
import BuildInSkeleton from '../BuildInSkeleton';
import * as share from '../share';


function judgeFetchStyleStr(props: ILocalCompProps, fetchStyleStatusRef: React.RefObject<any>) {
  const { setStyleAsString = defaults.SET_STYLE_AS_STRING, styleUrlList = [] } = props;
  if (fetchStyleStatusRef.current === helLoadStatus.LOADED) {
    return false;
  }
  const shouldFetchStyle = setStyleAsString && styleUrlList.length > 0;
  return shouldFetchStyle;
}


export default function useLoadStyle(props: ILocalCompProps) {
  const forceUpdate = baseShareHooks.useForceUpdate();
  const [errMsg, setErrMsg] = React.useState('');
  const [styleStr, setStyleStr] = React.useState('');
  const fetchStyleStatusRef = React.useRef(helLoadStatus.NOT_LOAD);

  return {
    getStyle: () => {
      const SkeletonView = props.Skeleton || BuildInSkeleton;
      const passCtx = { setStyleStr, fetchStyleStatusRef, setErrMsg, SkeletonView, forceUpdate };

      // 拉取模块过程中产生错误
      if (errMsg) {
        return share.getErrResult(props, errMsg);
      }

      // 组件已获取完毕，需要获取样式字符串，则继续执行 fetchLocalCompStyleStr
      const shouldFetchStyleStr = judgeFetchStyleStr(props, fetchStyleStatusRef);
      if (shouldFetchStyleStr) {
        return share.fetchLocalCompStyleStr(props.styleUrlList || [], passCtx);
      }

      const finalStyleStr = `${styleStr}${props.styleStr || ''}`;
      // 设置了需要将css列表转为字符串，则返回空样式列表给上层，因逻辑走这里其实已将传入的样式列表转为了字符串
      const finalStyleUrlList = props.setStyleAsString ? [] : (props.styleUrlList || []);
      return { styleStr: finalStyleStr, styleUrlList: finalStyleUrlList, moduleReady: true };
    },
    errMsg,
  };
}
