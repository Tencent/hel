import debugMod from 'debug';
import * as http from 'http';
import env from '../configs/env';
import app from '../core/initApp';

const debug = debugMod('manager:server');
/** Get port from environment and store in Express. */
const port = normalizePort(env.port || process.env.PORT || '7776');
app.set('port', port);

/** Create HTTP server. */
const server = http.createServer(app);

export const start = () => {
  // Listen on provided port, on all network interfaces.
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
};

// Normalize a port into a number, string, or false.
function normalizePort(val) {
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
function onError(error) {
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
  console.log('onListening', addr);
  if (addr) {
    if (typeof addr === 'string') {
      debug(`Listening on pipe ${addr}`);
    } else {
      debug(`Listening on port ${addr.port}`);
    }
  } else {
    throw new Error('no server address founded');
  }
}
