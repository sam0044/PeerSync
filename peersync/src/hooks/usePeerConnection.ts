import { useState, useEffect, useCallback, useRef } from "react";
import { Connection } from "@/services/Connection";

interface UsePeerConnectionProps {
    sessionId: string | null;
    mode: 'sender' | 'receiver';
}

export function usePeerConnection({ sessionId, mode }: UsePeerConnectionProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [receivedFileData, setReceivedFileData] = useState(false);
    const [progress, setProgress] = useState(0);
    const connectionRef = useRef<Connection | null>(null);

    useEffect(() => {
        if (!sessionId) return;

        const connection = new Connection(sessionId, mode);
        connectionRef.current = connection;

        connection.connect({
            onConnected: () => setIsConnected(true),
            onProgress: (p) => setProgress(p),
            onComplete: () => setReceivedFileData(true),
            onError: (err) => console.error('Connection error:', err)
        });

        return () => {
            connectionRef.current?.disconnect();
            connectionRef.current = null;
        };
    }, [sessionId, mode]);

    const sendFile = useCallback((file: File) => {
        if (connectionRef.current && isConnected) {
            connectionRef.current.sendFile(file, setProgress);
        }
    }, [isConnected]);

    const disconnect = useCallback(() => {
        connectionRef.current?.disconnect();
        setIsConnected(false);
        setReceivedFileData(false);
        setProgress(0);
    }, []);

    return {
        isConnected,
        sendFile,
        disconnect,
        receivedFileData,
        progress
    };
}