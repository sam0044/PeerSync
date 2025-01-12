"use client";

import { Hero } from "./hero";
import { UploadZone } from "../file-upload/upload-zone";
import { FileCard } from "../file-upload/file-card";
import { ShareInfo } from "../file-share/share-info";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePeerConnection } from "../../hooks/usePeerConnection";

import { useToast } from "../../hooks/use-toast";
import { TransferProgress } from "../file-share/transfer-progress";

interface HomeContentProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  sessionId: string | null;
  setFile: (file: File | null) => void;
  setSessionId: (sessionId: string | null) => void;
}

export function HomeContent ({
  file,
  onFileSelect,
  sessionId,
  setFile,
  setSessionId,
}: HomeContentProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { isConnected, sendFile, disconnect, progress } = usePeerConnection({
    sessionId: sessionId,
    mode: 'sender'
  });
  const { toast } = useToast();
  const handleShare = async () => {
    try{
      const response = await fetch('/api/sessions/create', {
        method: 'POST',
      });
      if(!response.ok){
        throw new Error('Failed to create session');
      }
      const {sessionId} = await response.json();
      setIsSharing(true);
      setSessionId(sessionId);
    } catch {
      toast({
        variant: "destructive",
        title: "Error creating session",
        description: "Could not create sharing session. Please try again.",
      });
      setIsSharing(false);
    }

  };

  const handleTerminate = () => {
    disconnect();
    setFile(null);
    setSessionId(null);
    setIsSharing(false);
  };

  // Send file when peer connects
  useEffect(() => {
    if (isConnected && file && isSharing) {
      sendFile(file);
      console.log(file);
    }
  }, [isConnected, file, isSharing, sendFile]);

  return (
    <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
      <Hero mode="share" />
      
      <section className="max-w-2xl mx-auto mb-16">
        {file && isSharing && sessionId && (
          <ShareInfo 
            sessionId={sessionId} 
          />
        )}
        {!isSharing && (
          <div className="mb-8">
            <UploadZone onFileSelect={onFileSelect} />
          </div>
         )}
        {file && (
          <div className="space-y-6">
            <FileCard file={file} />
            {!isSharing && (
              <div className="text-center flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={handleShare}>
                  Share Now
                </Button>
                <Button variant="destructive" size="lg" onClick={() => {
                  setFile(null);
                  setSessionId(null);
                }}>
                  Cancel
                </Button>
              </div>
            )}
            {isSharing && (
              <TransferProgress 
                isConnected={isConnected}
                progress={progress}
                onTerminate={handleTerminate}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
};  