import * as React from "react";
import Link from "next/link";
import { Building2, Briefcase, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CompanyCardProps {
  id: string;
  name: string;
  industry: string;
  location?: string;
  activeJobsCount: number;
  isVerifiedPartner?: boolean;
  className?: string;
}

export function CompanyCard({
  id,
  name,
  industry,
  location,
  activeJobsCount,
  isVerifiedPartner = false,
  className,
}: CompanyCardProps) {
  return (
    <Card
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 font-bold text-lg text-blue-900 dark:text-blue-300">
              <Building2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-foreground">{name}</h3>
                {isVerifiedPartner && (
                  <Badge variant="info" className="h-4 px-1.5 text-[10px]">
                    <CheckCircle className="size-2.5 mr-0.5 text-blue-500" />
                    <span>Partner</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{industry}</p>
            </div>
          </div>
        </div>

        {location && (
          <p className="mt-3 text-xs text-muted-foreground">
            Headquarters: <span className="text-foreground font-medium">{location}</span>
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Briefcase className="size-3.5 text-primary" />
            <span className="text-foreground font-semibold">{activeJobsCount}</span> open roles
          </span>

          <Link
            href={`/companies/${id}`}
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Explore
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

