declare module 'simple-peer-wrapper' {
    interface SimplePeerWrapperOptions {
      serverUrl: string;
      roomId?: string | null;
      debug?: boolean;
    }
  
    export default class SimplePeerWrapper {
      constructor(options: SimplePeerWrapperOptions);
      connect(): void;
      close(): void;
      send(data: string | ArrayBuffer): void;
      on(event: 'connect', callback: () => void): void;
      on(event: 'data', callback: (data: WrappedData) => void): void;
      on(event: 'close', callback: () => void): void;
      on(event: 'error', callback: (error: Error) => void): void;
      isConnectionStarted(): boolean;
    }
  }