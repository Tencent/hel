function hint() {
  console.log(`
    # put any script below to your package.json
    "start": "node ../../dev/root-scripts/executeStart",

    # raw webpack start
    "start:raw": "node ../../dev/scripts/start.js",

    # start app and its deps with hel micro module mode
    "start:hel": "node ../../dev/scripts/hel/start.js",

    # only start app's deps with hel micro module mode
    "start:deps": "node ../../dev/scripts/hel/startDeps.js",

    # only start app self with hel micro module mode
    "start:hwl": "node ../../dev/scripts/hel/startWL.js",

    # start app with hel micro module mode, and fetch its deps as remote hel module
    "start:hwr": "node ../../dev/scripts/hel/startWR.js",
  
    # start app's external server in app self
    "start:helex": "node ../../dev/scripts/hel/startEX.js",

    # start app's external server in another app
    "start:helexs": "node ../../dev/scripts/hel/startEXS",

    # hint help info
    "hint": "node ../../dev/scripts/hel/hint.js",

    # build sub module as npm package
    "build": "pnpm run build:npm",

    # build app as hel micro module mode
    "build:hel": "node ../../dev/scripts/hel/build.js",

    # use build:hel command execution result to create hel-meta.json
    "build:meta": "node ../../dev/scripts/hel/meta",

    # combine build:hel and build:meta together
    "build:helm": "cross-env-shell \"pnpm run build:hel && pnpm run build:meta\"",

    # build sub module as hel server module
    "build:hels": "node ../../dev/scripts/hel/buildS",

    # build sub module as hel browser&server module
    "build:helbs": "node ../../dev/scripts/hel/buildBS",

    # build app&module external assets in app&module self
    "build:helex": "node ../../dev/scripts/hel/buildEX",

    # use build:helex command execution result to create hel-meta.json
    "build:metaex": "node ../../dev/scripts/hel/metaEX",

    # combine build:helex and build:metaex together
    "build:helexm": "cross-env-shell \"pnpm run build:helex && pnpm run build:metaex\"",

    # build app&module external assets in another app
    "build:helexs": "node ../../dev/scripts/hel/buildEXS",

    # combine build:npm and build:helbs together
    "build:nbs": "pnpm run build:npm && pnpm run build:helbs",

    # combine build:nbs and build:meta together
    "build:nbsm": "cross-env-shell \"pnpm run build:nbs && pnpm run build:meta\"",

    # build npm module with tsup
    "build:npm": "tsup",

    # build npm module with tsc
    "tsc": "tsc --project ./tsconfig.build.json && tsc-alias -p ./tsconfig.json ",

    # run jest test and wait for change
    "test": "node ../../dev/scripts/test --config ../../dev/config/jest/jest.config.js",

    # run jest test once
    "test:once": "cross-env ONCE=1 node ../../dev/scripts/test --config ../../dev/config/jest/jest.config.js"
  `);
}

module.exports = {
  hint,
};
