// Order item
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Shipping address
export interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// User info
export interface OrderUser {
  id: string;
  email: string;
  fullName: string;
  image: string;
  role: "PET_OWNER" | string;
}

// Main order
export interface VendorOrder {
  id: string;
  userId: string;
  vendorId: string;
  cartId: string;
  subTotal: number;
  platformFee: number;
  discount: number | null;
  grandTotal: number;
  paymentId: string | null;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED" | string;
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING" | string;
  shippingAddressId: string;
  createdAt: string;
  updatedAt: string;

  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  user: OrderUser;
}

// API response wrapper
export interface VendorOrdersResponse {
  success: boolean;
  message: string;
  data: VendorOrder[];
}
