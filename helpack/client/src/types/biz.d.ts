
export interface SubAppInfo {
  name: string,
  version: string,
  nameInSec: string,
  cnName: string,
  apiHost: string,
  renderMode: 'react-shadow' | 'react' | 'iframe',
  hostMap: {
    online: string,
    pre: string,
  },
  srcMap: SrcMap,
}