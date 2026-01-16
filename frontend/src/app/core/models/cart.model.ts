import { Product } from './product.model';

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  size: number;
  sizeDisplay: string;
  color: number;
  colorDisplay: string;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
