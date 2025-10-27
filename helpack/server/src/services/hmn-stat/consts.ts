/** 模板载入模式 */
export const HMN_LOAD_MODE = {
  /** 启动时载入 */
  onInit: '1',
  /** 运行中载入 */
  onRunning: '2',
};

/**
 * 模块结束原因
 */
export const HMN_END_REASON = {
  /** 载入新版本 */
  newVersion: '1',
  /** 客户端关闭 */
  clientClosed: '2',
};
