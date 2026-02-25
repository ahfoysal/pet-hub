"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  Edit,
  Trash2,
  Plus,
  Star,
  Users,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetSchoolTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} from "@/redux/features/api/dashboard/school/trainers/SchoolTrainersApi";
import { useSession } from "next-auth/react";
import CreateTrainerModal from "@/components/dashboard/school/trainers/CreateTrainerModal";
import DeleteTrainerModal from "@/components/dashboard/school/trainers/DeleteTrainerModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Trainer } from "@/types/dashboard/school/SchoolTrainersTypes";
import Image from "next/image";

export default function SchoolTrainersPage() {
  const { status } = useSession();
  const { showToast } = useToast();
  const {
    data: trainersData,
    isLoading,
    error,
    refetch,
  } = useGetSchoolTrainersQuery(undefined, { skip: status === "loading" });

  const [createTrainer] = useCreateTrainerMutation();
  const [updateTrainer] = useUpdateTrainerMutation();
  const [deleteTrainer] = useDeleteTrainerMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create trainer
  const handleCreateTrainer = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createTrainer(formData).unwrap();
      showToast("Trainer created successfully!", "success");
      setIsCreating(false);
      refetch();
    } catch (err) {
      console.error(err);
      showToast("Failed to create trainer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update trainer
  const handleUpdateTrainer = async (formData: FormData) => {
    if (!editingTrainer) return;
    setIsSubmitting(true);
    try {
      await updateTrainer({
        trainerId: editingTrainer.id,
        data: formData,
      }).unwrap();
      showToast("Trainer updated successfully!", "success");
      setIsCreating(false);
      setEditingTrainer(null);
      refetch();
    } catch (err) {
      console.error(err);
      showToast("Failed to update trainer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete trainer
  const handleDeleteTrainer = async () => {
    if (!trainerToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteTrainer(trainerToDelete.id).unwrap();
      showToast("Trainer deleted successfully!", "success");
      setTrainerToDelete(null);
      refetch();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete trainer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setIsCreating(true);
  };

  const cancelEditing = () => {
    setIsCreating(false);
    setEditingTrainer(null);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-red-800 font-semibold text-lg">
          Error loading trainers
        </h2>
        <p className="text-red-600 mt-2">
          {error instanceof Error
            ? error.message
            : "An error occurred while loading trainers."}
        </p>
      </div>
    );
  }

  const trainers = trainersData?.data.trainers || [];
  const stats = trainersData?.data.stats || {
    totalTrainers: 0,
    totalStudents: 0,
    avgRating: 0,
  };

  const statisticsValues = [
    {
      id: 1,
      title: "Total Trainers",
      icon: <Users />,
      value: stats.totalTrainers,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
    },
    {
      id: 2,
      title: "Total Students",
      icon: <GraduationCap />,
      value: stats.totalStudents,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      id: 3,
      title: "Avg Rating",
      icon: <Star />,
      value: stats.avgRating,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trainer Management</h1>
          <p className="text-gray-500">
            Manage your training staff and their schedules
          </p>
        </div>

        <Button
          text="Add New Trainer"
          onClick={() => setIsCreating(true)}
          icon={<Plus size={18} />}
          iconPosition="left"
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statisticsValues.map((item, index) => (
          <div
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            key={index}
          >
            <div className="flex items-center gap-3 ">
              <div className={`p-3 ${item.bgColor} rounded-lg`}>
                <div className={`w-6 h-6 ${item.textColor}`}>{item.icon}</div>
              </div>
              <div className="">
                <p className="text-sm text-gray-500 ">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100! flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  height={400}
                  width={400}
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{trainer.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEditing(trainer)}
                  className="p-2 text-gray-500 cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setTrainerToDelete(trainer)}
                  className="p-2 text-gray-500 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Email:</span>{" "}
                {trainer.email || "—"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {trainer.phone || "—"}
              </p>

              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">
                  SPECIALIZATIONS
                </p>
                <div className="flex flex-wrap gap-2">
                  {(trainer.specialization.length
                    ? trainer.specialization
                    : ["Obedience Training", "Puppy Training"]
                  ).map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-700 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {trainers.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>No trainers yet. Add your first trainer to get started.</p>
        </div>
      )}

      {/* Modals */}
      <CreateTrainerModal
        isOpen={isCreating}
        onClose={cancelEditing}
        onSubmit={editingTrainer ? handleUpdateTrainer : handleCreateTrainer}
        trainer={editingTrainer}
        isSubmitting={isSubmitting}
      />

      <DeleteTrainerModal
        isOpen={!!trainerToDelete}
        onClose={() => setTrainerToDelete(null)}
        onConfirm={handleDeleteTrainer}
        trainerName={trainerToDelete?.name}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
