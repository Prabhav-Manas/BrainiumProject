import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css'],
})
export class VerifyUserComponent implements OnInit {
  private baseUrl = 'http://localhost:8080/api/user';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email') || '';
    const token = this.route.snapshot.queryParamMap.get('token') || '';

    this.http
      .get(`${this.baseUrl}/verify`, { params: { email, token } })
      .subscribe(
        (res) => {
          alert('Email successfully verified');
          this.router.navigate(['/auth/signin']); // Navigate to logIn page after successful verification
        },
        (error) => {
          alert('Error verifying email');
        }
      );
  }
}
