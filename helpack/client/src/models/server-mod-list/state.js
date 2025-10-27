/** @typedef {import('types/domain').IServerModStat} IServerModStat */
/** @typedef {import('types/domain').SubApp} SubApp */

export function getInitialState() {
  return {
    /** @type { 'table' | 'card' } */
    listMode: 'card',
    subAppName: '',
    /** @type { IServerModStat[] } */
    pageList: [],
    total: 0,
  };
}

export default getInitialState;
