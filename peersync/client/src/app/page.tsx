"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Header } from "../components/layout/header";
import { HomeContent } from "../components/layout/home-content";
import { DragOverlay } from "../components/file-upload/drag-overlay";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
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