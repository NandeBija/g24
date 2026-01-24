import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  login(email: string, password: string): boolean {
    // TEMP: replace with API later
    if (email && password) {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  register(user: any): boolean {
    // TEMP
    return true;
  }

  logout() {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
