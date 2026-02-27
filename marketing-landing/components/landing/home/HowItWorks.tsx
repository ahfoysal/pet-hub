"use client";

import Image from "next/image";

const steps = [
  {
    number: "1",
    title: "Download the App",
    description: "Get started by downloading PawJoy from the App Store or Google Play. Create your account in minutes.",
    image: "/assets/how-it-works-1.png",
    gradient: "from-[#FEE] to-[#FFC9CC]",
  },
  {
    number: "2",
    title: "Choose a Service",
    description: "Browse through verified caregivers, professional services, or shop from our trusted vendor marketplace.",
    image: "/assets/how-it-works-2.png",
    gradient: "from-[#FEE] to-[#FFC9CC]",
  },
  {
    number: "3",
    title: "Book Instantly",
    description: "Select your preferred time add pet details, and confirm your booking with secure payment options",
    image: "/assets/how-it-works-3.png",
    gradient: "from-[#FEE] to-[#FFC9CC]",
    overlayText: "Book A Service"
  },
  {
    number: "4",
    title: "Track & Management",
    description: "Monitor live updates, chat with caregivers, and manage all your pet's needs from one dashboard.",
    image: "/assets/how-it-works-4.png",
    gradient: "from-[#FEE] to-[#FFC9CC]",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[120px] bg-transparent">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-[40px] font-bold font-nunito leading-tight tracking-[-0.8px] text-[#282828] mb-4">
            How This Platform <span className="text-primary">Help</span> Pet Lovers
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative h-[484px] rounded-[24px] overflow-hidden bg-gradient-to-b ${step.gradient} shadow-lg group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}
            >
              {/* Background Texture Illustration */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                <Image 
                  src="/assets/how-it-works-bg.png" 
                  alt="" 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Number Badge */}
              <div className="absolute top-5 right-5 w-[50px] h-[50px] rounded-full bg-white/25 border-2 border-primary/20 backdrop-blur-md flex items-center justify-center z-20">
                <span className="text-[26px] font-bold text-[#282828] leading-none">{step.number}</span>
              </div>

              {/* Central Illustration / Image */}
              <div className="absolute inset-0 flex items-center justify-center p-6 mb-20">
                <div className="relative w-full aspect-square max-w-[280px]">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill 
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Functional Center Text (For Step 3 specific design) */}
              {step.overlayText && (
                <div className="absolute top-[230px] left-0 w-full text-center z-10 px-4">
                   <p className="text-[24px] font-bold text-primary tracking-tight leading-none">
                     {step.overlayText}
                   </p>
                </div>
              )}

              {/* Bottom Content with Gradient Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 pt-24 bg-gradient-to-t from-black/60 to-transparent text-white">
                <h3 className="text-[26px] font-bold mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[15px] font-normal leading-relaxed text-white/90">
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
