"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useGetMyFoodsQuery } from "@/redux/features/api/dashboard/hotel/food/hotelFoodApi";
import { HotelFood } from "@/types/dashboard/hotel/hotelFoodTypes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateFoodModal from "@/components/dashboard/hotel/food/CreateFoodModal";
import EditFoodModal from "@/components/dashboard/hotel/food/EditFoodModal";
import FoodDetailsModal from "@/components/dashboard/hotel/food/FoodDetailsModal";
import DeleteFoodModal from "@/components/dashboard/hotel/food/DeleteFoodModal";
import { useSession } from "next-auth/react";
import { 
  PageHeader, 
  SearchBar, 
  TableContainer, 
  ActionButton 
} from "@/components/dashboard/shared/DashboardUI";
import { Eye, Edit2, Trash2 } from "lucide-react";

export default function FoodManagementPage() {
  const { status: sessionStatus } = useSession();
  const { data, isLoading, isError, refetch } = useGetMyFoodsQuery(undefined, {
    skip: sessionStatus === "loading",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editFood, setEditFood] = useState<HotelFood | null>(null);
  const [detailsFoodId, setDetailsFoodId] = useState<string | null>(null);
  const [deleteFood, setDeleteFood] = useState<{ id: string; name: string } | null>(null);

  const foods = data?.data ?? [];

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [foods, searchQuery]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load food menu</h2>
          <button onClick={() => refetch()} className="px-5 py-2.5 bg-[#ff7176] text-white rounded-xl font-medium">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[25px] pb-10 px-2 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Food Menu" 
        subtitle="Manage your Food catalog" 
        action={
          <ActionButton onClick={() => setShowCreate(true)} icon="/assets/add-plus.svg">
            Add Foods
          </ActionButton>
        }
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search products..." />

      <TableContainer 
        title={
          <div className="flex items-center gap-3">
            <span>All Foods</span>
            <span className="bg-[#ff7176]/10 text-[#ff7176] text-[10px] px-2 py-0.5 rounded-full font-medium">
              {foods.length} foods
            </span>
          </div>
        }
        footer={
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-[14px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors">
              <Image src="/assets/prev-arrow.svg" alt="Prev" width={20} height={20} />
              Previous
            </button>
            <div className="flex items-center gap-[2px]">
              {[1, 2, 3, "...", 8, 9, 10].map((page, i) => (
                <button key={i} className={`w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium transition-colors ${page === 1 ? "bg-[#f9f5ff] text-[#7f56d9]" : "text-[#667085] hover:bg-gray-50"}`}>
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-[14px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors">
              Next
              <Image src="/assets/next-arrow.svg" alt="Next" width={20} height={20} />
            </button>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-[12px] font-medium text-[#667085] border-b border-[#eaecf0]">Name</th>
              <th className="px-6 py-4 text-left text-[12px] font-medium text-[#667085] border-b border-[#eaecf0]">Category</th>
              <th className="px-6 py-4 text-left text-[12px] font-medium text-[#667085] border-b border-[#eaecf0]">Price</th>
              <th className="px-6 py-4 text-right text-[12px] font-medium text-[#667085] border-b border-[#eaecf0]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {filteredFoods.map((food) => (
              <tr key={food.id} className="hover:bg-gray-50/50 transition-colors h-[72px]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      {food.images?.[0] ? (
                        <Image src={food.images[0]} alt={food.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Image src="/assets/food-menu.svg" alt="Food" width={20} height={20} className="opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-[#101828] line-clamp-1">{food.name}</span>
                      <span className="text-[14px] font-normal text-[#667085]">PRD-001</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#667085] capitalize">
                  {food.foodFor.toLowerCase()}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#667085]">
                   ${food.price}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setDetailsFoodId(food.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#667085] hover:text-[#ff7176]"><Eye size={20} /></button>
                    <button onClick={() => setEditFood(food)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#667085] hover:text-[#ff7176]"><Edit2 size={20} /></button>
                    <button onClick={() => setDeleteFood({ id: food.id, name: food.name })} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#667085] hover:text-red-500"><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>

      {/* Modals */}
      <CreateFoodModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      {editFood && <EditFoodModal isOpen={!!editFood} onClose={() => setEditFood(null)} food={editFood} />}
      {detailsFoodId && <FoodDetailsModal isOpen={!!detailsFoodId} onClose={() => setDetailsFoodId(null)} foodId={detailsFoodId} />}
      {deleteFood && <DeleteFoodModal isOpen={!!deleteFood} onClose={() => setDeleteFood(null)} food={deleteFood} />}
    </div>
  );
}
