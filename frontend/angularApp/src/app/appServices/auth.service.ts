import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getAuthToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signUp(
    userType: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    countryCode: string,
    phone: string,
    businessName: string,
    gstNumber: string
  ) {
    const authData: AuthData = {
      userType: userType,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      countryCode: countryCode,
      phone: phone,
      businessName: businessName,
      gstNumber: gstNumber,
    };
    this.showLoader();
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/signup`, authData)
      .subscribe(
        (res) => {
          this.hideLoader(); // Hide loader on successful response
          if (res.status === 201) {
            this.toastr.success(res.message, 'Success', {
              toastClass: 'ngx-toastr custom-toast-success',
              positionClass: 'toast-top-right',
            });
          }
          // Optionally, navigate to another route or perform additional actions
          this.router.navigate(['/']);
        },
        (err: any) => {
          this.hideLoader(); // Hide loader on error response
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.toastr.error(err.error.message || 'Unknown error', 'Error', {
              toastClass: 'ngx-toastr custom-toast-error',
              positionClass: 'toast-top-right',
            });
          } else {
            // Handle other error cases as needed
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
      'Content-Type': 'application/json', // Ensure correct content type
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
              this.toastr.success(res.message, 'Success', {
                toastClass: 'ngx-toastr custom-toast-success',
                positionClass: 'toast-top-right',
              });
            }
            this.router.navigate(['/dashboard']);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.hideLoader();
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.hideLoader();
            this.toastr.error(err.message, 'Error', {
              toastClass: 'ngx-toastr custom-toast-error',
              positionClass: 'toast-top-right',
            });
          } else {
            this.toastr.error('An unexpected error occured!', 'Error', {
              toastClass: 'ngx-toastr custom-toast-error',
              positionClass: 'toast-top-right',
            });
          }
        }
      );
  }

  autoAuthData() {
    const authInformation = this.getAuthData();
    console.log('Retrieved auth information:', authInformation); // Add this line for debugging
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
    console.log('Token:', token); // Add this line for debugging
    console.log('Expiration Date:', expirationDate); // Add this line for debugging
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
            this.toastr.success(res.message, 'Success', {
              toastClass: 'ngx-toastr custom-toast-success',
              positionClass: 'toast-top-right',
            });
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.toastr.error(err.error.message, 'Error', {
              toastClass: 'ngx-toastr custom-toast-error',
              positionClass: 'toast-top-right',
            });
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
            this.toastr.success(res.message, 'Success', {
              toastClass: 'ngx-toastr custom-toast-success',
              positionClass: 'toast-top-right',
            });
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 400 || err.status === 401 || err.status === 500) {
            this.toastr.error(err.error.message, 'Error', {
              toastClass: 'ngx-toastr custom-toast-error',
              positionClass: 'toast-top-right',
            });
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
