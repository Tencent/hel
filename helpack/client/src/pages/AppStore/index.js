import { FileSearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Divider, Dropdown, Empty, Input, Menu, message, Modal, Pagination, Radio, Row, Select, Spin } from 'antd';
import ClassIdDropdownSelect from 'components/ClassIdDropdownSelect';
import { NormalBlank, VerticalBlank } from 'components/dumb/Blank';
import RtxNameDropdownSelect from 'components/RtxNameDropdownSelect';
import SubApp from 'components/SubApp';
import { APP_CARD_GRAY, lsKeys } from 'configs/constant';
import { APP_STORE } from 'configs/constant/ccModule';
import React from 'react';
import { typeCtxM, useC2Mod } from 'services/concent';
import { removeIfExist } from 'utils/array';
import { delay } from 'utils/common';
import { safeParse } from 'utils/object';

const LS_LATEST_SEARCH = 'HelHub.latestSearch';

const stTestBadge = { position: 'absolute', right: '3px', top: '-5px', width: '60px', zIndex: 2 };
const stLatestSearchBtn = { width: '46px', transform: 'translateX(-1px)', verticalAlign: 'top' };
const testBadgeUrl = 'http://mat1.gtimg.com/news/js/tnfe/imgs/leah4/test_app.png';
const options = [
  { label: '正式', value: 'prod' },
  { label: '测试', value: 'test' },
  { label: '全部', value: 'all' },
];

function setup(c) {
  const ctx = typeCtxM(APP_STORE, {}, c);
  const ins = ctx.initState({
    modelVisible: false,
  });

  ctx.effect(() => {
    ctx.mr.initPage(true);
    if (!localStorage.getItem(lsKeys.APP_CARD_GRAY)) {
      localStorage.setItem(lsKeys.APP_CARD_GRAY, 1);
      ins.setState({ modelVisible: true });
    }
  }, []);
  ctx.watch('listMode', (newState, oldState) => {
    if (newState.listMode !== oldState.listMode) {
      ctx.mr.fetchDataList({ page: 1 });
    }
  });

  const getLatestSearch = () => {
    const arr = safeParse(localStorage.getItem(LS_LATEST_SEARCH), []);
    return arr.filter((item) => !!item);
  };
  const setLatestSearch = (appName) => {
    let arr = getLatestSearch();
    arr = removeIfExist(arr, appName);
    arr.unshift(appName);
    localStorage.setItem(LS_LATEST_SEARCH, JSON.stringify(arr));
  };

  const settings = {
    ins,
    fetchMore: () => {
      const payload = { page: ctx.state.page + 1 };
      ctx.mr.fetchDataList(payload);
    },
    handelPageSizeChange: (page, size) => {
      ctx.mr.fetchDataList({ page, size });
    },
    handlePageCurrentChange: async (page) => {
      ctx.mr.fetchDataList({ page });
    },
    handleNameClick(e) {
      const { key: appName } = e;
      ctx.mr.setState({ searchStr: appName });
      ctx.mr.searchApp();
    },
    async searchApp() {
      // 触发 Input 清除动作时，onSearch 会于 onChange 先执行，故这里延迟一下，确保取到的 searchStr 是变化后的值
      await delay(12);
      ctx.mr.searchApp().then(() => {
        const { subApps, searchStr, total, listMode } = ctx.state;
        if (subApps.length) {
          // 搜索到具体的应用时才记录
          setLatestSearch(searchStr);
        }
        if (listMode !== 'all') {
          message.info(`helpack 为你共搜到 ${total} 个应用，如没有查询结果可尝试切换到【全部】应用`, 1);
        }
      });
    },
    searchAppByClassKey(classKey) {
      ctx.mr.setState({ classKey: classKey === undefined ? '-10000' : classKey });
      ctx.mr.searchApp();
    },
    renderLatestSearchMenu() {
      const arr = getLatestSearch();
      return (
        <Menu className="smallScBar" onClick={settings.handleNameClick} style={{ maxHeight: '380px', overflowY: 'scroll', width: '280px' }}>
          {!arr.length && <Empty description="暂无最近搜索" />}
          {arr.map((name) => (
            <Menu.Item key={name}>{name}</Menu.Item>
          ))}
        </Menu>
      );
    },
    showTotal() {
      return <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Hel Pack 为你共搜索到应用 {ctx.state.total} 个</span>;
    },
    searchOptions: [
      { label: '应用名（模糊）', value: 'name' },
      { label: '应用名（精确）', value: 'name_exact' },
      { label: '创建者', value: 'creator' },
    ],
  };

  return settings;
}

export default React.memo(() => {
  const { state, settings, syncer, mr } = useC2Mod(APP_STORE, { setup, ccClassKey: 'AppStore' });
  const { ins } = settings;
  const uiSearchType = (
    <Select value={state.searchType} dropdownStyle={{ minWidth: '140px' }} options={settings.searchOptions} onChange={syncer.searchType} />
  );

  return (
    <div style={{ position: 'relative' }}>
      {state.listMode === 'test' && <img src={testBadgeUrl} style={stTestBadge} />}
      <Row>
        <Col span={24}>
          查看应用:
          <NormalBlank />
          <Radio.Group options={options} onChange={syncer.listMode} value={state.listMode} />
          <Divider type="vertical" />
          <NormalBlank width="20px" />
          <span style={{ position: 'relative' }}>
            <Input.Search
              value={state.searchStr}
              onChange={syncer.searchStr}
              onSearch={settings.searchApp}
              style={{ width: '380px' }}
              enterButton
              allowClear
              addonBefore={uiSearchType}
              placeholder="请输入应用名"
            />
            {state.searchType === 'creator' && (
              <RtxNameDropdownSelect
                mode="single"
                placeholder="请选择创建者"
                value={state.searchUser}
                style={{ width: '249px', position: 'absolute', left: '84px' }}
                onChange={(e) => {
                  mr.setState({ searchUser: e || '' });
                }}
              />
            )}
            {['name', 'name_exact'].includes(state.searchType) && (
              <Dropdown overlay={settings.renderLatestSearchMenu}>
                <Button style={stLatestSearchBtn} className="gHover" icon={<FileSearchOutlined />}></Button>
              </Dropdown>
            )}
          </span>
          <NormalBlank />
          <ClassIdDropdownSelect
            allowEdit={false}
            style={{ width: '220px', verticalAlign: 'top' }}
            onChange={settings.searchAppByClassKey}
          />
          <NormalBlank />
          <Button onClick={mr.refreshCurPage} className="gHover" style={{ verticalAlign: 'top' }} icon={<ReloadOutlined />}>
            刷新
          </Button>
        </Col>
      </Row>
      <VerticalBlank />
      <Spin spinning={state.loading}>
        <Row justify="center">{state.subApps.length === 0 && <Empty />}</Row>
        <Row gutter={[16, 16]}>
          {state.subApps.map((v) => (
            <SubApp key={v.name} appData={v} module={APP_STORE} />
          ))}
          {/* <Button type="primary" loading={state.btnLoading} block style={stBtn} onClick={settings.fetchMore}>
            加载更多
        </Button> */}
          <div style={{ width: '100%' }}>
            <Pagination
              onShowSizeChange={settings.handelPageSizeChange}
              onChange={settings.handlePageCurrentChange}
              current={state.page}
              total={state.total}
              showSizeChanger
              pageSizeOptions={['20', '50', '100']}
              pageSize={state.size}
              style={{ paddingRight: '20px', float: 'right' }}
              showTotal={settings.showTotal}
            />
          </div>
        </Row>
      </Spin>
      <Modal
        title="helpack 更新提示"
        visible={ins.state.modelVisible}
        width={1000}
        centered
        onCancel={() => ins.setState({ modelVisible: false })}
        footer={[
          <Button key="1" type="primary" onClick={() => ins.setState({ modelVisible: false })}>
            Ok
          </Button>,
        ]}
      >
        <div>
          <Alert showIcon type="info" message="应用列表卡片颜色优化，如下图所示，全灰代表应用正在灰度中" />
          <VerticalBlank />
          <img src={APP_CARD_GRAY} />
        </div>
      </Modal>
    </div>
  );
});
