import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Empty, Row, Spin } from 'antd';
import SubApp from 'components/SubApp';
import { STAR_LIST } from 'configs/constant/ccModule';
import { STORE } from 'configs/constant/page';
import React from 'react';
import * as commonService from 'services/common';
import { typeCtxM, useC2Mod } from 'services/concent';

function setup(c) {
  const ctx = typeCtxM(STAR_LIST, {}, c);
  ctx.effect(() => {
    ctx.mr.initStarList();
  }, []);
  return {
    gotoStorePage: () => commonService.historyPush(STORE),
  };
}

export default React.memo(() => {
  const { state, settings } = useC2Mod(STAR_LIST, { setup, ccClassKey: 'StarList' });
  return (
    <Spin spinning={state.loading}>
      {state.subApps.length === 0 && !state.loading ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 80,
          }}
          description={<span> 暂无我的收藏，去应用市场逛逛吧 </span>}
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
          <SubApp key={v.name} appData={v} module="starList" />
        ))}
      </Row>
    </Spin>
  );
});
