import React from 'react';

export default function ShadowViewV2(props: any) {
  const { styleWrap, styleContent, styleSheets, shadowDelay } = props;
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (wrapRef && wrapRef.current) {
      const createShadow = () => {
        const shadowHost = wrapRef.current;
        if (!shadowHost) {
          return;
        }
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        [].slice.call(shadowHost.children).forEach((child) => {
          shadowRoot.appendChild(child);
        });
      };

      if (shadowDelay) {
        setTimeout(createShadow, shadowDelay);
      } else {
        createShadow();
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div ref={wrapRef} style={styleWrap}>
      <head>
        {styleSheets.map((url: string, idx: number) => <link key={idx} type='text/css' rel='stylesheet' href={url}></link>)}
        <style type="text/css">
          {styleContent}
        </style>
      </head>
      {props.children}
    </div>
  );
}
