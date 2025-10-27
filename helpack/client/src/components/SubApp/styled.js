import { Card } from 'antd';
import styled from 'styled-components';

// display: -webkit-box;
export const DescWrap = styled.div`
  display: -webkit-box;
  height: 42px;
  color: rgba(0, 0, 0, 0.45);
  padding: 2px 0 0 6px;
  font-size: 13px;
  word-break: break-all;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const AppTitleWrap = styled.div`
  display: inline-block;
  height: 30px;
  width: calc(100% - 30px);
  padding-left: 6px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AvatarWrap = styled.div`
  width: 30px;
  display: inline-block;
  vertical-align: top;
`;

export const MyCard = styled(Card)`
  &&& {
    .ant-card-actions {
      background-color: #f2f3f6 !important;
    }
    .ant-card-actions > li:not(:last-child) {
      border-right: 1px solid lightgrey;
    }
  }
`;
