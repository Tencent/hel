import { bridgeShadowRoot } from "./EventBridge";
import { IShadowRootOptions } from "./IShadowRootOptions";
import "./Hooks";

export const supportShadow = "attachShadow" in document.createElement("div");

export function attachShadow(host: HTMLElement, optinos: IShadowRootOptions) {
  if (!host || !supportShadow) return (host as any) as ShadowRoot;
  const { mode = "open", delegatesFocus } = { ...optinos };
  const shadowRoot = host.attachShadow({ mode, delegatesFocus });
  const define = Object.defineProperty;
  define(shadowRoot, "style", { get: () => host.style });
  define(shadowRoot, "parentNode", { get: () => host.parentNode });
  define(shadowRoot, "parentElement", { get: () => host.parentElement });
  define(shadowRoot, "offsetParent", { get: () => host.offsetParent });
  define(shadowRoot, "offsetTop", { get: () => host.offsetTop });
  define(shadowRoot, "offsetLeft", { get: () => host.offsetLeft });
  define(shadowRoot, "offsetWidth", { get: () => host.offsetWidth });
  define(shadowRoot, "offsetHeight", { get: () => host.offsetHeight });
  define(shadowRoot, "getBoundingClientRect", {
    get: () => host.getBoundingClientRect.bind(host)
  });
  define(shadowRoot, "getClientRects", {
    get: () => host.getClientRects.bind(host)
  });
  define(host, "insertBefore", {
    get: () => shadowRoot.insertBefore.bind(shadowRoot)
  });
  define(host, "appendChild", {
    get: () => shadowRoot.appendChild.bind(shadowRoot)
  });
  bridgeShadowRoot(shadowRoot);
  return shadowRoot;
}
