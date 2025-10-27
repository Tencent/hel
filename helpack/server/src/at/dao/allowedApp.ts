import { models } from 'at/models';
import type { IAllowedApp } from 'at/types/domain';
import { buildDao } from './util/buildDao';

const jsonStrKeys = ['data'];
const key2DefaultObj = {
  data: { apps: [] },
};

export const { get, getOne, add, update, del } = buildDao<IAllowedApp>(models.allowedApp, { jsonStrKeys, key2DefaultObj });
