import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
    private toastr: ToastrService
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
      const userType = this.logInForm.value.userType;
      const email = this.logInForm.value.email;
      const password = this.logInForm.value.password;

      this._authService.signin(userType, email, password);
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
