import { Table } from 'antd';
import styled from 'styled-components';

export const NoHeadTable = styled(Table)`
  &&& {
    .ant-table-thead {
      display: none;
    }
  }
`;
