
export interface IReqOptions {
  /**
   * default = true, 是否返回服务器端响应的业务逻辑数据给调用方
   * 服务器完整的返回数据reply形如：{data:any, code:string, msg:string}, 
   * true：返回reply.data
   * false：返回reply,
   */
  returnLogicData: boolean,
  defaultValue: any,
  /**
   * default: true
   * 是否在底层检查
   */
  check: boolean,
}

