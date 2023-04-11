import React from 'react';
import ReactDOM from 'react-dom';
import { useForceUpdate } from '../hooks/share';
import { IShadowViewImplProps } from '../types';

function ShadowContent(props: any) {
  const { children, root } = props;
  return ReactDOM.createPortal(children, root);
}

export default function ShadowViewV2(props: IShadowViewImplProps) {
  const {
    style = {},
    styleContent = '',
    delegatesFocus = true,
    styleSheets = [],
    shadowDelay = 0,
    children = '',
    transitionDuration = '.3s',
    tagName = 'hel-shadow-view',
    data = '',
  } = props;
  const shadowHostRef = React.useRef<HTMLDivElement | null>(null);
  const shadowRootRef = React.useRef<{ root: ShadowRoot | null }>({ root: null });
  const isDelayCalledRef = React.useRef<{ called: boolean }>({ called: false });
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    const shadowHost = shadowHostRef.current;
    if (!shadowHost || shadowRootRef.current.root) {
      return;
    }

    // 拿到 div 实例后对其添加 shadow 节点
    const shadowRoot = shadowHost.attachShadow({ mode: 'open', delegatesFocus });
    props.onShadowRootReady(shadowRoot);
    shadowRootRef.current.root = shadowRoot;
    forceUpdate();

    if (shadowDelay && !isDelayCalledRef.current.called) {
      setTimeout(() => {
        isDelayCalledRef.current.called = true;
        forceUpdate();
      }, shadowDelay);
    }
    // here trust my code, ban react-hooks/exhaustive-deps
    // eslint-disable-next-line
  }, []);

  const shadowRoot = shadowRootRef.current.root;
  const isDelayCalled = isDelayCalledRef.current.called;
  const uiComp = !shadowDelay || isDelayCalled ? children : '';

  const uiContent = (
    <>
      {/* shadowRoot 节点准备就绪才开始调用 createPortal 渲染孩子节点 */}
      {shadowRoot && (
        <ShadowContent root={shadowRoot}>
          <section id="HelStyleSection">
            {styleSheets.map((url: string, idx: number) => (
              <link key={idx} type="text/css" rel="stylesheet" href={url}></link>
            ))}
            <style type="text/css">{styleContent}</style>
          </section>
          {uiComp}
        </ShadowContent>
      )}
    </>
  );

  const elProps = { ref: shadowHostRef, style: { transitionDuration, ...style }, data };
  return React.createElement(tagName, elProps, uiContent);
}
