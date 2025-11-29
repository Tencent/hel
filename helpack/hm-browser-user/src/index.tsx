import { preFetchLib } from 'hel-micro';

async function start() {
  if (process.env.REACT_APP_HEL === 'local') {
    await preFetchLib('@hel-demo/mono-libs', { customMetaUrl: '/openapi/meta' });
    await import('./loadApp');
  } else if (process.env.REACT_APP_HEL === 'unpkg') {
    await preFetchLib('@hel-demo/mono-libs');
    await import('./loadApp');
  }
  await import('./loadApp');
}

start().catch(console.error);
