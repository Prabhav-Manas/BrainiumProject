import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/appModels/auth-data.model';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {
  logInForm: any = FormGroup;
  hide = 'password';
  private authStatusSub!: Subscription;

  dropdownOptions = [
    { value: 'Select', label: 'Select' },
    { value: 'seller', label: 'Seller' },
    { value: 'user', label: 'User' },
  ];

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.logInForm = this.fb.group({
      userType: new FormControl('user', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.authStatusSub = this._authService.getAuthStatusListener().subscribe();
  }

  Space(event: any) {
    console.log(event);
    console.log(event.target.selectionStart);
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.logInForm.valid) {
      const authData: AuthData = {
        userType: this.logInForm.value.userType,
        email: this.logInForm.value.email,
        password: this.logInForm.value.password,
      };

      this._authService.postRequest(authData, 'signin', true).subscribe(
        (res: any) => {
          this._authService.hideLoader();
          if (res.status === 200) {
            this._authService.showSuccess(res.message);
            this._authService.handleAuthentication(res);
            if (this._authService.getUserRole() === 'seller') {
              this.router.navigate(['/seller-dashboard']);
            } else if (this._authService.getUserRole() === 'user') {
              this.router.navigate(['/user-dashboard']);
            }
          } else {
            this.toastr.error(
              'Authentication failed. Please try again.',
              'Error',
              {
                toastClass: 'ngx-toastr custom-toast-error',
                positionClass: 'toast-top-right',
              }
            );
          }
        },
        (error) => {
          this._authService.hideLoader();
          this._authService.showError(error.error.message);
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly.', 'Error', {
        toastClass: 'ngx-toastr custom-toast-error',
        positionClass: 'toast-top-right',
      });
    }
    this.logInForm.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
