import { Product } from './product.model';

// Modelo que representa un ítem en el carrito de compras
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

// Modelo que representa el carrito de compras  
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
