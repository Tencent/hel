/* eslint-disable camelcase */
import { models } from 'at/models';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['extend_info', 'star_info', 'visit_info', 'mark_info'];

const key2DefaultObj = {
  extend_info: { createAppLimit: 10 },
  star_info: { appNames: [] },
  visit_info: { appNames: [] },
  mark_info: { markedList: [] },
};

export const { count, get, getOne, add, del, update } = buildDao<nsModel.UserExtendParsed>(models.userExtend, {
  jsonStrKeys,
  key2DefaultObj,
  buildUpdateWhere(toUpdate: any) {
    const updateWhere: xc.Dict = {};
    if (toUpdate.id) updateWhere.id = toUpdate.id;
    if (toUpdate.rtx_name) updateWhere.rtx_name = toUpdate.rtx_name;
    return updateWhere;
  },
  modelLabel: 'userExtend',
});
