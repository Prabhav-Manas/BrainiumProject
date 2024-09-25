import { NgModule, OnInit } from '@angular/core';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SellerDashboardComponent],
  imports: [CommonModule],
  exports: [SellerDashboardComponent],
})
export class SellerDashboardModule implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
