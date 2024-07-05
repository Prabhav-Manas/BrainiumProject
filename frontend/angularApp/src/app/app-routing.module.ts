import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthGuard } from './authentication/auth.guard';
import { LogInGuard } from './authentication/logIn.guard';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AddProductComponent } from './Products/add-product/add-product.component';
import { ProductListComponent } from './Products/product-list/product-list.component';
import { CategoryListComponent } from './Category/category-list/category-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './Products/product-details/product-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, canActivate: [LogInGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LogInGuard] },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    canActivate: [LogInGuard],
  },
  { path: 'reset-password/:userId/:token', component: ResetPasswordComponent },
  { path: 'verifyUser', component: VerifyUserComponent },
  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' },
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'user' },
  },
  { path: 'add-product', component: AddProductComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'category-list', component: CategoryListComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LogInGuard],
})
export class AppRoutingModule {}
