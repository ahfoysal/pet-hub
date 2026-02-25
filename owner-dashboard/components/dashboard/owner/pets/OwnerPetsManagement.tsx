"use client";

import {
  useGetMyPetsQuery,
  useCreatePetProfileMutation,
  useUpdatePetProfileMutation,
  useDeletePetProfileMutation,
} from "@/redux/features/api/dashboard/owner/petProfile/ownerPetProfileApi";
import {
  Button,
  Card,
  CardBody,
  Spinner,
  Image as NextUIImage,
} from "@nextui-org/react";
import { Plus, Info } from "lucide-react";
import { PetProfile } from "@/types/pet/petType";
import { useState } from "react";
import CreatePetModal from "./CreatePetModal";
import PetDetailsModal from "./PetDetailsModal";
import { toast } from "sonner";

export default function OwnerPetsManagement() {
  const { data: petsData, isLoading, refetch } = useGetMyPetsQuery();
  const [createPet] = useCreatePetProfileMutation();
  const [updatePet] = useUpdatePetProfileMutation();
  const [deletePet] = useDeletePetProfileMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pets = petsData?.data || [];

  const handleCreateOrUpdatePet = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (selectedPet) {
        await updatePet({ id: selectedPet.id, data: formData }).unwrap();
        toast.success("Pet profile updated successfully!");
      } else {
        await createPet(formData).unwrap();
        toast.success("Pet profile created successfully!");
      }
      setIsCreateOpen(false);
      setSelectedPet(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save pet profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (window.confirm("Are you sure you want to delete this pet profile?")) {
      setIsDeleting(true);
      try {
        await deletePet(petId).unwrap();
        toast.success("Pet profile deleted successfully!");
        setIsDetailsOpen(false);
        setSelectedPet(null);
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete pet profile");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const openCreateModal = () => {
    setSelectedPet(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (pet: PetProfile) => {
    setSelectedPet(pet);
    setIsDetailsOpen(false);
    setIsCreateOpen(true);
  };

  const openDetailsModal = (pet: PetProfile) => {
    setSelectedPet(pet);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-default-900">My Pets</h2>
          <p className="text-sm text-default-500">
            Manage profiles for your furry companions
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={openCreateModal}
        >
          Add New Pet
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 bg-default-50 rounded-2xl border-dashed border-2 border-default-200">
          <Info className="w-12 h-12 text-default-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-default-700">
            No Pets Found
          </h4>
          <p className="text-default-500 mt-2">
            You haven&apos;t added any pet profiles yet.
          </p>
          <Button
            color="primary"
            className="mt-6"
            startContent={<Plus className="w-4 h-4" />}
            onPress={openCreateModal}
          >
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet: PetProfile) => (
            <Card
              key={pet.id}
              className="shadow-sm border border-default-100 hover:shadow-md transition-shadow"
            >
              <CardBody className="p-0">
                <div className="relative h-48 w-full bg-default-100">
                  <NextUIImage
                    src={pet.image || "/images/placeholder-pet.jpg"}
                    alt={pet.name}
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full object-cover rounded-b-none",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-default-700 shadow-sm">
                    {pet.type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-default-900">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-default-500 mb-3">
                    {pet.breed || "Mixed Breed"}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm bg-default-50 p-3 rounded-lg">
                    <div>
                      <span className="text-default-400 block text-xs uppercase tracking-wider">
                        Age
                      </span>
                      <span className="font-medium">
                        {pet.age ? `${pet.age} yrs` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-default-400 block text-xs uppercase tracking-wider">
                        Weight
                      </span>
                      <span className="font-medium">
                        {pet.weight ? `${pet.weight} kg` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-default-400 block text-xs uppercase tracking-wider">
                        Gender
                      </span>
                      <span className="font-medium">{pet.gender || "N/A"}</span>
                    </div>
                  </div>

                  <Button
                    variant="flat"
                    color="primary"
                    className="w-full mt-4"
                    size="sm"
                    onPress={() => openDetailsModal(pet)}
                  >
                    View Full Profile
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <CreatePetModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateOrUpdatePet}
        pet={selectedPet}
        isSubmitting={isSubmitting}
      />

      <PetDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        pet={selectedPet}
        onEdit={openEditModal}
        onDelete={handleDeletePet}
        isDeleting={isDeleting}
      />
    </div>
  );
}
