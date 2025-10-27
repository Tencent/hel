/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { Alert, message, Modal } from 'antd';
import React from 'react';
import { ccReducer, typeCtxDe, useSetup } from 'services/concent';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    visible: false,
    verID: '',
    /** 版本对应的应用名称 */
    verAppName: '',
    alertDesc: '',
    loading: false,
  });

  ctx.on('openResetVerModal', (/** @type {SubAppVersion} */ appVerData) => {
    const { sub_app_version: verID, sub_app_name: verAppName } = appVerData;
    const alertDesc = `你正在尝试刷新应用版本 ${verID} 的缓存数据，此功能仅当数据库的应用版本有变更时，点击此按钮才有意义`;
    ins.setState({ visible: true, verID, verAppName, alertDesc });
  });

  return {
    ins,
    close() {
      ins.setState({ visible: false, loading: false, verID: '', verAppName: '' });
    },
    async submit() {
      const { verID, verAppName } = ins.state;
      if (!verID || !verAppName) {
        return;
      }
      ins.setState({ loading: true });
      try {
        await ccReducer.VersionList.resetVerCache({ verAppName, verID });
        message.success(`刷新${verAppName} ${verID}缓存成功`);
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
    ins: { state },
  } = settings;

  return (
    <Modal
      visible={state.visible}
      onCancel={settings.close}
      width="800px"
      title="刷新缓存"
      onOk={settings.submit}
      confirmLoading={state.loading}
      okText="确认"
      cancelText="取消"
    >
      <Alert message={state.alertDesc} type="info" showIcon />
    </Modal>
  );
});
