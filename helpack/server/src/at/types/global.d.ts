import * as d from './domain';

declare global {

  namespace xc {
    type Dict<T extends any = any> = Record<string, T>;
    type ValueType<T extends Dict> = T[keyof T];
    type Fn<P extends any[] = any[], R extends (any | void) = (any | void)> = (...args: P) => R;
  }

  namespace nsWuwei {
    type SubAppInfo = d.SubAppInfo;

    interface Track {
      id: number;
      schema_id: string;
      update_json: string;
      operator: string;
    }
  }

  namespace nsdb {
    interface DBConfigItem {
      username: string;
      password: string;
      database: string;
      host: string;
      dialect: import('sequelize').Dialect;
      timezone?: string;
      storage?: string;
    }

    interface DBModels {
      sequelize: import('sequelize').Sequelize;
      Sequelize: typeof import('sequelize').Sequelize;
      subAppInfo: typeof import('../models/tSubAppInfo').SubAppInfo;
      subAppGlobal: typeof import('../models/tSubAppGlobal').SubAppGlobal;
      subAppVersion: typeof import('../models/tSubAppVersion').SubAppVersion;
      uploadCos: typeof import('../models/tUploadCosLog').UploadCos;
      userExtend: typeof import('../models/tUserExtend').UserExtend;
      track: typeof import('../models/tTrack').Track;
      classInfo: typeof import('../models/tClassInfo').ClassInfo;
      allowedApp: typeof import('../models/tAllowedApp').AllowedApp;
      stat: typeof import('../models/tStat').Stat;
      statDist: typeof import('../models/tStatDist').StatDist;
      HMNStat: typeof import('../models/tHMNStat').HMNStat;
      HMNStatLog: typeof import('../models/tHMNStatLog').HMNStatLog;
      UserInfo: typeof import('../models/tUserInfo').UserInfo;
    }

    type SubAppInfo = DBModels['subAppInfo'];
    type SubAppVersion = DBModels['subAppVersion'];
    type UploadCos = DBModels['uploadCos'];

  }

  namespace nsReq {
    interface IQuerySubApps {
      page: number;
      size: number;
      where: Record<string, string | number>;
    }
  }

  namespace nsModel {
    interface IAssetItem {
      tag: string;
      attrs: {
        href: string;
        rel: string;
        src: string;
      }
    }

    interface SrcMap {
      /** 新版流水线资源只放到 headAssetList, bodyAssetList */
      headAssetList: IAssetItem[],
      bodyAssetList: IAssetItem[],
    }

    type SubAppInfoRaw = d.SubAppInfoRaw;

    type SubAppInfoParsed = d.SubAppInfoParsed;

    type SubAppVersionRaw = d.SubAppVersionRaw;

    type SubAppVersionParsed = d.SubAppVersionParsed;

    interface UserExtendRaw {
      id: number;
      rtx_name: string;
      extend_info: string;
      star_info: string;
      visit_info: string;
      mark_info: string;
      ctime: string;
      mtime: string;
    }

    type UserExtendParsed = Omit<UserExtendRaw, 'extend_info' | 'star_info' | 'visit_info' | 'mark_info'> & {
      extend_info: { createAppLimit: number, createClassLimit: number };
      star_info: { appNames: string[] };
      visit_info: { appNames: string[] };
      mark_info: { markedList: { name: string, ver: string, desc: string, time: number }[] };
    }

    interface SubAppGlobalRaw {
      id: number;
      name: string;
      mark_info: string;
      ctime: string;
      mtime: string;
    }


    type SubAppGlobalParsed = Omit<SubAppGlobalRaw, 'mark_info'> & {
      mark_info: { markedList: { ver: string, desc: string, userName: string, time: number }[] };
    }

  }

}

export { }
