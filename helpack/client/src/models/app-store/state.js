/** @typedef {import('types/domain').SubApp} SubApp */
import { lsKeys } from 'configs/constant';

export function getInitialState() {
  return {
    /** @type {'prod'|'test'|'all'} */
    listMode: localStorage.getItem(lsKeys.LIST_MODE) || 'prod',
    searchType: 'name',
    searchStr: '',
    searchUser: '',
    classKey: '-10000',
    isVerTabOpen: false,
    needRefresh: false,
    loading: false,
    btnLoading: false,
    page: 1,
    total: 0,
    size: 20,
    /** @type SubApp[] */
    subApps: [],
    /** @type {{[name:string]: SubApp & {_loading:boolean, _star:boolean}}} */
    name2SubApp: {},
    allClassInfoList: [],
  };
}

export default getInitialState;
