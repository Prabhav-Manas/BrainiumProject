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
export class LogInGuard implements CanActivate {
  constructor(private _authservice: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuth = this._authservice.getIsAuth();
    if (isAuth) {
      return this.router.createUrlTree(['/dashboard']);
    }
    return true;
  }
}
