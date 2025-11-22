export const CODES = {
  /** 未分配具体 code 的错误码 */
  UNASSIGNED_ERR: -1,
  /** 响应正常 */
  OK: 0,
  /** 应用为查询到 */
  APP_NOT_FOUND: 20000,
};

export const CODE_TO_MSG = {
  [CODES.APP_NOT_FOUND]: 'app not found',
  [CODES.OK]: 'success',
  [CODES.UNASSIGNED_ERR]: 'internal logic error',
};
