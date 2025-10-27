/** @typedef {import('hel-types').ISubApp} SubApp*/
import { Drawer, Tag } from 'antd';
import SubAppCreateForm from 'components/SubAppCreateForm';
import { OPEN_COPY_SUB_APP_LAYER } from 'configs/constant/event';
import React from 'react';
import { typeCtxDe, useSetup } from 'services/concent';
import * as helUtil from 'utils/hel';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    mode: 'prod',
    /** @type {SubApp} */
    subApp: {},
    visible: false,
  });
  const { state } = ins;

  ctx.on(OPEN_COPY_SUB_APP_LAYER, (/** @type SubApp*/ subApp, mode = 'prod') => {
    ins.setState({ mode, subApp, visible: true });
  });

  const settings = {
    state,
    onClose() {
      ins.setState({ visible: false });
    },
    getTitle() {
      if (state.mode === 'prod') {
        return <>以应用 {state.subApp.name} 为模板复制一个新应用组的新应用</>;
      }
      return (
        <>
          以应用
          {state.subApp.name} 为模板复制一个同应用组 <Tag color="var(--lra-theme-color)">{state.subApp.app_group_name}</Tag>
          的新应用
        </>
      );
    },
  };

  return settings;
}

function SubAppCopyLayer() {
  const settings = useSetup(setup);
  const { subApp, mode, visible } = settings.state;

  return (
    <Drawer
      width="1180px"
      title={settings.getTitle()}
      placement="right"
      closable={true}
      onClose={settings.onClose}
      visible={visible}
      zIndex={200}
      getContainer={helUtil.getAppBodyContainer}
    >
      <SubAppCreateForm key={`${subApp.name}_${mode}`} subApp={subApp} mode={mode} />
    </Drawer>
  );
}

export default React.memo(SubAppCopyLayer);
