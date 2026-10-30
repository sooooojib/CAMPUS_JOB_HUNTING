import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <FileQuestion className="size-7" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        The requested resource does not exist or has been relocated within the UniCareer Community platform.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className={buttonVariants({ variant: "default" })}
        >
          <ArrowLeft className="size-4 mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

