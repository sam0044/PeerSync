import { createServer, Server } from 'http';
import SimplePeerServer from 'simple-peer-server';
interface IceServer {
  urls: string;
}

interface SimplePeerOptions {
  config: {
    iceServers: IceServer[];
  };
}

const simplePeerOptions: SimplePeerOptions = {
  config: {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      }
    ],
  },
};

const server: Server = createServer();
const spServer = new SimplePeerServer(
  server,
  true,
  simplePeerOptions,
);

server.listen(8081);
console.log('Server is running on port 8081');