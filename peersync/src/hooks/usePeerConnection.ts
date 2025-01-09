import { useState, useEffect, useCallback, useRef } from "react";
import SimplePeer, { SignalData as SimplePeerSignalData } from 'simple-peer';
import { io, Socket } from 'socket.io-client';
import download from 'downloadjs';

interface UsePeerConnectionProps {
  sessionId: string | null;
  mode: 'sender' | 'receiver';
}
interface SignalData {
  targetId: string;
  signal: SimplePeerSignalData;
}

interface PeerSignalData {
  peerId: string;
  signal: SimplePeerSignalData;
}

export function usePeerConnection({ sessionId, mode }: UsePeerConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [receivedFileData, setReceivedFileData] = useState(false);
  const [progress, setProgress] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const receivedChunks = useRef<Array<ArrayBuffer>>([]);
  const CHUNK_SIZE = 16 * 1024;

  useEffect(() => {
    if (!sessionId) return;

    // Initialize socket connection
    const socket = io('http://localhost:8081');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join-room', sessionId);
    });

    // Handle peer joining (sender creates the peer)
    socket.on('peer-joined', (peerId) => {
      console.log('Peer joined:', peerId);
      if (mode === 'sender') {
        const peer = new SimplePeer({ initiator: true });
        peerRef.current = peer;
        setupPeerEvents(peer, socket, peerId);
      }
    });

    // Handle existing peers (receiver joins existing room)
    socket.on('existing-peers', (peers) => {
      if (mode === 'receiver' && peers.length > 0) {
        const peer = new SimplePeer({ initiator: false });
        peerRef.current = peer;
        setupPeerEvents(peer, socket, peers[0]);
      }
    });

    // Handle WebRTC signaling
    socket.on('signal', ({ peerId, signal }: PeerSignalData) => {
      console.log('Received signal from:', peerId);
      if (!peerRef.current) {
        const peer = new SimplePeer({ initiator: false });
        peerRef.current = peer;
        setupPeerEvents(peer, socket, peerId);
      }
      peerRef.current.signal(signal);
    });

    return () => {
      console.log('Cleaning up connection');
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      setReceivedFileData(false);
      receivedChunks.current = [];
    };
  }, [sessionId, mode]);

  const setupPeerEvents = (peer: SimplePeer.Instance, socket: Socket, targetId: string) => {
    peer.on('signal', (signal) => {
      console.log('Sending signal to:', targetId);
      socket.emit('signal', { targetId, signal } as SignalData);
    });

    peer.on('connect', () => {
      console.log('Peer connection established');
      setIsConnected(true);
    });

    peer.on('data', (data) => {
      if (mode === 'receiver') {
        // Handle string data (metadata)
          console.log('Received metadata');
          try {
            const parsed = JSON.parse(data);
            if (parsed.done) {
              console.log('File transfer complete, chunks:', receivedChunks.current.length);
              const blob = new Blob(receivedChunks.current, { type: parsed.type });
              download(blob, parsed.name);
              setReceivedFileData(true);
              receivedChunks.current = [];
            }
          } catch (error) {
            // If it's not valid JSON, treat it as a base64 chunk
            console.log('error',error)
            if (data instanceof Uint8Array) {
              receivedChunks.current.push(data.buffer);
            } else if (data instanceof ArrayBuffer) {
              receivedChunks.current.push(data);
            } else {
              // If it's neither JSON nor binary, log error
              console.error('Unknown data format:', typeof data);
            }
          }
      }
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      setIsConnected(false);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });
  };

  const sendFile = useCallback((file: File) => {
    if (mode === 'sender' && peerRef.current && isConnected) {
      let offset = 0;
      const sendChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            const uint8Array = new Uint8Array(reader.result);
            peerRef.current?.send(uint8Array);
            offset += slice.size;
            setProgress(offset / file.size);

            if (offset < file.size) {
              sendChunk();
            } else {
              peerRef.current?.send(JSON.stringify({
                done: true,
                name: file.name,
                type: file.type,
              }));
              console.log('Sent metadata');
            }
          }
        };

        reader.readAsArrayBuffer(slice);
      };

      sendChunk();
    }
  }, [mode, isConnected, CHUNK_SIZE]);

  const disconnect = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    sendFile,
    disconnect,
    receivedFileData,
    progress
  };
}