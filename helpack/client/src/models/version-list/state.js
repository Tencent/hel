/** @typedef {import('types/domain').SubApp} SubApp */

export function getInitialState() {
  // 本地开发模式设置默认为 all，方便后本地的后台能够接口模拟通
  // const listMode = window.location.port ? 'all' : 'tag';
  const listMode = 'all';

  return {
    /** @type { 'all' | 'tag' } */
    listMode,
    /** @type { SubApp } */
    subApp: {},
    /** @type { Array<{ver: string, desc: string, userName: string, time: number}> } */
    globalMarkedList: [],
    pageList: [],
    total: 0,
    markTotal: 0,
    buildTotal: 0,
    showInput: false,
    /** @type { 'online' | 'gray' } */
    changeMode: 'online',
    inputVersion: '',
    updateLoading: false,
    grayBtnLoading: false,
    projVerAreaLoading: false,
  };
}

export default getInitialState;
