import { models } from 'at/models';
import type { IHMNStat } from 'at/types/domain';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['extra'];
const key2DefaultObj = { extra: {} };

export const { count, get, getAndCount, getOne, add, update, del } = buildDao<IHMNStat>(models.HMNStat, {
  jsonStrKeys,
  key2DefaultObj,
  defaultGetOrder: [['create_at', 'DESC']],
});
