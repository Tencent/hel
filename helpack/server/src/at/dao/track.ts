import { models } from 'at/models';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['update_json'];
const key2DefaultObj = {
  update_json: {},
};

export const { count, get, getOne, add, update, del } = buildDao(models.track, { jsonStrKeys, key2DefaultObj });
