// Modelo que representa una orden de compra
export enum OrderStatus {
  Pending = 1,
  Confirmed = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5
}

// Modelo que representa un ítem dentro de una orden
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  productImageUrl: string;
  size: number;
  sizeDisplay: string;
  color: number;
  colorDisplay: string;
  quantity: number;
  price: number;
  unitPrice: number;
  subtotal: number;
}

// Modelo que representa una orden de compra
export interface Order {
  id: string;
  userId: string;
  userName: string;
  status: OrderStatus;
  statusDisplay: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

// Modelo para crear una nueva orden
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}

// Modelo para actualizar el estado de una orden
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Modelo para actualizar el estado de una orden
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
