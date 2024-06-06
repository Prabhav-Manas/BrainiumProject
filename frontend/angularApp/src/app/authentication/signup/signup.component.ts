import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  regForm: any = FormGroup;
  hide = 'password';
  seller: boolean = false;

  constructor(private fb: FormBuilder, private _authService: AuthService) {
    this.regForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      countryCode: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      businessName: new FormControl('', []),
      gst: new FormControl('', []),
    });
  }

  ngOnInit(): void {}

  onSeller() {
    this.seller = true;
  }

  onUser() {
    this.seller = false;
  }

  Space(event: any) {
    console.log(event);
    console.log(event.target.selectionStart);
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.regForm.valid) {
      const firstName = this.regForm.value.firstName;
      const lastName = this.regForm.value.lastName;
      const email = this.regForm.value.email;
      const password = this.regForm.value.password;
      const countryCode = this.regForm.value.countryCode;
      const phone = this.regForm.value.phone;
      const businessName = this.regForm.value.businessName;
      const gst = this.regForm.value.gst;

      this._authService.signUp(
        firstName,
        lastName,
        email,
        password,
        countryCode,
        phone,
        businessName,
        gst
      );
      console.log(this.regForm.value);
    }
    this.regForm.reset();
  }
}
