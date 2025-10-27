import { Layout, Spin } from 'antd';
import { register } from 'concent';
import React from 'react';
import { ConnectRouter } from 'react-router-concent';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled, { StyleSheetManager } from 'styled-components';

import LeaveSubAppModal from 'components/LeaveSubAppModal';
import Routes from 'components/Routes';
import SubAppCopyLayer from 'components/SubAppCopyLayer';
import SubAppDrawer from 'components/SubAppDrawer';
import { GOTO_PAGE, OPEN_MODAL } from 'configs/constant/event';
import { WELCOME } from 'configs/constant/page';
import Welcome from 'pages/Welcome';
import * as commonService from 'services/common';
import * as helUtil from 'utils/hel';

import ConfirmVisitAppModal from './ConfirmVisitAppModal';
import Footer from './Footer';
import Header from './Header';
import SiderBar from './SiderBar';

// 整体布局
const StLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
  z-index: 999999999;
`;

class App extends React.Component {
  /** @type {import('types/store').RootState['portal']} */
  state = {};

  /** @type {import('types/store').CtxM<{}, 'portal'>} */
  ctx = {};

  componentDidMount() {
    this.ctx.mr.login().then(this.resetSubAppMargin).catch(this.resetSubAppMargin);
  }

  componentDidUpdate() {
    this.resetSubAppMargin();
  }

  $$setup() {
    const { on } = this.ctx;
    on(GOTO_PAGE, (path) => {
      const { activeApp, contentVisible } = this.ctx.state;
      const doJump = () => {
        if (!contentVisible) {
          this.setState({ sideBarVisible: true, contentVisible: true, activeApp: null });
        }
        commonService.historyPush(path);
      };

      if (activeApp) {
        // todo 通知子应用即将离开
        this.ctx.emit(OPEN_MODAL, {
          title: `离开应用 ${activeApp}`,
          content: '是否确认离开当前子应用',
          onOk: () => {
            // 替换浏览地址为空路径的主域名，保持路径语义正确
            window.top.history.replaceState({}, commonService.getTitle(), '/');
            window.top.location.reload(window.top.location.origin);
          },
        });
      } else {
        doJump();
      }
    });
  }

  resetSubAppMargin = (e) => {
    if (e instanceof Error) {
      console.error(e);
    }
    const mcu = this.ctx.moduleComputed;

    const subAppContainer = window.top.document.querySelector('#leah-sub-app-container');
    if (subAppContainer) {
      if (mcu.displaySubAppWithSideBar) {
        if (subAppContainer.style.marginLeft !== '60px') {
          subAppContainer.style.marginLeft = '60px';
        }
      } else if (mcu.displaySubAppOnly) {
        if (subAppContainer.style.marginLeft !== '0px') {
          subAppContainer.style.marginLeft = '0px';
        }
      }
    }
  };

  hideSideBar = () => {
    this.setState({ sideBarVisible: false, ballVisible: true });
  };

  renderFullPage = () => {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <StLayout>
          {this.renderContent()}
          <Layout.Sider collapsed={true} collapsedWidth={60}>
            {this.renderSideBar()}
          </Layout.Sider>
        </StLayout>
      </Spin>
    );
  };

  renderSideBar = () => <SiderBar hideSideBar={this.hideSideBar} />;

  renderContent = () => {
    const { basicDataReady } = this.state;

    return (
      <Layout.Content style={{ overflowY: 'auto' }}>
        <Header />
        {basicDataReady ? (
          <div style={{ margin: '24px', padding: '24px', backgroundColor: 'white' }}>
            <Routes />
            <ConfirmVisitAppModal />
          </div>
        ) : (
          ''
        )}
        <SubAppDrawer />
        <SubAppCopyLayer />
        <Footer />
      </Layout.Content>
    );
  };

  renderAppHub = () => {
    const { sideBarVisible, contentVisible } = this.state;

    if (commonService.getRouteRelativePath() === WELCOME) {
      return '';
    }

    // 两者都为true，才渲染整个基座的页面（包括边栏和内容）
    if (sideBarVisible && contentVisible) {
      return this.renderFullPage();
      // return this.renderSideBar();
    }
    if (sideBarVisible) {
      return this.renderSideBar();
    }
    if (contentVisible) {
      return this.renderContent();
    }
    return '';
  };

  renderMainContent = () => <>{this.renderAppHub()}</>;

  render() {
    console.log(`%c HelApp BuildTime : ${process.env.REACT_APP_BUILD_TIME}`, 'color:purple;border:6px solid purple;');

    return (
      <BrowserRouter basename="__hub">
        <ConnectRouter>
          <Switch>
            <Route exact path={WELCOME} component={Welcome} />
            <Route exact path="/" component={Welcome} />
            <Route render={this.renderMainContent} />
          </Switch>
          <LeaveSubAppModal />
        </ConnectRouter>
      </BrowserRouter>
    );
  }
}

const AppWrap = register('portal')(App);

export default class extends React.Component {
  render() {
    helUtil.setMicroAppProps(this.props);

    if (helUtil.isRenderByHelMicro()) {
      const shadowRoot = helUtil.getAppRootContainer();
      // 方便 styled-components 插入 css 到shadow-dom 内部
      if (shadowRoot) {
        // 当前项目环境暂未支持可选链
        const styleContainer = document.createElement('div');
        shadowRoot.appendChild(styleContainer);

        return (
          <StyleSheetManager target={styleContainer}>
            <AppWrap />
          </StyleSheetManager>
        );
      }
    }

    return <AppWrap />;
  }
}
