const locationOrigin = window.location.origin;

export const appNameTip = `如设定了【是否在平台底座下渲染】为【是】则应用访问入口会默认是 ${locationOrigin}/{appName}，注：正式应用的名字和组名会保持一致`;
export const appTokenTip = '用于防止他人创建蓝盾流水线时知道你的app名称就可以构建并覆盖你的应用产物，同时也用于区分多个分区的子应用';
export const appGroupNameTip =
  '表示多个app应用是同一种app下不同环境（同一个仓库不同分支不同流水线）的实例， 注：正式应用的名字和组名会保持一致';
export const isTestTip = '一个app组名允许存在一个正式app和多个测试app';
export const isLocalRender =
  '此参数用于控制访问按钮的跳转路径，'
  + `选择【是】访问 ${locationOrigin}/{appName}，选择【否】访问 ${locationOrigin}/page/{appName}`
  + `（支持自定义【应用渲染路径】值来控制选择【否】时的跳转路径）`;
export const appRenderHostTip = '当【是否在平台底座下渲染】为【否】且需要自定义访问路径时，填写此项';
