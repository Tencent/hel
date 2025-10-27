import path from 'path';

export const TMP_COS_FILES_DIR = path.resolve(__dirname, '../../../public/tmp-cos-files');

/** tnfe 的 cos 业务域名 */
export const TNFE_COS_BASE_URL = 'https://tnfe.gtimg.com';

/** helpack 内置资源的存储路径统一前缀 */
export const ASSET_WEB_DIR = `${TNFE_COS_BASE_URL}/hel`;

export const TNFE_COS_BUCKET = 'tnfe';
