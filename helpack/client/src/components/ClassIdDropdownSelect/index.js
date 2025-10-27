/* eslint-disable react/prop-types */
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Empty, Input, message, Select, Space, Tag, Tooltip } from 'antd';
import { NormalBlank, VerticalBlank } from 'components/dumb/Blank';
import * as page from 'configs/constant/page';
import { getClassInfoList, getFullClassInfoById, newClassInfo, updateClassInfo } from 'services/classInfo';
import * as commonService from 'services/common';
import { getRootState, typeCtxDe, useSetup } from 'services/concent';
import { ste } from 'utils/common';
import { formatISODateStr } from 'utils/date';
import regs from 'utils/regs';
import { ClassItemUpdateLayer } from './ClassItemUpdateLayer';
import { ClassTokenPreviewLayer } from './ClassTokenPreviewLayer';
import { cache, filterOption, getList } from './util';

const stTitle = {
  color: 'black',
  display: 'inline-block',
  width: '80px',
};
const stNewClassInfoWrap = {
  padding: '12px',
  margin: '12px',
  border: '1px solid var(--lra-theme-color)',
};
const stFont = { color: 'var(--lra-theme-color)' };

function setup(c) {
  const user = getRootState().portal.userInfo.user;
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    newKey: '',
    newName: '',
    editName: '',
    modalVisible: false,
    classTokenModalVisible: false,
    selectedClassInfo: {},
    newBtnLoading: false,
    updateBtnLoading: false,
    showNewClassInfo: false,
    classTokenLoading: false,
    classToken: '',
    ...getList(user),
  });
  ctx.effect(() => {
    if (!cache.classInfoList.length) {
      getClassInfoList().then((list) => {
        cache.classInfoList = list;
        ins.setState(getList(user));
      });
    }
  }, []);

  const settings = {
    user,
    ins,
    formatMsg(msg, replaceMsg) {
      if (msg.includes('Validation error')) {
        return replaceMsg;
      }
      return msg;
    },
    cancelNewClassInfo() {
      ins.setState({ showNewClassInfo: false });
    },
    showNewClassInfo(e) {
      e.preventDefault();
      return ins.setState({ showNewClassInfo: true });
    },
    gotoClassMgr() {
      commonService.historyPush(page.CLASS_MGR);
    },
    async newClassInfo(e) {
      e.preventDefault();
      const { newName, newKey } = ins.state;
      if (!newName || !newKey) {
        return message.error('新建失败，请输入分类key、名称');
      }
      if (newName.length > 30 || newKey.length > 30) {
        return message.error('新建失败，分类key或名称长度大于30');
      }
      if (!regs.letterOrNum.test(newKey)) {
        return message.error('新建失败，分类key只能是英文、数字、下划线、横向的任意组合');
      }

      ins.setState({ newBtnLoading: true });
      const reply = await newClassInfo(newKey, newName);
      let isCreatedSuccess = false;

      if (reply.code !== '0') {
        message.error(settings.formatMsg(reply.msg, '分类key或名称重复'));
      } else {
        isCreatedSuccess = true;
        message.success('新增分类成功!');
        cache.classInfoList.push(reply.data);
      }

      ins.setState({ newBtnLoading: false, showNewClassInfo: !isCreatedSuccess, ...getList(user) });
    },
    openModal(e, item) {
      ste(e);
      ins.setState({ modalVisible: true, selectedClassInfo: item, editName: item.class_label });
    },
    async openClassTokenModal(e, item) {
      ste(e);
      ins.setState({ classTokenModalVisible: true, selectedClassInfo: item, classToken: '', classTokenLoading: true });
      try {
        const fullData = await getFullClassInfoById(item.id);
        ins.setState({ classToken: fullData.class_token, classTokenLoading: false });
      } catch (err) {
        message.error(err.message);
        ins.setState({ classTokenLoading: false });
      }
    },
    closeModal() {
      ins.setState({ modalVisible: false });
    },
    closeClassTokenModal() {
      ins.setState({ classTokenModalVisible: false, classToken: '' });
    },
    async modify() {
      const { editName, selectedClassInfo, allClassItems } = ins.state;
      const matchedItems = allClassItems.filter((item) => item.class_label === editName);
      if (matchedItems.length) {
        return message.error('修改无效，名字重复！'); // 这里后台也做了检查
      }
      ins.setState({ updateBtnLoading: true });
      const reply = await updateClassInfo(selectedClassInfo.class_key, editName);
      if (reply.code !== '0') {
        message.error(settings.formatMsg(reply.msg, '分类名称重复'));
      } else {
        message.success('更新分类名称成功');
        selectedClassInfo.class_label = editName;
      }
      ins.setState({ updateBtnLoading: false, modalVisible: false, ...getList(user) });
    },
  };
  return settings;
}

function ClassIdCreatorUI(props) {
  const { settings } = props;
  const { ins } = settings;
  const { newBtnLoading } = ins.state;

  return (
    <div style={stNewClassInfoWrap}>
      <span style={stTitle}>分类key：</span>
      <Input style={{ width: '360px' }} placeholder="hel-demo" value={settings.ins.state.newKey} onChange={ins.syncer.newKey} allowClear />
      <VerticalBlank height="3px" />
      <Tag color="blue" style={{ marginLeft: '80px' }}>
        允许0~9数字、a~z大小写字母、下划线、中横线任意组合，建议录入一个有意义的key，
        <span style={{ color: 'red' }}>后续不允许变更，每人创建上限5个</span>
      </Tag>
      <VerticalBlank height="12px" />
      <span style={stTitle}> 分类名称：</span>
      <Input
        style={{ width: '360px' }}
        placeholder="海拉分享案例"
        value={settings.ins.state.newName}
        onChange={ins.syncer.newName}
        allowClear
      />
      <VerticalBlank height="3px" />
      <Tag color="blue" style={{ marginLeft: '80px' }}>
        用于展示的名称，后续可以二次更改
      </Tag>
      <VerticalBlank height="12px" />
      <div style={{ textAlign: 'center' }}>
        <Button onClick={settings.cancelNewClassInfo}>取消</Button>
        <NormalBlank width="20px" />
        <Button type="primary" onClick={settings.newClassInfo} loading={newBtnLoading}>
          确认
        </Button>
      </div>
    </div>
  );
}

function ClassItem(props) {
  const { item, settings, showTokenBtn } = props;
  return (
    <div>
      {item.class_label}
      <span style={{ color: 'lightgrey', paddingLeft: '12px' }}>
        ( {item.class_key} , {item.create_by} 创建于 {formatISODateStr(item.ctime)}
        {settings.user === item.create_by && (
          <>
            <NormalBlank />
            <Tooltip title="当前分类由访问者创建，允许再次修改">
              <EditOutlined style={stFont} onClick={(e) => settings.openModal(e, item)} />
            </Tooltip>
            <NormalBlank width="6px" />
            {showTokenBtn && (
              <Tooltip title="查看分类token，满足helpack-js-sdk、hel-mono-deploy 等包体调用api时之需">
                <EyeOutlined style={stFont} onClick={(e) => settings.openClassTokenModal(e, item)} />
              </Tooltip>
            )}
          </>
        )}{' '}
        )
      </span>
    </div>
  );
}

function renderOptions(settings, allowEdit) {
  const { state } = settings.ins;
  return state.visibleClassItems.map((item) => {
    const { class_label: label, class_key: key } = item;
    return {
      originalLabel: label,
      classKey: key,
      label: allowEdit ? <ClassItem settings={settings} key={key} item={item} /> : label,
      value: key,
    };
  });
}

/**
 * 我的分类管理
 */
export function MyClassIdMgr() {
  const settings = useSetup(setup, { extra: { isPage: true } });
  const { myClassItems, showNewClassInfo } = settings.ins.state;
  return (
    <div>
      <ClassItemUpdateLayer settings={settings} />
      <ClassTokenPreviewLayer settings={settings} />
      <div>
        我的分类列表（ 没有合适的？
        <span className="gHover" onClick={settings.showNewClassInfo} style={{ color: 'var(--lra-theme-color)' }}>
          新建
        </span>
        一个）
      </div>
      {showNewClassInfo && <ClassIdCreatorUI settings={settings} />}
      {!myClassItems.length ? (
        <Empty />
      ) : (
        <div style={{ border: '1px solid var(--lra-theme-color)', padding: '12px' }}>
          {myClassItems.map((item) => (
            <ClassItem key={item.class_key} settings={settings} item={item} showTokenBtn />
          ))}
        </div>
      )}
    </div>
  );
}

const ClassIdDropdownSelect = (props) => {
  const { disabled = false, allowEdit = true, style = {} } = props;
  const settings = useSetup(setup);
  const { ins } = settings;
  return (
    <>
      <ClassItemUpdateLayer settings={settings} />
      <Select
        showSearch
        allowClear
        style={style}
        disabled={disabled}
        placeholder="选择分类"
        onChange={props.onChange}
        value={props.value || undefined}
        dropdownRender={(menu) =>
          allowEdit ? (
            <>
              {menu}
              <Divider
                style={{
                  margin: '8px 0',
                }}
              />
              <Space style={{ padding: '0 8px 4px' }}>
                找不到合适的分类？
                <span className="gHover" onClick={settings.showNewClassInfo} style={stFont}>
                  新建
                </span>
                一个 ，去
                <span className="gHover" onClick={settings.gotoClassMgr} style={stFont}>
                  我的分类
                </span>
                查看
              </Space>
              {ins.state.showNewClassInfo && <ClassIdCreatorUI settings={settings} />}
            </>
          ) : (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <span style={{ paddingLeft: '8px', color: 'lightgrey' }}>可在新建或修改应用时新增分类</span>
            </>
          )
        }
        optionLabelProp="originalLabel"
        options={renderOptions(settings, allowEdit)}
        filterOption={filterOption}
      />
    </>
  );
};
export default ClassIdDropdownSelect;
