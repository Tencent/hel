const path = require('path');
const { rmDirRecursive, copyDirRecursive, copyFile, clearDir } = require('./utils/fileOps.js');

// 定义路径
const sourceDist = path.resolve(__dirname, '../hel_dist');
const targetDir = path.resolve(__dirname, '../../server-ts/public/web-app/app-manager');
const targetIndexHtml = path.resolve(__dirname, '../../server-ts/src/views/index.html');

// 执行构建操作
function buildLocal() {
  try {
    console.log('开始执行本地构建...');
    
    // 清空目标目录
    console.log(`清空目录: ${targetDir}`);
    clearDir(targetDir);
    
    // 复制整个目录内容
    console.log(`复制目录: ${sourceDist} -> ${targetDir}`);
    copyDirRecursive(sourceDist, targetDir);
    
    // 复制 index.html 到 views 目录
    const sourceIndexHtml = path.join(sourceDist, 'index.html');
    console.log(`复制文件: ${sourceIndexHtml} -> ${targetIndexHtml}`);
    copyFile(sourceIndexHtml, targetIndexHtml);
    
    console.log('本地构建完成!');
  } catch (error) {
    console.error('构建过程中出现错误:', error);
    process.exit(1);
  }
}

buildLocal();