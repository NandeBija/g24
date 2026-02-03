import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { supabase } from 'src/app/services/superbase/superbase';

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
  constructor(private auth: AuthService, private router: Router) {}

  // login() {
  //   const success = this.auth.login(this.email, this.password);
  //   if (success) {
  //     this.router.navigateByUrl('/tabs/home');
  //   }
  // }

  async login() {
    try {
      this.loading = true;

      const user = await this.auth.login(this.email, this.password);

      // Optional: fetch profile
      const profile = await this.auth.getProfile();

      // Navigate after success
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (err: any) {
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
}
