"use client";

import { Button } from "../ui/button";
import { Card} from "../ui/card";
import { File } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect}: UploadZoneProps) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card className={`border-2 border-muted-foreground/20 w-fit mx-auto`}>
      <div className="flex items-center gap-8 px-4 py-4">
        <div className="flex items-center gap-2">
          <File className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm font-medium">Drop a file</span>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileInput}
          />
          <Button
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Select File
          </Button>
        </div>
      </div>
    </Card>
  );
}