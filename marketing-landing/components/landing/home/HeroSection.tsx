"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export function HeroSection() {
  const { data: session, status } = useSession();
  return (
    <section className="relative min-h-[931px] w-full pt-[200px] overflow-hidden bg-transparent">
      {/* Consolidating glow into Navbar for smoother transition */}
      {/* Background Curved Section */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-0">
        <Image 
          src="/assets/bg-circle.svg" 
          alt="" 
          width={1920} 
          height={130} 
          className="w-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Main Heading */}
        <div className="max-w-[899px] mx-auto space-y-4 mb-[60px]">
          <h1 className="text-[54px] font-bold font-nunito leading-[1.1] tracking-[-1.08px] text-[#282828] font-nunito">
            Your All-in-One <span className="text-primary">PetCare</span> Companion
          </h1>
          <p className="text-[20px] font-medium font-montserrat text-[#282828] leading-[1.2] tracking-[-0.2px] w-full mx-auto opacity-70 whitespace-nowrap">
            Book trusted caregivers, find quality pet foods & manage your pet&apos;s needs from one app.
          </p>
        </div>

        {/* Mockups Container - Simplified to Single Image */}
        <div className="relative w-full max-w-[1000px] mx-auto mt-10">
          <div className="relative w-full h-auto aspect-[1000/550]">
            <Image 
              src="/assets/hero-mockup-main.png" 
              alt="Petzy App Mockup" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
