import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserDashboardComponent } from './user-dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UserDashboardComponent],
  imports: [CommonModule, RouterModule],
})
export class UserDashboardModule {}
