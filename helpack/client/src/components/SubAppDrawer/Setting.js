/* eslint-disable no-unused-vars,semi,react/prop-types */
/** @typedef {import('types/domain').SubApp} SubApp */
/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message, Radio, Spin } from 'antd';
import { NormalBlank, VerticalBlank } from 'components/dumb/Blank';
import { APP_STORE } from 'configs/constant/ccModule';
import React from 'react';
import * as allowedAppSrv from 'services/allowedApp';
import { getModelComputed, getModelState, typeCtxM, useC2Mod } from 'services/concent';
import s from 'styles/common.module.css';
import * as objUtil from 'utils/object';
import { getMetaApiUrl } from 'utils/url';

const allowedOptions = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

function setup(c) {
  const ctx = typeCtxM(APP_STORE, {}, c);
  const ins = ctx.initState({
    pSubApp: ctx.props.subApp || {},
    pResetAppInfoBtnLoading: false,
    pAllowOutAccessBtnLoading: false,
    pAllowOutAccessCardLoading: false,
    isAllowed: false,
    isAllowedOri: false,
  });

  const getName = () => {
    const { name } = ins.state.pSubApp;
    if (!name) {
      throw new Error('缺失应用名');
    }
    return name;
  };

  const initAllowedData = async () => {
    try {
      ins.setState({ pAllowOutAccessCardLoading: true });
      const name = getName();
      const isAllowed = await allowedAppSrv.getIsAppAllowed(name);
      ins.setState({ pAllowOutAccessCardLoading: false, isAllowed, isAllowedOri: isAllowed });
    } catch (err) {
      message.error(err.message);
      ins.setState({ pAllowOutAccessBtnLoading: false });
    }
  };

  ctx.effect(() => {
    initAllowedData();
  }, []);

  const settings = {
    ins,
    isUserAdmin() {
      const isAdmin = getModelComputed('portal').isAdmin;
      return isAdmin;
    },
    getCanNotEditTip() {
      const { owners = [], create_by: createBy } = ins.state.pSubApp;
      const allOwners = owners.slice();
      objUtil.noDupPush(allOwners, createBy);
      return `暂不能修改设置，请联系${allOwners.join(',')}`;
    },
    canEdit() {
      const user = getModelState('portal').userInfo.user;
      const { owners = [], create_by: createBy } = ins.state.pSubApp;
      return settings.isUserAdmin() || owners.includes(user) || createBy === user;
    },
    async resetAppInfo() {
      try {
        const name = getName();
        ins.setState({ pResetAppInfoBtnLoading: true });
        await ctx.mr.resetAppInfoCache(name);
        message.success(`刷新应用 ${name} 缓存成功`);
        ins.setState({ pResetAppInfoBtnLoading: false });
      } catch (err) {
        message.error(err.message);
        ins.setState({ pResetAppInfoBtnLoading: false });
      }
    },
    async changeAllowed() {
      try {
        if (!settings.canEdit()) {
          return message.error(settings.getCanNotEditTip());
        }

        const name = getName();
        const { isAllowed } = ins.state;
        ins.setState({ pAllowOutAccessBtnLoading: true });
        await allowedAppSrv.changeAllowed(name, isAllowed);
        message.success(`修改应用 ${name} 允许外网访问设置成功`);
        ins.setState({ pAllowOutAccessBtnLoading: false, isAllowed, isAllowedOri: isAllowed });
      } catch (err) {
        message.error(err.message);
        console.trace(err);
        ins.setState({ pAllowOutAccessBtnLoading: false, isAllowed: ins.state.isAllowedOri });
      }
    },
    onAllowedChanged(e) {
      ins.setState({ isAllowed: e.target.value });
    },
  };

  return settings;
}

function Setting(props) {
  const { settings } = useC2Mod(APP_STORE, { setup, props });
  const { state } = settings.ins;

  return (
    <>
      {settings.isUserAdmin() && <Alert type="info" message="你正在以超管身份修改应用设置" />}
      {!settings.canEdit() && <Alert type="warning" message={settings.getCanNotEditTip()} />}
      <Card>
        <Button type="primary" disabled={!settings.canEdit()} onClick={settings.resetAppInfo} loading={state.pResetAppInfoBtnLoading}>
          刷新应用缓存
        </Button>
        <VerticalBlank height="8px" />
        <span className={s.tipLabelWrap}>
          <ExclamationCircleOutlined />
          <NormalBlank />
          刷新 app_info 数据，仅当修改了数据库里的 app_info 数据时，点击此按钮才有意义
        </span>
      </Card>
      <VerticalBlank />
      <Card>
        <Spin spinning={state.pAllowOutAccessCardLoading}>
          <div>
            <Button type="link">允许外网访问</Button>
            <NormalBlank />
            <Radio.Group options={allowedOptions} value={state.isAllowed} onChange={settings.onAllowedChanged} />
            <Button
              type="primary"
              disabled={!settings.canEdit()}
              onClick={settings.changeAllowed}
              loading={state.pAllowOutAccessBtnLoading}
            >
              确认修改
            </Button>
          </div>
        </Spin>
        <VerticalBlank height="8px" />
        <span className={s.tipLabelWrap}>
          <ExclamationCircleOutlined />
          <NormalBlank />
          开启此功能后，元数据获取
          <a href={getMetaApiUrl(state.pSubApp.name)} target="_blank" rel="noopener noreferrer">
            外网接口
          </a>
          才可用
        </span>
      </Card>
    </>
  );
}

Setting.displayName = 'Setting';

export default React.memo(Setting);
