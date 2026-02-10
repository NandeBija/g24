import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { supabase } from 'src/app/services/superbase/superbase';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async login() {
    try {
      this.loading = true;

      const user = await this.auth.login(this.email, this.password);

      // Optional: fetch profile
      // const profile = await this.auth.getProfile();

      // Navigate after success
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (err: any) {
      this.showErrorPopup(err.message);
      console.error(err);
      // TODO: Toast alert
    } finally {
      this.loading = false;
    }
  }

  async getProfile() {
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return null;

    const { data, error } = await supabase
      .from('')
      .select('*users')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return data;
  }

  async showErrorPopup(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Oops! 😬',
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
    if (message.includes('Email not confirmed')) {
      return 'Email not confirmed. Please confirm email address';
    }

    return message || 'Something went wrong. Please try again.';
  }
}
