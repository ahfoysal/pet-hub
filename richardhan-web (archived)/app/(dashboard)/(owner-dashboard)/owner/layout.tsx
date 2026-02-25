import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";

export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <DashboardLayout>
        <div className="lg:pl-4">{children}</div>
      </DashboardLayout>
    </main>
  );
}
