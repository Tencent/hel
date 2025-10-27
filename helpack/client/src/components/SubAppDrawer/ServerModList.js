/* eslint-disable no-unused-vars,semi,react/prop-types */
/** @typedef {import('types/domain').SubApp} SubApp */
/** @typedef {import('types/domain').IServerModStat} IServerModStat */
import { CopyOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Radio, Row, Tag } from 'antd';
import { NormalBlank } from 'components/dumb/Blank';
import GeneralTable from 'components/GeneralTable';
import { SERVER_MOD_LIST } from 'configs/constant/ccModule';
import copy from 'copy-to-clipboard';
import React from 'react';
import { getModelState, typeCtxM, useC2Mod } from 'services/concent';
import * as dateUtil from 'utils/date';
import * as helper from './logic/helper';
import styles from './styles.module.css';

const stTitle = {
  color: 'rgba(0,0,0,.7)',
  verticalAlign: 'top',
};
const stCol = { minHeight: '26px' };

const listModeOptions = [
  { label: '卡片', value: 'card' },
  { label: '表格', value: 'table' },
];

const MyCol = (props) => {
  const { span = '12', colStyle = stCol, titleStyle = stTitle, title, label } = props;
  const copyLabel = (e) => {
    helper.ste(e);
    copy(label);
    message.success(`复制${title} ${label} 成功`, 1);
  };

  return (
    <Col span={span} style={colStyle}>
      <span style={titleStyle}>{title}：</span>
      {label} <CopyOutlined onClick={copyLabel} />
    </Col>
  );
};

const Head = React.memo(() => {
  const { state, mr } = useC2Mod(SERVER_MOD_LIST, { tag: 'SMHead' });
  const { user } = getModelState('portal').userInfo;

  return (
    <div>
      <div>
        你好，亲爱的用户
        {user}， 当前模块共运行在 <Tag color={helper.tagColors.online}>{state.total}</Tag>个Node服务上
      </div>
      <div style={{ float: 'right', margin: '12px 12px 0 0' }}>
        列表模式：
        <Radio.Group
          options={listModeOptions}
          onChange={(e) => mr.changeListMode(e.target.value)}
          value={state.listMode}
          style={{ width: '150px' }}
        />
        <NormalBlank />
        <Button onClick={mr.refreshTableCurPage}>刷新</Button>
      </div>
    </div>
  );
});

const renderCard = (/** @type {IServerModStat} */ record) => {
  const loadAt = dateUtil.tryGetLocaleStrOfISOStr(record.load_at);
  return (
    <Card className={styles.srvModCardWrap} hoverable={true}>
      <div className={styles.srvModJsLogo} />
      <Row gutter={5} style={{ position: 'relative' }}>
        <MyCol title="模块版本" label={record.mod_version} />
        <MyCol title="载入时间" label={loadAt} />
        <MyCol title="环境" label={record.env_name} />
        <MyCol title="容器名称" label={record.container_name} />
        <MyCol title="容器ip" label={record.container_ip} />
        <MyCol title="pod名称" label={record.pod_name} />
        <MyCol title="镜像名称" label={record.img_version} />
        <MyCol title="城市" label={record.city} />
      </Row>
    </Card>
  );
};

/** @type {()=>import('antd/lib/table/interface').ColumnsType<IServerModStat>} */
const getCardColumns = () => [
  {
    key: 'op',
    title: () => <span />,
    render: (val, record) => renderCard(record),
  },
];

const getColumns = () => [
  { dataIndex: 'mod_version', title: '模块版本' },
  { dataIndex: 'load_at', title: '载入时间', render: (val) => dateUtil.tryGetLocaleStrOfISOStr(val) },
  { dataIndex: 'env_name', title: '环境' },
  { dataIndex: 'container_name', title: '容器名称' },
  { dataIndex: 'container_ip', title: '容器ip' },
  { dataIndex: 'pod_name', title: 'pod名称' },
  { dataIndex: 'img_version', title: '镜像名称' },
  { dataIndex: 'city', title: '城市' },
];

function setup(c) {
  const ctx = typeCtxM(SERVER_MOD_LIST, {}, c);
  ctx.setState({ subAppName: ctx.props.name });

  return {
    fetchFn: ctx.mr.fetchDataList,
    pageSizeOptions: ['10', '20', '30'],
  };
}

function ServerModList(props) {
  const { settings, state } = useC2Mod(SERVER_MOD_LIST, { setup, props, tag: 'ServerModList' });
  const isCard = state.listMode === 'card';
  const getColumnsFn = isCard ? getCardColumns : getColumns;

  return (
    <>
      <Head />
      <GeneralTable
        tid="smTable"
        fetchFn={settings.fetchFn}
        getColumns={getColumnsFn}
        pageSizeOptions={settings.pageSizeOptions}
        hasTopPagination={true}
        noTableHead={isCard}
      />
    </>
  );
}

ServerModList.displayName = 'ServerModList';

export default React.memo(ServerModList);
