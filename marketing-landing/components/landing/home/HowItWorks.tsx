"use client";

import Image from "next/image";

const steps = [
  {
    title: "Download the App",
    description: "Get started by downloading Petzy from the App Store or Play Store.",
    icon: "/assets/how-it-works-download.svg",
  },
  {
    title: "Choose a Service",
    description: "Whether it's a hotel, vet, or grooming, select the best for your pet.",
    icon: "/assets/how-it-works-choose.svg",
  },
  {
    title: "Book Instantly",
    description: "Confirm your appointment or order with just a few clicks.",
    icon: "/assets/how-it-works-book.svg",
  },
  {
    title: "Track & Management",
    description: "Monitor your services and manage your pet's needs through the app.",
    icon: "/assets/how-it-works-track.svg",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[120px] bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-[100px]">
          <h2 className="text-[40px] font-bold font-nunito leading-tight tracking-[-0.8px] text-[#282828] mb-4">
            How This Platform <span className="text-primary">Help</span> Pet Lovers
          </h2>
          <p className="text-[20px] font-normal font-montserrat text-[#828282] max-w-[800px] mx-auto opacity-70">
            Simplicity and convenience for everything pet care.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-[60px]">
          {/* Arrow Backgrounds (Desktop only) */}
          <div className="hidden md:block absolute top-[60px] left-[calc(25%-30px)] z-0 w-[60px] opacity-20">
             <Image src="/assets/how-it-works-arrow.svg" alt="" width={60} height={20} className="w-full" />
          </div>
          <div className="hidden md:block absolute top-[60px] left-[calc(50%-30px)] z-0 w-[60px] opacity-20">
             <Image src="/assets/how-it-works-arrow.svg" alt="" width={60} height={20} className="w-full" />
          </div>
          <div className="hidden md:block absolute top-[60px] left-[calc(75%-30px)] z-0 w-[60px] opacity-20">
             <Image src="/assets/how-it-works-arrow.svg" alt="" width={60} height={20} className="w-full" />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              {/* Icon Container */}
              <div className="w-[124px] h-[124px] rounded-full bg-white border-2 border-primary/10 flex items-center justify-center mb-8 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary">
                <div className="relative w-12 h-12">
                  <Image 
                    src={step.icon} 
                    alt={step.title} 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Step Number Badge */}
              <div className="absolute top-0 right-[calc(50%-75px)] w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center border-2 border-white shadow-md">
                {index + 1}
              </div>

              {/* Text */}
              <div className="space-y-4">
                <h3 className="text-[24px] font-bold font-nunito text-[#282828]">
                  {step.title}
                </h3>
                <p className="text-[16px] font-normal font-montserrat text-[#828282] leading-[1.6]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
