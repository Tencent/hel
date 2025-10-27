import { models } from 'at/models';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['mark_info'];
const key2DefaultObj = {
  mark_info: { markedList: [] },
};

export const { count, get, getOne, add, bulkAdd, del, update } = buildDao<nsModel.SubAppGlobalParsed>(models.subAppGlobal, {
  jsonStrKeys,
  key2DefaultObj,
  buildUpdateWhere(toUpdate: any) {
    const updateWhere: xc.Dict = {};
    if (toUpdate.id) updateWhere.id = toUpdate.id;
    if (toUpdate.name) updateWhere.name = toUpdate.name;
    return updateWhere;
  },
  defaultGetOrder: [['ctime', 'DESC']],
  modelLabel: 'subAppGlobal',
});
