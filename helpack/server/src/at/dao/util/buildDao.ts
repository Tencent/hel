import * as objUtil from 'at/utils/obj';
import { Order } from 'sequelize';
import { ensureDataJsonObj, ensureDataJsonStr } from './json';

interface IBuildDaoOptions {
  jsonStrKeys?: string[];
  key2DefaultObj?: xc.Dict;
  /** add 时 ensureDataJsonStr 调用设置 allowMiss */
  addEJSAllowMiss?: boolean;
  /** update 时 ensureDataJsonStr 调用设置 allowMiss */
  updateEJSAllowMiss?: boolean;
  defaultGetOrder?: Order;
  modelLabel?: string;
  /**
   * update 未传递 where 时，生成 where 对象的函数
   */
  buildUpdateWhere?: xc.Fn;
  /**
   * default: false
   * true: 执行 update 时允许空 where 对象
   * false: 不允许
   */
  allowUpdateWhereEmpty?: boolean;
}

function getFindOptions(where: any, defaultGetOrder: any, options?: any) {
  const { page = 0, size = 20, order } = options || {};
  const findOptions: xc.Dict = {
    where,
    offset: page * size,
    limit: size,
    raw: true,
  };
  const orderVar = order || defaultGetOrder;
  if (orderVar) {
    findOptions.order = orderVar;
  }

  return findOptions;
}

export function buildDao<T = any>(model: any, options?: IBuildDaoOptions) {
  const {
    jsonStrKeys = [],
    key2DefaultObj = {},
    addEJSAllowMiss = false,
    updateEJSAllowMiss = false,
    defaultGetOrder,
    modelLabel = 'model',
    buildUpdateWhere,
    allowUpdateWhereEmpty = false,
  } = options || {};
  const ensureJsonObj = (item: any) => ensureDataJsonObj(item, { jsonStrKeys, key2DefaultObj });
  const ensureJsonStr = (item: any, allowMiss: boolean) => ensureDataJsonStr(item, { jsonStrKeys, key2DefaultObj, allowMiss });

  const doUpdate = async (allowUpdateWhereEmpty: boolean, toUpdate: any, where?: any) => {
    let whereVar = where;
    if (objUtil.isNull(whereVar) && toUpdate.id) {
      whereVar = { id: toUpdate.id };
    }
    if (objUtil.isNull(whereVar) && buildUpdateWhere) {
      whereVar = buildUpdateWhere(toUpdate);
    }
    if (objUtil.isNull(whereVar) && !allowUpdateWhereEmpty) {
      throw new Error(`missing updateWhere while update ${modelLabel}, it is dangerous!`);
    }

    let target = toUpdate;
    if (jsonStrKeys.length) {
      target = ensureJsonStr({ ...toUpdate }, updateEJSAllowMiss);
    }
    const res = await model.update(target, { where: whereVar });
    return res;
  };

  const dao = {
    async count(where) {
      const countVal = await model.count({ where });
      return countVal;
    },

    async get(where, options?: any) {
      const findOptions = getFindOptions(where, defaultGetOrder, options);
      const rows = await model.findAll(findOptions);
      if (jsonStrKeys.length) {
        rows.forEach(ensureJsonObj);
      }

      return rows as unknown as T[];
    },

    async getAndCount(where, options?: any) {
      const findOptions = getFindOptions(where, defaultGetOrder, options);
      const { count, rows } = await model.findAndCountAll(findOptions);
      if (jsonStrKeys.length) {
        rows.forEach(ensureJsonObj);
      }

      return { rows, count } as { rows: T[]; count: number };
    },

    async getOne(where: any, options?: any): Promise<T | null> {
      const list = await dao.get(where, options);
      const one = list[0];
      return one || null;
    },

    async add(toAdd: any) {
      let target = toAdd;
      if (jsonStrKeys.length) {
        target = ensureJsonStr({ ...toAdd }, addEJSAllowMiss);
      }
      const res = await model.create(target);
      return {
        objModel: res,
        objJson: res.toJSON() as unknown as T,
      };
    },

    async bulkAdd(toAdds: Array<Partial<T>>) {
      const list = toAdds.map((item) => ensureJsonStr(item, addEJSAllowMiss));
      const res = await model.bulkCreate(list);
      return res;
    },

    async update(toUpdate: any, where?: any) {
      await doUpdate(allowUpdateWhereEmpty, toUpdate, where);
    },

    async updateDangerously(toUpdate: any, where?: any) {
      await doUpdate(true, toUpdate, where);
    },

    async del(where: any) {
      const res = await model.destroy({ where });
      return res;
    },
  };

  return dao;
}
