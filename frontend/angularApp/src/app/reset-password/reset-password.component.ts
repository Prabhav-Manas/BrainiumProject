import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../appServices/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: any = FormGroup;
  token: string = '';
  userId: string = '';
  errorMessage: string = '';
  hide = 'password';
  cnfhide = 'password';

  constructor(
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      this.userId = params['userId'];
    });
  }

  Space(event: any) {
    console.log(event);
    console.log(event.target.selectionStart);
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const confirmNewPassword =
        this.resetPasswordForm.value.confirmNewPassword;

      console.log('UserId:', this.userId);
      console.log('Token:', this.token);
      console.log('New Password:', newPassword);
      console.log('Confirm New Password:', confirmNewPassword);

      this._authService
        .postRequest(
          {
            userId: this.userId,
            token: this.token,
            newPassword,
            confirmNewPassword,
          },
          'reset-password',
          true
        )
        .subscribe(
          (res: any) => {
            this._authService.hideLoader();
            if (res.status === 200) {
              this._authService.showSuccess(res.message);
            }
          },
          (error: HttpErrorResponse) => {
            this._authService.hideLoader();
            this._authService.handleError(error);
          }
        );
    }
    this.resetPasswordForm.reset();
  }
}
