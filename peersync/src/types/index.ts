import type SimplePeer from 'simple-peer';

// Basic shared types
export type PeerMode = 'sender' | 'receiver';

// For usePeerConnection hook
export interface UsePeerConnectionProps {
    sessionId: string | null;
    mode: PeerMode;
}

export interface UsePeerConnectionReturn {
    isConnected: boolean;
    sendFile: (file: File) => void;
    disconnect: () => void;
    receivedFileData: boolean;
    progress: number;
}

// For Connection class
export interface ConnectionCallbacks {
    onConnected: () => void;
    onProgress: (progress: number) => void;
    onComplete: () => void;
    onError: (error: Error) => void;
}

export interface SignalData {
    targetId: string;
    signal: SimplePeer.SignalData;
}

export interface PeerSignalData {
    peerId: string;
    signal: SimplePeer.SignalData;
}

// Optional: If you want to type the metadata for file transfers
export interface FileMetadata {
    done: boolean;
    name: string;
    type: string;
}