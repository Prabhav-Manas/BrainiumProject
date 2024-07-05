import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PageNotFoundService {
  private invalidUrl = environment.wildRoute;

  constructor(private http: HttpClient) {}

  getInvalidUrl() {
    // return this.http.get<any>(`${this.invalidUrl}`);
    return this.http.get<any>(this.invalidUrl).pipe(
      catchError((error) => {
        return throwError(error); // Pass the error through
      })
    );
  }
}
