// todo, 通过onload 保证script加载顺序
export function createScriptElement(src, appendToBody = true) {
  return new Promise((resolve) => {
    const scriptDom = document.createElement('script');
    scriptDom.src = src;
    scriptDom.onload = resolve;
    if (appendToBody) document.body.appendChild(scriptDom);
    else document.head.appendChild(scriptDom);
  });
}
