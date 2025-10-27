let appProps = {};
let helContext = {};
let renderByHelMicro = false;

/**
 * 记录别的项目实例化当前应用时透传的props，方便当前应用任意组件可以直接获取
 * 该方法会被根组件调用
 * @param iAppProps
 */
export function setMicroAppProps(microAppProps) {
  renderByHelMicro = !!microAppProps.helContext;
  appProps = microAppProps.appProps || {};
  helContext = microAppProps.helContext || {};
  ensureDropdownListVisible();
}

export function getAppProps() {
  return appProps;
}

export function isRenderByHelMicro() {
  return renderByHelMicro;
}

export function getAppHelContext() {
  return helContext;
}

export function getAppRootContainer() {
  if (helContext.getShadowAppRoot) {
    return helContext.getShadowAppRoot();
  }
  return window.top.document.body;
}

/**
 * 人工设置container，确保在 shadow-dom 里也能正常渲染
 */
export function getAppBodyContainer(idOrTriggerNode) {
  if (typeof idOrTriggerNode === 'string') {
    const el = document.getElementById(idOrTriggerNode);
    return el || window.top.document.body;
  }
  if (helContext.getShadowContainer) {
    return helContext.getShadowContainer();
  }
  return window.top.document.body;
}

// eslint-disable-next-line
let isEnsured = false;

export function ensureDropdownListVisible() {
  if (!isRenderByHelMicro()) return;

  /**
   * 此函数的调用时机出现了一个很诡异的解决问题方案，本项目被调用处是在 AttrForm 的启用状态下拉项里
   * 只要有一个Item 定义了 onMouseEnter={helUtil.ensureDropdownListVisible}
   * 即可解决点击两次才出现下拉的bug
   */
  isEnsured = true;
  document.addEventListener('click', () => {
    if (helContext.getShadowContainer) {
      const shawRoot = helContext.getShadowContainer();
      if (!shawRoot) return;
      const { children } = shawRoot;
      // 遍历 shadowRoot下所有的顶层节点，去掉 position=absolute，
      // 让不同的浏览器的shadow-dom子应用都能够正常的显示下拉菜单
      for (let i = 0, len = children.length; i < len; i++) {
        const item = children[i];
        const { style } = item;
        if (style && style.position === 'absolute') {
          style.position = '';
        }
      }
    }
  });
}
