"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home, ArrowLeft } from "lucide-react";
import Button from "./ui/Button";

type ErrorType = "404" | "500" | "403" | "generic";

interface ErrorPageProps {
  title?: string;
  description?: string;
  type?: ErrorType;
  fullPage?: boolean;
  backHref?: string;
  onRetry?: () => void;
}

const ERROR_CONFIG = {
  "404": {
    title: "Page Not Found",
    description: "The page you are looking for doesn’t exist or was moved.",
  },
  "500": {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again later.",
  },
  "403": {
    title: "Access Denied",
    description: "You don’t have permission to view this page.",
  },
  generic: {
    title: "Error",
    description: "Something went wrong. Please try again.",
  },
};

export function ErrorPage({
  title,
  description,
  type = "generic",
  fullPage = true,
  backHref,
  onRetry,
}: ErrorPageProps) {
  const config = ERROR_CONFIG[type];

  return (
    <div
      className={`flex items-center justify-center ${
        fullPage ? "min-h-screen" : "min-h-[60vh]"
      }`}
    >
      <div className="text-center max-w-md px-6">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft size={16} />
            Go back
          </Link>
        )}

        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {title ?? config.title}
        </h1>

        <p className="text-gray-500 mb-6">
          {description ?? config.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
              <RefreshCcw size={16} />
              Retry
            </button>
          )}

          <Button
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <Home size={16} />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
