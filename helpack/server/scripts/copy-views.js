/**
 * 用于适配windows下复制views目录
 */
const fs = require('fs');
const path = require('path');

// 递归复制目录
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  // 判断是否是目录
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    // 遍历目录下的文件
    files.forEach((file) => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      // 判断是否是目录
      if (fs.lstatSync(curSource).isDirectory()) {
        // 是目录则递归复制
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        // 是文件则复制
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

// 复制views目录
copyFolderRecursiveSync('./src/views', './build/views');
