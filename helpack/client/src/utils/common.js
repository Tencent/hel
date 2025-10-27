export function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** short of stopEventPropagation */
export function ste(e) {
  // 当前项目暂未支持可选链
  if (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }
  return true;
}
