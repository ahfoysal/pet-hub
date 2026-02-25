/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState, useEffect } from "react";

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  facility?: any | null;
  isSubmitting?: boolean;
}

const facilityForOptions = [
  { key: "PET", label: "Pet" },
  { key: "HUMAN", label: "Human" },
  { key: "BOTH", label: "Both" },
];

export default function FacilityModal({
  isOpen,
  onClose,
  onSubmit,
  facility,
  isSubmitting,
}: FacilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    facilityFor: "PET",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || "",
        facilityFor: facility.facilityFor || "PET",
        description: facility.description || "",
        price: facility.price?.toString() || "",
      });
    } else {
      setFormData({ name: "", facilityFor: "PET", description: "", price: "" });
    }
  }, [facility, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseInt(formData.price) || 0,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold font-nunito">
              {facility ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="text-sm text-gray-400 font-arimo">
              {facility
                ? "Update the details of this premium service."
                : "Create a new premium add-on service for your hotel."}
            </p>
          </ModalHeader>
          <ModalBody className="gap-5">
            <Input
              label="Service Name"
              placeholder="e.g. Grooming & Spa"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              isRequired
              variant="bordered"
            />
            <Select
              label="Service For"
              selectedKeys={[formData.facilityFor]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  facilityFor: e.target.value,
                }))
              }
              variant="bordered"
            >
              {facilityForOptions.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>
            <Textarea
              label="Description"
              placeholder="Describe the service..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              isRequired
              variant="bordered"
              minRows={3}
            />
            <Input
              label="Price ($)"
              type="number"
              placeholder="e.g. 45"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              isRequired
              variant="bordered"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              className="font-bold"
            >
              {facility ? "Save Changes" : "Add Service"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
