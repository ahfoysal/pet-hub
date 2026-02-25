import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Petzy Pet Care Platform",
  description:
    "Manage your pet's daily needs, book trusted caregivers, and shop essentials — all from one powerful app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen bg-[#F2F4F8]">
      {/* Persistent Full-Width Header Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[400px] w-full overflow-hidden pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(255,113,118,0.08)_0%,transparent_90%)]" />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
