import type { IHelpackMeta, ISimpleVersion } from 'hel-types';
import { SERVER_INFO } from '../base/consts';
import type { IMeta } from '../base/types';
import { xssFilter } from '../base/util';

const { workerId } = SERVER_INFO;

function isHelpackMeta(meta: IMeta): meta is IHelpackMeta {
  const mayHelpackMeta = meta as unknown as IHelpackMeta;
  return !!mayHelpackMeta.app.proj_ver;
}

/**
 * 裁剪hel模块元数据，让预埋到首屏的数据尽可能的小
 */
export function cutHelMeta(fullMeta: IMeta) {
  if (!isHelpackMeta(fullMeta)) {
    return fullMeta;
  }

  const { id, name, app_group_name, proj_ver, online_version, build_version, update_at } = fullMeta.app;
  const { sub_app_name, sub_app_version, src_map, update_at: verUpdateAt, create_at: createAt } = fullMeta.version;
  return {
    app: {
      id,
      name,
      app_group_name,
      proj_ver,
      online_version,
      build_version,
      update_at,
    },
    version: {
      sub_app_name,
      sub_app_version,
      src_map,
      update_at: verUpdateAt,
      create_at: createAt,
      _worker_id: workerId,
    },
  } as unknown as IMeta;
}

export function toCssHtmlStr(cssList: string[]) {
  let cssHtmlStr = '';
  cssList.forEach((url) => {
    cssHtmlStr += `<link href="${xssFilter(url)}" rel="stylesheet">`;
  });
  return cssHtmlStr;
}

/**
 * 从版本里获取到 css 字符串
 */
export function getCssHtmlStr(version: ISimpleVersion) {
  const { headAssetList, bodyAssetList, chunkCssSrcList } = version.src_map;
  const cssList: string[] = [];

  const pushUrl = (url: string) => {
    if (url.endsWith('.css') && !cssList.includes(url)) {
      cssList.push(url);
    }
  };
  const handleAssetItem = (item) => {
    const { append, tag } = item;
    if (!append || !['link', 'staticLink'].includes(tag)) {
      return;
    }

    const url = item.attrs.href;
    if (url.endsWith('.css') && !cssList.includes(url)) {
      cssList.push(url);
    }
  };

  chunkCssSrcList.forEach(pushUrl);
  headAssetList.forEach(handleAssetItem);
  bodyAssetList.forEach(handleAssetItem);

  return toCssHtmlStr(cssList);
}

export function makeModInfo(fullMeta: IMeta) {
  const meta = cutHelMeta(fullMeta);
  const cssHtmlStr = getCssHtmlStr(fullMeta.version);
  const createTime = new Date(meta.version.create_at).getTime();
  return { name: meta.app.name, cssHtmlStr, meta, fullMeta, createTime };
}
