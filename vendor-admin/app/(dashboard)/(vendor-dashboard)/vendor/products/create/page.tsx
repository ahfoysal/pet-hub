"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateProductMutation,
  useCreateVariantMutation,
} from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { useToast } from "@/contexts/ToastContext";
import { 
  X, 
  Upload, 
  Plus, 
  Minus, 
  Trash2, 
  Calendar as CalendarIcon,
  ChevronLeft
} from "lucide-react";
import { 
  FormGroup, 
  TextInput, 
  TextArea, 
  CustomSelect, 
  ImageUploadArea, 
  ChipInput,
  ActionButton,
  PageHeader
} from "@/components/dashboard/shared/DashboardUI";

interface Variant {
  tempId: string;
  originalPrice: string;
  sellingPrice: string;
  finalPrice?: string;
  discountRate?: string;
  stock: string;
  sku?: string;
  stockUnit?: string;
  attributes: { key: string; value: string }[];
  images: File[];
  imagePreviews: string[];
}

export default function CreateProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [createVariant, { isLoading: isCreatingVariant }] = useCreateVariantMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    petCategory: "",
    brandName: "",
    manufacturingDate: "",
    expiryDate: "",
    countryOfOrigin: [] as string[],
    tags: [] as string[],
    features: [] as string[],
    originalPrice: "",
    sellingPrice: "",
    discountRate: "",
    finalPrice: "",
    stock: "",
    sku: "",
    stockUnit: "Pieces",
    lowStockThreshold: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");

  const variantsRef = useRef<Variant[]>([]);
  useEffect(() => {
    variantsRef.current = variants;
  }, [variants]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === "originalPrice" || name === "discountRate") {
      const original = name === "originalPrice" ? parseFloat(value) : parseFloat(formData.originalPrice);
      const discount = name === "discountRate" ? parseFloat(value) : parseFloat(formData.discountRate);
      if (!isNaN(original) && !isNaN(discount)) {
        newFormData.finalPrice = (original - (original * discount) / 100).toFixed(2);
      }
    } else if (name === "finalPrice") {
      const final = parseFloat(value);
      const original = parseFloat(formData.originalPrice);
      if (!isNaN(final) && !isNaN(original) && original !== 0) {
        newFormData.discountRate = (((original - final) / original) * 100).toFixed(2);
      }
    }
    setFormData(newFormData);
  };

  const handleChipAdd = (field: "countryOfOrigin" | "tags" | "features", value: string) => {
    if (!value || formData[field].includes(value)) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
  };

  const removeChip = (field: "countryOfOrigin" | "tags" | "features", index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setImages(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const newVariant: Variant = {
      tempId: Date.now().toString(),
      originalPrice: formData.originalPrice,
      sellingPrice: formData.sellingPrice,
      finalPrice: formData.finalPrice,
      discountRate: formData.discountRate,
      stock: formData.stock,
      sku: formData.sku,
      stockUnit: formData.stockUnit,
      attributes: [],
      images: [],
      imagePreviews: [],
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const removeVariant = (tempId: string) => {
    setVariants(prev => prev.filter(v => v.tempId !== tempId));
  };

  const updateVariantField = (tempId: string, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map(v => {
      if (v.tempId === tempId) {
        let updated = { ...v, [field]: value };
        if (field === "originalPrice" || field === "discountRate") {
          const original = field === "originalPrice" ? parseFloat(value) : parseFloat(v.originalPrice);
          const discount = field === "discountRate" ? parseFloat(value) : parseFloat(v.discountRate || "0");
          if (!isNaN(original) && !isNaN(discount)) {
            updated.finalPrice = (original - (original * discount) / 100).toFixed(2);
          }
        }
        return updated;
      }
      return v;
    }));
  };

  const handleCreateAllVariants = async (productId: string) => {
    const currentVariants = variantsRef.current;
    for (const variant of currentVariants) {
      if (!variant.originalPrice || !variant.sellingPrice || !variant.stock) continue;
      const vData = new FormData();
      vData.append("productId", productId);
      vData.append("originalPrice", variant.originalPrice);
      vData.append("sellingPrice", variant.sellingPrice);
      vData.append("stock", variant.stock);
      vData.append("sku", variant.sku || "");
      vData.append("stockUnit", variant.stockUnit || "Pieces");
      const attrs: Record<string, string> = {};
      variant.attributes.forEach(attr => { if (attr.key) attrs[attr.key] = attr.value; });
      vData.append("attributes", JSON.stringify(attrs));
      variant.images.forEach(img => vData.append("images", img));
      try {
        await createVariant(vData).unwrap();
      } catch (err) {
        console.error("Failed to create variant", err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return showToast("Product name is required", "error");
    if (!formData.category) return showToast("Category is required", "error");
    if (images.length === 0) return showToast("At least one product image is required", "error");

    const apiFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) apiFormData.append(key, value.join(","));
      else if (value) apiFormData.append(key, value);
    });
    images.forEach(image => apiFormData.append("images", image));

    try {
      const result = await createProduct(apiFormData).unwrap();
      if (variants.length > 0) {
        await handleCreateAllVariants(result.data.id);
      }
      showToast("Product created successfully", "success");
      router.push("/vendor/products");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showToast(err?.data?.message || "Failed to create product", "error");
    }
  };

  return (
    <div className="pb-10 font-arimo">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => router.push("/vendor/products")}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <PageHeader title="Create New Product" subtitle="Fill in the details to add a new product to your catalog" />
      </div>

      <div className="bg-[#f2f4f8] p-1 flex border-b border-[#e5e7eb] rounded-t-[14px]">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 py-3 text-[14px] font-medium rounded-md transition-all ${
            activeTab === "basic" ? "bg-white text-[#ff7176] shadow-sm" : "text-[#6a7282] hover:text-[#0a0a0a]"
          }`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab("variants")}
          className={`flex-1 py-3 text-[14px] font-medium rounded-md transition-all ${
            activeTab === "variants" ? "bg-white text-[#ff7176] shadow-sm" : "text-[#6a7282] hover:text-[#0a0a0a]"
          }`}
        >
          Variants ({variants.length})
        </button>
      </div>

      <div className="p-6 bg-white border border-[#e5e7eb] border-t-0 rounded-b-[14px] shadow-sm">
        {activeTab === "basic" ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Product Name" required>
                <TextInput name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Premium Dog Food" />
              </FormGroup>
              <FormGroup label="Brand Name">
                <TextInput name="brandName" value={formData.brandName} onChange={handleInputChange} placeholder="e.g. Petzy" />
              </FormGroup>
              <FormGroup label="Category" required>
                <CustomSelect 
                  value={formData.category} 
                  onChange={(val) => setFormData(prev => ({ ...prev, category: val }))} 
                  options={[
                    { label: "Food", value: "Food" },
                    { label: "Toys", value: "Toys" },
                    { label: "Accessories", value: "Accessories" },
                    { label: "Grooming", value: "Grooming" }
                  ]} 
                />
              </FormGroup>
              <FormGroup label="Pet Category">
                <CustomSelect 
                  value={formData.petCategory} 
                  onChange={(val) => setFormData(prev => ({ ...prev, petCategory: val }))} 
                  options={[
                    { label: "Dog", value: "Dog" },
                    { label: "Cat", value: "Cat" },
                    { label: "Bird", value: "Bird" },
                    { label: "Fish", value: "Fish" }
                  ]} 
                />
              </FormGroup>
            </div>

            <FormGroup label="Description" required>
              <TextArea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell your customers about this product..." rows={4} />
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormGroup label="Manufacturing Date">
                <TextInput type="date" name="manufacturingDate" value={formData.manufacturingDate} onChange={handleInputChange} prefix={<CalendarIcon size={18} />} />
              </FormGroup>
              <FormGroup label="Expiry Date">
                <TextInput type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} prefix={<CalendarIcon size={18} />} />
              </FormGroup>
              <FormGroup label="Country of Origin">
                <ChipInput 
                  chips={formData.countryOfOrigin} 
                  onAdd={(val) => handleChipAdd("countryOfOrigin", val)} 
                  onRemove={(idx) => removeChip("countryOfOrigin", idx)} 
                  placeholder="e.g. USA" 
                />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Pricing (Base)">
                <div className="grid grid-cols-2 gap-4">
                  <TextInput name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="Original Price" prefix={<span className="text-[14px] font-medium">$</span>} />
                  <TextInput name="discountRate" value={formData.discountRate} onChange={handleInputChange} placeholder="Discount %" prefix={<span className="text-[14px] font-medium">%</span>} />
                </div>
              </FormGroup>
              <FormGroup label="Final Selling Price">
                <TextInput name="finalPrice" value={formData.finalPrice} onChange={handleInputChange} placeholder="Final Price" prefix={<span className="text-[14px] font-medium">$</span>} />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormGroup label="Stock Quantity">
                <TextInput type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" />
              </FormGroup>
              <FormGroup label="Stock Unit">
                <TextInput name="stockUnit" value={formData.stockUnit} onChange={handleInputChange} placeholder="Pieces, Bags, etc." />
              </FormGroup>
              <FormGroup label="SKU">
                <TextInput name="sku" value={formData.sku} onChange={handleInputChange} placeholder="Product SKU" />
              </FormGroup>
              <FormGroup label="Low Stock Threshold">
                <TextInput type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleInputChange} placeholder="10" />
              </FormGroup>
            </div>

            <FormGroup label="Product Images" required>
              <ImageUploadArea 
                onUpload={handleImageUpload} 
                imagePreviews={imagePreviews} 
                onRemoveImage={removeImage} 
                multiple 
              />
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Tags">
                <ChipInput chips={formData.tags} onAdd={(v) => handleChipAdd("tags", v)} onRemove={(i) => removeChip("tags", i)} placeholder="Add tags..." />
              </FormGroup>
              <FormGroup label="Product Highlights">
                <ChipInput chips={formData.features} onAdd={(v) => handleChipAdd("features", v)} onRemove={(i) => removeChip("features", i)} placeholder="Add highlight..." />
              </FormGroup>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-[#f9fafb] p-4 rounded-xl border border-[#eaecf0]">
              <div>
                <h3 className="text-[16px] font-semibold text-[#101828]">Product Variants</h3>
                <p className="text-[12px] text-[#667085]">Add different sizes, colors, or options for this product.</p>
              </div>
              <button 
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d1d5dc] rounded-lg text-[14px] font-medium text-[#364153] hover:bg-gray-50 transition-all shadow-sm"
              >
                <Plus size={18} />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-6">
              {variants.map((variant) => (
                <div key={variant.tempId} className="border border-[#e5e7eb] rounded-[14px] p-6 space-y-6 relative group">
                  <button 
                    onClick={() => removeVariant(variant.tempId)}
                    className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-[14px] font-medium text-[#101828]">Variant Details</p>
                      <div className="grid grid-cols-2 gap-4">
                        <FormGroup label="Original Price">
                          <TextInput value={variant.originalPrice} onChange={(e) => updateVariantField(variant.tempId, "originalPrice", e.target.value)} placeholder="0.00" prefix={<span className="text-[12px]">$</span>} />
                        </FormGroup>
                        <FormGroup label="Selling Price">
                          <TextInput value={variant.sellingPrice} onChange={(e) => updateVariantField(variant.tempId, "sellingPrice", e.target.value)} placeholder="0.00" prefix={<span className="text-[12px]">$</span>} />
                        </FormGroup>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormGroup label="Stock">
                          <TextInput type="number" value={variant.stock} onChange={(e) => updateVariantField(variant.tempId, "stock", e.target.value)} placeholder="0" />
                        </FormGroup>
                        <FormGroup label="SKU">
                          <TextInput value={variant.sku || ""} onChange={(e) => updateVariantField(variant.tempId, "sku", e.target.value)} placeholder="SKU" />
                        </FormGroup>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[14px] font-medium text-[#101828]">Variant Images</p>
                      <ImageUploadArea 
                        onUpload={(files) => handleVariantImageChange(variant.tempId, files)} 
                        imagePreviews={variant.imagePreviews} 
                        onRemoveImage={(i) => removeVariantImage(variant.tempId, i)} 
                        multiple 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[14px] font-medium text-[#101828]">Attributes</p>
                      <button 
                        onClick={() => addVariantAttribute(variant.tempId)}
                        className="text-[12px] text-[#ff7176] hover:underline"
                      >
                        + Add Attribute
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {variant.attributes.map((attr, aIdx) => (
                        <div key={aIdx} className="flex gap-2 items-end">
                          <TextInput value={attr.key} onChange={(e) => updateVariantAttribute(variant.tempId, aIdx, "key", e.target.value)} placeholder="Key (e.g. Size)" />
                          <TextInput value={attr.value} onChange={(e) => updateVariantAttribute(variant.tempId, aIdx, "value", e.target.value)} placeholder="Value (e.g. Large)" />
                          <button 
                            onClick={() => removeVariantAttribute(variant.tempId, aIdx)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Minus size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {variants.length === 0 && (
                <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-[#e5e7eb] rounded-[14px]">
                  <p className="text-[#667085]">No variants added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-[#e5e7eb]">
          <button 
            onClick={() => router.push("/vendor/products")}
            className="px-8 py-[10px] border border-[#d1d5dc] rounded-[10px] text-[#364153] font-medium hover:bg-gray-50 transition-all font-inter"
          >
            Cancel
          </button>
          <ActionButton onClick={handleSubmit} disabled={isCreatingProduct || isCreatingVariant} className="px-10">
            {isCreatingProduct ? "Creating..." : "Create Product"}
          </ActionButton>
        </div>
      </div>
    </div>
  );

  function updateVariantAttribute(tempId: string, index: number, field: "key" | "value", newValue: string) {
    setVariants(prev => prev.map(v => {
      if (v.tempId === tempId) {
        const newAttributes = [...v.attributes];
        newAttributes[index] = { ...newAttributes[index], [field]: newValue };
        return { ...v, attributes: newAttributes };
      }
      return v;
    }));
  }

  function addVariantAttribute(tempId: string) {
    setVariants(prev => prev.map(v => v.tempId === tempId ? { ...v, attributes: [...v.attributes, { key: "", value: "" }] } : v));
  }

  function removeVariantAttribute(tempId: string, index: number) {
    setVariants(prev => prev.map(v => v.tempId === tempId ? { ...v, attributes: v.attributes.filter((_, i) => i !== index) } : v));
  }

  function handleVariantImageChange(tempId: string, files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setVariants(prev => prev.map(v => v.tempId === tempId ? { ...v, images: [...v.images, ...newFiles], imagePreviews: [...v.imagePreviews, ...newPreviews] } : v));
  }

  function removeVariantImage(tempId: string, index: number) {
    setVariants(prev => prev.map(v => v.tempId === tempId ? { ...v, images: v.images.filter((_, i) => i !== index), imagePreviews: v.imagePreviews.filter((_, i) => i !== index) } : v));
  }
}
