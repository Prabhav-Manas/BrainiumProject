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
import { Category } from 'src/app/appModels/category.model';
import { CategoryService } from 'src/app/appServices/category.service';
import { AuthData } from 'src/app/appModels/auth-data.model';
import { Router } from '@angular/router';
import { AuthResponse } from 'src/app/appModels/auth-response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  regForm: any = FormGroup;
  hide = 'password';
  seller: boolean = false;
  categories: Category[] = [];

  dropdownOptions = [
    { value: 'Select', label: 'Select' },
    { value: 'seller', label: 'Seller' },
    { value: 'user', label: 'User' },
  ];

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private toastr: ToastrService,
    private _categoryService: CategoryService,
    private router: Router
  ) {
    this.regForm = this.fb.group({
      userType: new FormControl('user', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      businessName: new FormControl('', []),
      gstNumber: new FormControl('', []),
      categoryId: new FormControl('', []),
    });

    this.regForm.get('userType')?.valueChanges.subscribe((value: string) => {
      this.seller = value === 'seller';
      if (this.seller) {
        this.regForm.get('businessName').setValidators([Validators.required]);
        this.regForm.get('gstNumber').setValidators([Validators.required]);
        this.regForm.get('categoryId').setValidators([Validators.required]);
      } else {
        this.regForm.get('businessName').clearValidators();
        this.regForm.get('gstNumber').clearValidators();
        this.regForm.get('categoryId').clearValidators();
      }
      this.regForm.get('businessName').updateValueAndValidity();
      this.regForm.get('gstNumber').updateValueAndValidity();
      this.regForm.get('categoryId').updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  onSeller() {
    this.seller = true;
  }

  onUser() {
    this.seller = false;
  }

  fetchCategories() {
    this._categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
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
    const authData: AuthData = {
      userType: this.regForm.value.userType,
      firstName: this.regForm.value.firstName,
      lastName: this.regForm.value.lastName,
      email: this.regForm.value.email,
      password: this.regForm.value.password,
      phone: this.regForm.value.phone,
      businessName: this.regForm.value.businessName,
      gstNumber: this.regForm.value.gstNumber,
      categoryId: this.regForm.value.categoryId,
    };

    this._authService.postRequest(authData, 'signup', true).subscribe(
      (res: any) => {
        this._authService.hideLoader();
        alert('Sign up successful.');
        console.log(res);
        if (res.status === 201) {
          this._authService.showSuccess(res.message);
        }
        this.router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this._authService.hideLoader();
        this._authService.handleError(error);
      }
    );
  }
}
