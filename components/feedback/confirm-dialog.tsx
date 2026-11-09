"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react";
import { humanizeTitle } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-start gap-1">
          <div
            className={`size-11 rounded-2xl flex items-center justify-center mb-2.5 transition-all ${
              isDestructive
                ? "bg-destructive/10 text-destructive ring-8 ring-destructive/5"
                : "bg-primary/10 text-primary ring-8 ring-primary/5"
            }`}
          >
            {isDestructive ? (
              <AlertTriangle className="size-5.5 stroke-[2.2]" />
            ) : (
              <HelpCircle className="size-5.5 stroke-[2.2]" />
            )}
          </div>

          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              {humanizeTitle(title)}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {humanizeTitle(description)}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer shadow-xs gap-1.5"
          >
            {isLoading && <Loader2 className="size-3.5 animate-spin" />}
            <span>{isLoading ? "Processing..." : confirmLabel}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

