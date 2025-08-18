import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';
// 因 hash-css-selector 是以 module 形式暴露的，这里不能使用 require，故改为 import 写法
import { generateScopedName } from 'hash-css-selector';

const readFile = util.promisify(fs.readFile);

// in:
// baseSrc: src
// resolveDir: /path/hel-mono/packages/mono-comps/src/components/HelloMono2
// out:
// components/HelloMono2
function getPathPrefix(baseSrc, resolveDir) {
  return resolveDir.split(`${path.sep}${baseSrc}${path.sep}`)[1];
}

function getCssClassName(options) {
  const { scopePrefix, className, filename, css } = options;
  const scope = generateScopedName(className, `${filename}+${css}`);
  const name = `${scope}_${className}`;
  if (scopePrefix) {
    return `${scopePrefix}_${name}`;
  }

  return name;
}

function pureScopePrefix(scopePrefix) {
  let result = scopePrefix;
  if (result.includes('/')) {
    result = result.replace(/\//g, '_');
  }
  if (result.includes('@')) {
    result = result.replace(/@/g, '');
  }
  result = result.replace(/-/g, '_');
  return result;
}

// moduleCss factory
export function moduleCss(options) {
  const { baseSrc = 'src', moduleCssScopePrefix = '' } = options || {};
  let scopePrefix = moduleCssScopePrefix;
  scopePrefix = pureScopePrefix(scopePrefix);

  return {
    name: "module-css",
    setup(build) {
      build.onResolve(
        { filter: /\.module\.css$/, namespace: "file" },
        (args) => {
          // args: { path, importer, namespace, resolveDir, kind, pluginData, with }
          const pathDir = path.join(args.resolveDir, args.path);
          const pathPrefix = getPathPrefix(baseSrc, args.resolveDir);
          return {
            // path: `${args.path}#css-module`,
            // 让不同目录的react组件使用了相同的 module.css 文件名时，也能够编译出正确的 css 名称
            path: path.join(pathPrefix, `${args.path}#css-module`),
            namespace: "css-module",
            pluginData: { pathDir },
          };
        },
      );
      build.onLoad(
        { filter: /#css-module$/, namespace: "css-module" },
        async (args) => {
          const { pluginData } = args;
          const source = await readFile(
            pluginData.pathDir,
            "utf8"
          );

          let cssModule = {};
          const result = await postcss([
            postcssModules({
              generateScopedName: (className, filename, css) => getCssClassName({ scopePrefix, className, filename, css }),
              getJSON(_, json) {
                cssModule = json;
              },
            }),
          ]).process(source, { from: pluginData.pathDir });

          return {
            pluginData: { css: result.css },
            contents: `import "${pluginData.pathDir
              }"; export default ${JSON.stringify(cssModule)}`,
          };
        }
      );
      build.onResolve(
        { filter: /\.module\.css$/, namespace: "css-module" },
        (args) => ({
          path: path.join(args.resolveDir, args.path, "#css-module-data"),
          namespace: "css-module",
          pluginData: args.pluginData,
        })
      );
      build.onLoad(
        { filter: /#css-module-data$/, namespace: "css-module" },
        (args) => ({
          contents: args.pluginData.css,
          loader: "css",
        })
      );
    },
  };
}

export default moduleCss;
