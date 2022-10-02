import { BRIDGE_EVENT_NAMES } from './EventNames';

export function bridge(fromNode: Node, toNode: Node) {
  if (!fromNode || !toNode || fromNode === toNode) return;
  const define = Object.defineProperty;
  BRIDGE_EVENT_NAMES.forEach((eventName) => {
    fromNode.addEventListener(eventName, (fromEvent: any) => {
      fromEvent.stopPropagation();
      const Event = fromEvent.constructor;
      const toEvent = new Event(eventName, {
        ...fromEvent,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      const { path = [], target = path[0], srcElement = path[0], toElement = path[0], preventDefault } = fromEvent;
      define(toEvent, 'path', { get: () => path });
      define(toEvent, 'target', { get: () => target });
      define(toEvent, 'srcElement', { get: () => srcElement });
      define(toEvent, 'toElement', { get: () => toElement });
      define(toEvent, 'preventDefault', {
        value: () => {
          preventDefault.call(fromEvent);
          return preventDefault.call(toEvent);
        },
      });
      toNode.dispatchEvent(toEvent);
    });
  });
}

export function bridgeShadowRoot(shadowRoot: ShadowRoot) {
  bridge(shadowRoot, shadowRoot.host);
}

export function bridgeShadowHost(shadowHost: Element) {
  bridge(shadowHost.shadowRoot, shadowHost);
}
