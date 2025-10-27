/* eslint-disable */
import { Button, Input, message, Radio, Result, Tooltip } from 'antd';
import { NormalBlank, VerticalBlank } from 'components/dumb/Blank';
import { useConcent } from 'concent';
import React from 'react';
import { getModelComputed } from 'services/concent';
import { syncStaff } from 'services/staff';

/** @typedef {import('types/store').CtxDe} CtxPre */

function setup(/** @type CtxPre */ ctx) {
  const ins = ctx.initState({
    loading: false,
    syncType: 'corsProxy',
  });

  const settings = {
    ins,
    inputRef: React.createRef(),
    async submit() {
      const { syncType } = ins.state;
      const inputIns = settings.inputRef.current;
      if (!inputIns || !syncType) {
        return;
      }

      ins.setState({ loading: true });
      const staffStr = inputIns.resizableTextArea.textArea.value;
      if (syncType === 'corsProxy' && !staffStr.startsWith('{"code":0,"data":[{')) {
        ins.setState({ loading: false });
        return message.warn('提交数据不合法，可访问 http://xxx-cors.com 参考返回的数据格式');
      }
      if (syncType === 'wsdUsers' && !staffStr.startsWith('var _arrusers = [[')) {
        ins.setState({ loading: false });
        return message.warn('提交数据不合法，可访问 http://xxx-users.com 参考返回的数据格式');
      }

      await syncStaff(staffStr, syncType);
      ins.setState({ loading: false });
    },
  };
  return settings;
}

/** @typedef {import('types/store').CtxDe<{}, ReturnType<typeof setup>} Ctx */

export default React.memo(() => {
  /** @type Ctx */
  const { settings } = useConcent({ setup }, 'SyncStaff');
  const { inputRef, ins } = settings;
  const isAdmin = getModelComputed('portal').isAdmin;

  if (!isAdmin) {
    return <Result title="403" />;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Input.TextArea rows={25} ref={inputRef} style={{ backgroundColor: '#fcfafa' }} />
      <VerticalBlank />
      <Radio.Group onChange={ins.syncer.syncType} value={ins.state.syncType}>
        <Tooltip title="数据来自 http://xxx-cors/api/v1/getStaff">
          <Radio value="corsProxy">corsProxy数据</Radio>
        </Tooltip>
        <Tooltip title="数据来自 http://xxx-wsd-users/js/users.js">
          <Radio value="wsdUsers">wsdUsers数据</Radio>
        </Tooltip>
      </Radio.Group>
      <NormalBlank />
      <Button loading={ins.state.loading} type="primary" onClick={settings.submit}>
        开始同步
      </Button>
    </div>
  );
});
