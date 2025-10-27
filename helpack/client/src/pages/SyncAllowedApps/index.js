/* eslint-disable */
import { Button, message, Result, Spin, Tag } from 'antd';
import { NormalBlank, VerticalBlank } from 'components/dumb/Blank';
import { useConcent } from 'concent';
import copy from 'copy-to-clipboard';
import React from 'react';
import * as allowedAppSrv from 'services/allowedApp';
import { getModelComputed } from 'services/concent';
import s from 'styles/common.module.css';

/** @typedef {import('types/store').CtxDe} CtxPre */

function setup(/** @type CtxPre */ ctx) {
  const ins = ctx.initState({
    loading: false,
    wrapLoading: false,
    list: [],
  });

  const initAllowedApps = async () => {
    try {
      ins.setState({ wrapLoading: true });
      const list = await allowedAppSrv.getAllowedApps();
      ins.setState({ wrapLoading: false, list });
    } catch (err) {
      ins.setState({ wrapLoading: false });
      message.error(err.message);
    }
  };

  ctx.effect(() => {
    initAllowedApps();
  }, []);

  const settings = {
    ins,
    async submit() {
      try {
        ins.setState({ loading: true });
        const list = await allowedAppSrv.refreshAllowedApps();
        ins.setState({ list, loading: false });
        message.success(`同步成功，当前外网可访问应用共计 ${list.length} 个`);
      } catch (err) {
        ins.setState({ loading: false });
        message.error(err.message);
      }
    },

    copy() {
      message.success('复制应用白名单成功！');
      copy(ins.state.list.join(','));
    },

    copyJson() {
      message.success('复制应用白名单Json成功！');
      copy(JSON.stringify(ins.state.list));
    },
  };
  return settings;
}

/** @typedef {import('types/store').CtxDe<{}, ReturnType<typeof setup>} Ctx */

export default React.memo(() => {
  /** @type Ctx */
  const { settings } = useConcent({ setup }, 'SyncStaff');
  const { ins } = settings;
  const isAdmin = getModelComputed('portal').isAdmin;

  if (!isAdmin) {
    return <Result title="403" />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <Spin spinning={ins.state.wrapLoading}>
        <h3>外网可访问白名单：</h3>
        <div style={{ textAlign: 'left' }}>
          {ins.state.list.map((v) => (
            <Tag key={v} style={{ marginBottom: '3px' }}>
              {v}
            </Tag>
          ))}
        </div>
      </Spin>
      <VerticalBlank />
      <Button loading={ins.state.loading} type="primary" onClick={settings.submit}>
        开始同步
      </Button>
      <NormalBlank />
      <Button onClick={settings.copy}>复制</Button>
      <NormalBlank />
      <Button onClick={settings.copyJson}>复制Json</Button>
      <div style={{ marginTop: '12px' }}>
        <span className={s.tipLabelWrap}>点击【开始同步】按钮，将同步数据里的应用外网访问白名单到各个后台服务实例节点中</span>
      </div>
    </div>
  );
});
