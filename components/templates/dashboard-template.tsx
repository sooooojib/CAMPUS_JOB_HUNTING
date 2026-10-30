import * as React from "react";
import { cn } from "@/lib/utils";

interface DashboardTemplateProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  metrics?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DashboardTemplate({
  title,
  subtitle,
  actions,
  metrics,
  children,
  sidebar,
  className,
}: DashboardTemplateProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6", className)}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </div>

      {/* Metrics / Key Stats Strip (Optional) */}
      {metrics && <div>{metrics}</div>}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Feed / Content Stream */}
        <div className={cn(sidebar ? "lg:col-span-8" : "lg:col-span-12", "space-y-6")}>
          {children}
        </div>

        {/* Contextual Right Sidebar */}
        {sidebar && (
          <aside className="lg:col-span-4 space-y-6">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}

