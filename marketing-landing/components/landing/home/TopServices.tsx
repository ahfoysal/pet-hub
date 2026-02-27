"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Service {
  category: string;
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    category: "Pet Hotel",
    title: "Grooming that keeps your pet looking great.",
    description: "Secure overnight boarding with clean rooms, supervision, and round-the-clock care.",
    image: "/assets/service-hotel.png",
  },
  {
    category: "Pet Hospital",
    title: "Professional medical support anytime.",
    description: "Connect with certified vets, book check-ups, vaccinations, and urgent health services",
    image: "/assets/service-hospital.png",
  },
  {
    category: "Pet Beauty",
    title: "Professional grooming services.",
    description: "Get bathing, trimming, nail care, and full grooming packages from trusted specialists",
    image: "/assets/service-beauty.png",
  },
  {
    category: "Pet School",
    title: "Training and learning made fun.",
    description: "Enroll your pet in behaviour training, socialising sessions, and skill-building programs.",
    image: "/assets/service-school.png",
  },
  {
    category: "Pet Market",
    title: "Shop essentials delivered to your door.",
    description: "Order food, grooming supplies, and more from verified sellers.",
    image: "/assets/service-market.png",
  },
  {
    category: "Pet Sitter",
    title: "Trusted sitters for your pet’s comfort.",
    description: "Book verified caregivers for home visits, feeding, walking, and day-long companionship.",
    image: "/assets/service-sitter.png",
  },
];

export default function TopServices() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-[120px] bg-transparent overflow-hidden">
      <div className="container mx-auto px-0 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-[80px]">
          <h2 className="text-[40px] font-bold font-nunito leading-tight tracking-[-0.8px] text-[#282828] mb-4">
            Top Services for Every Pet Need
          </h2>
          <p className="text-[20px] font-normal font-montserrat text-[#828282] max-w-[800px] mx-auto">
            From daily care to emergency support, get everything your pet requires in one seamless platform.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons - Pill Styled and Outside */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-20 bg-primary/50 backdrop-blur-[10px] border border-white px-6 py-2 rounded-full text-white shadow-lg transition-all hover:bg-primary/70 active:scale-95 md:flex hidden items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-20 bg-primary/50 backdrop-blur-[10px] border border-white px-6 py-2 rounded-full text-white shadow-lg transition-all hover:bg-primary/70 active:scale-95 md:flex hidden items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 hide-scrollbar mask-fade"
            style={{ 
              scrollbarWidth: "none",
              paddingLeft: "calc((100% - 1400px) / 2)", 
              paddingRight: "calc((100% - 1400px) / 2)" 
            }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[688px] snap-center bg-white rounded-[16px] overflow-hidden shadow-[0px_8px_16px_-4px_rgba(22,34,51,0.08)] transition-all duration-500 hover:shadow-xl border border-white/50"
              >
                <div className="p-8 space-y-6">
                  {/* Image */}
                  <div className="h-[348px] relative rounded-[8px] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.category}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  {/* Category */}
                  <div className="border-[#fee] border-b pb-2">
                    <span className="text-primary text-[28px] font-bold font-nunito tracking-[-0.56px]">
                      {service.category}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="space-y-4">
                    <h3 className="text-[24px] font-medium font-nunito tracking-[-0.48px] text-[#282828]">
                      {service.title}
                    </h3>
                    <p className="text-[20px] font-normal font-montserrat text-[#828282] leading-[1.2] tracking-[-0.2px]">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
