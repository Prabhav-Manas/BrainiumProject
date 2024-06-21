import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../appServices/loader.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  loading: Observable<boolean> = of(false);

  constructor(public _loaderService: LoaderService) {
    this.loading = this._loaderService.isLoading();
  }

  ngOnInit(): void {}
}
