"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/50 border-t-2 border-white pt-[66px] pb-[34px] font-montserrat">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-[48px]">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/">
              <Image 
                src="/assets/footer-logo.svg" 
                alt="Petzy" 
                width={92} 
                height={38} 
                className="h-[38px] w-auto"
              />
            </Link>
            <p className="text-[#828282] text-[16px] leading-[26px] max-w-[263px]">
              Your trusted partner for pet care, services & essentials.
            </p>
          </div>

          {/* Menu Column */}
          <div className="space-y-4">
            <h4 className="text-[16px] font-bold font-nunito text-[#282828] tracking-[-0.4px]">
              Menu
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[#828282] hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#features" className="text-[#828282] hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-[#828282] hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#faq" className="text-[#828282] hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#contact" className="text-[#828282] hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h4 className="text-[16px] font-bold font-nunito text-[#282828] tracking-[-0.4px]">
              Support
            </h4>
            <ul className="space-y-3">
              <li><Link href="/help-center" className="text-[#828282] hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="text-[#828282] hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-[#828282] hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="space-y-6 flex flex-col items-start md:items-end">
            <div className="space-y-4 w-full md:w-auto">
              <h4 className="text-[16px] font-bold font-nunito text-[#282828] tracking-[-0.4px] md:text-right">
                Connect With Us
              </h4>
              <div className="flex gap-3 md:justify-end">
                {['fb', 'ig', 'li'].map((social) => (
                  <Link key={social} href={`#${social}`} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary group transition-all">
                    <Image 
                      src={`/assets/social-${social}.svg`} 
                      alt={social} 
                      width={20} 
                      height={20} 
                      className="group-hover:brightness-0 group-hover:invert transition-all"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2 w-full max-w-[200px] md:ml-auto">
              <Link href="#" className="bg-[#282828] flex items-center gap-3 px-4 py-2 rounded-[14px] hover:bg-black transition-colors">
                <Image src="/assets/app-store.svg" alt="" width={24} height={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/80">Download on the</span>
                  <span className="text-[12px] font-medium text-white">App Store</span>
                </div>
              </Link>
              <Link href="#" className="bg-primary flex items-center gap-3 px-4 py-2 rounded-[14px] hover:bg-primary/90 transition-colors">
                <Image src="/assets/google-play.svg" alt="" width={24} height={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/80">GET IT ON</span>
                  <span className="text-[12px] font-medium text-white">Google Play</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-white pt-[34px] text-center">
          <p className="text-[#828282] text-[16px]">
            © 2025 Petzy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
