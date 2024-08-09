export interface LogType {
  user: string;
  type: string;
  info: string;
  ip: string;
  continent_code?: string;
  continent_name?: string;
  country_code?: string;
  country_name?: string;
  city?: string;
}

export interface UserType {
  id: string;
  username: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
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
  fileList: FileListType[];
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
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
  discount: number;
  size_image: string;
  created_at: Date; // ISO Date string
  updated_at: Date; // ISO Date string
  stock: number;
  fileList: FileListType[];
  productStatus: ProductStatusType;
  collections: CollectionType[];
}
export interface FileListType {
  id: number;
  created_at: Date;
  updated_at: Date;
  lastModified: string;
  LastModified: number;
  name: string;
  response: FileListImageUrlType;
  size: number;
  status: string;
  type: string;
  collectionID: number;
  productID: number;
  order_index: number;
}

export interface FileListImageUrlType {
  id: number;
  created_at: Date;
  updated_at: Date;
  url: string;
  fileListID: string;
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
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  customer: CustomerType;
  products: ProductType[];
  orderStatus: OrderStatusType;
}

export interface CustomerType {
  id: string; // UUID
  clerkId: string;
  name: string | null;
  email: string | null;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
}

export interface WishlistType {
  id: string; // UUID
  customer: CustomerType;
  product: ProductType;
  created_at: string; // ISO Date string
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
