import { preFetchLib } from 'hel-micro';

async function start() {
  await preFetchLib('@hel-demo/mono-libs');
  await import('./loadApp');
}

start().catch(console.error);
