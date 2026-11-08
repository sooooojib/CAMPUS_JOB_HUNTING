"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delay={150}>
        {children}
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}
