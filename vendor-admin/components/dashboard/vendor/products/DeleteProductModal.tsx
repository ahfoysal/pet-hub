import { useToast } from "@/contexts/ToastContext";
import { useDeleteProductMutation } from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { X } from "lucide-react";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess?: () => void;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteProductModalProps) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const result = await deleteProduct(product.id).unwrap();
      showToast(result.message || "Product deleted successfully!", "success");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to delete product", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Product
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete "<strong>{product.name}</strong>"?
              This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModal;
