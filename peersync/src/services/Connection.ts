import { Socket, io } from "socket.io-client";
import SimplePeer from "simple-peer";
import { ConnectionCallbacks, PeerMode } from "../types";
import download from "downloadjs";

export class Connection {
    private peer: SimplePeer.Instance | null = null;
    private socket: Socket | null = null;
    private isConnected: boolean = false;
    private mode: PeerMode;
    private roomId: string;
    private targetId: string | null = null;
    private receivedChunks: Array<ArrayBuffer> = [];
    private readonly CHUNK_SIZE = 16 * 1024;

    constructor(roomId: string, mode: PeerMode) {
        this.roomId = roomId;
        this.mode = mode;
    }

    connect(callbacks: {
        onConnected: () => void,
        onProgress: (progress: number) => void,
        onComplete: () => void,
        onError: (error: Error) => void
    }) {
        // Connect socket
        this.socket = io('http://localhost:8081');
        
        this.socket.on('connect', () => {
            this.socket?.emit('join-room', this.roomId);
        });

        // Setup peer based on mode
        if (this.mode === 'sender') {
            this.socket.on('peer-joined', (peerId: string) => {
                this.targetId = peerId;
                this.createPeer(true, callbacks);
            });
        } else {
            this.socket.on('existing-peers', (peers: string[]) => {
                if (peers.length > 0) {
                    this.targetId = peers[0];
                    this.createPeer(false, callbacks);
                }
            });
        }

        // Handle signaling
        this.socket.on('signal', ({ signal }) => {
            this.peer?.signal(signal);
        });
    }

    private createPeer(initiator: boolean, callbacks: ConnectionCallbacks) {
        const config = {
            initiator,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        }
        this.peer = new SimplePeer(config);

        this.peer.on('signal', signal => {
            if (this.targetId) {
                this.socket?.emit('signal', {
                    targetId: this.targetId,
                    signal
                });
            }
        });

        this.peer.on('connect', () => {
            this.isConnected = true;
            callbacks.onConnected();
        });

        this.peer.on('data', (data) => this.handleData(data, callbacks));

        this.peer.on('error', (err) => {
            callbacks.onError(err);
            this.isConnected = false;
        });
    }

    private handleData(data: Uint8Array | ArrayBuffer | string, callbacks: ConnectionCallbacks) {
        try {
            const parsed = JSON.parse(data.toString());
            if (parsed.done) {
                const blob = new Blob(this.receivedChunks, { type: parsed.type });
                download(blob, parsed.name);
                callbacks.onComplete();
                this.receivedChunks = [];
            }
        } catch {
            if (data instanceof Uint8Array) {
                this.receivedChunks.push(data.buffer);
            } else if (data instanceof ArrayBuffer) {
                this.receivedChunks.push(data);
            }
        }
    }

    async sendFile(file: File, onProgress: (progress: number) => void) {
        if (!this.isConnected || !this.peer) return;

        let offset = 0;
        const sendChunk = () => {
            const slice = file.slice(offset, offset + this.CHUNK_SIZE);
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    this.peer?.send(new Uint8Array(reader.result));
                    offset += slice.size;
                    onProgress(offset / file.size);

                    if (offset < file.size) {
                        sendChunk();
                    } else {
                        this.peer?.send(JSON.stringify({
                            done: true,
                            name: file.name,
                            type: file.type,
                        }));
                    }
                }
            };
            reader.readAsArrayBuffer(slice);
        };

        sendChunk();
    }

    disconnect() {
        this.peer?.destroy();
        this.socket?.disconnect();
        this.isConnected = false;
        this.targetId = null;
        this.receivedChunks = [];
    }
}