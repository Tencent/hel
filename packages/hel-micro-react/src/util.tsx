import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactIs from 'react-is';
import { commonUtil, getGlobalThis, log } from 'hel-micro-core';
import BuildInSkeleton from './components/BuildInSkeleton';

export function getSkeletonEl(UserSkeleton: any) {
  if (React.isValidElement(UserSkeleton)) {
    return UserSkeleton;
  }
  const SkeletonComp = UserSkeleton || BuildInSkeleton;
  return <SkeletonComp />;
}

export function getSkeletonComp(UserSkeleton: any) {
  if (React.isValidElement(UserSkeleton)) {
    return () => UserSkeleton;
  }
  const SkeletonComp = UserSkeleton || BuildInSkeleton;
  return SkeletonComp;
}

export function mayBindReactLibs() {
  const globalThis: any = getGlobalThis();
  const noReactLibs = () => !globalThis.React || !globalThis.ReactDOM || !globalThis.ReactIs;
  if (!commonUtil.isServer() && noReactLibs()) {
    log('auto bind react,react-dom,react-is to global.React,global.ReactDOM,global.ReactIs');
    globalThis.React = React;
    globalThis.ReactDOM = ReactDOM;
    globalThis.ReactIs = ReactIs;
  }
}
