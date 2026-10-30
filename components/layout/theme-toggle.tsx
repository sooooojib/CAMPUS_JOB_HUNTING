"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Toggle theme"
        disabled
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
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <Sun className="size-4 text-amber-500" />}
      {theme === "dark" && <Moon className="size-4 text-blue-400" />}
      {theme === "system" && <Laptop className="size-4 text-muted-foreground" />}
    </Button>
  );
}
