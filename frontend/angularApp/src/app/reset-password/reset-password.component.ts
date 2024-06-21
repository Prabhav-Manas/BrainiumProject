import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../appServices/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    // this.token = this.route.snapshot.paramMap.get('token') || '';
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

      this._authService.resetPassword({
        userId: this.userId,
        token: this.token,
        newPassword,
        confirmNewPassword,
      });
    }
    this.resetPasswordForm.reset();
  }
}
