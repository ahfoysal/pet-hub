"use client";

import React from "react";
import { useToast } from "@/contexts/ToastContext";
import { useCreateRoomMutation } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";
import RoomForm from "./RoomForm";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const { showToast } = useToast();
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createRoom(formData).unwrap();
      showToast("Room created successfully", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create room", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <RoomForm 
      title="Add New Room"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={onClose}
    />
  );
}
