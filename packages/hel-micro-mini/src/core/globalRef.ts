let globalThisRef = null;

function assignRef() {
  // for browser env
  if (typeof window !== 'undefined') {
    globalThisRef = window;
    return;
  }
  // for nodejs env
  if (typeof global !== 'undefined') {
    globalThisRef = global;
    return;
  }
  throw new Error('unable to locate global object');
}

/**
 *
 * @returns {typeof globalThis}
 */
export function getGlobalThis() {
  if (!globalThisRef) {
    assignRef();
  }
  return globalThisRef;
}
