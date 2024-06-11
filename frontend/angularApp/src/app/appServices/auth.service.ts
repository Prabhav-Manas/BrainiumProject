import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from 'src/app/appModels/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient, private router: Router) {}

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
    return this.http.post(`${this.baseUrl}/signup`, authData).subscribe(
      (res) => {
        alert('Registration Successfull!');
      },
      (err) => {
        alert('Something went wrong!');
        console.log(err);
      }
    );
  }

  signin(userType: string, email: string, password: string) {
    const authData: AuthData = {
      userType: userType,
      email: email,
      password: password,
    };
    return this.http
      .post<{ token: string; expiresIn: number }>(
        `${this.baseUrl}/signin`,
        authData
      )
      .subscribe(
        (res) => {
          console.log('Response:=>', res);
          this.token = res.token;
          if (this.token) {
            const expiresInDuration = res.expiresIn;
            console.log('Expires In Duration:=>', expiresInDuration);
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log('Expiration Date:=>', expirationDate);
            this.saveAuthData(this.token, expirationDate);
            this.router.navigate(['/dashboard']);
          }
        },
        (err) => {
          alert('Invalid User! Please Sign up');
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

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    console.log('Token:', token); // Add this line for debugging
    console.log('Expiration Date:', expirationDate); // Add this line for debugging
    if (!token || !expirationDate) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
      };
    }
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(data: {
    userId: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/reset-password`,
      data
    );
  }
}
