import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized Access - Petzy",
  description: "You don't have permission to access this page",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl border border-border text-center">
        <div>
          <h2 className="mt-6 text-2xl font-extrabold text-foreground">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-foreground/80">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
