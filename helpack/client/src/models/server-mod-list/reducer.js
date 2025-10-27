/* eslint-disable no-unused-vars */
/** @typedef {import('components/GeneralTable/type').FetchFnParams} FetchFnParams */
/** @typedef {ReturnType<import('./state').default>} St */
/** @typedef {Partial<St>} ReturnSt */
/** @typedef {import('types/store').AC<'VersionList'>} AC */
import { message } from 'antd';
import { evNames } from 'components/GeneralTable';
import { emit } from 'concent';
import * as serverModSrv from 'services/serverMod';

const inner = {
  refreshTableCurPage() {
    emit([evNames.refreshTableCurPage, 'smTable']);
  },
  refreshTable() {
    emit([evNames.refreshTable, 'smTable']);
  },
};

export async function refreshTableCurPage() {
  inner.refreshTableCurPage();
}

export async function fetchDataList(/** @type FetchFnParams */ payload, /** @type St */ m) {
  try {
    const { subAppName } = m;
    const { current, pageSize } = payload;
    const { list, count } = await serverModSrv.getServerModStatList(subAppName, current, pageSize);

    return { total: count, pageList: list };
  } catch (err) {
    message.error(err.message);
    return { total: 0, pageList: [] };
  }
}

/**
 * @returns {ReturnSt}
 */
export function clear() {
  return { subAppName: '', inputVersion: '', showInput: false };
}

export async function changeListMode(listMode, /** @type St */ m, /** @type AC*/ ac) {
  await ac.setState({ listMode });
  inner.refreshTable();
}
