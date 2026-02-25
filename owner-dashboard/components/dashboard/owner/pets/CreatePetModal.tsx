import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { PetProfile } from "@/types/pet/petType";

interface CreatePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  pet?: PetProfile | null;
  isSubmitting: boolean;
}

const petTypes = ["DOG", "CAT", "BIRD", "RABBIT", "OTHER"];
const petGenders = ["MALE", "FEMALE", "UNKNOWN"];

export default function CreatePetModal({
  isOpen,
  onClose,
  onSubmit,
  pet,
  isSubmitting,
}: CreatePetModalProps) {
  const [formData, setFormData] = useState({
    name: pet?.name || "",
    type: pet?.type || "DOG",
    breed: pet?.breed || "",
    age: pet?.age || "",
    gender: pet?.gender || "MALE",
    weight: pet?.weight || "",
    characteristics: pet?.characteristics?.join(", ") || "",
    medicalHistory: pet?.medicalHistory || "",
    vaccinationStatus: pet?.vaccinationStatus || "Up to Date",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || "",
        type: pet.type || "DOG",
        breed: pet.breed || "",
        age: pet.age || "",
        gender: pet.gender || "MALE",
        weight: pet.weight || "",
        characteristics: pet.characteristics?.join(", ") || "",
        medicalHistory: pet.medicalHistory || "",
        vaccinationStatus: pet.vaccinationStatus || "Up to Date",
      });
    } else {
      setFormData({
        name: "",
        type: "DOG",
        breed: "",
        age: "",
        gender: "MALE",
        weight: "",
        characteristics: "",
        medicalHistory: "",
        vaccinationStatus: "Up to Date",
      });
    }
    setImageFile(null);
  }, [pet, isOpen]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "characteristics" && typeof value === "string") {
          const charArray = value
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
          charArray.forEach((char) => data.append("characteristics", char));
        } else {
          data.append(key, String(value));
        }
      }
    });

    if (imageFile) {
      data.append("file", imageFile); // NestJS interceptor expects 'file'
    }

    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {pet ? "Update Pet Profile" : "Add New Pet"}
            <p className="text-sm font-normal text-default-500">
              {pet
                ? "Update your pet's details"
                : "Create a new profile for your furry companion."}
            </p>
          </ModalHeader>
          <ModalBody className="gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Pet Name"
                placeholder="Enter pet name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                isRequired
              />
              <Select
                label="Pet Type"
                selectedKeys={[formData.type]}
                onChange={(e) => handleChange("type", e.target.value)}
                isRequired
              >
                {petTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Breed"
                placeholder="e.g. Golden Retriever"
                value={formData.breed}
                onChange={(e) => handleChange("breed", e.target.value)}
              />
              <Input
                label="Age (Years)"
                type="number"
                placeholder="e.g. 3"
                value={formData.age.toString()}
                onChange={(e) => handleChange("age", Number(e.target.value))}
              />
              <Select
                label="Gender"
                selectedKeys={[formData.gender]}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                {petGenders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="e.g. 15.5"
                value={formData.weight.toString()}
                onChange={(e) => handleChange("weight", Number(e.target.value))}
              />
            </div>

            <Input
              label="Characteristics (comma-separated)"
              placeholder="e.g. Playful, Friendly"
              value={formData.characteristics}
              onChange={(e) => handleChange("characteristics", e.target.value)}
            />

            <Textarea
              label="Medical History"
              placeholder="Any past illnesses or surgeries?"
              value={formData.medicalHistory}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
            />

            <Input
              label="Vaccination Status"
              placeholder="e.g. Up to Date, Needs boosters"
              value={formData.vaccinationStatus}
              onChange={(e) =>
                handleChange("vaccinationStatus", e.target.value)
              }
            />

            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              {pet ? "Save Changes" : "Add Pet"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
