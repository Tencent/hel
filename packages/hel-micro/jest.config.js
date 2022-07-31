// jest --updateSnapshot 或 jest -u 更新快照

const dirName = __dirname;
console.log(dirName);

module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  // 搜索文件目录的路径列表
  roots: ['<rootDir>'],
  // 收集测试覆盖率的匹配文件规则集合，!代表排除的文件
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  // 设置要使用的测试环境
  setupFiles: [],
  // 设置测试环境完毕之后执行的一些脚本，这里执行enzyme的初始化和适配
  setupFilesAfterEnv: [
    '<rootDir>/test/testSetup.ts',
  ],
  // 运行测试文件的目录规则，在src的同级目录test下，或者src目录下的__tests__目录下，或者src目录下spec,test后缀的文件
  testMatch: [
    '<rootDir>/test/api/*.{ts,tsx}',
  ],
  testEnvironment: 'node',
  transform: {
    // '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/config/jest/babelTransform.js',
    // '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  // 配置忽略文件的规则
  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
    '<rootDir>/src/setupProxy.js',
  ],
  // 模块别名设置，解析模块时要搜索的其他位置的绝对路径
  modulePaths: ['<rootDir>/src'],
  // modulePaths: [],
  // 模块别名映射，用于解析时文件查找
  moduleNameMapper: {
  },
  // 用于查找的文件扩展名集合
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx'],
  // moduleFileExtensions: ["web.js", "js", "web.ts", "ts", "web.tsx", "tsx", "json", "web.jsx", "jsx", "node"],
  // 文件变更监视插件
  watchPlugins: [
    // 'jest-watch-typeahead/filename',
    // 'jest-watch-typeahead/testname',
  ],
  // 测试报告处理器
  reporters: ['default'],
  // 开启覆盖率收集
  collectCoverage: true,
  resetMocks: true,
};
