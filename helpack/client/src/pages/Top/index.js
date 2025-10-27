/** @typedef {import('types/store').CtxM<{}, 'top'>} CtxPre */
/** @typedef {import('types/domain').SubApp} ISubApp */
import { Row, Spin } from 'antd';
import SubApp from 'components/SubApp';
import { useConcent } from 'concent';
import React from 'react';

function setup(/** @type CtxPre */ ctx) {
  ctx.effect(() => {
    ctx.mr.initTop();
  }, []);
}

/** @typedef {import('types/store').CtxM<{}, 'top'} Ctx */

export default React.memo(() => {
  /** @type Ctx */
  const { state } = useConcent({ module: 'top', setup }, 'Top');

  return (
    <Spin spinning={state.loading}>
      <Row gutter={[16, 16]}>
        {state.subApps.map((v) => (
          <SubApp key={v.name} appData={v} module="top" />
        ))}
      </Row>
    </Spin>
  );
});
