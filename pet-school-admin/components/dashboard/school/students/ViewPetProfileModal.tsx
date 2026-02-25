/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { PetProfile } from "@/types/dashboard/PetProfileTypes";

interface ViewPetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  petData: PetProfile | null;
  isLoading: boolean;
}

export default function ViewPetProfileModal({
  isOpen,
  onClose,
  petData,
  isLoading,
}: ViewPetProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white border-b border-primary/20! px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">
              Pet Profile Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6 pb-20">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : petData ? (
              <div className="space-y-8">
                {/* Pet Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Pet Image */}
                  <div className="w-full sm:w-56 h-56 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                    {petData.profileImg ? (
                      <img
                        src={petData.profileImg}
                        alt={petData.petName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Name & Basic Info */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {petData.petName}
                      </h3>
                      <p className="text-gray-600 mt-1 text-lg">
                        {petData.petType} • {petData.breed}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-sm">
                      <div>
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">
                          Gender
                        </span>
                        <p className="font-medium mt-0.5">{petData.gender}</p>
                      </div>

                      <div>
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">
                          Age
                        </span>
                        <p className="font-medium mt-0.5">{petData.age}</p>
                      </div>

                      <div>
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">
                          Color
                        </span>
                        <p className="font-medium mt-0.5">{petData.color}</p>
                      </div>

                      <div>
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">
                          Weight
                        </span>
                        <p className="font-medium mt-0.5">{petData.weight}</p>
                      </div>

                      <div>
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">
                          Date of Birth
                        </span>
                        <p className="font-medium mt-0.5">
                          {new Date(petData.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vaccination Status */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">
                    Vaccination Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="text-gray-600 font-medium">Rabies</span>
                      <p className="mt-1.5 font-medium">
                        {petData.rabiesStatus}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">DHPP</span>
                      <p className="mt-1.5 font-medium">{petData.dhppStatus}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Bordetella
                      </span>
                      <p className="mt-1.5 font-medium">
                        {petData.bordetellaStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Behavior & Health */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">
                      Behavior & Compatibility
                    </h4>
                    <div className="text-sm space-y-3">
                      <div>
                        <span className="text-gray-600">Temperament:</span>
                        <p className="mt-1">{petData.temperament}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Good with kids:</span>
                        <p className="mt-1 font-medium">
                          {petData.isGoodWithKids ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Good with other pets:
                        </span>
                        <p className="mt-1 font-medium">
                          {petData.isGoodWithOtherPets ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Allergies:</span>
                        <p className="mt-1">
                          {petData.allergies || "None reported"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Care Instructions</h4>
                    <div className="text-sm space-y-3">
                      <div>
                        <span className="text-gray-600">
                          Feeding Instructions:
                        </span>
                        <p className="mt-1">{petData.feedingInstructions}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Special Notes:</span>
                        <p className="mt-1">{petData.specialNotes || "None"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Veterinary Information */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">
                    Veterinary Information
                  </h4>
                  <div className="text-sm space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium">Doctor:</span>
                      <p className="mt-1">{petData.vetDoctorName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <p className="mt-1">{petData.vetDoctorPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-medium">Pet profile not found</p>
                <p className="mt-2">
                  The selected pet information is currently unavailable.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200! px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200  text-gray-800 font-medium rounded-lg transition-colors cursor-pointer hover:bg-primary hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
