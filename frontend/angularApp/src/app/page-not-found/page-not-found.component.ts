import { Component, OnInit } from '@angular/core';
import { PageNotFoundService } from '../appServices/page-not-found.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
})
export class PageNotFoundComponent implements OnInit {
  message: string = '';

  constructor(private _invalidURL: PageNotFoundService) {}

  ngOnInit(): void {
    this._invalidURL.getInvalidUrl().subscribe(
      (response) => {
        console.log('Invalid URL Response:', response);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.message = error.message;
          console.log('Invalid URL:=>', this.message);
          console.error('URL Error:', error.message);
        } else {
          this.message = 'An unexpected error occurred';
          console.error('Unexpected URL Error:', error);
        }
      }
    );
  }
}
