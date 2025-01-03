"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      {...getRootProps()}
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-background transition-all duration-300 relative"
    >
      <input {...getInputProps()} />

      <div className="absolute top-8 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          PeerSync
        </h1>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Using the same blur effect as the navbar */}
      {isDragActive && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300" />
      )}

      <div className={`w-full max-w-2xl space-y-6 relative z-10 transition-all duration-300 ${
        isDragActive ? 'opacity-50' : ''
      }`}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">Upload Your File</h2>
          <p className="text-muted-foreground">
            Drag and drop anywhere on the screen, or use the button below
          </p>
        </div>

        {/* File Upload Button */}
        <div className="text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileInput}
          />
          <Button
            variant="secondary"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Select File
          </Button>
        </div>

        {/* Display selected file */}
        {file && (
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex justify-between items-center text-base font-medium">
                <span>{file.name}</span>
                <span className="text-primary">{file.type}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
