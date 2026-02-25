"use client";

import { X, Upload, Plus, Minus, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useUpdateProductMutation,
  useCreateVariantMutation,
  useUpdateVariantMutation,
} from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { useToast } from "@/contexts/ToastContext";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess?: () => void;
}

interface Variant {
  id?: string;
  tempId?: string;
  originalPrice: string;
  sellingPrice: string;
  stock: string;
  attributes: { key: string; value: string }[];
  images: File[];
  imagePreviews: string[];
  prevImages?: string[];
  isNew?: boolean;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();
  const [createVariant, { isLoading: isCreatingVariant }] =
    useCreateVariantMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] =
    useUpdateVariantMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [""],
    features: [""],
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        tags: product.tags && product.tags.length > 0 ? product.tags : [""],
        features:
          product.features && product.features.length > 0
            ? product.features
            : [""],
      });
      setImagePreviews(product.images || []);

      // Load existing variants
      if (product.variants && product.variants.length > 0) {
        const loadedVariants: Variant[] = product.variants.map((v: any) => ({
          id: v.id,
          originalPrice: v.originalPrice.toString(),
          sellingPrice: v.sellingPrice.toString(),
          stock: v.stock.toString(),
          attributes: Object.entries(v.attributes || {}).map(
            ([key, value]) => ({
              key,
              value: value as string,
            }),
          ),
          images: [],
          imagePreviews: v.images || [],
          prevImages: v.images || [],
          isNew: false,
        }));
        setVariants(loadedVariants);
      }
    }
  }, [product]);

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
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  // Variant functions
  const addVariant = () => {
    const newVariant: Variant = {
      tempId: Date.now().toString(),
      originalPrice: "",
      sellingPrice: "",
      stock: "",
      attributes: [{ key: "", value: "" }],
      images: [],
      imagePreviews: [],
      isNew: true,
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (identifier: string) => {
    setVariants(variants.filter((v) => (v.id || v.tempId) !== identifier));
  };

  const updateVariantField = (
    identifier: string,
    field: keyof Variant,
    value: any,
  ) => {
    setVariants(
      variants.map((v) =>
        (v.id || v.tempId) === identifier ? { ...v, [field]: value } : v,
      ),
    );
  };

  const addVariantAttribute = (identifier: string) => {
    const variant = variants.find((v) => (v.id || v.tempId) === identifier);
    if (variant) {
      updateVariantField(identifier, "attributes", [
        ...variant.attributes,
        { key: "", value: "" },
      ]);
    }
  };

  const updateVariantAttribute = (
    identifier: string,
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const variant = variants.find((v) => (v.id || v.tempId) === identifier);
    if (variant) {
      const newAttributes = [...variant.attributes];
      newAttributes[index] = { ...newAttributes[index], [field]: value };
      updateVariantField(identifier, "attributes", newAttributes);
    }
  };

  const removeVariantAttribute = (identifier: string, index: number) => {
    const variant = variants.find((v) => (v.id || v.tempId) === identifier);
    if (variant) {
      const newAttributes = variant.attributes.filter((_, i) => i !== index);
      updateVariantField(identifier, "attributes", newAttributes);
    }
  };

  const handleVariantImageChange = (
    identifier: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const variant = variants.find((v) => (v.id || v.tempId) === identifier);
    if (!variant) return;

    const files = Array.from(e.target.files || []);
    const newImages = [...variant.images, ...files];
    const newPreviews = [
      ...variant.imagePreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    updateVariantField(identifier, "images", newImages);
    updateVariantField(identifier, "imagePreviews", newPreviews);
  };

  const removeVariantImage = (identifier: string, index: number) => {
    const variant = variants.find((v) => (v.id || v.tempId) === identifier);
    if (!variant) return;

    const prevImagesCount = variant.prevImages?.length || 0;
    const newPreviews = variant.imagePreviews.filter((_, i) => i !== index);

    if (index < prevImagesCount) {
      // Removing a previous image
      const removedUrl = variant.imagePreviews[index];
      const newPrevImages = variant.prevImages?.filter(
        (url) => url !== removedUrl,
      );
      updateVariantField(identifier, "prevImages", newPrevImages);
    } else {
      // Removing a new image
      const newImageIndex = index - prevImagesCount;
      const newImages = variant.images.filter((_, i) => i !== newImageIndex);
      updateVariantField(identifier, "images", newImages);
    }

    updateVariantField(identifier, "imagePreviews", newPreviews);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Product description is required", "error");
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("name", formData.name);
    apiFormData.append("description", formData.description);

    const validTags = formData.tags.filter((tag) => tag.trim());
    apiFormData.append("tags", validTags.join(","));

    const validFeatures = formData.features.filter((feature) => feature.trim());
    apiFormData.append("features", validFeatures.join(","));

    images.forEach((image) => {
      apiFormData.append("images", image);
    });

    try {
      const result = await updateProduct({
        id: product.id,
        formData: apiFormData,
      }).unwrap();
      showToast(result.message || "Product updated successfully!", "success");

      // Handle variants
      await handleVariants();

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to update product", "error");
    }
  };

  const handleVariants = async () => {
    for (const variant of variants) {
      const attributesObj: { [key: string]: string } = {};
      variant.attributes.forEach((attr) => {
        if (attr.key.trim()) {
          attributesObj[attr.key.trim()] = attr.value;
        }
      });

      if (variant.isNew) {
        // Create new variant
        if (!variant.originalPrice || !variant.sellingPrice || !variant.stock) {
          continue;
        }

        const variantFormData = new FormData();
        variantFormData.append("productId", product.id);
        variantFormData.append("originalPrice", variant.originalPrice);
        variantFormData.append("sellingPrice", variant.sellingPrice);
        variantFormData.append("stock", variant.stock);
        variantFormData.append("attributes", JSON.stringify(attributesObj));

        variant.images.forEach((image) => {
          variantFormData.append("images", image);
        });

        try {
          await createVariant(variantFormData).unwrap();
        } catch (error) {
          console.error("Failed to create variant", error);
        }
      } else if (variant.id) {
        // Update existing variant
        const variantFormData = new FormData();
        variantFormData.append("originalPrice", variant.originalPrice);
        variantFormData.append("sellingPrice", variant.sellingPrice);
        variantFormData.append("stock", variant.stock);
        variantFormData.append("attributes", JSON.stringify(attributesObj));

        // Add previous images that weren't removed
        if (variant.prevImages && variant.prevImages.length > 0) {
          variantFormData.append("prevImages", variant.prevImages.join(","));
        } else {
          // If all previous images were removed, send empty string to clear them
          variantFormData.append("prevImages", "");
        }

        // Add new images
        variant.images.forEach((image) => {
          variantFormData.append("images", image);
        });

        try {
          await updateVariant({
            variantId: variant.id,
            formData: variantFormData,
          }).unwrap();
        } catch (error) {
          console.error("Failed to update variant", error);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Edit Product
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === "basic"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab("variants")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === "variants"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Variants ({variants.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-4 sm:p-6">
            {activeTab === "basic" && (
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
                    Product Images
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
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                        Click to upload new images
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
              </div>
            )}

            {activeTab === "variants" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Product Variants
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage different variations of this product
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

                {variants.map((variant, variantIndex) => (
                  <div
                    key={variant.id || variant.tempId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Variant {variantIndex + 1}
                        </h4>
                        {variant.isNew && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            New
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(variant.id || variant.tempId!)
                        }
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
                            updateVariantField(
                              variant.id || variant.tempId!,
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
                            updateVariantField(
                              variant.id || variant.tempId!,
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
                            updateVariantField(
                              variant.id || variant.tempId!,
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
                          Attributes
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            addVariantAttribute(variant.id || variant.tempId!)
                          }
                          className="text-xs text-primary hover:text-primary/80"
                        >
                          + Add Attribute
                        </button>
                      </div>
                      <div className="space-y-2">
                        {variant.attributes.map((attr, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={attr.key}
                              onChange={(e) =>
                                updateVariantAttribute(
                                  variant.id || variant.tempId!,
                                  index,
                                  "key",
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Attribute name (e.g., Size)"
                            />
                            <input
                              type="text"
                              value={attr.value}
                              onChange={(e) =>
                                updateVariantAttribute(
                                  variant.id || variant.tempId!,
                                  index,
                                  "value",
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Value (e.g., XL)"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeVariantAttribute(
                                  variant.id || variant.tempId!,
                                  index,
                                )
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Variant Images */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Variant Images
                      </label>
                      {variant.imagePreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          {variant.imagePreviews.map((preview, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={preview}
                                alt={`Variant ${variantIndex + 1} Image ${imgIndex + 1}`}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeVariantImage(
                                    variant.id || variant.tempId!,
                                    imgIndex,
                                  )
                                }
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
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
                            handleVariantImageChange(
                              variant.id || variant.tempId!,
                              e,
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}

                {variants.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">No variants added yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Variant" to create product variations
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isUpdatingProduct || isCreatingVariant || isUpdatingVariant
              }
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingProduct || isCreatingVariant || isUpdatingVariant
                ? "Updating..."
                : "Update Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
