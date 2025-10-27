export default {
  // 使用 get 语法，确保每次调用都生成新的正则表达式
  get url() {
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/;
  },
  /** 只能是大小写字母、数字、中横线、下横线 的组合 */
  get letterOrNum() {
    return /^[A-Za-z0-9|_|-]+$/;
  },
  /** 只能是大小写字母、数字、中横线、下横线、汉字 的组合 */
  get letterNumOrCn() {
    return /^[\u4e00-\u9fa5A-Za-z0-9-|_]+$/;
  },
};
