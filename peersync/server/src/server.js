
const SimplePeerServer = require('simple-peer-server');

const http = require('http');

const simplePeerOptions = {
    config: {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        }
      ],
    },
  };
  
  const server = http.createServer();
  const spServer = new SimplePeerServer(
    server,
    true,
    simplePeerOptions,
  );

  server.listen(8081);
  console.log('Server is running on port 8081');