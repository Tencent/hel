import app from 'at/core/app';
import { changeIsStartedTrue, isLocal } from 'at/utils/deploy';
import * as localCtrl from 'controllers/local';
import debugMod from 'debug';
import http from 'http';
import { initSocketServer } from 'services/hel-micro-socket';
import { HMNStatSrv } from 'services/hmn-stat';

const debug = debugMod('manager:server');
/** Get port from environment and store in Express. */
const port = normalizePort(process.env.PORT || '7777');
app.set('port', port);

/** Create HTTP server. */
const server = http.createServer(app);

// bind server to websocket
// 启动 ws 服务，记录和 hel-micro-node 客户端的长连接关系
initSocketServer({
  server,
  onClientClose: isLocal() ? localCtrl.hmnService.handleClientClose : HMNStatSrv.handleClientClose,
  onHelModsInit: HMNStatSrv.handleHelModsInit,
});

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  if (addr) {
    if (typeof addr === 'string') {
      debug(`Listening on pipe ${addr}`);
      console.log(`server is running on pipe ${addr}`);
    } else {
      debug(`Listening on port ${addr.port}`);
      console.log(`server is running on port ${addr.port}`);
    }
    changeIsStartedTrue();
  } else {
    throw new Error('no server address founded');
  }
}
