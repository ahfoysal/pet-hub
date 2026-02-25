"use client";

import Image from "next/image";

const choices = [
  {
    title: "Verified Caregivers",
    description: "All caregivers undergo thorough background checks and identity verification before joining our platform.",
  },
  {
    title: "Secure Transactions",
    description: "Bank-level encryption protects all payments and personal information with industry-standard security protocols.",
  },
  {
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist with any questions or concerns.",
  },
  {
    title: "Safety Guidelines",
    description: "Comprehensive safety protocols and continuous monitoring ensure the highest standards of pet care.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-[120px] bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-[80px]">
          <h2 className="text-[40px] font-bold font-nunito leading-tight tracking-[-0.8px] text-[#282828]">
            Why Choose Us
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {choices.map((choice, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-[16px] p-8 flex flex-col items-center text-center shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="w-[64px] h-[64px] rounded-full bg-primary/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-primary group-hover:scale-110">
                <div className="relative w-8 h-8 group-hover:brightness-0 group-hover:invert">
                  <Image 
                    src="/assets/why-choose-us-icon.svg" 
                    alt="" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-4">
                <h3 className="text-[28px] font-medium font-nunito text-[#282828] tracking-[-0.56px]">
                  {choice.title}
                </h3>
                <p className="text-[18px] font-normal font-montserrat text-[#828282] leading-[26px]">
                  {choice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
