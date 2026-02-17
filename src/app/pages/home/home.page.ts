import { Component, OnInit, NgZone } from '@angular/core';
import { CartService, CartItem } from '../../services/cart/cart.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class homePage implements OnInit {
  deliveryLocation = '';
  selectedAddress: any = null;

  autocomplete!: google.maps.places.Autocomplete;

  cart: CartItem[] = [];
  subtotal = 0;
  selectedCylinder: string | null = null;
  cartCount = 0;

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
      image: 'assets/cylinders/9kg.png',
    },
    {
      size: '19kg',
      label: 'Large Cylinder',
      price: 680,
      quantity: 0,
      image: 'assets/cylinders/19kg.png',
    },
    {
      size: '48kg',
      label: 'Industrial Cylinder',
      price: 1650,
      quantity: 0,
      image: 'assets/cylinders/48kg.png',
    },
  ];

  constructor(
    private cartService: CartService,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.initAutocomplete();
    }, 500);
  }

  initAutocomplete() {
    const input = document.querySelector(
      'input[placeholder="Enter delivery location"]'
    ) as HTMLInputElement;

    this.autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'za' }, // 🇿🇦 South Africa
    });

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete.getPlace();

        if (!place.formatted_address) return;

        this.deliveryLocation = place.formatted_address;
        this.selectedAddress = {
          formatted: place.formatted_address,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        };

        // Optional: persist locally
        localStorage.setItem(
          'delivery_address',
          JSON.stringify(this.selectedAddress)
        );
      });
    });
  }

  useCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results) => {
        if (results && results[0]) {
          this.ngZone.run(() => {
            this.deliveryLocation = results[0].formatted_address;
            this.selectedAddress = {
              formatted: results[0].formatted_address,
              lat,
              lng,
            };

            localStorage.setItem(
              'delivery_address',
              JSON.stringify(this.selectedAddress)
            );
          });
        }
      });
    });
  }

  selectCylinder(cylinder: any) {
    this.selectedCylinder = cylinder.size;
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
