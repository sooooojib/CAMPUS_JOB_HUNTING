"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[UniCareer Critical Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-slate-900 font-sans">
        <div className="max-w-md text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4 font-bold text-xl">
            !
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Critical Application Error
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            A fatal error interrupted rendering. Please refresh or reset the view.
          </p>
          <div className="mt-6">
            <button
              onClick={() => reset()}
              className="inline-flex h-9 items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-800"
            >
              Reset Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

