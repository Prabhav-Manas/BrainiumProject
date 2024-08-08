import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckoutComponent } from './checkout.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CheckoutModule {}
