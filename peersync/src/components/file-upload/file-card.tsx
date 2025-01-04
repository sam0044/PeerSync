import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileCardProps {
  file: File;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <Card className="mt-4 border-primary">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex justify-between items-center text-base font-medium">
          <span className="truncate">{file.name}</span>
          <span className="text-primary text-sm">{file.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Size: {(file.size / 1024).toFixed(2)} KB
          </p>
          <Button variant="secondary" size="sm">
            Share Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}