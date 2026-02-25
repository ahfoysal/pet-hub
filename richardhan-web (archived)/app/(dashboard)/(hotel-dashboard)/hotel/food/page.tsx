"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  DollarSign,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useGetMyFoodsQuery } from "@/redux/features/api/dashboard/hotel/food/hotelFoodApi";
import {
  HotelFood,
  FOOD_TYPE_OPTIONS,
  FOOD_FOR_OPTIONS,
} from "@/types/dashboard/hotel/hotelFoodTypes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateFoodModal from "@/components/dashboard/hotel/food/CreateFoodModal";
import EditFoodModal from "@/components/dashboard/hotel/food/EditFoodModal";
import FoodDetailsModal from "@/components/dashboard/hotel/food/FoodDetailsModal";
import DeleteFoodModal from "@/components/dashboard/hotel/food/DeleteFoodModal";
import { useSession } from "next-auth/react";

export default function FoodManagementPage() {
  const { status } = useSession();
  const { data, isLoading, isError, refetch } = useGetMyFoodsQuery(undefined, {
    skip: status === "loading",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFor, setFilterFor] = useState("");

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [editFood, setEditFood] = useState<HotelFood | null>(null);
  const [detailsFoodId, setDetailsFoodId] = useState<string | null>(null);
  const [deleteFood, setDeleteFood] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const foods = data?.data ?? [];

  // Filtered foods
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchSearch = f.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchType = !filterType || f.foodType === filterType;
      const matchFor = !filterFor || f.foodFor === filterFor;
      return matchSearch && matchType && matchFor;
    });
  }, [foods, searchQuery, filterType, filterFor]);

  // Stats
  const totalFoods = foods.length;
  const availableFoods = foods.filter((f) => f.isAvailable).length;
  const unavailableFoods = foods.filter((f) => !f.isAvailable).length;
  const avgPrice =
    foods.length > 0
      ? (foods.reduce((sum, f) => sum + (f.price || 0), 0) / foods.length).toFixed(2)
      : "0.00";

  const formatFoodType = (type: string) =>
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load food items
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Foods",
      value: totalFoods,
      icon: UtensilsCrossed,
      bgClass: "bg-blue-50",
      textClass: "text-blue-500",
    },
    {
      label: "Available",
      value: availableFoods,
      icon: CheckCircle2,
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-500",
    },
    {
      label: "Unavailable",
      value: unavailableFoods,
      icon: XCircle,
      bgClass: "bg-red-50",
      textClass: "text-red-500",
    },
    {
      label: "Avg Price",
      value: `$${avgPrice}`,
      icon: DollarSign,
      bgClass: "bg-purple-50",
      textClass: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
            Food Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your hotel&apos;s food menu
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm sm:self-start"
        >
          <Plus size={18} />
          <span>Add Food</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {card.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div
                className={`order-1 sm:order-2 p-2.5 sm:p-3.5 ${card.bgClass} rounded-xl w-fit transition-transform duration-300 group-hover:scale-110`}
              >
                <card.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textClass}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food items..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
              style={{ border: "none" }}
            />
          </div>
          {/* Type filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm appearance-none"
              style={{ border: "none" }}
            >
              <option value="">All Types</option>
              {FOOD_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatFoodType(opt)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
          {/* For filter */}
          <div className="relative">
            <select
              value={filterFor}
              onChange={(e) => setFilterFor(e.target.value)}
              className="w-full sm:w-36 px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm appearance-none"
              style={{ border: "none" }}
            >
              <option value="">All For</option>
              {FOOD_FOR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredFoods.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {foods.length === 0 ? "No food items yet" : "No results found"}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {foods.length === 0
              ? "Start by adding your first food item."
              : "Try adjusting your search or filters."}
          </p>
          {foods.length === 0 && (
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Add Food
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Food
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      For
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Servings
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((food) => (
                    <tr
                      key={food.id}
                      className="hover:bg-gray-50/50 transition-colors"
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {food.images?.[0] ? (
                            <img
                              src={food.images[0]}
                              alt={food.name}
                              className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <UtensilsCrossed className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {food.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {formatFoodType(food.foodType)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {food.foodFor}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ${food.price}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {food.numberOfServing}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            food.isAvailable
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {food.isAvailable ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {food.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailsFoodId(food.id)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditFood(food)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteFood({ id: food.id, name: food.name })
                            }
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  {food.images?.[0] ? (
                    <img
                      src={food.images[0]}
                      alt={food.name}
                      className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="h-7 w-7 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {food.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {formatFoodType(food.foodType)}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {food.foodFor}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          food.isAvailable
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-gray-900">
                        ${food.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailsFoodId(food.id)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditFood(food)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteFood({ id: food.id, name: food.name })
                          }
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <CreateFoodModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
      <EditFoodModal
        isOpen={!!editFood}
        onClose={() => setEditFood(null)}
        food={editFood}
      />
      <FoodDetailsModal
        isOpen={!!detailsFoodId}
        onClose={() => setDetailsFoodId(null)}
        foodId={detailsFoodId}
      />
      <DeleteFoodModal
        isOpen={!!deleteFood}
        onClose={() => setDeleteFood(null)}
        food={deleteFood}
      />
    </div>
  );
}
