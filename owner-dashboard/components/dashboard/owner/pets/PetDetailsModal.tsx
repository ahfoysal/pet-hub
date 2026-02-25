import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { PetProfile } from "@/types/pet/petType";
import {
  Info,
  Bone,
  Scale,
  Calendar,
  Activity,
  Edit2,
  Trash2,
} from "lucide-react";
import Image from "next/image";

interface PetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetProfile | null;
  onEdit: (pet: PetProfile) => void;
  onDelete: (petId: string) => void;
  isDeleting?: boolean;
}

export default function PetDetailsModal({
  isOpen,
  onClose,
  pet,
  onEdit,
  onDelete,
  isDeleting,
}: PetDetailsModalProps) {
  if (!pet) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-6 pt-6 break-words">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold font-nunito">
                {pet.name}&apos;s Profile
              </h2>
              <div className="flex gap-2 mt-2">
                <Chip
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={<Bone className="w-3 h-3" />}
                >
                  {pet.type}
                </Chip>
                {pet.vaccinationStatus === "Up to Date" && (
                  <Chip
                    color="success"
                    variant="flat"
                    size="sm"
                    startContent={<Activity className="w-3 h-3" />}
                  >
                    Vaccinated
                  </Chip>
                )}
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="gap-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border border-default-100">
                <Image
                  src={pet.image || "/images/placeholder-pet.jpg"}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-default-50 p-4 rounded-xl">
                  <span className="flex items-center gap-2 text-default-500 text-sm font-medium mb-1">
                    <Info className="w-4 h-4" /> Breed
                  </span>
                  <span className="font-semibold text-default-900">
                    {pet.breed || "Mixed Breed"}
                  </span>
                </div>
                <div className="bg-default-50 p-4 rounded-xl">
                  <span className="flex items-center gap-2 text-default-500 text-sm font-medium mb-1">
                    <Calendar className="w-4 h-4" /> Age
                  </span>
                  <span className="font-semibold text-default-900">
                    {pet.age ? `${pet.age} Years` : "Unknown"}
                  </span>
                </div>
                <div className="bg-default-50 p-4 rounded-xl">
                  <span className="flex items-center gap-2 text-default-500 text-sm font-medium mb-1">
                    <Scale className="w-4 h-4" /> Weight
                  </span>
                  <span className="font-semibold text-default-900">
                    {pet.weight ? `${pet.weight} kg` : "Unknown"}
                  </span>
                </div>
                <div className="bg-default-50 p-4 rounded-xl">
                  <span className="flex items-center gap-2 text-default-500 text-sm font-medium mb-1">
                    <Info className="w-4 h-4" /> Gender
                  </span>
                  <span className="font-semibold text-default-900">
                    {pet.gender || "Unknown"}
                  </span>
                </div>
                <div className="bg-default-50 p-4 rounded-xl col-span-2">
                  <span className="flex items-center gap-2 text-default-500 text-sm font-medium mb-1">
                    <Activity className="w-4 h-4" /> Vaccination Status
                  </span>
                  <span className="font-semibold text-default-900">
                    {pet.vaccinationStatus || "Unknown"}
                  </span>
                </div>
              </div>

              {pet.characteristics && pet.characteristics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-default-700 mb-2">
                    Characteristics
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm text-default-600 bg-default-50 p-4 rounded-xl leading-relaxed">
                    {pet.characteristics.map((char, index) => (
                      <Chip
                        key={index}
                        variant="flat"
                        size="sm"
                        color="warning"
                      >
                        {char}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {pet.medicalHistory && (
                <div>
                  <h4 className="text-sm font-semibold text-danger-500 mb-2">
                    Medical History
                  </h4>
                  <p className="text-sm text-danger-600 bg-danger-50 p-4 rounded-xl border border-danger-100 leading-relaxed">
                    {pet.medicalHistory}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="px-6 pb-6">
          <Button
            color="danger"
            variant="flat"
            onPress={() => onDelete(pet.id)}
            isLoading={isDeleting}
            startContent={<Trash2 className="w-4 h-4" />}
          >
            Delete Pet
          </Button>
          <div className="flex-1" />
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            onPress={() => onEdit(pet)}
            startContent={<Edit2 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
