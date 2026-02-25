import { HeroSection } from "@/components/landing/home/HeroSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Petzy Pet Care Platform",
  description:
    "Welcome to Petzy, your trusted platform for connecting pet owners with quality pet care services.",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
