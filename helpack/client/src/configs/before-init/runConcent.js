import cc, { run } from 'concent';
import models from 'models';

cc.bindCcToWindow('Hel');

run(models, {
  middlewares: [
    (stateInfo, next) => {
      console.warn(stateInfo);
      next();
    },
  ],
});
