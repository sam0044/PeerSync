import { type FC } from "react";
import { Hero } from "./hero";
import { Features } from "./features";
import { UploadZone } from "../file-upload/upload-zone";
import { FileCard } from "../file-upload/file-card";
import { ShareInfo } from "../file-share/share-info";
import { useState } from "react";
import { Button } from "../ui/button";
interface HomeContentProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  isDragActive: boolean;
  sessionId: string | null;
  setFile: (file: File | null) => void;
  setSessionId: (sessionId: string | null) => void;
}

export const HomeContent: FC<HomeContentProps> = ({
    file,
    onFileSelect,
    isDragActive,
    sessionId,
    setFile,
    setSessionId,
  }) => {
    const [isSharing, setIsSharing] = useState(false);
  
    return (
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <Hero />
        
        <section className="max-w-2xl mx-auto mb-16">
          {file && isSharing && sessionId && <ShareInfo sessionId={sessionId} />}
          {!isSharing && <UploadZone onFileSelect={onFileSelect} isDragActive={isDragActive} />}
          {file && (
            <div className="space-y-4">
              <FileCard file={file} />
              {!isSharing && (
                <div className="text-center flex justify-center gap-4">
                  <Button variant="secondary" size="lg" onClick={() => setIsSharing(true)}>
                    Share Now
                  </Button>
                  <Button  size="lg" onClick={() => {setFile(null); setSessionId(null);}}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
  
        {!file && <Features />}
      </main>
    );
  };    