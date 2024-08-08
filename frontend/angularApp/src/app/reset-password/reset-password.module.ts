import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './reset-password.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ResetPasswordModule {}
