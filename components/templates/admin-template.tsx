import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminTemplateProps {
  title: string;
  subtitle?: string;
  statPills?: React.ReactNode;
  navTabs?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminTemplate({
  title,
  subtitle,
  statPills,
  navTabs,
  children,
  actions,
  className,
}: AdminTemplateProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6", className)}>
      {/* Admin Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-mono tracking-wider">
              <ShieldAlert className="size-3 mr-1" />
              <span>Admin Center</span>
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </div>

      {/* High-Level Queue Counters / Stat Pills */}
      {statPills && <div className="flex flex-wrap gap-3">{statPills}</div>}

      {/* Moderation Section Navigation Tabs */}
      {navTabs && <div>{navTabs}</div>}

      {/* Main Table / Queue Work Area */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}

