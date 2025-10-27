function ensureModShape(mod) {
  try {
    if (Object.keys(mod).length > 2) {
      if (!mod.default) mod.default = mod;
      return;
    }
    // ['__esModule', 'default']
    const defaultRef = mod.default;
    if (defaultRef) {
      Object.assign(mod, defaultRef);
    }
  } catch (err) {
    console.error('ensureModShape err:', err);
  }
}

function adaptLegacyVueExternal(src) {
  if (!src.endsWith('vue.js')) return;
  const VueMod = window.Vue || window.LEAH_Vue;
  ensureModShape(VueMod);
  window.Vue = VueMod;
  window.LEAH_Vue = VueMod;
}

function obRuntimeInsert() {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (!MutationObserver) return;
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const { addedNodes } = mutation;
      const len = addedNodes.length;
      for (let i = 0; i < len; i++) {
        // https://tnfe.gtimg.com/hel-runtime/level1/v1-2.6.14-vue.js
        const node = addedNodes[i];
        const src = node.src || '';
        if (!src) continue;
        adaptLegacyVueExternal(src);
      }
    });
  });
  observer.observe(document, { childList: true });
}

obRuntimeInsert();
