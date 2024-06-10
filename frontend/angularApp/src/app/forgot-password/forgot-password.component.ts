import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../appServices/auth.service';

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
    console.log(event);
    console.log(event.target.selectionStart);
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      this._authService.forgotPassword(email).subscribe(
        (res) => {
          console.log(res);
          alert(res.message);
        },
        (error) => {
          console.log(error);
          alert(error.error.message);
        }
      );
    }
    this.forgotPasswordForm.reset();
  }
}
