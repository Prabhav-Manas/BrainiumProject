import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthResponse } from '../appModels/auth-response.model';
import { LoaderService } from './loader.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userRole: string = '';
  private firstName: string = '';

  private userRoleSubject = new BehaviorSubject<string>('');
  userRole$ = this.userRoleSubject.asObservable();

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private _cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private _loaderService: LoaderService
  ) {}

  public showLoader() {
    this._loaderService.show();
  }

  public hideLoader() {
    this._loaderService.hide();
  }

  public showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      toastClass: 'ngx-toastr custom-toast-success',
      positionClass: 'toast-top-right',
    });
  }

  public showError(message: string) {
    this.toastr.error(message, 'Error', {
      toastClass: 'ngx-toastr custom-toast-error',
      positionClass: 'toast-top-right',
    });
  }

  public getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      return decodedToken.user._id;
    }
    return null;
  }

  postRequest(bodyData: any, url: string, loader: boolean) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (loader) {
      this.showLoader();
    }
    return this.http.post(`${this.baseUrl}/${url}`, bodyData, {
      headers,
    });
  }

  // ----Log Out----
  logOut() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this._cartService.clearCart();
    this.userRole = ''; // Clear the userRole
    this.userRoleSubject.next('');
    this.router.navigate(['/']);
  }

  // ----Handle Authentication----
  public handleAuthentication(res: AuthResponse) {
    this.token = res.token!;
    if (this.token) {
      const decodedToken: any = jwtDecode(this.token);
      console.log('jwtDecode:=>', decodedToken);
      this.userRole = decodedToken.user.role;
      this.firstName = decodedToken.user.firstName;
      const userId = decodedToken.user.id;
      const expiresInDuration = res.expiresIn ?? 3600; // Default to 1 hr if undefined
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(
        this.token,
        expirationDate,
        this.userRole,
        this.firstName,
        userId
      );
      this.userRoleSubject.next(this.userRole);
      this.showSuccess(res.message);
      this.router.navigate([`/${this.userRole}-dashboard`]);
    }
  }

  // ----Handle Error----
  public handleError(error: HttpErrorResponse) {
    if (error.status === 400 || error.status === 401 || error.status === 500) {
      this.showError(error.error.message || 'Unknown error');
    } else {
      this.showError(error.error.message || 'An unexpected error occurred');
    }
  }

  // ----Auto Authentication----
  public autoAuthData() {
    const authInformation = this.getAuthData();
    console.log('Auth Information:', authInformation);

    if (!authInformation) {
      return; // Handle the case when authInformation is undefined
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userRole = authInformation.userRole;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.userRoleSubject.next(this.userRole);
    }
  }

  // ----Set Authentication Timer----
  public setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  // ----Save Authentication Data----
  public saveAuthData(
    token: string,
    expirationDate: Date,
    userRole: string,
    firstName: string,
    userId: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('userId', userId);
  }

  // ----Clear Authentication Data----
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userRole');
    localStorage.removeItem('firstName');
    localStorage.removeItem('userId');
  }

  // ----Fetch Authentication Data----
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userRole = localStorage.getItem('userRole');
    const firstName = localStorage.getItem('firstName');

    if (!token || !expirationDate || !userRole || !firstName) {
      return null;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userRole: userRole,
        firstName: firstName,
      };
    }
  }

  // ----Fetch User Role----
  public getUserRole() {
    return this.userRole;
  }

  // Add a method to get the first name
  public getFirstName() {
    return this.firstName;
  }
}
