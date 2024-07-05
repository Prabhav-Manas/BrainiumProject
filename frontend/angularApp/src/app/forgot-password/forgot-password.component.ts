import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../appServices/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: any = FormGroup;

  constructor(private fb: FormBuilder, private _authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  Space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      this._authService
        .postRequest({ email }, 'forgot-password', true)
        .subscribe(
          (response: any) => {
            this._authService.hideLoader();
            if (response.status === 200) {
              this._authService.showSuccess(response.message);
            }
          },
          (error: HttpErrorResponse) => {
            this._authService.hideLoader();
            this._authService.handleError(error);
          }
        );
    }
    this.forgotPasswordForm.reset();
  }
}
