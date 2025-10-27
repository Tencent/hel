/** @typedef {import('types/domain').SubApp} SubApp*/
import {
  AppstoreOutlined,
  BranchesOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  LinkOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Alert, Drawer, message, Radio, Tag } from 'antd';
import { NormalBlank } from 'components/dumb/Blank';
import EasyForm from 'components/EasyForm';
import { CANCEL_FORM_BTN_LOADING, OPEN_SUB_APP_DRAWER } from 'configs/constant/event';
import React from 'react';
import { ccReducer, getModelState, typeCtxDe, useSetup } from 'services/concent';
import * as helUtil from 'utils/hel';
import AppVersionList from './AppVersionList';
import MarkInfoModal from './components/MarkInfoModal';
import MetaDataDrawer from './components/MetaDataDrawer';
import ResetVerModal from './components/ResetVerModal';
import fieldConf, { disabledFields } from './fieldConf';
import ProjVerMap from './ProjVerMap';
import ServerModList from './ServerModList';
import Setting from './Setting';

const { Group, Button } = Radio;
let key = 1;

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    owners: [],
    disableEdit: true,
    visible: false,
    subApp: {},
    selTab: 'application',
    key: Date.now(),
  });
  const { state } = ins;

  ctx.on('tryGetToken', (cb) => {
    cb(ins.state.subApp.name);
  });
  ctx.on('tokenGot', ({ appName, appToken }) => {
    if (ins.state.subApp.name === appName) {
      message.success(`应用 [${appName}] token 获取成功...`, 1);
      ctx.emit('fillFormValues', { token: appToken });
    }
  });

  ctx.on(OPEN_SUB_APP_DRAWER, (/** @type SubApp*/ subApp, selTab = 'application') => {
    const user = getModelState('portal').userInfo.user;
    const createUser = subApp.create_by;
    const owners = subApp.owners || [];
    const disableEdit = !(owners.includes(user) || createUser === user);
    const subAppCopy = { proj_ver: { map: {} }, ...subApp };
    const allOwners = owners.slice();
    if (!allOwners.includes(createUser)) allOwners.push(createUser);
    key += 1;
    ccReducer.VersionList.setState({ subApp: subAppCopy });
    ins.setState({ key, owners: allOwners, disableEdit, visible: true, subApp: subAppCopy, selTab });
    settings.switchTab(selTab);
  });

  const settings = {
    onClose: () => {
      ins.setState({ visible: false, selTab: 'application' });
      ccReducer.VersionList.clear();
    },
    onFormFinish: (values) => {
      const toUpdate = { id: state.subApp.id, ...values };
      if (!Array.isArray(toUpdate.owners)) toUpdate.owners = [toUpdate.owners];
      if (!Array.isArray(toUpdate.gray_users)) toUpdate.gray_users = [toUpdate.gray_users];

      if (toUpdate.owners.length > 50) {
        ctx.emit(CANCEL_FORM_BTN_LOADING);
        return message.warn('负责人不能大于 50');
      }
      if (toUpdate.gray_users.length > 50) {
        ctx.emit(CANCEL_FORM_BTN_LOADING);
        return message.warn('灰度名单不能大于 50');
      }
      if (!toUpdate.cnname) {
        toUpdate.cnname = toUpdate.name;
      }
      if (toUpdate.cnname.length > 128) {
        ctx.emit(CANCEL_FORM_BTN_LOADING);
        return message.warn('中文名称不能大于128位');
      }

      const { token, ...rest } = toUpdate;
      rest.render_app_host = rest.render_app_host || ''; // 防止提交 null 到后台

      ccReducer.appStore
        .updateSubApp(rest)
        .then((ret) => {
          if (ret) {
            message.info('更新成功');
            ins.setState({ subApp: { ...state.subApp, ...toUpdate } });
          }
        })
        .catch((err) => message.warn(err.message))
        .finally(() => ctx.emit(CANCEL_FORM_BTN_LOADING));
    },
    getFieldConf: () => (state.disableEdit ? disabledFields : fieldConf),
    getUiExtraBtns: () =>
      state.disableEdit
        ? [<Alert key="1" type="warning" style={{ marginTop: '12px' }} message={`无权限修改,请联系 ${state.owners.join(',')}`} />]
        : [],
    switchTab: (selTab) => {
      const appName = ins.state.subApp.name;
      ins.setState({ selTab });
      if (!appName) {
        message.warn('缺失 appName 参数');
        return;
      }

      if (selTab === 'visit') {
        ctx.emit('openConfirmVisitAppModal', appName, ins.state.subApp);
      }
    },
    state: state,
  };

  return settings;
}

function SubAppDrawer() {
  const settings = useSetup(setup);
  const { subApp, selTab, visible, disableEdit, key } = settings.state;
  const { name } = subApp;

  const title = (
    <div>
      应用 <span style={{ color: 'var(--lra-theme-color)' }}>{name}</span>
      <NormalBlank />
      <Group value={selTab} onChange={(e) => settings.switchTab(e.target.value)}>
        <Button value={'application'}>
          <AppstoreOutlined /> 编辑应用
        </Button>
        <Button value={'version'}>
          <DatabaseOutlined /> 版本列表
        </Button>
        <Button value={'server_mod'}>
          <CloudServerOutlined /> 服务端列表 <Tag color="#cd201f">new</Tag>
        </Button>
        <Button value={'proj_ver'}>
          <BranchesOutlined /> 项目与版本
        </Button>
        <Button value={'visit'}>
          <LinkOutlined /> 访问应用
        </Button>
        <Button value={'setting'} style={{ width: '105px', textAlign: 'center' }}>
          <SettingOutlined /> 设置
        </Button>
      </Group>
    </div>
  );

  let UIDrawerContent = '';
  if (selTab === 'application') {
    UIDrawerContent = (
      <EasyForm
        key={key}
        onFinish={settings.onFormFinish}
        layout="vertical"
        fields={settings.getFieldConf()}
        submitBtnLabel="提交"
        fillBtn="重置"
        showSelfBtn={!disableEdit}
        extraBtns={settings.getUiExtraBtns()}
        fillValues={subApp}
      />
    );
  } else if (selTab === 'proj_ver') {
    UIDrawerContent = <ProjVerMap name={name} />;
  } else if (selTab === 'setting') {
    UIDrawerContent = <Setting subApp={subApp} />;
  } else if (selTab === 'server_mod') {
    UIDrawerContent = <ServerModList name={name} />;
  } else {
    UIDrawerContent = <AppVersionList name={name} />;
  }

  return (
    <Drawer
      width="1180px"
      title={title}
      placement="right"
      closable={true}
      onClose={settings.onClose}
      visible={visible}
      zIndex={200}
      getContainer={helUtil.getAppBodyContainer}
    >
      {UIDrawerContent}
      <MarkInfoModal />
      <MetaDataDrawer />
      <ResetVerModal />
    </Drawer>
  );
}

export default React.memo(SubAppDrawer);
