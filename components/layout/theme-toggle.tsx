"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Toggle theme"
        disabled
        className={cn("rounded-full", className)}
      >
        <span className="size-4 animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  function cycleTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  }

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={cycleTheme}
      className={cn("rounded-full", className)}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <Sun className="size-4 text-amber-500" />}
      {theme === "dark" && <Moon className="size-4 text-blue-400" />}
      {theme === "system" && <Laptop className="size-4 text-muted-foreground" />}
    </Button>
  );
}
