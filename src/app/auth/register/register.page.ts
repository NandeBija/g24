import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from 'src/app/services/superbase/superbase';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  fullName = '';
  email = '';
  password = '';
  phone = '';
  confirmPassword = '';
  loading = false;

  errorMessage: string = '';
  passwordMismatch: boolean = false;
  currentDate: Date = new Date();

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async register() {
    this.errorMessage = '';
    this.passwordMismatch = false;

    if (!this.isValidEmail(this.email)) {
      this.showErrorPopup('Please enter a valid email address.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.loading = true;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            full_name: this.fullName,
            phone: this.phone,
            user_type: 'Customer',
          },
          emailRedirectTo: 'http://localhost:8100/login',
        },
      });

      if (error) throw error;

      // Insert profile ONLY if user object exists
      if (data.user) {
        // console.log(data.user)
        // await supabase.from('users').insert({
        //   user_id: data.user?.id,
        //   email: this.email,
        //   user_type: 'Customer',
        //   full_name: this.fullName,
        //   phone: this.phone,
        //   created_at: new Date(),
        // });
      }

      await this.showSuccessPopup();

      // Redirect to login (NOT home)
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (err: any) {
      this.showErrorPopup(err.message);
    } finally {
      this.loading = false;
    }
  }

  async showSuccessPopup() {
    const alert = await this.alertCtrl.create({
      header: 'Almost there ✉️',
      message:
        'We’ve sent you a confirmation email. Please verify your email address before logging in.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showErrorPopup(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Oops 😬',
      message: this.mapAuthError(message),
      buttons: ['OK'],
    });

    await alert.present();
  }

  mapAuthError(message: string): string {
    if (message.includes('User already registered')) {
      return 'An account with this email already exists.';
    }

    if (message.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }

    if (message.includes('Password should be')) {
      return 'Password must be at least 6 characters.';
    }

    if (message.includes('Email rate limit exceeded')) {
      return 'Too many attempts. Please try again later.';
    }

    return message || 'Something went wrong. Please try again.';
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
