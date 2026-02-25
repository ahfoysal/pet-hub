import Navbar from "@/components/layout/Navbar";
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
    <main>
      <Navbar />
      {children}
    </main>
  );
}
