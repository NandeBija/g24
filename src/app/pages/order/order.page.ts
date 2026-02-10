import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';

interface CartItem {
  size: string;
  label: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order',
  templateUrl: 'order.page.html',
  styleUrls: ['order.page.scss'],
  standalone: false,
})
export class orderPage {
  cart: CartItem[] = [];
  subtotal = 0;
  readonly deliveryFee = 35;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.refreshCart();
  }

  ionViewWillEnter() {
    this.refreshCart();
  }

  refreshCart() {
    this.cart = this.cartService.getItems();
    this.subtotal = this.cartService.getSubtotal();
  }

  get total(): number {
    if (!this.cart.length) {
      return 0;
    }
    return this.subtotal + this.deliveryFee;
  }

  /**
   * Call this when a user clicks "Add" on a cylinder
   */
  addToCart(item: Omit<CartItem, 'quantity'>) {
    const existing = this.cart.find((c) => c.size === item.size);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        ...item,
        quantity: 1,
      });
    }

    this.calculateTotals();
  }

  /**
   * Optional: decrease quantity
   */
  remove(item: CartItem) {
    this.cartService.removeItem(item);
    this.refreshCart();
  }

  /**
   * Calculate subtotal & total
   * (Delivery fee intentionally excluded)
   */
  calculateTotals() {
    this.subtotal = this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  increase(item: CartItem) {
    this.cartService.addItem({
      size: item.size,
      label: item.label,
      price: item.price,
    });
    this.refreshCart();
  }

  decrease(item: CartItem) {
    this.cartService.removeItem(item);
    this.refreshCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.refreshCart();
  }
}
