"use client";

import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('type');

  const getErrorMessage = () => {
    switch (error) {
      case 'expired-session':
        return {
          title: "Session Expired",
          description: "This sharing session has expired. Please request a new sharing link."
        };
      case 'invalid-session':
        return {
          title: "Invalid Session",
          description: "This sharing link is invalid. Please request a new one."
        }; 
      case 'connection-error':
          return {
              title: "Connection Error",
              description: "The connection was lost. This could be due to network issues or because the transfer was cancelled. Please try again."
          };
      default:
        return {
          title: "Error",
          description: "Something went wrong. Please try again."
        };
    }
  };

  const { title, description } = getErrorMessage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
          <Button 
            onClick={() => router.push('/')}
            size="sm"
          >
            Return Home
          </Button>
        </div>
      </main>
    </div>
  );
}