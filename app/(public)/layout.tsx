import * as React from "react";
import { AppNavbar } from "@/components/layout/navbar";
import { AppFooter } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppNavbar />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}

