import { ApartmentOutlined, AppstoreOutlined, PlusOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Radio } from 'antd';
import { VerticalBlank } from 'components/dumb/Blank';
import * as cst from 'configs/constant';
import { NEW_APP, STORE } from 'configs/constant/page';
import React from 'react';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import * as commonService from 'services/common';
import styled from 'styled-components';
import * as demoCode from './demoCode';
import { MoreUser, User } from './User';

// 关闭语法验证，避免code示例里写 @ts-nocheck
// see https://github.com/microsoft/monaco-editor/issues/264
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
});

const { HEL_ARCH, HEL_BANNER, HEL_LABEL_LOGO } = cst;

const Banner = styled.div`
  position: 'relative';
  background-image: url(${HEL_BANNER});
  background-size: cover;
  background-repeat: repeat-x;
  width: 100%;
  height: 520px;
`;

const BannerLogo = styled.div`
  position: absolute;
  background-size: cover;
  background-image: url(${HEL_LABEL_LOGO});
  background-repeat: no-repeat;
  width: 104px;
  height: 32px;
  left: 13px;
  top: 13px;
`;

const BannerVersion = styled.div`
  position: absolute;
  left: 128px;
  top: 16px;
  color: gray;
  font-size: 19px;
`;

const BannerHelLabelWrap = styled.span`
  position: absolute;
  font-size: 88px;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
`;

const MyRow = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 0 50px 0;
`;

const Blank = styled.div`
  display: inline-block;
  width: 20px;
`;

const RowTitle = styled.span`
  position: absolute;
  left: 100px;
  top: 10px;
  width: 102px;
  text-align: center;
  border: 1px solid #d9d9d9;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
`;

const stIntroWrap = {
  position: 'absolute',
  width: '100%',
  top: '250px',
  fontSize: '28px',
  color: 'white',
  textAlign: 'center',
};

const stHelMicro = {
  borderRadius: '3px',
  backgroundColor: 'white',
  padding: '0 12px',
  margin: '0 12px',
};

const stEditorWrap = {
  width: '1023px',
  height: '615px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  paddingTop: '40px',
  paddingLeft: '3px',
};

const CodeDemo = React.memo(function () {
  const [demoType, setDemoType] = React.useState('remoteLib');

  return (
    <>
      <MyRow style={{ marginBottom: '20px' }}>
        <Radio.Group
          options={[
            { label: '远程库-预加载', value: 'remoteLib' },
            { label: '远程库-懒加载', value: 'remoteLibLazy' },
            { label: '远程react组件', value: 'remoteReact' },
            { label: '远程vue组件', value: 'remoteVue' },
          ]}
          style={{ width: '100%', textAlign: 'center' }}
          onChange={(e) => setDemoType(e.target.value)}
          value={demoType}
        />
      </MyRow>
      <MyRow style={{ marginBottom: '20px' }}>
        <div style={{ ...stEditorWrap, backgroundImage: `url(${cst.DEMO_EDITOR_BG})` }}>
          <MonacoEditor
            width="1015px"
            height="570px"
            language="typescript"
            theme="vs-dark"
            value={demoCode[demoType]}
            options={{ selectOnLineNumbers: true, fontSize: 16, noSyntaxValidation: true }}
          />
        </div>
      </MyRow>
    </>
  );
});

export default function Welcome() {
  const gotoPage = (path) => {
    commonService.historyPush(path);
  };

  const uiBtnGroup = (
    <>
      <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => gotoPage(NEW_APP)}>
        创建应用
      </Button>
      <Blank />
      <Button icon={<AppstoreOutlined />} size="large" onClick={() => gotoPage(STORE)}>
        探索更多
      </Button>
      <Blank />
      <Button icon={<ApartmentOutlined />} size="large" onClick={() => window.open('https://tencent.github.io/hel')}>
        hel-micro
      </Button>
      <Blank />
      <Button icon={<VideoCameraOutlined />} size="large" onClick={() => window.open('https://github.com/Tencent/hel/issues/112')}>
        视频教学
      </Button>
    </>
  );

  return (
    <div style={{ position: 'relative' }}>
      <Banner>
        <BannerLogo />
        <BannerVersion>Ver 3.0</BannerVersion>
        <BannerHelLabelWrap className="hubShine">Hel Pack</BannerHelLabelWrap>
        <div style={stIntroWrap}>
          <div>动态化模块发布、托管服务</div>
          <div>
            搭配
            <a href="https://tencent.github.io/hel/" target="blank" style={stHelMicro}>
              hel-micro
            </a>
            ， 轻松实现微前端搭建、组件热更新、前后端分离、应用秒回滚 ......
          </div>
          <div style={{ height: '29px' }}></div>
          {uiBtnGroup}
        </div>
      </Banner>
      <MyRow style={{ backgroundColor: 'aliceblue', padding: '20px 0' }}>
        <RowTitle style={{ top: '30px' }}>谁在使用中</RowTitle>
        <table>
          <tr>
            <User
              label="腾讯云"
              site="https://console.cloud.tencent.com/wedata/share/overview"
              logo="https://user-images.githubusercontent.com/7334950/197116513-7c7382b6-a5b5-4fb9-bcd7-2ec891804b7d.png"
            />
            <User label="QQ音乐" site="https://y.qq.com" logo="https://tnfe.gtimg.com/hel-img/WX20251027-174122.png" />
            <User
              label="腾讯文档"
              site="https://docs.qq.com"
              logo="https://user-images.githubusercontent.com/7334950/253789181-c4065149-304b-4b1e-bb93-23e1d849f45f.png"
            />
            <User
              label="腾讯新闻"
              site="https://news.qq.com"
              logo="https://user-images.githubusercontent.com/7334950/197115413-ede5f5fa-70dd-4632-b7f5-f6f8bc167023.png"
            />
            <User
              label="腾讯自选股"
              site="https://gu.qq.com/resource/products/portfolio/m.htm"
              logo="https://user-images.githubusercontent.com/7334950/253789148-c42ae516-991f-44df-a366-9b295c306b98.png"
            />
            <MoreUser />
          </tr>
        </table>
      </MyRow>
      <MyRow>
        <RowTitle>架构</RowTitle>
        <img width="1200px" src={HEL_ARCH} />
      </MyRow>
      <VerticalBlank />
      <MyRow style={{ paddingTop: '60px', marginBottom: '20px' }}>
        <RowTitle>特点</RowTitle>
        <Col span={8} style={{ padding: '0 20px 0 120px' }}>
          <Alert
            showIcon
            style={{ width: '100%', height: '160px' }}
            message="可靠"
            description="不依赖浏览器 import map、module script 特性，不依赖具体的 webpack 版本，
            即可快速且安全地接入远程模块服务"
            type="info"
          />
        </Col>
        <Col span={8} style={{ padding: '0 20px' }}>
          <Alert
            showIcon
            style={{ width: '100%', height: '160px' }}
            message="开放"
            description="HelPack 仅负责制订产物元数据协议标准并托管元数据json，当前已服务于 webpack、vite 生态，依赖元数据提取插件可扩展到其他构建工具体系"
            type="info"
          />
        </Col>
        <Col span={8} style={{ padding: '0 120px 0 20px' }}>
          <Alert
            showIcon
            style={{ width: '100%', height: '160px' }}
            message="灵活"
            description="模块懒加载、预加载任意选择，不限定你的使用方式"
            type="info"
          />
        </Col>
      </MyRow>
      <CodeDemo />
      <MyRow>{uiBtnGroup}</MyRow>
      <div style={{ height: '52px' }}></div>
    </div>
  );
}
