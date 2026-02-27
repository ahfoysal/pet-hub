"use client";

import Image from "next/image";

const testimonials = [
  {
    name: "Olivia Webb",
    role: "Pet Owner",
    image: "/assets/testimonial-1.png",
    text: "Amazing app! I can manage everything for my dog in one place. The caregivers are professional and the booking process is seamless.",
    rating: 5.0,
  },
  {
    name: "Sophia Martinez",
    role: "Pet Owner",
    image: "/assets/testimonial-2.png",
    text: "Amazing app! I can manage everything for my dog in one place. The caregivers are professional and the booking process is seamless.",
    rating: 5.0,
  },
  {
    name: "Emily Chen",
    role: "Pet Owner",
    image: "/assets/testimonial-3.png",
    text: "Amazing app! I can manage everything for my dog in one place. The caregivers are professional and the booking process is seamless.",
    rating: 5.0,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-[120px] bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-[80px]">
          <h2 className="text-[40px] font-bold font-nunito leading-tight tracking-[-0.8px] text-[#282828] mb-4">
            <span className="text-primary">Feedback</span> by Pet Parents & Caregivers
          </h2>
        </div>

        {/* Scrolling Marquee Rows */}
        <div className="space-y-8 relative">
           {/* Row 1 */}
           <div className="flex gap-8 animate-marquee-left whitespace-nowrap overflow-visible">
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[491px] bg-white border border-primary/40 rounded-[16px] p-8 shadow-[0px_8px_16px_-4px_rgba(22,34,51,0.08)] transition-all duration-300 hover:border-primary">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-primary/10">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[24px] font-bold font-nunito text-[#282828] tracking-tight">
                        {t.name}
                      </h4>
                      <p className="text-[16px] font-normal font-montserrat text-[#828282]">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 shadow-sm">
                    <div className="relative w-4 h-4">
                      <Image src="/assets/star-filled.svg" alt="" fill className="object-contain brightness-0 invert" />
                    </div>
                    <span className="text-white font-bold text-sm leading-none">{t.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-[18px] font-normal font-montserrat text-[#4b5565] leading-relaxed whitespace-normal italic">
                  "{t.text}"
                </p>
              </div>
            ))}
           </div>

           {/* Row 2 */}
           <div className="flex gap-8 animate-marquee-right whitespace-nowrap overflow-visible">
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[491px] bg-white border border-primary/40 rounded-[16px] p-8 shadow-[0px_8px_16px_-4px_rgba(22,34,51,0.08)] transition-all duration-300 hover:border-primary">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-primary/10">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[24px] font-bold font-nunito text-[#282828] tracking-tight">
                        {t.name}
                      </h4>
                      <p className="text-[16px] font-normal font-montserrat text-[#828282]">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 shadow-sm">
                    <div className="relative w-4 h-4">
                      <Image src="/assets/star-filled.svg" alt="" fill className="object-contain brightness-0 invert" />
                    </div>
                    <span className="text-white font-bold text-sm leading-none">{t.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-[18px] font-normal font-montserrat text-[#4b5565] leading-relaxed whitespace-normal italic">
                  "{t.text}"
                </p>
              </div>
            ))}
           </div>
           
           {/* Fades */}
           <div className="absolute inset-y-0 left-0 w-[200px] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-[200px] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
