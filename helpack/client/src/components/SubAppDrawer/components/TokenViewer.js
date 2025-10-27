import { Button, message } from 'antd';
import React from 'react';
import { typeCtxDe, useSetup } from 'services/concent';
import { getSubAppToken } from 'services/subApp';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  return {
    tryGetToken: () => {
      ctx.emit('tryGetToken', async (appName) => {
        message.info(`应用 [${appName}] token 获取中...`, 1);
        try {
          const appToken = await getSubAppToken(appName);
          ctx.emit('tokenGot', { appName, appToken });
        } catch (err) {
          message.error(err.message, 1);
        }
      });
    },
  };
}

export default React.memo(function TokenViewer(props) {
  const se = useSetup(setup);

  return (
    <div>
      {props.children}
      <Button size="small" type="primary" onClick={se.tryGetToken}>
        查看token
      </Button>
    </div>
  );
});
