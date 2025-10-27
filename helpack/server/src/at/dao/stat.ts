import { models } from 'at/models';
import type { IStat } from 'at/types/domain';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['data'];
const key2DefaultObj = {
  data: {},
};

export const { count, get, getOne, add, update, del } = buildDao<IStat>(models.stat, { jsonStrKeys, key2DefaultObj });
