import { HeroSection } from "@/components/landing/home/HeroSection";
import AppFeatures from "@/components/landing/home/AppFeatures";
import TopServices from "@/components/landing/home/TopServices";
import HowItWorks from "@/components/landing/home/HowItWorks";
import Testimonials from "@/components/landing/home/Testimonials";
import WhyChooseUs from "@/components/landing/home/WhyChooseUs";
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
      <AppFeatures />
      <TopServices />
      <HowItWorks />
      <Testimonials />
      <WhyChooseUs />
    </main>
  );
}
