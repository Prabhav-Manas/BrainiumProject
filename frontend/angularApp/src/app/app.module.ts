import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxStripeModule } from 'ngx-stripe';

import { AngularMaterialModule } from './angular-material.module';
import { SellerDashboardModule } from './seller-dashboard/seller-dashboard.module';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { VerifyUserModule } from './verify-user/verify-user.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { CategoryModule } from './Category/category-list/category.module';
import { ProductModule } from './Products/product.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { LoaderModule } from './loader/loader.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';

import { MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './authentication/auth-interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AngularMaterialModule,
    ProductModule,
    CategoryModule,
    UserDashboardModule,
    SellerDashboardModule,
    ShoppingCartModule,
    OrderHistoryModule,
    CheckoutModule,
    LoaderModule,
    HeaderModule,
    FooterModule,
    VerifyUserModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    PageNotFoundModule,
    NgxStripeModule.forRoot(
      '{{pk_test_51PacOZ2KZ7ovD5V6PkZZKPjfTarqVidUtBCEgZcIEqOZKFqeMwP2EvuWmnj2vnRXMk0Aj1KSxdGqbaN7GY7D3dPG00FzHGAJvp}}'
    ),
    MatPaginatorModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
