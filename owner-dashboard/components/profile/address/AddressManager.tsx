"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetUserAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "@/redux/features/api/user/userAddressApi";
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { MapPin, Plus, Trash2, Edit2 } from "lucide-react";

export default function AddressManager() {
  const { showToast } = useToast();
  const {
    data: addressesData,
    isLoading,
    refetch,
  } = useGetUserAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ street: "", city: "", state: "", zipCode: "", country: "" });
    onOpen();
  };

  const handleOpenEdit = (address: any) => {
    setEditingId(address.id);
    setFormData({
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
    });
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateAddress({ id: editingId, data: formData }).unwrap();
        showToast("Address updated successfully", "success");
      } else {
        await createAddress(formData).unwrap();
        showToast("Address added successfully", "success");
      }
      onOpenChange();
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save address", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id).unwrap();
        showToast("Address deleted successfully", "success");
        refetch();
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to delete address", "error");
      }
    }
  };

  const addresses = addressesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-default-900">
            Delivery Addresses
          </h3>
          <p className="text-sm text-default-500">
            Manage where your products are shipped
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleOpenNew}
        >
          Add New Address
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-default-50 rounded-xl border-dashed border-2 border-default-200">
          <MapPin className="w-12 h-12 text-default-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-default-700">
            No Addresses Found
          </h4>
          <p className="text-default-500 mt-2">
            You haven't added any shipping addresses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address: any) => (
            <Card
              key={address.id}
              className="shadow-sm border border-default-100"
            >
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary-50 text-primary rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleOpenEdit(address)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      isLoading={isDeleting}
                      onPress={() => handleDelete(address.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 mt-4">
                  <p className="font-medium text-default-900">
                    {address.street}
                  </p>
                  <p className="text-sm text-default-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-default-500">{address.country}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingId ? "Edit Address" : "Add New Address"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  label="Street Address"
                  placeholder="Enter street address"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  isRequired
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    isRequired
                  />
                  <Input
                    label="State/Province"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal/Zip Code"
                    placeholder="Postal Code"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                  />
                  <Input
                    label="Country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isCreating || isUpdating}
                >
                  Save Address
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
