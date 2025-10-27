/* eslint-disable no-unused-vars */
/** @typedef {'test'|'prod'} FormCreateMode*/
// 基础表单页
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message, Modal, Radio, Tag, Tooltip } from 'antd';
import Blank, { NormalSpanBlank } from 'components/dumb/Blank';
import EasyForm from 'components/EasyForm';
import { cst } from 'concent';
import { HEL_CHARGER } from 'configs/constant';
import React from 'react';
import { typeCtxM, useC2Mod } from 'services/concent';
import * as subAppService from 'services/subApp';
import * as objUtil from 'utils/object';
import regs from 'utils/regs';
import { detailFieldConf, getDefaultValues, getNewToken, simpleFieldConf } from './fieldConf';

const stDemoLink = {
  borderRadius: '3px',
  backgroundColor: 'white',
  padding: '0 3px',
  margin: '0 3px',
};

const validNameTip = '合法的应用名形如：@xx-scope/xx-name（带scope）, xx-name（不带scope）';

const formUiTypeOptions = [
  { label: '简单', value: 'simple' },
  { label: '详细', value: 'detail' },
];

const SmallCircle = () => (
  <div
    style={{
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '4px',
      backgroundColor: 'var(--lra-theme-color)',
    }}
  ></div>
);

function getFormDefaultValues(subApp) {
  const demoValues = getDefaultValues();
  let values = demoValues;
  if (!objUtil.isNull(subApp)) {
    values = {};
    Object.keys(demoValues).forEach((key) => (values[key] = subApp[key]));
  }
  values.token = getNewToken();
  return values;
}

const setup = (c) => {
  const ctx = typeCtxM(cst.MODULE_DEFAULT, {}, c);
  const { initState, emit } = ctx;
  const { subApp, mode, hasAct = false } = ctx.props;
  const defaultValues = getFormDefaultValues(subApp);
  /** @type {FormCreateMode} */
  const formCreateMode = mode || 'prod';
  if (formCreateMode === 'prod') {
    defaultValues.app_group_name = defaultValues.name;
    defaultValues.is_test = 0;
  } else {
    defaultValues.is_test = 1;
  }

  const ins = initState({
    defaultValues,
    toCommitValues: {},
    actKey: '', // 活动选择
    hasAct,
    formUiType: 'simple',
    formCreateMode,
    confirmCreateModalVisible: false,
  });
  const { state } = ins;

  const cancelFormBtnLoading = () => {
    setTimeout(() => {
      emit('cancelFormBtnLoading');
    }, 300);
  };

  let isTokenNeedRefresh = false;

  const settings = {
    insState: state,
    onValuesChange: (changed, /** @type {import('antd/lib/form').FormInstance} */ form) => {
      const values = form.getFieldsValue();
      const { defaultValues } = state;
      if (objUtil.hasProperty(changed, 'name') && state.formCreateMode === 'prod') {
        form.setFieldsValue({ app_group_name: changed.name });
        Object.assign(defaultValues, values, { app_group_name: changed.name });
      } else {
        Object.assign(defaultValues, values);
      }

      if (objUtil.hasProperty(changed, 'name') && isTokenNeedRefresh) {
        isTokenNeedRefresh = false;
        form.setFieldsValue({ token: getNewToken() });
      }

      ins.setState({ defaultValues });
    },
    onFormFinish: async (formValues) => {
      const warn = (str) => {
        message.warn(str);
        cancelFormBtnLoading();
      };
      /** @type {typeof state.defaultValues} */
      const toCommitValues = objUtil.safeAssign(state.defaultValues, formValues);
      objUtil.ensureArr(toCommitValues, 'owners');
      objUtil.ensureArr(toCommitValues, 'gray_users');
      if (toCommitValues.enable_gray && toCommitValues.gray_users.length === 0) {
        return warn('当前应用开启了灰度功能，请设置灰度用户名单');
      }
      if (toCommitValues.owners.length > 50) {
        return warn('负责人不能大于 50');
      }
      if (toCommitValues.gray_users.length > 50) {
        return warn('灰度名单不能大于 50');
      }

      const { is_local_render, render_app_host, name } = toCommitValues;
      if (is_local_render === false) {
        if (!render_app_host) {
          return warn('应用选择了不在当前平台渲染，请填写【应用的渲染域名】');
        }
        if (!regs.url.test(render_app_host)) {
          return warn('填写的应用渲染域名不合法');
        }
      }

      const chars = name.split('');
      const atIdx = name.indexOf('@');
      const slashIdx = name.indexOf('/');
      const lastIdx = chars.length - 1;
      const slashCount = chars.filter((v) => v === '/').length;
      const atCount = chars.filter((v) => v === '@').length;
      if (
        // '/a/a'
        slashCount > 1
        // '@a@a'
        || atCount > 1
        // aa@a
        || (atCount === 1 && !name.startsWith('@'))
        // @aa
        || (atCount === 1 && name.startsWith('@') && slashCount === 0)
        // @/aa
        || (atCount === 1 && name.startsWith('@') && slashCount === 1 && slashIdx === atIdx + 1)
        // @aa/
        || (atCount === 1 && name.startsWith('@') && slashCount === 1 && slashIdx === lastIdx)
      ) {
        return warn(`应用名不合法，请重新填写，${validNameTip}`);
      }

      ins.setState({ toCommitValues, confirmCreateModalVisible: true });
    },
    getUiTitle: () => {
      return (
        <div>
          新建&nbsp;&nbsp;
          {state.formCreateMode === 'prod' ? <Tag color="#f50">正式</Tag> : <Tag color="gray">测试</Tag>}
          应用
          <Blank width="8px" />
          <Tooltip
            title={
              <>
                欢迎到hel创建你的专属应用，点击访问示例：
                <a
                  href="https://unpkg.com/hel-tpl-remote-vue-comps@1.5.3/hel_dist/index.html"
                  target="blink"
                  rel="noopener"
                  style={stDemoLink}
                >
                  vue2x-demo
                </a>
                ， 如创建应用遇到问题，可联系&nbsp;<Tag color="#f50">{HEL_CHARGER}</Tag>
              </>
            }
          >
            <QuestionCircleOutlined />
          </Tooltip>
          <Blank />
          <Radio.Group options={formUiTypeOptions} value={state.formUiType} onChange={ins.syncer.formUiType} />
          {state.hasAct && (
            <Button
              data-key="join_hel_lib"
              onClick={settings.selAct}
              style={{ float: 'right' }}
              type={state.actKey === 'join_hel_lib' ? 'primary' : 'default'}
            >
              Hel函数模块活动
            </Button>
          )}
        </div>
      );
    },
    getFieldConf() {
      return state.formUiType === 'simple' ? simpleFieldConf : detailFieldConf;
    },
    selAct(e) {
      ctx.setState({ actKey: e.currentTarget.dataset.key });
      const valuesCopy = { ...state.defaultValues };
      valuesCopy.name = 'hlib-yourRtx';
      valuesCopy.app_group_name = 'hlib-yourRtx';
      valuesCopy.cnname = 'hel函数模块';
      valuesCopy.git_repo_url = 'https://github.com/hel-eco/hel-activity/my-first-hel-lib';
      valuesCopy.enable_gray = 0;
      valuesCopy.ui_framework = 'lib';
      valuesCopy.desc = '这是我的第一个hel函数模块，他将被多个项目远程动态加载';
      message.info('欢迎━(*｀∀´*)ノ 参加创建hel函数模块活动');
      ctx.emit('fillFormValues', valuesCopy);
    },
    async createApp(createOne = true) {
      const { toCommitValues, formCreateMode } = ins.state;
      const values = objUtil.clone(toCommitValues);
      if (!values.ui_framework) {
        values.ui_framework = 'lib';
      }
      if (!values.class_key) {
        values.class_key = '';
      }

      values.cnname = values.cnname || values.name;

      try {
        ins.setState({ confirmCreateModalVisible: false });
        await subAppService.createSubApp(values);
        const label = formCreateMode === 'prod' ? '正式' : '测试';
        message.success(`${label}应用[${values.name}]创建成功！`);
        // 一定是创建一个正式与一个测试，第二个创建的是测试应用
        if (!createOne) {
          const testApp = objUtil.clone(values);
          testApp.name = `${testApp.name}-test`;
          testApp.is_test = 1;
          testApp.token = getNewToken();
          await subAppService.createSubApp(testApp);
          isTokenNeedRefresh = true;
          message.success(`测试应用[${testApp.name}]创建成功！`);
        }
      } catch (err) {
        message.error(err.message);
      } finally {
        cancelFormBtnLoading();
      }
    },
    closeConfirmModal() {
      ins.setState({ confirmCreateModalVisible: false });
      cancelFormBtnLoading();
    },
    getModalTitle() {
      if (state.formCreateMode === 'prod') {
        return '请选择创建应用模式';
      }
      return '创建应用二次确认提示';
    },
    getModalFooter() {
      if (state.formCreateMode === 'prod') {
        return [
          <Button key="1" onClick={settings.closeConfirmModal}>
            取消
          </Button>,
          <Button key="2" type="primary" onClick={() => settings.createApp(false)}>
            创建正式与测试
          </Button>,
          <Button key="3" type="primary" onClick={() => settings.createApp(true)}>
            仅创建正式
          </Button>,
        ];
      }
      return [
        <Button key="1" onClick={settings.closeConfirmModal}>
          取消
        </Button>,
        <Button key="2" type="primary" onClick={() => settings.createApp(true)}>
          创建
        </Button>,
      ];
    },
    getModalContent() {
      if (state.formCreateMode === 'prod') {
        return (
          <div>
            <h4>
              <SmallCircle />
              <NormalSpanBlank />
              创建正式与测试
            </h4>
            <p>
              为应用所属组 {state.defaultValues.app_group_name} 同时再创建一个测试应用{' '}
              <Tag color="green">{state.defaultValues.name}-test</Tag>
            </p>
            <h4>
              <SmallCircle />
              <NormalSpanBlank />
              仅创建正式
            </h4>
            <p>只创建正式应用，后续可以在应用商店查到当前应用后并点击【同组复制】达到再次创建测试应用效果</p>
          </div>
        );
      }
      return (
        <div>
          确认为应用组 {state.defaultValues.app_group_name} 创建新测试应用 {state.defaultValues.name} 吗？
        </div>
      );
    },
  };

  return settings;
};

export default React.memo((props) => {
  const { settings } = useC2Mod(cst.MODULE_DEFAULT, { setup, props });
  const { insState } = settings;

  return (
    <div style={{ textAlign: 'center' }}>
      <Alert
        style={{ width: '1110px', margin: '0 auto 12px auto' }}
        type="info"
        message={<>如需填写【灰度名单】、【负责人】等信息，可选择详细选项，或等到创建完毕后到应用详情里做二次修改</>}
      />
      <Card title={settings.getUiTitle()} style={{ width: '1110px', margin: '0 auto', textAlign: 'left' }}>
        <EasyForm
          key={insState.formUiType}
          onValuesChange={settings.onValuesChange}
          onFinish={settings.onFormFinish}
          layout="vertical"
          fields={settings.getFieldConf()}
          submitBtnLabel="提交"
          fillValues={insState.defaultValues}
        />
      </Card>
      <Modal
        title={settings.getModalTitle()}
        onCancel={settings.closeConfirmModal}
        visible={insState.confirmCreateModalVisible}
        footer={settings.getModalFooter()}
      >
        {settings.getModalContent()}
      </Modal>
    </div>
  );
});
