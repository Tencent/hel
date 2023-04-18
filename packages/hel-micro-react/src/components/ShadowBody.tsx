import { commonUtil, getGlobalThis, getHelEventBus, IGetVerOptions } from 'hel-micro-core';
import React from 'react';
import ReactDOM from 'react-dom';
import defaults from '../consts/defaults';
import type { IRemoteCompRenderConfig } from '../types';
import * as wrap from '../wrap';
import ShadowView from './ShadowViewV2';

const { STATIC_SHADOW_BODY_NAME } = defaults;

const bus = getHelEventBus();

function makeBodyMountNode(name: string, nodeId: string) {
  const doc = getGlobalThis().document;
  const div = doc.createElement('div');
  div.id = nodeId;
  // avoid read only warning: div.style = ''
  div.setAttribute('style', 'position: absolute; top: 0px; left: 0px; width: 100%;');
  commonUtil.setDataset(div, 'name', name);
  doc.body.appendChild(div);
  return div;
}

class ShadowBody extends React.Component<{ id: string; [key: string]: any }> {
  node: null | HTMLDivElement = null;

  constructor(props: any) {
    super(props);
    this.node = makeBodyMountNode(this.props.id, 'ShadowBodyBox');
  }

  componentWillUnmount() {
    if (this.node) {
      getGlobalThis().document.body.removeChild(this.node);
    }
  }

  render() {
    const { node, props } = this;
    const { ShadowView, ...restProps } = props;
    // 正常情况下，这句话的判断不会成立，此处为了让 tsc 编译通过
    if (!node) return <h1>node not ready</h1>;
    // @ts-ignore，暂时避免 react-18 的类型误报问题（18版本之前此处不会报错）
    return ReactDOM.createPortal(<ShadowView {...restProps} />, node);
  }
}

export function getHostData(name: string, options: IGetVerOptions) {
  const { platform, versionId } = options;
  const data = `${platform}/${name}/${versionId}`;
  return data;
}

export function getShadowBodyReadyEvName(name: string, options: IGetVerOptions) {
  const evName = `ReactShadowBody/${getHostData(name, options)}`;
  return evName;
}

export function tryMountStaticShadowBody(props: any, config: IRemoteCompRenderConfig) {
  const { name, controlOptions } = config;
  if (wrap.getStaticShadowBodyRef(name, controlOptions)) {
    return;
  }
  if (wrap.getStaticShadowBodyStatus(name, controlOptions)) {
    return;
  }
  wrap.setStaticShadowBodyStatus(name, 1, controlOptions);

  // mounting to body directly will lead the error below:
  // Rendering components directly into document.body is discouraged,
  // since its children are often manipulated by third-party scripts and browser extensions.
  // This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.
  // so we create a mount node manually
  const mountNode = makeBodyMountNode(name, 'StaticShadowBodyBox');
  const evName = getShadowBodyReadyEvName(name, controlOptions);
  const ShadowViewImpl = controlOptions.ShadowViewImpl || ShadowView;
  const uiShadowView = (
    // @ts-ignore，暂时避免 react-18 的类型误报问题（18版本之前此处不会报错：其实例类型 "ShadowView" 不是有效的 JSX 元素）
    <ShadowViewImpl
      {...{
        ...props,
        tagName: STATIC_SHADOW_BODY_NAME,
        onShadowRootReady: (bodyRef: React.ReactHTMLElement<any>) => {
          wrap.setStaticShadowBodyRef(name, bodyRef, controlOptions);
          bus.emit(evName);
        },
      }}
    />
  );

  if (controlOptions.createRoot) {
    const root = controlOptions.createRoot(mountNode);
    root.render(uiShadowView);
  } else {
    ReactDOM.render(uiShadowView, mountNode);
  }
}

export default ShadowBody;
