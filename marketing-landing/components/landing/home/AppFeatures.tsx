"use client";

import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Pet Owners",
    description: "Book services, track health, manage profiles, and order essentials.",
    image: "/assets/feature-pet-owners.png",
    bgColor: "bg-[#f3e7ec]",
  },
  {
    title: "Pet Caregivers",
    description: "Provide pet sitting, walking, grooming & earn flexibly.",
    image: "/assets/feature-pet-caregivers.png",
    bgColor: "bg-[#f3e7ec]",
  },
  {
    title: "Pet Market",
    description: "Sell food, toys, and supplies to thousands of pet owners.",
    image: "/assets/feature-pet-market.png",
    bgColor: "bg-[#f3e7ec]",
  },
];

export default function AppFeatures() {
  return (
    <section id="features" className="py-[100px] bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-[40px] font-bold font-nunito leading-tight tracking-[-0.8px] text-[#282828] font-nunito">
            App <span className="text-primary">Features</span> That Every Pet Need
          </h2>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-[16px] overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className={`${feature.bgColor} h-[260px] relative w-full flex items-center justify-center p-6`}>
                <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-5">
                <div className="space-y-4">
                  <h3 className="text-[22px] font-bold font-nunito tracking-[-0.44px] text-[#282828] font-nunito">
                    {feature.title}
                  </h3>
                  <p className="text-[16px] font-normal font-montserrat text-[#828282] leading-[1.5] tracking-[-0.16px]">
                    {feature.description}
                  </p>
                </div>

                <Link 
                  href="/register" 
                  className="bg-primary border-2 border-primary text-white text-[20px] font-semibold font-nunito py-4 rounded-full text-center transition-all hover:bg-white hover:text-primary active:scale-95 shadow-md shadow-primary/20"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
