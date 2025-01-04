"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";

export default function ReceivePage() {

  return (
    <div className="min-h-screen flex flex-col bg-background transition-all duration-300 relative">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <Hero mode="receive" />
        <div className="flex justify-center">
          <Button>
            Download
          </Button>
        </div>
      </main>
    </div>
  );
}