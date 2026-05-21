---
sidebar_position: 5
---

# hel 命令行
与 `hel-mono` 工程可互动的命令行如下：

```bash
#  build hel mod with legacy mode
hel build <mod-name-or-dir>

# build hel mod with micro-module mode
hel build <mod-name-or-dir>:hel

# create a hel app
hel create <dir-name>                

# create a hel app with type (Default:react-app)
hel create <dir-name> -t <type>

# create a hel app with package name
hel create <dir-name> -n <name>

# create a hel app with alias
hel create <dir-name> -a <alias>

# create a hel mod, mod name is the same as directory name
hel create-mod <dir-name>

# create a hel mod with type (Default:ts-lib)
hel create-mod <dir-name> -t <type>

# create a hel mod with package name
hel create-mod <dir-name> -n <package-name>

# create a hel mod with alias, tsconfig.json will set paths
hel create-mod <dir-name> -a <alias>       

# test hel mod
hel test <mod-name-or-dir>

# test hel mod witch watch mode
hel test-watch <mod-name-or-dir>

# start micro-module dev servers of hel mod deps
hel deps <mod-name-or-dir>     
```

如遇到 `pnpm cli` 缺失问题，可将 
1 `hel create` 换为 `pnpm start .create` 
2 `hel create-mod` 换为 `pnpm start .create-mod` 
3 `hel deps` 换为 `pnpm start .deps` 
