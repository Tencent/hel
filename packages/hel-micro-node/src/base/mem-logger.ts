interface ILog {
  /** 日志类型 */
  type: string;
  /** 日志描述 */
  desc: string;
  /** 日志子类型 */
  subType: string;
  /** 对应数据 */
  data: any;
  /** 冗余记录的扩展字段1 */
  f1: string;
  /** 冗余记录的扩展字段2 */
  f2: string;
  /** 日志时间 */
  time: string;
}

/** 日志列表 */
const logs: ILog[] = [];
/** 记录上限 */
const recordLimit = 100;
export interface ILogOptions extends Partial<Omit<ILog, 'type'>> {
  /** 日志类型 */
  type: string;
}

export function recordMemLog(options: ILogOptions) {
  const { type, subType = '', desc = '', data, f1 = '', f2 = '' } = options;
  const item = {
    type,
    subType,
    desc,
    data,
    f1,
    f2,
    time: new Date().toLocaleString(),
  };
  logs.unshift(item);
  if (logs.length > recordLimit) {
    logs.splice(logs.length - 1);
  }
}

export function getMemLogs(options?: { type?: string; subType?: string }) {
  const { type, subType } = options || {};
  let targetLogs = type ? logs.filter((v) => v.type === type) : logs;
  targetLogs = subType ? targetLogs.filter((v) => v.subType === subType) : targetLogs;
  return targetLogs;
}
