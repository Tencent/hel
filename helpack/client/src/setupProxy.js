const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const proxyPath = (path, target = 'http://localhost:7777') => {
    app.use(
      path,
      createProxyMiddleware({
        target,
        secure: false,
        changeOrigin: true,
      }),
    );
  };
  proxyPath('/api');
  proxyPath('/openapi');
  proxyPath('/web-app');
};
