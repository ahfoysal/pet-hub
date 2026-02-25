"use client";

import { useState } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useCreateFoodMutation } from "@/redux/features/api/dashboard/hotel/food/hotelFoodApi";
import {
  FOOD_TYPE_OPTIONS,
  FOOD_FOR_OPTIONS,
} from "@/types/dashboard/hotel/hotelFoodTypes";

interface CreateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFoodModal({
  isOpen,
  onClose,
}: CreateFoodModalProps) {
  const { showToast } = useToast();
  const [createFood, { isLoading }] = useCreateFoodMutation();

  const [formData, setFormData] = useState({
    name: "",
    foodType: "" as string,
    foodFor: "" as string,
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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
      setImageFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      showToast("Food name is required", "error");
      return;
    }
    if (!formData.foodType) {
      showToast("Food type is required", "error");
      return;
    }
    if (!formData.foodFor) {
      showToast("Food for is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Description is required", "error");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("Price must be greater than 0", "error");
      return;
    }
    if (!formData.numberOfServing || parseInt(formData.numberOfServing) < 1) {
      showToast("Number of servings is required", "error");
      return;
    }
    if (!formData.gramPerServing || parseFloat(formData.gramPerServing) <= 0) {
      showToast("Gram per serving is required", "error");
      return;
    }
    if (!formData.petCategory.trim()) {
      showToast("Pet category is required", "error");
      return;
    }
    if (!formData.petBreed.trim()) {
      showToast("Pet breed is required", "error");
      return;
    }
    if (formData.ingredients.length === 0) {
      showToast("At least one ingredient is required", "error");
      return;
    }
    if (imageFiles.length === 0) {
      showToast("Please upload at least one image", "error");
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
      imageFiles.forEach((file) => fd.append("files", file));

      await createFood(fd).unwrap();
      showToast("Food created successfully", "success");
      handleClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create food", "error");
    }
  };

  const handleClose = () => {
    setFormData({
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
      ingredients: [],
    });
    setIngredientInput("");
    setImagePreviews([]);
    setImageFiles([]);
    onClose();
  };

  if (!isOpen) return null;

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
            <h2 className="text-xl font-bold text-gray-900">Add New Food</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-4 space-y-5 flex-1 overflow-y-auto"
          >
            {/* Images */}
            <div>
              <label className={labelStyles}>
                Images <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img
                      src={preview}
                      alt="Food"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
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
              <label className={labelStyles}>
                Food Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Dog Food"
                className={inputStyles}
                style={{ border: "none" }}
              />
            </div>

            {/* Type + For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className={labelStyles}>
                  Food Type <span className="text-red-500">*</span>
                </label>
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
              <div className="relative">
                <label className={labelStyles}>
                  Food For <span className="text-red-500">*</span>
                </label>
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
              <label className={labelStyles}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the food..."
                rows={2}
                className={`${inputStyles} resize-none`}
                style={{ border: "none" }}
              />
            </div>

            {/* Price + Servings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="499"
                  min="0"
                  step="0.01"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>
                  Servings <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="numberOfServing"
                  value={formData.numberOfServing}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>
                  g/Serving <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="gramPerServing"
                  value={formData.gramPerServing}
                  onChange={handleInputChange}
                  placeholder="250"
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Pet Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>
                  Pet Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="petCategory"
                  value={formData.petCategory}
                  onChange={handleInputChange}
                  placeholder="Dog"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>
                  Pet Breed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="petBreed"
                  value={formData.petBreed}
                  onChange={handleInputChange}
                  placeholder="Golden Retriever"
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
                  placeholder="350"
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
                  placeholder="24.5"
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
                  placeholder="12.3"
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
                  placeholder="3"
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
                  placeholder="120"
                  min="0"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className={labelStyles}>
                Ingredients <span className="text-red-500">*</span>
              </label>
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
          </form>

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
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors"
            >
              {isLoading ? "Creating..." : "Create Food"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
