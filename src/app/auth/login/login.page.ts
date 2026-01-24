import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = 'Nandebija@gmail.com';
  password = '0824072120';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const success = this.auth.login(this.email, this.password);
    if (success) {
      this.router.navigateByUrl('/tabs/home');
    }
  }
}
