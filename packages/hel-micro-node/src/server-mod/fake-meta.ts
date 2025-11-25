import type { IMeta } from 'hel-types';

export function makeMeta(platform: string, helModName: string, customVer?: string): IMeta {
  const ver = customVer || `${Date.now()}`;
  return {
    app: {
      name: helModName,
      app_group_name: helModName,
      online_version: '',
      build_version: '',
      git_repo_url: '',
      create_at: '',
      platform,
    },
    version: {
      plugin_ver: '',
      extract_mode: 'build',
      sub_app_name: helModName,
      sub_app_version: ver,
      version_tag: ver,
      src_map: {
        htmlIndexSrc: '',
        webDirPath: '',
        headAssetList: [],
        bodyAssetList: [],
        chunkJsSrcList: [],
        chunkCssSrcList: [],
        staticJsSrcList: [],
        staticCssSrcList: [],
        relativeJsSrcList: [],
        relativeCssSrcList: [],
        otherSrcList: [],
        srvModSrcList: ['http://fake-meta/index.js'],
        srvModSrcIndex: '',
      },
      html_content: '',
      create_at: '',
      desc: 'this is a fake hel meta',
    },
  };
}
