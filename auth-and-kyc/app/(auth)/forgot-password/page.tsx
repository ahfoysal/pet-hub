import ForgotPasswordForm from "@/components/auth/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full items-center justify-center min-h-[calc(100vh-100px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
