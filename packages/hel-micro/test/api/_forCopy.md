复制以下代码，快速开始编写单测

```ts
import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  const { preFretchLib } = api;

  describe('test some api', () => {
    test('scene 1', () => {
      expect(1).toBeTruthy();
    });
  });
});
```
