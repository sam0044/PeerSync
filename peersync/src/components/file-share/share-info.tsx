import QRCode from "react-qr-code";
import { CopyButton } from "../ui/copy-button";
import { Button } from "../ui/button";

interface ShareInfoProps {
  sessionId: string;
  onTerminate: () => void;
}

export function ShareInfo({ sessionId, onTerminate }: ShareInfoProps) {
  const shareUrl = `${window.location.origin}/receive/${sessionId}`;
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
      <Button 
        variant="link" 
        className="text-sm hover:text-foreground"
        onClick={onTerminate}
      >
        Terminate
      </Button>
    </div>
  );
}