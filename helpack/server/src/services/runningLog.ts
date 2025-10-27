import { isProd } from 'at/utils/deploy';

const maxLen = isProd() ? 120 : 500;

export interface IRunningLog {
  type: string;
  subType: string;
  loc: string;
  data: xc.Dict;
}

export interface ILogOptions {
  subType?: string;
  loc?: string;
  data?: xc.Dict;
}

class RunningLog {
  private logs: IRunningLog[] = [];

  public getLogs(type?: string) {
    let logs = this.logs;
    if (type) {
      logs = this.logs.filter((v) => v.type === type);
    }
    return logs;
  }

  public pushLog(type: string, log?: ILogOptions) {
    const { subType = '', loc = '', data = {} } = log || {};
    const logs = this.logs;
    logs.unshift({ type, subType, loc, data });
    if (logs.length > maxLen) {
      logs.splice(maxLen, 1);
    }
  }
}

export const runningLogSrv = new RunningLog();
