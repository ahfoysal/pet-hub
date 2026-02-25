"use client";

import React from "react";
import { useToast } from "@/contexts/ToastContext";
import { useUpdateRoomMutation } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";
import { RoomType } from "@/types/dashboard/hotel/hotelRoomTypes";
import RoomForm from "./RoomForm";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomType | null;
}

export default function EditRoomModal({ isOpen, onClose, room }: EditRoomModalProps) {
  const { showToast } = useToast();
  const [updateRoom, { isLoading }] = useUpdateRoomMutation();

  const handleSubmit = async (formData: FormData) => {
    if (!room) return;
    try {
      await updateRoom({ roomId: room.id, data: formData }).unwrap();
      showToast("Room updated successfully", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update room", "error");
    }
  };

  if (!isOpen || !room) return null;

  return (
    <RoomForm 
      title="Edit Room"
      initialData={{
        roomName: room.roomName || "",
        roomNumber: room.roomNumber || "",
        description: room.description || "",
        roomType: room.roomType || "",
        status: room.status || "AVAILABLE",
        petCapacity: room.petCapacity?.toString() || "1",
        humanCapacity: room.humanCapacity?.toString() || "0",
        price: room.price?.toString() || "50",
        roomAmenities: room.roomAmenities || [],
        images: room.images || [],
      }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={onClose}
    />
  );
}
