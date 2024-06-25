import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/appServices/auth.service';
import { navBarData } from './nav-data';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = false;
  navData = navBarData;

  userIsAuthenticated: boolean = false;
  private authListenerSubs!: Subscription;
  isSeller: boolean = false;

  isProductMenuOpen: boolean = false;
  isCategoryMenuOpen: boolean = false;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this._authService.getIsAuth();
    this.isSeller = this._authService.getUserRole() === 'seller';

    this.authListenerSubs = this._authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        const userRole = this._authService.getUserRole();
        this.isSeller = userRole === 'seller';
      });
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  closeSideNav() {
    this.collapsed = false;
  }

  ngOnDestroy(): void {
    // this.authListenerSubs.unsubscribe();
  }
}
