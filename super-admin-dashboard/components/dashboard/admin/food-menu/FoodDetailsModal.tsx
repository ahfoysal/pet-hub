import { X, Flame, Beef, Droplets, Tag } from "lucide-react";
import type { HotelFood } from "@/types/dashboard/hotel/hotelFoodTypes";

interface FoodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: HotelFood | null;
}

export default function FoodDetailsModal({
  isOpen,
  onClose,
  food,
}: FoodDetailsModalProps) {
  if (!isOpen || !food) return null;

  const formatFoodType = (type: string) =>
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Food Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex-1 overflow-y-auto">
            <div className="space-y-5">
              {/* Images */}
              {food.images && food.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {food.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={food.name}
                      className="h-36 w-36 rounded-xl object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Title + Badges */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{food.name}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {formatFoodType(food.foodType)}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {food.foodFor}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      food.isAvailable
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {food.description}
                </p>
              </div>

              {/* Price & Serving */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 font-medium">Price</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    ${food.price}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 font-medium">Servings</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    {food.numberOfServing}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 font-medium">g/Serving</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    {food.gramPerServing}
                  </p>
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Nutrition Facts
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-3">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="text-sm font-bold text-gray-900">
                        {food.calories}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-red-50 rounded-xl p-3">
                    <Beef className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Protein</p>
                      <p className="text-sm font-bold text-gray-900">
                        {food.protein}g
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 rounded-xl p-3">
                    <Droplets className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-500">Fat</p>
                      <p className="text-sm font-bold text-gray-900">
                        {food.fat}g
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pet Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Pet Category
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {food.petCategory}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">Pet Breed</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {food.petBreed}
                  </p>
                </div>
              </div>

              {/* Age Range */}
              {(food.minAge !== null || food.maxAge !== null) && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">Age Range</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {food.minAge ?? 0} — {food.maxAge ?? "∞"} months
                  </p>
                </div>
              )}

              {/* Ingredients */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {food.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <Tag size={10} />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
