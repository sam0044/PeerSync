"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { UploadZone } from "@/components/file-upload/upload-zone";
import { FileCard } from "@/components/file-upload/file-card";
import { DragOverlay } from "@/components/file-upload/drag-overlay";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
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

      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <Hero />
        
        <section className="max-w-2xl mx-auto mb-16">
          <UploadZone onFileSelect={setFile} isDragActive={isDragActive} />
          {file && <FileCard file={file} />}
        </section>

        <Features />
      </main>

      <DragOverlay isVisible={isDragActive} />
    </div>
  );
}