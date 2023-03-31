import React from 'react';
import ReactDOM from 'react-dom';
import { useForceUpdate } from '../hooks/share';

function ShadowContent(props: any) {
  const { children, root } = props;
  return ReactDOM.createPortal(children, root);
}

export default function ShadowViewV2(props: any) {
  const { style = {}, styleContent, styleSheets, shadowDelay, children, tagName } = props;
  const shadowHostRef = React.useRef<HTMLDivElement | null>(null);
  const shadowRootRef = React.useRef<{ root: ShadowRoot | null }>({ root: null });
  const isDelayCalledRef = React.useRef<{ called: boolean }>({ called: false });
  const sectionIdRef = React.useRef(`HelStyleSection_${Date.now()}`);
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    const shadowHost = shadowHostRef.current;
    if (!shadowHost || shadowRootRef.current.root) {
      return;
    }

    // 拿到 div 实例后对其添加 shadow 节点
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
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
  const compContent = !shadowDelay || isDelayCalled ? children : '';

  const uiContent = (
    <>
      {/* shadowRoot 节点准备就绪才开始调用 createPortal 渲染孩子节点 */}
      {shadowRoot && (
        <ShadowContent root={shadowRoot}>
          <section id={sectionIdRef.current}>
            {styleSheets.map((url: string, idx: number) => (
              <link key={idx} type="text/css" rel="stylesheet" href={url}></link>
            ))}
            <style type="text/css">{styleContent}</style>
          </section>
          {compContent}
        </ShadowContent>
      )}
    </>
  );

  const elProps = { ref: shadowHostRef, style: { transitionDuration: '.3s ', ...style }, data: 'see-data' };
  return React.createElement(tagName, elProps, uiContent);
}
