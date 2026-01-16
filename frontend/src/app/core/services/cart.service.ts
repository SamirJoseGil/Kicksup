import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'kicksup_cart';
  
  private readonly cartSignal = signal<CartItem[]>([]);
  
  public readonly items = this.cartSignal.asReadonly();
  
  public readonly totalItems = computed(() => 
    this.cartSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  public readonly totalAmount = computed(() => 
    this.cartSignal().reduce((sum, item) => sum + item.subtotal, 0)
  );
  
  public readonly cart = computed<Cart>(() => ({
    items: this.cartSignal(),
    totalItems: this.totalItems(),
    totalAmount: this.totalAmount()
  }));

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const cartData = localStorage.getItem(this.STORAGE_KEY);
    if (cartData) {
      try {
        const items = JSON.parse(cartData) as CartItem[];
        this.cartSignal.set(items);
      } catch (error) {
        console.error('Error loading cart:', error);
        this.cartSignal.set([]);
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartSignal()));
  }

  addItem(product: Product, quantity: number = 1): void {
    const currentItems = [...this.cartSignal()];
    const existingIndex = currentItems.findIndex(item => item.productId === product.id);

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
      currentItems[existingIndex].subtotal = currentItems[existingIndex].price * currentItems[existingIndex].quantity;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        size: product.size,
        sizeDisplay: product.sizeDisplay,
        color: product.color,
        colorDisplay: product.colorDisplay,
        quantity,
        subtotal: product.price * quantity
      };
      currentItems.push(newItem);
    }

    this.cartSignal.set(currentItems);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = [...this.cartSignal()];
    const item = currentItems.find(i => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      item.subtotal = item.price * quantity;
      this.cartSignal.set(currentItems);
      this.saveCart();
    }
  }

  removeItem(productId: string): void {
    const currentItems = this.cartSignal().filter(item => item.productId !== productId);
    this.cartSignal.set(currentItems);
    this.saveCart();
  }

  clearCart(): void {
    this.cartSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
