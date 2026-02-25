"use client";

import Button from "@/components/ui/Button";
import { getRedirectPath } from "@/lib/roleRoutes";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export function HeroSection() {
  const { data: session, status } = useSession();
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-hero">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-background/20 backdrop-blur-md border border-white/30 text-foreground text-sm font-medium mb-8 mt-12 animate-fade-in-badge">
          <span className="w-2 h-2 bg-foreground rounded-full mr-2 animate-pulse"></span>
          Pet Care Platform
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 animate-fade-in-heading">
          <span className="text-foreground">Welcome to</span>
          <br />
          <span className="inline-flex items-center justify-center flex-wrap gap-2 mt-4 sm:mt-6 md:mt-8">
            <span className="text-foreground">Petzy</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className=" xs:text-base text-sm  sm:text-xl md:text-2xl text-foreground text-balance max-w-sm sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0 animate-fade-in-subheading font-light">
          Your trusted platform for connecting pet owners with quality pet care
          services. Book, manage, and discover premium pet care solutions all in
          one place.
        </p>

        {/* CTA Buttons */}
        <div className="w-full flex justify-center">
          {session?.user?.role ? (
            <Button
              text={`${session?.user?.role} PROFILE `}
              href={getRedirectPath(session?.user?.role)}
            />
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-16 animate-fade-in-buttons">
              <Button
                text="Log in"
                variant="outline"
                href="/login"
                className="px-14"
              />

              <Button
                text="Get Started"
                href="/register"
                icon={<ChevronRight className="w-6 h-6" />}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
