import { type FC } from "react";
import { Hero } from "./hero";
import { Features } from "./features";
import { UploadZone } from "../file-upload/upload-zone";
import { FileCard } from "../file-upload/file-card";

interface HomeContentProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  isDragActive: boolean;
}

export const HomeContent: FC<HomeContentProps> = ({
  file,
  onFileSelect,
  isDragActive,
}) => {
  return (
    <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
      <Hero />
      
      <section className="max-w-2xl mx-auto mb-16">
        <UploadZone onFileSelect={onFileSelect} isDragActive={isDragActive} />
        {file && <FileCard file={file} />}
      </section>

      {!file && <Features />}
    </main>
  );
};