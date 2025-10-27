/* eslint-disable react/prop-types,no-underscore-dangle,no-param-reassign */
/** @typedef {import('./model/meta').CtxPre} CtxPre */
import { Button, Pagination, Table } from 'antd';
import { useConcent } from 'concent';
import React, { Fragment } from 'react';
import './model';
import { getInitMetaData } from './model/state';
import { NoHeadTable } from './styled';

export const evNames = {
  refreshTable: 'refreshTable',
  clearTable: 'clearTable',
  refreshTableCurPage: 'refreshTableCurPage',
};

const setup = (/** @type CtxPre */ ctx) => {
  const {
    tid: tableId,
    fetchAfterMounted = true,
    hasMoreMode = false,
    fetchFn: propsFetchFn,
    pageSizeOptions = ['50', '100', '200'],
  } = ctx.props;
  const { ccUniqueKey } = ctx;
  if (!ctx.state.meta[tableId]) {
    const pageSize = parseInt(pageSizeOptions[0], 10) || 50;
    ctx.state.meta[tableId] = getInitMetaData(hasMoreMode, pageSize);
  }

  ctx.on([evNames.refreshTable, tableId], async (fetchFn) => {
    const _fetchFn = fetchFn || propsFetchFn;
    await ctx.mr.clearTable({ tableId }, ccUniqueKey);
    await ctx.mr.handlePageCurrentChange({ tableId, current: 1, fetchFn: _fetchFn }, ccUniqueKey);
  });
  ctx.on([evNames.clearTable, tableId], () => {
    ctx.mr.clearTable({ tableId }, ccUniqueKey);
  });
  ctx.on([evNames.refreshTableCurPage, tableId], (fetchFn) => {
    const _fetchFn = fetchFn || propsFetchFn;
    const tableMeta = ctx.state.meta[tableId];
    ctx.mr.handlePageCurrentChange({ tableId, current: tableMeta.current, fetchFn: _fetchFn }, ccUniqueKey);
  });

  ctx.effect(() => {
    if (fetchAfterMounted) {
      handlePageCurrentChange(1);
    }
    return () => ctx.mr.clearTable({ tableId }, ccUniqueKey);
  }, []);

  const handlePageCurrentChange = (current) => {
    const { fetchFn } = ctx.props; // fetchFn有可能会变，这里每次取最新的
    ctx.mr.handlePageCurrentChange({ tableId, current, fetchFn }, ccUniqueKey);
  };
  const handelPageSizeChange = (page, pageSize) => {
    const { fetchFn } = ctx.props;
    ctx.mr.handlePageSizeChange({ tableId, pageSize, fetchFn }, ccUniqueKey);
  };
  const handleNextPage = () => {
    const { fetchFn } = ctx.props;
    ctx.mr.handleNextPage({ tableId, fetchFn });
  };

  return {
    handlePageCurrentChange,
    handelPageSizeChange,
    handleNextPage,
    pageSizeOptions,
  };
};

/**
 * #################[Code example]#####################
 *
 *  const fetcher = ()=> xxxService.fetchData();
 *  <GeneralTable tid="xxxId" fetchFn={fetcher} columns={yourColumnsDef} />
 *
 * ####################################################
 * @param {import('./type').Props} props
 */
function GeneralTable(props) {
  const { state, settings } = useConcent({ module: 'GeneralTable', setup, props });
  const {
    tid,
    columns,
    rowKey = 'id',
    scroll = { x: '100%' },
    hasMoreMode = false,
    disableBtnWhenNoMore,
    hasTopPagination = false,
    getColumns,
    noTableHead = false,
  } = props;
  const { list, loading, current, total, pageSize, hasMore } = state.meta[tid];
  const { handelPageSizeChange, handlePageCurrentChange, handleNextPage, pageSizeOptions } = settings;

  const renderBtn = () => {
    if (disableBtnWhenNoMore && !hasMore)
      return (
        <Button disabled style={{ width: '100%' }}>
          没有更多了
        </Button>
      );
    return (
      <Button onClick={handleNextPage} style={{ width: '100%' }}>
        加载更多
      </Button>
    );
  };

  // console.log(`%c@@@ GeneralTable ${props.tid}`, 'color:red;border:1px solid red;');
  const uiPagination = (
    <Pagination
      onShowSizeChange={handelPageSizeChange}
      onChange={handlePageCurrentChange}
      current={current}
      total={total}
      showSizeChanger
      pageSizeOptions={pageSizeOptions}
      pageSize={parseInt(pageSize, 10)}
      style={{ paddingRight: '20px', float: 'right' }}
    />
  );
  const columnsVar = getColumns ? getColumns({ uiPagination, hasTopPagination, total }) : columns;
  const TableComp = noTableHead ? NoHeadTable : Table;

  return (
    <Fragment>
      <TableComp rowKey={rowKey} columns={columnsVar} dataSource={list} loading={loading} pagination={false} scroll={scroll} />
      <div style={{ height: '19px', width: '100%' }} />
      {hasMoreMode ? renderBtn() : uiPagination}
    </Fragment>
  );
}

export default React.memo(GeneralTable);
