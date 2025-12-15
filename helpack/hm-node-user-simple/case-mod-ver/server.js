const http = require('http');
const url = require('url');
const { hello } = require('@hel-demo/mono-libs');
const { importNodeMod } = require('hel-micro-node');

function send(res, code, text) {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.end(text);
}

function sendHello(res) {
  send(res, 200, `Hello, hel-micro-node, micro module fn result: ${hello()}\n`);
}

const server = http.createServer(async (req, res) => {
  const path = url.parse(req.url).pathname; // 获取路径部分
  if (path === '/') {
    sendHello(res);
  } else if (path === '/update' && req.method === 'GET') {
    await importNodeMod('@hel-demo/mono-libs', { ver: '1.0.0' });
    sendHello(res);
  } else {
    send(res, 404, `Not Found\n`);
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
