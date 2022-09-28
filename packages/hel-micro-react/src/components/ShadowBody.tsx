import { getGlobalThis, getHelEventBus } from 'hel-micro-core';
import React from 'react';
import ReactDOM from 'react-dom';
import ShadowView from 'shadow-view';

const COMP_NAME = 'hel-shadow-body';
const STATIC_COMP_NAME = 'hel-static-shadow-body';
const bus = getHelEventBus();

function makeBodyMountNode(name: string, prefix: string) {
  const doc = getGlobalThis().document;
  const div = doc.createElement('div');
  div.id = `${prefix}_${name || ''}`;
  // avoid read only warning: div.style = ''
  div.setAttribute('style', 'position: absolute; top: 0px; left: 0px; width: 100%;');
  doc.body.appendChild(div);
  return div;
}

class ShadowBody extends React.Component<{ id: string }> {
  node: null | HTMLDivElement = null;

  constructor(props: any) {
    super(props);
    this.node = makeBodyMountNode(this.props.id, 'shadowBodyBox');
  }

  componentWillUnmount() {
    if (this.node) {
      getGlobalThis().document.body.removeChild(this.node);
    }
  }

  render() {
    const { node, props } = this;
    // 正常情况下，这句话的判断不会成立，此处为了让 tsc 编译通过
    if (!node) return <h1>node not ready</h1>;

    // @ts-ignore，暂时避免 react-18 的类型误报问题（18版本之前此处不会报错）
    return ReactDOM.createPortal(<ShadowView {...{ tagName: COMP_NAME, ...props }} />, node);
  }
}

const staticShadowBodyRefs: Record<string, any> = {};
const staticShadowBodyRefRenderingMap: Record<string, boolean> = {};

export function getStaticShadowBodyRef(name: string) {
  return staticShadowBodyRefs[name] || null;
}

export function getShadowBodyReadyEvName(name: string) {
  const evName = `ReactShadowBody_${name}`;
  return evName;
}

export function tryMountStaticShadowBody(props: any, createRoot: any) {
  const name = props.id;
  if (getStaticShadowBodyRef(name)) {
    return;
  }
  if (staticShadowBodyRefRenderingMap[name]) {
    return;
  }
  staticShadowBodyRefRenderingMap[name] = true;

  const mountNode = makeBodyMountNode(name, 'staticShadowBodyBox');
  const evName = getShadowBodyReadyEvName(name);

  // @ts-ignore，暂时避免 react-18 的类型误报问题（18版本之前此处不会报错）
  const uiShadowView = (
    <ShadowView
      {...{
        tagName: STATIC_COMP_NAME,
        ...props,
        onShadowRootReady: (bodyRef: React.ReactHTMLElement<any>) => {
          staticShadowBodyRefs[name] = bodyRef;
          bus.emit(evName, bodyRef);
        },
      }}
    />
  );

  if (createRoot) {
    const root = createRoot(mountNode);
    root.render(uiShadowView);
  } else {
    ReactDOM.render(uiShadowView, mountNode);
  }
}

export default ShadowBody;
