import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, DollarSign, User, Info } from "lucide-react";

interface OwnerBookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function OwnerBookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: OwnerBookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex justify-between items-center pr-6">
            <h2 className="text-xl font-bold font-nunito">Booking Details</h2>
            <Chip
              color={
                booking.status === "COMPLETED"
                  ? "success"
                  : booking.status === "PENDING"
                    ? "warning"
                    : "danger"
              }
              variant="flat"
            >
              {booking.status}
            </Chip>
          </div>
          <p className="text-sm font-arimo text-gray-500">ID: #{booking.id}</p>
        </ModalHeader>
        <ModalBody className="gap-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Segment */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase font-arimo tracking-wider">
                  Date
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  {booking.createdAt
                    ? format(new Date(booking.createdAt), "MMMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Time Segment */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase font-arimo tracking-wider">
                  Duration
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  10:00 AM - 02:00 PM{" "}
                  {/* Note: Replace with real start/end time when integrated */}
                </p>
              </div>
            </div>

            {/* Sitter Segment */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-4">
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase font-arimo tracking-wider">
                  Pet Sitter
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  {booking.petSitter?.fullName || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Amount Segment */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-4">
              <div className="bg-green-500/10 p-3 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase font-arimo tracking-wider">
                  Total Amount
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  ${booking.totalPrice || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h4 className="font-bold text-gray-900">Location Details</h4>
            </div>
            <p className="text-sm text-gray-600 font-arimo leading-relaxed">
              {booking.petSitter?.user?.address ||
                "Location details not available for this sitter."}
            </p>
          </div>

          {booking.notes && (
            <div className="bg-amber-50 p-5 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-amber-900">Special Notes</h4>
              </div>
              <p className="text-sm text-amber-700 font-arimo leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
