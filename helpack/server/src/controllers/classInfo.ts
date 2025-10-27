import bizCst from 'at/configs/biz';
import { TController } from 'at/types';
import { isLocal } from 'at/utils/deploy';
import regs from 'at/utils/regs';
import { genNonceStr } from 'at/utils/str';
import { checkCommonNonce } from 'controllers/share/app';
import { lockLogic } from 'controllers/share/lock';

export const getClassInfoList: TController = async (ctx) => {
  checkCommonNonce(ctx.query);
  if (isLocal()) {
    return [];
  }
  const list = await ctx.services.classInfo.getList({}, { page: 0, size: 1000 });
  return list;
};

export const getFullClassInfoById: TController = async (ctx) => {
  checkCommonNonce(ctx.query);
  const fullClassInfo = await ctx.services.classInfo.getFullClassInfoById(ctx.query.id);
  if (!fullClassInfo) {
    throw new Error(`class info not found for ${ctx.query.id}`);
  }
  return fullClassInfo;
};

export const createClassInfo: TController = async (ctx) => {
  checkCommonNonce(ctx.query);
  const userName = ctx.pipes.getRtxName();
  const { key, name } = ctx.body;
  if (!name || !key) {
    throw new Error('无分类名称或key');
  }
  if (!regs.letterOrNum.test(key)) {
    throw new Error('分类key只能是英文、数字、下划线、横向的任意组合');
  }
  await lockLogic('createClassInfo', `${userName}_${key}`);

  const userExtendData = await ctx.services.app.getUserExtendData(userName);
  const matchedList = await ctx.services.classInfo.getList({ create_by: userName });
  const createClassLimit = userExtendData.extend_info.createClassLimit;
  if (matchedList.length >= createClassLimit) {
    throw new Error(`你已达到分类创建上限${createClassLimit}个，请联系${bizCst.HEL_OWNER}帮忙修改上限值`);
  }

  const toAdd = { class_key: key, class_label: name, create_by: userName, class_token: `hel-${genNonceStr(16)}-${Date.now()}` };
  const result = await ctx.dao.classInfo.add(toAdd);
  const { class_token, ...rest } = result.objJson;
  return { ...rest, class_token: '' };
};

export const updateClassInfo: TController = async (ctx) => {
  checkCommonNonce(ctx.query);
  const { key, name } = ctx.body;
  const toUpdate = { class_label: name, update_by: ctx.pipes.getRtxName() };
  const classInfoResult = await ctx.dao.classInfo.update(toUpdate, { class_key: key });
  const appResult = await ctx.dao.subApp.update({ class_name: name }, { class_key: key });
  return { classInfoUpdate: classInfoResult[0], appUpdate: appResult[0] };
};
