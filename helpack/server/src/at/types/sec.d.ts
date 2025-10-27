/** 操作不可申请 */
type OpCanNotBeApplied = 0;
/** 操作可申请 */
type OpCanBeApplied = 1;

// <<<------------------------ 基础类型【start】--------------------------
export interface IUserRight {
  op_command: string,
  op_id: number,
  sec_class: number,
  /** 在敏感权限系统均与xxx_sys开头 */
  op_name: string,
  /** 过期时间，10位长度的时间戳 */
  expire: number,
}


export interface IBuSysOp {
  op_command: string,
  operation_group_id: number,
  right_role_id_list: number[],
  audit_flow_id: number,
  /** 权限级别 */
  sec_class: number,
  operation_about: string,
  operation_id: number,
  dept_role_id_list: number[],
  operation_name: string,
  /** 操作是否可以申请 */
  apply_visible: OpCanNotBeApplied | OpCanBeApplied,
}

export interface IBuSysOpGroup {
  operation_group_name: string,
  operation_group_id: number,
  audit_flow_id: number,
}

export interface IRightListItem {
  /** 权限id */
  operation_id: number,
  /** 安全级别 */
  sec_class: number,
  /** 操作组id */
  operation_group_id: number,
  owner_info: {
    dept_detail: string,
    expr_time: number,
    owner_name: string,
    obtain_time: number,
    department_name: string,
  }
}
// --------------------------- 基础类型【end】-------------------------->>>


export interface ISecResBase {
  status_code: number;
  status_info: number;
}

export interface IGetBase {
  response: ISecResBase;
}


export interface ISecResBuSysOps extends ISecResBase {
  bu_sys_operation_list: IBuSysOp[];
}

export interface IGetBuSysOps {
  response: ISecResBuSysOps
}


export interface ISecResUserOpInfos extends ISecResBase {
  user_rights: IUserRight[];
}

export interface IGetUserOpInfos{
  response: ISecResUserOpInfos;
}


export interface ISecResIBuSysOpGroups extends ISecResBase {
  operation_group_list: IBuSysOpGroup[];
}

export interface IGetBuSysOpGroups{
  response: ISecResIBuSysOpGroups;
}

// 这个接口返回结果没有额外包一层response，所以这里可直接继承ISecResBase
export interface IGetSysUserRightInfos extends ISecResBase{
  right_list: IRightListItem[];
}

declare type defaultExport = {
  IUserRight: IUserRight,
  IBuSysOp: IBuSysOp,
  IBuSysOpGroup: IBuSysOpGroup,
  IRightListItem: IRightListItem,
  ISecResBase: ISecResBase,
  IGetBase: IGetBase,
  ISecResBuSysOps: ISecResBuSysOps,
  IGetBuSysOps: IGetBuSysOps,
  ISecResUserOpInfos: ISecResUserOpInfos,
  IGetUserOpInfos: IGetUserOpInfos,
  ISecResIBuSysOpGroups: ISecResIBuSysOpGroups,
  IGetBuSysOpGroups: IGetBuSysOpGroups,
}

export default defaultExport