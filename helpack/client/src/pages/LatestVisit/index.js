import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Empty, Row, Spin } from 'antd';
import SubApp from 'components/SubApp';
import { LATEST_VISIT } from 'configs/constant/ccModule';
import { STORE } from 'configs/constant/page';
import React from 'react';
import * as commonService from 'services/common';
import { typeCtxM, useC2Mod } from 'services/concent';

function setup(c) {
  const ctx = typeCtxM(LATEST_VISIT, {}, c);
  ctx.effect(() => {
    ctx.mr.initVisitList();
  }, []);
  return {
    gotoStorePage: () => commonService.historyPush(STORE),
  };
}

export default React.memo(() => {
  const { state, settings } = useC2Mod(LATEST_VISIT, { setup });
  return (
    <Spin spinning={state.loading}>
      {state.subApps.length === 0 && !state.loading ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 80,
          }}
          description={<span> 暂无最近访问，去应用市场逛逛吧 </span>}
        >
          <Button type="primary" icon={<AppstoreOutlined />} onClick={settings.gotoStorePage}>
            探索更多有趣应用
          </Button>
        </Empty>
      ) : (
        ''
      )}
      <Row gutter={[16, 16]}>
        {state.subApps.map((v) => (
          <SubApp key={v.name} delVisit={true} appData={v} module={LATEST_VISIT} />
        ))}
      </Row>
    </Spin>
  );
});
