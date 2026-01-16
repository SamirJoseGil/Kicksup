export enum OrderStatus {
  Pending = 1,
  Confirmed = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5
}

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

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
