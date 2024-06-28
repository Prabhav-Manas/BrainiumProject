import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthData } from 'src/app/appModels/auth-data.model';
import { AuthResponse } from '../appModels/auth-response.model';
import { LoaderService } from './loader.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private loading: boolean = false;
  private userRole: string = '';

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(
    private http: HttpClient,
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
      return decodedToken.user._id;
    }
    return null;
  }

  // ----SignUp----
  signUp(bodyData: AuthData, url: string = 'signup', loader: boolean = true) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (loader) {
      this.showLoader();
    }
    return this.http.post<AuthResponse>(`${this.baseUrl}/${url}`, bodyData, {
      headers,
    });
  }

  // ----SignIn----
  signin(bodyData: AuthData, url: string = 'signin', loader: boolean = true) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (loader) {
      this.showLoader();
    }
    return this.http.post<AuthResponse>(`${this.baseUrl}/${url}`, bodyData, {
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
    this.router.navigate(['/']);
  }

  // ----ForgotPassword----
  forgotPassword(email: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/forgot-password`, {
      email,
    });
  }

  // ----ResetPassword----
  resetPassword(data: {
    userId: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/reset-password`, data);
  }

  // ----Handle Authentication----
  public handleAuthentication(res: AuthResponse) {
    this.token = res.token!;
    if (this.token) {
      const decodedToken: any = jwtDecode(this.token);
      console.log('jwtDecode:=>', decodedToken);
      this.userRole = decodedToken.user.role;
      const expiresInDuration = res.expiresIn ?? 3600; // Default to 1 hr if undefined
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(this.token, expirationDate, this.userRole);
      this.showSuccess(res.message);
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
    if (!authInformation) {
      this.router.navigate(['/signin']);
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

      if (this.userRole === 'seller') {
        this.router.navigate(['/seller-dashboard']);
      } else if (this.userRole === 'user') {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.router.navigate(['/signin']);
    }
  }

  // ----Set Authentication Timer----
  public setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  // ----Save Authentication Data----
  public saveAuthData(token: string, expirationDate: Date, userRole: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userRole', userRole);
  }

  // ----Clear Authentication Data----
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  // ----Fetch Authentication Data----
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userRole = localStorage.getItem('userRole');

    if (!token || !expirationDate || !userRole) {
      return null;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userRole: userRole,
      };
    }
  }

  // ----Fetch User Role----
  public getUserRole() {
    return this.userRole;
  }
}
