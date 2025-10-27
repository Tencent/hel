module.exports = (api) => {
  const isTest = api.env('test');

  // 根据jest设置的环境变量来返回对应配置项
  if (isTest) {
    return {
      presets: ['@babel/preset-env', 'react-app'],
    };
  }
  return {
    presets: ['react-app'],
  };
};
