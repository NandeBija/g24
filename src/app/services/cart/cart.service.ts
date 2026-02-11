import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  size: string;
  label: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  getItems() {
    return this.cart;
  }

  private updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(totalItems);
  }

  addItem(item: Omit<CartItem, 'quantity'>) {
    const existing = this.cart.find((c) => c.size === item.size);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        ...item,
        quantity: 1,
      });
    }

    this.updateCartCount();
  }

  removeItem(item: CartItem) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      this.cart = this.cart.filter((c) => c.size !== item.size);
    }

    this.updateCartCount();
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.updateCartCount();
  }
}
