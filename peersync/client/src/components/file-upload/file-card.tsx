import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FileCardProps {
  file: File;
}

export function FileCard({ file }: FileCardProps) {
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    const kb = bytes / 1024;
    
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    return `${kb.toFixed(2)} KB`;
  };
  return (
    <Card className="mt-4 border-muted-foreground/20">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex justify-between items-center text-base font-medium">
          <span className="truncate">{file.name}</span>
          <span className="text-primary text-sm">{file.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-sm text-muted-foreground">
          Size: {formatFileSize(file.size)}
        </p>
      </CardContent>
    </Card>
  );
}