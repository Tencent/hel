const http = require('http');
const url = require('url');
const { hello } = require('@hel-demo/mono-libs');
const { importNodeMod } = require('hel-micro-node');

function send(res, code, text) {
  res.writeHead(code, { 'Content-Type': 'text/html' });
  res.end(text);
}

function sendHello(res, href = '/update-100', ver = '1.0.0') {
  send(res, 200, `Hello, hel-micro-node, micro module fn result: ${hello()}, <a href="${href}">Update to ${ver}</a>\n`);
}

const server = http.createServer(async (req, res) => {
  const path = url.parse(req.url).pathname; // 获取路径部分
  if (path === '/') {
    sendHello(res);
  } else if (path === '/update-100' && req.method === 'GET') {
    await importNodeMod('@hel-demo/mono-libs', { ver: '1.0.0' });
    sendHello(res, '/update-103', '1.0.3');
  } else if (path === '/update-103' && req.method === 'GET') {
    await importNodeMod('@hel-demo/mono-libs', { ver: '1.0.3' });
    sendHello(res, '/update-100', '1.0.0');
  } else {
    send(res, 404, `Not Found\n`);
  }
});

function send(res, code, text) {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.end(text);
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
