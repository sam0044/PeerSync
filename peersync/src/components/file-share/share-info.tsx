import QRCode from "react-qr-code";
import { CopyButton } from "../ui/copy-button";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface ShareInfoProps {
  sessionId: string;
  onTerminate: () => void;
  isConnected: boolean;
  progress: number;
}

export function ShareInfo({ sessionId, onTerminate, isConnected, progress }: ShareInfoProps) {
  const shareUrl = `${window.location.origin}/receive/${sessionId}`;
  const getStatusMessage = () => {
    if (!isConnected) return 'Waiting for peer...';
    if (progress === 0) return 'Connected - Ready to transfer';
    if (progress === 1) return 'Transfer complete!';
    return `Transferring...`;
  };

  return (
    <div className="text-center mb-4">
      <QRCode 
        value={shareUrl}
        size={160}
        style={{ margin: '0 auto', marginBottom: '1rem' }}
      />
      <h3 className="font-medium mb-2">Share using this link:</h3>
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground break-all">{shareUrl}</p>
        <CopyButton value={shareUrl} className="shrink-0" />
      </div>
      <p className="text-sm mt-2">
        Status: {getStatusMessage()}
      </p>
      
      {/* Progress section */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Progress value={progress * 100} className="flex-1" />
          <span className="text-sm text-muted-foreground w-12">
            {Math.round(progress * 100)}%
          </span>
        </div>
        
        <Button 
          variant={progress === 1 ? "default" : "link"}
          size="sm"
          className="text-sm"
          onClick={onTerminate}
        >
          {progress === 1 ? "Share Another File" : "Terminate"}
        </Button>
      </div>
    </div>
  );
}