import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './authentication/auth.guard';
import { LogInGuard } from './authentication/logIn.guard';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, canActivate: [LogInGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LogInGuard] },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'reset-password/:userId/:token', component: ResetPasswordComponent },
  { path: 'verifyUser', component: VerifyUserComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LogInGuard],
})
export class AppRoutingModule {}
