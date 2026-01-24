import { Injectable } from '@angular/core';

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

  getItems() {
    return this.cart;
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
  }

  removeItem(item: CartItem) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      this.cart = this.cart.filter((c) => c.size !== item.size);
    }
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
  }
}
