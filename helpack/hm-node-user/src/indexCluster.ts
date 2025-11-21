/* eslint-disable */
import cluster from 'cluster';
// const workerNum = require('os').cpus().length - 2;
const workerNum = 3;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < workerNum; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${cluster.worker?.id} start...`);
  process.env.WORKER_ID = String(cluster.worker?.id || '');
  async function runServer() {
    const { startServer } = await import('./server');
    startServer();
  }

  runServer();
}
