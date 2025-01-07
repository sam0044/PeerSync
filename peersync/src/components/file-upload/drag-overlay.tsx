interface DragOverlayProps {
  isVisible: boolean;
}

export function DragOverlay({ isVisible }: DragOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center justify-center">
      <div className="text-center animate-bounce">
        <h3 className="text-2xl font-bold">Drop it like it&apos;s hot</h3>
      </div>
    </div>
  );
}