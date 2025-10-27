import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Empty, Row, Spin } from 'antd';
import SubApp from 'components/SubApp';
import { CREATED_LIST } from 'configs/constant/ccModule';
import { NEW_APP } from 'configs/constant/page';
import React from 'react';
import * as commonService from 'services/common';
import { typeCtxM, useC2Mod } from 'services/concent';

function setup(c) {
  const ctx = typeCtxM(CREATED_LIST, {}, c);
  ctx.effect(() => {
    ctx.mr.initCreatedList(true);
  }, []);
  return {
    gotoNewAppPage: () => commonService.historyPush(NEW_APP),
  };
}

export default React.memo(() => {
  const { state, settings } = useC2Mod(CREATED_LIST, { setup, ccClassKey: 'CreatedList' });
  return (
    <Spin spinning={state.loading}>
      {state.subApps.length === 0 && !state.loading ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 80,
          }}
          description={<span> 暂无我的创建，去新建一个应用吧 </span>}
        >
          <Button type="primary" icon={<AppstoreOutlined />} onClick={settings.gotoNewAppPage}>
            创建我的第一个应用
          </Button>
        </Empty>
      ) : (
        ''
      )}
      <Row gutter={[16, 16]}>
        {state.subApps.map((v) => (
          <SubApp key={v.name} appData={v} module={CREATED_LIST} />
        ))}
      </Row>
    </Spin>
  );
});
