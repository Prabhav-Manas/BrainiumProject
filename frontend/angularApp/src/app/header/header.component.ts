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

    // ----SideBars----
    // const toggleButton = document.getElementById('menu-toggle');
    // const wrapper = document.getElementById('wrapper');

    // toggleButton?.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   wrapper?.classList.toggle('toggled');
    // });
    // // ----SideBars----
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  closeSideNav() {
    this.collapsed = false;
  }

  toggleMenu(data: any) {
    if (data.subMenu) {
      data.open = !data.open;
    }
  }

  ngOnDestroy(): void {
    // this.authListenerSubs.unsubscribe();
  }

  onLogOut() {
    this._authService.logOut();
  }
}
