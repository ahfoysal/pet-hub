import { HeroSection } from "@/components/landing/home/HeroSection";
import Navbar from "@/components/layout/Navbar";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
    </main>
  );
}
