import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { PlayCircle, VideoOff } from "lucide-react";

interface OwnerLiveFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function OwnerLiveFeedModal({
  isOpen,
  onClose,
  booking,
}: OwnerLiveFeedModalProps) {
  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-primary" />
          Live Feed for #{booking.id.slice(-8).toUpperCase()}
        </ModalHeader>
        <ModalBody className="pb-6">
          {booking.status === "COMPLETED" ? (
            <div className="bg-gray-900 w-full aspect-video rounded-2xl flex flex-col items-center justify-center text-gray-500">
              <VideoOff className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-bold font-nunito">Live Feed Unavailable</p>
              <p className="text-sm font-arimo mt-1">
                This booking is already completed.
              </p>
            </div>
          ) : booking.status === "PENDING" ? (
            <div className="bg-gray-900 w-full aspect-video rounded-2xl flex flex-col items-center justify-center text-gray-500">
              <VideoOff className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-bold font-nunito">Live Feed Offline</p>
              <p className="text-sm font-arimo mt-1">
                The live feed will start when the session is active.
              </p>
            </div>
          ) : (
            <div className="bg-gray-900 w-full aspect-video rounded-2xl flex flex-col items-center justify-center text-gray-500 relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity">
                <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              </div>
              <p className="absolute bottom-4 left-4 z-20 text-white/50 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{" "}
                Live
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button color="danger" variant="flat" onPress={onClose}>
              Close Feed
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
