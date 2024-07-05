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
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {}
}
