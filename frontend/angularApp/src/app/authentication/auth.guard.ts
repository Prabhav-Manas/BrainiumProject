import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/appServices/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuth = this._authService.getIsAuth();
    if (!isAuth) {
      return this.router.createUrlTree(['/auth/signin']);
    }

    const userRole = this._authService.getUserRole();
    const expectedRole = route.data['role'];

    if (userRole !== expectedRole) {
      if (userRole === 'seller') {
        return this.router.createUrlTree(['/seller-dashboard']);
      } else if (userRole === 'user') {
        return this.router.createUrlTree(['/user-dashboard']);
      }
      return false;
    }
    return isAuth;
  }
}
