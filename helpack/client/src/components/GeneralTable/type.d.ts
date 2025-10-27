
export interface FetchFnParams {
  current: number,
  pageSize: number,
}


export type FetchFn = (params: FetchFnParams)
  => Promise<{ pageList: any[], total: number } | { page_list: any[], total: number }>;


export interface Props {
  tid: string;
  columns: any[];
  /** 存在 getColumns 则优先调用 getColumns 生成 columns，不存在再使用 props.columns */
  getColumns?: (tableCtx: any) => any[];
  /** 默认 id，表格行数据的唯一标识 */
  rowKey?: string;
  /** 默认 false，表格顶部是否有翻页，需配合 getColumns 觉得何时该渲染 */
  hasTopPagination?: boolean;
  /** 默认 false，是否处于 hasMore 模式 */
  hasMoreMode?: boolean;
  /** 默认 false，当 hasMore 为true时，如果没有了更多数据，是否禁用加载更多按钮 */
  disableBtnWhenNoMore?: boolean;
  size?: 'small' | 'middle' | 'large';
  scroll?: { x?: string, y?: string };
  /** 默认 ['50', '100', '200'] */
  pageSizeOptions?: string[];
  fetchFn: FetchFn;
  /** 默认true，是否组件初次挂载完毕就执行一次 fetchFn */
  fetchAfterMounted?: boolean;
  /** default: false, true：无表头 */
  noTableHead?: boolean;
}
