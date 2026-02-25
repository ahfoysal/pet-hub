import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  serviceName: string;
  isSubmitting?: boolean;
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  onSubmit,
  serviceName,
  isSubmitting,
}: CreateBookingModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            Book Service
            <p className="text-sm font-normal text-default-500">
              Request to book {serviceName}
            </p>
          </ModalHeader>
          <ModalBody className="gap-4">
            <Input
              type="date"
              label="Booking Date"
              placeholder="Select date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              isRequired
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                label="Start Time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                isRequired
              />
              <Input
                type="time"
                label="End Time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                isRequired
              />
            </div>
            <Textarea
              label="Special Notes"
              placeholder="Any specific requests or requirements?"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Request Booking
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
