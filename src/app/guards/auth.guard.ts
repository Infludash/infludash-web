import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { TokenService } from '../services/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private token: TokenService, private router: Router, private api: ApiService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url: string = state.url;
    const requiresLoggedIn = route.data.requiresLoggedIn || false;
    const requiresLoggedOut = route.data.requiresLoggedOut || false;
    const requiresPartlyLoggedIn = route.data.requiresPartlyLoggedIn || false;
    if (requiresLoggedIn) {
      return await this.checkLoggedIn();
    }
    if (requiresLoggedOut) {
      return this.checkLoggedOut();
    }
    if (requiresPartlyLoggedIn) {
      return this.checkPartlyLoggedIn();
    }
    return false;
  }

  async checkLoggedIn(): Promise<boolean> {
    if (await this.api.checkValidToken(this.token.getRefreshToken())) {
      return true;
    } else {
      const mode = localStorage.getItem('mode') || '';
      localStorage.clear();
      localStorage.setItem('mode', mode);
      this.router.navigate(['login']);
      return false;
    }
  }

  checkLoggedOut(): boolean {
    if (this.token.getRefreshToken()) {
      this.router.navigate(['/app/dashboard']);
      return false;
    } else {
      return true;
    }
  }

  checkPartlyLoggedIn(): boolean {
    if (localStorage.getItem('justRegistered')) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
