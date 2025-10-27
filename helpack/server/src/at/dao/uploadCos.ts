import { models } from 'at/models';
import { IUploadCos } from 'at/types/domain';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['file_web_path', 'upload_result'];
const key2DefaultObj = {
  file_web_path: { pathList: [] },
  upload_result: {
    finished: false,
    uploadedFiles: [],
    pendingFiles: [],
  },
};

export const { count, get, getOne, add, update, del } = buildDao<IUploadCos>(models.uploadCos, {
  jsonStrKeys,
  key2DefaultObj,
  updateEJSAllowMiss: true,
});
