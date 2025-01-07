"use client";

import { Hero } from "./hero";
import { UploadZone } from "../file-upload/upload-zone";
import { FileCard } from "../file-upload/file-card";
import { ShareInfo } from "../file-share/share-info";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { nanoid } from "nanoid";
import { Progress } from "../ui/progress";

interface HomeContentProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  isDragActive: boolean;
  sessionId: string | null;
  setFile: (file: File | null) => void;
  setSessionId: (sessionId: string | null) => void;
}

export function HomeContent ({
  file,
  onFileSelect,
  isDragActive,
  sessionId,
  setFile,
  setSessionId,
}: HomeContentProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { isConnected, sendFile, disconnect, progress } = usePeerConnection({
    sessionId: sessionId,
    mode: 'sender'
  });

  const handleShare = () => {
    setIsSharing(true);
    setSessionId(nanoid(21));
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
            onTerminate={handleTerminate}
            isConnected={isConnected}
            progress={progress}
          />
        )}
        {!isSharing && <UploadZone onFileSelect={onFileSelect} isDragActive={isDragActive} />}
        {file && (
          <div className="space-y-4">
            <FileCard file={file} />
            {!isSharing && (
              <div className="text-center flex justify-center gap-4">
                <Button variant="secondary" size="lg" onClick={handleShare}>
                  Share Now
                </Button>
                <Button size="lg" onClick={() => {
                  setFile(null);
                  setSessionId(null);
                }}>
                  Cancel
                </Button>
              </div>
            )}
            {isSharing && isConnected && progress > 0 && progress < 1 && (
              <Progress value={progress*100} />
            )}
          </div>
        )}
      </section>
    </main>
  );
};  