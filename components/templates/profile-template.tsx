import * as React from "react";
import { cn } from "@/lib/utils";

interface ProfileTemplateProps {
  header: React.ReactNode;
  navTabs?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function ProfileTemplate({
  header,
  navTabs,
  children,
  sidebar,
  className,
}: ProfileTemplateProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6", className)}>
      {/* Profile Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        {header}
      </div>

      {/* Nav Tabs (About, Experience, Opportunities, Mentorship) */}
      {navTabs && <div className="border-b border-border/80">{navTabs}</div>}

      {/* 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={cn(sidebar ? "lg:col-span-8" : "lg:col-span-12", "space-y-6")}>
          {children}
        </div>

        {sidebar && (
          <aside className="lg:col-span-4 space-y-6">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}

