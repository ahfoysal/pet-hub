/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Save, X } from "lucide-react";
import { Trainer } from "@/types/dashboard/school/SchoolTrainersTypes";
import FileUpload from "@/components/ui/FileUpload";
import { E164Number, parsePhoneNumber } from "libphonenumber-js";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import Image from "next/image";

interface CreateTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  trainer?: Trainer | null | undefined;
  isSubmitting: boolean;
}

const CreateTrainerModal: React.FC<CreateTrainerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trainer,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    name: trainer?.name || "",
    email: trainer?.email || "",
    phone: trainer?.phone || "",
    specialization: trainer?.specialization || [],
  });

  const [specializationInput, setSpecializationInput] = useState(
    trainer?.specialization?.join(", ") || "",
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Update form data when trainer prop changes
  useEffect(() => {
    if (trainer) {
      // Parse phone number to E.164 format if it exists
      let phoneE164 = "";
      if (trainer.phone) {
        try {
          const parsed = parsePhoneNumber(trainer.phone);
          phoneE164 = parsed?.format("E.164") || trainer.phone;
        } catch {
          phoneE164 = trainer.phone;
        }
      }

      setFormData({
        name: trainer.name || "",
        email: trainer.email || "",
        phone: phoneE164,
        specialization: trainer.specialization || [],
      });
      setSpecializationInput(trainer.specialization?.join(", ") || "");
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: [],
      });
      setSpecializationInput("");
    }
    setImageFile(null);
  }, [trainer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const handlePhoneChange = (value?: E164Number) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));
  };

  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setSpecializationInput(value);
    // Convert comma-separated string to array
    const specializationArray = value
      .split(",")
      .map((spec) => spec.trim())
      .filter((spec) => spec !== "");
    setFormData((prev) => ({ ...prev, specialization: specializationArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);

    // Append specialization array
    formData.specialization.forEach((spec) => {
      submitData.append("specialization", spec);
    });

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      <div
        className="fixed inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-primary/20! px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {trainer ? "Edit Trainer" : "Create New Trainer"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Trainer Name"
                placeholder="Enter trainer name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter email address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <PhoneNumberInput
                label="Phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
                containerClassName="md:col-span-2"
              />
              <div className="md:col-span-2">
                <Input
                  label="Specializations (comma-separated)"
                  type="text"
                  placeholder='e.g. "Obedience Training, Behavioral Training"'
                  value={specializationInput}
                  onChange={handleSpecializationChange}
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Profile Image"
                description="PNG, JPG, GIF (MAX. 5MB)"
                onFileSelect={handleImageChange} // No more type error
                preview={true}
                maxSizeMB={5}
                acceptedTypes="image/*"
              />

              {/* Show existing image only if a new one hasn't been picked yet */}
              {!imageFile && trainer?.image && (
                <div className="mt-4">
                  <p className="text-sm text-foreground mb-2">Current Photo:</p>
                  <Image
                    height={1000}
                    width={1000}
                    src={trainer.image}
                    alt="Current profile"
                    className="w-32 h-32 object-cover rounded-md border border-border"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                text={
                  isSubmitting
                    ? "Saving..."
                    : trainer
                      ? "Update Trainer"
                      : "Create Trainer"
                }
                className="cursor-pointer"
                type="submit"
                variant="primary"
                icon={<Save size={16} />}
                disabled={isSubmitting}
              />
              <Button
                text="Cancel"
                type="button"
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrainerModal;
