import * as React from "react";
import { cn } from "@/lib/utils";

interface ListingTemplateProps {
  title: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
  searchFilterBar?: React.ReactNode;
  activeFiltersBar?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

export function ListingTemplate({
  title,
  subtitle,
  primaryAction,
  searchFilterBar,
  activeFiltersBar,
  children,
  pagination,
  className,
}: ListingTemplateProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6", className)}>
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {primaryAction && <div>{primaryAction}</div>}
      </div>

      {/* Search & Filter Strip */}
      {searchFilterBar && <div>{searchFilterBar}</div>}

      {/* Active Filters Pill Bar */}
      {activeFiltersBar && <div>{activeFiltersBar}</div>}

      {/* Main Results Container (List or Grid) */}
      <div className="min-h-[400px]">{children}</div>

      {/* Pagination Footer */}
      {pagination && <div className="pt-4 border-t border-border/60">{pagination}</div>}
    </div>
  );
}

