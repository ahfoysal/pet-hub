"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useCreateRoomMutation } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";
import RoomForm from "@/components/dashboard/hotel/rooms/RoomForm";

export default function AddRoomPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createRoom(formData).unwrap();
      showToast("Room created successfully", "success");
      router.push("/hotel/rooms");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create room", "error");
    }
  };

  const handleCancel = () => {
    router.push("/hotel/rooms");
  };

  return (
    <RoomForm 
      title="Add New Room"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={handleCancel}
      isPage={true}
    />
  );
}
