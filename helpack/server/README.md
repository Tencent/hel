## 本地命令行启动
- npm 脚本启动
```bash
// 编译
npm run build
// 启动编译后代码
npm run start
```

- 配置 launch.json去启动
```
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug-js",
      "program": "${workspaceFolder}/server/build/index.js",
      "env": {
        "NODE_PATH": "${workspaceFolder}/server/build/"
      }
    },
    {
      "name": "debug-ts",
      "type": "node",
      "request": "launch",
      "preLaunchTask": "npm run build",
      "program": "${workspaceFolder}/server/src/index.ts",
      "outFiles": ["${workspaceFolder}/server/build/**/*.js"],
      "env": {
        "NODE_PATH": "${workspaceFolder}/server/build"
      },  
    }
  ]
}
```
