"use client";

import { ThemeToggle } from "../theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">PeerSync</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}