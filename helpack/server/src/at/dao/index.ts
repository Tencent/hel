// export { default as userVisitApp } from './userVisitApp'
import * as allowedApp from './allowedApp';
import * as classInfo from './classInfo';
import * as HMNStat from './HMNStat';
import * as HMNStatLog from './HMNStatLog';
import * as stat from './stat';
import * as statDist from './statDist';
import * as subApp from './subApp';
import * as subAppGlobal from './subAppGlobal';
import * as subAppVersion from './subAppVersion';
import * as track from './track';
import * as uploadCos from './uploadCos';
import * as userExtend from './userExtend';

export default {
  userExtend,
  subAppVersion,
  subAppGlobal,
  subApp,
  track,
  classInfo,
  uploadCos,
  allowedApp,
  stat,
  statDist,
  HMNStat,
  HMNStatLog,
};
