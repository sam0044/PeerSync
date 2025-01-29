import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface TransferProgressProps {
  isConnected: boolean;
  progress: number;
  onTerminate: () => void;
}

export function TransferProgress({
  isConnected,
  progress,
  onTerminate,
}: TransferProgressProps) {
  const getStatusMessage = () => {
    if (!isConnected) return 'Waiting for peer...';
    if (progress === 0) return 'Connected - Ready to transfer';
    if (progress === 1) return 'Transfer complete!';
    return `Transferring...`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Progress value={progress * 100} className="flex-1" />
        <span className="text-sm text-muted-foreground w-12">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
        <Button
          variant="link"
          size="sm"
          className="text-sm"
          onClick={onTerminate}
        >
          {progress === 1 ? 'Share Another File' : 'Terminate'}
        </Button>
      </div>
    </div>
  );
}
