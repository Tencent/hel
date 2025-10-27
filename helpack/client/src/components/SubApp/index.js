/* eslint-disable */
import { BugOutlined, CopyOutlined, EllipsisOutlined, ExclamationCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, message, Popover, Spin, Tag, Tooltip } from 'antd';
import { NormalBlank } from 'components/dumb/Blank';
import { ICON_DEL, ICON_GITCODE, ICON_STAR, ICON_STAR_NO } from 'configs/constant';
import * as ccModule from 'configs/constant/ccModule';
import { OPEN_COPY_SUB_APP_LAYER, OPEN_SUB_APP_DRAWER } from 'configs/constant/event';
import React from 'react';
import { getUserAvatarUrl } from 'services/common';
import { emit, typeCtxM, useC2Mod } from 'services/concent';
import { ste } from 'utils/common';
import { formatISODateStr } from 'utils/date';
import * as helUtil from 'utils/hel';
import AppTitle from './AppTitle';
import { AvatarWrap, DescWrap, MyCard } from './styled';

const validModuleList = [ccModule.APP_STORE, ccModule.STAR_LIST, ccModule.LATEST_VISIT];
const { Meta } = Card;
const stTagsWrap = { position: 'absolute', top: '8px', right: '2px', zIndex: 1 };
const stClassWrap = {
  position: 'absolute',
  left: '0px',
  top: '-8px',
  zIndex: 1,
  backgroundColor: '#3ca75b',
  color: 'white',
  padding: '0 12px',
  borderRadius: '2px',
  fontSize: '12px',
};
const stCard = { borderBottom: '1px solid rgb(47 84 235 / 52%)' };
const stCardRed = { borderBottom: '1px solid rgb(238 74 61 / 52%)' };
const noop = (e) => {
  e.stopPropagation();
};
const responsiveColProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  // style: { margin: 0, padding: '0 12px' },
};
const cpath = 'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)';
/** @type {React.CSSProperties} */
const stClip = { WebkitClipPath: cpath, clipPath: cpath };

function setup(c) {
  const ctx = typeCtxM(validModuleList[0], {}, c);
  const { mr, ccUniqueKey, props } = ctx;
  const settings = {
    handleStarIconClick: (e) => {
      e.stopPropagation();
      const appName = e.currentTarget.dataset.name;
      const payload = { appName, needDel: props.module === ccModule.STAR_LIST };
      mr.handleStarIconClick(payload, { renderKey: ccUniqueKey });
    },
    handleDelIconClick: (e) => {
      ste(e);
      const appName = e.currentTarget.dataset.name;
      mr.handleDelIconClick(appName, { renderKey: ccUniqueKey });
    },
    handleEditIconClick: (e) => {
      ste(e);
      const { name } = e.currentTarget.dataset;
      const subApp = ctx.state.name2SubApp[name];
      ctx.emit(OPEN_SUB_APP_DRAWER, subApp);
    },
    jumpTo: (e) => {
      ste(e);
      /** @type string */
      let gitRepoUrl = e.currentTarget.dataset.git;
      if (!gitRepoUrl) {
        message.warn('当前子应用还未填写git仓库地址', 2);
        return;
      }
      if (gitRepoUrl.startsWith('git@')) {
        gitRepoUrl = gitRepoUrl.replace('git@', 'https://');
      }
      window.top.open(gitRepoUrl);
    },
    handleCardClick(e) {
      settings.handleEditIconClick(e);
    },
    onTitleClick(appName, subApp) {
      ctx.emit('openConfirmVisitAppModal', appName, subApp);
    },
    getStClassWrap(name) {
      // 色彩灵感来自 tapd 系统，并统一加上了 88% 透明度
      const colorMap = { 0: '#1468f8E0', 1: '#fda734E0', 2: '#f85552E0', 3: '#3ca75bE0' };
      const yushu = name.length % 4;
      const backgroundColor = colorMap[yushu];
      return { ...stClassWrap, backgroundColor };
    },
    getCardStyle() {
      const { appData } = ctx.props;
      const { enable_pipeline: enablePipeline, is_in_gray: isInGray } = appData;
      const st = enablePipeline ? stCard : stCardRed;
      return { ...st, backgroundColor: isInGray ? '#f2f3f6' : '#d3e9f9' };
    },
  };
  return settings;
}

/**
 * @param {object} props
 * @param {typeof validModuleList[number]} props.module
 * @param {boolean} props.delVisit
 * @param {SubApp} props.appData
 */
function SubApp(props) {
  const { appData, module } = props;
  const { name, enable_pipeline: enablePipeline } = appData;
  const { state, settings } = useC2Mod(module, { setup, props });
  const [showIcons, setShowIcons] = React.useState(false);
  const data = state.name2SubApp[name];
  const onMouseEnter = () => setShowIcons(true);
  const onMouseLeave = () => setShowIcons(false);
  const openCopySubAppLayer = (e, mode) => {
    ste(e);
    emit(OPEN_COPY_SUB_APP_LAYER, data, mode);
  };

  // 已从视图里删除
  if (!data) return '';

  let title = '';
  let UIIcon = '';
  if (data._star) {
    title = '已收藏 (点击取消搜藏该应用)';
    UIIcon = <img width="19px" height="19px" src={ICON_STAR} />;
  } else {
    title = '未收藏 (点击搜藏该应用)';
    UIIcon = <img width="19px" height="19px" src={ICON_STAR_NO} />;
  }

  const actions = [
    <Tooltip
      key="avatar"
      title={
        <>
          创建者：<Tag color="#108ee9">{data.create_by}</Tag>
          <br />
          创建时间：{formatISODateStr(data.create_at)}
          <br />
          最近更新：{formatISODateStr(data.update_at)}
        </>
      }
      getTooltipContainer={helUtil.getAppBodyContainer}
    >
      <div onClick={noop}>
        <Avatar size={28} src={`${getUserAvatarUrl(data.create_by)}`} />
      </div>
    </Tooltip>,
    <Tooltip key="star" title={title} getTooltipContainer={helUtil.getAppBodyContainer}>
      <div data-name={data.name} onClick={settings.handleStarIconClick}>
        {UIIcon}
      </div>
    </Tooltip>,
    <Tooltip key="edit" title="跳转至git" getTooltipContainer={helUtil.getAppBodyContainer}>
      <div style={stClip} data-git={data.git_repo_url} onClick={settings.jumpTo}>
        <img style={stClip} width="22px" height="19px" src={ICON_GITCODE} />
      </div>
    </Tooltip>,
  ];

  // 需要从最近访问里删除
  if (props.delVisit) {
    actions.push(
      <Tooltip key="del" title="删除最近访问" getTooltipContainer={helUtil.getAppBodyContainer}>
        <div data-name={data.name} onClick={settings.handleDelIconClick}>
          <img width="19px" height="19px" src={ICON_DEL} />
        </div>
      </Tooltip>,
    );
  }

  actions.push(
    <Popover
      key="copy"
      content={
        <div>
          <Tooltip
            title={
              <span>
                复制当前应用为同应用组({appData.app_group_name})下的另一个应用，该应用会自动标记为<Tag color="gray">测试</Tag>应用
              </span>
            }
          >
            <Button onClick={(e) => openCopySubAppLayer(e, 'test')}>同组复制</Button>
          </Tooltip>
          <NormalBlank />
          <Tooltip
            title={
              <span>
                复制当前应用为新应用组的新应用，该应用会自动标记为<Tag color="#f50">正式</Tag>应用，等同于在新建应用页创建一个新应用
              </span>
            }
          >
            <Button onClick={(e) => openCopySubAppLayer(e, 'prod')}>非同组复制</Button>
          </Tooltip>
        </div>
      }
    >
      <div data-name={data.name} onClick={ste}>
        <CopyOutlined />
      </div>
    </Popover>,
    <Tooltip key="del" title="更多应用信息" getTooltipContainer={helUtil.getAppBodyContainer}>
      <div data-name={data.name} onClick={settings.handleEditIconClick}>
        <EllipsisOutlined />
      </div>
    </Tooltip>,
  );

  return (
    <Col span={6} style={{ position: 'relative' }} {...responsiveColProps}>
      <div style={settings.getStClassWrap(data.class_name || '')}>{data.class_name}</div>
      <div style={stTagsWrap} data-name={data.name} onClick={settings.handleCardClick}>
        {data.is_top === 1 && (
          <Tag className="gHover" color="#f50">
            <HeartOutlined />荐
          </Tag>
        )}
        {data.is_test === 1 && (
          <Tag className="gHover" color="grey">
            <BugOutlined />测
          </Tag>
        )}
        {enablePipeline === 0 && (
          <Tooltip title="已设置禁止上线，触发流水线执行会在元数据提取步骤执行失败">
            <Tag className="gHover" color="red">
              <ExclamationCircleOutlined />禁
            </Tag>
          </Tooltip>
        )}
      </div>
      <Spin spinning={data._loading}>
        <MyCard
          hoverable
          style={settings.getCardStyle()}
          data-name={data.name}
          onClick={settings.handleCardClick}
          actions={actions}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          bodyStyle={{ borderBottom: '1px dotted lightgrey', padding: '24px 12px' }}
        >
          {/* <Meta
            avatar={<Avatar src={data.logo} />}
            title={
              <AppTitle name={data.name} data={data} onTitleClick={settings.onTitleClick}
                showIcons={showIcons}
              />
            }
            description={<DescWrap>{data.desc}</DescWrap>}
          /> */}
          <div>
            <AvatarWrap>
              <Avatar src={data.logo} />
            </AvatarWrap>
            <AppTitle name={data.name} data={data} onTitleClick={settings.onTitleClick} showIcons={showIcons} />
            <div>
              <DescWrap>{data.desc}</DescWrap>
            </div>
          </div>
        </MyCard>
      </Spin>
    </Col>
  );
}

export default React.memo(SubApp);
