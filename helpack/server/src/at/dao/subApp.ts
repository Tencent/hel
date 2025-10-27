import { models } from 'at/models';
import * as objUtil from 'at/utils/obj';
import { Op } from 'sequelize';

export async function count(queryOptions?: any) {
  const { where = {} } = queryOptions || {};
  const data = await models.subAppInfo.count({ where });
  return data;
}

export async function get(where, options?: any): Promise<nsModel.SubAppInfoParsed[]> {
  const { page = 0, size = 20, order = [['update_at', 'DESC']] } = options || {};
  const whereCopy = { ...where };
  Object.keys(where).forEach((key) => {
    // 转义模糊匹配语法
    const value = where[key];
    if (typeof value === 'string' && value.startsWith('%%') && value.endsWith('%%')) {
      whereCopy[key] = {
        [Op.substring]: value.substr(2, value.length - 2),
      };
    }
  });

  const rows = await models.subAppInfo.findAll({
    where: whereCopy,
    offset: page * size,
    limit: size,
    raw: true,
    order,
  });
  const rowsParsed = rows as unknown as nsModel.SubAppInfoParsed[];
  rowsParsed.forEach((itemParsed, idx) => {
    const itemRaw = rows[idx];
    itemParsed.gray_users = objUtil.safeParse(itemRaw.gray_users || '', []);
    itemParsed.owners = objUtil.safeParse(itemRaw.owners || '', []);
    itemParsed.additional_scripts = objUtil.safeParse(itemRaw.additional_scripts || '', []);
    itemParsed.additional_body_scripts = objUtil.safeParse(itemRaw.additional_body_scripts || '', []);
    itemParsed.proj_ver = objUtil.safeParse(itemRaw.proj_ver || '', { map: {}, utime: 0 });
  });
  return rowsParsed;
}

export async function getOne(where, options?: any): Promise<nsModel.SubAppInfoParsed | null> {
  const apps = await get(where, options);
  return apps[0];
}

function ensureDataCorrect(toAdd: any) {
  const rawData = { ...toAdd };
  ['gray_users', 'owners', 'additional_scripts', 'additional_body_scripts', 'proj_ver'].forEach((key) => {
    const val = rawData[key];
    const valType = typeof val;
    if (objUtil.isNull(val) || valType === 'number' || valType === 'boolean') {
      Reflect.deleteProperty(rawData, key);
    } else if (valType !== 'string') {
      rawData[key] = JSON.stringify(val);
    }
  });
  return rawData;
}

export async function del(appName: string) {
  const res = await models.subAppInfo.destroy({ where: { name: appName } });
  return res;
}

export async function add(toAdd: Partial<nsModel.SubAppInfoParsed>) {
  const res = await models.subAppInfo.create(ensureDataCorrect(toAdd));
  return res;
}

export async function bulkAdd(toAdds: Array<Partial<nsModel.SubAppInfoParsed>>) {
  const list = toAdds.map((item) => ensureDataCorrect(item));
  const res = await models.subAppInfo.bulkCreate(list);
  return res;
}

export async function update(toUpdate, where?: any) {
  let updateWhere = where;
  if (!where) {
    updateWhere = {};
    if (toUpdate.id) updateWhere.id = toUpdate.id;
    if (toUpdate.name) updateWhere.name = toUpdate.name;
  }
  const safeToUpdate = ensureDataCorrect(toUpdate);

  if (objUtil.isNull(updateWhere)) {
    throw new Error('miss updateWhere while update subApp, it is dangerous!');
  }

  const res = await models.subAppInfo.update(safeToUpdate, { where: updateWhere });
  return res;
}
