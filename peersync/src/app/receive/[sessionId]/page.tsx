"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { useParams } from "next/navigation";

export default function ReceivePage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const { isConnected, receivedFileData} = usePeerConnection({
    sessionId,
    mode: 'receiver'
  });


  return (
    <div className="min-h-screen flex flex-col bg-background transition-all duration-300 relative">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <Hero mode="receive" />
        <div className="flex flex-col items-center gap-4">
          {!isConnected && <p>Connecting to peer...</p>}
          {isConnected && !receivedFileData && <p>Waiting for file...</p>}
        </div>
      </main>
    </div>
  );
}