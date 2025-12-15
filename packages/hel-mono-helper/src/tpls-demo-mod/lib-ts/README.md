## desc

hel 微模块包`ts`模板

## 发布

发布集 `npm包`、`hel浏览器包`、`hel服务端包` 3种模式为一体的包体

```bash
pnpm run build:nbsm
pnpm publish
```

仅发布传统 npm 包

```bash
pnpm run build:npm
pnpm publish
```

> 注意：需要使用 pnpm 来发布

## 其他设置

### 只构建 npm 包和 hel 浏览器包

在 `package.json` 的 `scripts` 如下语句：

```ts
"build:nb": "pnpm run build:hel && pnpm run build:npm",
"build:nbm": "cross-env-shell \"pnpm run build:nb && pnpm run build:meta\"",
```

`build:nbm` 表示除了构建包体，还要生成 meta

> 注意：build:hel 和 build:npm 顺序不可调换

### 只构建 npm 包和 hel 服务端包

在 `package.json` 的 `scripts` 如下语句

```ts
"build:ns": "pnpm run build:hels && pnpm run build:npm",
"build:nsm": "cross-env-shell \"pnpm run build:ns && pnpm run build:meta\"",
```

`build:nsm` 表示除了构建包体，还要生成 meta

> 注意：build:hels 和 build:npm 顺序不可调换
