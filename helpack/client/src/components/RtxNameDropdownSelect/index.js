/* eslint-disable react/prop-types */
import { LoadingOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import * as React from 'react';
import { typeCtxM, useC2Mod } from 'services/concent';
import * as staffSrv from 'services/staff';
import * as helUtil from 'utils/hel';

function setup(c) {
  const ctx = typeCtxM('portal', {}, c);
  const ins = ctx.initState({
    matchedUserList: staffSrv.searchUsers(),
  });
  const cu = ins.computed({
    matchedUserOptions({ matchedUserList }) {
      if (!staffSrv.getIsDataReady()) {
        return [
          {
            label: (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <LoadingOutlined />
              </div>
            ),
          },
        ];
      }
      return matchedUserList.map((item) => ({ label: item.full, value: item.en }));
    },
  });
  ctx.effect(() => {
    settings.initStaffState();
  }, []);

  const settings = {
    searchMonitor(toMatch) {
      const matchedUserList = staffSrv.searchUsers(toMatch);
      ins.setState({ matchedUserList });
    },
    async initStaffState() {
      if (!staffSrv.getIsDataReady()) {
        await staffSrv.initData();
      }
      // 自动同步当前登录者，运行用户二次修改
      const { userInfo } = ctx.state;
      // 匹配当前登录者搜10个
      const matchedUserList = staffSrv.searchUsers((userInfo.user || '').substr(0, 2));
      ins.setState({ matchedUserList });
    },
    state: ins.state,
    cu,
  };
  return settings;
}

function RtxNameDropDownSelect(props) {
  const { mode = 'multiple', disabled = false, style = {}, allowClear = true, placeholder = '' } = props;
  const {
    settings: { cu, searchMonitor },
  } = useC2Mod('portal', { setup });
  const targetMode = mode === 'single' ? undefined : mode; // undefined 代表单选

  return (
    <Select
      style={style}
      options={cu.matchedUserOptions}
      onSearch={searchMonitor}
      mode={targetMode}
      placeholder={placeholder}
      onChange={props.onChange}
      value={props.value}
      allowClear={allowClear}
      disabled={disabled}
      showSearch
      getPopupContainer={helUtil.getAppBodyContainer}
      filterOption={(input, option) => {
        if (!option.label.toLowerCase) return false;
        return option.label.toLowerCase().includes(input.toLowerCase());
      }}
    />
  );
}

export default React.memo(RtxNameDropDownSelect);
