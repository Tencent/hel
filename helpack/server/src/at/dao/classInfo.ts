import { models } from 'at/models';
import { IClassInfo } from 'at/types/domain';
import { buildDao } from './util/buildDao';

export const { count, get, getOne, add, update, del } = buildDao<IClassInfo>(models.classInfo);
