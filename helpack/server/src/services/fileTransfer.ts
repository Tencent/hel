import download from '@tmicro/fetch-file';
import { TMP_COS_FILES_DIR, TNFE_COS_BASE_URL, TNFE_COS_BUCKET } from 'at/configs/path';
import { slash } from 'at/utils/str';
import path from 'path';
import { IUploadOptions, uploadFile } from 'services/tcos';

function getFileBasicInfo(homePage: string, assetUrl: string) {
  const pageStrList = homePage.split('/');
  const entryDirName = pageStrList[pageStrList.length - 1]; // xx-app_20230526172318

  let [, relativePathFileName] = assetUrl.split(homePage);
  relativePathFileName = slash.noStart(relativePathFileName); // static/js/xxx.cfb61043.js
  const strList = relativePathFileName.split('/');
  const lastIdx = strList.length - 1;
  const dirNames = strList.filter((str, idx) => idx !== lastIdx);
  const fileName = strList[lastIdx]; // xxx.cfb61043.js

  const kebabCaseDirName = dirNames.join('-');
  const relativePath = dirNames.join('/'); // static/js
  const flatFileName = kebabCaseDirName ? `${kebabCaseDirName}.${fileName}` : fileName;

  return {
    /** xx-app_20230526172318 */
    entryDirName,
    /** static/js */
    relativePath,
    /** xxx.cfb61043.js 原始的文件名 */
    fileName,
    /** static-js.xxx.cfb61043.js，拍平后的路径名拼网络文件名得到的新文件名 */
    flatFileName,
  };
}

function toFileInfoList(homePage: string, assetUrlList: string[]) {
  const [, afterDoubleSlashStr] = homePage.split('//');
  const [, ...restStrList] = afterDoubleSlashStr.split('/');
  const objKeyPrefix = restStrList.join('/');

  return assetUrlList.map((url) => {
    const basicInfo = getFileBasicInfo(homePage, url);
    const { entryDirName, relativePath, fileName, flatFileName } = basicInfo;
    const objKey = path.join(objKeyPrefix, relativePath, fileName);
    const fullPathStoreDir = path.resolve(TMP_COS_FILES_DIR, entryDirName);
    const fullPathFlatFileName = path.resolve(fullPathStoreDir, flatFileName);
    return { ...basicInfo, objKey, originalUrl: url, fullPathStoreDir, fullPathFlatFileName };
  });
}

/**
 * 转存用户的资源到 helpack 内置的 cdn 上
 * @param homePage - 形如 https://tnfe.gtimg.com/hel/xxapp_20230526172318
 * @param assetUrlList
 */
export async function transferWebFiles(homePage: string, assetUrlList: string[]) {
  const start = Date.now();
  const fileInfoList = toFileInfoList(homePage, assetUrlList);

  // start download
  await Promise.all(
    fileInfoList.map(async (item) => {
      const { originalUrl, fullPathStoreDir, flatFileName } = item;
      try {
        await download(originalUrl, fullPathStoreDir, { filename: flatFileName });
      } catch (err) {
        throw new Error(`download ${originalUrl} error: ${err.message}`);
      }
    }),
  );

  // start upload
  for (const item of fileInfoList) {
    const options: IUploadOptions = {
      objKey: item.objKey,
      cdnHost: TNFE_COS_BASE_URL,
      cosBucket: TNFE_COS_BUCKET,
      retry: 2, // 设置上传最多上传 2 次，即失败 1 次再上传 1 次
    };
    await uploadFile(item.fullPathFlatFileName, options); // 刻意串行，降低出错概率
  }
}
