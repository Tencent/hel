import { setHelModConfs } from 'hel-mono-runtime-helper';

export function beforeStartApp() {
  setHelModConfs({ '@hel-demo/mono-bslib': { ver: '0.0.1' } });
}
