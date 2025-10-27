/* eslint-disable */
/** @typedef {import('hel-types').ISubAppVersion} ISubAppVersion*/
/** @typedef {import('hel-types').ISubApp} ISubApp*/
import {
  CheckOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  ExclamationOutlined,
  FileSyncOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Alert, Button, Col, Empty, Form, Input, Popover, Row, Spin, Switch, Tag, Tooltip } from 'antd';
import { NormalSpanBlank, VerticalBlank } from 'components/dumb/Blank';
import { VERSION_LIST } from 'configs/constant/ccModule';
import { typeCtxM, useC2Mod } from 'services/concent';
import * as message from 'services/message';
import { nodupStrPush } from 'utils/array';
import { clone } from 'utils/object';
import regs from 'utils/regs';
import styles from '../styles.module.css';
import SelectVersionLayer from './SelectVersionLayer';

const ITEM_LIMIT = 36;

let seed = 1;
function getLineId() {
  seed += 1;
  return seed;
}

function IdInput(props) {
  const color = '#00000073';
  let curLenColor = color;
  const valueLen = props.value.length;
  if (valueLen > 30) {
    curLenColor = 'red';
  }
  return (
    <span>
      <Input value={props.value} onChange={props.onChange} style={props.style} />
      <span style={{ color, paddingLeft: '8px' }}>
        <span style={{ color: curLenColor }}>{valueLen}</span>/30
      </span>
    </span>
  );
}

function VersionInput(props) {
  const { value: versionId, allowManualInput, syncer } = props;
  return (
    <span>
      <Input value={versionId} disabled={!allowManualInput} placeholder="点【选择】录入版本号" style={props.style} onChange={syncer} />
      <Popover
        content={
          <div>
            <Alert
              message={
                <div>
                  复制规则说明：
                  <VerticalBlank height="14px" />
                  <span style={{ color: 'grey', fontWeight: 300 }}>
                    <p>横向复制: 将此单元格的版本号值复制到同一行其他单元格</p>
                    <p>纵向复制: 将此单元格的版本号值复制到同一列其他单元格</p>
                    <p>全方向复制: 将此单元格的版本号值复制到剩余的所有单元格</p>
                  </span>
                </div>
              }
            ></Alert>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Button onClick={() => props.copyToRow(versionId, props.uiId)}>横向复制</Button>
              <NormalSpanBlank />
              <Button onClick={() => props.copyToCol(versionId, props.verKey)}>纵向复制</Button>
              <NormalSpanBlank />
              <Button onClick={() => props.copyToAll(versionId)}>全方向复制</Button>
            </div>
          </div>
        }
      >
        <NormalSpanBlank />
        <CopyOutlined style={{ color: 'grey' }} />
      </Popover>
      <NormalSpanBlank />
      <Tooltip title="点击清除当前单元格选择的版本号">
        <CloseCircleOutlined onClick={() => props.delCellVer(props.uiId, props.verKey)} style={{ color: 'grey' }} />
      </Tooltip>
    </span>
  );
}

function OpLine(props) {
  const { onlineVerIdSyncer, buildVerIdSyncer, item } = props;
  const { id, onlineVerId, buildVerId } = item;
  const inputStyle = { width: '82%' };

  return (
    <Row style={{ marginBottom: '12px' }}>
      <Col span={7} style={{ textAlign: 'center' }}>
        <Tag style={{ color: '#00000073' }}>{props.idx + 1}</Tag>
        <IdInput value={id} onChange={props.syncer} style={{ width: '73%' }} />
      </Col>
      <Col span={7} style={{ textAlign: 'center' }}>
        <VersionInput {...props} value={onlineVerId} syncer={onlineVerIdSyncer} verKey="onlineVerId" style={inputStyle} />
      </Col>
      <Col span={7} style={{ textAlign: 'center' }}>
        <VersionInput {...props} value={buildVerId} syncer={buildVerIdSyncer} verKey="buildVerId" style={inputStyle} />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Button onClick={props.selectVersion} type="link" style={{ padding: '2px' }}>
          选择
        </Button>
        <NormalSpanBlank />
        <Button onClick={props.addItem} type="link" style={{ padding: '2px' }}>
          增加
        </Button>
        <NormalSpanBlank />
        <Button onClick={props.delItem} type="link" style={{ padding: '2px' }} danger>
          删除
        </Button>
      </Col>
    </Row>
  );
}

function setup(c) {
  const ctx = typeCtxM(VERSION_LIST, {}, c);
  const getDataList = (map) => {
    const dataList = [];
    Object.keys(map).forEach((key) => {
      const { o = '', b = '' } = map[key];
      dataList.push({ id: key, uiId: getLineId(), onlineVerId: o, buildVerId: b });
    });
    return dataList;
  };
  const getInitialState = (pFetchSubAppEnd = true) => {
    return {
      pLineDataList: [],
      mapBackup: null,
      pFetchSubAppEnd,
      pAllowManualInput: false,
      idx: 0, // 修改的是第几行数据
    };
  };
  const gerProjVerMap = (/** @type {ISubApp} */ subApp) => {
    const projVer = subApp.proj_ver || {};
    const map = projVer.map || {};
    const mapBackup = clone(map);
    return mapBackup;
  };

  const ins = ctx.initState(getInitialState(false));
  ctx.mr.freshSubAppAssociate(ctx.props.name).then(() => {
    const mapBackup = gerProjVerMap(ctx.state.subApp);
    ins.setState({ pFetchSubAppEnd: true, mapBackup, pLineDataList: getDataList(mapBackup) });
  });

  ctx.on('selectAsProjVer', (/** @type ISubAppVersion */ selVersion, selType) => {
    const { pLineDataList, idx } = ins.state;
    const { sub_app_version, version_tag } = selVersion;
    const verStr = version_tag || sub_app_version;
    const item = pLineDataList[idx];
    if (item) {
      if (selType === 'online') {
        item.onlineVerId = verStr;
      } else if (selType === 'build') {
        item.buildVerId = verStr;
      } else if (selType === 'ol_bu') {
        item.onlineVerId = verStr;
        item.buildVerId = verStr;
      } else {
        alert(`unknown selType ${selType}`);
        return;
      }

      const lineNo = idx + 1;
      const tipNoId = !item.id ? '，请注意当前行数还未录入【项目id】数据' : '';
      message.info(`选择版本号 [${verStr}] 录入到第${lineNo}行${tipNoId}`, 1);
      ins.setState({ pLineDataList });
    }
    ctx.emit('closeSelectVersionLayer');
  });

  const settings = {
    ins,
    recover() {
      const map = clone(ins.state.mapBackup || {});
      ins.setState({ pLineDataList: getDataList(map) });
    },
    submit() {
      const { pLineDataList } = ins.state;

      const nameList = [];
      let hasEmptyId = false;
      let hasEmptyVersionId = false;
      let idInvalidTip = '';
      let idTooLongTip = '';
      let checkTip = '';
      pLineDataList.forEach((item, idx) => {
        const { id, onlineVerId } = item;
        const tmpCheckTip = `请检查第${idx + 1}项！`;

        if (!id) {
          hasEmptyId = true;
          checkTip = tmpCheckTip;
        } else if (!regs.letterOrNum.test(id)) {
          idInvalidTip = `${tmpCheckTip}id命名只能是包含大小写字母、数字、中横线、下横线 四种符号的组合`;
        }
        if (id.length > 30) {
          idTooLongTip = `${tmpCheckTip}id命名长度不能大于30个字符`;
        }
        if (!onlineVerId) {
          checkTip = tmpCheckTip;
          hasEmptyVersionId = true;
        }
        nodupStrPush(nameList, id);
      });

      if (idInvalidTip) {
        return message.error(idInvalidTip);
      }
      if (idTooLongTip) {
        return message.error(idTooLongTip);
      }
      if (hasEmptyVersionId) {
        return message.error(`存在有未选择版本号的配置项，${checkTip}`);
      }
      if (hasEmptyId) {
        return message.error(`存在有未填写的项目id，${checkTip}`);
      }
      if (nameList.length < pLineDataList.length) {
        return message.error(`存在有重复的项目id，请检查`);
      }

      ctx.mr.updateProjVer(pLineDataList);
    },
    selectVersion(idx) {
      ins.setState({ idx });
      ctx.emit('openSelectVersionLayer', ctx.state.subApp);
    },
    delItem(idx) {
      const { pLineDataList } = ins.state;
      pLineDataList.splice(idx, 1);
      message.warn('删除成功，注意需点击【确认】按钮后才会生效');
      ins.setState({ pLineDataList });
    },
    addItem(idx) {
      const { pLineDataList } = ins.state;
      if (pLineDataList.length === ITEM_LIMIT) {
        return message.warn(`最多只能添加${ITEM_LIMIT}组映射关系`);
      }
      pLineDataList.splice(idx, 0, { uiId: getLineId(), id: '', onlineVerId: '', buildVerId: '' });
      ins.setState({ pLineDataList });
    },
    copyToRow(versionId, uiId) {
      const { pLineDataList } = ins.state;
      const item = pLineDataList.find((item) => item.uiId === uiId);
      if (item) {
        if (!versionId) {
          return message.warn('横向复制失败，请先为单元格选择一个版本号');
        }
        item.onlineVerId = versionId;
        item.buildVerId = versionId;
        message.warn('横向复制成功，注意需点击【确认】按钮后才会生效');
        ins.setState({ pLineDataList: pLineDataList.slice() });
      }
    },
    copyToCol(versionId, verKey) {
      if (!versionId) {
        return message.warn('纵向复制失败，请先为单元格选择一个版本号');
      }
      const { pLineDataList } = ins.state;
      pLineDataList.forEach((item) => (item[verKey] = versionId));
      message.warn('纵向复制成功，注意需点击【确认】按钮后才会生效');
      ins.setState({ pLineDataList });
    },
    copyToAll(versionId) {
      if (!versionId) {
        return message.warn('全方向复制失败，请先为单元格选择一个版本号');
      }
      const { pLineDataList } = ins.state;
      pLineDataList.forEach((item) => {
        item.onlineVerId = versionId;
        item.buildVerId = versionId;
      });
      message.warn('全方向复制成功，注意需点击【确认】按钮后才会生效');
      ins.setState({ pLineDataList });
    },
    delCellVer(uiId, verKey) {
      const { pLineDataList } = ins.state;
      const item = pLineDataList.find((item) => item.uiId === uiId);
      if (item) {
        const versionId = item[verKey];
        if (!versionId) {
          return message.warn('清除无效，当前单元格无版本号');
        }
        item[verKey] = '';
        message.warn('清除成功');
        ins.setState({ pLineDataList });
      }
    },
    async refresh() {
      ctx.setState({ projVerAreaLoading: true });
      await ctx.mr.freshSubAppAssociate();
      const mapBackup = gerProjVerMap(ctx.state.subApp);
      const initial = getInitialState();
      await ctx.setState({
        ...initial,
        projVerAreaLoading: false,
        mapBackup,
        pLineDataList: getDataList(mapBackup),
      });
    },
  };
  return settings;
}

function ProjVerMap(props) {
  const { settings: se, state } = useC2Mod(VERSION_LIST, { setup, props, tag: 'ProjVerMap' });
  const { ins } = se;
  const list = ins.state.pLineDataList;

  return (
    <div>
      <div className={styles.controlLine}>
        <div className={styles.controlArea}>
          <Tooltip
            title={
              <>
                <ExclamationOutlined style={{ color: 'red', fontWeight: 900 }} />
                手动录入版本，用户需自己承担录错版本号带来的异常结果
              </>
            }
          >
            <Switch
              checkedChildren="手动录入"
              unCheckedChildren="手动录入"
              checked={ins.state.pAllowManualInput}
              onChange={ins.syncer.pAllowManualInput}
            />
          </Tooltip>
          <NormalSpanBlank />
          <Tooltip title="刷新项目id与版本映射关系">
            <Button type="primary" size="small" className={`gHover ${styles.controlItem}`} onClick={se.refresh} icon={<ReloadOutlined />}>
              刷新
            </Button>
          </Tooltip>
        </div>
      </div>
      <Alert
        showIcon
        type="info"
        message="通过自定义【项目id】与【版本号】的映射关系，可以支持让不同项目里的 hel-micro sdk 
      拉取同一个应用的不同时期的构建版本号（注：目前只支持添加最多36组映射关系）。"
      />
      <VerticalBlank />
      <Row style={{ marginBottom: '12px', backgroundColor: '#f4f5f5', padding: '6px' }}>
        <Col span={7} style={{ textAlign: 'center', borderRight: '1px solid lightgrey' }}>
          项目id
          <NormalSpanBlank />
          <Tag color="blue" style={{ verticalAlign: 'bottom' }}>
            必须
          </Tag>
        </Col>
        <Col span={7} style={{ textAlign: 'center', borderRight: '1px solid lightgrey' }}>
          线上版本号
          <NormalSpanBlank />
          <Tag color="blue" style={{ verticalAlign: 'bottom' }}>
            必须
          </Tag>
        </Col>
        <Col span={7} style={{ textAlign: 'center', borderRight: '1px solid lightgrey' }}>
          灰度版本号
          <NormalSpanBlank />
          <Tag style={{ verticalAlign: 'bottom' }}>选填</Tag>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          操作
        </Col>
      </Row>
      <Spin spinning={state.projVerAreaLoading || !ins.state.pFetchSubAppEnd}>
        <Form>
          {list.map((item, idx) => {
            return (
              <OpLine
                item={item}
                key={item.uiId}
                idx={idx}
                uiId={item.uiId}
                syncer={ins.sync(`pLineDataList.${idx}.id`)}
                buildVerIdSyncer={ins.sync(`pLineDataList.${idx}.buildVerId`)}
                onlineVerIdSyncer={ins.sync(`pLineDataList.${idx}.onlineVerId`)}
                selectVersion={() => se.selectVersion(idx)}
                delItem={() => se.delItem(idx)}
                addItem={() => se.addItem(idx + 1)}
                copyToRow={se.copyToRow}
                copyToCol={se.copyToCol}
                copyToAll={se.copyToAll}
                delCellVer={se.delCellVer}
                allowManualInput={ins.state.pAllowManualInput}
              />
            );
          })}
        </Form>
        {!list.length && (
          <>
            <Empty description="暂无配置，请点击新增" />
            <VerticalBlank />
          </>
        )}
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => se.addItem(list.length)}>
            <PlusOutlined />
            新增
          </Button>
          <NormalSpanBlank />
          <Button onClick={se.recover}>
            <FileSyncOutlined />
            恢复
          </Button>
          <NormalSpanBlank />
          <Button type="primary" onClick={se.submit} loading={state.updateLoading}>
            <CheckOutlined />
            确认
          </Button>
        </div>
      </Spin>
      <SelectVersionLayer />
    </div>
  );
}

ProjVerMap.displayName = 'ProjVerMap';

export default ProjVerMap;
