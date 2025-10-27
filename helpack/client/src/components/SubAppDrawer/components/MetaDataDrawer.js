/* eslint-disable  no-unused-vars,quote-props */
/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { CopyOutlined } from '@ant-design/icons';
import { Alert, Drawer, message, Spin } from 'antd';
import { NormalSpanBlank, VerticalBlank } from 'components/dumb/Blank';
import { HEL_CHARGER } from 'configs/constant';
import copy from 'copy-to-clipboard';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { typeCtxDe, useSetup } from 'services/concent';
import * as subAppSrv from 'services/subApp';
import { getMetaApiUrl, getNoHtmlContentMetaApiUrl } from 'utils/url';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    dataStr: '',
    visible: false,
    mode: 'av',
    ver: '',
    name: '',
    loading: false,
  });

  ctx.on('openMetaDataDrawer', async (appVerData) => {
    const { sub_app_version: verIndex, version_tag: verTag, sub_app_name: name } = appVerData;
    const ver = verTag || verIndex;
    ins.setState({ visible: true, loading: true, name, ver });
    const data = await subAppSrv.getSubAppAndItsFullVersion(name, ver);
    ins.setState({ dataStr: JSON.stringify(data, null, 2), loading: false });
  });
  const settings = {
    ins,
    close() {
      ins.setState({ visible: false, dataStr: '', loading: false });
    },
    getInterfaceUrl(isOut) {
      const { name, ver } = ins.state;
      return getMetaApiUrl(name, { isOut, version: ver });
    },
    getInterfaceUrlNoHC(isOut) {
      const { name, ver } = ins.state;
      return getNoHtmlContentMetaApiUrl(name, { isOut, version: ver });
    },
    copyUrl() {
      message.success('复制接口成功');
      copy(settings.getInterfaceUrl());
    },
    copyUrlNoHC() {
      message.success('复制接口（无html_content）成功');
      copy(settings.getInterfaceUrlNoHC());
    },
    copyOutUrl() {
      message.success('复制外网接口成功');
      copy(settings.getInterfaceUrl(true));
    },
    copyOutUrlNoHC() {
      message.success('复制外网接口（无html_content）成功');
      copy(settings.getInterfaceUrlNoHC(true));
    },
  };

  return settings;
}

export const MetaDataDrawer = React.memo(function () {
  const settings = useSetup(setup);
  const {
    ins: { state, syncer },
  } = settings;

  return (
    <Drawer
      title="查看（应用、版本）元数据"
      bodyStyle={{ paddingTop: '8px' }}
      visible={state.visible}
      width="1160px"
      onClose={settings.close}
    >
      <a href={settings.getInterfaceUrl()} target="_blink">
        接口
      </a>
      <CopyOutlined onClick={settings.copyUrl} />
      <NormalSpanBlank width="19px" />
      <a href={settings.getInterfaceUrlNoHC()} target="_blink">
        接口(无html_content)
      </a>
      <CopyOutlined onClick={settings.copyUrlNoHC} />
      <NormalSpanBlank width="19px" />
      <a href={settings.getInterfaceUrlNoHC(true)} target="_blink">
        外网接口
      </a>
      <CopyOutlined onClick={settings.copyOutUrl} />
      <NormalSpanBlank width="19px" />
      <a href={settings.getInterfaceUrlNoHC(true)} target="_blink">
        外网接口(无html_content)
      </a>
      <CopyOutlined onClick={settings.copyOutUrlNoHC} />
      <VerticalBlank height="8px" />
      <Alert
        message={`外网接口不能直接访问，目前可联系 ${HEL_CHARGER} 加入白名单后即可正常使用（注：外网接口返回数据做了一定的脱敏处理，如git信息等不再返回）`}
        type="info"
        showIcon
      />
      <VerticalBlank height="8px" />
      <Spin spinning={state.loading}>
        <MonacoEditor
          width="100%"
          height="calc(100vh - 130px)"
          language="json"
          theme="vs-dark"
          value={state.dataStr}
          options={{ selectOnLineNumbers: true }}
          onChange={syncer.dataStr}
        />
      </Spin>
    </Drawer>
  );
});

export default MetaDataDrawer;
