import { UploadFile } from "antd/lib";

export interface UserType {
  id: string;
  username: string;
  password: string;
  role: string;
}

export interface CollectionStatusType {
  id: string; // UUID
  status: string | null;
}

export interface CollectionType {
  id: string; // UUID
  title: string;
  description: string;
  status: string;
  products: ProductType[];
  fileList: UploadFile[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface ProductStatusType {
  id: string; // UUID
  status: string;
}

export interface ProductType {
  id: string; // UUID
  title: string;
  code: string | null;
  description: string;
  category: string | null;
  tags: string | null;
  sizes: string | null;
  colors: string | null;
  price: number;
  expense: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  stock: number;
  productStatus: ProductStatusType;
  collections: CollectionType[];
}

export interface OrderStatusType {
  id: string; // UUID
  status: string | null;
}

export interface OrderType {
  id: string; // UUID
  customerClerkId: string | null;
  shippingRate: string | null;
  totalAmount: number | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  customer: CustomerType;
  products: ProductType[];
  orderStatus: OrderStatusType;
}

export interface CustomerType {
  id: string; // UUID
  clerkId: string;
  name: string | null;
  email: string | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface WishlistType {
  id: string; // UUID
  customer: CustomerType;
  product: ProductType;
  createdAt: string; // ISO Date string
}

export interface ProductImageType {
  id: string; // UUID
  product: ProductType;
  image: string; // URL or path to image
  sortOrder: number;
}

export interface CollectionImageType {
  id: string; // UUID
  collection: CollectionType;
  image: string; // URL or path to image
}

export interface ShippingAddressType {
  id: string; // UUID
  streetNumber: string | null;
  streetName: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  order: OrderType;
}
