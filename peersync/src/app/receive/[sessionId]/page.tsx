"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { useParams, useRouter } from "next/navigation";

export default function ReceivePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const { isConnected, receivedFileData, progress} = usePeerConnection({
    sessionId,
    mode: 'receiver'
  });


  return (
    <div className="min-h-screen flex flex-col bg-background transition-all duration-300 relative">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <Hero mode="receive" />
        <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto text-center">
          {!isConnected && !receivedFileData && <p>Connecting to peer...</p>}
          {isConnected && !receivedFileData && (
            <div className="space-y-2">
              <p>Waiting for file...</p>
              {progress > 0 && (
                <>
                  <Progress value={progress * 100} />
                  <p className="text-sm text-center text-muted-foreground">
                    {Math.round(progress * 100)}%
                  </p>
                </>
              )}
              </div>
          )}
          {receivedFileData && (
            <div className="text-center space-y-4">
              <p className="text-primary">File received successfully!</p>
              <Button 
                onClick={() => router.push('/')}
                size="sm"
              >
                Share a File
              </Button>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}