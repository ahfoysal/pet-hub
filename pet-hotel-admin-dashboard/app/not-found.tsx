import ErrorPage from "@/components/ErrorComponent";

export default function NotFound() {
  return <ErrorPage type="404" backHref="/dashboard" />;
}
