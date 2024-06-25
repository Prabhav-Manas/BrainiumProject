import { Component, OnInit } from '@angular/core';
import { AuthService } from '../appServices/auth.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})
export class SellerDashboardComponent implements OnInit {
  collapsed: boolean = false;
  isProductMenuOpen: boolean = false;
  isCategoryMenuOpen: boolean = false;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {}

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  closeSideNav() {
    this.collapsed = false;
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

  // Modal
}
