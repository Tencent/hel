import { Alert, Button, Modal, Tag } from 'antd';
import { OPEN_SUB_APP_DRAWER } from 'configs/constant/event';
import React from 'react';
import { ccReducer, emit, getModelComputed, typeCtxDe, useSetup } from 'services/concent';
import { getBackendRenderPath } from 'services/shared/appPath';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    visible: false,
    appName: '',
    renderAppPath: '',
    isLocalRender: true,
    subApp: null,
  });
  ctx.on('openConfirmVisitAppModal', (appName, subApp) => {
    const { is_local_render = true } = subApp;
    const renderAppPath = subApp.render_app_host || getBackendRenderPath(appName);
    ins.setState({ appName, visible: true, isLocalRender: is_local_render, subApp, renderAppPath });
  });

  const settings = {
    ins,
    cancel() {
      ins.setState({ visible: false });
    },
    ok(noNewTab) {
      const { appName, isLocalRender, renderAppPath } = ins.state;
      settings.cancel();
      ccReducer.portal.changeSubApp({ appName, isLocalRender, noNewTab, renderAppPath });
    },
    seeVersion() {
      settings.cancel();
      if (ins.state.subApp) {
        emit(OPEN_SUB_APP_DRAWER, ins.state.subApp, 'version');
      }
    },
    seeApp() {
      settings.cancel();
      if (ins.state.subApp) {
        emit(OPEN_SUB_APP_DRAWER, ins.state.subApp, 'application');
      }
    },
  };
  return settings;
}

function ConfirmVisitAppModal() {
  const settings = useSetup(setup);
  const isAdmin = getModelComputed('portal').isAdmin;
  const {
    ins: { state },
  } = settings;
  const footer = [
    <Button key="1" onClick={settings.cancel}>
      取消
    </Button>,
    <Button key="2" onClick={settings.seeApp}>
      查看应用
    </Button>,
    <Button key="3" onClick={settings.seeVersion}>
      查看版本
    </Button>,
    isAdmin ? (
      <Button key="4" onClick={() => settings.ok(true)}>
        访问(当前页签打开)
      </Button>
    ) : null,
    <Button key="5" type="primary" onClick={() => settings.ok()}>
      确认访问
    </Button>,
  ].filter(Boolean);

  return (
    <Modal width={680} visible={state.visible} onCancel={settings.cancel} footer={footer} title={`确认访问应用 ${state.appName}`}>
      <Alert
        message={
          <div>
            <p>
              如果当前应用 {state.appName} 并非UI渲染型应用（仅是一个函数库）， 或发布者未提供具体的跳转链接，你可能访问到
              <Tag color="#cd201f">白屏页面</Tag>。
            </p>
            <p>点击下方【查看应用】按钮进入应用详情页，进一步编辑跳转链接、灰度名单、负责人等信息。</p>
            <p>点击下方【查看版本】按钮进入应用的版本列表页，使用灰度、回滚、查看元数据等功能。</p>
          </div>
        }
        type="info"
      />
    </Modal>
  );
}

export default React.memo(ConfirmVisitAppModal);
