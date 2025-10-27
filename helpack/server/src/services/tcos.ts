export interface IUploadOptions {
  cosBucket: string;
  cdnHost: string;
  objKey: string;
  /** 重试次数 */
  retry?: number;
}

// TODO 已移除原始实现，待用户去真正实现
export async function uploadFile(localFilePath, options: IUploadOptions) {
  console.log(`to be implement by user, upload file ${localFilePath}`);
  const fileWebPath = `https://xxx-cdn/file/your-firl`;
  return fileWebPath;
}
