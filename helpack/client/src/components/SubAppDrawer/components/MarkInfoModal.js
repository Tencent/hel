/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { Alert, Input, message, Modal } from 'antd';
import { VerticalBlank } from 'components/dumb/Blank';
import { PORTAL, VERSION_LIST } from 'configs/constant/ccModule';
import React from 'react';
import { ccReducer, getModelState, typeCtxDe, useSetup } from 'services/concent';
import * as subAppSrv from 'services/subApp';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    mode: 'user',
    visible: false,
    desc: '',
    loading: false,
    title: '添加标记描述',
    alertDesc: '',
    appVerData: null,
    markData: null,
  });

  ctx.on('openMarkInfoModal', (/** @type {SubAppVersion} */ appVerData, mode) => {
    const { userMarkedList } = getModelState(PORTAL);
    const { globalMarkedList } = getModelState(VERSION_LIST);
    if (mode === 'user') {
      const markData = userMarkedList.find((item) => item.ver === appVerData.sub_app_version);
      const title = markData ? '修改个人标记描述' : '添加个人标记描述';
      const desc = markData ? markData.desc : '';
      const alertDesc = `你正在为应用版本 ${appVerData.sub_app_version} 添加个人标记，方便你以后可快速筛选个人关心的版本数据`;
      ins.setState({ visible: true, appVerData, desc, markData, title, alertDesc, mode });
      return;
    }

    const markData = globalMarkedList.find((item) => item.ver === appVerData.sub_app_version);
    const title = markData ? '修改全局标记描述' : '添加全局标记描述';
    const desc = markData ? markData.desc : '';
    const alertDesc = `你正在为应用版本 ${appVerData.sub_app_version} 添加全局标记，方便以后所有人都可快速筛选相关版本数据`;
    ins.setState({ visible: true, appVerData, desc, markData, title, alertDesc, mode });
  });

  return {
    ins,
    close() {
      ins.setState({ visible: false, loading: false });
    },
    async submit() {
      const { appVerData, desc, mode, title } = ins.state;
      if (!appVerData) {
        return;
      }
      ins.setState({ loading: true });
      const { sub_app_name: name } = appVerData;
      const verTag = appVerData.version_tag || appVerData.sub_app_version;

      try {
        if (mode === 'user') {
          await subAppSrv.updateAppUserMarkInfo({ name, ver: verTag, desc });
          await ccReducer.portal.initUserExtendData();
        } else {
          await subAppSrv.updateAppGlobalMarkInfo({ name, ver: verTag, desc });
          await ccReducer.VersionList.freshSubAppGlobalMarkInfo(name);
        }

        message.success(`${title}成功`);
        ccReducer.VersionList.refreshTableCurPage();
        ins.setState({ loading: false, visible: false });
      } catch (err) {
        message.error(err.message);
        ins.setState({ loading: false });
      }
    },
  };
}

export default React.memo(function () {
  const settings = useSetup(setup);
  const {
    ins: { state, syncer },
  } = settings;

  return (
    <Modal
      visible={state.visible}
      onCancel={settings.close}
      width="800px"
      title={state.title}
      onOk={settings.submit}
      confirmLoading={state.loading}
      okText="确认"
      cancelText="取消"
    >
      <Input value={state.desc} onChange={syncer.desc} placeholder="（可选）请输入描述" />
      <VerticalBlank />
      <Alert message={state.alertDesc} type="info" showIcon />
    </Modal>
  );
});
