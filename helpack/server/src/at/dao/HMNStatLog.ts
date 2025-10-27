import { models } from 'at/models';
import type { IHMNStatLog } from 'at/types/domain';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['extra'];
const key2DefaultObj = { extra: {} };

export const { get, getOne, getAndCount, add, update } = buildDao<IHMNStatLog>(models.HMNStatLog, {
  jsonStrKeys,
  key2DefaultObj,
  defaultGetOrder: [['create_at', 'DESC']],
});
