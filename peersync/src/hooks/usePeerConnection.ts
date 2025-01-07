import { useState,useEffect, useCallback, useRef } from "react";
import SimplePeerWrapper from "simple-peer-wrapper";
import download from 'downloadjs';



interface UsePeerConnectionProps {
  sessionId: string | null;
  mode: 'sender' | 'receiver';
}


export function usePeerConnection({ sessionId, mode }: UsePeerConnectionProps){
  const [isConnected, setIsConnected] = useState(false);
  const [receivedFileData, setReceivedFileData] = useState(false);
  const [spw, setSpw] = useState<SimplePeerWrapper | null>(null);
  const receivedChunks = useRef<Array<ArrayBuffer>>([]);
  const CHUNK_SIZE = 16 * 1024;
  
  useEffect(()=>{
    if(!sessionId) return;
    const spw = new SimplePeerWrapper({ serverUrl: 'http://localhost:8081', roomId: sessionId, debug: true });
    setSpw(spw);
    spw.connect();
    spw.on('connect',()=> {
      setIsConnected(true);
    })
    if (mode === 'receiver') {
      spw.on('data', (rawdata) => {
        const data = rawdata.data;
        
        // Try to parse as JSON first
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
          try {
            console.log('error',error)
            const binaryString = atob(data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            console.log('Received chunk of size:', bytes.buffer.byteLength);
            receivedChunks.current.push(bytes.buffer);
          } catch (decodeError) {
            console.error('Error decoding chunk:', decodeError);
          }
        }
      });
    }
    return () => {
      spw.close();
      setSpw(null);
      setIsConnected(false);
      setReceivedFileData(false);
      receivedChunks.current = [];
    }
  },[sessionId,mode])
  

  const sendFile = useCallback((file: File) => {
    if(mode === 'sender' && spw && isConnected){
      let offset = 0;
      const sendChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();
    
        // When the file slice is read
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            // Send the data to the peer
            const uint8Array = new Uint8Array(reader.result);
            const base64String = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
            console.log('Sending chunk of size:', reader.result.byteLength);
            console.log(reader.result)
            spw.send(base64String);
    
            offset += slice.size;
    
            if (offset < file.size) {
              // Continue with the next chunk
              sendChunk();
            } else {
              // Notify the peer that the file transfer is complete
              spw.send(
                JSON.stringify({
                  done: true,
                  name: file.name,
                  type: file.type,
                })
              );
            }
          }
          else{
            console.error('Reader result is not an ArrayBuffer:', reader.result);
          }
        };
    
        // Start reading the slice as an ArrayBuffer
        reader.readAsArrayBuffer(slice);
      };
    
      // Start the process
      sendChunk();
    }
  },[mode,spw, isConnected, CHUNK_SIZE])


  const disconnect = useCallback(() => {
    if(spw){
      spw.close();
    }
  },[spw])
  return {
    isConnected,
    sendFile,
    disconnect,
    receivedFileData
  }

}