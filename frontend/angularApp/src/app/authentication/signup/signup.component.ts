import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/appServices/auth.service';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  regForm: any = FormGroup;
  hide = 'password';
  seller: boolean = false;

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
    this.regForm = this.fb.group({
      userType: new FormControl('user', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      // countryCode: new FormControl('', [Validators.required]),
      // phone: new FormControl('', [Validators.required]),
      businessName: new FormControl('', []),
      gstNumber: new FormControl('', []),
    });

    this.regForm.get('userType')?.valueChanges.subscribe((value: string) => {
      this.seller = value === 'seller';
      if (this.seller) {
        this.regForm.get('businessName').setValidators([Validators.required]);
        this.regForm.get('gstNumber').setValidators([Validators.required]);
      } else {
        this.regForm.get('businessName').clearValidators();
        this.regForm.get('gstNumber').clearValidators();
      }
      this.regForm.get('businessName').updateValueAndValidity();
      this.regForm.get('gstNumber').updateValueAndValidity();
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
      const userType = this.regForm.value.userType;
      const firstName = this.regForm.value.firstName;
      const lastName = this.regForm.value.lastName;
      const email = this.regForm.value.email;
      const password = this.regForm.value.password;
      // const countryCode = this.regForm.value.countryCode;
      // const phone = this.regForm.value.phone;
      const businessName = this.regForm.value.businessName;
      const gstNumber = this.regForm.value.gstNumber;

      this._authService.signUp(
        userType,
        firstName,
        lastName,
        email,
        password,
        // countryCode,
        // phone,
        businessName,
        gstNumber
      );
      console.log(this.regForm.value);
    } else {
      this.toastr.error('Please fill ou the form correctly.', 'Error', {
        toastClass: 'ngx-toastr custom-toast-error',
        positionClass: 'toast-top-right',
      });
    }
    this.regForm.reset();
  }
}
