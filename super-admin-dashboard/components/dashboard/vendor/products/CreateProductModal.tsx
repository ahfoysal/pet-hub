"use client";

import { X, Upload, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  useCreateProductMutation,
  useCreateVariantMutation,
} from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { useToast } from "@/contexts/ToastContext";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Variant {
  tempId: string;
  originalPrice: string;
  sellingPrice: string;
  stock: string;
  attributes: { key: string; value: string }[];
  images: File[];
  imagePreviews: string[];
}

// Removed AttributeField interface - using inline type now

export default function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const [createProduct, { isLoading: isCreatingProduct }] =
    useCreateProductMutation();
  const [createVariant, { isLoading: isCreatingVariant }] =
    useCreateVariantMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    petCategory: "",
    tags: [""],
    features: [""],
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [currentStep, setCurrentStep] = useState<"product" | "variants">(
    "product",
  );

  // Use ref to always have access to latest variants in async functions
  const variantsRef = useRef<Variant[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    variantsRef.current = variants;
    if (variants.length > 0) {
    }
  }, [variants]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ""] });
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Variant functions
  const addVariant = () => {
    const newVariant: Variant = {
      tempId: Date.now().toString(),
      originalPrice: "",
      sellingPrice: "",
      stock: "",
      attributes: [],
      images: [],
      imagePreviews: [],
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (tempId: string) => {
    setVariants(variants.filter((v) => v.tempId !== tempId));
  };

  const updateVariant = (tempId: string, field: keyof Variant, value: any) => {
    // ⚠️ FIX: Use functional setState to avoid stale state closure
    setVariants((prevVariants) =>
      prevVariants.map((v) =>
        v.tempId === tempId ? { ...v, [field]: value } : v,
      ),
    );
  };

  const addVariantAttribute = (tempId: string) => {
    const variant = variants.find((v) => v.tempId === tempId);
    if (variant) {
      updateVariant(tempId, "attributes", [
        ...variant.attributes,
        { key: "", value: "" },
      ]);
    }
  };

  const updateVariantAttribute = (
    tempId: string,
    index: number,
    field: "key" | "value",
    newValue: string,
  ) => {
    const variant = variants.find((v) => v.tempId === tempId);
    if (variant) {
      const newAttributes = [...variant.attributes];
      newAttributes[index] = { ...newAttributes[index], [field]: newValue };
      updateVariant(tempId, "attributes", newAttributes);
    }
  };

  const removeVariantAttribute = (tempId: string, index: number) => {
    const variant = variants.find((v) => v.tempId === tempId);
    if (variant) {
      const newAttributes = variant.attributes.filter((_, i) => i !== index);
      updateVariant(tempId, "attributes", newAttributes);
    }
  };

  const handleVariantImageChange = (
    tempId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const variant = variants.find((v) => v.tempId === tempId);
    if (!variant) {
      console.error("❌ Variant not found!");
      return;
    }

    const files = Array.from(e.target.files || []);

    const newImages = [...variant.images, ...files];
    const newPreviews = [
      ...variant.imagePreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    updateVariant(tempId, "images", newImages);
    updateVariant(tempId, "imagePreviews", newPreviews);
  };

  const removeVariantImage = (tempId: string, index: number) => {
    const variant = variants.find((v) => v.tempId === tempId);
    if (!variant) return;

    const newImages = variant.images.filter((_, i) => i !== index);
    const newPreviews = variant.imagePreviews.filter((_, i) => i !== index);

    updateVariant(tempId, "images", newImages);
    updateVariant(tempId, "imagePreviews", newPreviews);
  };

  const handleCreateProduct = async () => {
    // Validation
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Product description is required", "error");
      return;
    }
    if (!formData.category.trim()) {
      showToast("Product category is required", "error");
      return;
    }
    if (!formData.petCategory.trim()) {
      showToast("Pet category is required", "error");
      return;
    }
    if (images.length === 0) {
      showToast("At least one product image is required", "error");
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("name", formData.name);
    apiFormData.append("description", formData.description);
    apiFormData.append("category", formData.category);
    apiFormData.append("petCategory", formData.petCategory);

    const validTags = formData.tags.filter((tag) => tag.trim());
    apiFormData.append("tags", validTags.join(","));

    const validFeatures = formData.features.filter((feature) => feature.trim());
    apiFormData.append("features", validFeatures.join(","));

    images.forEach((image) => {
      apiFormData.append("images", image);
    });

    try {
      const result = await createProduct(apiFormData).unwrap();
      showToast(result.message || "Product created successfully!", "success");

      // If there are variants, move to variant step
      if (variants.length > 0) {
        setCurrentStep("variants");
        // Create all variants
        await createAllVariants(result.data.id);
      } else {
        resetAndClose();
      }
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to create product", "error");
    }
  };

  const createAllVariants = async (productId: string) => {
    // ⚠️ FIX: Use ref to get the LATEST variants state (avoid stale closure)
    const currentVariants = variantsRef.current;

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < currentVariants.length; i++) {
      const variant = currentVariants[i];

      // Validate required fields including images
      if (!variant.originalPrice || !variant.sellingPrice || !variant.stock) {
        console.warn(`Variant ${i + 1} skipped: Missing price or stock`);
        failCount++;
        errors.push(`Variant ${i + 1}: Missing price or stock information`);
        continue;
      }

      // Check for required images (backend requirement)
      if (!variant.images || variant.images.length === 0) {
        console.warn(`Variant ${i + 1} skipped: No images provided`);
        failCount++;
        errors.push(`Variant ${i + 1}: At least one image is required`);
        continue;
      }

      const variantFormData = new FormData();
      variantFormData.append("productId", productId);
      variantFormData.append("originalPrice", variant.originalPrice);
      variantFormData.append("sellingPrice", variant.sellingPrice);
      variantFormData.append("stock", variant.stock);

      // Convert array attributes to object format for API
      const attributesObj: { [key: string]: string } = {};
      variant.attributes.forEach((attr) => {
        if (attr.key.trim()) {
          attributesObj[attr.key.trim()] = attr.value;
        }
      });
      const attributesJson = JSON.stringify(attributesObj);
      variantFormData.append("attributes", attributesJson);

      variant.images.forEach((image, idx) => {
        variantFormData.append("images", image);
      });

      // Log FormData contents for debugging
      for (const [key, value] of variantFormData.entries()) {
        if (value instanceof File) {
        } else {
        }
      }

      try {
        const result = await createVariant(variantFormData).unwrap();
        successCount++;
      } catch (error: any) {
        console.error("✗ Variant creation failed:", error);
        console.error("Error details:", {
          status: error?.status,
          data: error?.data,
          message: error?.data?.message || error?.message,
        });
        failCount++;
        const errorMsg =
          error?.data?.message || error?.message || "Unknown error";
        errors.push(`Variant ${i + 1}: ${errorMsg}`);
      }
    }

    if (errors.length > 0) {
    }

    if (successCount > 0) {
      showToast(`${successCount} variant(s) created successfully!`, "success");
    }
    if (failCount > 0) {
      // Show the first error with more context
      const errorMsg =
        errors.length > 0 ? errors[0] : "Some variants failed to create";
      showToast(errorMsg, "error");
    }

    resetAndClose();
  };

  const resetAndClose = () => {
    // Trigger refetch of product list before closing
    if (onSuccess) {
      onSuccess();
    }

    onClose();
    setFormData({
      name: "",
      description: "",
      category: "",
      petCategory: "",
      tags: [""],
      features: [""],
    });
    setImages([]);
    setImagePreviews([]);
    setVariants([]);
    setCurrentStep("product");
  };

  const handleNext = async () => {
    if (currentStep === "product") {
      await handleCreateProduct();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-1">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {currentStep === "product"
                  ? "Create New Product"
                  : "Adding Variants"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {currentStep === "product"
                  ? "Step 1: Product Information"
                  : "Step 2: Product Variants (Processing...)"}
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 sm:p-6">
            {currentStep === "product" && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Enter product description"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Category{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Food, Toys"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pet Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="petCategory"
                          value={formData.petCategory}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Dog, Cat"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Tags
                    </h3>
                    <button
                      type="button"
                      onClick={addTag}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Tag
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) =>
                            handleTagChange(index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter tag"
                        />
                        {formData.tags.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Features
                    </h3>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter feature"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Product Images <span className="text-red-500">*</span>
                  </h3>
                  <div className="space-y-4">
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 cursor-pointer bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload images
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 10MB
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Variants Section */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Product Variants
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Add different variations of this product (size, color,
                        etc.)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {variants.map((variant, variantIndex) => (
                      <div
                        key={variant.tempId}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Variant {variantIndex + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.tempId)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Pricing and Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Original Price *
                            </label>
                            <input
                              type="number"
                              value={variant.originalPrice}
                              onChange={(e) =>
                                updateVariant(
                                  variant.tempId,
                                  "originalPrice",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Selling Price *
                            </label>
                            <input
                              type="number"
                              value={variant.sellingPrice}
                              onChange={(e) =>
                                updateVariant(
                                  variant.tempId,
                                  "sellingPrice",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Stock *
                            </label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(
                                  variant.tempId,
                                  "stock",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Attributes */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-700">
                              Attributes (e.g., size, color)
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                addVariantAttribute(variant.tempId)
                              }
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              + Add Attribute
                            </button>
                          </div>
                          <div className="space-y-2">
                            {variant.attributes.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={attr.key}
                                  onChange={(e) =>
                                    updateVariantAttribute(
                                      variant.tempId,
                                      attrIndex,
                                      "key",
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  placeholder="Attribute (e.g., Size, Color)"
                                />
                                <input
                                  type="text"
                                  value={attr.value}
                                  onChange={(e) =>
                                    updateVariantAttribute(
                                      variant.tempId,
                                      attrIndex,
                                      "value",
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  placeholder="Value (e.g., Large, Red)"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariantAttribute(
                                      variant.tempId,
                                      attrIndex,
                                    )
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {variant.attributes.length === 0 && (
                              <p className="text-xs text-gray-400 italic">
                                Click "+ Add Attribute" to add size, color, etc.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Variant Images */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Variant Images *
                          </label>
                          <p className="text-xs text-gray-500 mb-2">
                            At least one image is required per variant
                          </p>
                          {variant.imagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              {variant.imagePreviews.map(
                                (preview, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative group"
                                  >
                                    <img
                                      src={preview}
                                      alt={`Variant ${variantIndex + 1} Image ${imgIndex + 1}`}
                                      className="w-full aspect-square object-cover rounded-lg"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeVariantImage(
                                          variant.tempId,
                                          imgIndex,
                                        )
                                      }
                                      className="absolute top-1 right-1 p-1 cursor-pointer bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <Upload className="h-6 w-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-600">
                              Upload variant images
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) =>
                                handleVariantImageChange(variant.tempId, e)
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ))}

                    {variants.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No variants added yet</p>
                        <p className="text-xs mt-1">
                          Click "Add Variant" to create product variations
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === "variants" && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Creating variants...</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentStep === "product" && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={isCreatingProduct || isCreatingVariant}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingProduct || isCreatingVariant
                  ? "Creating..."
                  : "Create Product"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
