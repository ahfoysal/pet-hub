/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetTopServicesAndPackagesQuery } from "@/redux/features/api/dashboard/owner/summary/ownerSummaryApi";
import { useCreateSitterBookingMutation } from "@/redux/features/api/dashboard/owner/sitterBooking/ownerSitterBookingApi";
import {
  Search,
  Loader2,
  Star,
  Briefcase,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CreateBookingModal from "./CreateBookingModal";
import { toast } from "sonner";

export default function OwnerServicesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingService, setBookingService] = useState<any | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const { data, isLoading } = useGetTopServicesAndPackagesQuery();
  const [createSitterBooking] = useCreateSitterBookingMutation();

  const handleCreateBooking = async (formData: any) => {
    if (!bookingService) return;
    setIsBookingSubmitting(true);
    try {
      await createSitterBooking({
        petSitterId: bookingService.petSitterId || bookingService.id,
        ...formData,
      }).unwrap();
      toast.success("Booking requested successfully!");
      setBookingService(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create booking");
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const services = data?.data?.topServices || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Discover Services
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Find the best care, training, and grooming for your furry friends.
          </p>
        </div>

        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="What service are you looking for?"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-arimo text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="font-arimo italic text-lg">
            Finding the best services for you...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-arimo">
                No services matching your search were found.
              </p>
            </div>
          ) : (
            services.map((service: any) => (
              <div
                key={service.id}
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={
                      service.image ||
                      `https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800`
                    }
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-900">
                      {service.rating?.toFixed(1) || "4.8"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary/95 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                      {service.category || "General Service"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 font-nunito mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-arimo line-clamp-2 mb-4 leading-relaxed">
                      {service.description ||
                        "Premium pet care service tailored to your pet's specific needs and comfort."}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-arimo">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Available in your area</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-arimo">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Instant Booking Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-arimo uppercase tracking-wider font-bold">
                        Starts at
                      </p>
                      <p className="text-xl font-black text-gray-900 font-nunito leading-none mt-1">
                        ${service.price || "45"}
                        <span className="text-sm font-normal text-gray-400">
                          /hr
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setBookingService(service)}
                      className="bg-gray-900 hover:bg-primary text-white p-3 rounded-2xl transition-all shadow-md active:scale-95 group/btn"
                    >
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Categories Overlay / More Section */}
      {!isLoading && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-10 mt-12 text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold font-nunito mb-4">
              Request a Custom Service
            </h2>
            <p className="text-gray-300 font-arimo mb-8 text-lg">
              Can't find exactly what you need? Tell us your requirements and
              we'll match you with the perfect specialized provider.
            </p>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold font-nunito hover:bg-primary hover:text-white transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
              Get Started Now
            </button>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 hidden lg:block">
            <Briefcase className="w-64 h-64 -mr-20 -mt-10 rotate-12" />
          </div>
        </div>
      )}

      <CreateBookingModal
        isOpen={!!bookingService}
        onClose={() => setBookingService(null)}
        onSubmit={handleCreateBooking}
        serviceName={bookingService?.name || "the service"}
        isSubmitting={isBookingSubmitting}
      />
    </div>
  );
}
