const defaultAppName = 'tnews';

// 以下常量由蓝盾流水线注入（由流水线变量或bash脚本注入）
const {
  CMS_APP_HOME_PAGE, // appHomePage, 形如 http://s.inews.gtimg.com/tnews/om_2020121201011666
  CMS_APP_NAME = defaultAppName, // app名称
} = process.env;

const homePage = CMS_APP_HOME_PAGE || `/${defaultAppName}`;

const toExport = {
  /** 构建时注入到应用的APP_NAME下 */
  name: CMS_APP_NAME,
  /**
   * 资源的网络根目录
   * 形如：
   * 1 /web-app/sub-apps/om
   * 2 http://www.cdn.com/xxx/yyy
   */
  homePage,
};

module.exports = toExport;
