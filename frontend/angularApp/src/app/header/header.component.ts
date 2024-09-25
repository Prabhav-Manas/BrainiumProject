import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/appServices/auth.service';
import { navBarData } from './nav-data';
import { CartService } from '../appServices/cart.service';
import { Router } from '@angular/router';
import { Offcanvas } from 'bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  collapsed: boolean = false;
  isCollapsed: boolean = true;
  isProductMenuOpen: boolean = false;
  isCategoryMenuOpen: boolean = false;

  isLoggedIn: boolean = false;
  isSeller: boolean = false;
  firstName: string = '';

  cartItemCount: number = 0;

  @Output() sidebarToggle = new EventEmitter<boolean>();
  isSidebarExpanded = false;

  constructor(
    private _authService: AuthService,
    private _cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
      this.isSeller = this._authService.getUserRole() === 'seller';
      if (this.isLoggedIn) {
        this.firstName = this._authService.getFirstName();
        this.fetchCartItemCount();
      }
    });

    // Restore authentication state on component initialization
    this.isLoggedIn = this._authService.getIsAuth();
    this.isSeller = this._authService.getUserRole() === 'seller';
    if (this.isLoggedIn) {
      this.firstName = this._authService.getFirstName();
      this.fetchCartItemCount();
    }

    this._cartService.getCartItemCount().subscribe((count) => {
      this.cartItemCount = count;
    });

    this._cartService.cartUpdated.subscribe((count: number) => {
      this.cartItemCount = count;
    });
  }

  fetchCartItemCount() {
    this._cartService.getAllCartItems().subscribe(
      (cartData) => {
        this.cartItemCount = cartData.cartItems.length;
      },
      (error) => {
        console.log('Error Fetching Cart Items:=>', error);
      }
    );
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.isSidebarExpanded = !this.isCollapsed;
    this.sidebarToggle.emit(this.isSidebarExpanded); // Emit the event to parent component
  }

  closeSideNav() {
    this.collapsed = false;
  }

  // toggleSidebar() {
  //   this.isSidebarExpanded = !this.isSidebarExpanded;
  //   this.sidebarToggle.emit(this.isSidebarExpanded); // Emit the current state
  // }

  closeSideNavOnMenuClick() {
    const offcanvasElement = document.getElementById('offcanvasTop');
    if (offcanvasElement) {
      const offcanvas = Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) {
        offcanvas.hide();
      }
    }
  }

  onClickDashboard() {
    this.router.navigate(['/seller-dashboard']);
    // ------This will close sidenav bar when click on menu link------
    const closeButton = document.querySelector(
      '[data-bs-dismiss="offcanvas"]'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  }

  onClickAddProduct() {
    this.router.navigate(['/add-product']);
    // ------This will close sidenav bar when click on menu link------
    const closeButton = document.querySelector(
      '[data-bs-dismiss="offcanvas"]'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  }

  onClickProductList() {
    this.router.navigate(['/product-list']);
    // ------This will close sidenav bar when click on menu link------
    const closeButton = document.querySelector(
      '[data-bs-dismiss="offcanvas"]'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  }

  onClickCategory() {
    this.router.navigate(['/category-list']);
    this.closeSideNavOnMenuClick();
    // ------This will close sidenav bar when click on menu link------
    const closeButton = document.querySelector(
      '[data-bs-dismiss="offcanvas"]'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  }

  toggleMenu(menu: string) {
    if (menu === 'product') {
      this.isProductMenuOpen = !this.isProductMenuOpen;
      this.isCategoryMenuOpen = false; // Close other menus
    } else if (menu === 'category') {
      this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
      this.isProductMenuOpen = false; // Close other menus
    }
  }

  onLogOut() {
    this._authService.logOut();
  }
}
