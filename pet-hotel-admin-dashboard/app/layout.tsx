import type { Metadata } from "next";

import "./globals.css";
import AuthSync from "@/components/auth/AuthSync";
import AppProviders from "@/providers/AppProviders";
import { Arimo, Montserrat, Plus_Jakarta_Sans } from "next/font/google";

export const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arimo",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Petzy | Caring for paws , claws and tails",
  description:
    "Manage your pet's daily needs, book trusted caregivers, and shop essentials — all from one powerful app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${arimo.variable} ${montserrat.variable} ${plusJakartaSans.variable}`}>
      <body
        className={`${nunito.variable} font-nunito`}
        suppressHydrationWarning
      >
        <AppProviders>
          <AuthSync />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
