import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";
import { Star } from "lucide-react";

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  targetName: string;
  isSubmitting?: boolean;
  initialRating?: number;
  initialComment?: string;
  isEditMode?: boolean;
}

export default function CreateReviewModal({
  isOpen,
  onClose,
  onSubmit,
  targetName,
  isSubmitting,
  initialRating,
  initialComment,
  isEditMode = false,
}: CreateReviewModalProps) {
  const [rating, setRating] = useState(initialRating || 5);
  const [comment, setComment] = useState(initialComment || "");

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating || 5);
      setComment(initialComment || "");
    }
  }, [isOpen, initialRating, initialComment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isEditMode ? "Edit Review" : "Write a Review"}
            <p className="text-sm font-normal text-default-500">
              {isEditMode
                ? `Update your review for ${targetName}`
                : `Share your experience with ${targetName}`}
            </p>
          </ModalHeader>
          <ModalBody className="gap-6">
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-default-700">
                Rating
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-default-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Your Review"
              placeholder={`What did you like about ${targetName}?`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              minRows={4}
              isRequired
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              {isEditMode ? "Update Review" : "Submit Review"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
