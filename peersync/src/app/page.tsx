"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Header } from "@/components/layout/header";
import { HomeContent } from "@/components/sections/home-content";
import { DragOverlay } from "@/components/file-upload/drag-overlay";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const {toast} = useToast();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'expired-session') {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "This sharing session has expired. Please request a new sharing link.",
      });
    } else if (error === 'invalid-session') {
      toast({
        variant: "destructive",
        title: "Invalid Session",
        description: "This sharing link is invalid. Please request a new one.",
      });
    }
  }, [searchParams, toast]);

  const handleFileSelect = (newFile: File) => {
    setFile(newFile);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      className="min-h-screen flex flex-col bg-background transition-all duration-300 relative"
    >
      <input {...getInputProps()} />
      <Header />
      
      <HomeContent 
        file={file}
        onFileSelect={handleFileSelect}
        sessionId={sessionId}
        setFile={setFile}
        setSessionId={setSessionId}
      />

      <DragOverlay isVisible={isDragActive} />
    </div>
  );
}