import bizConst from 'at/configs/biz';
import { inner as userInner } from 'controllers/user';
import * as appSrv from 'services/app';
import * as classInfoSrv from 'services/classInfo';

const { HEL_OWNER } = bizConst;

export function checkUserName(rtxName: string) {
  const userData = userInner.getUser(rtxName);
  if (!rtxName) {
    throw new Error('missing rtxName');
  }
  if (!userData) {
    throw new Error(`user [${rtxName}] invalid`);
  }
}

export async function checkClassData(classKey: string, options?: { checkAppLimit?: boolean }) {
  if (!classKey) {
    throw new Error('missing classKey');
  }
  const info = await classInfoSrv.getByKey(classKey, false);
  if (!info) {
    throw new Error(`classKey [${classKey}] not found`);
  }
  const { create_app_limit, enable_openapi } = info;

  const { checkAppLimit } = options || {};
  if (checkAppLimit) {
    const appCount = await appSrv.countAppByKey(classKey);
    if (appCount >= create_app_limit) {
      throw new Error(
        `create app exceed limit ${create_app_limit} (current ${appCount}), please contact ${HEL_OWNER} to increase limit value.`,
      );
    }
  }
  if (!enable_openapi) {
    throw new Error(`calling sdk for current class [${classKey}] is forbidden, please contact ${HEL_OWNER} to enable it.`);
  }

  return info;
}
