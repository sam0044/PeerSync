import { Upload } from "lucide-react";

interface DragOverlayProps {
  isVisible: boolean;
}

export function DragOverlay({ isVisible }: DragOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center justify-center">
      <div className="text-center">
        <Upload className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold">Drop your file here</h3>
      </div>
    </div>
  );
}