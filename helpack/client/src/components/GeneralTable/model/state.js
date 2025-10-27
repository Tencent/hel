export function getInitMetaData(hasMoreMode = false, pageSize = 50) {
  return {
    lockId: 'init_lock', // 用于控制多个fetcher刷新同一个表格时，总是只认最近调用的那一个返回的数据
    /** 是否处于 hasMore 模式 */
    hasMoreMode,
    hasMore: true,
    current: 1,
    pageSize,
    total: 0,
    list: [
      // {
      //   coral_uid: "805504571",
      //   created_at: "2019-08-16 15:22:12",
      //   created_by: "",
      //   id: 8,
      //   status: 1,
      //   uid: "369770643",
      //   updated_at: "2019-08-16 15:22:48",
      //   updated_by: "chappiiwu",
      //   user_name: "Being",
      // }
    ],
    loading: false,
  };
}

export default () => ({
  /** @type {Record<string, ReturnType<typeof getInitMetaData>>} */
  meta: {},
});
