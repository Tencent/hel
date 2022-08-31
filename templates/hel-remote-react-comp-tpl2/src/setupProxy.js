/* eslint-disable */

/**
 *  配置 proxy, 代理到本地启动的mocker服务
 *  这份文件是CRA读取的，不属于项目打包后会包含的代码，所以非ts后缀
*/
const { createProxyMiddleware: proxy } = require('http-proxy-middleware');


function makeProxyConfig(target) {
  return {
    target,
    secure: false,
    changeOrigin: true,
    withCredentials: true,
  };
}


// 如当前组件本地调试时需要发起的请求被代理出去，可配置此文件
module.exports = function (app) {
  app.use(proxy('/somepath', makeProxyConfig('https://xxx.yyy.com')));
};
