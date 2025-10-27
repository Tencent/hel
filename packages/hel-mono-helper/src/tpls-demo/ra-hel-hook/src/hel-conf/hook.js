import { setHelModVers } from 'hel-mono-runtime-helper';

export function beforeStartApp() {
  setHelModVers({ '@hel-demo/mono-bslib': '0.0.1' });
}
