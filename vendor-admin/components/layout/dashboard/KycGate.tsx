"use client";

import { useSession } from "next-auth/react";
import { useGetKycStatusQuery } from "@/redux/features/api/profile/kycSubmitApi";
import {
  ShieldCheck,
  Clock,
  ShieldX,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface KycGateProps {
  children: React.ReactNode;
}

export default function KycGate({ children }: KycGateProps) {
  const { data: session, status: sessionStatus } = useSession();
  const userRole = session?.user?.role;

  // Admin and pet owners skip KYC check
  // But we only allow this IF we are authenticated and know the role
  const skipKyc =
    sessionStatus === "authenticated" &&
    (userRole === "ADMIN" || userRole === "PET_OWNER");

  const {
    data: kycData,
    isLoading,
    isError,
    error,
  } = useGetKycStatusQuery(undefined, {
    skip: skipKyc || sessionStatus !== "authenticated",
  });

  // 1. Initial Loading (Session)
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

  // Admin / pet owner / unauthenticated → render children (middleware handles unauthenticated)
  if (skipKyc || sessionStatus !== "authenticated") return <>{children}</>;

  // Loading KYC status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  const kycStatus = kycData?.data?.status;

  // No KYC submitted (API error / 404)
  if (isError || !kycData?.data) {
    return (
      <GateScreen
        icon={<FileText className="h-12 w-12 text-primary" />}
        iconBg="bg-primary/10"
        title="Verification Required"
        description="To access your dashboard, you need to complete your identity verification (KYC). This helps us maintain a safe and trusted platform for all users."
        actionLabel="Complete Verification"
        actionHref="https://auth-pethub-rnc.vercel.app/kyc-verification"
        statusTag="Action Required"
        statusTagColor="bg-amber-50 text-amber-600"
      />
    );
  }

  // KYC is approved → render dashboard
  if (kycStatus === "APPROVED") {
    return <>{children}</>;
  }

  // KYC is pending
  if (kycStatus === "PENDING") {
    return (
      <GateScreen
        icon={<Clock className="h-12 w-12 text-amber-500" />}
        iconBg="bg-amber-50"
        title="Verification In Progress"
        description="Your identity verification is currently being reviewed by our team. This process typically takes 1-2 business days. You'll receive a notification once your verification is complete."
        statusTag="Under Review"
        statusTagColor="bg-amber-50 text-amber-600"
        showProgress
      />
    );
  }

  // KYC is rejected
  if (kycStatus === "REJECTED") {
    return (
      <GateScreen
        icon={<ShieldX className="h-12 w-12 text-red-500" />}
        iconBg="bg-red-50"
        title="Verification Unsuccessful"
        description="Unfortunately, your identity verification was not approved. This could be due to incomplete documents or mismatched information. Please resubmit your verification with accurate details."
        actionLabel="Resubmit Verification"
        actionHref={`${process.env.NEXT_PUBLIC_AUTH_URL}/kyc-verification`}
        statusTag="Rejected"
        statusTagColor="bg-red-50 text-red-500"
      />
    );
  }

  // Fallback
  return <>{children}</>;
}

// ─── Gate Screen UI ────────────────────────────────────────────────

interface GateScreenProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  statusTag: string;
  statusTagColor: string;
  showProgress?: boolean;
}

function GateScreen({
  icon,
  iconBg,
  title,
  description,
  actionLabel,
  actionHref,
  statusTag,
  statusTagColor,
  showProgress,
}: GateScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10 text-center">
          {/* Icon */}
          <div
            className={`w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}
          >
            {icon}
          </div>

          {/* Status Tag */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${statusTagColor}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusTag}
          </span>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
            {description}
          </p>

          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Submitted</span>
                <span>Under Review</span>
                <span>Completed</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: "50%" }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              {actionLabel}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Help Link */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Need help?{" "}
          <a href="#" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
