"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetProductQuery,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useUpdateVariantMutation,
} from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { useToast } from "@/contexts/ToastContext";
import { 
  Plus, 
  Minus, 
  Trash2, 
  Calendar as CalendarIcon,
  ChevronLeft,
  AlertCircle
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
  id?: string;
  tempId?: string;
  originalPrice: string;
  sellingPrice: string;
  discountRate?: string;
  finalPrice?: string;
  stock: string;
  sku?: string;
  stockUnit?: string;
  attributes: { key: string; value: string }[];
  images: File[];
  imagePreviews: string[];
  prevImages?: string[];
  isNew?: boolean;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data: productData, isLoading: isLoadingProduct, isError } = useGetProductQuery({ productId: id as string });
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
  const [createVariant, { isLoading: isCreatingVariant }] = useCreateVariantMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] = useUpdateVariantMutation();

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

  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        petCategory: product.petCategory || "",
        brandName: product.brandName || "",
        manufacturingDate: product.manufacturingDate || "",
        expiryDate: product.expiryDate || "",
        countryOfOrigin: Array.isArray(product.countryOfOrigin) ? product.countryOfOrigin : (product.countryOfOrigin ? product.countryOfOrigin.split(",") : []),
        tags: Array.isArray(product.tags) ? product.tags : (product.tags ? product.tags.split(",") : []),
        features: Array.isArray(product.features) ? product.features : (product.features ? product.features.split(",") : []),
        originalPrice: product.originalPrice?.toString() || "",
        sellingPrice: product.sellingPrice?.toString() || "",
        discountRate: product.discountRate?.toString() || "",
        finalPrice: product.finalPrice?.toString() || "",
        stock: product.stock?.toString() || "",
        sku: product.sku || "",
        stockUnit: product.stockUnit || "Pieces",
        lowStockThreshold: product.lowStockThreshold?.toString() || "",
      });
      setImagePreviews(product.images || []);

      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map((v: any) => ({
          id: v.id,
          originalPrice: v.originalPrice.toString(),
          sellingPrice: v.sellingPrice.toString(),
          discountRate: v.discountRate?.toString() || "",
          finalPrice: v.finalPrice?.toString() || "",
          stock: v.stock.toString(),
          sku: v.sku || "",
          attributes: Object.entries(v.attributes || {}).map(([key, value]) => ({ key, value: value as string })),
          images: [],
          imagePreviews: v.images || [],
          prevImages: v.images || [],
        })));
      }
    }
  }, [productData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    if (name === "originalPrice" || name === "discountRate") {
      const original = name === "originalPrice" ? parseFloat(value) : parseFloat(formData.originalPrice);
      const discount = name === "discountRate" ? parseFloat(value) : parseFloat(formData.discountRate);
      if (!isNaN(original) && !isNaN(discount)) newFormData.finalPrice = (original - (original * discount) / 100).toFixed(2);
    } else if (name === "finalPrice") {
      const final = parseFloat(value);
      const original = parseFloat(formData.originalPrice);
      if (!isNaN(final) && !isNaN(original) && original !== 0) newFormData.discountRate = (((original - final) / original) * 100).toFixed(2);
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
      isNew: true,
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => (v.id || v.tempId) !== id));
  };

  const updateVariantField = (id: string, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map(v => {
      if ((v.id || v.tempId) === id) {
        let updated = { ...v, [field]: value };
        if (field === "originalPrice" || field === "discountRate") {
          const original = field === "originalPrice" ? parseFloat(value) : parseFloat(v.originalPrice);
          const discount = field === "discountRate" ? parseFloat(value) : parseFloat(v.discountRate || "0");
          if (!isNaN(original) && !isNaN(discount)) updated.finalPrice = (original - (original * discount) / 100).toFixed(2);
        }
        return updated;
      }
      return v;
    }));
  };

  const handleSubmit = async () => {
    const apiFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) apiFormData.append(key, value.join(","));
      else if (value) apiFormData.append(key, value);
    });
    images.forEach(image => apiFormData.append("images", image));

    try {
      await updateProduct({ id: id as string, formData: apiFormData }).unwrap();
      
      for (const variant of variants) {
        const vData = new FormData();
        vData.append("originalPrice", variant.originalPrice);
        vData.append("sellingPrice", variant.sellingPrice);
        vData.append("stock", variant.stock);
        if (variant.sku) vData.append("sku", variant.sku);
        const attrs: Record<string, string> = {};
        variant.attributes.forEach(attr => { if (attr.key) attrs[attr.key] = attr.value; });
        vData.append("attributes", JSON.stringify(attrs));
        variant.images.forEach(img => vData.append("images", img));

        if (variant.id) {
          await updateVariant({ variantId: variant.id, formData: vData }).unwrap();
        } else if (variant.isNew) {
          vData.append("productId", id as string);
          await createVariant(vData).unwrap();
        }
      }

      showToast("Product updated successfully", "success");
      router.push(`/vendor/products/${id}`);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showToast(err?.data?.message || "Failed to update product", "error");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  if (isError || !productData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-gray-900 font-medium">Failed to load product</p>
          <button onClick={() => router.push("/vendor/products")} className="mt-4 text-[#ff7176] hover:underline">Back to Products</button>
        </div>
      </div>
    );
  }

  const isLoading = isUpdatingProduct || isCreatingVariant || isUpdatingVariant;

  return (
    <div className="pb-10 font-arimo">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => router.push(`/vendor/products/${id}`)}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <PageHeader title="Edit Product" subtitle={`Updating: ${productData.data.name}`} />
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
                <p className="text-[12px] text-[#667085]">Manage different sizes, colors, or options.</p>
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
                <div key={variant.id || variant.tempId} className="border border-[#e5e7eb] rounded-[14px] p-6 space-y-6 relative group">
                  <button 
                    onClick={() => removeVariant((variant.id || variant.tempId)!)}
                    className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-[14px] font-medium text-[#101828]">Variant Details</p>
                      <div className="grid grid-cols-2 gap-4">
                        <FormGroup label="Original Price">
                          <TextInput value={variant.originalPrice} onChange={(e) => updateVariantField((variant.id || variant.tempId)!, "originalPrice", e.target.value)} placeholder="0.00" prefix={<span className="text-[12px]">$</span>} />
                        </FormGroup>
                        <FormGroup label="Selling Price">
                          <TextInput value={variant.sellingPrice} onChange={(e) => updateVariantField((variant.id || variant.tempId)!, "sellingPrice", e.target.value)} placeholder="0.00" prefix={<span className="text-[12px]">$</span>} />
                        </FormGroup>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormGroup label="Stock">
                          <TextInput type="number" value={variant.stock} onChange={(e) => updateVariantField((variant.id || variant.tempId)!, "stock", e.target.value)} placeholder="0" />
                        </FormGroup>
                        <FormGroup label="SKU">
                          <TextInput value={variant.sku || ""} onChange={(e) => updateVariantField((variant.id || variant.tempId)!, "sku", e.target.value)} placeholder="SKU" />
                        </FormGroup>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[14px] font-medium text-[#101828]">Variant Images</p>
                      <ImageUploadArea 
                        onUpload={(files) => handleVariantImageChange((variant.id || variant.tempId)!, files)} 
                        imagePreviews={variant.imagePreviews} 
                        onRemoveImage={(i) => removeVariantImage((variant.id || variant.tempId)!, i)} 
                        multiple 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[14px] font-medium text-[#101828]">Attributes</p>
                      <button 
                        onClick={() => addVariantAttribute((variant.id || variant.tempId)!)}
                        className="text-[12px] text-[#ff7176] hover:underline"
                      >
                        + Add Attribute
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {variant.attributes.map((attr, aIdx) => (
                        <div key={aIdx} className="flex gap-2 items-end">
                          <TextInput value={attr.key} onChange={(e) => updateVariantAttribute((variant.id || variant.tempId)!, aIdx, "key", e.target.value)} placeholder="Key (e.g. Size)" />
                          <TextInput value={attr.value} onChange={(e) => updateVariantAttribute((variant.id || variant.tempId)!, aIdx, "value", e.target.value)} placeholder="Value (e.g. Large)" />
                          <button 
                            onClick={() => removeVariantAttribute((variant.id || variant.tempId)!, aIdx)}
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
                  <p className="text-[#667085]">No variants available.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-[#e5e7eb]">
          <button 
            onClick={() => router.push(`/vendor/products/${id}`)}
            className="px-8 py-[10px] border border-[#d1d5dc] rounded-[10px] text-[#364153] font-medium hover:bg-gray-50 transition-all font-inter"
          >
            Cancel
          </button>
          <ActionButton onClick={handleSubmit} disabled={isLoading} className="px-10">
            {isLoading ? "Updating..." : "Update Product"}
          </ActionButton>
        </div>
      </div>
    </div>
  );

  function updateVariantAttribute(vId: string, index: number, field: "key" | "value", newValue: string) {
    setVariants(prev => prev.map(v => {
      if ((v.id || v.tempId) === vId) {
        const newAttributes = [...v.attributes];
        newAttributes[index] = { ...newAttributes[index], [field]: newValue };
        return { ...v, attributes: newAttributes };
      }
      return v;
    }));
  }

  function addVariantAttribute(vId: string) {
    setVariants(prev => prev.map(v => (v.id || v.tempId) === vId ? { ...v, attributes: [...v.attributes, { key: "", value: "" }] } : v));
  }

  function removeVariantAttribute(vId: string, index: number) {
    setVariants(prev => prev.map(v => (v.id || v.tempId) === vId ? { ...v, attributes: v.attributes.filter((_, i) => i !== index) } : v));
  }

  function handleVariantImageChange(vId: string, files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setVariants(prev => prev.map(v => (v.id || v.tempId) === vId ? { ...v, images: [...v.images, ...newFiles], imagePreviews: [...v.imagePreviews, ...newPreviews] } : v));
  }

  function removeVariantImage(vId: string, index: number) {
    setVariants(prev => prev.map(v => (v.id || v.tempId) === vId ? { ...v, images: v.images.filter((_, i) => i !== index), imagePreviews: v.imagePreviews.filter((_, i) => i !== index) } : v));
  }
}
