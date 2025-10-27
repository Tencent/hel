/* eslint-disable no-unused-vars,semi,react/prop-types */
/** @typedef {import('types/domain').SubApp} SubApp */
/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { BranchesOutlined, BugOutlined, CopyOutlined, GithubOutlined, SettingOutlined, WindowsOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, message, Modal, Popover, Tag, Tooltip } from 'antd';
import { NormalSpanBlank, VerticalBlank } from 'components/dumb/Blank';
import { evNames } from 'components/GeneralTable';
import { emit } from 'concent';
import { ICON_GITCODE, ICON_HEL, ICON_PIPELINE } from 'configs/constant';
import { PORTAL, VERSION_LIST } from 'configs/constant/ccModule';
import copy from 'copy-to-clipboard';
import { getAppPipelineBuildUrl } from 'services/common';
import { ccReducer, getModelState } from 'services/concent';
import styled from 'styled-components';
import * as dateUtil from 'utils/date';
import * as helUtil from 'utils/hel';

const tipPluginOld = (e) => {
  ste(e);
  e.preventDefault();
  message.warn('当前构建数据版本过旧，没记录流水线其他数据(git、pipeline等)，请访问最新构建的版本或者重新构建一个新版本', 2);
};

const stHashWrap = {
  display: 'inline-block',
  backgroundColor: '#f2f6fd',
  padding: '0px 12px',
  marginRight: '3px',
};

export const cardBgColors = {
  online: '#fff2e8',
  gray: '#f0f0f0',
  globalMarked: '#f0f5ff',
  userMarked: '#f9f0ff',
};
export const tagColors = {
  online: '#f50',
  gray: 'gray',
  globalMarked: '#2f54eb',
  userMarked: '#722ed1',
};

const OnlineVersionCard = styled(Card)`
  .ant-card-actions {
    background-color: ${cardBgColors.online};
  }
`;
const GrayVersionCard = styled(Card)`
  .ant-card-actions {
    background-color: ${cardBgColors.gray};
  }
`;
const GlobalMarkCard = styled(Card)`
  .ant-card-actions {
    background-color: ${cardBgColors.globalMarked};
  }
`;
const UserMarkCard = styled(Card)`
  .ant-card-actions {
    background-color: ${cardBgColors.userMarked};
  }
`;

const stPopBtn = { marginBottom: '5px' };

const inner = {
  buildSwitchTip(toChangeListMode, titleUiMode = 'hasTitle') {
    const color = toChangeListMode === 'tag' ? tagColors.globalMarked : tagColors.online;
    const toChangeLabel = toChangeListMode === 'tag' ? '已标记' : '全部';
    const curLabel = toChangeListMode === 'tag' ? '全部' : '已标记';
    const clickTopTip = titleUiMode === 'hasTitle' ? '，或点击顶部【全部】/【已标记】单选按钮组来切换列表模式' : '';

    return (
      <Alert
        type="info"
        showIcon
        description={
          <>
            当前构建版本列表是{curLabel}模式，你可以点击
            <Tag color={color} className="gHover" onClick={() => ccReducer.VersionList.changeListMode(toChangeListMode)}>
              {toChangeLabel}
            </Tag>
            切换列表为{toChangeLabel}模式{clickTopTip}
            <VerticalBlank height="16px" />
            <span style={{ color: 'grey', fontWeight: 300 }}>
              <p>全部列表：展示流水线构建的所有版本数据</p>
              <p>已标记列表：仅展示带有线上、灰度、个人、全局 4种标记的版本数据</p>
            </span>
          </>
        }
      />
    );
  },
};

export function ste(e) {
  // 当前项目暂未支持可选链
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  return true;
}

export function buildConnerAndStCard(/** @type {SubAppVersion} */ record, options) {
  const { stTitle, stCol } = options;
  const { subApp, globalMarkedList } = getModelState(VERSION_LIST);
  const { userMarkedList } = getModelState(PORTAL);
  const verTag = record.version_tag || record.sub_app_version;

  // 渲染角标 与 card 样式
  let CardComp = Card;
  const stCard = { border: '1px solid lightgrey', backgroundColor: '' };
  const isGrayVer = subApp.is_in_gray && subApp.build_version === verTag;
  const isOnlineVer = subApp.online_version === verTag;
  const globalMarkedData = globalMarkedList.find((item) => item.ver === verTag);
  const userMarkedData = userMarkedList.find((item) => item.ver === verTag);

  if (isOnlineVer) {
    stCard.border = `1px solid ${tagColors.online}`;
    stCard.backgroundColor = cardBgColors.online;
    CardComp = OnlineVersionCard;
  } else if (isGrayVer) {
    stCard.border = `1px solid ${tagColors.gray}`;
    stCard.backgroundColor = cardBgColors.gray;
    CardComp = GrayVersionCard;
  } else if (globalMarkedData) {
    stCard.border = `1px solid ${tagColors.globalMarked}`;
    stCard.backgroundColor = cardBgColors.globalMarked;
    CardComp = GlobalMarkCard;
  } else if (userMarkedData) {
    stCard.border = `1px solid ${tagColors.userMarked}`;
    stCard.backgroundColor = cardBgColors.userMarked;
    CardComp = UserMarkCard;
  }

  let uiConnerOnlineTag = '';
  let uiConnerGrayTag = '';
  let uiConnerGlobalMarkTag = '';
  let uiConnerUserMarkTag = '';
  let uiGlobalMarkDesc = '';
  let uiUserMarkDesc = '';
  if (isGrayVer) {
    uiConnerGrayTag = <Tag color={tagColors.gray}>灰度</Tag>;
  }
  if (isOnlineVer) {
    uiConnerOnlineTag = <Tag color={tagColors.online}>线上</Tag>;
  }

  const stTime = { color: '#838383de' };
  if (globalMarkedData) {
    uiConnerGlobalMarkTag = <Tag color={tagColors.globalMarked}>全局</Tag>;
    const { desc, userName, time } = globalMarkedData;
    if (desc) {
      const stColGlobal = {
        ...stCol,
        backgroundColor: 'rgb(47, 84, 235, 10%)',
        border: '1px dashed rgb(47, 84, 235, 60%)',
        paddingLeft: '3px',
      };
      uiGlobalMarkDesc = (
        <Col span="24" style={stColGlobal}>
          <span style={stTitle}>全局标记描述：</span>
          {desc}
          <span style={stTime}>
            {' '}
            ({userName} {dateUtil.formatLocaleString(new Date(time).toLocaleString())})
          </span>
        </Col>
      );
    }
  }
  // rgba(131, 131, 131, 0.87)
  if (userMarkedData) {
    uiConnerUserMarkTag = <Tag color={tagColors.userMarked}>个人</Tag>;
    const { desc, time } = userMarkedData;
    const stColUserMark = {
      ...stCol,
      backgroundColor: 'rgb(114, 46, 209, 10%)',
      border: '1px dashed rgb(114, 46, 209, 60%)',
      paddingLeft: '3px',
      marginTop: !!globalMarkedData ? '6px' : '0px',
    };
    if (desc) {
      uiUserMarkDesc = (
        <Col span="24" style={stColUserMark}>
          <span style={stTitle}>个人标记描述：</span>
          <span style={{ wordBreak: 'break-all' }}>{desc}</span>
          <span style={stTime}> ({dateUtil.formatLocaleString(new Date(time).toLocaleString())})</span>
        </Col>
      );
    }
  }

  return {
    uiConner: (
      <div style={{ position: 'absolute', right: '-12px', top: '-10px' }}>
        {uiConnerOnlineTag}
        {uiConnerGrayTag}
        {uiConnerGlobalMarkTag}
        {uiConnerUserMarkTag}
      </div>
    ),
    uiGlobalMarkDesc,
    uiUserMarkDesc,
    stCard,
    CardComp,
  };
}

export function buildCardActions(/** @type {SubAppVersion} */ record, setCardLoading, titleUiMode = 'hasTitle') {
  const state = getModelState(VERSION_LIST);
  const {
    userInfo: { user },
    userMarkedList,
  } = getModelState(PORTAL);
  const { globalMarkedList, subApp } = state;
  const owners = subApp.owners || [];
  const validUsers = owners.concat(subApp.create_by);
  const buildUrl = getAppPipelineBuildUrl(record);
  const git_repo_url = record.git_repo_url || '';
  const stRed = { color: 'red' };
  const { sub_app_version: recordVer, sub_app_name: appName } = record;
  const verTag = record.version_tag || record.sub_app_version;

  const isAppOwner = validUsers.includes(user);
  let disableGlobalMark = false;
  let globalMarkWarnTip = '';
  if (!isAppOwner) {
    disableGlobalMark = true;
    globalMarkWarnTip = <span style={stRed}>（注：你不是当前应用负责人）</span>;
  } else if (globalMarkedList.length >= 100) {
    disableGlobalMark = true;
    globalMarkWarnTip = <span style={stRed}>（注：当前应用已超过100个全局标记版本，请尝试删除一些其他的已标记数据）</span>;
  }

  let resetVerTip = '';
  let disableResetVer = false;
  if (!isAppOwner) {
    disableResetVer = true;
    resetVerTip = <span style={stRed}>（注：你不是当前应用负责人）</span>;
  } else {
    resetVerTip = <span style={stRed}>（注：此功能仅当数据库的应用版本有变更时点击此按钮才有意义）</span>;
  }

  let disableMarkUser = false;
  let markUserWarnTip = '';
  let isUserMarked = false;
  let isGlobalMarked = false;
  if (userMarkedList.length >= 60) {
    disableMarkUser = true;
    markUserWarnTip = <span style={stRed}>（注：你的个人标记数据已超过60条，请尝试删除一些其他的已标记数据）</span>;
  }
  const userMarkedData = userMarkedList.find((item) => item.ver === recordVer);
  if (userMarkedData) {
    isUserMarked = true;
  }
  const globalMarkedData = globalMarkedList.find((item) => item.ver === recordVer);
  if (globalMarkedData) {
    isGlobalMarked = true;
  }

  const uiVisitBuildDetailLink = buildUrl ? (
    <a key="pipeline" href={buildUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => ste(e)}>
      <img width="20px" height="20px" src={ICON_PIPELINE} /> 查看流水线
    </a>
  ) : (
    <a key="pipeline" onClick={tipPluginOld} rel="noopener noreferrer">
      <img width="20px" height="20px" src={ICON_PIPELINE} /> 查看流水线
    </a>
  );
  const uiVisitGitLink = git_repo_url ? (
    <a key="git" href={`${git_repo_url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => ste(e)}>
      <img width="22px" height="20px" src={ICON_GITCODE} /> 查看git
    </a>
  ) : (
    <a key="git" onClick={tipPluginOld} rel="noopener noreferrer">
      <img width="22px" height="20px" src={ICON_GITCODE} /> 查看git
    </a>
  );

  let appRenderHref = '';
  if (state.subApp.is_local_render) {
    appRenderHref = `${window.top.location.origin}/page/${record.sub_app_name}?ver=${verTag}`;
  } else {
    appRenderHref = `${state.subApp.render_app_host}?_appv=${verTag}` || '';
  }

  const switchVer = async (changeMode) => {
    setCardLoading(true);
    const res = await ccReducer.VersionList.updateAppVersion({ inputVersion: verTag, changeMode });
    setCardLoading(false);
    if (res && res.subApp) {
      const label = changeMode === 'online' ? '线上' : '灰度';
      message.success(`切换版本 ${verTag} 为${label}成功`);
      emit([evNames.refreshTableCurPage, 'vTable']);
      ccReducer.appStore.initAllPage();
    }
  };
  const switchToOnline = (e) => ste(e) && switchVer('online');
  const switchToGray = (e) => ste(e) && switchVer('gray');
  const delUserMark = (e) => {
    ste(e);
    ccReducer.VersionList.delAppUserMark({ appName, ver: recordVer });
  };
  const delGlobalMark = (e) => {
    ste(e);
    ccReducer.VersionList.delAppGlobalMark({ appName, ver: recordVer });
  };

  let actions = [];
  if (titleUiMode === 'hasTitle') {
    actions = [
      <a key="visit" href={appRenderHref} target="_blank" rel="noopener noreferrer">
        <img width="20px" height="20px" src={ICON_HEL} />
        访问应用
      </a>,
      uiVisitBuildDetailLink,
      uiVisitGitLink,
      <Tooltip key="online" title="切换当前版本为线上版本">
        <span onClick={switchToOnline}>
          <WindowsOutlined />
          <NormalSpanBlank />
          切为线上
        </span>
      </Tooltip>,
    ];
    if (state.subApp.enable_gray === 1) {
      actions.push(
        <Tooltip key="gray" title="切换当前版本为灰度版本">
          <span onClick={switchToGray}>
            <BugOutlined />
            <NormalSpanBlank />
            切为灰度
          </span>
        </Tooltip>,
      );
    }
  } else {
    // noTitle 模式，服务于【项目与版本】模块的选择功能
    const selectAsProjVer = (e) => ste(e) && emit('selectAsProjVer', record, 'online');
    const selectAsProjVer2 = (e) => ste(e) && emit('selectAsProjVer', record, 'build');
    const selectAsProjVer3 = (e) => ste(e) && emit('selectAsProjVer', record, 'ol_bu');
    actions = [
      <Tooltip key="online" title="选择当前版本为项目对应的【线上版本】">
        <span onClick={selectAsProjVer}>
          <BranchesOutlined />
          <NormalSpanBlank />
          线上
        </span>
      </Tooltip>,
      <Tooltip key="build" title="选择当前版本为项目对应【灰度版本】">
        <span onClick={selectAsProjVer2}>
          <BranchesOutlined />
          <NormalSpanBlank />
          灰度
        </span>
      </Tooltip>,
      <Tooltip key="ol_bu" title="选择当前版本为项目对应【线上版本】和【灰度版本】">
        <span onClick={selectAsProjVer3}>
          <BranchesOutlined />
          <NormalSpanBlank />
          线上与灰度
        </span>
      </Tooltip>,
    ];
  }

  actions.push(
    <Popover
      placement="top"
      content={
        <div style={{ width: '268px' }}>
          <Tooltip title={<span>当前版本的元数据</span>}>
            <Button style={stPopBtn} onClick={(e) => ste(e) && emit('openMetaDataDrawer', record)}>
              元数据
            </Button>
          </Tooltip>
          <NormalSpanBlank />
          <Tooltip title={<span>为当前版本添加个人标记，方便自己查看。{markUserWarnTip}</span>}>
            <Button style={stPopBtn} disabled={disableMarkUser} onClick={(e) => ste(e) && emit('openMarkInfoModal', record, 'user')}>
              个人标记
            </Button>
          </Tooltip>
          <NormalSpanBlank />
          <Tooltip title={<span>为当前版本添加全局标记，方便所有人查看。{globalMarkWarnTip}</span>}>
            <Button style={stPopBtn} disabled={disableGlobalMark} onClick={(e) => ste(e) && emit('openMarkInfoModal', record, 'global')}>
              全局标记
            </Button>
          </Tooltip>
          <Tooltip title={<span>刷新版本缓存。{resetVerTip}</span>} placement="bottom">
            <Button style={stPopBtn} disabled={disableResetVer} onClick={(e) => ste(e) && emit('openResetVerModal', record)}>
              刷新缓存
            </Button>
          </Tooltip>
          {isUserMarked && (
            <>
              <Tooltip title={<span>删除当前版本的个人标记</span>} placement="bottom">
                <Button style={stPopBtn} onClick={delUserMark}>
                  个人标记删除
                </Button>
              </Tooltip>
              <NormalSpanBlank />
            </>
          )}
          {isAppOwner && isGlobalMarked && (
            <>
              <Tooltip title={<span>删除当前版本的全局标记</span>} placement="bottom">
                <Button style={stPopBtn} onClick={delGlobalMark}>
                  全局标记删除
                </Button>
              </Tooltip>
              <NormalSpanBlank />
            </>
          )}
        </div>
      }
    >
      <span onClick={ste}>
        <SettingOutlined />
        <NormalSpanBlank />
        更多
      </span>
    </Popover>,
  );

  return actions;
}

export function buildUiGitHashLinks(/** @type {SubAppVersion} */ record) {
  let uiGitHashLinks = '';
  const git_repo_url = record.git_repo_url || '';
  const pureGitRepoUrl = git_repo_url.endsWith('.git') ? git_repo_url.substr(0, git_repo_url.length - 4) : git_repo_url;

  const gitHashList = (record.git_hashes || '').split(',').filter((item) => !!item);
  const len = gitHashList.length;
  if (len > 0) {
    const contentAll = gitHashList.map((str, i) => {
      return (
        <div key={i} style={{ marginBottom: '6px' }}>
          <a style={stHashWrap} target="_blank" rel="noopener noreferrer" href={`${pureGitRepoUrl}/commit/${str}`}>
            {str}
          </a>
          <NormalSpanBlank />{' '}
          <CopyOutlined
            onClick={() => {
              copy(str);
              message.success(`复制提交hash值 ${str} 成功`, 2);
            }}
          />
        </div>
      );
    });

    const seeAllHash = (e) => {
      ste(e);
      const stContent = { paddingTop: '12px', transform: 'translateX(-28px)', maxHeight: '600px', overflowY: 'auto' };
      Modal.confirm({
        title: (
          <span>
            当前构建版本共包含
            <NormalSpanBlank />
            <Tag color="#87d068">{len}</Tag>条提交记录
          </span>
        ),
        content: <div style={stContent}>{contentAll}</div>,
        width: '520px',
        getContainer: helUtil.getAppBodyContainer,
        type: 'info',
        cancelButtonProps: { style: { display: 'none' } },
        okText: '确认',
      });
    };
    const gitCheckoutStr = `git checkout -b hotfix/${gitHashList[0].substr(0, 8)} ${gitHashList[0]}`;
    const copyGitCheckoutCmd = () => {
      copy(gitCheckoutStr);
      message.success(`检出命令复制成功：${gitCheckoutStr}`);
    };

    uiGitHashLinks = (
      <>
        <a style={stHashWrap} target="_blank" rel="noopener noreferrer" href={`${pureGitRepoUrl}/commit/${gitHashList[0]}`} onClick={ste}>
          {gitHashList[0]}
        </a>
        <Tooltip
          title={
            <span>
              共<NormalSpanBlank />
              <Tag color="#87d068">{len}</Tag>条提交记录，点击可查看
            </span>
          }
        >
          <Tag color="#87d068" onClick={seeAllHash} className="gHover">
            {len}
          </Tag>
        </Tooltip>
        <Tooltip title={'点击复制基于此hash分支检出新分支的git命令'}>
          <Tag onClick={copyGitCheckoutCmd} className="gHover">
            {' '}
            <GithubOutlined />
          </Tag>
        </Tooltip>
      </>
    );
  }
  return { pureGitRepoUrl, uiGitHashLinks };
}

export function buildSwitchMarkTip(listMode = 'hasTitle') {
  return inner.buildSwitchTip('tag', listMode);
}

export function buildSwitchAllTip(listMode = 'hasTitle') {
  return inner.buildSwitchTip('all', listMode);
}

export function buildHelModCreationTutorialTip() {
  return (
    <Alert
      type="warning"
      showIcon
      description={
        <>
          当前应用还未发布过新版本，可参考以下资料学习：
          <br />
          1. 发布远程js库
          <a target="blank" href="https://www.bilibili.com/video/BV15t4y1u7i5">
            视频
          </a>
          与
          <a target="blank" href="https://tencent.github.io/hel/docs/tutorial/helmod-dev">
            文档
          </a>
          <br />
          2. 文章分享
          <a target="blank" href="https://juejin.cn/post/7139379656825765918">
            模块联邦新革命
          </a>
        </>
      }
    />
  );
}
