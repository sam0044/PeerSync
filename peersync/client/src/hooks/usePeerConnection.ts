import { useState, useEffect, useCallback, useRef } from "react";
import { Connection } from "../services/Connection";
import { useRouter } from "next/navigation";

interface UsePeerConnectionProps {
    sessionId: string | null;
    mode: 'sender' | 'receiver';
}

export function usePeerConnection({ sessionId, mode }: UsePeerConnectionProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [receivedFileData, setReceivedFileData] = useState(false);
    const [progress, setProgress] = useState(0);
    const connectionRef = useRef<Connection | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!sessionId) return;

        const connection = new Connection(sessionId, mode);
        connectionRef.current = connection;

        connection.connect({
            onConnected: () => setIsConnected(true),
            onProgress: (p) => setProgress(p),
            onStatus: (status) => {
                switch (status) {
                    case 'completed':
                        setReceivedFileData(true);
                        setProgress(1);
                        break;
                    case 'connection-error':
                        router.push('/error?type=connection-error');
                        break;
                }
            }  
        });

        return () => {
            connectionRef.current?.disconnect();
            connectionRef.current = null;
        };
    }, [sessionId, mode, router]);

    const sendFile = useCallback((file: File) => {
        if (connectionRef.current && isConnected) {
            connectionRef.current.sendFile(file, setProgress).catch(() => {
                router.push('/error?type=transfer-failed');
            });
        }
    }, [isConnected, router]);

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