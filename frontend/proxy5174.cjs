const http = require('http');

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: 5173,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (_err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Vite dev server is loading on port 5173, please refresh in a moment...');
  });

  req.pipe(proxyReq);
});

server.listen(5174, () => {
  console.log('Proxy active: localhost:5174 -> localhost:5173');
});
