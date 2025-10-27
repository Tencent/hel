import { models } from 'at/models';
import * as objUtil from 'at/utils/obj';

export async function get(where, options?: any) {
  const { page = 0, size = 20, order = [['create_at', 'DESC']] } = options || {};

  let rows = await models.subAppVersion.findAll({
    where,
    offset: page * size,
    limit: size,
    raw: true,
    order,
  });
  const rowsParsed = rows as unknown as nsModel.SubAppVersionParsed[];
  rowsParsed.forEach((item, i) => {
    const rawItem = rows[i];
    item.src_map = objUtil.safeParse(rawItem.src_map || '', {
      webDirPath: '',
      headAssetList: [],
      bodyAssetList: [],
      chunkJsSrcList: [],
      chunkCssSrcList: [],
    });
  });
  return rowsParsed;
}

export async function getOne(where, options?: any) {
  const rowsParsed = await get(where, options);
  return rowsParsed[0];
}

function ensureDataCorrect(toAdd: any) {
  const rawData = { ...toAdd };
  ['src_map'].forEach((key) => {
    if (typeof rawData[key] !== 'string') {
      rawData[key] = JSON.stringify(rawData[key]);
    }
  });
  return rawData;
}

export async function update(toUpdate, where?: any) {
  if (objUtil.isNull(where)) {
    throw new Error('miss where while update subAppVersion, it is dangerous!');
  }

  const res = await models.subAppInfo.update(toUpdate, { where });
  return res;
}

export async function add(toAdd: Partial<nsModel.SubAppVersionParsed>) {
  const res = await models.subAppVersion.create(ensureDataCorrect(toAdd));
  return res;
}

export async function bulkAdd(toAdds: Array<Partial<nsModel.SubAppVersionParsed>>) {
  const list = toAdds.map((item) => ensureDataCorrect(item));
  const res = await models.subAppVersion.bulkCreate(list);
  return res;
}

export async function count(where) {
  const countVal = await models.subAppVersion.count({ where });
  return countVal;
}
