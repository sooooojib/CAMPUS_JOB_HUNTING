import * as React from "react";
import { cn } from "@/lib/utils";

interface DetailsTemplateProps {
  breadcrumbs?: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DetailsTemplate({
  breadcrumbs,
  header,
  children,
  sidebar,
  className,
}: DetailsTemplateProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6", className)}>
      {/* Breadcrumbs Navigation */}
      {breadcrumbs && <div>{breadcrumbs}</div>}

      {/* Main Resource Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        {header}
      </div>

      {/* 2-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Resource Body */}
        <div className={cn(sidebar ? "lg:col-span-8" : "lg:col-span-12", "space-y-6")}>
          {children}
        </div>

        {/* Sticky Meta/Action Sidebar */}
        {sidebar && (
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}

