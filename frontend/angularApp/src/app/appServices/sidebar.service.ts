import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isCollapsed = new BehaviorSubject<boolean>(false); // Default to false (not collapsed)
  isCollapsed$ = this._isCollapsed.asObservable(); // Observable for subscribers

  constructor() {}

  // Modify this function to accept the 'isCollapsed' argument
  toggleCollapse(isCollapsed: boolean) {
    this._isCollapsed.next(isCollapsed); // Emit the new value
  }
}
