import { NgModule } from '@angular/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ForgotPasswordModule {}
