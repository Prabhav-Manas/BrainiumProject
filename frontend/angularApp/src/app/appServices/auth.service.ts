import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, tap } from 'rxjs';
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

  showLoader() {
    this._loaderService.show();
  }

  hideLoader() {
    this._loaderService.hide();
  }

  private showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      toastClass: 'ngx-toastr custom-toast-success',
      positionClass: 'toast-top-right',
    });
  }

  private showError(message: string) {
    this.toastr.error(message, 'Error', {
      toastClass: 'ngx-toastr custom-toast-error',
      positionClass: 'toast-top-right',
    });
  }

  getAuthToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user._id;
    }
    return null;
  }

  signUp(
    userType: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    // countryCode: string,
    // phone: string,
    businessName: string,
    gstNumber: string
  ) {
    const authData: AuthData = {
      userType: userType,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      // countryCode: countryCode,
      // phone: phone,
      businessName: businessName,
      gstNumber: gstNumber,
    };
    this.showLoader();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/signup`, authData, { headers })
      .subscribe(
        (res) => {
          this.hideLoader();
          if (res.status === 201) {
            this.showSuccess(res.message);
          }
          this.router.navigate(['/']);
        },
        (err: any) => {
          this.hideLoader();
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.showError(err.error.message || 'Unknown error');
          } else {
            console.error('Error occurred:', err);
          }
        }
      );
  }

  signin(userType: string, email: string, password: string) {
    const authData: AuthData = {
      userType: userType,
      email: email,
      password: password,
    };

    const headers = {
      'Content-Type': 'application/json',
      // Add other headers if required (e.g., Authorization)
    };

    this.showLoader();
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/signin`, authData, {
        headers: headers,
      })
      .subscribe(
        (res) => {
          this.hideLoader();
          if (res.status === 200) {
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
              const expirationDate = new Date(
                now.getTime() + expiresInDuration * 1000
              );
              this.saveAuthData(this.token, expirationDate, this.userRole);
              this.showSuccess(res.message);
            }
            if (this.userRole === 'seller') {
              this.router.navigate(['/seller-dashboard']);
            } else {
              this.router.navigate(['/user-dashboard']);
            }
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.hideLoader();
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.hideLoader();
            this.showError(err.error.message || 'Unknown error');
          } else {
            this.showError(err.error.message || 'An unexpected error occured');
          }
        }
      );
  }

  autoAuthData() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      // Handle the case when authInformation is undefined
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userRole = authInformation.userRole;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logOut() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userRole: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userRole', userRole);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

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

  getUserRole() {
    return this.userRole;
  }

  forgotPassword(email: string) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/forgot-password`, { email })
      .subscribe(
        (res) => {
          if (res.status === 200) {
            this.showSuccess(res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.showError(err.error.message || 'Unknown error');
          }
        }
      );
  }

  resetPassword(data: {
    userId: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/reset-password`, data)
      .subscribe(
        (res) => {
          if (res.status === 200) {
            this.showSuccess(res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.showError(err.error.message || 'Unknown error');
          }
        }
      );
  }
}
// createGet(params) {
//   if ((typeof params.loading !== 'undefined'))
//   this.showLoader();
//     return new Promise((resolve, reject) => {
//       const httpOptions = {
//         headers: new HttpHeaders().set("Content-Type", "application/json").set("x-access-token",this.getLocalData("serviceGenieCustomerToken") || '')
//       };
//       this.http.get(params.url, httpOptions).pipe().subscribe(res => {
//         if ((typeof params.loading !== 'undefined'))
//         this.hideLoader();
//         return resolve(res);
//       }, err => {
//       if ((typeof params.loading !== 'undefined'))
//         this.hideLoader();
//         return reject(err ? err.json() : {});
//       });
//     });
// }
