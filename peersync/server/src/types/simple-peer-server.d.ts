declare module 'simple-peer-server' {
    import { Server } from 'http';
    
    export default class SimplePeerServer {
      constructor(server: Server, debug?: boolean, options?: any);
    }
  }