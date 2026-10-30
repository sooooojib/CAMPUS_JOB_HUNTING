import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormTemplateProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: React.ReactNode;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function FormTemplate({
  title,
  subtitle,
  breadcrumbs,
  children,
  footerActions,
  maxWidth = "lg",
  className,
}: FormTemplateProps) {
  const widthClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full",
  }[maxWidth];

  return (
    <div className={cn("container mx-auto px-4 py-8 sm:px-6 space-y-6", widthClasses, className)}>
      {breadcrumbs && <div>{breadcrumbs}</div>}

      <Card className="rounded-2xl border border-border/80 bg-card shadow-xs">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </CardTitle>
          {subtitle && (
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {children}

          {footerActions && (
            <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-end gap-3">
              {footerActions}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

