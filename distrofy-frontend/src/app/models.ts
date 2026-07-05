export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnailUrl: string | null;
  sellerId: number | null;
  sellerName: string | null;
  downloads: number;
  createdAt: string;
}

export interface Purchase {
  id: number;
  productId: number;
  productTitle: string;
  thumbnailUrl: string | null;
  amount: number;
  paid: boolean;
  downloadToken: string;
  downloadExpiry: string;
  purchasedAt: string;
}

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  fileUrl: string;
  thumbnailUrl?: string;
}
