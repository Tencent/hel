/**
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  // 搜索文件目录的路径列表
  roots: ['<rootDir>'],
  // 收集测试覆盖率的匹配文件规则集合，!代表排除的文件
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  // 设置要使用的测试环境
  setupFiles: [],
  // 设置测试环境完毕之后执行的一些脚本，这里执行enzyme的初始化和适配
  // setupFilesAfterEnv: ['<rootDir>/test/testSetup.ts'],
  // 运行测试文件的目录规则，在src的同级目录test下，或者src目录下的__tests__目录下，或者src目录下spec,test后缀的文件
  testMatch: ['<rootDir>/test/api/*.{ts,tsx}'],
  testEnvironment: 'node',
  transform: {
    // "\\.[jt]sx?$": "babel-jest",
    // '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/config/jest/babelTransform.js',
    // '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  // 配置忽略文件的规则
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/setupProxy.js'],
  // 模块别名设置，解析模块时要搜索的其他位置的绝对路径
  modulePaths: ['<rootDir>/src'],
  // modulePaths: [],
  // 模块别名映射，用于解析时文件查找
  moduleNameMapper: {},
  // 用于查找的文件扩展名集合
  moduleFileExtensions: ['js', 'ts', 'json'],
  // 文件变更监视插件
  watchPlugins: [],
  // 测试报告处理器
  reporters: ['default'],
  // 开启覆盖率收集
  collectCoverage: true,
  resetMocks: true,
  testMatch: [
    '<rootDir>/test/**/*.test.ts',
    // '<rootDir>/test/import-sub-path.test.ts',
    // '<rootDir>/test/import-mod-one-level-dir.test.ts',
    // '<rootDir>/test/t-404-files/*.test.ts',
    // '<rootDir>/test/t-no-srv-files/*.test.ts',
    // '<rootDir>/test/native-import.test.ts',
    // '<rootDir>/test/native-import-load-earlier.test.ts',
    // '<rootDir>/test/native-stable-require.test.ts',
    // '<rootDir>/test/native-require.test.ts',
    // '<rootDir>/test/preload-404-mod.test.ts',
    // '<rootDir>/test/map-self.test.ts',
    // '<rootDir>/test/map-node-mod.test.ts',
    // '<rootDir>/test/set-hel-modules-dir.test.ts',
    // '<rootDir>/test/write-index-content.test.ts',
    // '<rootDir>/test/require-mod.test.ts',
    // '<rootDir>/test/import-from-helpack.test.ts',
    // '<rootDir>/test/import-mod.test.ts',
  ],
};
