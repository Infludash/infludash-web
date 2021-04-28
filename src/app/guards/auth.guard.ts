import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private token: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    const requiresLoggedIn = route.data.requiresLoggedIn || false;
    const requiresLoggedOut = route.data.requiresLoggedOut || false;
    if (requiresLoggedIn) {
      return this.checkLoggedIn();
    }
    if (requiresLoggedOut) {
      return this.checkLoggedOut();
    }
    return false;
  }

  checkLoggedIn(): boolean {
    if (this.token.getRefreshToken()) {
      return true;
    } else {
      this.router.navigate(['']);
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
}
