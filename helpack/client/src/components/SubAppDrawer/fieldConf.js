import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { NormalBlank } from 'components/dumb/Blank';
import { appGroupNameTip, appNameTip, appRenderHostTip, appTokenTip, isLocalRender } from 'configs/constant/formTip';
import { APP_NAME_RULE } from 'configs/constant/share';
import * as helUtil from 'utils/hel';
import {
  defaultValues,
  fieldAppCnName,
  fieldAppDesc,
  fieldAppEnableGray,
  fieldAppEnablePipeline,
  fieldAppGrayUsers,
  fieldAppOwners,
  fieldClassId,
  fieldIsTest,
} from '../SubAppCreateForm/fieldConf';
import TokenViewer from './components/TokenViewer';

const commonRules = [
  { pattern: APP_NAME_RULE, message: '必需是英文、数字、下划线、中划线的组合，注意不要包含空格' },
  { max: 64, type: 'string', message: '长度不能大于30' },
];

const stTooltip = { zIndex: 9999999992 };

const fields = [
  {
    type: 'input',
    options: {
      name: 'token',
      label: (
        <TokenViewer>
          <span>
            应用token
            <Tooltip style={stTooltip} title={appTokenTip} color="blue" getTooltipContainer={helUtil.getAppBodyContainer}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          <NormalBlank />
        </TokenViewer>
      ),
      disabled: true,
      placeholder: 'input app token',
      rules: [{ required: true, message: '请输入应用token' }],
    },
  },
  {
    type: 'input',
    options: {
      name: 'app_group_name',
      disabled: true,
      label: (
        <span>
          应用所属组名称{' '}
          <Tooltip style={stTooltip} title={appGroupNameTip} color="blue" getTooltipContainer={helUtil.getAppBodyContainer}>
            <QuestionCircleOutlined />
          </Tooltip>
          <NormalBlank />
          <Tag color="blue">一个组名可对应多个应用名，表示应用对应的多种环境(例如不同的分支)</Tag>
        </span>
      ),
      placeholder: 'input app group name',
      rules: [{ required: true, message: '请输入应用组名称' }, ...commonRules],
    },
  },
  {
    type: 'input',
    options: {
      name: 'name',
      disabled: true,
      label: (
        <span>
          应用名称{' '}
          <Tooltip style={stTooltip} title={appNameTip} color="blue" getTooltipContainer={helUtil.getAppBodyContainer}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      placeholder: 'input app name',
      rules: [{ required: true, message: '请输入应用名称' }, ...commonRules],
    },
  },
  fieldIsTest,
  fieldAppCnName,
  fieldAppDesc,
  fieldClassId,
  fieldAppOwners,
  fieldAppEnableGray,
  fieldAppGrayUsers,
  fieldAppEnablePipeline,
  {
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
          是否在平台底座下渲染{' '}
          <Tooltip style={stTooltip} title={isLocalRender} color="blue" getTooltipContainer={helUtil.getAppBodyContainer}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
    },
  },
  {
    type: 'input',
    options: {
      name: 'render_app_host',
      label: (
        <span>
          应用渲染路径{' '}
          <Tooltip style={stTooltip} title={appRenderHostTip} color="blue" getTooltipContainer={helUtil.getAppBodyContainer}>
            <QuestionCircleOutlined />
          </Tooltip>
          <NormalBlank />
          <Tag color="blue">{appRenderHostTip}</Tag>
        </span>
      ),
    },
  },
  {
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
  },
];

export const disabledFields = fields.map((item) => {
  const itemCopy = { type: item.type, options: { ...item.options, disabled: true } };
  return itemCopy;
});

export default fields;
