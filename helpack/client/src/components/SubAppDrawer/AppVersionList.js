/* eslint-disable no-unused-vars,semi,react/prop-types */
/** @typedef {import('types/domain').SubApp} SubApp */
/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import {
  ArrowRightOutlined,
  BugOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { Alert, Button, Col, Divider, Input, message, Radio, Row, Spin, Tag, Tooltip } from 'antd';
import { NormalBlank, NormalSpanBlank, VerticalBlank } from 'components/dumb/Blank';
import GeneralTable from 'components/GeneralTable';
import { VERSION_LIST } from 'configs/constant/ccModule';
import copy from 'copy-to-clipboard';
import React from 'react';
import { getAppPipelineProjSpace } from 'services/common';
import { getModelState, typeCtxM, useC2Mod } from 'services/concent';
import * as dateUtil from 'utils/date';
import * as helper from './logic/helper';

const stTitle = {
  color: 'rgba(0,0,0,.7)',
  verticalAlign: 'top',
};
const stCol = { minHeight: '26px' };

const listModeOptions = [
  { label: '全部', value: 'all' },
  { label: '已标记', value: 'tag' },
];

const Label = (props) => <span style={{ color: '#838383de' }}>{props.children}</span>;

const Title = React.memo(() => {
  const { state, syncer, sync, mr } = useC2Mod(VERSION_LIST, { tag: 'VTableTitle' });
  const placeholder = state.changeMode === 'gray' ? '请输入欲修改的灰度版本' : '请输入欲修改的线上版本';
  const inputTitle =
    state.changeMode === 'gray' ? (
      <>
        <BugOutlined />
        <NormalBlank />
        <span style={{ color: 'grey' }}>灰度版本: </span>
      </>
    ) : (
      <>
        <WindowsOutlined />
        <NormalBlank />
        <span style={{ color: 'blue' }}>线上版本: </span>
      </>
    );
  const uiGrayEnabled =
    state.subApp.enable_gray === 1 ? (
      <span>
        灰度功能：<Label>已启用</Label> <CheckCircleOutlined style={{ color: 'green' }} />
        <Divider type="vertical" />
      </span>
    ) : (
      <span>
        灰度功能：<Label>未启用</Label> <CloseCircleOutlined style={{ color: 'red' }} />
        <Divider type="vertical" />
      </span>
    );

  let uiGrayStatus = '';
  let uiGrayUsers = '';
  if (state.subApp.enable_gray === 1) {
    uiGrayStatus = (
      <span>
        灰度版本：<Label>{state.subApp.build_version}</Label> <Divider type="vertical" />
        灰度状态：{' '}
        {state.subApp.is_in_gray ? (
          <>
            <Label>灰度中</Label> <ExclamationCircleOutlined style={{ color: 'red' }} />
          </>
        ) : (
          <>
            <Label>已通过</Label> <SmileOutlined style={{ color: 'green' }} />
          </>
        )}
      </span>
    );
    uiGrayUsers = (
      <div style={{ wordBreak: 'break-all', wordWrap: 'break-word' }}>
        灰度名单：<Label>{state.subApp.gray_users.join(',')}</Label>
      </div>
    );
  }

  let uiChangeGrayVerBtn = '';
  if (state.subApp.enable_gray === 1) {
    uiChangeGrayVerBtn = (
      <>
        <Button onClick={mr.showChangeGrayInput} danger>
          切换灰度版本
        </Button>
        <NormalBlank />
      </>
    );
  }

  let uiAgreeGray = '';
  // 只要处于灰度中，就显示灰度通过按钮
  if (state.subApp.is_in_gray) {
    uiAgreeGray = (
      <>
        <Button loading={state.grayBtnLoading} type="primary" onClick={mr.clickAgreeGrayBtn}>
          灰度通过
        </Button>
        <NormalBlank />
      </>
    );
  }

  const { user } = getModelState('portal').userInfo;
  return (
    <div>
      <div>
        你好，亲爱的用户{user}， Hel 已为该应用一共构建了 <Tag color={helper.tagColors.online}>{state.buildTotal}</Tag>个版本 （包含{' '}
        <Tag color={helper.tagColors.globalMarked}>{state.markTotal}</Tag>个标记版本）
      </div>
      <div>
        线上版本：<Label>{state.subApp.online_version}</Label>
      </div>
      <div>
        {uiGrayEnabled}
        {uiGrayStatus}
      </div>
      {uiGrayUsers}
      <div style={{ float: 'right', margin: '12px 12px 0 0' }}>
        <Radio.Group
          options={listModeOptions}
          onChange={(e) => mr.changeListMode(e.target.value)}
          value={state.listMode}
          style={{ width: '150px' }}
        />
        <NormalBlank />
        {uiAgreeGray}
        {uiChangeGrayVerBtn}
        <Tooltip title="注入指定版本作为在线版本，并点击确认按钮来完成切换">
          <Button onClick={mr.showChangeOnlineInput} danger>
            切换在线版本
          </Button>
        </Tooltip>
        <NormalBlank />
        <Button onClick={mr.freshSubAppAssociateAndTable}>刷新</Button>
      </div>
      {state.showInput ? (
        <div style={{ float: 'right', marginRight: '12px', width: '100%' }}>
          <VerticalBlank height="12px" />
          <div style={{ float: 'right' }}>
            {inputTitle}
            <Input style={{ width: '360px' }} value={state.inputVersion} onChange={syncer.inputVersion} placeholder={placeholder} />
            <NormalBlank />
            <Button loading={state.updateLoading} type="primary" onClick={mr.clickUpdateVersionBtn}>
              确认
            </Button>
            <NormalBlank />
            <Button onClick={sync('showInput', false)}>取消</Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
});

const renderVersion = (record, tableCtx, titleUiMode = 'hasTitle') => {
  const [cardLoading, setCardLoading] = React.useState(false);
  const { hasTopPagination, total, uiPagination } = tableCtx;
  const { $uiType } = record;
  if ($uiType === 'topPagination') {
    // 加一个顶部的分页组件
    return hasTopPagination && total > 5 && uiPagination;
  }
  if ($uiType === 'switchAllTip' || $uiType === 'switchMarkTip') {
    if (total === 0) {
      return helper.buildHelModCreationTutorialTip(titleUiMode);
    }
    return $uiType === 'switchAllTip' ? helper.buildSwitchAllTip(titleUiMode) : helper.buildSwitchMarkTip(titleUiMode);
  }

  // 以下开始正常渲染逻辑
  const { uiConner, stCard, CardComp, uiGlobalMarkDesc, uiUserMarkDesc } = helper.buildConnerAndStCard(record, { stTitle, stCol });
  const actions = helper.buildCardActions(record, setCardLoading, titleUiMode);
  const { pureGitRepoUrl, uiGitHashLinks } = helper.buildUiGitHashLinks(record);
  const verStr = record.version_tag || record.sub_app_version;

  const copyVersion = (e) => {
    helper.ste(e);
    copy(verStr);
    message.success(`复制版本号 ${verStr} 成功`, 1);
  };
  const copyGitBranch = (e) => {
    helper.ste(e);
    copy(record.git_branch);
    message.success(`复制分支 ${record.git_branch} 成功`, 1);
  };

  return (
    <Spin key={record.sub_app_version} spinning={cardLoading}>
      <CardComp actions={actions} style={stCard} hoverable={true}>
        <Row gutter={5} style={{ position: 'relative' }}>
          <Col span="13" style={stCol}>
            <span style={stTitle}>版本号：</span>
            {verStr} <CopyOutlined onClick={copyVersion} />
          </Col>
          <Col span="11" style={stCol}>
            <span style={stTitle}>构建时间：</span>
            {dateUtil.tryGetLocaleStrOfISOStr(record.create_at)}
          </Col>
          <Col span="13" style={stCol}>
            <span style={stTitle}>触发者：</span>
            {record.create_by}
          </Col>
          <Col span="11" style={{ ...stCol, verticalAlign: 'top' }}>
            <span style={stTitle}>构建分支：</span> {record.git_branch} <NormalSpanBlank />
            <CopyOutlined onClick={copyGitBranch} />
            <NormalSpanBlank />
            <a target="_blank" rel="noopener noreferrer" href={`${pureGitRepoUrl}/tree/${record.git_branch}`} onClick={helper.ste}>
              <ArrowRightOutlined />
            </a>
          </Col>
          <Col span="13" style={stCol}>
            <span style={stTitle}>git 提交 hash：</span>
            {uiGitHashLinks}
          </Col>
          <Col span="11" style={stCol}>
            <span style={stTitle}>蓝盾项目空间：</span>
            {record.project_name}
            <NormalSpanBlank />
            <a target="_blank" rel="noopener noreferrer" href={getAppPipelineProjSpace(record)} onClick={helper.ste}>
              <ArrowRightOutlined />
            </a>
          </Col>
          <Col span="24" style={stCol}>
            <span style={stTitle}>git提交描述：</span>
            {record.desc}
          </Col>
          {uiGlobalMarkDesc}
          {uiUserMarkDesc}
          {uiConner}
        </Row>
      </CardComp>
    </Spin>
  );
};

/** @type {()=>import('antd/lib/table/interface').ColumnsType<SubAppVersion>} */
const getColumns = (tableCtx) => [
  {
    key: 'op',
    title: () => <Title />,
    render: (val, record) => renderVersion(record, tableCtx),
  },
];

const titleTip =
  '请从以下版本列表里选择一版作为项目id的对应版本，注意需点击版本卡片底部的【线上】、【灰度】、【线上与灰度】按钮来完成选择操作';
const getNoTitleColumns = (tableCtx) => [
  {
    key: 'op',
    title: () => <Alert type="info" message={titleTip} />,
    render: (val, record) => renderVersion(record, tableCtx, 'noTitle'),
  },
];

function setup(c) {
  const ctx = typeCtxM(VERSION_LIST, {}, c);
  const ins = ctx.initState({ pFetchSubAppEnd: false });

  ctx.mr.freshSubAppAssociate(ctx.props.name).then(() => {
    ins.setState({ pFetchSubAppEnd: true });
  });

  return {
    ins,
    fetchFn: ctx.mr.fetchVersionList,
    pageSizeOptions: ['10', '20', '30'],
  };
}

function AppVersionList(props) {
  const { titleUiMode = 'hasTitle' } = props;
  const { settings } = useC2Mod(VERSION_LIST, { setup, props, tag: 'AppVersionList' });
  const getColumnsFn = titleUiMode === 'hasTitle' ? getColumns : getNoTitleColumns;
  const { state } = settings.ins;

  return (
    <>
      {state.pFetchSubAppEnd && (
        <GeneralTable
          tid="vTable"
          rowKey="sub_app_version"
          fetchFn={settings.fetchFn}
          getColumns={getColumnsFn}
          pageSizeOptions={settings.pageSizeOptions}
          hasTopPagination={true}
        />
      )}
    </>
  );
}

AppVersionList.displayName = 'AppVersionList';

export default React.memo(AppVersionList);
