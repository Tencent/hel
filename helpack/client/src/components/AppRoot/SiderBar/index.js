/* eslint-disable react/prop-types */
import { CloudOutlined, FileOutlined, LikeOutlined, PlusSquareOutlined, StarOutlined } from '@ant-design/icons';
import { emit, useConcent } from 'concent';
import React from 'react';

import IconHome from 'components/icon/Home';
import IconLatestVisit from 'components/icon/LatestVisit';
import IconStar from 'components/icon/Star';
import Condition from 'components/util/Condition';
import { GOTO_PAGE } from 'configs/constant/event';
import { LATEST_VISIT, NEW_APP, STAR, STORE, TOP, WELCOME } from 'configs/constant/page';

import Logo from '../_dumb/Logo';
import BarItem from './BarItem';
import NoAppFoundTip from './NoAppFoundTip';
import { Avatar, MenuBox, MenuItem, MenuText, Wrap } from './styled';

function gotoWelcomePage() {
  emit(GOTO_PAGE, WELCOME);
}

const iState = () => ({ showLatestVisitMenu: false, showStarMenu: false, showHomeMenu: false });

/** @typedef {import('types/store').CtxMS<{}, 'portal', ReturnType<typeof iState>} CtxPre */

function setup(/** @type CtxPre*/ ctx) {
  ctx.initState(iState());

  return {
    handleLeave: (/** @type React.MouseEvent*/ e) => {
      const { clientY, target } = e.nativeEvent;
      const { y, height } = target.getBoundingClientRect();
      const startY = y;
      const endY = y + height;

      if (clientY <= startY || clientY >= endY) {
        ctx.setState(iState());
      }
    },
    handleItemClick: (/** @type React.MouseEvent*/ e) => {
      e.stopPropagation();
      // 不加这个stopPropagation，加载子应用，操作元素时会出现错误 Failed to execute 'contains' on 'Node': parameter 1 is not of type 'Node'.
      // 类似问题：https://stackoverflow.com/questions/37542901/typeerror-failed-to-execute-contains-on-node-parameter-1-is-not-of-type-n
      const appName = e.target.dataset.name;
      ctx.mr.changeSubApp({ appName });
    },
    gotoPage: (e) => {
      const { path } = e.target.dataset;
      ctx.setState(iState());
      ctx.emit(GOTO_PAGE, path);
    },
  };
}

/** @typedef {import('types/store').CtxMS<{}, 'portal', ReturnType<typeof iState>,
 * import('concent').SettingsType<typeof setup>>} Ctx */

export default function SiderBarConcent({ hideSideBar }) {
  /** @type Ctx */
  const { state, settings, sync } = useConcent({ module: 'portal', setup });
  const { starAppNames, visitAppNames, userInfo } = state;

  return (
    <Wrap>
      <Avatar className="gHover" src={userInfo.icon} onClick={hideSideBar} />
      <Logo onClick={gotoWelcomePage} />
      <BarItem
        icon={<IconLatestVisit />}
        label="最近"
        onMouseEnter={sync('showLatestVisitMenu', true)}
        onMouseLeave={settings.handleLeave}
      />
      <MenuBox top="60px" show={state.showLatestVisitMenu} onMouseLeave={sync('showLatestVisitMenu', false)}>
        {visitAppNames.map((name) => (
          <MenuItem key={name} className="gMenuItemHoverBlue">
            <MenuText data-name={name} onClick={settings.handleItemClick}>
              {name}
            </MenuText>
          </MenuItem>
        ))}
        <Condition
          setIf={visitAppNames.length === 0}
          t={<NoAppFoundTip data-path={STORE} keyword="最近访问" onClick={settings.gotoPage} />}
          f={
            <MenuItem data-path={LATEST_VISIT} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
              更多 ...
            </MenuItem>
          }
        />
      </MenuBox>

      <BarItem icon={<IconStar />} label="收藏" onMouseEnter={sync('showStarMenu', true)} onMouseLeave={settings.handleLeave} />
      <MenuBox top="120px" show={state.showStarMenu} onMouseLeave={sync('showStarMenu', false)}>
        {starAppNames.map((name) => (
          <MenuItem key={name} className="gMenuItemHoverBlue">
            <MenuText data-name={name} onClick={settings.handleItemClick}>
              {name}
            </MenuText>
          </MenuItem>
        ))}
        <Condition
          setIf={starAppNames.length === 0}
          t={<NoAppFoundTip data-path={STORE} keyword="我的收藏" onClick={settings.gotoPage} />}
          f={
            <MenuItem data-path={STAR} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
              更多 ...
            </MenuItem>
          }
        />
      </MenuBox>

      <BarItem icon={<IconHome />} label="主页" onMouseEnter={sync('showHomeMenu', true)} onMouseLeave={settings.handleLeave} />
      <MenuBox top="180px" show={state.showHomeMenu} onMouseLeave={sync('showHomeMenu', false)}>
        <MenuItem data-path={LATEST_VISIT} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
          <FileOutlined /> 最近访问
        </MenuItem>
        <MenuItem data-path={STAR} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
          <StarOutlined /> 我的收藏
        </MenuItem>
        <MenuItem data-path={STORE} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
          <CloudOutlined /> 应用商店
        </MenuItem>
        <MenuItem data-path={TOP} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
          <LikeOutlined /> 置顶推荐
        </MenuItem>
        <MenuItem data-path={NEW_APP} className="gMenuItemHoverBlue" onClick={settings.gotoPage}>
          <PlusSquareOutlined /> 新建应用
        </MenuItem>
      </MenuBox>
    </Wrap>
  );
}
