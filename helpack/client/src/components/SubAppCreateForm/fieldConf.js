/* eslint-disable no-unused-vars,max-len */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import ClassIdDropdownSelect from 'components/ClassIdDropdownSelect';
import { NormalBlank } from 'components/dumb/Blank';
import RtxNameDropdownSelect from 'components/RtxNameDropdownSelect';
import { appGroupNameTip, appNameTip, appRenderHostTip, appTokenTip, isLocalRender, isTestTip } from 'configs/constant/formTip';
import { APP_NAME_RULE } from 'configs/constant/share';
import { getAppBodyContainer } from 'utils/hel';
import { genNonceStr } from 'utils/str';

const strLenRule = { max: 30, type: 'string', message: '长度不能大于30' };
const str64LenRule = { max: 64, type: 'string', message: '长度不能大于64' };
const tokenNameRule = { pattern: /^[a-zA-Z0-9-_]+$/, message: '只能是英文、数字、下划线、中划线的组合' };
const tokenRules = [{ required: true, message: '请输入应用token' }, strLenRule, tokenNameRule];
const appNameRules = [str64LenRule, APP_NAME_RULE];

const nameTip = '新建正式应用时，应用组名会自动与应用名保持一致，合法的应用名形如：@xx-scope/xx-name（带scope）, xx-name（不带scope）';
const stTooltip = { zIndex: 9999999992 };

export const defaultValues = {
  name: '',
  token: '',
  app_group_name: '',
  cnname: '',
  // splash_screen: IMG_TNEWS_SPLASH_SCREEN,
  splash_screen: '',
  desc: '',
  git_repo_url: '',
  api_host: '',
  is_test: 0,
  enable_gray: 0,
  enable_pipeline: 1,
  gray_users: [],
  owners: [],
  is_local_render: 0,
  render_app_host: '',
  ui_framework: 'lib',
};

export function getNewToken() {
  return `${location.hostname.split('.')[0]}-${genNonceStr()}-${Date.now()}`;
}

export function getDefaultValues() {
  const copy = { ...defaultValues };
  copy.token = getNewToken();
  return copy;
}

const fieldToken = {
  type: 'input',
  options: {
    name: 'token',
    label: (
      <span>
        应用token{' '}
        <Tooltip title={appTokenTip} color="blue" getPopupContainer={getAppBodyContainer}>
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    ),
    disabled: true,
    placeholder: 'input app token',
    rules: tokenRules,
  },
};
const fieldAppGroupName = {
  type: 'input',
  options: {
    name: 'app_group_name',
    disabled: true,
    label: (
      <span>
        应用所属组名称{' '}
        <Tooltip title={appGroupNameTip} color="blue" getTooltipContainer={getAppBodyContainer}>
          <QuestionCircleOutlined />
        </Tooltip>
        <NormalBlank />
        <Tag color="blue">一个组名可对应多个应用名，表示应用对应的多种环境(例如不同的分支)</Tag>
      </span>
    ),
    placeholder: '新建正式应用时【应用所属组名】默认和【应用名】保持一致',
    rules: [{ required: true, message: '请输入应用组名称' }, ...appNameRules],
  },
};
const fieldAppName = {
  type: 'input',
  options: {
    name: 'name',
    label: (
      <span>
        应用名称{' '}
        <Tooltip title={appNameTip} color="blue">
          <QuestionCircleOutlined getTooltipContainer={getAppBodyContainer} />
        </Tooltip>
        <NormalBlank />
        <Tag color="blue">{nameTip}</Tag>
      </span>
    ),
    placeholder: 'input app name',
    rules: [{ required: true, message: '请输入应用名称' }, ...appNameRules],
  },
};
export const fieldAppCnName = {
  type: 'input',
  options: {
    name: 'cnname',
    label: <span>应用中文名</span>,
    placeholder: 'input app cnname',
  },
};
export const fieldAppDesc = {
  type: 'input',
  options: {
    name: 'desc',
    label: <span>应用描述</span>,
    placeholder: 'input app desc',
    rules: [{ required: true, message: '请输入应用描述' }],
  },
};
export const fieldAppOwners = {
  type: 'customize',
  options: {
    name: 'owners',
    label: (
      <span>
        负责人
        <NormalBlank />
        <Tag color="blue">除创建人外，可添加负责人让其他人有权限修改此应用</Tag>
      </span>
    ),
    render: (optionsWithoutRender) => <RtxNameDropdownSelect {...optionsWithoutRender} />,
  },
};
export const fieldClassId = {
  type: 'customize',
  options: {
    name: 'class_key',
    label: (
      <span>
        分类
        <NormalBlank />
        <Tag color="blue">方便用户聚合查看某一类应用</Tag>
      </span>
    ),
    render: (optionsWithoutRender) => <ClassIdDropdownSelect {...optionsWithoutRender} />,
  },
};
export const fieldAppEnableGray = {
  type: 'radioGroup',
  options: {
    name: 'enable_gray',
    initValue: defaultValues.enable_gray,
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    label: (
      <span>
        是否灰度上线 <NormalBlank />
        <Tag color="blue">开启此功能后每次构建的版本不会立即上线，仅下发给灰度用户们，直到点击灰度通过才可全量访问</Tag>
      </span>
    ),
  },
};
export const fieldAppEnablePipeline = {
  type: 'radioGroup',
  options: {
    name: 'enable_pipeline',
    initValue: defaultValues.enable_pipeline,
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    label: (
      <span>
        是否允许插件执行 <NormalBlank />
        <Tag color="blue">开启后流水线里的元数据提取步骤能正常执行，关闭则拒绝执行，当需要在特殊时期禁止一切上线行为时可设置为关闭</Tag>
      </span>
    ),
  },
};
export const fieldAppGrayUsers = {
  type: 'customize',
  options: {
    name: 'gray_users',
    label: (
      <span>
        灰度用户
        <NormalBlank />
        <Tag color="blue">开启灰度上线功能后，此设置才有效</Tag>
      </span>
    ),
    render: (optionsWithoutRender) => <RtxNameDropdownSelect {...optionsWithoutRender} />,
  },
};
const fieldAppIsLocalRender = {
  type: 'radioGroup',
  options: {
    name: 'is_local_render',
    initValue: defaultValues.is_local_render,
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    label: (
      <span>
        是否在平台底座下渲染
        <Tooltip title={isLocalRender} color="blue" getTooltipContainer={getAppBodyContainer}>
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    ),
  },
};
const fieldAppRenderHost = {
  type: 'input',
  options: {
    name: 'render_app_host',
    label: (
      <span>
        应用渲染路径{' '}
        <Tooltip title={appRenderHostTip} color="blue" getTooltipContainer={getAppBodyContainer}>
          <QuestionCircleOutlined />
        </Tooltip>
        <NormalBlank />
        <Tag color="blue">{appRenderHostTip}</Tag>
      </span>
    ),
  },
};
const fieldAppGitRepoUrl = {
  type: 'input',
  options: {
    name: 'git_repo_url',
    label: (
      <span>
        git仓库地址 <NormalBlank />
        <Tag color="blue">建议填写，方便从helpack可以跳转到你的代码仓库</Tag>
      </span>
    ),
    placeholder: 'input git repo url',
  },
};
export const fieldIsTest = {
  type: 'radioGroup',
  options: {
    name: 'is_test',
    disabled: true,
    label: (
      <span>
        是否为正式{' '}
        <Tooltip style={stTooltip} title={isTestTip} color="blue" getTooltipContainer={getAppBodyContainer}>
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    ),
    initValue: defaultValues.is_test,
    options: [
      { value: 0, label: '是' },
      { value: 1, label: '否' },
    ],
    rules: [{ required: true }],
  },
};

export const simpleFieldConf = [
  fieldToken,
  fieldAppGroupName,
  fieldAppName,
  fieldAppDesc,
  fieldClassId,
  // fieldUiFramework,
  fieldAppGitRepoUrl,
];

export const detailFieldConf = [
  fieldToken,
  fieldAppGroupName,
  fieldAppName,
  fieldAppCnName,
  fieldAppDesc,
  fieldClassId,
  // fieldUiFramework,
  fieldAppGitRepoUrl,
  fieldAppOwners,
  fieldAppEnableGray,
  fieldAppEnablePipeline,
  fieldAppGrayUsers,
  fieldAppIsLocalRender,
  fieldAppRenderHost,
];

export default detailFieldConf;
