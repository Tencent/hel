import { models } from 'at/models';
import type { IStatDist } from 'at/types/domain';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['data'];
const key2DefaultObj = {
  data: {},
};

export const { count, get, getOne, add, update, del } = buildDao<IStatDist>(models.statDist, { jsonStrKeys, key2DefaultObj });
