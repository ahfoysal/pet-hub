"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { getRedirectPath } from "@/lib/roleRoutes";
import LoadingSpinner from "../ui/LoadingSpinner";

interface AlreadyLoggedInProps {
  session: Session;
}

export default function AlreadyLoggedIn({ session }: AlreadyLoggedInProps) {
  const router = useRouter();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const handleRedirect = () => {
    if (session?.user?.role) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(getRedirectPath(session.user.role));
      }
    } else {
      router.push("/select-role");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>

      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-3xl border border-border text-center">
          <div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">
              You&apos;re Already Signed In!
            </h2>
            <p className="mt-2 text-muted-foreground">
              You&apos;re currently logged in as{" "}
              <span className="font-semibold">{session?.user?.email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full rounded-xl"
              onClick={() => handleRedirect()}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Want to sign in with a different account?
            </p>
            <button
              onClick={async () => {
                // Sign out and redirect to login
                const { signOut } = await import("next-auth/react");
                signOut({ callbackUrl: "/" });
              }}
              className="mt-2 text-red-400 hover:text-red-500 underline cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
