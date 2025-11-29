import { preFetchLib } from 'hel-micro';

async function start() {
  console.log('REACT_APP_HEL', process.env.REACT_APP_HEL);
  await preFetchLib('@hel-demo/mono-libs');
  await import('./loadApp');
}

start().catch(console.error);
