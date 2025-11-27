import { preFetchLib } from 'hel-micro';

async function start() {
  console.log('REACT_APP_HEL', process.env.REACT_APP_HEL);

  await preFetchLib('@hel-demo/mono-libs', {
    getMeta: async (params) => {
      const meta = await params.innerRequest();
      console.log('meta', meta);
      return meta;
    },
  });
  await import('./loadApp');
}

start().catch(console.error);
