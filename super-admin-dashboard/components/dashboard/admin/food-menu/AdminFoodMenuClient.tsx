/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetAllFoodsQuery,
  useAdminDeleteFoodMutation,
} from "@/redux/features/api/dashboard/admin/food/adminFoodApi";
import {
  Search,
  Loader2,
  Utensils,
  Trash2,
  Info,
  ChevronRight,
  Filter,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import FoodDetailsModal from "./FoodDetailsModal";

export default function AdminFoodMenuClient() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const { data: foodsData, isLoading } = useGetAllFoodsQuery({
    page: 1,
    limit: 50,
  });
  const [deleteFood] = useAdminDeleteFoodMutation();

  const foods = foodsData?.data || [];

  const filteredFoods = foods.filter(
    (food: any) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.petCategory.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this food item? This action is permanent.",
      )
    ) {
      try {
        await deleteFood(id).unwrap();
        showToast("Food item deleted successfully", "success");
      } catch (error) {
        showToast("Failed to delete food item", "error");
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Global Food Menu
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Monitor and manage all pet food options across the entire platform.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by food name or category..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-arimo text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Items",
            value: foods.length,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Available",
            value: foods.filter((f: any) => f.isAvailable).length,
            icon: Utensils,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Pet Specific",
            value: foods.filter((f: any) => f.foodFor === "PET").length,
            icon: Info,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Price Range",
            value: "$10 - $150",
            icon: ChevronRight,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-arimo font-medium">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-900 font-nunito">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-gray-400 font-arimo italic">
              Scanning platform food inventory...
            </p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="col-span-full py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-nunito font-bold">
              No matching food items found
            </p>
          </div>
        ) : (
          filteredFoods.map((food: any) => (
            <div
              key={food.id}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] w-full bg-gray-100 relative overflow-hidden">
                {food.images?.[0] ? (
                  <img
                    src={food.images[0]}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
                      food.isAvailable
                        ? "bg-green-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    {food.isAvailable ? "Available" : "Stock Out"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold font-nunito text-gray-900 line-clamp-1">
                      {food.name}
                    </h3>
                    <p className="text-xs text-primary font-bold font-arimo uppercase tracking-wider">
                      {food.petCategory} • {food.foodType.replace("_", " ")}
                    </p>
                  </div>
                  <p className="text-xl font-black text-gray-900 font-nunito">
                    ${food.price}
                  </p>
                </div>

                <p className="text-xs text-gray-500 font-arimo line-clamp-2 mb-6 leading-relaxed">
                  {food.description}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setSelectedFood(food)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-xs font-bold text-gray-600 font-arimo cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all text-xs font-bold text-orange-600 font-arimo cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA for analytics or global settings */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-200 mt-6 relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-black font-nunito">
            Food Inventory Analytics
          </h2>
          <p className="text-gray-400 mt-2 font-arimo">
            Review demand trends and dietary popularity across all pet service
            providers.
          </p>
        </div>
        <button className="relative z-10 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer">
          Global Report
        </button>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform translate-x-20"></div>
      </div>

      <FoodDetailsModal
        isOpen={!!selectedFood}
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
}
