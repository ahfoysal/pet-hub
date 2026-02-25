"use client";

import { useState, useEffect } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useUpdateFoodMutation } from "@/redux/features/api/dashboard/hotel/food/hotelFoodApi";
import {
  HotelFood,
  FOOD_TYPE_OPTIONS,
  FOOD_FOR_OPTIONS,
} from "@/types/dashboard/hotel/hotelFoodTypes";

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: HotelFood | null;
}

export default function EditFoodModal({
  isOpen,
  onClose,
  food,
}: EditFoodModalProps) {
  const { showToast } = useToast();
  const [updateFood, { isLoading }] = useUpdateFoodMutation();

  const [formData, setFormData] = useState({
    name: "",
    foodType: "",
    foodFor: "",
    description: "",
    price: "",
    numberOfServing: "",
    gramPerServing: "",
    petCategory: "",
    petBreed: "",
    calories: "",
    protein: "",
    fat: "",
    minAge: "",
    maxAge: "",
    isAvailable: true,
    ingredients: [] as string[],
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Populate form
  useEffect(() => {
    if (food && isOpen) {
      setFormData({
        name: food.name || "",
        foodType: food.foodType || "",
        foodFor: food.foodFor || "",
        description: food.description || "",
        price: food.price?.toString() || "",
        numberOfServing: food.numberOfServing?.toString() || "",
        gramPerServing: food.gramPerServing?.toString() || "",
        petCategory: food.petCategory || "",
        petBreed: food.petBreed || "",
        calories: food.calories?.toString() || "",
        protein: food.protein?.toString() || "",
        fat: food.fat?.toString() || "",
        minAge: food.minAge?.toString() || "",
        maxAge: food.maxAge?.toString() || "",
        isAvailable: food.isAvailable ?? true,
        ingredients: food.ingredients ? [...food.ingredients] : [],
      });
      setExistingImages(food.images ? [...food.images] : []);
      setNewImagePreviews([]);
      setNewImageFiles([]);
    }
  }, [food, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      setNewImageFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (val && !formData.ingredients.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, val],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast("Food name is required", "error");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("foodType", formData.foodType);
      fd.append("foodFor", formData.foodFor);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("numberOfServing", formData.numberOfServing);
      fd.append("gramPerServing", formData.gramPerServing);
      fd.append("petCategory", formData.petCategory);
      fd.append("petBreed", formData.petBreed);
      fd.append("calories", formData.calories || "0");
      fd.append("protein", formData.protein || "0");
      fd.append("fat", formData.fat || "0");
      if (formData.minAge) fd.append("minAge", formData.minAge);
      if (formData.maxAge) fd.append("maxAge", formData.maxAge);
      fd.append("isAvailable", String(formData.isAvailable));
      fd.append("ingredients", formData.ingredients.join(","));

      // Previous images to keep
      existingImages.forEach((img) => fd.append("prevImages", img));

      // New images
      newImageFiles.forEach((file) => fd.append("files", file));

      if (food) {
        await updateFood({ id: food.id, data: fd }).unwrap();
        showToast("Food updated successfully", "success");
        handleClose();
      }
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update food", "error");
    }
  };

  const handleClose = () => {
    setIngredientInput("");
    setNewImagePreviews([]);
    setNewImageFiles([]);
    onClose();
  };

  if (!isOpen || !food) return null;

  const inputStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm";
  const selectStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm appearance-none";
  const labelStyles = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Edit Food</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 pb-4 space-y-5 flex-1 overflow-y-auto">
            {/* Images */}
            <div>
              <label className={labelStyles}>Images</label>
              <div className="flex items-center gap-3 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={`existing-${i}`} className="relative">
                    <img
                      src={img}
                      alt="Food"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {newImagePreviews.map((preview, i) => (
                  <div key={`new-${i}`} className="relative">
                    <img
                      src={preview}
                      alt="New"
                      className="h-20 w-20 rounded-xl object-cover ring-2 ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="h-20 w-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Upload className="text-gray-400" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className={labelStyles}>Food Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputStyles}
                style={{ border: "none" }}
              />
            </div>

            {/* Type + For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Food Type</label>
                <div className="relative">
                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleInputChange}
                    className={selectStyles}
                    style={{ border: "none" }}
                  >
                    <option value="">Select type</option>
                    {FOOD_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label className={labelStyles}>Food For</label>
                <div className="relative">
                  <select
                    name="foodFor"
                    value={formData.foodFor}
                    onChange={handleInputChange}
                    className={selectStyles}
                    style={{ border: "none" }}
                  >
                    <option value="">Select target</option>
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

            {/* Description */}
            <div>
              <label className={labelStyles}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className={`${inputStyles} resize-none`}
                style={{ border: "none" }}
              />
            </div>

            {/* Price + Servings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>Servings</label>
                <input
                  type="number"
                  name="numberOfServing"
                  value={formData.numberOfServing}
                  onChange={handleInputChange}
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>g/Serving</label>
                <input
                  type="number"
                  name="gramPerServing"
                  value={formData.gramPerServing}
                  onChange={handleInputChange}
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Pet Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Pet Category</label>
                <input
                  type="text"
                  name="petCategory"
                  value={formData.petCategory}
                  onChange={handleInputChange}
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>Pet Breed</label>
                <input
                  type="text"
                  name="petBreed"
                  value={formData.petBreed}
                  onChange={handleInputChange}
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Nutrition */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  min="0"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>Fat (g)</label>
                <input
                  type="number"
                  name="fat"
                  value={formData.fat}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Min Age (months)</label>
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleInputChange}
                  min="0"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>Max Age (months)</label>
                <input
                  type="number"
                  name="maxAge"
                  value={formData.maxAge}
                  onChange={handleInputChange}
                  min="0"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className={labelStyles}>Ingredients</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIngredient();
                    }
                  }}
                  placeholder="Add ingredient..."
                  className={`flex-1 ${inputStyles}`}
                  style={{ border: "none" }}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
              {formData.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => removeIngredient(i)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Available for order
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isAvailable: !prev.isAvailable,
                  }))
                }
                className="flex items-center gap-2"
              >
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      formData.isAvailable ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    formData.isAvailable ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  {formData.isAvailable ? "Yes" : "No"}
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-4 pb-6 bg-white flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 order-2 sm:order-1 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors"
            >
              {isLoading ? "Updating..." : "Update Food"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
