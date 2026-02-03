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
  confirmPassword = '';
  loading = false;

  errorMessage: string = '';
  passwordMismatch: boolean = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async register() {
    this.errorMessage = '';
    this.passwordMismatch = false;

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      });

      if (error) {
        throw error;
      }

      // Optional: insert into users table
      await supabase.from('users').insert({
        user_id: data.user?.id,
        email: this.email,
        user_type: 'user',
      });

      // Navigate to login or dashboard
    } catch (err: any) {
      this.showErrorPopup(err.message);
    }
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

    if (message.includes('Invalid login credentials')) {
      return 'Incorrect email or password.';
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
