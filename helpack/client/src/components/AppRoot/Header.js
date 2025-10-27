import {
  CloudOutlined,
  DatabaseOutlined,
  EllipsisOutlined,
  FileAddOutlined,
  FileOutlined,
  FileTextOutlined,
  LikeOutlined,
  PlusSquareOutlined,
  QuestionOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Card, Col, Popover, Radio, Row, Tag } from 'antd';
import { useConcent } from 'concent';
import * as page from 'configs/constant/page';
import React from 'react';
import { getUrlChangedEvName } from 'react-router-concent';
import * as commonService from 'services/common';
import { getModelComputed } from 'services/concent';

const { LATEST_VISIT, STAR, CREATED, STORE, INTRO, NEW_APP, TOP, SYNC_STAFF, SYNC_ALLOWED_APPS, CLASS_MGR } = page;
const pagePaths = Object.values(page);
const { Group, Button } = Radio;
const U_CENTER = 'uCenter';
const path2conf = {
  [CREATED]: { label: '我的创建', icon: <FileAddOutlined /> },
  [LATEST_VISIT]: { label: '最近访问', icon: <FileOutlined /> },
  [SYNC_STAFF]: { label: '同步员工', icon: <FileOutlined /> },
  [SYNC_ALLOWED_APPS]: { label: '同步应用白名单', icon: <FileOutlined /> },
};

function getBtnKey(path) {
  let radioBtnKey = '';
  let dropBtnKey = '';
  let subMenuKey = '';

  if (path2conf[path]) {
    dropBtnKey = U_CENTER;
    subMenuKey = path;
  } else {
    radioBtnKey = path;
    subMenuKey = CREATED;
  }
  return { radioBtnKey, dropBtnKey, subMenuKey };
}

const stLine = { padding: '6px 12px', width: '100%' };
function Line(props) {
  return (
    <div className="gHoverTransToBlue" style={stLine} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

function getInitialState() {
  let path = commonService.getRouteRelativePath();
  if (path === '/') {
    path = LATEST_VISIT;
  } else if (!pagePaths.includes(path)) {
    path = '';
  }
  return { open: false, path, ...getBtnKey(path) };
}

function setup(ctx) {
  const ins = ctx.initState(getInitialState());

  ctx.on(getUrlChangedEvName(), (action) => {
    const path = action.pathname;
    ctx.setState({ path, ...getBtnKey(path) });
  });

  const settings = {
    ins,
    handleRadioBtnClick: (e) => {
      const path = e.target.value;
      commonService.historyPush(path);
      ctx.setState({ radioBtnKey: path, dropBtnKey: '', path });
    },
    handleDropBtnClick: () => {
      const { subMenuKey } = ins.state;
      commonService.historyPush(subMenuKey);
      ctx.setState({ dropBtnKey: U_CENTER, path: subMenuKey, radioBtnKey: '' });
    },
    clickSubMenu(e) {
      const path = e.key;
      commonService.historyPush(path);
      ctx.setState({ dropBtnKey: U_CENTER, radioBtnKey: '', path, subMenuKey: path });
    },
    renderMenu() {
      const isAdmin = getModelComputed('portal').isAdmin;
      return (
        <div>
          <Row gutter={16}>
            <Col>
              <Card size="small" title={<Tag color="#87d068">个人中心</Tag>} style={{ width: 150 }}>
                <Line onClick={() => settings.clickSubMenu({ key: CREATED })}>
                  <FileAddOutlined /> 我的创建
                </Line>
                <Line onClick={() => settings.clickSubMenu({ key: LATEST_VISIT })}>
                  <FileOutlined /> 最近访问
                </Line>
              </Card>
            </Col>
            <Col>
              <Card size="small" title={<Tag color="#87d068">其他设置</Tag>} style={{ width: 150, height: '100%' }}>
                {isAdmin && (
                  <Line onClick={() => settings.clickSubMenu({ key: SYNC_STAFF })}>
                    <span>同步员工</span>
                  </Line>
                )}
                {isAdmin && (
                  <Line onClick={() => settings.clickSubMenu({ key: SYNC_ALLOWED_APPS })}>
                    <span>同步应用白名单</span>
                  </Line>
                )}
                <Line onClick={() => alert('待实现')}>
                  <QuestionOutlined /> <span style={{ color: 'grey' }}>thinking...</span>
                </Line>
              </Card>
            </Col>
          </Row>
        </div>
      );
    },
  };
  return settings;
}

/** @typedef {import('types/store').CtxDe<{}, import('concent').SettingsType<typeof setup>>} Ctx*/
export default React.memo(() => {
  /** @type Ctx */
  const { state, settings } = useConcent({ setup });
  const { subMenuKey, radioBtnKey, dropBtnKey } = state;
  const { label, icon } = path2conf[subMenuKey];

  return (
    <Card style={{ position: 'sticky', top: 0, zIndex: 99 }} bodyStyle={{ padding: '12px 24px' }}>
      <Group value={radioBtnKey} onChange={settings.handleRadioBtnClick} buttonStyle="solid">
        <Button value={STORE} style={{ width: '110px' }}>
          <CloudOutlined /> 应用商店
        </Button>
        <Button value={NEW_APP} style={{ width: '110px' }}>
          <PlusSquareOutlined /> 新建应用
        </Button>
        <Button value={TOP} style={{ width: '110px' }}>
          <LikeOutlined /> 置顶推荐
        </Button>
        <Button value={INTRO} style={{ width: '110px' }}>
          <ThunderboltOutlined /> 关于海拉
        </Button>
        <Button value={CLASS_MGR} style={{ width: '110px' }}>
          <DatabaseOutlined /> 我的分类
        </Button>
        <Button value={STAR} style={{ width: '110px' }}>
          <StarOutlined /> 我的收藏
        </Button>
      </Group>
      {/* 经测试，当前版本antd 在这里写 Button type="primary" 无效，故换为 Group 套 Button 写法 */}
      {/* <Button type={path2conf[path] ? 'primary' : 'normal'}>{icon}{label}</Button> */}
      <Group value={dropBtnKey} buttonStyle="solid">
        <Button value={U_CENTER} onClick={settings.handleDropBtnClick}>
          {icon}
          {label}
        </Button>
      </Group>
      <Popover content={settings.renderMenu()} placement="bottomLeft">
        <Button onMouseEnter={settings.ins.sync('open', true)}>
          <EllipsisOutlined />
        </Button>
      </Popover>
      <div style={{ float: 'right', display: 'inline-block' }}>
        <a rel="noopener noreferrer" href="https://tencent.github.io/hel/" target="_blank">
          <FileTextOutlined /> 文档
        </a>
      </div>
    </Card>
  );
});
