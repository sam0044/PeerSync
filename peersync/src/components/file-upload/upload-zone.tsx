"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isDragActive: boolean;
}

export function UploadZone({ onFileSelect, isDragActive }: UploadZoneProps) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card className={`border-2 border-dashed ${isDragActive ? 'border-primary' : 'border-muted'} transition-colors duration-300`}>
      <CardHeader className="text-center">
        <CardTitle className="flex flex-col items-center gap-4">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <span>Drop your file here</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
        />
        <Button
          size="lg"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          Select File
        </Button>
      </CardContent>
    </Card>
  );
}