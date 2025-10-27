import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import { NormalBlank } from 'components/dumb/Blank';
import copy from 'copy-to-clipboard';
import React from 'react';
import { ste } from 'utils/common';
import { AppTitleWrap } from './styled';

const stHighLight = { color: 'var(--lra-theme-color)' };
const stpdr = { paddingRight: '6px' };
const stName = { ...stHighLight, ...stpdr, fontSize: '18px' };

export default React.memo(function (props) {
  const stNameVar = props.showIcons ? stName : { color: 'green', ...stpdr };
  const { name, data } = props;
  const copyName = (e) => {
    ste(e);
    message.info(`复制应用名 ${name} 成功!`, 1);
    copy(name);
  };

  return (
    <AppTitleWrap
      onClick={(e) => {
        e.stopPropagation();
        props.onTitleClick(name, data);
      }}
    >
      <Tooltip title={name}>
        <span style={stNameVar}>{name}</span>
      </Tooltip>
      {props.showIcons && (
        <Tooltip title="访问当前应用">
          <LinkOutlined style={stHighLight} />
        </Tooltip>
      )}
      <NormalBlank width="5px" />
      {props.showIcons && (
        <Tooltip title="复制应用名称">
          <CopyOutlined style={stHighLight} onClick={copyName} />
        </Tooltip>
      )}
    </AppTitleWrap>
  );
});
