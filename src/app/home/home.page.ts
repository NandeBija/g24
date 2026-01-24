import { Component } from '@angular/core';
import { CartService, CartItem } from '../services/cart/cart.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class homePage {
  constructor(
    private cartService: CartService,
    private toastCtrl: ToastController
  ) {}

  cart: CartItem[] = [];
  subtotal = 0;
  selectedCylinder: string | null = null;
  cartCount = 0;

  deliveryLocation = '';
  cylinders = [
    {
      size: '5kg',
      label: 'Small Cylinder',
      price: 280,
      quantity: 0,
      image: 'assets/cylinders/5kg.jpg',
    },
    {
      size: '9kg',
      label: 'Standard Cylinder',
      price: 330,
      quantity: 0,
      image: 'assets/cylinders/9kg.jpg',
    },
    {
      size: '19kg',
      label: 'Large Cylinder',
      price: 680,
      quantity: 0,
      image: 'assets/cylinders/19kg.jpg',
    },
    {
      size: '48kg',
      label: 'Industrial Cylinder',
      price: 1650,
      quantity: 0,
      image: 'assets/cylinders/48kg.jpg',
    },
  ];

  selectCylinder(cylinder: any) {
    this.selectedCylinder = cylinder.size;
  }

  // increase(item: any) {
  //   item.quantity++;
  // }

  // decrease(item: any) {
  //   if (item.quantity > 0) {
  //     item.quantity--;
  //   }
  // }

  useCurrentLocation() {
    console.log('Use current location clicked');
    // Later:
    // navigator.geolocation.getCurrentPosition(...)
  }

  async addToCart(cylinder: any) {
    this.cartService.addItem({
      size: cylinder.size,
      label: cylinder.label,
      price: cylinder.price,
    });

    this.cartCount++;

    const toast = await this.toastCtrl.create({
      message: `${cylinder.label} added to cart`,
      duration: 1500,
      position: 'top',
      icon: 'checkmark-circle-outline',
    });

    toast.present();
  }

  refreshCart() {
    this.cart = this.cartService.getItems();
    this.subtotal = this.cartService.getSubtotal();
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
}
