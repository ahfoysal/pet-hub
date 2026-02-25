"use client";

import Image from "next/image";
import Link from "next/link";
import petzyLogo from "@/public/images/logo.png";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

export default function ProfilePage() {
  return (
    <main className=" bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8  ">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>
      <div
        className="w-[90vw] space-y-8 p-8 rounded-3xl border border-white mt-12 
                shadow-[0_0_4px_rgba(255,134,138,0.4)] mx-auto"
      >
        <div>
          <h2 className="mt-6 text-center text-xl md:text-3xl font-semibold text-foreground">
            Vendor Profile Information
          </h2>
          <p className="text-center text-base md:text-xl text-muted-foreground pt-1">
            Complete your profile information
          </p>
        </div>
        <ProfileSettingsForm />
      </div>
    </main>
  );
}
